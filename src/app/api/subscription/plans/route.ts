import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all subscription plans
export async function GET() {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });

    return NextResponse.json({ success: true, data: plans });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

// POST - Create new subscription plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      type,
      price,
      currency = 'USD',
      agentsIncluded,
      tokensIncluded,
      websitesAllowed,
      whatsappNumbers,
      features,
      targetRegion,
      billingCycle,
      trialDays,
      isPopular
    } = body;

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        description,
        type,
        price,
        currency,
        agentsIncluded,
        tokensIncluded,
        websitesAllowed,
        whatsappNumbers,
        features: features ? JSON.stringify(features) : null,
        targetRegion,
        billingCycle,
        trialDays,
        isPopular
      }
    });

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create plan' },
      { status: 500 }
    );
  }
}
