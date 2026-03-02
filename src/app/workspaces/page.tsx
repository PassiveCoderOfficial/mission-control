"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { prisma } from "@/lib/db";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });
  const router = useRouter();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch("/api/workspaces");
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data);
      } else {
        setError("Failed to fetch workspaces");
      }
    } catch (err) {
      setError("Failed to fetch workspaces");
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await res.json();
        setShowForm(false);
        setFormData({
          name: "",
          slug: "",
        });
        fetchWorkspaces();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to add workspace");
      }
    } catch (err) {
      setError("Failed to add workspace");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#3b82f6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => {
              setError("");
              fetchWorkspaces();
            }}
            className="mt-4 px-4 py-2 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold text-gray-900">Mission Control</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors"
            >
              {showForm ? "Cancel" : "New Workspace"}
            </button>
          </div>
        </div>
      </header>

      {/* Add Workspace Form */}
      {showForm && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Create New Workspace</h2>
            
            <form onSubmit={handleAddWorkspace} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors"
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
        </div>
      )}

      {/* Workspaces List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace: any) => (
            <div
              key={workspace.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/workspace/${workspace.slug}`)}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{workspace.name}</h3>
              <div className="text-gray-500 text-sm mb-4">
                {workspace.projects.length} projects, {workspace.agents.length} agents, {workspace.members.length} members
              </div>
              <div className="flex space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-[#d1d5db] rounded-full">
                  {workspace.projects.length} Projects
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-[#d1d5db] rounded-full">
                  {workspace.agents.length} Agents
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}