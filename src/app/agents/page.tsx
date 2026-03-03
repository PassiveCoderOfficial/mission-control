'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AgentsPage() {
  const [agents, setAgents] = useState([
    { id: '1', name: 'XCoder', description: 'Full-stack dev for ExpertNear.Me', status: 'active' },
    { id: '2', name: 'VIDEO_EDITOR', description: 'Video editing specialist', status: 'active' },
    { id: '3', name: 'SALES_COPY', description: 'Writes sales copy and scripts', status: 'stopped' },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', description: '', systemPrompt: '' });

  const handleCreateAgent = () => {
    const created = {
      id: Date.now().toString(),
      name: newAgent.name,
      description: newAgent.description,
      status: 'stopped'
    };
    setAgents([...agents, created]);
    setShowCreateModal(false);
    setNewAgent({ name: '', description: '', systemPrompt: '' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">AI Agents</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Create Agent
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{agent.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{agent.description}</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200">
                  Start
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Agent Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Create New Agent</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Agent Name</label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="e.g., SEO_ASSISTANT"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={newAgent.description}
                    onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="What this agent does"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">System Prompt</label>
                  <textarea
                    value={newAgent.systemPrompt}
                    onChange={(e) => setNewAgent({...newAgent, systemPrompt: e.target.value})}
                    className="w-full px-3 py-2 border rounded h-32"
                    placeholder="You are a specialized agent that..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateAgent}
                    className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Create
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
      </div>
    </DashboardLayout>
  );
}