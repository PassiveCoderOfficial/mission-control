import { Paddle } from '@paddlejs/paddle-js';

class PaddleIntegration {
  private paddle: any;
  private initialized: boolean = false;

  constructor() {
    this.initializePaddle();
  }

  private async initializePaddle() {
    try {
      // Check if we're on the client side before accessing window.location
      const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || '';
      
      // Initialize Paddle with configuration
      this.paddle = await Paddle.Initialize({
        seller: process.env.PADDLE_SELLER_ID || 'your-seller-id',
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
        frameless: true,
        customSuccessUrl: `${origin}/subscription/success`,
        customCancelUrl: `${origin}/subscription/cancel`
      });
      this.initialized = true;
      console.log('Paddle initialized successfully');
    } catch (error) {
      console.error('Error initializing Paddle:', error);
      this.initialized = false;
    }
  }

  public async checkout(planId: string, customerId: string, billingCycle: 'monthly' | 'yearly') {
    if (!this.initialized) {
      await this.initializePaddle();
    }

    if (!this.paddle) {
      throw new Error('Paddle is not initialized');
    }

    try {
      // Get customer and plan details from our API
      const response = await fetch(`/api/subscription/plans/${planId}`);
      const plan = await response.json();

      const checkoutData = {
        items: [{
          priceId: plan.paddlePriceId, // This would be stored in your database
          quantity: 1
        }],
        customer: {
          email: plan.customerEmail, // From customer data
          name: plan.customerName
        },
        settings: {
          logo: '/logo.png',
          title: 'Passive Coder AI Agent Service',
          theme: 'light',
          itemsShow: true,
          allowPromoCodes: true
        },
        customData: {
          customerId,
          planId,
          billingCycle,
          businessName: plan.businessName,
          country: plan.country
        }
      };

      // Open checkout modal
      return await this.paddle.Checkout.open(checkoutData);
      
    } catch (error) {
      console.error('Error opening checkout:', error);
      throw error;
    }
  }

  public async updateSubscription(subscriptionId: string, newPlanId: string) {
    if (!this.initialized) {
      await this.initializePaddle();
    }

    if (!this.paddle) {
      throw new Error('Paddle is not initialized');
    }

    try {
      const response = await fetch(`/api/subscription/plans/${newPlanId}`);
      const plan = await response.json();

      // Get current subscription details
      const currentSubscription = await fetch(`/api/subscription/subscriptions/${subscriptionId}`);
      const currentData = await currentSubscription.json();

      const updateData = {
        subscriptionId: subscriptionId,
        items: [{
          priceId: plan.paddlePriceId,
          quantity: 1
        }],
        prorationPolicy: 'prorated'
      };

      return await this.paddle.Checkout.open(updateData);
      
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  public async cancelSubscription(subscriptionId: string, reason?: string) {
    if (!this.initialized) {
      await this.initializePaddle();
    }

    if (!this.paddle) {
      throw new Error('Paddle is not initialized');
    }

    try {
      const cancellationData = {
        subscriptionId: subscriptionId,
        immediateCancellation: false, // Cancel at end of billing period
        reason: reason || 'Customer requested cancellation'
      };

      return await this.paddle.Checkout.open(cancellationData);
      
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  public async retrieveSubscription(subscriptionId: string) {
    if (!this.initialized) {
      await this.initializePaddle();
    }

    if (!this.paddle) {
      throw new Error('Paddle is not initialized');
    }

    try {
      return await this.paddle.Subscription.retrieve(subscriptionId);
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      throw error;
    }
  }

  public async listSubscriptions(customerId: string) {
    if (!this.initialized) {
      await this.initializePaddle();
    }

    if (!this.paddle) {
      throw new Error('Paddle is not initialized');
    }

    try {
      return await this.paddle.Subscription.list({
        customer: customerId
      });
    } catch (error) {
      console.error('Error listing subscriptions:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const paddleIntegration = new PaddleIntegration();

// Service functions for easier usage
export class SubscriptionService {
  static async createSubscription(
    customerId: string, 
    planId: string, 
    billingCycle: 'monthly' | 'yearly',
    paymentMethod: string,
    additionalData?: Record<string, any>
  ) {
    try {
      const response = await fetch('/api/subscription/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          planId,
          billingCycle,
          paymentMethod,
          currency: additionalData?.currency || 'USD',
          ...additionalData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const subscription = await response.json();
      
      // Initialize Paddle checkout
      await paddleIntegration.checkout(planId, customerId, billingCycle);

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  static async updateSubscription(subscriptionId: string, newPlanId: string) {
    try {
      const response = await fetch(`/api/subscription/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: newPlanId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      const subscription = await response.json();
      
      // Initialize Paddle checkout for plan update
      await paddleIntegration.updateSubscription(subscriptionId, newPlanId);

      return subscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  static async cancelSubscription(subscriptionId: string, reason?: string) {
    try {
      const response = await fetch(`/api/subscription/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const subscription = await response.json();
      
      // Initialize Paddle cancellation
      await paddleIntegration.cancelSubscription(subscriptionId, reason);

      return subscription;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  static async getCustomerSubscriptions(customerId: string) {
    try {
      const response = await fetch(`/api/subscription/subscriptions?customerId=${customerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  }
}

// React hook for subscription management
export function useSubscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubscription = async (
    customerId: string,
    planId: string,
    billingCycle: 'monthly' | 'yearly',
    paymentMethod: string,
    additionalData?: Record<string, any>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      return await SubscriptionService.createSubscription(
        customerId,
        planId,
        billingCycle,
        paymentMethod,
        additionalData
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (subscriptionId: string, newPlanId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      return await SubscriptionService.updateSubscription(subscriptionId, newPlanId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId: string, reason?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      return await SubscriptionService.cancelSubscription(subscriptionId, reason);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCustomerSubscriptions = async (customerId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      return await SubscriptionService.getCustomerSubscriptions(customerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    getCustomerSubscriptions
  };
}