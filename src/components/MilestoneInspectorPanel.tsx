import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Plus, Trash2, CheckCircle, Circle, AlignLeft, ListTodo, ShieldCheck, Activity, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  timestamp: number;
  status: 'completed' | 'in-progress' | 'pending';
  dependencies?: string[];
  description?: string;
  subTasks?: SubTask[];
}

interface MilestoneInspectorPanelProps {
  milestone: Milestone;
  onUpdate: (updatedMilestone: Milestone) => void;
  onClose: () => void;
}

export default function MilestoneInspectorPanel({ milestone, onUpdate, onClose }: MilestoneInspectorPanelProps) {
  const [editedMilestone, setEditedMilestone] = useState<Milestone>(milestone);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  // Sync state if milestone prop changes (e.g. clicked another node)
  useEffect(() => {
    setEditedMilestone(milestone);
  }, [milestone]);

  const handleSave = () => {
    onUpdate(editedMilestone);
    onClose();
  };

  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim()) return;
    const newTask: SubTask = {
      id: Math.random().toString(36).substring(2, 9),
      title: newSubTaskTitle.trim(),
      completed: false
    };
    setEditedMilestone(prev => ({
      ...prev,
      subTasks: [...(prev.subTasks || []), newTask]
    }));
    setNewSubTaskTitle('');
  };

  const handleToggleSubTask = (taskId: string) => {
    setEditedMilestone(prev => ({
      ...prev,
      subTasks: prev.subTasks?.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
  };

  const handleDeleteSubTask = (taskId: string) => {
    setEditedMilestone(prev => ({
      ...prev,
      subTasks: prev.subTasks?.filter(t => t.id !== taskId)
    }));
  };

  const progressPercent = useMemo(() => {
    if (!editedMilestone.subTasks || editedMilestone.subTasks.length === 0) return 0;
    const completed = editedMilestone.subTasks.filter(t => t.completed).length;
    return Math.round((completed / editedMilestone.subTasks.length) * 100);
  }, [editedMilestone.subTasks]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed right-0 top-[60px] bottom-0 w-[400px] bg-[#161b22] border-l border-[#30363d] shadow-2xl flex flex-col z-[100]"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#30363d] bg-[#0d1117]">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            editedMilestone.status === 'completed' ? 'bg-[#238636]/20 text-[#3fb950] border border-[#238636]/50' :
            editedMilestone.status === 'in-progress' ? 'bg-[#d29922]/20 text-[#d29922] border border-[#d29922]/50' :
            'bg-[#30363d]/50 text-[#8b949e] border border-[#30363d]'
          }`}>
            {editedMilestone.status === 'completed' ? <ShieldCheck size={16} /> :
             editedMilestone.status === 'in-progress' ? <Activity size={16} /> :
             <Clock size={16} />}
          </div>
          <div>
            <h3 className="text-white font-bold text-[14px]">Inspect Milestone</h3>
            <p className="text-[#8b949e] text-[11px] uppercase tracking-wide">{editedMilestone.status}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-[#8b949e] hover:text-white hover:bg-[#30363d] transition">
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {/* Title Edit */}
        <div className="mb-6">
          <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wide mb-2 block">Milestone Title</label>
          <input
            type="text"
            value={editedMilestone.title}
            onChange={e => setEditedMilestone({ ...editedMilestone, title: e.target.value })}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[14px] text-white focus:outline-none focus:border-[#58a6ff] transition"
          />
        </div>

        {/* Status Edit */}
        <div className="mb-6">
          <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wide mb-2 block">Status</label>
          <div className="flex gap-2">
            {(['pending', 'in-progress', 'completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setEditedMilestone({ ...editedMilestone, status })}
                className={`flex-1 py-1.5 rounded-md text-[12px] font-bold border transition capitalize ${
                  editedMilestone.status === status
                    ? (status === 'completed' ? 'bg-[#238636]/20 border-[#3fb950] text-[#3fb950]' :
                       status === 'in-progress' ? 'bg-[#d29922]/20 border-[#d29922] text-[#d29922]' :
                       'bg-[#21262d] border-[#8b949e] text-white')
                    : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-[#8b949e]'
                }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlignLeft size={14} className="text-[#8b949e]" />
            <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wide">Description</label>
          </div>
          <textarea
            value={editedMilestone.description || ''}
            onChange={e => setEditedMilestone({ ...editedMilestone, description: e.target.value })}
            placeholder="Add a more detailed description..."
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[13px] text-[#c9d1d9] min-h-[100px] resize-y focus:outline-none focus:border-[#58a6ff] transition placeholder:text-[#484f58]"
          />
        </div>

        {/* Sub-Tasks */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListTodo size={14} className="text-[#8b949e]" />
              <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wide">Action Items</label>
            </div>
            {editedMilestone.subTasks && editedMilestone.subTasks.length > 0 && (
              <span className="text-[11px] font-bold text-[#58a6ff] bg-[#1f6feb]/10 px-2 py-0.5 rounded-full border border-[#1f6feb]/30">
                {progressPercent}% Done
              </span>
            )}
          </div>
          
          {/* Sub-task List */}
          <div className="space-y-2 mb-3">
            <AnimatePresence>
              {editedMilestone.subTasks?.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 group"
                >
                  <button 
                    onClick={() => handleToggleSubTask(task.id)}
                    className="mt-0.5 shrink-0 text-[#8b949e] hover:text-[#58a6ff] transition"
                  >
                    {task.completed ? <CheckCircle size={16} className="text-[#3fb950]" /> : <Circle size={16} />}
                  </button>
                  <span className={`flex-1 text-[13px] ${task.completed ? 'text-[#8b949e] line-through' : 'text-[#c9d1d9]'}`}>
                    {task.title}
                  </span>
                  <button 
                    onClick={() => handleDeleteSubTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#8b949e] hover:text-[#f85149] transition shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {(!editedMilestone.subTasks || editedMilestone.subTasks.length === 0) && (
              <div className="text-[12px] text-[#484f58] italic py-2 text-center border border-dashed border-[#30363d] rounded-md">
                No action items defined.
              </div>
            )}
          </div>

          {/* Add Sub-task */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubTaskTitle}
              onChange={e => setNewSubTaskTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddSubTask()}
              placeholder="Add new sub-task..."
              className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-[12px] text-white focus:outline-none focus:border-[#58a6ff] transition placeholder:text-[#484f58]"
            />
            <button
              onClick={handleAddSubTask}
              disabled={!newSubTaskTitle.trim()}
              className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded-md text-[#c9d1d9] hover:bg-[#30363d] hover:text-white transition disabled:opacity-50"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex justify-end gap-2 shrink-0">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-[#21262d] text-[#8b949e] font-bold text-[12px] hover:text-white border border-[#30363d] transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-md bg-[#238636] text-white font-bold text-[12px] flex items-center gap-2 hover:bg-[#2ea043] transition"
        >
          <Save size={14} /> Apply Changes
        </button>
      </div>
    </motion.div>
  );
}
