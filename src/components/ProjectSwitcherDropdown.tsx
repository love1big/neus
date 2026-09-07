/**
 * ============================================================================
 * PROJECT SWITCHER DROPDOWN (วิดเจ็ตเลือกและสลับโปรเจกต์บนแถบเครื่องมือโค้ด)
 * ============================================================================
 * 
 * 1. MODULE PURPOSE & RESPONSIBILITY (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูล)
 * ----------------------------------------------------------------------------
 * คอมโพเนนต์นี้ทำหน้าที่เป็นตัวเลือกโปรเจกต์ด่วน (Quick Project Switcher) บน Header Bar
 * ของ Code Editor ช่วยให้ผู้ใช้:
 *  - มองเห็นโปรเจกต์ที่กำลังทำงานอยู่ (Active Project Name, Icon, Category Badge)
 *  - สลับระหว่างโปรเจกต์ต่างๆ ได้ในคลิกเดียว (Instant 1-Click Project Switch)
 *  - เข้าถึงหน้าต่างจัดการโปรเจกต์ตัวเต็ม (Open Full Project Manager)
 *  - สร้างโปรเจกต์ใหม่อย่างรวดเร็ว (+ Quick New Project)
 *  - บันทึกและส่งออกโปรเจกต์ปัจจุบันเป็นไฟล์ JSON
 * 
 * 2. ARCHITECTURE & SYSTEM INTEGRATION (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น)
 * ----------------------------------------------------------------------------
 *  - ใช้งาน `CodeProjectManager` สำหรับดึงและสลับโปรเจกต์
 *  - เชื่อมโยงกับ `ProjectWorkspaceModal` เพื่อเปิดหน้าต่างเต็ม
 *  - รับ Props `activeProject` และ Callback `onSwitchProject`, `onOpenProjectManager`
 * 
 * 3. INPUTS, OUTPUTS & DATA CONTRACTS (พารามิเตอร์ Input / Output ที่รับส่ง)
 * ----------------------------------------------------------------------------
 *  - Props:
 *    - `activeProject: CodeProject`
 *    - `onSwitchProject: (projectId: string) => void`
 *    - `onOpenProjectManager: (initialTab?: 'list' | 'create' | 'settings') => void`
 * 
 * 4. ERROR HANDLING & FALLBACKS (การจัดการข้อผิดพลาดและ Edge Cases)
 * ----------------------------------------------------------------------------
 *  - มี Click Outside Handler เพื่อปิด Popover อัตโนมัติเมื่อผู้ใช้คลิกภายนอก
 *  - แสดง Fallback UI หากไม่มีโปรเจกต์ที่เลือก
 * 
 * 5. USAGE EXAMPLE (ตัวอย่างการเรียกใช้งาน)
 * ----------------------------------------------------------------------------
 *  ```tsx
 *  <ProjectSwitcherDropdown
 *    activeProject={currentProject}
 *    onSwitchProject={handleSwitchProject}
 *    onOpenProjectManager={handleOpenProjectModal}
 *  />
 *  ```
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  FolderKanban,
  ChevronDown,
  Plus,
  Settings,
  Star,
  Download,
  Copy,
  LayoutGrid,
  Check,
  Gamepad2,
  BrainCircuit,
  Cpu,
  ShieldCheck,
  Sparkles,
  Server,
  FileCode2,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  CodeProject,
  CodeProjectManager,
} from '../utils/CodeProjectManager';

interface ProjectSwitcherDropdownProps {
  activeProject: CodeProject | null;
  onSwitchProject: (projectId: string) => void;
  onOpenProjectManager: (initialTab?: 'list' | 'create' | 'settings') => void;
}

export default function ProjectSwitcherDropdown({
  activeProject,
  onSwitchProject,
  onOpenProjectManager,
}: ProjectSwitcherDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<CodeProject[]>(() => CodeProjectManager.getAllProjects());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync projects list on custom events
  useEffect(() => {
    const handleProjectListUpdate = () => {
      setProjects(CodeProjectManager.getAllProjects());
    };

    window.addEventListener('code-project-list-updated', handleProjectListUpdate);
    window.addEventListener('code-project-switched', handleProjectListUpdate);
    return () => {
      window.removeEventListener('code-project-list-updated', handleProjectListUpdate);
      window.removeEventListener('code-project-switched', handleProjectListUpdate);
    };
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getCategoryIcon = (iconName: string, category: string) => {
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 size={13} className="text-blue-400" />;
      case 'BrainCircuit':
        return <BrainCircuit size={13} className="text-emerald-400" />;
      case 'Cpu':
        return <Cpu size={13} className="text-purple-400" />;
      case 'ShieldCheck':
        return <ShieldCheck size={13} className="text-orange-400" />;
      case 'Sparkles':
        return <Sparkles size={13} className="text-pink-400" />;
      case 'Server':
        return <Server size={13} className="text-cyan-400" />;
      default:
        return <FileCode2 size={13} className="text-gray-400" />;
    }
  };

  const current = activeProject || projects[0];

  return (
    <div className="relative inline-block text-xs font-sans" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 py-1 rounded-md border transition-all cursor-pointer select-none ${
          isOpen
            ? 'bg-[#1f2430] border-[#58a6ff]/70 text-white shadow-sm'
            : 'bg-[#161a23] hover:bg-[#202533] border-[#2b3144] text-gray-200'
        }`}
        title={`โปรเจกต์ปัจจุบัน: ${current?.name || 'เลือกโปรเจกต์'} (คลิกเพื่อสลับหรือจัดการโปรเจกต์)`}
      >
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-[#0d1017] border border-[#2b3144] text-[#58a6ff]">
            {current ? getCategoryIcon(current.icon, current.category) : <FolderKanban size={13} />}
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-[11px] max-w-[130px] sm:max-w-[180px] truncate">
                {current?.name || 'Omni Project'}
              </span>
              {current?.isStarred && <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />}
            </div>
            <span className="text-[9px] text-gray-400 flex items-center gap-1">
              <span>{current?.files.length || 0} ไฟล์</span>
              <span>•</span>
              <span className="font-mono text-[9px] text-emerald-400">{current?.settings?.targetRuntime?.replace('-wasm', '') || 'engine'}</span>
            </span>
          </div>
        </div>

        <ChevronDown size={12} className={`text-gray-400 transition-transform ml-1 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-[330px] bg-[#121520] border border-[#2d344a] rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 text-gray-300">
          {/* Header */}
          <div className="p-2.5 bg-[#171b29] border-b border-[#262c3e] flex items-center justify-between">
            <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <FolderKanban size={13} className="text-[#58a6ff]" />
              สลับโปรเจกต์ (Workspace Projects)
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0d1017] text-gray-400 font-mono">
              {projects.length} โปรเจกต์
            </span>
          </div>

          {/* Projects Quick List */}
          <div className="max-h-[240px] overflow-y-auto p-1.5 space-y-1">
            {projects.map((proj) => {
              const isActive = proj.id === current?.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => {
                    onSwitchProject(proj.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 rounded-md flex items-center justify-between text-left transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#1d2333] border-[#58a6ff]/40 text-white shadow-sm'
                      : 'bg-[#141724] hover:bg-[#1b2030] border-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 max-w-[240px]">
                    <div className="p-1 rounded bg-[#0e111a] shrink-0 border border-[#23283a]">
                      {getCategoryIcon(proj.icon, proj.category)}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[11px] text-white truncate">{proj.name}</span>
                        {proj.isStarred && <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />}
                      </div>
                      <div className="text-[9px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <span>{proj.files.length} ไฟล์</span>
                        <span>•</span>
                        <span className="font-mono text-gray-500">
                          {new Date(proj.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isActive && <Check size={14} className="text-emerald-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          {/* Quick Action Footer Buttons */}
          <div className="p-2 bg-[#0e111a] border-t border-[#23283a] space-y-1 text-[11px]">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenProjectManager('create');
              }}
              className="w-full py-1.5 px-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Plus size={13} />
              <span>สร้างโปรเจกต์ใหม่ (New Project)</span>
            </button>

            <div className="grid grid-cols-2 gap-1 pt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenProjectManager('list');
                }}
                className="py-1 px-2 bg-[#171b28] hover:bg-[#23293c] border border-[#2d344a] text-gray-200 hover:text-white rounded flex items-center justify-center gap-1 text-[10px] transition-colors cursor-pointer"
              >
                <LayoutGrid size={11} className="text-blue-400" />
                <span>จัดการทั้งหมด</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenProjectManager('settings');
                }}
                className="py-1 px-2 bg-[#171b28] hover:bg-[#23293c] border border-[#2d344a] text-gray-200 hover:text-white rounded flex items-center justify-center gap-1 text-[10px] transition-colors cursor-pointer"
              >
                <Settings size={11} className="text-amber-400" />
                <span>ตั้งค่าโปรเจกต์</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
