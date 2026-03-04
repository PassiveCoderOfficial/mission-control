import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch billing overview and invoices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const period = searchParams.get('period'); // 'current', 'upcoming', 'past'

    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    if (period === 'current') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      where.periodStart = { gte: startOfMonth };
      where.periodEnd = { lte: endOfMonth };
    } else if (period === 'upcoming') {
      where.status = 'PENDING';
      where.dueDate = { gte: new Date() };
    } else if (period === 'past') {
      where.dueDate = { lt: new Date() };
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        subscription: {
          include: {
            customer: true,
            plan: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate billing overview
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const currentMonthInvoices = invoices.filter(inv => {
      return inv.periodStart >= startOfMonth && inv.periodEnd <= endOfMonth;
    });

    const currentMonthRevenue = currentMonthInvoices
      .filter(inv => inv.status === 'PAID')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const pendingInvoices = invoices.filter(inv => inv.status === 'PENDING');
    const overdueInvoices = invoices.filter(inv =>
      inv.status === 'PENDING' && inv.dueDate < new Date()
    );

    const overview = {
      currentMonth: {
        revenue: currentMonthRevenue,
        newSubscriptions: await prisma.subscription.count({
          where: {
            startDate: { gte: startOfMonth },
            status: { in: ['ACTIVE', 'TRIAL'] }
          }
        }),
        renewals: currentMonthInvoices.length,
        cancellations: await prisma.subscription.count({
          where: {
            status: 'CANCELLED',
            endDate: { gte: startOfMonth }
          }
        })
      },
      upcoming: {
        renewalsDue: pendingInvoices.length,
        expectedRevenue: pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0),
        atRiskSubscriptions: overdueInvoices.length
      },
      paymentMethods: await getPaymentMethodStats()
    };

    return NextResponse.json({
      success: true,
      data: {
        overview,
        invoices
      }
    });
  } catch (error) {
    console.error('Error fetching billing data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch billing data' },
      { status: 500 }
    );
  }
}

// POST - Generate monthly invoice for subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, amount, dueDate, description, items } = body;

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { plan: true, customer: true }
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${subscription.customerId.slice(0, 6)}`;

    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const invoice = await prisma.invoice.create({
      data: {
        subscriptionId,
        customerId: subscription.customerId,
        invoiceNumber,
        amount: amount || subscription.amount,
        currency: subscription.currency,
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        periodStart,
        periodEnd,
        status: 'PENDING',
        description,
        items: items ? JSON.stringify(items) : null
      }
    });

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}

// Helper function to get payment method statistics
async function getPaymentMethodStats() {
  const subscriptions = await prisma.subscription.findMany({
    where: { paymentMethod: { not: null } }
  });

  const stats = {
    stripe: 0,
    paypal: 0,
    binance: 0,
    bkash: 0,
    nagad: 0,
    bankTransfer: 0,
    other: 0
  };

  subscriptions.forEach(sub => {
    const method = sub.paymentMethod?.toLowerCase() || '';
    if (method.includes('stripe')) stats.stripe++;
    else if (method.includes('paypal')) stats.paypal++;
    else if (method.includes('binance')) stats.binance++;
    else if (method.includes('bkash')) stats.bkash++;
    else if (method.includes('nagad')) stats.nagad++;
    else if (method.includes('bank')) stats.bankTransfer++;
    else stats.other++;
  });

  return stats;
}
