import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';
    const agentId = searchParams.get('agentId');

    // Calculate time range
    const now = new Date();
    let startTime: Date;
    
    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Build where clause
    const whereClause: any = {
      timestamp: {
        gte: startTime,
      },
    };

    if (agentId) {
      whereClause.agentId = agentId;
    }

    // Fetch metrics
    const metrics = await prisma.agentMetric.findMany({
      where: whereClause,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            department: true,
            role: true,
            color: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 1000, // Limit to prevent too much data
    });

    // Fetch system stats
    const systemStats = await prisma.systemStat.findFirst({
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Fetch sales metrics
    const salesStats = await prisma.salesMetric.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
      _sum: {
        amount: true,
      },
    });

    // Calculate aggregate metrics
    const totalMetrics = metrics.length;
    const successfulMetrics = metrics.filter(m => m.status === 'SUCCESS').length;
    const errorMetrics = metrics.filter(m => m.status === 'ERROR').length;
    
    const avgResponseTime = successfulMetrics > 0
      ? metrics
          .filter(m => m.status === 'SUCCESS')
          .reduce((sum, m) => sum + m.responseTime, 0) / successfulMetrics
      : 0;
    
    const totalCost = metrics.reduce((sum, m) => sum + m.cost, 0);
    const totalTokens = metrics.reduce((sum, m) => sum + m.totalTokens, 0);
    const successRate = totalMetrics > 0 ? (successfulMetrics / totalMetrics) * 100 : 0;

    // Group by model
    const modelStats = metrics.reduce((acc, metric) => {
      const model = metric.model || 'unknown';
      if (!acc[model]) {
        acc[model] = {
          model,
          count: 0,
          successCount: 0,
          totalResponseTime: 0,
          totalCost: 0,
          totalTokens: 0,
        };
      }
      
      acc[model].count++;
      acc[model].totalResponseTime += metric.responseTime;
      acc[model].totalCost += metric.cost;
      acc[model].totalTokens += metric.totalTokens;
      
      if (metric.status === 'SUCCESS') {
        acc[model].successCount++;
      }
      
      return acc;
    }, {} as Record<string, any>);

    const formattedModelStats = Object.values(modelStats).map((stats: any) => ({
      model: stats.model,
      requestCount: stats.count,
      successCount: stats.successCount,
      successRate: stats.count > 0 ? (stats.successCount / stats.count) * 100 : 0,
      avgResponseTime: stats.successCount > 0 ? stats.totalResponseTime / stats.successCount : 0,
      totalCost: stats.totalCost,
      totalTokens: stats.totalTokens,
    }));

    return NextResponse.json({
      metrics,
      summary: {
        totalRequests: totalMetrics,
        successfulRequests: successfulMetrics,
        errorRequests: errorMetrics,
        avgResponseTime,
        totalCost,
        totalTokens,
        successRate,
      },
      systemStats,
      salesStats,
      modelStats: formattedModelStats,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['agentId', 'responseTime', 'totalTokens', 'cost', 'status'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new metric
    const metric = await prisma.agentMetric.create({
      data: {
        agentId: body.agentId,
        responseTime: body.responseTime,
        tokensIn: body.tokensIn || 0,
        tokensOut: body.tokensOut || 0,
        totalTokens: body.totalTokens,
        cost: body.cost,
        model: body.model,
        endpoint: body.endpoint,
        status: body.status,
        errorMessage: body.errorMessage,
        cpuUsage: body.cpuUsage,
        memoryUsage: body.memoryUsage,
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            department: true,
            role: true,
          },
        },
      },
    });

    // Update agent metrics
    await prisma.agent.update({
      where: { id: body.agentId },
      data: {
        lastActive: new Date(),
        requestsCount: {
          increment: 1,
        },
        tokensUsed: {
          increment: body.totalTokens,
        },
        tokensCost: {
          increment: body.cost,
        },
        tasksCompleted: body.status === 'SUCCESS' ? {
          increment: 1,
        } : undefined,
        errorRate: body.status === 'ERROR' ? {
          set: {
            // This is a simplified calculation - in production you'd want a more sophisticated approach
            increment: 1,
          },
        } : undefined,
        avgResponseTime: body.status === 'SUCCESS' ? {
          set: {
            // Recalculate average response time
            // This is simplified - in production you'd store totalResponseTime and totalCount
          },
        } : undefined,
      },
    });

    // Update system stats (simplified - in production you'd want to batch these updates)
    await prisma.systemStat.create({
      data: {
        requestsCount: 1,
        errorRate: body.status === 'ERROR' ? 1 : 0,
        responseTime: body.responseTime,
        totalTokens: body.totalTokens,
        totalCost: body.cost,
      },
    });

    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error creating metric:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}