import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/agents - Fetch all agents with metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    const workspaceId = searchParams.get('workspaceId');

    const whereClause: any = {};

    if (status) {
      whereClause.status = status.toUpperCase();
    }

    if (department) {
      whereClause.department = department;
    }

    if (workspaceId) {
      whereClause.workspaceId = workspaceId;
    }

    const agents = await prisma.agent.findMany({
      where: whereClause,
      include: {
        metrics: {
          take: 100,
          orderBy: {
            timestamp: 'desc',
          },
        },
        salesMetrics: {
          take: 50,
          orderBy: {
            leadCreatedAt: 'desc',
          },
        },
        tokenSessions: {
          take: 20,
          orderBy: {
            startTime: 'desc',
          },
          where: {
            status: 'ACTIVE',
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        lastActive: 'desc',
      },
    });

    // Calculate derived metrics for each agent
    const enrichedAgents = agents.map(agent => {
      const recentMetrics = agent.metrics.slice(0, 10);
      const recentSales = agent.salesMetrics.slice(0, 10);

      const avgResponseTime = recentMetrics.length > 0
        ? recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length
        : 0;

      const recentSuccessRate = recentMetrics.length > 0
        ? (recentMetrics.filter(m => m.status === 'SUCCESS').length / recentMetrics.length) * 100
        : 100;

      const activeSessions = agent.tokenSessions.length;

      const totalRevenue = recentSales.reduce((sum, s) => sum + (s.amount || 0), 0);

      return {
        ...agent,
        derivedMetrics: {
          avgResponseTime,
          recentSuccessRate,
          activeSessions,
          totalRevenue,
        },
      };
    });

    return NextResponse.json(enrichedAgents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

// POST /api/agents - Create new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = ['name', 'workspaceId', 'systemPrompt'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const agent = await prisma.agent.create({
      data: {
        name: body.name,
        description: body.description,
        systemPrompt: body.systemPrompt,
        avatarUrl: body.avatarUrl,
        workspaceId: body.workspaceId,
        department: body.department,
        role: body.role,
        color: body.color || '#3b82f6',
        status: 'INACTIVE',
        healthCheckUrl: body.healthCheckUrl,
        monitoringLevel: body.monitoringLevel || 'BASIC',
      },
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
