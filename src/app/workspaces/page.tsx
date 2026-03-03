'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([
    {
      id: 'demo-1',
      name: 'Passive Coder',
      slug: 'passive-coder',
      projects: [],
      members: [],
      agents: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  const handleAddWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // For demo, just add to state
      const newWorkspace = {
        id: `demo-${Date.now()}`,
        name: formData.name,
        slug: formData.slug,
        projects: [],
        members: [],
        agents: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setWorkspaces([...workspaces, newWorkspace]);
      setFormData({ name: '', slug: '' });
      setShowForm(false);
    } catch (err) {
      setError('Failed to add workspace');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 mb-6 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              New Workspace
            </button>
          </div>
        </header>

        {/* Add Workspace Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Workspace</h2>
            
            <form onSubmit={handleAddWorkspace} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Create Workspace
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Workspaces List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace: any) => (
            <div
              key={workspace.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => window.open('/' + workspace.slug, '_blank')}
            >
              <h3 className="text-xl font-bold mb-2">{workspace.name}</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {workspace.projects.length} Projects
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  {workspace.agents.length} Agents
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                  {workspace.members.length} Members
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Click to enter workspace
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}