'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface Agent {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BUSY' | 'ERROR' | 'MAINTENANCE';
  lastActive?: Date;
  uptime: number;
  cpuUsage?: number;
  memoryUsage?: number;
  errorRate: number;
  tasksCompleted: number;
  avgResponseTime: number;
  successRate: number;
  tokensUsed: number;
  tokensCost: number;
  requestsCount: number;
  department?: string;
  role?: string;
  color: string;
}

interface SystemStats {
  totalAgents: number;
  activeAgents: number;
  totalTokens: number;
  totalCost: number;
  cpuUsage: number;
  memoryUsage: number;
  requestsCount: number;
  errorRate: number;
}

interface SalesMetrics {
  totalLeads: number;
  convertedLeads: number;
  totalRevenue: number;
  conversionRate: number;
}

export default function MissionControlDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalAgents: 0,
    activeAgents: 0,
    totalTokens: 0,
    totalCost: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    requestsCount: 0,
    errorRate: 0,
  });
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics>({
    totalLeads: 0,
    convertedLeads: 0,
    totalRevenue: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Mock data - replace with real API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockAgents: Agent[] = [
        {
          id: '1',
          name: 'CodeX',
          description: 'Mission Control & AI Operations',
          status: 'ACTIVE',
          lastActive: new Date(),
          uptime: 24.5,
          cpuUsage: 45,
          memoryUsage: 512,
          errorRate: 0.1,
          tasksCompleted: 156,
          avgResponseTime: 1.2,
          successRate: 99.9,
          tokensUsed: 45678,
          tokensCost: 12.34,
          requestsCount: 892,
          department: 'Operations',
          role: 'Mission Commander',
          color: '#3b82f6',
        },
        {
          id: '2',
          name: 'Pixel',
          description: 'Creative Design & Visual AI',
          status: 'ACTIVE',
          lastActive: new Date(),
          uptime: 18.2,
          cpuUsage: 67,
          memoryUsage: 768,
          errorRate: 0.2,
          tasksCompleted: 89,
          avgResponseTime: 2.8,
          successRate: 98.5,
          tokensUsed: 23456,
          tokensCost: 8.76,
          requestsCount: 456,
          department: 'Creative',
          role: 'Design Lead',
          color: '#8b5cf6',
        },
        {
          id: '3',
          name: 'Insight',
          description: 'Data Analysis & Strategy',
          status: 'BUSY',
          lastActive: new Date(),
          uptime: 12.7,
          cpuUsage: 78,
          memoryUsage: 1024,
          errorRate: 0.05,
          tasksCompleted: 234,
          avgResponseTime: 0.8,
          successRate: 99.5,
          tokensUsed: 67890,
          tokensCost: 23.45,
          requestsCount: 1234,
          department: 'Analytics',
          role: 'Data Scientist',
          color: '#10b981',
        },
      ];

      const activeAgents = mockAgents.filter(a => a.status === 'ACTIVE').length;
      const totalTokens = mockAgents.reduce((sum, a) => sum + a.tokensUsed, 0);
      const totalCost = mockAgents.reduce((sum, a) => sum + a.tokensCost, 0);
      const avgCpuUsage = mockAgents.reduce((sum, a) => sum + (a.cpuUsage || 0), 0) / mockAgents.length;
      const avgMemoryUsage = mockAgents.reduce((sum, a) => sum + (a.memoryUsage || 0), 0) / mockAgents.length;
      const totalRequests = mockAgents.reduce((sum, a) => sum + a.requestsCount, 0);
      const avgErrorRate = mockAgents.reduce((sum, a) => sum + a.errorRate, 0) / mockAgents.length;

      setAgents(mockAgents);
      setSystemStats({
        totalAgents: mockAgents.length,
        activeAgents,
        totalTokens,
        totalCost,
        cpuUsage: avgCpuUsage,
        memoryUsage: avgMemoryUsage,
        requestsCount: totalRequests,
        errorRate: avgErrorRate,
      });
      setSalesMetrics({
        totalLeads: 45,
        convertedLeads: 12,
        totalRevenue: 5678,
        conversionRate: 26.7,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'BUSY': return 'bg-yellow-500';
      case 'ERROR': return 'bg-red-500';
      case 'MAINTENANCE': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'BUSY': return 'Busy';
      case 'ERROR': return 'Error';
      case 'MAINTENANCE': return 'Maintenance';
      default: return 'Inactive';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading Mission Control...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mission Control Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time AI Agent Management & Monitoring</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.activeAgents}/{systemStats.totalAgents}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Token Usage</p>
                <p className="text-2xl font-bold text-gray-900">{(systemStats.totalTokens / 1000).toFixed(1)}K</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">${systemStats.totalCost.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sales Conversion</p>
                <p className="text-2xl font-bold text-gray-900">{salesMetrics.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agents List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Active Agents</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                        selectedAgent?.id === agent.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                            <p className="text-sm text-gray-600">{agent.role} • {agent.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{getStatusText(agent.status)}</p>
                          <p className="text-xs text-gray-500">{agent.uptime.toFixed(1)}h uptime</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Tasks</p>
                          <p className="font-medium">{agent.tasksCompleted}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Success</p>
                          <p className="font-medium">{agent.successRate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Cost</p>
                          <p className="font-medium">${agent.tokensCost.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Agent Details & System Health */}
          <div className="space-y-6">
            {/* Agent Details */}
            {selectedAgent && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Agent Details</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900">{selectedAgent.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-gray-900">{selectedAgent.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <p className="text-gray-900">{getStatusText(selectedAgent.status)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Response Time</label>
                      <p className="text-gray-900">{selectedAgent.avgResponseTime}s avg</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Active</label>
                      <p className="text-gray-900">{selectedAgent.lastActive?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Health */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">System Health</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-500">CPU Usage</span>
                      <span className="text-sm font-medium text-gray-900">{systemStats.cpuUsage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${systemStats.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-500">Memory Usage</span>
                      <span className="text-sm font-medium text-gray-900">{(systemStats.memoryUsage / 1024).toFixed(1)}GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(systemStats.memoryUsage / 2048) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-500">Error Rate</span>
                      <span className="text-sm font-medium text-gray-900">{(systemStats.errorRate * 100).toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${systemStats.errorRate * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}