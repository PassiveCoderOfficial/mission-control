import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateSubscriptionRequest {
  customerId: string;
  planId: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  paymentMethod: string;
  currency?: string;
}

interface SubscriptionResponse {
  id: string;
  status: string;
  planName: string;
  price: number;
  nextBillingDate: string;
  trialEndDate?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateSubscriptionRequest = await request.json();
    const { customerId, planId, billingCycle, paymentMethod, currency = 'USD' } = body;

    // Validate input
    if (!customerId || !planId || !billingCycle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get customer and plan details
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    });

    if (!plan || !plan.isActive) {
      return NextResponse.json({ error: 'Plan not found or inactive' }, { status: 404 });
    }

    // Create subscription in database
    const startDate = new Date();
    const trialEndDate = plan.trialDays > 0 
      ? new Date(startDate.getTime() + plan.trialDays * 24 * 60 * 60 * 1000)
      : undefined;
    
    const nextBillingDate = new Date(startDate);
    if (billingCycle === 'MONTHLY') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }

    const subscription = await prisma.subscription.create({
      data: {
        customerId,
        planId,
        status: trialEndDate ? 'TRIAL' : 'ACTIVE',
        startDate,
        nextBillingDate,
        trialEndDate,
        amount: plan.price,
        currency,
        paymentMethod,
        tokensUsed: 0,
        websitesDeployed: 0,
        whatsappNumbers: 0,
        activeAgents: 0,
        agentUsageHours: 0,
        leadsGenerated: 0,
        conversions: 0
      }
    });

    // Create initial deployment based on plan
    await createInitialDeployment(subscription, plan);

    // Initialize agent usage
    const agentCount = plan.agentsIncluded > 0 ? Math.min(plan.agentsIncluded, 3) : 1;
    for (let i = 0; i < agentCount; i++) {
      await prisma.agent.create({
        data: {
          name: `${plan.name} Agent ${i + 1}`,
          workspaceId: customer.id, // workspaceId references the customer's workspace
          systemPrompt: getDefaultSystemPrompt(plan.type),
          status: 'ACTIVE',
          department: getDepartmentForPlan(plan.type),
          role: getRoleForPlan(plan.type),
          color: getRandomColor(),
          uptime: 0,
          tasksCompleted: 0,
          successRate: 100,
          tokensUsed: 0,
          tokensCost: 0,
          requestsCount: 0,
          lastActive: new Date()
        }
      });
    }

    // Update customer subscription count
    await prisma.customer.update({
      where: { id: customerId },
      data: { 
        status: 'ACTIVE',
        updatedAt: new Date()
      }
    });

    // Update analytics
    await updateAnalytics();

    return NextResponse.json({
      id: subscription.id,
      status: subscription.status,
      planName: plan.name,
      price: plan.price,
      nextBillingDate: subscription.nextBillingDate.toISOString(),
      trialEndDate: subscription.trialEndDate?.toISOString()
    } as SubscriptionResponse);

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { customerId },
      include: {
        plan: true,
        customer: true,
        deployments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createInitialDeployment(subscription: any, plan: any) {
  // Create initial deployment based on plan type
  const deployment = await prisma.deployment.create({
    data: {
      subscriptionId: subscription.id,
      customerId: subscription.customerId,
      type: plan.type === 'COMPREHENSIVE' ? 'BOTH' : 
            plan.type === 'WEBSITE_AGENT' ? 'WEBSITE' : 'WHATSAPP',
      name: `${plan.name} Initial Deployment`,
      status: 'SETUP',
      deployedAt: new Date()
    }
  });

  // If website deployment, create placeholder website
  if (plan.type === 'WEBSITE_AGENT' || plan.type === 'COMPREHENSIVE') {
    // TODO: Implement website deployment logic
    // await createWebsiteDeployment(deployment);
  }

  // If WhatsApp deployment, setup WhatsApp integration
  if (plan.type === 'WHATSAPP_AGENT' || plan.type === 'COMPREHENSIVE') {
    // TODO: Implement WhatsApp deployment logic
    // await setupWhatsAppDeployment(deployment);
  }
}

function getDefaultSystemPrompt(type: string): string {
  switch (type) {
    case 'WEBSITE_AGENT':
      return 'You are an AI assistant for website visitors. Help them find information about products and services, answer their questions, and guide them through their journey.';
    case 'WHATSAPP_AGENT':
      return 'You are a WhatsApp assistant for customer communication. Handle inquiries, provide support, and help customers with their needs through WhatsApp messaging.';
    case 'COMPREHENSIVE':
      return 'You are a comprehensive AI assistant capable of handling multiple tasks including customer support, lead generation, and general inquiries.';
    default:
      return 'You are an AI assistant. Help users with their inquiries and provide excellent customer service.';
  }
}

function getDepartmentForPlan(type: string): string {
  switch (type) {
    case 'WEBSITE_AGENT':
      return 'Sales';
    case 'WHATSAPP_AGENT':
      return 'Support';
    case 'COMPREHENSIVE':
      return 'Operations';
    default:
      return 'General';
  }
}

function getRoleForPlan(type: string): string {
  switch (type) {
    case 'WEBSITE_AGENT':
      return 'Sales Assistant';
    case 'WHATSAPP_AGENT':
      return 'Support Agent';
    case 'COMPREHENSIVE':
      return 'Assistant Manager';
    default:
      return 'AI Assistant';
  }
}

function getRandomColor(): string {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  return colors[Math.floor(Math.random() * colors.length)];
}

async function updateAnalytics() {
  // Update subscription analytics
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  const currentAnalytics = await prisma.subscriptionAnalytics.findUnique({
    where: { date: new Date(todayString) }
  });

  const activeSubscriptions = await prisma.subscription.count({
    where: { status: { in: ['ACTIVE', 'TRIAL'] } }
  });

  const totalRevenue = await prisma.subscription.aggregate({
    where: { status: { in: ['ACTIVE', 'TRIAL'] } },
    _sum: { amount: true }
  });

  if (currentAnalytics) {
    await prisma.subscriptionAnalytics.update({
      where: { date: new Date(todayString) },
      data: {
        activeSubscriptions: activeSubscriptions,
        monthlyRevenue: totalRevenue._sum.amount || 0,
        averageRevenuePerSubscription: activeSubscriptions > 0 ? (totalRevenue._sum.amount || 0) / activeSubscriptions : 0
      }
    });
  } else {
    await prisma.subscriptionAnalytics.create({
      data: {
        date: new Date(todayString),
        activeSubscriptions,
        monthlyRevenue: totalRevenue._sum.amount || 0,
        averageRevenuePerSubscription: activeSubscriptions > 0 ? (totalRevenue._sum.amount || 0) / activeSubscriptions : 0
      }
    });
  }
}