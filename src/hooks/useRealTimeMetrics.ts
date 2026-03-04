import { useState, useEffect } from 'react';

interface UseRealTimeMetricsOptions {
  agentId?: string;
  timeRange?: string;
  refreshInterval?: number;
  enabled?: boolean;
}

interface MetricsData {
  metrics: any[];
  summary: {
    totalRequests: number;
    successfulRequests: number;
    errorRequests: number;
    avgResponseTime: number;
    totalCost: number;
    totalTokens: number;
    successRate: number;
  };
  systemStats: any;
  salesStats: any[];
  modelStats: any[];
}

export function useRealTimeMetrics(options: UseRealTimeMetricsOptions = {}) {
  const {
    agentId,
    timeRange = '24h',
    refreshInterval = 5000, // 5 seconds by default
    enabled = true,
  } = options;

  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    try {
      const params = new URLSearchParams();
      if (agentId) params.append('agentId', agentId);
      if (timeRange) params.append('timeRange', timeRange);

      const response = await fetch(`/api/metrics?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    fetchMetrics(); // Initial fetch

    const interval = setInterval(fetchMetrics, refreshInterval);

    return () => clearInterval(interval);
  }, [agentId, timeRange, refreshInterval, enabled]);

  const refetch = () => {
    setLoading(true);
    fetchMetrics();
  };

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch,
  };
}

// Hook for real-time agent status
export function useAgentStatus(agentId?: string) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agentId) return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}/status`);
        if (response.ok) {
          const agentStatus = await response.json();
          setStatus(agentStatus);
        }
      } catch (error) {
        console.error('Error fetching agent status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [agentId]);

  return { status, loading };
}

// Hook for real-time system health
export function useSystemHealth() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/system/health');
        if (response.ok) {
          const systemHealth = await response.json();
          setHealth(systemHealth);
        }
      } catch (error) {
        console.error('Error fetching system health:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return { health, loading };
}