'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface AgentCard {
  id: string;
  name: string;
  type: 'sub-agent' | 'main-agent' | 'specialized';
  status: 'online' | 'offline' | 'busy' | 'error' | 'paused';
  priority: 'high' | 'medium' | 'low';
  progress: number;
  performance: number;
  task: string;
  assignedTo: string;
  tokensUsed: number;
  responseTime: number;
  errorRate: number;
  uptime: number;
}

const AgentKanbanBoard = () => {
  // Initial columns for the Kanban board
  const [columns, setColumns] = useState({
    'todo': {
      id: 'todo',
      title: 'To Do',
      color: 'bg-slate-500',
      agents: [
        {
          id: 'agent-1',
          name: 'Sales Copywriter',
          type: 'sub-agent',
          status: 'online',
          priority: 'high',
          progress: 0,
          performance: 95,
          task: 'Create landing page copy for new product',
          assignedTo: 'Marketing Team',
          tokensUsed: 1250,
          responseTime: 1.2,
          errorRate: 0.5,
          uptime: 99.8
        },
        {
          id: 'agent-2',
          name: 'Code Reviewer',
          type: 'specialized',
          status: 'online',
          priority: 'medium',
          progress: 0,
          performance: 88,
          task: 'Review pull request #123',
          assignedTo: 'Development Team',
          tokensUsed: 890,
          responseTime: 2.1,
          errorRate: 1.2,
          uptime: 98.5
        }
      ] as AgentCard[]
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-amber-500',
      agents: [
        {
          id: 'agent-3',
          name: 'Data Analyst',
          type: 'sub-agent',
          status: 'busy',
          priority: 'high',
          progress: 65,
          performance: 92,
          task: 'Analyze Q4 sales data',
          assignedTo: 'Analytics Team',
          tokensUsed: 2150,
          responseTime: 1.8,
          errorRate: 0.8,
          uptime: 99.2
        }
      ] as AgentCard[]
    },
    'review': {
      id: 'review',
      title: 'Review',
      color: 'bg-blue-500',
      agents: [
        {
          id: 'agent-4',
          name: 'Quality Assurance',
          type: 'specialized',
          status: 'online',
          priority: 'medium',
          progress: 85,
          performance: 96,
          task: 'Test new feature deployment',
          assignedTo: 'QA Team',
          tokensUsed: 1680,
          responseTime: 1.5,
          errorRate: 0.3,
          uptime: 99.9
        }
      ] as AgentCard[]
    },
    'completed': {
      id: 'completed',
      title: 'Completed',
      color: 'bg-green-500',
      agents: [
        {
          id: 'agent-5',
          name: 'Content Creator',
          type: 'sub-agent',
          status: 'online',
          priority: 'low',
          progress: 100,
          performance: 94,
          task: 'Write blog post about AI trends',
          assignedTo: 'Content Team',
          tokensUsed: 3200,
          responseTime: 2.3,
          errorRate: 0.2,
          uptime: 99.7
        }
      ] as AgentCard[]
    },
    'blocked': {
      id: 'blocked',
      title: 'Blocked',
      color: 'bg-red-500',
      agents: [] as AgentCard[]
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-amber-500';
      case 'offline': return 'bg-slate-500';
      case 'error': return 'bg-red-500';
      case 'paused': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-amber-500';
      case 'low': return 'border-green-500';
      default: return 'border-slate-300';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const onDragEnd = (result: any) => {
    // Implementation for drag and drop would go here
    // This is a placeholder for the drag and drop functionality
    console.log('Drag ended:', result);
  };

  return (
    <div className="space-y-6">
      {/* Kanban Board Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Agent Management Board</h2>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Agent
          </button>
          <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
            Filter
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="bg-white rounded-lg border border-slate-200">
              {/* Column Header */}
              <div className={`${column.color} text-white p-4 rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{column.title}</h3>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    {column.agents.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="p-4 space-y-4 min-h-[400px]"
                  >
                    {column.agents.map((agent, index) => (
                      <Draggable
                        key={agent.id}
                        draggableId={agent.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white border-2 ${getPriorityColor(agent.priority)} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move`}
                          >
                            {/* Agent Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 ${getStatusColor(agent.status)} rounded-full`}></div>
                                <h4 className="font-semibold text-slate-900">{agent.name}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityBadge(agent.priority)}`}>
                                  {agent.priority}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-500">
                                  {agent.type === 'sub-agent' ? 'SA' : agent.type === 'main-agent' ? 'MA' : 'SP'}
                                </span>
                              </div>
                            </div>

                            {/* Task Description */}
                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                              {agent.task}
                            </p>

                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                <span>Progress</span>
                                <span>{agent.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    agent.progress === 100 ? 'bg-green-500' : 
                                    agent.progress > 50 ? 'bg-blue-500' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${agent.progress}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Performance</span>
                                <span className="font-medium text-green-600">{agent.performance}%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Response</span>
                                <span className="font-medium text-blue-600">{agent.responseTime}s</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Tokens</span>
                                <span className="font-medium text-purple-600">{agent.tokensUsed}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Errors</span>
                                <span className="font-medium text-red-600">{agent.errorRate}%</span>
                              </div>
                            </div>

                            {/* Assigned To */}
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">Assigned to</span>
                                <span className="text-xs font-medium text-slate-700">{agent.assignedTo}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Quick Actions */}
      <div className="flex items-center justify-between mt-6 p-4 bg-slate-50 rounded-lg">
        <div className="text-sm text-slate-600">
          <strong>Total Agents:</strong> {Object.values(columns).reduce((sum, col) => sum + col.agents.length, 0)}
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm text-blue-600 hover:text-blue-700">View All Agents</button>
          <span className="text-slate-400">•</span>
          <button className="text-sm text-blue-600 hover:text-blue-700">Export Data</button>
          <span className="text-slate-400">•</span>
          <button className="text-sm text-blue-600 hover:text-blue-700">Settings</button>
        </div>
      </div>
    </div>
  );
};

export default AgentKanbanBoard;