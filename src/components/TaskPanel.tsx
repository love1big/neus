import React, { useState } from 'react';
import { CheckCircle, Circle, Trash2, Plus, AlertTriangle, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function TaskPanel() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Implement offline physics', completed: true },
    { id: '2', title: 'Connect AI mesh optimizer', completed: false },
    { id: '3', title: 'Fix animation retargeting bug', completed: false }
  ]);
  const [newTask, setNewTask] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), title: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    setTaskToDelete(null);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="flex-1 flex flex-col custom-scrollbar relative h-full bg-[#0d1117]">
      <div className="px-4 py-3 border-b border-[#30363d] text-[#c9d1d9]">
        <div className="flex justify-between items-center mb-2">
           <span className="font-bold text-[11px] uppercase tracking-wide">Project Tasks</span>
           <span className="text-[10px] font-mono text-[#8b949e]">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-[#161b22] h-1.5 rounded-full overflow-hidden">
           <motion.div 
             className="h-full bg-[#3fb950]" 
             initial={{ width: 0 }}
             animate={{ width: `${completionPercentage}%` }}
             transition={{ duration: 0.3 }}
           />
        </div>
      </div>
      <div className="p-2 pb-0 flex gap-2">
         <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add new task..." 
            className="flex-1 bg-[#161b22] border border-[#30363d] rounded px-2 py-1.5 text-[11px] outline-none text-[#fff]" 
         />
         <button onClick={addTask} className="bg-[#58a6ff] hover:bg-[#79c0ff] text-white p-1.5 rounded"><Plus size={14}/></button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 mt-2">
        <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {tasks.map(task => (
               <Reorder.Item
                 value={task}
                 key={task.id} 
                 initial={{ opacity: 0, scale: 0.9, y: 10 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                 transition={{ duration: 0.2 }}
                 className="bg-[#161b22] border border-[#30363d] p-2 flex gap-3 rounded items-center justify-between group hover:border-[#8b949e] transition-colors relative"
               >
               <div className="flex items-center gap-2 flex-1 cursor-grab active:cursor-grabbing">
                  <GripVertical size={14} className="text-[#484f58] shrink-0" />
                  <div className="flex items-center gap-2 flex-1" onClick={() => toggleTask(task.id)}>
                    {task.completed ? <CheckCircle size={14} className="text-[#3fb950] shrink-0 cursor-pointer" /> : <Circle size={14} className="text-[#8b949e] shrink-0 cursor-pointer" />}
                    <span className={`text-[11px] ${task.completed ? 'text-[#8b949e] line-through' : 'text-[#c9d1d9]'} cursor-pointer`}>{task.title}</span>
                  </div>
               </div>
               <button 
                  onClick={(e) => { e.stopPropagation(); setTaskToDelete(task.id); }}
                  className="text-[#f85149] opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#f85149]/20 rounded"
               >
                 <Trash2 size={12} />
               </button>
             </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
        {tasks.length === 0 && (
          <div className="text-center text-[#8b949e] text-[11px] italic mt-4">No tasks found.</div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {taskToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          >
             <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-[#161b22] border border-[#f85149] rounded-lg shadow-2xl p-4 max-w-[200px] w-full flex flex-col items-center text-center"
             >
              <AlertTriangle size={24} className="text-[#f85149] mb-2" />
              <h3 className="text-[#fff] text-[12px] font-bold mb-1">Delete Task?</h3>
              <p className="text-[#8b949e] text-[10px] mb-4">This action cannot be undone. You will permanently lose this task.</p>
              <div className="flex gap-2 w-full">
                 <button onClick={() => setTaskToDelete(null)} className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-white text-[11px] py-1.5 rounded font-semibold transition">Cancel</button>
                 <button onClick={() => deleteTask(taskToDelete)} className="flex-1 bg-[#f85149] hover:bg-[#ff7b72] text-white text-[11px] py-1.5 rounded font-semibold transition">Delete</button>
              </div>
           </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
