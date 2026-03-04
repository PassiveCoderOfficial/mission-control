'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  timestamp: string;
  tokens: number;
  performance: number;
  responseTime: number;
  errorRate: number;
  activeAgents: number;
}

const RealTimeAnalytics = () => {
  // Real-time data simulation
  const [performanceData, setPerformanceData] = useState<AnalyticsData[]>([]);
  const [tokenData, setTokenData] = useState<AnalyticsData[]>([]);
  const [agentStatus, setAgentStatus] = useState({
    online: 0,
    busy: 0,
    offline: 0,
    error: 0
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timestamp = now.toLocaleTimeString();
      
      // Generate random but realistic data
      const newDataPoint: AnalyticsData = {
        timestamp,
        tokens: Math.floor(Math.random() * 5000) + 10000,
        performance: Math.floor(Math.random() * 10) + 90,
        responseTime: Math.random() * 2 + 0.5,
        errorRate: Math.random() * 2,
        activeAgents: Math.floor(Math.random() * 5) + 15
      };

      // Update performance data (keep last 20 data points)
      setPerformanceData(prev => {
        const newData = [...prev.slice(-19), newDataPoint];
        return newData;
      });

      // Update token data
      setTokenData(prev => {
        const newData = [...prev.slice(-19), newDataPoint];
        return newData;
      });

      // Update agent status
      setAgentStatus(prev => ({
        online: Math.max(12, prev.online + Math.floor(Math.random() * 3) - 1),
        busy: Math.max(2, prev.busy + Math.floor(Math.random() * 3) - 1),
        offline: Math.max(0, prev.offline + Math.floor(Math.random() * 3) - 1),
        error: Math.max(0, prev.error + Math.floor(Math.random() * 3) - 1)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Agent status distribution for pie chart
  const agentStatusData = [
    { name: 'Online', value: agentStatus.online, color: '#10B981' },
    { name: 'Busy', value: agentStatus.busy, color: '#F59E0B' },
    { name: 'Offline', value: agentStatus.offline, color: '#64748B' },
    { name: 'Error', value: agentStatus.error, color: '#EF4444' }
  ];

  // Mock token usage by agent type
  const tokenUsageData = [
    { name: 'Sub-Agents', tokens: 45000, cost: 450 },
    { name: 'Main Agents', tokens: 32000, cost: 320 },
    { name: 'Specialized', tokens: 18000, cost: 180 },
    { name: 'System', tokens: 5000, cost: 50 }
  ];

  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Real-Time Analytics</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">Live Data</span>
          </div>
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
            <option>Last 30 minutes</option>
            <option>Last hour</option>
            <option>Last 24 hours</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Active Agents</h3>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{agentStatus.online}</p>
          <p className="text-sm text-slate-500 mt-1">
            {agentStatus.busy} busy, {agentStatus.error} errors
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Token Usage</h3>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {performanceData.length > 0 ? 
              (performanceData[performanceData.length - 1]?.tokens / 1000).toFixed(1) + 'K' : 
              '0K'
            }
          </p>
          <p className="text-sm text-green-600 mt-1">
            +{Math.floor(Math.random() * 20 + 5)}% vs last hour
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Performance</h3>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {performanceData.length > 0 ? 
              performanceData[performanceData.length - 1]?.performance.toFixed(1) + '%' : 
              '0%'
            }
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Avg response: {performanceData.length > 0 ? 
              performanceData[performanceData.length - 1]?.responseTime.toFixed(1) + 's' : 
              '0s'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Error Rate</h3>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {performanceData.length > 0 ? 
              performanceData[performanceData.length - 1]?.errorRate.toFixed(1) + '%' : 
              '0%'
            }
          </p>
          <p className="text-sm text-red-600 mt-1">
            {parseFloat((performanceData.length > 0 ? 
              performanceData[performanceData.length - 1]?.errorRate.toFixed(1) : 
              '0')) > 1 ? 'Above threshold' : 'Normal'}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trend Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Performance Trend</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Performance %</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.split(':').slice(0, 2).join(':')}
                />
                <YAxis domain={[85, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="performance" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Token Usage Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Token Usage</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Tokens (K)</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tokenData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.split(':').slice(0, 2).join(':')}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Status Distribution */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Agent Status Distribution</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={agentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {agentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Token Usage by Agent Type */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Token Usage by Agent Type</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tokenUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="tokens" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Real-time Activity Feed</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-slate-900">
                <span className="font-medium">Data Analyst</span> completed task "Analyze Q4 sales data"
              </p>
              <p className="text-xs text-slate-500">2 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-slate-900">
                <span className="font-medium">Code Reviewer</span> is busy reviewing pull request #123
              </p>
              <p className="text-xs text-slate-500">5 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-slate-900">
                <span className="font-medium">Sales Copywriter</span> was assigned new task "Create landing page copy"
              </p>
              <p className="text-xs text-slate-500">8 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAnalytics;