import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { GripVertical, Plus, Loader2} from 'lucide-react';

export type TaskStatus = 'To-Do' | 'In-Progress' | 'QA' | 'Done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  type: string;
}

const INITIAL_COLUMNS: TaskStatus[] = ['To-Do', 'In-Progress', 'QA', 'Done'];

export default function TaskStatusBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [columns, setColumns] = useState<TaskStatus[]>(INITIAL_COLUMNS);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      });
  }, []);

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id && id === draggedTaskId) {
      updateTaskStatus(id, status);
    }
    setDraggedTaskId(null);
  };

  const createNewTask = async () => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      title: "New Undelegated Task",
      status: "To-Do",
      type: "task"
    };

    setTasks(prev => [...prev, newTask]);

    try {
      await fetch(`/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
    } catch (err) {
      console.error("Error creating new task:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0f111a]">
        <Loader2 className="animate-spin text-[#58a6ff] w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0f111a] flex flex-col p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Project Task Board
          </h1>
          <p className="text-xs text-gray-500 mt-1">Drag and drop tasks to update their status</p>
        </div>
        <button onClick={createNewTask} className="bg-[#3fb950] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-bold transition-colors">
          <Plus size={14} /> New Task
        </button>
      </div>

      <Reorder.Group axis="x" values={columns} onReorder={setColumns} className="flex-1 flex gap-4 overflow-x-auto pb-4 custom-scrollbar px-2">
        {columns.map(column => {
          const columnTasks = tasks.filter(t => t.status === column);
          return (
            <Reorder.Item 
              key={column}
              value={column}
              className="flex-shrink-0 w-80 bg-[#161b22] border border-[#30363d] rounded-lg flex flex-col overflow-hidden transition-colors cursor-grab active:cursor-grabbing"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e as unknown as React.DragEvent, column)}
            >
              <div className="bg-[#21262d] px-4 py-3 border-b border-[#30363d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <GripVertical size={14} className="text-gray-500" />
                   <span className="text-sm font-bold text-gray-200 pointer-events-none">
                     {column}
                   </span>
                </div>
                <span className="bg-[#30363d] text-gray-300 text-xs px-2 py-0.5 rounded-full font-mono pointer-events-none">
                  {columnTasks.length}
                </span>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-[200px]" onPointerDown={(e) => e.stopPropagation()}>
                <AnimatePresence>
                  {columnTasks.map(task => (
                    <motion.div
                      layout
                      layoutId={task.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task.id)}
                      onDragEnd={() => setDraggedTaskId(null)}
                      className={`bg-[#0d1117] border border-[#30363d] p-3 rounded-md shadow-sm cursor-grab hover:border-gray-500 transition-colors ${draggedTaskId === task.id ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm text-gray-200 leading-snug">{task.title}</p>
                          <div className="flex items-center gap-2 mt-3 text-xs">
                             <span className="text-gray-500 font-mono">#{task.id}</span>
                             {task.type === 'bug' ? (
                                <span className="bg-red-500/10 text-red-400 px-1.5 rounded font-medium border border-red-500/20 text-[10px]">Bug</span>
                             ) : task.type === 'feature' ? (
                                <span className="bg-blue-500/10 text-blue-400 px-1.5 rounded font-medium border border-blue-500/20 text-[10px]">Feature</span>
                             ) : (
                                <span className="bg-gray-500/10 text-gray-400 px-1.5 rounded font-medium border border-gray-500/20 text-[10px]">Task</span>
                             )}
                          </div>
                        </div>
                        <GripVertical size={16} className="text-gray-600 shrink-0" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {columnTasks.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-2 border-2 border-dashed border-[#30363d] rounded-md pointer-events-none">
                    <span className="text-xs font-medium">Drop tasks here</span>
                  </div>
                )}
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
}
