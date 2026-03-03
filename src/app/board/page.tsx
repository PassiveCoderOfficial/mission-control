'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialColumns = {
  'todo': {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: 'task-1', title: 'Design login UI', priority: 'high', assignee: 'Wali' },
      { id: 'task-2', title: 'Set up database', priority: 'medium', assignee: 'XCoder' },
    ]
  },
  'in-progress': {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      { id: 'task-3', title: 'Build drag-and-drop', priority: 'high', assignee: 'DEV_CORE' },
    ]
  },
  'review': {
    id: 'review',
    title: 'Review',
    tasks: []
  },
  'done': {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: 'task-4', title: 'Setup NextAuth', priority: 'high', assignee: 'XCoder' },
    ]
  }
};

export default function KanbanBoardPage() {
  const [columns, setColumns] = useState(initialColumns);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', description: '', systemPrompt: '' });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const source = result.source.droppableId;
    const dest = result.destination.droppableId;
    const taskId = result.draggableId;

    if (source === dest) return;

    const sourceCol = columns[source];
    const destCol = columns[dest];
    const task = sourceCol.tasks.find((t: any) => t.id === taskId);

    if (!task) return;

    const newSourceTasks = sourceCol.tasks.filter((t: any) => t.id !== taskId);
    const newDestTasks = [...destCol.tasks, task];

    setColumns({
      ...columns,
      [source]: { ...sourceCol, tasks: newSourceTasks },
      [dest]: { ...destCol, tasks: newDestTasks }
    });
  };

  const handleCreateAgent = () => {
    // For demo, just close modal and show success
    alert(`Agent "${newAgent.name}" created! (Demo)`);
    setShowAgentModal(false);
    setNewAgent({ name: '', description: '', systemPrompt: '' });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <button
          onClick={() => setShowAgentModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Create Agent
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.values(columns).map((col: any) => (
            <div key={col.id} className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-bold mb-4 text-gray-700">{col.title}</h3>
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] ${snapshot.isDraggingOver ? 'bg-gray-200' : ''}`}
                  >
                    {col.tasks.map((task: any, idx: number) => (
                      <Draggable key={task.id} draggableId={task.id} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-3 mb-2 rounded shadow ${snapshot.isDragging ? 'opacity-50' : ''}`}
                          >
                            <div className="font-medium">{task.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Priority: <span className={`font-bold ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>{task.priority}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Assignee: {task.assignee}
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

      {/* Agent Creation Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
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
                  onClick={() => setShowAgentModal(false)}
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