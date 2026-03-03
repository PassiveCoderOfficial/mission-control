'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Build ExpertNear.Me homepage',
      description: 'Create a modern, responsive homepage with hero section and service cards',
      priority: 'high',
      status: 'in-progress',
      assignee: 'XCoder',
      dueDate: '2026-03-05',
      estimatedHours: 8,
      actualHours: 3.5,
      createdAt: '2026-03-01'
    },
    {
      id: '2',
      title: 'Set up NextAuth authentication',
      description: 'Configure NextAuth with credentials provider and bcrypt',
      priority: 'high',
      status: 'todo',
      assignee: 'XCoder',
      dueDate: '2026-03-03',
      estimatedHours: 4,
      actualHours: 0
    },
    {
      id: '3',
      title: 'Create mission control dashboard',
      description: 'Build mission control dashboard with Kanban board',
      priority: 'high',
      status: 'done',
      assignee: 'XCoder',
      dueDate: '2026-03-02',
      estimatedHours: 12,
      actualHours: 10
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignee: ''
  });

  const handleCreateTask = () => {
    const created = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: 'todo',
      assignee: newTask.assignee || 'Unassigned',
      dueDate: newTask.dueDate,
      estimatedHours: 0,
      actualHours: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks([...tasks, created]);
    setShowCreateModal(false);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', assignee: '' });
  };

  const handleUpdateTask = (id: string, updates: any) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Create Task
          </button>
        </div>

        {/* Task Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
            All Tasks ({tasks.length})
          </div>
          <div className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
            High Priority ({tasks.filter(t => t.priority === 'high').length})
          </div>
          <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">
            Medium Priority ({tasks.filter(t => t.priority === 'medium').length})
          </div>
          <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
            Low Priority ({tasks.filter(t => t.priority === 'low').length})
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border-2 border-transparent hover:border-blue-200 ${task.priority === 'high' ? 'border-red-200' : task.priority === 'medium' ? 'border-yellow-200' : 'border-green-200'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{task.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
              {task.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  {task.assignee && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                      {task.assignee}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                      {task.dueDate}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <span className="text-xs text-gray-500">
                    {task.actualHours || 0}h
                  </span>
                  <span className="text-xs text-gray-500">/
                    {task.estimatedHours || 0}h
                  </span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleUpdateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })}
                  className={`px-2 py-1 text-xs rounded ${task.status === 'done' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {task.status === 'done' ? 'Reopen' : 'Complete'}
                </button>
                <button
                  onClick={() => handleUpdateTask(task.id, { status: task.status === 'in-progress' ? 'todo' : 'in-progress' })}
                  className={`px-2 py-1 text-xs rounded ${task.status === 'in-progress' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {task.status === 'in-progress' ? 'Pause' : 'Start'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Task Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Create New Task</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="e.g., Build ExpertNear.Me homepage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded h-20"
                    placeholder="Detailed description of the task"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Assignee</label>
                  <input
                    type="text"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Agent or team member name"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateTask}
                    className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create Task
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