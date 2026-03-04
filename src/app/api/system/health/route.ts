import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // Get latest system stats
    const latestStats = await prisma.systemStat.findFirst({
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Get active agents count
    const activeAgents = await prisma.agent.count({
      where: {
        status: 'ACTIVE',
        lastActive: {
          gte: fiveMinutesAgo,
        },
      },
    });

    // Get total agents
    const totalAgents = await prisma.agent.count();

    // Get recent metrics (last 5 minutes)
    const recentMetrics = await prisma.agentMetric.findMany({
      where: {
        timestamp: {
          gte: fiveMinutesAgo,
        },
      },
    });

    // Calculate health metrics
    const totalRecentRequests = recentMetrics.length;
    const successfulRequests = recentMetrics.filter(m => m.status === 'SUCCESS').length;
    const errorRequests = recentMetrics.filter(m => m.status === 'ERROR').length;
    const errorRate = totalRecentRequests > 0 
      ? (errorRequests / totalRecentRequests) * 100 
      : 0;

    const avgResponseTime = successfulRequests > 0
      ? recentMetrics
          .filter(m => m.status === 'SUCCESS')
          .reduce((sum, m) => sum + m.responseTime, 0) / successfulRequests
      : 0;

    // Get latest sales metrics
    const recentSales = await prisma.salesMetric.findMany({
      where: {
        leadCreatedAt: {
          gte: fiveMinutesAgo,
        },
      },
    });

    // Check if system is healthy
    const isHealthy = errorRate < 5 && avgResponseTime < 5000 && activeAgents > 0;

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: now,
      metrics: {
        activeAgents,
        totalAgents,
        totalRecentRequests,
        successfulRequests,
        errorRequests,
        errorRate: parseFloat(errorRate.toFixed(2)),
        avgResponseTime: parseFloat(avgResponseTime.toFixed(2)),
        recentSalesCount: recentSales.length,
      },
      systemStats: latestStats,
      checks: {
        errorRate: errorRate < 5,
        responseTime: avgResponseTime < 5000,
        activeAgents: activeAgents > 0,
        database: true, // Assuming database is accessible if we get here
      },
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy',
        timestamp: new Date(),
        error: 'Internal Server Error',
        checks: {
          errorRate: false,
          responseTime: false,
          activeAgents: false,
          database: false,
        },
      },
      { status: 500 }
    );
  }
}