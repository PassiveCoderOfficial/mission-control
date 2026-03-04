import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const includeDetails = searchParams.get('details') === 'true';

    const now = new Date();
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get basic metrics
    const [agents, recentMetrics, systemStats, salesStats, pipelines] = await Promise.all([
      // Agent summary
      prisma.agent.findMany({
        select: {
          id: true,
          name: true,
          status: true,
          department: true,
          role: true,
          uptime: true,
          tasksCompleted: true,
          tokensUsed: true,
          tokensCost: true,
          lastActive: true,
          errorRate: true,
          avgResponseTime: true,
          successRate: true,
        },
      }),

      // Metrics from last 4 hours
      prisma.agentMetric.findMany({
        where: {
          timestamp: {
            gte: fourHoursAgo,
          },
        },
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              department: true,
            },
          },
        },
      }),

      // Latest system stats
      prisma.systemStat.findFirst({
        orderBy: {
          timestamp: 'desc',
        },
      }),

      // Sales metrics from last 24 hours
      prisma.salesMetric.findMany({
        where: {
          leadCreatedAt: {
            gte: twentyFourHoursAgo,
          },
        },
      }),

      // Pipeline data
      prisma.progressPipeline.findMany({
        include: {
          stages: {
            orderBy: {
              position: 'asc',
            },
          },
        },
      }),
    ]);

    // Calculate summary statistics
    const totalAgents = agents.length;
    const activeAgents = agents.filter(a => a.status === 'ACTIVE').length;
    
    const totalRequests = recentMetrics.length;
    const successfulRequests = recentMetrics.filter(m => m.status === 'SUCCESS').length;
    const errorRate = totalRequests > 0 
      ? ((totalRequests - successfulRequests) / totalRequests) * 100 
      : 0;

    const avgResponseTime = successfulRequests > 0
      ? recentMetrics
          .filter(m => m.status === 'SUCCESS')
          .reduce((sum, m) => sum + m.responseTime, 0) / successfulRequests
      : 0;

    const totalTokens = recentMetrics.reduce((sum, m) => sum + m.totalTokens, 0);
    const totalCost = recentMetrics.reduce((sum, m) => sum + m.cost, 0);

    // Sales summary
    const totalLeads = salesStats.length;
    const convertedLeads = salesStats.filter(s => s.status === 'CLOSED_WON').length;
    const totalRevenue = salesStats
      .filter(s => s.status === 'CLOSED_WON')
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // Agent performance breakdown
    const agentPerformance = agents.map(agent => {
      const agentMetrics = recentMetrics.filter(m => m.agentId === agent.id);
      const agentSuccessful = agentMetrics.filter(m => m.status === 'SUCCESS');
      
      return {
        id: agent.id,
        name: agent.name,
        department: agent.department,
        status: agent.status,
        requests: agentMetrics.length,
        successful: agentSuccessful.length,
        errorRate: agentMetrics.length > 0 
          ? ((agentMetrics.length - agentSuccessful.length) / agentMetrics.length) * 100 
          : 0,
        avgResponseTime: agentSuccessful.length > 0
          ? agentSuccessful.reduce((sum, m) => sum + m.responseTime, 0) / agentSuccessful.length
          : 0,
        tokensUsed: agentMetrics.reduce((sum, m) => sum + m.totalTokens, 0),
        cost: agentMetrics.reduce((sum, m) => sum + m.cost, 0),
        uptime: agent.uptime,
        lastActive: agent.lastActive,
      };
    });

    // Model performance
    const modelPerformance = recentMetrics.reduce((acc, metric) => {
      const model = metric.model || 'unknown';
      if (!acc[model]) {
        acc[model] = {
          model,
          requests: 0,
          successful: 0,
          totalResponseTime: 0,
          totalTokens: 0,
          totalCost: 0,
        };
      }
      
      acc[model].requests++;
      acc[model].totalResponseTime += metric.responseTime;
      acc[model].totalTokens += metric.totalTokens;
      acc[model].totalCost += metric.cost;
      
      if (metric.status === 'SUCCESS') {
        acc[model].successful++;
      }
      
      return acc;
    }, {} as Record<string, any>);

    const formattedModelPerformance = Object.values(modelPerformance).map((stats: any) => ({
      model: stats.model,
      requests: stats.requests,
      successful: stats.successful,
      successRate: stats.requests > 0 ? (stats.successful / stats.requests) * 100 : 0,
      avgResponseTime: stats.successful > 0 ? stats.totalResponseTime / stats.successful : 0,
      totalTokens: stats.totalTokens,
      totalCost: stats.totalCost,
    }));

    const report = {
      generatedAt: now,
      period: {
        start: fourHoursAgo,
        end: now,
        duration: '4 hours',
      },
      summary: {
        totalAgents,
        activeAgents,
        totalRequests,
        successfulRequests,
        errorRate: parseFloat(errorRate.toFixed(2)),
        avgResponseTime: parseFloat(avgResponseTime.toFixed(2)),
        totalTokens,
        totalCost: parseFloat(totalCost.toFixed(4)),
        systemHealth: {
          cpuUsage: systemStats?.cpuUsage || 0,
          memoryUsage: systemStats?.memoryUsage || 0,
          uptime: systemStats?.uptime || 0,
        },
      },
      sales: {
        totalLeads,
        convertedLeads,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        conversionRate: parseFloat(conversionRate.toFixed(2)),
      },
      agentPerformance,
      modelPerformance: formattedModelPerformance,
      pipelines: pipelines.map(pipeline => ({
        id: pipeline.id,
        name: pipeline.name,
        description: pipeline.description,
        stages: pipeline.stages.map(stage => ({
          id: stage.id,
          name: stage.name,
          itemCount: stage.itemCount,
          value: stage.value,
          color: stage.color,
        })),
      })),
    };

    // Add detailed metrics if requested
    if (includeDetails) {
      (report as any).detailedMetrics = recentMetrics;
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeaders = [
        'Timestamp',
        'Agent',
        'Model',
        'Status',
        'Response Time',
        'Tokens',
        'Cost',
        'Endpoint',
      ];
      
      const csvRows = recentMetrics.map(metric => [
        metric.timestamp,
        metric.agent?.name || '',
        metric.model || '',
        metric.status,
        metric.responseTime,
        metric.totalTokens,
        metric.cost,
        metric.endpoint || '',
      ]);
      
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="mission-control-report-${now.toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}