import React, { useState } from 'react';
import { Folder, Plus, Settings, Play, Code2, Trash2, Edit2, Check, X, Search, ChevronRight, Save } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  framework: string;
  status: 'active' | 'archived';
  lastModified: string;
  settings: {
    theme: string;
    autoSave: boolean;
    buildCommand: string;
    startCommand: string;
  };
}

const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'OmniEngine Core',
    description: 'Core game engine development project.',
    framework: 'React + WebGL',
    status: 'active',
    lastModified: '2026-07-27',
    settings: {
      theme: 'dark',
      autoSave: true,
      buildCommand: 'npm run build',
      startCommand: 'npm run dev',
    }
  },
  {
    id: 'proj-2',
    name: 'AI Agent Backend',
    description: 'Server-side logic for the NPC AI agents.',
    framework: 'Node.js',
    status: 'active',
    lastModified: '2026-07-26',
    settings: {
      theme: 'light',
      autoSave: true,
      buildCommand: 'tsc',
      startCommand: 'node dist/index.js',
    }
  }
];

export default function ProjectManagementSystem() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [activeProject, setActiveProject] = useState<Project | null>(projects[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: newProjectName,
      description: 'New coding project workspace.',
      framework: 'Unknown',
      status: 'active',
      lastModified: new Date().toISOString().split('T')[0],
      settings: {
        theme: 'dark',
        autoSave: true,
        buildCommand: 'npm run build',
        startCommand: 'npm run dev'
      }
    };
    setProjects([...projects, newProj]);
    setActiveProject(newProj);
    setNewProjectName('');
    setIsCreating(false);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    if (activeProject?.id === id) {
      setActiveProject(updated[0] || null);
    }
  };

  const handleUpdateSettings = (id: string, newSettings: Partial<Project['settings']>) => {
    setProjects(projects.map(p => {
      if (p.id === id) {
        return { ...p, settings: { ...p.settings, ...newSettings } };
      }
      return p;
    }));
    if (activeProject?.id === id) {
      setActiveProject({ ...activeProject, settings: { ...activeProject.settings, ...newSettings } });
    }
  };

  return (
    <div className="w-full h-full flex bg-[#0d1117] text-gray-300 font-sans">
      {/* Sidebar - Project List */}
      <div className="w-80 border-r border-[#30363d] flex flex-col bg-[#161b22]">
        <div className="p-4 border-b border-[#30363d]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Folder size={20} className="text-[#58a6ff]" />
            Projects
          </h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#58a6ff] transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredProjects.map(proj => (
            <div 
              key={proj.id}
              onClick={() => setActiveProject(proj)}
              className={`p-3 rounded-md cursor-pointer transition-colors group flex items-start justify-between ${activeProject?.id === proj.id ? 'bg-[#1f6feb]/15 border border-[#1f6feb]/30' : 'hover:bg-[#21262d] border border-transparent'}`}
            >
              <div>
                <h3 className={`font-medium text-sm ${activeProject?.id === proj.id ? 'text-[#58a6ff]' : 'text-gray-200'}`}>{proj.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{proj.framework}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                  <span className="text-xs text-gray-500">{proj.lastModified}</span>
                </div>
              </div>
              <ChevronRight size={16} className={`text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity ${activeProject?.id === proj.id ? 'opacity-100 text-[#58a6ff]' : ''}`} />
            </div>
          ))}

          {isCreating ? (
            <div className="p-3 bg-[#0d1117] rounded-md border border-[#30363d]">
              <input 
                autoFocus
                type="text" 
                placeholder="Project Name..." 
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                className="w-full bg-transparent text-sm text-white focus:outline-none mb-2"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsCreating(false)} className="text-xs p-1 text-gray-400 hover:text-white"><X size={14} /></button>
                <button onClick={handleCreateProject} className="text-xs p-1 text-[#3fb950] hover:text-[#56d364]"><Check size={14} /></button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsCreating(true)}
              className="w-full mt-2 p-2 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white border border-dashed border-[#30363d] hover:border-gray-500 rounded-md transition-colors"
            >
              <Plus size={16} /> New Project
            </button>
          )}
        </div>
      </div>

      {/* Main Area - Workspace & Settings */}
      <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto">
        {activeProject ? (
          <>
            <div className="p-6 border-b border-[#30363d] bg-[#161b22]/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{activeProject.name}</h1>
                  <p className="text-gray-400 mt-1">{activeProject.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-medium transition-colors">
                    <Play size={14} /> Open Workspace
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(activeProject.id)}
                    className="p-1.5 text-gray-400 hover:text-[#f85149] hover:bg-[#f85149]/10 rounded-md transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Code2 size={14} /> {activeProject.framework}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className={`w-2 h-2 rounded-full ${activeProject.status === 'active' ? 'bg-[#3fb950]' : 'bg-gray-500'}`}></span>
                  {activeProject.status.charAt(0).toUpperCase() + activeProject.status.slice(1)}
                </div>
              </div>
            </div>

            <div className="p-6 max-w-4xl w-full">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <Settings size={18} className="text-gray-400" />
                Workspace Settings
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Build Command</label>
                    <input 
                      type="text" 
                      value={activeProject.settings.buildCommand}
                      onChange={(e) => handleUpdateSettings(activeProject.id, { buildCommand: e.target.value })}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#58a6ff] transition-colors font-mono"
                    />
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Command</label>
                    <input 
                      type="text" 
                      value={activeProject.settings.startCommand}
                      onChange={(e) => handleUpdateSettings(activeProject.id, { startCommand: e.target.value })}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#58a6ff] transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Editor Theme</label>
                    <select 
                      value={activeProject.settings.theme}
                      onChange={(e) => handleUpdateSettings(activeProject.id, { theme: e.target.value })}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#58a6ff] transition-colors"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="hc-black">High Contrast</option>
                    </select>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300">Auto Save</h4>
                      <p className="text-xs text-gray-500 mt-1">Automatically save files on change</p>
                    </div>
                    <button 
                      onClick={() => handleUpdateSettings(activeProject.id, { autoSave: !activeProject.settings.autoSave })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${activeProject.settings.autoSave ? 'bg-[#2ea043]' : 'bg-gray-600'}`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${activeProject.settings.autoSave ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#30363d]">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-gray-300 rounded-md text-sm font-medium transition-colors">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 h-full">
            <Folder size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No Project Selected</p>
            <p className="text-sm mt-2 max-w-sm text-center">Select a project from the sidebar to view its workspace and settings, or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
