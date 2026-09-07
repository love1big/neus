/**
 * ============================================================================
 * PROJECT WORKSPACE MODAL (ศูนย์ควบคุมและจัดการโปรเจกต์เวิร์กสเปซของโค้ดเอดิเตอร์)
 * ============================================================================
 * 
 * 1. MODULE PURPOSE & RESPONSIBILITY (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูล)
 * ----------------------------------------------------------------------------
 * คอมโพเนนต์นี้ทำหน้าที่เป็นศูนย์กลางการบริหารจัดการโปรเจกต์ทั้งหมดของ Code Editor:
 *  - รายการโปรเจกต์ (Projects Explorer): ค้นหา, กรองตามหมวดหมู่, แท็ก, ติดดาว, และดูสถิติ
 *  - สร้างโปรเจกต์ใหม่ (Create Wizard): เลือกจาก Template สำเร็จรูป หรือกำหนดเอง
 *  - สลับและเปิดโปรเจกต์ (Switch / Open Workspace): โหลดไฟล์และการตั้งค่าแบบแยกเดี่ยว
 *  - ตั้งค่าเฉพาะโปรเจกต์ (Per-Project Settings): Tab size, Word wrap, Runtime, Compiler flags, Env variables
 *  - การจัดการความปลอดภัย (Safety & Portability): ทำซ้ำ (Duplicate), ลบ (Delete), ส่งออก (Export JSON), นำเข้า (Import JSON)
 * 
 * 2. ARCHITECTURE & SYSTEM INTEGRATION (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น)
 * ----------------------------------------------------------------------------
 *  - เรียกใช้ `CodeProjectManager` และ `STARTER_PROJECT_TEMPLATES`
 *  - เชื่อมโยงกับ `CodeEditor.tsx` เพื่ออัปเดตไฟล์และสถานะ
 *  - ใช้ `triggerNotification` เพื่อแจ้งเตือนการสร้าง, ลบ, หรือสลับโปรเจกต์
 * 
 * 3. INPUTS, OUTPUTS & DATA CONTRACTS (พารามิเตอร์ Input / Output ที่รับส่ง)
 * ----------------------------------------------------------------------------
 *  - Props:
 *    - `isOpen: boolean`
 *    - `onClose: () => void`
 *    - `initialTab?: 'list' | 'create' | 'settings' | 'portability'`
 *    - `activeProjectId?: string`
 *    - `onSelectProject: (projectId: string) => void`
 * 
 * 4. ERROR HANDLING & FALLBACKS (การจัดการข้อผิดพลาดและ Edge Cases)
 * ----------------------------------------------------------------------------
 *  - มีระบบยืนยัน (Confirmation Dialog) ก่อนลบโปรเจกต์ ป้องกันการลบโดยไม่ตั้งใจ
 *  - ตรวจสอบความถูกต้องของ JSON เมื่อนำเข้าไฟล์สำรอง
 * 
 * 5. USAGE EXAMPLE (ตัวอย่างการเรียกใช้งาน)
 * ----------------------------------------------------------------------------
 *  ```tsx
 *  <ProjectWorkspaceModal
 *    isOpen={isProjectModalOpen}
 *    onClose={() => setIsProjectModalOpen(false)}
 *    onSelectProject={handleProjectSelected}
 *  />
 *  ```
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FolderKanban,
  X,
  Search,
  Plus,
  Settings,
  Star,
  Download,
  Upload,
  Copy,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Gamepad2,
  BrainCircuit,
  Cpu,
  ShieldCheck,
  Server,
  FileCode2,
  Layers,
  HardDrive,
  Code2,
  TerminalSquare,
  FileJson,
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  Sliders,
  FolderOpen
} from 'lucide-react';
import {
  CodeProject,
  CodeProjectManager,
  ProjectCategory,
  TargetRuntime,
  STARTER_PROJECT_TEMPLATES,
  ProjectTemplate,
  ProjectSettings,
  DEFAULT_PROJECT_SETTINGS
} from '../utils/CodeProjectManager';
import { triggerNotification } from './NotificationSystem';

interface ProjectWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'list' | 'create' | 'settings' | 'portability';
  activeProjectId?: string;
  onSelectProject?: (projectId: string) => void;
}

export default function ProjectWorkspaceModal({
  isOpen,
  onClose,
  initialTab = 'list',
  activeProjectId,
  onSelectProject,
}: ProjectWorkspaceModalProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'settings' | 'portability'>(initialTab);
  const [projects, setProjects] = useState<CodeProject[]>(() => CodeProjectManager.getAllProjects());
  const [currentActiveId, setCurrentActiveId] = useState<string>(
    activeProjectId || CodeProjectManager.getActiveProjectId()
  );
  
  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  // New Project Form State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('nexus-game-engine-ts');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState<ProjectCategory>('game-engine');
  const [newProjectRuntime, setNewProjectRuntime] = useState<TargetRuntime>('nexus-engine-wasm');
  const [newProjectTabSize, setNewProjectTabSize] = useState<2 | 4 | 8>(2);

  // Edit Settings State
  const [editingProjectId, setEditingProjectId] = useState<string>(currentActiveId);
  const [settingsForm, setSettingsForm] = useState<ProjectSettings>(DEFAULT_PROJECT_SETTINGS);
  const [settingsProjectName, setSettingsProjectName] = useState('');
  const [settingsProjectDesc, setSettingsProjectDesc] = useState('');

  // Import / Export Feedback
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileImportInputRef = useRef<HTMLInputElement>(null);

  // Load latest projects on open
  useEffect(() => {
    if (isOpen) {
      const all = CodeProjectManager.getAllProjects();
      setProjects(all);
      const activeId = activeProjectId || CodeProjectManager.getActiveProjectId();
      setCurrentActiveId(activeId);
      setEditingProjectId(activeId);

      const target = all.find((p) => p.id === activeId) || all[0];
      if (target) {
        setSettingsForm(target.settings);
        setSettingsProjectName(target.name);
        setSettingsProjectDesc(target.description);
      }

      if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, activeProjectId, initialTab]);

  // Sync editing project form when switching editing target
  useEffect(() => {
    const target = projects.find((p) => p.id === editingProjectId);
    if (target) {
      setSettingsForm(target.settings);
      setSettingsProjectName(target.name);
      setSettingsProjectDesc(target.description);
    }
  }, [editingProjectId, projects]);

  const reloadProjects = () => {
    const all = CodeProjectManager.getAllProjects();
    setProjects(all);
    const active = CodeProjectManager.getActiveProject();
    if (active) {
      setCurrentActiveId(active.id);
    }
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStarred = !showStarredOnly || p.isStarred;

      return matchesSearch && matchesCategory && matchesStarred;
    });
  }, [projects, searchQuery, selectedCategory, showStarredOnly]);

  const getCategoryIcon = (iconName: string, category?: string) => {
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 size={16} className="text-blue-400" />;
      case 'BrainCircuit':
        return <BrainCircuit size={16} className="text-emerald-400" />;
      case 'Cpu':
        return <Cpu size={16} className="text-purple-400" />;
      case 'ShieldCheck':
        return <ShieldCheck size={16} className="text-orange-400" />;
      case 'Sparkles':
        return <Sparkles size={16} className="text-pink-400" />;
      case 'Server':
        return <Server size={16} className="text-cyan-400" />;
      default:
        return <FileCode2 size={16} className="text-gray-400" />;
    }
  };

  const handleSwitch = (projectId: string) => {
    const switched = CodeProjectManager.switchProject(projectId);
    if (switched) {
      setCurrentActiveId(projectId);
      onSelectProject(projectId);
      triggerNotification('success', 'สลับโปรเจกต์สำเร็จ', `เปิดเวิร์กสเปซ "${switched.name}" แล้ว`, false);
      onClose();
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const template = STARTER_PROJECT_TEMPLATES.find((t) => t.id === selectedTemplateId);
    const projectName = newProjectName.trim() || template?.name || 'My New Project';

    const created = CodeProjectManager.createProject({
      name: projectName,
      description: newProjectDescription.trim() || template?.description,
      category: newProjectCategory,
      templateId: selectedTemplateId,
      settings: {
        targetRuntime: newProjectRuntime,
        tabSize: newProjectTabSize,
      },
    });

    triggerNotification('success', 'สร้างโปรเจกต์ใหม่แล้ว', `สร้างเวิร์กสเปซ "${created.name}" เรียบร้อย`, false);
    reloadProjects();
    onSelectProject(created.id);
    onClose();
  };

  const handleDuplicate = (projectId: string) => {
    const dup = CodeProjectManager.duplicateProject(projectId);
    if (dup) {
      triggerNotification('info', 'ทำซ้ำโปรเจกต์แล้ว', `สร้างสำเนา "${dup.name}" สำเร็จ`, false);
      reloadProjects();
    }
  };

  const handleDelete = (projectId: string, name: string) => {
    if (projects.length <= 1) {
      triggerNotification('warning', 'ไม่สามารถลบได้', 'ต้องมีโปรเจกต์เหลืออยู่อย่างน้อย 1 โปรเจกต์ในเวิร์กสเปซ', false);
      return;
    }

    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบโปรเจกต์ "${name}"?\n(ไฟล์ทั้งหมดในโปรเจกต์นี้จะถูกลบถาวร)`)) {
      const ok = CodeProjectManager.deleteProject(projectId);
      if (ok) {
        triggerNotification('info', 'ลบโปรเจกต์แล้ว', `ลบ "${name}" ออกจากเวิร์กสเปซเรียบร้อย`, false);
        reloadProjects();
      }
    }
  };

  const handleToggleStar = (projectId: string) => {
    CodeProjectManager.toggleStar(projectId);
    reloadProjects();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = CodeProjectManager.updateProject(editingProjectId, {
      name: settingsProjectName.trim() || 'Untitled Project',
      description: settingsProjectDesc.trim(),
      settings: settingsForm,
    });

    if (updated) {
      triggerNotification('success', 'บันทึกการตั้งค่าแล้ว', `อัปเดตการตั้งค่าของ "${updated.name}" เรียบร้อย`, false);
      reloadProjects();
    }
  };

  const handleExportSingle = (projectId: string) => {
    const json = CodeProjectManager.exportProjectAsJSON(projectId);
    if (!json) return;

    const proj = projects.find((p) => p.id === projectId);
    const filename = `${proj?.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_project.json`;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    triggerNotification('success', 'ส่งออกโปรเจกต์สำเร็จ', `ดาวน์โหลดไฟล์ "${filename}" เรียบร้อย`, false);
  };

  const handleExportAll = () => {
    const json = CodeProjectManager.exportAllProjectsAsJSON();
    const filename = `OmniStudio_AllProjects_Workspace_${new Date().toISOString().slice(0, 10)}.json`;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    triggerNotification('success', 'ส่งออกเวิร์กสเปซทั้งหมด', `ดาวน์โหลดไฟล์สำรองโปรเจกต์ทั้งหมดเรียบร้อย`, false);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const result = CodeProjectManager.importProjectFromJSON(text);
        if (result.success && result.project) {
          setImportStatus({
            type: 'success',
            message: `นำเข้าโปรเจกต์ "${result.project.name}" สำเร็จ!`,
          });
          triggerNotification('success', 'นำเข้าโปรเจกต์สำเร็จ', `โหลด "${result.project.name}" เข้าสู่เวิร์กสเปซแล้ว`, false);
          reloadProjects();
        } else {
          setImportStatus({
            type: 'error',
            message: result.error || 'ไฟล์ JSON เสียหายหรือไม่ตรงตามรูปแบบ',
          });
        }
      } catch (err: any) {
        setImportStatus({
          type: 'error',
          message: 'เกิดข้อผิดพลาดในการอ่านไฟล์ JSON: ' + err.message,
        });
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[88vh] max-h-[820px] bg-[#10131e] border border-[#2d344a] rounded-xl shadow-2xl overflow-hidden font-sans text-gray-200 flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-[#171b2a] via-[#141724] to-[#10131e] border-b border-[#252b3d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#58a6ff]/10 border border-[#58a6ff]/30 rounded-lg text-[#58a6ff]">
              <FolderKanban size={22} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                Project Workspace Manager
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e2538] text-[#58a6ff] border border-[#58a6ff]/30 font-mono">
                  {projects.length} PROJECTS
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                ระบบจัดการโปรเจกต์หลายโปรเจกต์ แยกไฟล์ เวิร์กสเปซ และการตั้งค่าเฉพาะแต่ละระบบ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('create')}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Plus size={14} /> สร้างโปรเจกต์ใหม่
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#202538] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-[#23283a] bg-[#0c0e17] px-4 shrink-0">
          <div className="flex">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-2.5 px-4 text-xs font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'list'
                  ? 'border-[#58a6ff] text-[#58a6ff] bg-[#141826]'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Layers size={14} /> โปรเจกต์ทั้งหมด ({projects.length})
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`py-2.5 px-4 text-xs font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'create'
                  ? 'border-[#58a6ff] text-[#58a6ff] bg-[#141826]'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Plus size={14} /> สร้างโปรเจกต์ใหม่ (Wizard)
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2.5 px-4 text-xs font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-[#58a6ff] text-[#58a6ff] bg-[#141826]'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Sliders size={14} /> ตั้งค่าโปรเจกต์ (Settings)
            </button>

            <button
              onClick={() => setActiveTab('portability')}
              className={`py-2.5 px-4 text-xs font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'portability'
                  ? 'border-[#58a6ff] text-[#58a6ff] bg-[#141826]'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Download size={14} /> นำเข้า / ส่งออก (Backup JSON)
            </button>
          </div>

          <div className="text-[11px] text-gray-500 hidden md:flex items-center gap-1 font-mono">
            Active: <span className="text-emerald-400 font-bold">{projects.find(p => p.id === currentActiveId)?.name}</span>
          </div>
        </div>

        {/* Modal Main Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#0f121d]">
          {/* ================================================================ */}
          {/* TAB 1: ALL PROJECTS LIST */}
          {/* ================================================================ */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row gap-2.5 justify-between items-stretch sm:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาโปรเจกต์ตามชื่อ, รายละเอียด หรือแท็ก..."
                    className="w-full pl-9 pr-3 py-1.5 bg-[#161a27] border border-[#2c3349] rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#58a6ff]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#161a27] border border-[#2c3349] rounded-lg text-xs text-gray-300 focus:outline-none focus:border-[#58a6ff] cursor-pointer"
                  >
                    <option value="all">ทุกหมวดหมู่ (All Categories)</option>
                    <option value="game-engine">Game Engine & 3D</option>
                    <option value="ai-data">AI & Machine Learning</option>
                    <option value="systems-native">Systems & Native (C++/Rust)</option>
                    <option value="shader-graphics">GLSL & Shaders</option>
                    <option value="database-sql">Databases & SQL</option>
                    <option value="custom">Custom Projects</option>
                  </select>

                  <button
                    onClick={() => setShowStarredOnly(!showStarredOnly)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                      showStarredOnly
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                        : 'bg-[#161a27] border-[#2c3349] text-gray-400 hover:text-white'
                    }`}
                  >
                    <Star size={13} className={showStarredOnly ? 'fill-amber-400 text-amber-400' : ''} />
                    <span>ติดดาว (Starred)</span>
                  </button>
                </div>
              </div>

              {/* Projects Grid */}
              {filteredProjects.length === 0 ? (
                <div className="text-center py-16 bg-[#131624] border border-[#252b3d] rounded-xl text-gray-400 space-y-3">
                  <FolderKanban size={36} className="mx-auto opacity-40 text-gray-500" />
                  <div>
                    <h4 className="font-bold text-white text-sm">ไม่พบโปรเจกต์ที่ตรงกับเงื่อนไข</h4>
                    <p className="text-xs text-gray-400">ลองเปลี่ยนคำค้นหา หรือสร้างโปรเจกต์ใหม่ได้ทันที</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-4 py-2 bg-[#1e2538] hover:bg-[#28324a] text-[#58a6ff] font-semibold rounded-lg text-xs border border-[#58a6ff]/30 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={13} /> สร้างโปรเจกต์ใหม่
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredProjects.map((proj) => {
                    const isActive = proj.id === currentActiveId;
                    const stats = CodeProjectManager.getProjectStats(proj);

                    return (
                      <div
                        key={proj.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                          isActive
                            ? 'bg-[#181d2c] border-[#58a6ff]/60 shadow-lg shadow-[#58a6ff]/5'
                            : 'bg-[#131624] border-[#23283b] hover:border-[#3b435e]'
                        }`}
                      >
                        <div>
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-lg bg-[#0e111a] border border-[#2b3144] shrink-0">
                                {getCategoryIcon(proj.icon, proj.category)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-white text-sm">{proj.name}</h4>
                                  {isActive && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                                      CURRENT
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-400 block mt-0.5">
                                  อัปเดตเมื่อ: {new Date(proj.updatedAt).toLocaleDateString()} • {new Date(proj.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleToggleStar(proj.id)}
                              className="p-1 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer"
                              title={proj.isStarred ? 'ยกเลิกการติดดาว' : 'ติดดาวโปรเจกต์'}
                            >
                              <Star
                                size={15}
                                className={proj.isStarred ? 'fill-amber-400 text-amber-400' : ''}
                              />
                            </button>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-gray-300 line-clamp-2 my-2.5 leading-relaxed">
                            {proj.description || 'ไม่มีคำอธิบายโปรเจกต์'}
                          </p>

                          {/* Tags & Runtime */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <span className="text-[9px] px-2 py-0.5 rounded bg-[#1a1f2e] text-[#58a6ff] border border-[#58a6ff]/20 font-mono">
                              Runtime: {proj.settings?.targetRuntime || 'native'}
                            </span>
                            {proj.tags?.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-[#161a26] text-gray-400 border border-[#282e42]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Stats Metrics Bar */}
                          <div className="p-2 rounded-lg bg-[#0e111a] border border-[#202536] flex items-center justify-between text-[11px] text-gray-400 font-mono mb-3">
                            <span>{stats.totalFiles} ไฟล์ ({stats.totalLines} บรรทัด)</span>
                            <span>{(stats.totalBytes / 1024).toFixed(1)} KB</span>
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="pt-2 border-t border-[#202536] flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingProjectId(proj.id);
                                setActiveTab('settings');
                              }}
                              className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#202538] transition-colors cursor-pointer"
                              title="ตั้งค่าโปรเจกต์"
                            >
                              <Settings size={13} />
                            </button>

                            <button
                              onClick={() => handleDuplicate(proj.id)}
                              className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#202538] transition-colors cursor-pointer"
                              title="ทำซ้ำโปรเจกต์ (Clone)"
                            >
                              <Copy size={13} />
                            </button>

                            <button
                              onClick={() => handleExportSingle(proj.id)}
                              className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#202538] transition-colors cursor-pointer"
                              title="ส่งออกเป็นไฟล์ JSON"
                            >
                              <Download size={13} />
                            </button>

                            {projects.length > 1 && (
                              <button
                                onClick={() => handleDelete(proj.id, proj.name)}
                                className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-950/40 transition-colors cursor-pointer"
                                title="ลบโปรเจกต์นี้"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => handleSwitch(proj.id)}
                            disabled={isActive}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isActive
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 cursor-default'
                                : 'bg-[#1f6feb] hover:bg-[#388bfd] text-white shadow-md'
                            }`}
                          >
                            {isActive ? (
                              <>
                                <CheckCircle2 size={13} /> เปิดใช้งานอยู่
                              </>
                            ) : (
                              <>
                                <FolderOpen size={13} /> เปิดโปรเจกต์
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: CREATE PROJECT WIZARD */}
          {/* ================================================================ */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateProject} className="max-w-3xl mx-auto space-y-5">
              <div>
                <h4 className="font-bold text-white text-sm mb-1">เลือกแม่แบบโปรเจกต์เริ่มต้น (Project Template)</h4>
                <p className="text-xs text-gray-400">เลือกโครงสร้างเริ่มต้นที่ต้องการ หรือเริ่มจากเวิร์กสเปซเปล่า</p>
              </div>

              {/* Template Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {STARTER_PROJECT_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplateId === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => {
                        setSelectedTemplateId(tmpl.id);
                        setNewProjectName(tmpl.name);
                        setNewProjectDescription(tmpl.description);
                        setNewProjectCategory(tmpl.category);
                        setNewProjectRuntime(tmpl.defaultRuntime);
                        if (tmpl.defaultSettings?.tabSize) {
                          setNewProjectTabSize(tmpl.defaultSettings.tabSize);
                        }
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#1a2030] border-[#58a6ff] ring-1 ring-[#58a6ff] shadow-md'
                          : 'bg-[#131624] border-[#252b3d] hover:border-[#38425d]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="p-1.5 rounded-lg bg-[#0e111a] border border-[#2b3144]">
                          {getCategoryIcon(tmpl.icon, tmpl.category)}
                        </div>
                        <span className="font-bold text-white text-xs truncate">{tmpl.name}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mb-2 leading-relaxed">
                        {tmpl.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                        <span>{tmpl.files.length} ไฟล์</span>
                        <span className="text-[#58a6ff] font-semibold">{tmpl.defaultRuntime}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Project Configuration Fields */}
              <div className="p-4 bg-[#141724] border border-[#252b3d] rounded-xl space-y-3.5">
                <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Sliders size={13} className="text-[#58a6ff]" /> รายละเอียดและการตั้งค่าโปรเจกต์
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">ชื่อโปรเจกต์ (Project Name) *</label>
                    <input
                      type="text"
                      required
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="เช่น My Game Boss Battle"
                      className="w-full px-3 py-1.5 bg-[#0e111c] border border-[#2a3045] rounded-lg text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">หมวดหมู่ (Category)</label>
                    <select
                      value={newProjectCategory}
                      onChange={(e) => setNewProjectCategory(e.target.value as ProjectCategory)}
                      className="w-full px-3 py-1.5 bg-[#0e111c] border border-[#2a3045] rounded-lg text-xs text-white focus:outline-none focus:border-[#58a6ff] cursor-pointer"
                    >
                      <option value="game-engine">Game Engine & 3D</option>
                      <option value="ai-data">AI & Machine Learning</option>
                      <option value="systems-native">Systems & Native (C++/Rust)</option>
                      <option value="shader-graphics">GLSL & Shaders</option>
                      <option value="database-sql">Databases & SQL</option>
                      <option value="custom">Custom Project</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">คำอธิบาย (Description)</label>
                  <textarea
                    rows={2}
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="อธิบายวัตถุประสงค์และโครงสร้างของโปรเจกต์..."
                    className="w-full px-3 py-1.5 bg-[#0e111c] border border-[#2a3045] rounded-lg text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">Target Runtime / Compiler</label>
                    <select
                      value={newProjectRuntime}
                      onChange={(e) => setNewProjectRuntime(e.target.value as TargetRuntime)}
                      className="w-full px-3 py-1.5 bg-[#0e111c] border border-[#2a3045] rounded-lg text-xs text-white focus:outline-none focus:border-[#58a6ff] cursor-pointer"
                    >
                      <option value="nexus-engine-wasm">Nexus Engine WebAssembly</option>
                      <option value="python-3.11">Python 3.11 PyTorch AI</option>
                      <option value="native-cpp">Native C++20 / Vulkan</option>
                      <option value="rust-cargo">Rust Cargo Release</option>
                      <option value="webgl-shader">WebGL / GLSL Shader Core</option>
                      <option value="sql-relational">PostgreSQL / SQL Engine</option>
                      <option value="node-typescript">Node.js TypeScript</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">Tab Indent Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[2, 4, 8].map((size) => (
                        <button
                          type="button"
                          key={size}
                          onClick={() => setNewProjectTabSize(size as 2 | 4 | 8)}
                          className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                            newProjectTabSize === size
                              ? 'bg-[#1f6feb]/30 border-[#58a6ff] text-[#58a6ff]'
                              : 'bg-[#0e111c] border-[#2a3045] text-gray-400 hover:text-white'
                          }`}
                        >
                          {size} Spaces
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 bg-[#171b28] hover:bg-[#202538] text-gray-300 rounded-lg text-xs border border-[#2a3045] transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-blue-950 transition-all cursor-pointer"
                >
                  <Plus size={14} /> สร้างและเปิดโปรเจกต์ทันที
                </button>
              </div>
            </form>
          )}

          {/* ================================================================ */}
          {/* TAB 3: PROJECT SETTINGS */}
          {/* ================================================================ */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between bg-[#141724] p-3 rounded-xl border border-[#252b3d]">
                <div>
                  <span className="text-[11px] text-gray-400 block">โปรเจกต์ที่กำลังแก้ไขการตั้งค่า:</span>
                  <select
                    value={editingProjectId}
                    onChange={(e) => setEditingProjectId(e.target.value)}
                    className="mt-1 px-3 py-1.5 bg-[#0e111c] border border-[#2a3045] rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#58a6ff] cursor-pointer"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.id === currentActiveId ? '(Active)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleSwitch(editingProjectId)}
                  disabled={editingProjectId === currentActiveId}
                  className="px-3 py-1.5 bg-[#1e2538] hover:bg-[#28324a] disabled:opacity-50 text-[#58a6ff] font-semibold rounded-lg text-xs border border-[#58a6ff]/30 transition-colors cursor-pointer"
                >
                  สลับไปใช้โปรเจกต์นี้
                </button>
              </div>

              {/* General Project Info */}
              <div className="p-4 bg-[#141724] border border-[#252b3d] rounded-xl space-y-3">
                <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <FileCode2 size={13} className="text-[#58a6ff]" /> ข้อมูลทั่วไป (General Info)
                </h5>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">ชื่อโปรเจกต์</label>
                  <input
                    type="text"
                    value={settingsProjectName}
                    onChange={(e) => setSettingsProjectName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0e111c] border border-[#2a3045] rounded-lg text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">คำอธิบาย</label>
                  <textarea
                    rows={2}
                    value={settingsProjectDesc}
                    onChange={(e) => setSettingsProjectDesc(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0e111c] border border-[#2a3045] rounded-lg text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>
              </div>

              {/* Editor Workspace Behaviors */}
              <div className="p-4 bg-[#141724] border border-[#252b3d] rounded-xl space-y-3.5">
                <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Sliders size={13} className="text-amber-400" /> พฤติกรรมของ Editor ในโปรเจกต์นี้
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">Font Size</label>
                    <select
                      value={settingsForm.fontSize}
                      onChange={(e) => setSettingsForm({ ...settingsForm, fontSize: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-[#0e111c] border border-[#2a3045] rounded-lg text-xs text-white cursor-pointer"
                    >
                      {[12, 13, 14, 15, 16, 18, 20].map((size) => (
                        <option key={size} value={size}>
                          {size} px
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">Tab Size</label>
                    <select
                      value={settingsForm.tabSize}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tabSize: Number(e.target.value) as 2 | 4 | 8 })}
                      className="w-full px-3 py-1.5 bg-[#0e111c] border border-[#2a3045] rounded-lg text-xs text-white cursor-pointer"
                    >
                      <option value={2}>2 Spaces (Web/TS)</option>
                      <option value={4}>4 Spaces (Python/C++)</option>
                      <option value={8}>8 Spaces (Standard)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">Word Wrap</label>
                    <select
                      value={settingsForm.wordWrap}
                      onChange={(e) => setSettingsForm({ ...settingsForm, wordWrap: e.target.value as any })}
                      className="w-full px-3 py-1.5 bg-[#0e111c] border border-[#2a3045] rounded-lg text-xs text-white cursor-pointer"
                    >
                      <option value="on">เปิดการตัดบรรทัด (On)</option>
                      <option value="off">ปิดการตัดบรรทัด (Off)</option>
                      <option value="wordWrapColumn">ตัดตามความกว้างคอลัมน์</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center justify-between p-2.5 bg-[#0e111c] border border-[#232838] rounded-lg">
                    <div>
                      <span className="text-xs font-semibold text-white block">จัดรูปแบบอัตโนมัติเมื่อบันทึก (Format on Save)</span>
                      <span className="text-[10px] text-gray-400">จัดระเบียบโค้ดอัตโนมัติทุกครั้งที่กด Save</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsForm.formatOnSave}
                      onChange={(e) => setSettingsForm({ ...settingsForm, formatOnSave: e.target.checked })}
                      className="w-4 h-4 accent-[#58a6ff] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#0e111c] border border-[#232838] rounded-lg">
                    <div>
                      <span className="text-xs font-semibold text-white block">ตรวจจับภาษาอัตโนมัติ (Auto-Detect)</span>
                      <span className="text-[10px] text-gray-400">สแกนภาษาและไวยากรณ์ตามเนื้อหาไฟล์</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsForm.autoDetectLanguage}
                      onChange={(e) => setSettingsForm({ ...settingsForm, autoDetectLanguage: e.target.checked })}
                      className="w-4 h-4 accent-[#58a6ff] cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Compiler / Build Flags</label>
                  <input
                    type="text"
                    value={settingsForm.compilerFlags}
                    onChange={(e) => setSettingsForm({ ...settingsForm, compilerFlags: e.target.value })}
                    placeholder="เช่น -O3 -Wall --std=esnext"
                    className="w-full px-3 py-1.5 bg-[#0e111c] border border-[#2a3045] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={14} /> บันทึกการตั้งค่าโปรเจกต์
                </button>
              </div>
            </form>
          )}

          {/* ================================================================ */}
          {/* TAB 4: PORTABILITY & BACKUPS */}
          {/* ================================================================ */}
          {activeTab === 'portability' && (
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Single Project Export */}
              <div className="p-4 bg-[#141724] border border-[#252b3d] rounded-xl space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-[#58a6ff]">
                    <Download size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">ส่งออกโปรเจกต์ที่เลือก (Export Single Project)</h5>
                    <p className="text-[11px] text-gray-400">ดาวน์โหลดไฟล์โค้ดและคอนฟิกของโปรเจกต์เป็นไฟล์ .json</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <select
                    value={editingProjectId}
                    onChange={(e) => setEditingProjectId(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-[#0e111c] border border-[#2a3045] rounded-lg text-xs text-white cursor-pointer"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleExportSingle(editingProjectId)}
                    className="px-4 py-1.5 bg-[#1e2538] hover:bg-[#28324a] text-[#58a6ff] font-bold rounded-lg text-xs border border-[#58a6ff]/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download size={13} /> ส่งออก
                  </button>
                </div>
              </div>

              {/* Workspace Full Bundle Export */}
              <div className="p-4 bg-[#141724] border border-[#252b3d] rounded-xl space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <HardDrive size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">สำรองเวิร์กสเปซทั้งหมด (Export Full Workspace Bundle)</h5>
                    <p className="text-[11px] text-gray-400">รวมโปรเจกต์ทั้งหมด {projects.length} โปรเจกต์ไว้ในไฟล์เดียวสำหรับย้ายเครื่อง</p>
                  </div>
                </div>

                <button
                  onClick={handleExportAll}
                  className="w-full py-2 bg-[#18261e] hover:bg-[#203628] text-emerald-300 font-bold rounded-lg text-xs border border-emerald-500/40 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download size={14} /> ดาวน์โหลด Workspace Bundle (.json)
                </button>
              </div>

              {/* Import Project JSON */}
              <div className="p-4 bg-[#141724] border border-[#252b3d] rounded-xl space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    <Upload size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">นำเข้าโปรเจกต์จากไฟล์สำรอง (Import Project JSON)</h5>
                    <p className="text-[11px] text-gray-400">รองรับทั้งไฟล์ Single Project JSON และ Full Workspace Bundle</p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileImportInputRef}
                  onChange={handleImportFile}
                  accept=".json,application/json"
                  className="hidden"
                />

                <button
                  onClick={() => fileImportInputRef.current?.click()}
                  className="w-full py-2 bg-purple-950/30 hover:bg-purple-950/50 text-purple-300 font-bold rounded-lg text-xs border border-purple-500/40 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload size={14} /> เลือกไฟล์ JSON เพื่อนำเข้า...
                </button>

                {importStatus && (
                  <div
                    className={`p-3 rounded-lg text-xs ${
                      importStatus.type === 'success'
                        ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                        : 'bg-red-950/40 border border-red-500/40 text-red-300'
                    }`}
                  >
                    {importStatus.type === 'success' ? '✨ ' : '❌ '}
                    {importStatus.message}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#0c0e17] border-t border-[#23283a] flex items-center justify-between text-[11px] text-gray-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Multi-Project Workspace Engine v1.3</span>
          </div>
          <span>พื้นที่ LocalStorage มีการแยกโปรเจกต์และ Snapshot อัตโนมัติ</span>
        </div>
      </div>
    </div>
  );
}
