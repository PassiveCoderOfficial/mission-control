'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useRealTimeMetrics, useAgentStatus, useSystemHealth } from '@/hooks/useRealTimeMetrics';

interface Agent {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BUSY' | 'ERROR' | 'MAINTENANCE';
  department?: string;
  role?: string;
  color: string;
  uptime: number;
  tasksCompleted: number;
  avgResponseTime: number;
  successRate: number;
  tokensUsed: number;
  tokensCost: number;
  requestsCount: number;
  errorRate: number;
  lastActive?: Date;
  systemPrompt?: string;
  monitoringLevel: 'BASIC' | 'DETAILED' | 'CRITICAL';
}

export default function EnhancedAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCommandModal, setShowCommandModal] = useState(false);
  const [command, setCommand] = useState('');
  const { data: metrics } = useRealTimeMetrics({ refreshInterval: 10000 });
  const { health: systemHealth } = useSystemHealth();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      if (response.ok) {
        const data = await response.json();
        setAgents(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      setLoading(false);
    }
  };

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

  const handleAgentAction = async (agentId: string, action: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        fetchAgents(); // Refresh agents list
      }
    } catch (error) {
      console.error('Error performing agent action:', error);
    }
  };

  const handleSendCommand = async () => {
    if (!selectedAgent || !command.trim()) return;

    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      if (response.ok) {
        setShowCommandModal(false);
        setCommand('');
        // Show success message or command response
      }
    } catch (error) {
      console.error('Error sending command:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading Agents...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Sub-Agent Management</h1>
            <p className="text-gray-600 mt-2">Monitor and control AI agents in real-time</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              systemHealth?.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                systemHealth?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium">
                {systemHealth?.status === 'healthy' ? 'System Healthy' : 'System Alert'}
              </span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Create Agent
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.summary.successfulRequests > 0 ? agents.filter(a => a.status === 'ACTIVE').length : 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.summary.totalRequests.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.summary.successRate.toFixed(1)}%</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.summary.totalCost.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agents Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Active Agents</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                        selectedAgent?.id === agent.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: agent.color }}
                          ></div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                            <p className="text-sm text-gray-600">{agent.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                          <span className="text-xs font-medium text-gray-500">
                            {getStatusText(agent.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Tasks:</span>
                          <span className="ml-1 font-medium">{agent.tasksCompleted}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Success:</span>
                          <span className="ml-1 font-medium">{agent.successRate.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Response:</span>
                          <span className="ml-1 font-medium">{agent.avgResponseTime.toFixed(1)}s</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Cost:</span>
                          <span className="ml-1 font-medium">${agent.tokensCost.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAgentAction(agent.id, agent.status === 'ACTIVE' ? 'stop' : 'start');
                            }}
                            className={`px-2 py-1 text-xs rounded ${
                              agent.status === 'ACTIVE' 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {agent.status === 'ACTIVE' ? 'Stop' : 'Start'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCommandModal(true);
                            }}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Command
                          </button>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          agent.monitoringLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                          agent.monitoringLevel === 'DETAILED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {agent.monitoringLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Agent Details */}
          <div className="space-y-6">
            {selectedAgent && (
              <>
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Agent Details</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900">{selectedAgent.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Department</label>
                      <p className="text-gray-900">{selectedAgent.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <p className="text-gray-900">{selectedAgent.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedAgent.status)}`}></div>
                        <p className="text-gray-900">{getStatusText(selectedAgent.status)}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Uptime</label>
                      <p className="text-gray-900">{selectedAgent.uptime.toFixed(1)} hours</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Active</label>
                      <p className="text-gray-900">
                        {selectedAgent.lastActive ? selectedAgent.lastActive.toLocaleString() : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Performance</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Tasks Completed</span>
                      <span className="text-gray-900">{selectedAgent.tasksCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Success Rate</span>
                      <span className="text-gray-900">{selectedAgent.successRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Avg Response Time</span>
                      <span className="text-gray-900">{selectedAgent.avgResponseTime.toFixed(1)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Error Rate</span>
                      <span className="text-gray-900">{(selectedAgent.errorRate * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Tokens Used</span>
                      <span className="text-gray-900">{selectedAgent.tokensUsed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Total Cost</span>
                      <span className="text-gray-900">${selectedAgent.tokensCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Command Modal */}
      {showCommandModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Send Command to {selectedAgent.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Command</label>
                <textarea
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="w-full px-3 py-2 border rounded h-32"
                  placeholder="Enter command or message for the agent..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSendCommand}
                  className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Send Command
                </button>
                <button
                  onClick={() => {
                    setShowCommandModal(false);
                    setCommand('');
                  }}
                  className="flex-1 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Agent Modal - Simplified for now */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Create New Agent</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Agent Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., ANALYST_AGENT"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Create Agent
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}