import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all subscriptions with details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');

    const where: any = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        customer: true,
        plan: true,
        deployments: true,
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

// POST - Create new subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      planId,
      startDate,
      trialEndDate,
      amount,
      currency = 'USD',
      paymentMethod
    } = body;

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      );
    }

    const subscription = await prisma.subscription.create({
      data: {
        customerId,
        planId,
        status: trialEndDate ? 'TRIAL' : 'ACTIVE',
        startDate: startDate ? new Date(startDate) : new Date(),
        trialEndDate: trialEndDate ? new Date(trialEndDate) : null,
        nextBillingDate: trialEndDate
          ? new Date(trialEndDate)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        amount: amount || plan.price,
        currency: currency || plan.currency,
        paymentMethod,
        tokensUsed: 0,
        websitesDeployed: 0,
        whatsappNumbers: 0,
        activeAgents: 0,
        leadsGenerated: 0,
        conversions: 0
      },
      include: {
        customer: true,
        plan: true
      }
    });

    return NextResponse.json({ success: true, data: subscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
