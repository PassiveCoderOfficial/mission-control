import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
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
      }
    });
    return NextResponse.json(workspaces);
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

    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error('Error creating workspace:', error);
    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    );
  }
}