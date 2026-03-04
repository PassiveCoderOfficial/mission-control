'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AgentKanbanBoard from '@/components/AgentKanbanBoard';
import RealTimeAnalytics from '@/components/RealTimeAnalytics';
import SalesPipeline from '@/components/SalesPipeline';
import ProgressTracking from '@/components/ProgressTracking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EnhancedDashboardPage() {
  // Real-time metrics state
  const [metrics, setMetrics] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalTokens: 0,
    activeProjects: 0,
    systemPerformance: 0,
    uptime: 0,
    salesPipeline: 0,
    completedTasks: 0
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalTokens: prev.totalTokens + Math.floor(Math.random() * 100),
        systemPerformance: Math.min(100, Math.max(85, prev.systemPerformance + (Math.random() - 0.5) * 2)),
        uptime: Math.min(99.9, prev.uptime + 0.001)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Mission Control Dashboard</h1>
            <p className="text-slate-600 mt-2">Project Management + AI Monitoring Platform</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Updates</span>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Agents */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Agents</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{metrics.totalAgents}</p>
                <p className="text-sm text-blue-600 mt-2">
                  {metrics.activeAgents} active
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Token Usage */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Token Usage</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">
                  {(metrics.totalTokens / 1000).toFixed(1)}K
                </p>
                <p className="text-sm text-purple-600 mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Live
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* System Performance */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">System Performance</p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {metrics.systemPerformance.toFixed(1)}%
                </p>
                <p className="text-sm text-green-600 mt-2">
                  {metrics.uptime.toFixed(1)}% uptime
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sales Pipeline */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Sales Pipeline</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">
                  ${metrics.salesPipeline.toLocaleString()}
                </p>
                <p className="text-sm text-orange-600 mt-2">
                  {metrics.completedTasks} tasks completed
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <Tabs defaultValue="agents" className="p-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="agents">Agent Management</TabsTrigger>
              <TabsTrigger value="analytics">Real-Time Analytics</TabsTrigger>
              <TabsTrigger value="sales">Sales Pipeline</TabsTrigger>
              <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            </TabsList>
            
            <TabsContent value="agents" className="mt-6">
              <AgentKanbanBoard />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <RealTimeAnalytics />
            </TabsContent>
            
            <TabsContent value="sales" className="mt-6">
              <SalesPipeline />
            </TabsContent>
            
            <TabsContent value="progress" className="mt-6">
              <ProgressTracking />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}