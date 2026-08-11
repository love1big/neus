import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  BarChart as BarChartIcon, PieChart as PieChartIcon, LayoutDashboard, Kanban, List, Filter, Plus, AlertCircle, 
  CheckCircle2, Circle, MoreVertical, Search, Tag, Hash, 
  ArrowUpRight, ArrowDownRight, Activity, Trash2, GripVertical, 
  Bug, Flame, Milestone, ArrowRight, CheckSquare, SlidersHorizontal, Download
} from 'lucide-react';

const sprintVelocityData = [
  { sprint: 'Sprint 1', completed: 45, expected: 50 },
  { sprint: 'Sprint 2', completed: 52, expected: 50 },
  { sprint: 'Sprint 3', completed: 48, expected: 50 },
  { sprint: 'Sprint 4', completed: 61, expected: 55 },
  { sprint: 'Sprint 5', completed: 58, expected: 55 },
];

const taskDistributionData = [
  { name: 'Frontend', value: 400, color: '#58a6ff' },
  { name: 'Backend', value: 300, color: '#3fb950' },
  { name: 'Art/Design', value: 200, color: '#bc8cff' },
  { name: 'Bugs', value: 150, color: '#f85149' },
];

const completionRateData = [
  { day: 'Mon', done: 5, added: 2 },
  { day: 'Tue', done: 8, added: 3 },
  { day: 'Wed', done: 12, added: 1 },
  { day: 'Thu', done: 15, added: 4 },
  { day: 'Fri', done: 22, added: 2 },
];

const mockKanbanTasks = [
  { id: 'TASK-101', title: 'Implement Offline Physics Engine', status: 'IN_PROGRESS', priority: 'High', type: 'Feature', points: 8, assignee: 'Alex', tags: ['Backend', 'Core'] },
  { id: 'TASK-102', title: 'Fix Animation Retargeting Bug', status: 'TODO', priority: 'Critical', type: 'Bug', points: 3, assignee: 'Sam', tags: ['Animation'] },
  { id: 'TASK-103', title: 'Design Skill Tree UI', status: 'IN_REVIEW', priority: 'Medium', type: 'Design', points: 5, assignee: 'Jordan', tags: ['UI/UX'] },
  { id: 'TASK-104', title: 'Setup CI/CD Pipeline', status: 'DONE', priority: 'High', type: 'Ops', points: 5, assignee: 'Alex', tags: ['DevOps'] },
  { id: 'TASK-105', title: 'Add Particle System for Magic', status: 'IN_PROGRESS', priority: 'Medium', type: 'Feature', points: 5, assignee: 'Taylor', tags: ['VFX'] },
];

export default function TaskPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kanban' | 'backlog'>('dashboard');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Activity className="text-[#e3b341]" size={20} />
            Agile Project Hub
          </div>
          <div className="h-6 w-[1px] bg-[#30363d] mx-2"></div>
          <div className="flex gap-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${activeTab === 'dashboard' ? 'bg-[#21262d] text-white border border-[#30363d]' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-white'}`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${activeTab === 'kanban' ? 'bg-[#21262d] text-white border border-[#30363d]' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-white'}`}
            >
              <Kanban size={16} /> Kanban Board
            </button>
            <button 
              onClick={() => setActiveTab('backlog')}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${activeTab === 'backlog' ? 'bg-[#21262d] text-white border border-[#30363d]' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-white'}`}
            >
              <List size={16} /> Backlog
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors">
            <Download size={14} /> Export
          </button>
          <button className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors">
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'dashboard' && (
          <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-sm">
                <div className="text-[#8b949e] text-xs font-semibold uppercase tracking-wider mb-2 flex justify-between">
                  Sprint Progress <Activity size={14} className="text-[#3fb950]" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">68%</div>
                <div className="w-full bg-[#0d1117] h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#3fb950] h-full w-[68%] rounded-full"></div>
                </div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-sm">
                <div className="text-[#8b949e] text-xs font-semibold uppercase tracking-wider mb-2 flex justify-between">
                  Active Issues <Bug size={14} className="text-[#f85149]" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">24</div>
                <div className="text-xs text-[#f85149] flex items-center gap-1">
                  <ArrowUpRight size={12} /> +3 since yesterday
                </div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-sm">
                <div className="text-[#8b949e] text-xs font-semibold uppercase tracking-wider mb-2 flex justify-between">
                  Story Points Done <Flame size={14} className="text-[#e3b341]" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">112 <span className="text-sm font-normal text-[#8b949e]">/ 150</span></div>
                <div className="text-xs text-[#8b949e] flex items-center gap-1">
                  On track for delivery
                </div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-sm">
                <div className="text-[#8b949e] text-xs font-semibold uppercase tracking-wider mb-2 flex justify-between">
                  Team Velocity <Milestone size={14} className="text-[#bc8cff]" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">56 <span className="text-sm font-normal text-[#8b949e]">pts/sprint</span></div>
                <div className="text-xs text-[#3fb950] flex items-center gap-1">
                  <ArrowUpRight size={12} /> +12% vs last sprint
                </div>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-2 gap-6">
              {/* Velocity Chart */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
                <h3 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
                  <BarChartIcon size={16} className="text-[#58a6ff]" /> Sprint Velocity
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sprintVelocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                      <XAxis dataKey="sprint" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '8px' }} 
                        itemStyle={{ color: '#fff' }} 
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="expected" fill="#30363d" name="Expected Points" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" fill="#58a6ff" name="Completed Points" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Task Distribution */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col">
                <h3 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
                  <PieChartIcon size={16} className="text-[#bc8cff]" /> Task Distribution by Category
                </h3>
                <div className="flex-1 flex items-center justify-center">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {taskDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '8px', border: '1px solid #30363d' }} 
                          itemStyle={{ color: '#fff', fontSize: '12px' }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-3 ml-4 shrink-0">
                    {taskDistributionData.map((entry, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-xs text-[#c9d1d9]">{entry.name}</span>
                        <span className="text-xs font-bold text-white ml-auto">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <h3 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
                <Activity size={16} className="text-[#3fb950]" /> Completion Rate vs Added Tasks (Weekly)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={completionRateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3fb950" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3fb950" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f85149" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f85149" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis dataKey="day" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '8px' }} 
                      itemStyle={{ color: '#fff' }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Area type="monotone" dataKey="done" stroke="#3fb950" fillOpacity={1} fill="url(#colorDone)" name="Tasks Completed" />
                    <Area type="monotone" dataKey="added" stroke="#f85149" fillOpacity={1} fill="url(#colorAdded)" name="New Tasks Added" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kanban' && (
          <div className="p-6 h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" size={14} />
                  <input type="text" placeholder="Filter tasks..." className="bg-[#161b22] border border-[#30363d] text-sm text-white rounded-md pl-9 pr-3 py-1.5 focus:outline-none focus:border-[#58a6ff] w-64" />
                </div>
                <button className="bg-[#161b22] border border-[#30363d] hover:bg-[#30363d] text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors">
                  <Filter size={14} /> Assignee
                </button>
                <button className="bg-[#161b22] border border-[#30363d] hover:bg-[#30363d] text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors">
                  <Tag size={14} /> Labels
                </button>
              </div>
              <div className="flex gap-2">
                <button className="bg-[#161b22] border border-[#30363d] hover:bg-[#30363d] text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors">
                  <SlidersHorizontal size={14} /> Group by: Status
                </button>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="flex-1 flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map(status => (
                <div key={status} className="w-[300px] shrink-0 flex flex-col bg-[#0d1117] rounded-xl border border-[#30363d] overflow-hidden">
                  <div className="p-3 border-b border-[#30363d] flex justify-between items-center bg-[#161b22]">
                    <div className="flex items-center gap-2">
                      {status === 'TODO' && <Circle size={14} className="text-[#8b949e]" />}
                      {status === 'IN_PROGRESS' && <Activity size={14} className="text-[#e3b341]" />}
                      {status === 'IN_REVIEW' && <CheckSquare size={14} className="text-[#bc8cff]" />}
                      {status === 'DONE' && <CheckCircle2 size={14} className="text-[#3fb950]" />}
                      <span className="font-bold text-sm text-white capitalize">{status.replace('_', ' ')}</span>
                      <span className="bg-[#30363d] text-[#c9d1d9] text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {mockKanbanTasks.filter(t => t.status === status).length}
                      </span>
                    </div>
                    <button className="text-[#8b949e] hover:text-white"><Plus size={16} /></button>
                  </div>
                  
                  <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar bg-[#090c10]">
                    {mockKanbanTasks.filter(t => t.status === status).map(task => (
                      <div key={task.id} className="bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] transition-colors rounded-lg p-3 shadow-sm cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono text-[#8b949e]">{task.id}</span>
                          <button className="opacity-0 group-hover:opacity-100 text-[#8b949e] hover:text-white"><MoreVertical size={14}/></button>
                        </div>
                        <h4 className="text-sm font-semibold text-white leading-tight mb-3">{task.title}</h4>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.map(tag => (
                            <span key={tag} className="bg-[#30363d] text-[#c9d1d9] text-[9px] px-1.5 py-0.5 rounded font-medium">
                              {tag}
                            </span>
                          ))}
                          {task.priority === 'Critical' && (
                            <span className="bg-[#f85149]/20 text-[#f85149] text-[9px] px-1.5 py-0.5 rounded font-bold border border-[#f85149]/30 flex items-center gap-1">
                              <AlertCircle size={8} /> Critical
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-[#30363d]">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-[#58a6ff] flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                              {task.assignee.charAt(0)}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-[#8b949e] bg-[#21262d] px-1.5 py-0.5 rounded">
                            <Hash size={10} /> {task.points}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="w-full text-left p-2 rounded-md border border-dashed border-[#30363d] text-[#8b949e] text-xs hover:text-white hover:border-[#8b949e] hover:bg-[#161b22] transition-colors flex items-center gap-2">
                      <Plus size={14} /> Add Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'backlog' && (
          <div className="p-8 max-w-6xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   <List className="text-[#58a6ff]" /> Product Backlog
                </h2>
                <div className="flex gap-2">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" size={14} />
                      <input type="text" placeholder="Search backlog..." className="bg-[#161b22] border border-[#30363d] text-sm text-white rounded-md pl-9 pr-3 py-1.5 focus:outline-none focus:border-[#58a6ff] w-64" />
                   </div>
                   <button className="bg-[#58a6ff] hover:bg-[#79c0ff] text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors">
                      <Plus size={14} /> Create Issue
                   </button>
                </div>
             </div>

             <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-[#30363d] bg-[#21262d] text-[#8b949e] text-xs uppercase tracking-wider">
                         <th className="p-3 w-10 text-center"><input type="checkbox" className="rounded border-[#30363d] bg-[#0d1117] accent-[#58a6ff] w-3 h-3" /></th>
                         <th className="p-3 w-24">ID</th>
                         <th className="p-3">Title</th>
                         <th className="p-3 w-28">Status</th>
                         <th className="p-3 w-28">Priority</th>
                         <th className="p-3 w-32">Assignee</th>
                         <th className="p-3 w-20 text-center">Points</th>
                         <th className="p-3 w-16"></th>
                      </tr>
                   </thead>
                   <tbody className="text-sm">
                      {mockKanbanTasks.concat([
                         { id: 'TASK-106', title: 'Refactor Network Serialization', status: 'TODO', priority: 'High', type: 'Tech Debt', points: 13, assignee: 'Alex', tags: ['Netcode'] },
                         { id: 'TASK-107', title: 'Update Controller Mappings', status: 'TODO', priority: 'Low', type: 'Feature', points: 2, assignee: 'Unassigned', tags: ['Input'] },
                         { id: 'TASK-108', title: 'Optimize Texture Memory', status: 'TODO', priority: 'Medium', type: 'Optimization', points: 8, assignee: 'Taylor', tags: ['Graphics'] },
                      ]).map((task, i) => (
                         <tr key={i} className="border-b border-[#30363d] hover:bg-[#21262d] transition-colors group cursor-pointer">
                            <td className="p-3 text-center"><input type="checkbox" className="rounded border-[#30363d] bg-[#0d1117] accent-[#58a6ff] w-3 h-3" /></td>
                            <td className="p-3 text-[11px] font-mono text-[#8b949e]">{task.id}</td>
                            <td className="p-3 font-semibold text-white">
                               {task.title}
                               <div className="flex gap-1 mt-1">
                                  {task.tags.map(tag => (
                                     <span key={tag} className="bg-[#30363d] text-[#c9d1d9] text-[9px] px-1 py-0.5 rounded">{tag}</span>
                                  ))}
                               </div>
                            </td>
                            <td className="p-3">
                               <span className={`text-[10px] px-2 py-1 rounded-full font-bold border ${
                                  task.status === 'DONE' ? 'bg-[#3fb950]/10 text-[#3fb950] border-[#3fb950]/30' :
                                  task.status === 'IN_PROGRESS' ? 'bg-[#e3b341]/10 text-[#e3b341] border-[#e3b341]/30' :
                                  task.status === 'IN_REVIEW' ? 'bg-[#bc8cff]/10 text-[#bc8cff] border-[#bc8cff]/30' :
                                  'bg-[#30363d] text-[#c9d1d9] border-[#30363d]'
                               }`}>
                                  {task.status.replace('_', ' ')}
                               </span>
                            </td>
                            <td className="p-3">
                               <div className="flex items-center gap-1 text-[11px]">
                                  {task.priority === 'Critical' && <AlertCircle size={12} className="text-[#f85149]" />}
                                  {task.priority === 'High' && <ArrowUpRight size={12} className="text-[#e3b341]" />}
                                  {task.priority === 'Medium' && <ArrowRight size={12} className="text-[#58a6ff]" />}
                                  {task.priority === 'Low' && <ArrowDownRight size={12} className="text-[#8b949e]" />}
                                  <span className={task.priority === 'Critical' ? 'text-[#f85149]' : 'text-[#c9d1d9]'}>{task.priority}</span>
                               </div>
                            </td>
                            <td className="p-3 text-[12px] text-[#c9d1d9]">
                               {task.assignee !== 'Unassigned' ? (
                                  <div className="flex items-center gap-2">
                                     <div className="w-5 h-5 rounded-full bg-[#30363d] flex items-center justify-center text-[10px] font-bold text-white border border-[#484f58]">
                                        {task.assignee.charAt(0)}
                                     </div>
                                     {task.assignee}
                                  </div>
                               ) : (
                                  <span className="text-[#8b949e] italic">Unassigned</span>
                               )}
                            </td>
                            <td className="p-3 text-center text-[#8b949e] font-mono text-[12px]">
                               {task.points}
                            </td>
                            <td className="p-3 text-right">
                               <button className="text-[#8b949e] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical size={16} />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
