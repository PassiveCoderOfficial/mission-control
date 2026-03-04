'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface AgentMetric {
  id: string;
  agentId: string;
  responseTime: number;
  timestamp: Date;
  tokensIn: number;
  tokensOut: number;
  totalTokens: number;
  cost: number;
  model?: string;
  endpoint?: string;
  status: 'SUCCESS' | 'ERROR' | 'TIMEOUT' | 'RATE_LIMITED';
  errorMessage?: string;
  cpuUsage?: number;
  memoryUsage?: number;
}

interface PipelineData {
  id: string;
  name: string;
  description?: string;
  color: string;
  stages: {
    id: string;
    name: string;
    itemCount: number;
    value?: number;
    color: string;
  }[];
}

export default function StatisticsPage() {
  const [metrics, setMetrics] = useState<AgentMetric[]>([]);
  const [pipelineData, setPipelineData] = useState<PipelineData[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call for metrics
    setTimeout(() => {
      const mockMetrics: AgentMetric[] = Array.from({ length: 50 }, (_, i) => ({
        id: `metric-${i}`,
        agentId: ['1', '2', '3'][Math.floor(Math.random() * 3)],
        responseTime: Math.random() * 5000 + 500,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7),
        tokensIn: Math.floor(Math.random() * 1000) + 100,
        tokensOut: Math.floor(Math.random() * 2000) + 200,
        totalTokens: Math.floor(Math.random() * 3000) + 300,
        cost: Math.random() * 0.1 + 0.01,
        model: ['gpt-4', 'gpt-3.5-turbo', 'claude-3'][Math.floor(Math.random() * 3)],
        endpoint: ['chat', 'completion', 'embedding'][Math.floor(Math.random() * 3)],
        status: ['SUCCESS', 'ERROR', 'TIMEOUT', 'RATE_LIMITED'][Math.floor(Math.random() * 4)] as any,
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 2048,
      }));

      const mockPipelines: PipelineData[] = [
        {
          id: '1',
          name: 'Sales Pipeline',
          description: 'Lead to Customer Journey',
          color: '#3b82f6',
          stages: [
            { id: '1', name: 'Leads', itemCount: 45, color: '#e5e7eb' },
            { id: '2', name: 'Qualified', itemCount: 23, color: '#fef3c7' },
            { id: '3', name: 'Proposal', itemCount: 12, color: '#dbeafe' },
            { id: '4', name: 'Negotiation', itemCount: 6, color: '#e0e7ff' },
            { id: '5', name: 'Closed Won', itemCount: 3, color: '#d1fae5' },
          ],
        },
        {
          id: '2',
          name: 'Development Pipeline',
          description: 'Project Development Stages',
          color: '#8b5cf6',
          stages: [
            { id: '1', name: 'Backlog', itemCount: 28, color: '#e5e7eb' },
            { id: '2', name: 'In Progress', itemCount: 12, color: '#fef3c7' },
            { id: '3', name: 'Review', itemCount: 8, color: '#dbeafe' },
            { id: '4', name: 'Testing', itemCount: 4, color: '#e0e7ff' },
            { id: '5', name: 'Deployed', itemCount: 15, color: '#d1fae5' },
          ],
        },
      ];

      setMetrics(mockMetrics);
      setPipelineData(mockPipelines);
      setLoading(false);
    }, 1000);
  }, [selectedTimeRange]);

  const calculateStats = () => {
    const successful = metrics.filter(m => m.status === 'SUCCESS');
    const errors = metrics.filter(m => m.status === 'ERROR');
    const avgResponseTime = successful.length > 0 
      ? successful.reduce((sum, m) => sum + m.responseTime, 0) / successful.length 
      : 0;
    const totalCost = metrics.reduce((sum, m) => sum + m.cost, 0);
    const totalTokens = metrics.reduce((sum, m) => sum + m.totalTokens, 0);
    const successRate = metrics.length > 0 
      ? (successful.length / metrics.length) * 100 
      : 0;

    return {
      totalRequests: metrics.length,
      successfulRequests: successful.length,
      errorRequests: errors.length,
      avgResponseTime,
      totalCost,
      totalTokens,
      successRate,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading Statistics...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Statistics & Analytics</h1>
            <p className="text-gray-600 mt-2">Detailed performance metrics and AI analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-green-600">
                ↑ {stats.successRate.toFixed(1)}% success rate
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime.toFixed(0)}ms</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {stats.errorRequests} errors
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Token Usage</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.totalTokens / 1000).toFixed(0)}K</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                ${(stats.totalCost).toFixed(2)} cost
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Models</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                GPT-4, Claude-3, GPT-3.5
              </p>
            </div>
          </div>
        </div>

        {/* Pipeline Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {pipelineData.map((pipeline) => (
            <div key={pipeline.id} className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{pipeline.name}</h2>
                <p className="text-gray-600 text-sm">{pipeline.description}</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {pipeline.stages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center space-x-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{stage.name}</span>
                          <span className="text-sm font-medium text-gray-600">{stage.itemCount} items</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${(stage.itemCount / Math.max(...pipeline.stages.map(s => s.itemCount))) * 100}%`,
                              backgroundColor: pipeline.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Model Performance */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Model Performance</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {['gpt-4', 'gpt-3.5-turbo', 'claude-3'].map((model) => {
                const modelMetrics = metrics.filter(m => m.model === model);
                const successCount = modelMetrics.filter(m => m.status === 'SUCCESS').length;
                const avgResponse = modelMetrics.length > 0 
                  ? modelMetrics.reduce((sum, m) => sum + m.responseTime, 0) / modelMetrics.length 
                  : 0;
                const successRate = modelMetrics.length > 0 
                  ? (successCount / modelMetrics.length) * 100 
                  : 0;

                return (
                  <div key={model} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{model.toUpperCase()}</h3>
                      <p className="text-sm text-gray-600">{modelMetrics.length} requests</p>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div>
                        <p className="text-sm text-gray-500">Success Rate</p>
                        <p className="font-medium text-gray-900">{successRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Avg Response</p>
                        <p className="font-medium text-gray-900">{avgResponse.toFixed(0)}ms</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Cost</p>
                        <p className="font-medium text-gray-900">
                          ${modelMetrics.reduce((sum, m) => sum + m.cost, 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}