import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // For MVP demo: return mock data if DB not ready
    try {
      const workspaces = await prisma.workspace.findMany({
        include: {
          projects: {
            include: {
              boards: {
                include: {
                  columns: true,
                  tasks: true
                }
              }
            }
          },
          members: true,
          agents: true
        },
      });
      
      if (workspaces.length === 0) {
        // Return mock data for demo
        return NextResponse.json([
          {
            id: 'demo-1',
            name: 'Passive Coder',
            slug: 'passive-coder',
            projects: [],
            members: [],
            agents: []
          }
        ]);
      }
      
      return NextResponse.json(workspaces);
    } catch (dbError) {
      console.error('DB error, returning mock data:', dbError);
      // Return mock data if DB isn't set up yet
      return NextResponse.json([
        {
          id: 'demo-1',
          name: 'Passive Coder',
          slug: 'passive-coder',
          projects: [],
          members: [],
          agents: []
        }
      ]);
    }
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workspaces' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // For MVP demo: don't actually create, just return the input
    const workspace = {
      id: `demo-${Date.now()}`,
      name,
      slug,
      projects: [],
      members: [],
      agents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error('Error creating workspace:', error);
    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    );
  }
}