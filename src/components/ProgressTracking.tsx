'use client';

import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: string;
  endDate: string;
  assignedTo: string;
  tasks: Task[];
  budget: number;
  spent: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed' | 'blocked';
  assignee: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
}

const ProgressTracking = () => {
  // Mock projects data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'project-1',
      name: 'Mission Control Dashboard',
      description: 'Comprehensive project management and AI monitoring platform',
      status: 'active',
      priority: 'high',
      progress: 75,
      startDate: '2024-02-01',
      endDate: '2024-03-15',
      assignedTo: 'Development Team',
      tasks: [
        {
          id: 'task-1-1',
          title: 'Design System Implementation',
          description: 'Create comprehensive design system and component library',
          status: 'completed',
          assignee: 'UI/UX Designer',
          dueDate: '2024-02-15',
          estimatedHours: 40,
          actualHours: 35
        },
        {
          id: 'task-1-2',
          title: 'Agent Management System',
          description: 'Trello-style kanban board for agent management',
          status: 'in-progress',
          assignee: 'Frontend Developer',
          dueDate: '2024-03-05',
          estimatedHours: 60,
          actualHours: 45
        },
        {
          id: 'task-1-3',
          title: 'Real-Time Analytics',
          description: 'Implement live data visualization and monitoring',
          status: 'in-progress',
          assignee: 'Full Stack Developer',
          dueDate: '2024-03-10',
          estimatedHours: 80,
          actualHours: 55
        }
      ],
      budget: 50000,
      spent: 37500
    },
    {
      id: 'project-2',
      name: 'ExpertNear.Me Platform',
      description: 'Directory SaaS platform for service providers',
      status: 'active',
      priority: 'critical',
      progress: 45,
      startDate: '2024-01-15',
      endDate: '2024-04-30',
      assignedTo: 'Platform Team',
      tasks: [
        {
          id: 'task-2-1',
          title: 'Database Schema Design',
          description: 'Design and implement database schema for directory platform',
          status: 'completed',
          assignee: 'Database Architect',
          dueDate: '2024-02-10',
          estimatedHours: 30,
          actualHours: 28
        },
        {
          id: 'task-2-2',
          title: 'User Authentication',
          description: 'Implement secure user authentication and authorization',
          status: 'in-progress',
          assignee: 'Backend Developer',
          dueDate: '2024-03-15',
          estimatedHours: 50,
          actualHours: 35
        }
      ],
      budget: 120000,
      spent: 54000
    },
    {
      id: 'project-3',
      name: 'SEO Optimization Tool',
      description: 'Advanced SEO analysis and optimization platform',
      status: 'planning',
      priority: 'medium',
      progress: 10,
      startDate: '2024-03-01',
      endDate: '2024-05-31',
      assignedTo: 'Marketing Tech Team',
      tasks: [
        {
          id: 'task-3-1',
          title: 'Market Research',
          description: 'Research SEO tools market and identify key features',
          status: 'todo',
          assignee: 'Product Manager',
          dueDate: '2024-03-15',
          estimatedHours: 20,
          actualHours: 0
        }
      ],
      budget: 75000,
      spent: 7500
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'on-hold': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'border-green-500';
      case 'medium': return 'border-amber-500';
      case 'high': return 'border-orange-500';
      case 'critical': return 'border-red-500';
      default: return 'border-slate-300';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-amber-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const averageProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length;

  return (
    <div className="space-y-8">
      {/* Progress Tracking Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Progress Tracking</h2>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            New Project
          </button>
          <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
            View Timeline
          </button>
        </div>
      </div>

      {/* Project Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Total Projects</h3>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalProjects}</p>
          <p className="text-sm text-slate-500 mt-1">
            {activeProjects} active
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Budget Status</h3>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalBudget)}</p>
          <p className="text-sm text-amber-600 mt-1">
            {formatCurrency(totalSpent)} spent
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Average Progress</h3>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{averageProgress.toFixed(1)}%</p>
          <p className="text-sm text-green-600 mt-1">
            On track
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Tasks Completed</h3>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {projects.reduce((sum, p) => sum + p.tasks.filter(t => t.status === 'completed').length, 0)}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            of {projects.reduce((sum, p) => sum + p.tasks.length, 0)} total tasks
          </p>
        </div>
      </div>

      {/* Projects Timeline */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Projects Timeline</h3>
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="border-l-4 pl-6 py-4" style={{ borderColor: getPriorityColor(project.priority).replace('border-', '') }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-slate-900">{project.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {project.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                      {project.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{project.description}</p>
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <span>📅 {project.startDate} - {project.endDate}</span>
                    <span>👥 {project.assignedTo}</span>
                    <span>💰 {formatCurrency(project.budget)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{project.progress}%</div>
                  <div className="text-sm text-slate-500">Complete</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${getProgressColor(project.progress)}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                  <span>Budget</span>
                  <span>{formatCurrency(project.spent)} / {formatCurrency(project.budget)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${(project.spent / project.budget) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Tasks Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-sm text-slate-600 mb-1">Total Tasks</div>
                  <div className="text-lg font-semibold text-slate-900">{project.tasks.length}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm text-green-600 mb-1">Completed</div>
                  <div className="text-lg font-semibold text-green-900">
                    {project.tasks.filter(t => t.status === 'completed').length}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-blue-600 mb-1">In Progress</div>
                  <div className="text-lg font-semibold text-blue-900">
                    {project.tasks.filter(t => t.status === 'in-progress').length}
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3">
                  <div className="text-sm text-amber-600 mb-1">Pending</div>
                  <div className="text-lg font-semibold text-amber-900">
                    {project.tasks.filter(t => t.status === 'todo' || t.status === 'blocked').length}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Tasks View */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">All Tasks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Task</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Project</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Assignee</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Due Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Hours</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {projects.flatMap(project => 
                project.tasks.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-slate-900">{task.title}</p>
                        <p className="text-sm text-slate-500">{task.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-900">{project.name}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-900">{task.assignee}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-900">{task.dueDate}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-900">{task.actualHours}h / {task.estimatedHours}h</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${task.estimatedHours > 0 ? Math.min(100, (task.actualHours / task.estimatedHours) * 100) : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600">
                          {task.estimatedHours > 0 ? Math.round(Math.min(100, (task.actualHours / task.estimatedHours) * 100)) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
        <div className="text-sm text-slate-600">
          <strong>Total Projects:</strong> {totalProjects} | 
          <strong> Budget Used:</strong> {Math.round((totalSpent / totalBudget) * 100)}%
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm text-blue-600 hover:text-blue-700">Add Project</button>
          <span className="text-slate-400">•</span>
          <button className="text-sm text-blue-600 hover:text-blue-700">Export Report</button>
          <span className="text-slate-400">•</span>
          <button className="text-sm text-blue-600 hover:text-blue-700">View Gantt Chart</button>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;