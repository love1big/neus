import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { LANGUAGES } from '../lib/constants';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ChevronUp, ChevronDown, X, Search, Replace as ReplaceIcon, Undo, Redo, 
  BrainCircuit, Activity, Cpu, ShieldCheck, Zap, Server, Code2, Sparkles, 
  TerminalSquare, AlertTriangle, FileCode2, Package, GitBranch, LayoutGrid, 
  Terminal as TerminalIcon, Bug, AlignLeft, Settings, Bell, ChevronRight, 
  FileJson, Play, Copy, SplitSquareHorizontal, ExternalLink, Upload, Check, 
  Sliders, FileCheck, RefreshCw, FolderOpen, AlertCircle, Info, Wrench, ListFilter,
  Bot, HelpCircle, ArrowRight, CornerDownLeft, FileText, CheckCircle2, Bookmark,
  Languages, Lock, Unlock, FolderKanban, Plus, Trash2
} from 'lucide-react';
import PopOutPanel from './PopOutPanel';
import { 
  LanguageDetectorEngine, 
  DetectedLanguageResult, 
  SUPPORTED_LANGUAGES 
} from '../utils/LanguageDetectorEngine';
import { 
  LanguageEditorConfigurator, 
  EditorConfigurationProfile 
} from '../utils/LanguageEditorConfigurator';
import {
  LanguageCompletionProvider,
  LanguageCompletionItem
} from '../utils/LanguageCompletionProvider';
import {
  LanguageErrorChecker,
  DiagnosticError
} from '../utils/LanguageErrorChecker';
import SyntaxErrorTooltipWidget from './SyntaxErrorTooltipWidget';
import {
  LanguageAISuggestionTailorer,
  AISuggestionItem,
  AIQuickAction,
  LanguageCheatSheet
} from '../utils/LanguageAISuggestionTailorer';
import {
  CodeProject,
  CodeProjectManager,
  ProjectFile
} from '../utils/CodeProjectManager';
import ProjectSwitcherDropdown from './ProjectSwitcherDropdown';
import ProjectWorkspaceModal from './ProjectWorkspaceModal';

interface CodeEditorProps {
  code?: string;
  setCode?: React.Dispatch<React.SetStateAction<string>>;
  language?: string;
  setLanguage?: React.Dispatch<React.SetStateAction<string>>;
  filename?: string;
  onSelectTool?: (toolId: string) => void;
}

// Built-in workspace multi-file tabs for instant testing of language auto-detection
const DEFAULT_FILES = [
  {
    name: 'PlayerCombatController.ts',
    lang: 'typescript',
    code: `import { Component, Vector3, EventDispatcher } from '@nexus/engine';

export interface CombatStats {
  health: number;
  attackPower: number;
  criticalChance: number;
}

export class PlayerCombatController extends Component {
  private stats: CombatStats = { health: 100, attackPower: 25, criticalChance: 0.15 };

  public executeAttack(target: Entity): void {
    const isCrit = Math.random() < this.stats.criticalChance;
    const damage = isCrit ? this.stats.attackPower * 2.0 : this.stats.attackPower;
    target.applyDamage(damage);
    EventDispatcher.dispatch('COMBAT_HIT', { damage, isCrit });
  }
}`
  },
  {
    name: 'neural_behavior_agent.py',
    lang: 'python',
    code: `#!/usr/bin/env python3
import torch
import torch.nn as nn
from typing import Tuple, List

class NeuralBehaviorAgent(nn.Module):
    def __init__(self, state_dim: int = 128, action_dim: int = 16):
        super(NeuralBehaviorAgent, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(state_dim, 256),
            nn.ReLU(),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, action_dim),
            nn.Softmax(dim=-1)
        )

    def forward(self, state: torch.Tensor) -> torch.Tensor:
        return self.network(state)

if __name__ == '__main__':
    agent = NeuralBehaviorAgent()
    print("Neural Agent loaded with 256 hidden neurons.")`
  },
  {
    name: 'GameSessionOrchestrator.java',
    lang: 'java',
    code: `package com.nexus.engine.session;

import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;

public class GameSessionOrchestrator {
    private final ConcurrentMap<UUID, PlayerSession> activeSessions = new ConcurrentHashMap<>();
    
    public record PlayerSession(UUID id, String username, long connectedAt, int pingMs) {}

    public List<String> getLowLatencyPlayerNames() {
        return activeSessions.values().stream()
            .filter(session -> session.pingMs() < 50)
            .sorted(Comparator.comparingInt(PlayerSession::pingMs))
            .map(PlayerSession::username)
            .collect(Collectors.toList());
    }

    public static void main(String[] args) {
        System.out.println("Java GameSessionOrchestrator initialized with Virtual Threads.");
    }
}`
  },
  {
    name: 'BVHAccelerationEngine.cpp',
    lang: 'cpp',
    code: `#include <iostream>
#include <vector>
#include <memory>
#include <algorithm>

namespace NexusEngine::Raytracing {
    struct alignas(16) Ray {
        float origin[3];
        float direction[3];
        float tMin{0.001f};
        float tMax{1000.0f};
    };

    class BVHAccelerationEngine {
    private:
        std::vector<Ray> m_activeRays;
        int m_maxDepth{16};

    public:
        explicit BVHAccelerationEngine(int depth) : m_maxDepth(depth) {
            std::cout << "[BVH] Initialized accelerator with depth: " << m_maxDepth << std::endl;
        }

        [[nodiscard]] bool traverseBVH(const Ray& ray, float& hitDist) const noexcept {
            // Traversal implementation
            return true;
        }
    };
}`
  },
  {
    name: 'octree_spatial_indexer.rs',
    lang: 'rust',
    code: `pub struct OctreeSpatialIndexer<T> {
    pub root_bounds: BoundingBox,
    pub entities: Vec<T>,
    pub max_depth: usize,
}

impl<T: SpatialObject> OctreeSpatialIndexer<T> {
    pub fn new(bounds: BoundingBox, max_depth: usize) -> Self {
        OctreeSpatialIndexer {
            root_bounds: bounds,
            entities: Vec::with_capacity(512),
            max_depth,
        }
    }

    pub fn query_sphere(&self, center: Vector3, radius: f32) -> Vec<&T> {
        self.entities
            .iter()
            .filter(|e| e.get_position().distance_to(center) <= radius)
            .collect()
    }
}`
  },
  {
    name: 'volumetric_atmosphere.frag',
    lang: 'glsl',
    code: `#version 330 core
precision highp float;

in vec2 vUV;
out vec4 FragColor;

uniform mat4 uInvProjection;
uniform vec3 uSunPosition;
uniform sampler2D uDepthMap;

void main() {
    vec3 rayDir = normalize(vec3(vUV * 2.0 - 1.0, 1.0));
    float density = 0.0;
    
    for (int step = 0; step < 16; ++step) {
        density += 0.0625 * exp(-float(step) * 0.15);
    }
    
    FragColor = vec4(vec3(0.3, 0.6, 1.0) * density, 1.0);
}`
  },
  {
    name: 'create_game_tables.sql',
    lang: 'sql',
    code: `-- Relational Game Save & Character State Schema
CREATE TABLE IF NOT EXISTS game_save_states (
    save_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id VARCHAR(64) NOT NULL,
    current_scene VARCHAR(128) NOT NULL,
    playtime_seconds INTEGER NOT NULL DEFAULT 0,
    save_payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_game_saves_player ON game_save_states(player_id);

SELECT player_id, current_scene, playtime_seconds 
FROM game_save_states 
WHERE playtime_seconds > 3600 
ORDER BY updated_at DESC;`
  }
];

export default function CodeEditor({ 
  code: externalCode, 
  setCode: externalSetCode, 
  language: externalLanguage, 
  setLanguage: externalSetLanguage, 
  filename: externalFilename,
  onSelectTool
}: CodeEditorProps) {
  // Multi-Project Workspace State
  const [currentProject, setCurrentProject] = useState<CodeProject>(() => CodeProjectManager.getActiveProject());
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [projectModalTab, setProjectModalTab] = useState<'list' | 'create' | 'settings' | 'portability'>('list');
  const [isCreatingNewFile, setIsCreatingNewFile] = useState<boolean>(false);
  const [newFileNameInput, setNewFileNameInput] = useState<string>('');

  const [openFiles, setOpenFiles] = useState<{ name: string; lang: string; code: string; isEntry?: boolean }[]>(() => {
    const proj = CodeProjectManager.getActiveProject();
    if (proj && proj.files.length > 0) {
      return proj.files.map(f => ({ name: f.name, lang: f.lang, code: f.code, isEntry: f.isEntry }));
    }
    return DEFAULT_FILES;
  });

  const [activeFilename, setActiveFilename] = useState<string>(() => {
    if (externalFilename) return externalFilename;
    const proj = CodeProjectManager.getActiveProject();
    return proj?.activeFilename || proj?.files[0]?.name || DEFAULT_FILES[0].name;
  });

  const [internalCode, setInternalCode] = useState<string>(() => {
    if (externalCode !== undefined) return externalCode;
    const proj = CodeProjectManager.getActiveProject();
    const activeFile = proj?.files.find(f => f.name === (proj.activeFilename || '')) || proj?.files[0];
    return activeFile?.code || DEFAULT_FILES[0].code;
  });

  const [manualLangOverride, setManualLangOverride] = useState<string>('auto');
  const [isAutoDetectActive, setIsAutoDetectActive] = useState<boolean>(true);
  const [detectionNotice, setDetectionNotice] = useState<string | null>(null);

  // Access LanguageContext safely
  let langContext: ReturnType<typeof useLanguage> | null = null;
  try {
    langContext = useLanguage();
  } catch (e) {
    // Graceful fallback if instantiated without LanguageProvider
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const activeSuggestionRef = useRef<string | null>(null);

  const activeCode = externalCode !== undefined ? externalCode : internalCode;
  const updateCode = (newVal: string) => {
    if (externalSetCode) externalSetCode(newVal);
    setInternalCode(newVal);
  };

  // Switch Project Handler
  const handleSwitchProject = useCallback((projectId: string) => {
    const switched = CodeProjectManager.switchProject(projectId);
    if (!switched) return;

    setCurrentProject(switched);
    const files = switched.files.map(f => ({ name: f.name, lang: f.lang, code: f.code, isEntry: f.isEntry }));
    setOpenFiles(files);

    const targetFile = switched.files.find(f => f.name === switched.activeFilename) || switched.files[0];
    if (targetFile) {
      setActiveFilename(targetFile.name);
      updateCode(targetFile.code);
      setIsAutoDetectActive(true);
      setManualLangOverride('auto');
    }
    setActionFeedback(`📂 Switched project: ${switched.name}`);
    setTimeout(() => setActionFeedback(null), 3000);
  }, []);

  // Listen to Global Project Manager Events
  useEffect(() => {
    const handleProjectSwitchedEvent = (e: any) => {
      const proj = e.detail as CodeProject;
      if (proj) {
        setCurrentProject(proj);
        const files = proj.files.map(f => ({ name: f.name, lang: f.lang, code: f.code, isEntry: f.isEntry }));
        setOpenFiles(files);
        const targetFile = proj.files.find(f => f.name === proj.activeFilename) || proj.files[0];
        if (targetFile) {
          setActiveFilename(targetFile.name);
          updateCode(targetFile.code);
          setIsAutoDetectActive(true);
          setManualLangOverride('auto');
        }
      }
    };

    const handleProjectUpdatedEvent = (e: any) => {
      const proj = e.detail as CodeProject;
      if (proj && proj.id === currentProject.id) {
        setCurrentProject(proj);
      }
    };

    const handleOpenModalEvent = (e: any) => {
      const tab = e?.detail?.tab || 'list';
      setProjectModalTab(tab);
      setIsProjectModalOpen(true);
    };

    window.addEventListener('code-project-switched', handleProjectSwitchedEvent);
    window.addEventListener('code-project-updated', handleProjectUpdatedEvent);
    window.addEventListener('open-code-project-modal', handleOpenModalEvent);
    return () => {
      window.removeEventListener('code-project-switched', handleProjectSwitchedEvent);
      window.removeEventListener('code-project-updated', handleProjectUpdatedEvent);
      window.removeEventListener('open-code-project-modal', handleOpenModalEvent);
    };
  }, [currentProject.id]);

  // Debounced auto-save active file code into CodeProjectManager
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenFiles(prev => {
        const updated = prev.map(f => f.name === activeFilename ? { ...f, code: activeCode } : f);
        CodeProjectManager.saveActiveProjectFiles(updated, activeFilename);
        return updated;
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [activeCode, activeFilename]);

  // Group supported languages by category for structured dropdown optgroups
  const categorizedLanguages = useMemo(() => {
    const categories: { key: string; label: string; items: typeof SUPPORTED_LANGUAGES[string][] }[] = [
      { key: 'web', label: 'Web & Full-Stack', items: [] },
      { key: 'systems', label: 'Systems, Game Dev & Native', items: [] },
      { key: 'scripting', label: 'Scripting, AI & Data Science', items: [] },
      { key: 'shader-graphics', label: 'Shaders & Graphics Computing', items: [] },
      { key: 'data-markup', label: 'Data, Markup & SQL Databases', items: [] },
      { key: 'devops-config', label: 'DevOps, Containers & Config', items: [] },
      { key: 'mobile', label: 'Mobile & Multiplatform', items: [] },
      { key: 'functional', label: 'Functional Languages', items: [] },
    ];

    const categoryMap = new Map(categories.map(c => [c.key, c.items]));

    Object.values(SUPPORTED_LANGUAGES).forEach(lang => {
      const targetList = categoryMap.get(lang.category);
      if (targetList) {
        targetList.push(lang);
      } else {
        // Fallback to web or first
        categories[0].items.push(lang);
      }
    });

    return categories.filter(c => c.items.length > 0);
  }, []);

  // 1. Perform Automatic Language Detection
  const detectedResult: DetectedLanguageResult = useMemo(() => {
    if (!isAutoDetectActive && manualLangOverride !== 'auto') {
      const def = SUPPORTED_LANGUAGES[manualLangOverride];
      if (def) {
        return {
          id: def.id,
          name: def.name,
          monacoId: def.monacoId,
          confidence: 100,
          method: 'fallback',
          category: def.category,
          color: def.color,
          details: 'Manually locked by user',
          sampleKeywordsFound: [],
          lineCount: activeCode.split('\n').length,
          byteSize: new Blob([activeCode]).size
        };
      }
    }
    return LanguageDetectorEngine.detect(activeFilename, activeCode, externalLanguage);
  }, [activeFilename, activeCode, isAutoDetectActive, manualLangOverride, externalLanguage]);

  // Handler to manually override the detected language & update LanguageContext
  const handleLanguageSelect = useCallback((val: string) => {
    setManualLangOverride(val);
    const isAuto = val === 'auto';
    setIsAutoDetectActive(isAuto);

    // Update global LanguageContext
    if (langContext) {
      if (langContext.setEditorLanguage) {
        langContext.setEditorLanguage(val);
      }
      if (langContext.setCodeLanguage) {
        langContext.setCodeLanguage(val);
      }
    }

    if (isAuto) {
      setActionFeedback(`⚡ Switched to Real-Time Auto-Detection Mode`);
      // Re-trigger auto-detect notification
      setDetectionNotice(`Auto-Detected: ${detectedResult.name} (${detectedResult.confidence}% confidence)`);
    } else {
      const def = SUPPORTED_LANGUAGES[val];
      const langDisplayName = def ? def.name : val;
      setActionFeedback(`🔒 Manual Override: ${langDisplayName} (LanguageContext Updated)`);
      if (externalSetLanguage) {
        externalSetLanguage(def ? def.monacoId : val);
      }
    }

    setTimeout(() => setActionFeedback(null), 3000);
  }, [detectedResult, externalSetLanguage, langContext]);

  // Handler to reset manual lock back to auto-detection
  const handleResetToAutoDetect = useCallback(() => {
    handleLanguageSelect('auto');
  }, [handleLanguageSelect]);

  // Sync auto-detected language to LanguageContext when in auto-detection mode
  useEffect(() => {
    if (isAutoDetectActive && detectedResult.id && langContext) {
      if (langContext.setEditorLanguage) {
        langContext.setEditorLanguage(detectedResult.id);
      }
      if (langContext.setCodeLanguage) {
        langContext.setCodeLanguage(detectedResult.id);
      }
    }
  }, [detectedResult.id, isAutoDetectActive, langContext]);

  // 2. Derive Optimized Editor Configuration from Detected Language
  const editorConfig: EditorConfigurationProfile = useMemo(() => {
    return LanguageEditorConfigurator.getConfiguration(detectedResult);
  }, [detectedResult]);

  // 3. Language-Specific Error Diagnostics Check
  const diagnostics: DiagnosticError[] = useMemo(() => {
    return LanguageErrorChecker.checkErrors(activeCode, detectedResult.id);
  }, [activeCode, detectedResult.id]);

  const errorCount = useMemo(() => diagnostics.filter(d => d.severity === 'error').length, [diagnostics]);
  const warningCount = useMemo(() => diagnostics.filter(d => d.severity === 'warning').length, [diagnostics]);

  // 4. Available Language-Specific Completions & Snippets
  const languageCompletions: LanguageCompletionItem[] = useMemo(() => {
    return LanguageCompletionProvider.getCompletions(detectedResult.monacoId);
  }, [detectedResult.monacoId]);

  // 5. Tailored AI Suggestions, Quick Actions & Cheat Sheet for Detected Language
  const tailoredSuggestions: AISuggestionItem[] = useMemo(() => {
    return LanguageAISuggestionTailorer.getTailoredSuggestions(detectedResult.id, activeCode);
  }, [detectedResult.id, activeCode]);

  const tailoredQuickActions: AIQuickAction[] = useMemo(() => {
    return LanguageAISuggestionTailorer.getQuickActions(detectedResult.id);
  }, [detectedResult.id]);

  const languageCheatSheet: LanguageCheatSheet = useMemo(() => {
    return LanguageAISuggestionTailorer.getCheatSheet(detectedResult.id);
  }, [detectedResult.id]);

  // Merge language profile editor config with per-project settings
  const mergedMonacoOptions = useMemo(() => {
    const baseOptions = LanguageEditorConfigurator.getMonacoOptions(editorConfig);
    const projSettings = currentProject?.settings;
    if (!projSettings) return baseOptions;

    return {
      ...baseOptions,
      tabSize: projSettings.tabSize || baseOptions.tabSize,
      fontSize: projSettings.fontSize || baseOptions.fontSize || 14,
      wordWrap: projSettings.wordWrap || baseOptions.wordWrap || 'on',
      formatOnType: projSettings.formatOnSave,
    };
  }, [editorConfig, currentProject?.settings]);

  // Syntax Error Diagnostic Tooltip & Quick-Fix State
  const [activeDiagnosticTooltip, setActiveDiagnosticTooltip] = useState<{
    diagnostic: DiagnosticError;
    position: { top: number; left: number };
  } | null>(null);
  const [isFixingDiagnostic, setIsFixingDiagnostic] = useState(false);

  // Fix Single Error with AI
  const handleFixWithAI = useCallback((diag: DiagnosticError) => {
    setIsFixingDiagnostic(true);
    try {
      const fixedCode = LanguageErrorChecker.applyQuickFix(activeCode, diag);
      updateCode(fixedCode);
      setActionFeedback(`✨ Fixed: ${diag.suggestion || diag.message}`);
      setActiveDiagnosticTooltip(null);
    } catch (err) {
      console.error('Error applying AI fix:', err);
      setActionFeedback(`❌ Failed to apply AI fix`);
    } finally {
      setIsFixingDiagnostic(false);
      setTimeout(() => setActionFeedback(null), 3000);
    }
  }, [activeCode, updateCode]);

  // Fix All Syntax Errors with AI
  const handleFixAllErrorsWithAI = useCallback(() => {
    if (diagnostics.length === 0) return;
    setIsFixingDiagnostic(true);
    try {
      const { code: fixedCode, fixedCount } = LanguageErrorChecker.applyAllQuickFixes(activeCode, diagnostics);
      updateCode(fixedCode);
      setActionFeedback(`✨ AI fixed ${fixedCount} syntax error(s) across file`);
      setActiveDiagnosticTooltip(null);
    } catch (err) {
      console.error('Error applying batch AI fixes:', err);
      setActionFeedback(`❌ Failed to batch fix errors`);
    } finally {
      setIsFixingDiagnostic(false);
      setTimeout(() => setActionFeedback(null), 3500);
    }
  }, [activeCode, diagnostics, updateCode]);

  // Sync Monaco markers and register completion provider & error quick fix providers
  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      LanguageCompletionProvider.registerWithMonaco(monacoRef.current, detectedResult.monacoId);
      LanguageErrorChecker.applyMonacoMarkers(monacoRef.current, editorRef.current, diagnostics);
      LanguageErrorChecker.registerMonacoProviders(monacoRef.current, detectedResult.monacoId, (diag) => {
        handleFixWithAI(diag);
      });
    }
  }, [detectedResult.monacoId, diagnostics, handleFixWithAI]);

  // Sync language back to parent if provided
  useEffect(() => {
    if (externalSetLanguage && detectedResult.monacoId) {
      externalSetLanguage(detectedResult.monacoId);
    }
  }, [detectedResult.monacoId, externalSetLanguage]);

  // Show notice on detection change
  useEffect(() => {
    setDetectionNotice(`Auto-Detected: ${detectedResult.name} (${detectedResult.confidence}% confidence)`);
    const timer = setTimeout(() => setDetectionNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [detectedResult.name, activeFilename]);
  
  const [showSearch, setShowSearch] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [currentMatch, setCurrentMatch] = useState(0);

  // IDE Layout State & Diagnostics Panel
  const [bottomPanelTab, setBottomPanelTab] = useState<'none' | 'problems' | 'completions' | 'ai_copilot'>('none');
  const [isPoppedOut, setIsPoppedOut] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // AI Suggestion State
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [cursorPos, setCursorPos] = useState({ top: 0, left: 0 });
  const [enterPresses, setEnterPresses] = useState(0);

  // Update matches whenever code or findText changes
  useEffect(() => {
    if (!editorRef.current || !findText) {
      setMatches([]);
      setCurrentMatch(0);
      return;
    }
    const model = editorRef.current.getModel();
    if (!model) return;

    const foundMatches = model.findMatches(findText, false, false, false, null, true);
    setMatches(foundMatches);
    
    if (foundMatches.length > 0) {
      if (currentMatch === 0 || currentMatch > foundMatches.length) {
        setCurrentMatch(1);
        highlightMatch(foundMatches[0]);
      } else {
        highlightMatch(foundMatches[currentMatch - 1]);
      }
    } else {
      setCurrentMatch(0);
    }
  }, [findText, activeCode]);

  const highlightMatch = (match: any) => {
    if (editorRef.current && match) {
      editorRef.current.revealRangeInCenterIfOutsideViewport(match.range);
      editorRef.current.setSelection(match.range);
    }
  };

  const handleNext = () => {
    if (matches.length === 0) return;
    const nextIdx = currentMatch >= matches.length ? 1 : currentMatch + 1;
    setCurrentMatch(nextIdx);
    highlightMatch(matches[nextIdx - 1]);
  };

  const handlePrev = () => {
    if (matches.length === 0) return;
    const prevIdx = currentMatch <= 1 ? matches.length : currentMatch - 1;
    setCurrentMatch(prevIdx);
    highlightMatch(matches[prevIdx - 1]);
  };

  const replaceCurrent = () => {
    if (matches.length === 0 || currentMatch === 0 || !editorRef.current) return;
    const editor = editorRef.current;
    const matchToReplace = matches[currentMatch - 1];

    editor.executeEdits('custom-replace', [{
      range: matchToReplace.range,
      text: replaceText,
      forceMoveMarkers: true
    }]);
  };

  const replaceAll = () => {
    if (matches.length === 0 || !editorRef.current) return;
    const editor = editorRef.current;
    
    const edits = matches.map(m => ({
      range: m.range,
      text: replaceText,
      forceMoveMarkers: true
    }));
    
    editor.executeEdits('custom-replace-all', edits);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateCode(value);
    }
  };

  const handleSwitchFile = (file: { name: string; lang: string; code: string }) => {
    setActiveFilename(file.name);
    updateCode(file.code);
    setIsAutoDetectActive(true);
    setManualLangOverride('auto');
  };

  const handleCreateNewFile = (customName?: string) => {
    const rawName = (customName || newFileNameInput || '').trim();
    if (!rawName) return;

    // Check if filename already exists
    if (openFiles.some(f => f.name.toLowerCase() === rawName.toLowerCase())) {
      setActionFeedback(`⚠️ File "${rawName}" already exists!`);
      setTimeout(() => setActionFeedback(null), 3000);
      return;
    }

    const detected = LanguageDetectorEngine.detect(rawName, '', undefined);
    const newFileObj = {
      name: rawName,
      lang: detected.id || 'typescript',
      code: `// ${rawName} - Created in ${currentProject.name}\n\n`,
      isEntry: false
    };

    const nextFiles = [...openFiles, newFileObj];
    setOpenFiles(nextFiles);
    setActiveFilename(rawName);
    updateCode(newFileObj.code);
    setIsAutoDetectActive(true);
    setManualLangOverride('auto');
    setIsCreatingNewFile(false);
    setNewFileNameInput('');

    // Save into CodeProjectManager
    CodeProjectManager.saveActiveProjectFiles(nextFiles, rawName);
    setActionFeedback(`✨ Created new file "${rawName}"`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleDeleteFile = (fileNameToDelete: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (openFiles.length <= 1) {
      setActionFeedback(`⚠️ Cannot delete the only file in the project`);
      setTimeout(() => setActionFeedback(null), 3000);
      return;
    }

    const nextFiles = openFiles.filter(f => f.name !== fileNameToDelete);
    setOpenFiles(nextFiles);

    if (activeFilename === fileNameToDelete) {
      const fallback = nextFiles[0];
      setActiveFilename(fallback.name);
      updateCode(fallback.code);
      setIsAutoDetectActive(true);
      setManualLangOverride('auto');
    }

    CodeProjectManager.saveActiveProjectFiles(nextFiles, activeFilename === fileNameToDelete ? nextFiles[0].name : activeFilename);
    setActionFeedback(`🗑️ Deleted "${fileNameToDelete}"`);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content !== undefined) {
        setActiveFilename(file.name);
        updateCode(content);
        setIsAutoDetectActive(true);
        setManualLangOverride('auto');

        // Add to open tabs if not already present
        if (!openFiles.some(f => f.name === file.name)) {
          const nextFiles = [...openFiles, { name: file.name, lang: 'auto', code: content }];
          setOpenFiles(nextFiles);
          CodeProjectManager.saveActiveProjectFiles(nextFiles, file.name);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleEditorDidMount = (editor: any, monacoInstance: any) => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    // Register completion provider for detected language
    LanguageCompletionProvider.registerWithMonaco(monacoInstance, detectedResult.monacoId);
    LanguageErrorChecker.applyMonacoMarkers(monacoInstance, editor, diagnostics);
    LanguageErrorChecker.registerMonacoProviders(monacoInstance, detectedResult.monacoId, (diag) => {
      handleFixWithAI(diag);
    });

    // Search Override
    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyF, () => {
      setShowSearch(true);
      const selection = editor.getSelection();
      const model = editor.getModel();
      if (selection && !selection.isEmpty() && model) {
         setFindText(model.getValueInRange(selection));
      }
    });
    editor.addCommand(monacoInstance.KeyCode.Escape, () => setShowSearch(false));

    // Real-time Syntax Error Tooltip on Hovering over code squiggles
    let mouseHoverTimer: any;
    editor.onMouseMove((e: any) => {
      clearTimeout(mouseHoverTimer);
      if (!e.target || !e.target.position) return;
      const pos = e.target.position;
      
      mouseHoverTimer = setTimeout(() => {
        const model = editor.getModel();
        if (!model) return;
        const currentDiags = LanguageErrorChecker.checkErrors(model.getValue(), detectedResult.id);
        const matchingDiag = currentDiags.find(d => 
          d.line === pos.lineNumber && 
          pos.column >= Math.max(1, d.column - 3) && 
          pos.column <= (d.endColumn || d.column + 25)
        );

        if (matchingDiag) {
          const coords = editor.getScrolledVisiblePosition(pos);
          if (coords) {
            setActiveDiagnosticTooltip({
              diagnostic: matchingDiag,
              position: { top: coords.top + 24, left: Math.min(coords.left + 10, 480) }
            });
          }
        }
      }, 150);
    });

    // Dismiss floating error tooltip when scrolling editor
    editor.onDidScrollChange(() => {
      setActiveDiagnosticTooltip(null);
    });

    // 3x Enter Logic for AI Suggestion
    let enterCount = 0;
    let lastEnterTime = 0;

    editor.onKeyDown((e: any) => {
      if (e.keyCode === monacoInstance.KeyCode.Enter) {
        const now = Date.now();
        if (now - lastEnterTime < 800) {
          enterCount++;
        } else {
          enterCount = 1;
        }
        lastEnterTime = now;
        setEnterPresses(enterCount);

        if (enterCount >= 3) {
           e.preventDefault();
           e.stopPropagation();
           enterCount = 0;
           setEnterPresses(0);

           if (activeSuggestionRef.current) {
              const pos = editor.getPosition();
              const targetRange = new monacoInstance.Range(pos.lineNumber - 2 > 0 ? pos.lineNumber - 2 : pos.lineNumber, pos.column, pos.lineNumber, pos.column);
              
              editor.executeEdits('ai-suggestion', [{
                 range: targetRange,
                 text: activeSuggestionRef.current,
                 forceMoveMarkers: true
              }]);
              
              setShowSuggestion(false);
              setSuggestion(null);
              activeSuggestionRef.current = null;
           }
        }
      } else {
        enterCount = 0;
        setEnterPresses(0);
      }
    });

    // Tracking Cursor for Suggestion Overlay
    editor.onDidChangeCursorPosition((e: any) => {
      const position = e.position;
      const coords = editor.getScrolledVisiblePosition(position);
      if (coords) {
        setCursorPos({ top: coords.top, left: coords.left });
      }
    });

    let debounceTimer: any;
    editor.onDidChangeModelContent(() => {
      clearTimeout(debounceTimer);
      setShowSuggestion(false);
      
      debounceTimer = setTimeout(() => {
        const model = editor.getModel();
        const pos = editor.getPosition();
        if (!model || !pos) return;

        const currentLineText = model.getLineContent(pos.lineNumber);
        const precedingLines = model.getValueInRange({
          startLineNumber: Math.max(1, pos.lineNumber - 5),
          startColumn: 1,
          endLineNumber: pos.lineNumber,
          endColumn: pos.column
        });

        // Generate tailored suggestion for detected language
        const text = LanguageAISuggestionTailorer.generateContextualInlineSuggestion(
          detectedResult.id,
          currentLineText,
          precedingLines
        );

        if (text && text.trim().length > 0) {
          setSuggestion(text);
          activeSuggestionRef.current = text;
          setShowSuggestion(true);
        }
      }, 900);
    });
  };

  // Accept inline suggestion
  const handleAcceptInlineSuggestion = () => {
    if (!editorRef.current || !activeSuggestionRef.current) return;
    const pos = editorRef.current.getPosition();
    const range = new monacoRef.current.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column);

    editorRef.current.executeEdits('ai-suggestion', [{
      range,
      text: activeSuggestionRef.current,
      forceMoveMarkers: true
    }]);

    setShowSuggestion(false);
    setSuggestion(null);
    activeSuggestionRef.current = null;
    setActionFeedback('AI Suggestion applied');
    setTimeout(() => setActionFeedback(null), 2500);
  };

  // Jump to Diagnostic in Monaco and reveal the Floating AI Quick-Action Tooltip
  const handleJumpToDiagnostic = (diag: DiagnosticError) => {
    if (!editorRef.current) return;
    editorRef.current.revealLineInCenter(diag.line);
    editorRef.current.setPosition({ lineNumber: diag.line, column: diag.column });
    editorRef.current.focus();

    const coords = editorRef.current.getScrolledVisiblePosition({ lineNumber: diag.line, column: diag.column });
    if (coords) {
      setActiveDiagnosticTooltip({
        diagnostic: diag,
        position: { top: coords.top + 26, left: Math.min(coords.left + 15, 480) }
      });
    }
  };

  const handleApplyAutoFix = (diag: DiagnosticError) => {
    handleFixWithAI(diag);
  };

  const handleInsertSnippet = (snippet: LanguageCompletionItem) => {
    if (!editorRef.current || !monacoRef.current) return;
    const pos = editorRef.current.getPosition();
    const range = new monacoRef.current.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column);
    const cleanedSnippet = snippet.insertText.replace(/\$\{\d+:?([^}]*)\}/g, '$1').replace(/\$0/g, '');
    
    editorRef.current.executeEdits('insert-snippet', [{
      range,
      text: cleanedSnippet,
      forceMoveMarkers: true
    }]);
    editorRef.current.focus();
  };

  const handleInsertTailoredCode = (codeToInsert: string) => {
    if (!editorRef.current || !monacoRef.current) return;
    const pos = editorRef.current.getPosition();
    const range = new monacoRef.current.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column);

    editorRef.current.executeEdits('insert-tailored-ai', [{
      range,
      text: '\n' + codeToInsert + '\n',
      forceMoveMarkers: true
    }]);
    editorRef.current.focus();
    setActionFeedback(`Inserted ${detectedResult.name} snippet`);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  // Run AI Quick Actions
  const handleExecuteQuickAction = (action: AIQuickAction) => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
      if (action.id.includes('refactor')) {
        const refactored = LanguageAISuggestionTailorer.refactorCode(activeCode, detectedResult.id);
        updateCode(refactored);
        setActionFeedback(`Code refactored to idiomatic ${detectedResult.name}`);
      } else if (action.id.includes('tests')) {
        const tests = LanguageAISuggestionTailorer.generateUnitTests(activeCode, detectedResult.id, activeFilename);
        updateCode(activeCode + '\n\n' + tests);
        setActionFeedback(`Generated ${detectedResult.name} test suite`);
      } else if (action.id.includes('types') || action.id.includes('docs')) {
        const withDocs = LanguageAISuggestionTailorer.addTypeAnnotations(activeCode, detectedResult.id);
        updateCode(withDocs);
        setActionFeedback(`Added type annotations & docstrings`);
      } else if (action.id.includes('optimize')) {
        const optimized = LanguageAISuggestionTailorer.optimizePerformance(activeCode, detectedResult.id);
        updateCode(optimized);
        setActionFeedback(`Performance optimizations applied for ${detectedResult.name}`);
      }
      setTimeout(() => setActionFeedback(null), 3000);
    }, 400);
  };

  // Run AI Prompt Code Generation
  const handleGeneratePromptCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiPromptInput.trim()) return;

    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
      const generatedSnippet = LanguageAISuggestionTailorer.generateFromPrompt(
        detectedResult.id,
        aiPromptInput.trim()
      );
      
      handleInsertTailoredCode(generatedSnippet);
      setAiPromptInput('');
    }, 450);
  };

  const handleUndo = () => editorRef.current?.trigger('keyboard', 'undo', null);
  const handleRedo = () => editorRef.current?.trigger('keyboard', 'redo', null);

  const beforeMount = (monaco: any) => {
    monaco.editor.defineTheme('nxs-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '58a6ff' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'comment', foreground: '888888' },
        { token: 'type', foreground: '7ee787' },
        { token: 'function', foreground: 'd2a8ff' }
      ],
      colors: {
        'editor.background': '#151515',
        'editor.lineHighlightBackground': '#222222',
        'editorLineNumber.foreground': '#666666',
        'editorIndentGuide.background': '#333333',
      }
    });
  };

  const content = (
    <div className="flex-1 flex flex-col w-full h-full bg-[#151515] font-sans text-[#b0b5bd] overflow-hidden">
      {/* File Tabs Switcher & Auto-Detection Status Bar */}
      <div className="bg-[#0e1014] border-b border-[#222] flex items-center justify-between px-2 shrink-0 h-10 overflow-x-auto select-none gap-2">
        {/* Left Section: Project Switcher Dropdown & File Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {/* Project Switcher Component */}
          <ProjectSwitcherDropdown
            activeProject={currentProject}
            onSwitchProject={handleSwitchProject}
            onOpenProjectManager={(tab) => {
              setProjectModalTab(tab || 'list');
              setIsProjectModalOpen(true);
            }}
          />

          <div className="w-[1px] h-5 bg-[#2a3040] mx-0.5 shrink-0" />

          {/* Project Files Tabs */}
          {openFiles.map((file) => {
            const isActive = activeFilename === file.name;
            const ext = file.name.split('.').pop() || '';
            return (
              <div
                key={file.name}
                className={`group px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-all border shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1e232b] text-white border-[#3b434f] font-semibold shadow-sm'
                    : 'bg-transparent hover:bg-[#161a20] text-[#8b949e] hover:text-[#c9d1d9] border-transparent'
                }`}
                onClick={() => handleSwitchFile(file)}
              >
                <FileCode2 size={12} className={isActive ? 'text-[#58a6ff]' : 'text-[#6e7681]'} />
                <span>{file.name}</span>
                <span className="text-[9px] uppercase font-mono px-1 py-0.2 bg-[#2d333b] text-[#8b949e] rounded">
                  {ext}
                </span>

                {openFiles.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteFile(file.name, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5 rounded transition-opacity"
                    title={`Delete ${file.name}`}
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            );
          })}

          {/* Inline New File Creator */}
          {isCreatingNewFile ? (
            <div className="flex items-center gap-1 bg-[#1a1f2c] border border-[#58a6ff] rounded px-1.5 py-0.5 shrink-0">
              <input
                type="text"
                autoFocus
                value={newFileNameInput}
                onChange={(e) => setNewFileNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateNewFile();
                  if (e.key === 'Escape') {
                    setIsCreatingNewFile(false);
                    setNewFileNameInput('');
                  }
                }}
                onBlur={() => {
                  if (newFileNameInput.trim()) handleCreateNewFile();
                  else setIsCreatingNewFile(false);
                }}
                placeholder="filename.ts"
                className="bg-transparent text-xs text-white placeholder:text-gray-500 outline-none w-28 font-mono"
              />
              <button
                onClick={() => handleCreateNewFile()}
                className="text-emerald-400 hover:text-emerald-300 p-0.5 cursor-pointer"
              >
                <Check size={11} />
              </button>
              <button
                onClick={() => {
                  setIsCreatingNewFile(false);
                  setNewFileNameInput('');
                }}
                className="text-gray-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X size={11} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingNewFile(true)}
              className="px-2 py-1 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white rounded text-[11px] flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
              title="Add a new file to the active project workspace"
            >
              <Plus size={11} className="text-emerald-400" />
              <span>+ File</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-1 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white rounded text-[11px] flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
            title="Open an external file from disk into this project"
          >
            <FolderOpen size={11} className="text-[#58a6ff]" />
            <span>Open...</span>
          </button>
        </div>

        {/* Right Tab Controls: Project Manager Modal & Detach / Studio Link */}
        <div className="flex items-center gap-1.5 pl-2 shrink-0">
          <button
            onClick={() => {
              setProjectModalTab('list');
              setIsProjectModalOpen(true);
            }}
            className="px-2.5 py-1 bg-[#1a2030] hover:bg-[#242d44] border border-[#3b476b] text-[#58a6ff] hover:text-white rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open Project Workspace Manager (Switch, Create, Settings, Backups)"
          >
            <FolderKanban size={12} />
            <span className="hidden sm:inline">Project Manager</span>
          </button>

          <button
            onClick={() => {
              if (onSelectTool) onSelectTool('LanguageDetectorStudio');
              else {
                window.dispatchEvent(new CustomEvent('switch-tool', { detail: 'LanguageDetectorStudio' }));
              }
            }}
            className="px-2 py-1 bg-[#1f6feb]/20 hover:bg-[#1f6feb]/30 border border-[#1f6feb]/40 text-[#58a6ff] rounded text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Open Language Auto-Detection Studio"
          >
            <Sparkles size={10} /> Auto-Detect
          </button>

          <button
            onClick={() => setIsPoppedOut(!isPoppedOut)}
            className={`cursor-pointer select-none transition-colors flex items-center gap-1 px-2 py-1 rounded border text-[10px] ${
              isPoppedOut
                ? 'bg-[#58a6ff]/20 border-[#58a6ff]/50 text-[#58a6ff]'
                : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-white'
            }`}
            title={isPoppedOut ? 'Restore Code Editor' : 'Pop out Code Editor'}
          >
            <ExternalLink size={10} /> {isPoppedOut ? 'Restore' : 'Pop Out'}
          </button>
        </div>
      </div>

      {/* Breadcrumbs & Dynamic Language Settings Bar */}
      <div className="bg-[#101012] border-b border-[#222] flex items-center px-4 shrink-0 text-[10px] text-[#888] gap-2 shadow-sm relative z-10 hidden md:flex flex-wrap h-10">
         <span>src</span> <ChevronRight size={10} className="opacity-50" /> 
         <span>components</span> <ChevronRight size={10} className="opacity-50" /> 
         <span className="text-[#fff] font-mono">{activeFilename}</span>
         
         <div className="w-[1px] h-[14px] bg-[#333] mx-1"></div>
         
         {/* Live Language Detection Status Badge */}
         <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all ${
           isAutoDetectActive 
             ? 'bg-[#161b22] border-[#30363d] text-white' 
             : 'bg-[#8957e5]/10 border-[#8957e5]/40 text-[#d2a8ff]'
         }`}>
            <span 
              className="w-2 h-2 rounded-full inline-block shrink-0" 
              style={{ backgroundColor: detectedResult.color }} 
            />
            <span className="text-white font-bold">{detectedResult.name}</span>
            {isAutoDetectActive ? (
              <>
                <span className="text-[#3fb950] font-mono font-semibold">({detectedResult.confidence}%)</span>
                <span className="text-[9px] uppercase px-1 bg-[#21262d] text-[#8b949e] rounded font-mono">
                  {detectedResult.method}
                </span>
              </>
            ) : (
              <span className="text-[9px] uppercase px-1 bg-[#8957e5]/30 text-[#d2a8ff] rounded font-mono flex items-center gap-0.5">
                <Lock size={8} /> Override
              </span>
            )}
         </div>

         {/* Language Selection & Manual Override Dropdown (Syncs with LanguageContext) */}
         <div className="flex items-center gap-1 bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff]/60 px-1.5 py-0.5 rounded transition-colors">
            <Languages size={12} className="text-[#58a6ff] shrink-0" />
            <select
               value={manualLangOverride}
               onChange={(e) => handleLanguageSelect(e.target.value)}
               className="bg-transparent text-[#c9d1d9] text-[10px] font-medium outline-none cursor-pointer pr-1"
               title="Select programming language or override auto-detection (Updates LanguageContext)"
            >
               <option value="auto" className="bg-[#161b22] text-[#3fb950] font-bold">
                 ⚡ Auto-Detect Language (Active: {detectedResult.name})
               </option>
               {categorizedLanguages.map(cat => (
                 <optgroup key={cat.key} label={`─── ${cat.label} ───`} className="bg-[#161b22] text-[#58a6ff] font-semibold">
                   {cat.items.map(lang => (
                     <option key={lang.id} value={lang.id} className="bg-[#0d1117] text-[#c9d1d9] font-normal">
                       {lang.name} {lang.extensions && lang.extensions.length > 0 ? `(${lang.extensions.slice(0, 2).join(', ')})` : ''}
                     </option>
                   ))}
                 </optgroup>
               ))}
            </select>
            {!isAutoDetectActive && (
              <button
                onClick={handleResetToAutoDetect}
                className="px-1.5 py-0.2 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#3fb950] rounded text-[9px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset to Auto-Detection Mode"
              >
                <RefreshCw size={9} /> Auto
              </button>
            )}
         </div>

         {/* Code Tools */}
         <div className="flex items-center gap-1 font-sans font-bold uppercase tracking-wider ml-1">
             <button 
                 onClick={() => {
                   if (editorRef.current) {
                     editorRef.current.getAction('editor.action.formatDocument')?.run();
                     alert(`Code formatted using ${editorConfig.formatterName}`);
                   }
                 }}
                 className="bg-[#1a1b1f] border border-[#30363d] hover:border-[#58a6ff] hover:text-[#58a6ff] text-[#8b949e] px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
             >
                 <TerminalSquare size={10}/> Format ({editorConfig.formatterName})
             </button>
             <button 
                 onClick={() => alert(`AST Syntax Tree Analysis for ${detectedResult.name}:\n\n- Lines of Code: ${detectedResult.lineCount}\n- Buffer Size: ${detectedResult.byteSize} bytes\n- Monaco Tokenizer: ${editorConfig.monacoLanguage}\n- Indentation: ${editorConfig.tabSize} spaces\n- Linter Target: ${editorConfig.linterName}\n\nStatus: AST and Syntax Highlighting fully synchronized.`)}
                 className="bg-[#1a1b1f] border border-[#30363d] hover:border-[#3fb950] hover:text-[#3fb950] text-[#8b949e] px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
             >
                 <Copy size={10}/> AST Details
             </button>
         </div>

         {/* Status items */}
         <span className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#21262d] border border-[#30363d] text-[#c9d1d9] px-1.5 py-0.5 rounded font-mono text-[9px]">
                 Syntax: <span className="text-[#58a6ff] font-bold">{editorConfig.monacoLanguage}</span> | Tab: {editorConfig.tabSize} spaces | {editorConfig.encoding}
            </div>
            
            {/* Problems Drawer Trigger Button */}
            <button
               onClick={() => setBottomPanelTab(prev => prev === 'problems' ? 'none' : 'problems')}
               className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-bold transition-all cursor-pointer ${
                 errorCount > 0
                   ? 'bg-[#f85149]/20 border-[#f85149]/50 text-[#f85149] animate-pulse'
                   : warningCount > 0
                   ? 'bg-[#d29922]/20 border-[#d29922]/50 text-[#d29922]'
                   : 'bg-[#238636]/20 border-[#238636]/40 text-[#3fb950]'
               }`}
               title="Toggle Problems and Error Diagnostics Drawer"
            >
               {errorCount > 0 ? (
                 <>
                   <AlertCircle size={11} /> {errorCount} Error{errorCount > 1 ? 's' : ''}
                 </>
               ) : warningCount > 0 ? (
                 <>
                   <AlertTriangle size={11} /> {warningCount} Warning{warningCount > 1 ? 's' : ''}
                 </>
               ) : (
                 <>
                   <ShieldCheck size={11} /> 0 Errors
                 </>
               )}
            </button>

            {/* Completions & Snippets Trigger Button */}
            <button
               onClick={() => setBottomPanelTab(prev => prev === 'completions' ? 'none' : 'completions')}
               className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold transition-colors cursor-pointer ${
                 bottomPanelTab === 'completions'
                   ? 'bg-[#58a6ff]/20 border-[#58a6ff]/50 text-[#58a6ff]'
                   : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-white'
               }`}
               title="View Language-Specific Code Completions & Snippets"
            >
               <Zap size={11} className="text-[#e3b341]" /> Snippets ({languageCompletions.length})
            </button>

            {/* AI Language Copilot Drawer Trigger Button */}
            <button
               onClick={() => setBottomPanelTab(prev => prev === 'ai_copilot' ? 'none' : 'ai_copilot')}
               className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-[10px] font-bold transition-all cursor-pointer ${
                 bottomPanelTab === 'ai_copilot'
                   ? 'bg-[#bc8cff]/30 border-[#bc8cff]/70 text-[#d2a8ff] shadow-sm'
                   : 'bg-[#bc8cff]/10 border-[#bc8cff]/30 text-[#bc8cff] hover:bg-[#bc8cff]/20'
               }`}
               title={`Open AI Copilot for ${detectedResult.name}`}
            >
               <Sparkles size={11} className="text-[#bc8cff]" /> AI {detectedResult.name} Copilot
            </button>
         </span>
      </div>

      {/* Mobile/Compact Language Settings Bar */}
      <div className="bg-[#101012] border-b border-[#222] flex md:hidden items-center justify-between px-3 shrink-0 text-[10px] text-[#888] gap-2 h-8">
        <div className="flex items-center gap-1.5 min-w-0">
          <span 
            className="w-2 h-2 rounded-full inline-block shrink-0" 
            style={{ backgroundColor: detectedResult.color }} 
          />
          <span className="text-[#fff] font-mono truncate max-w-[120px]">{activeFilename}</span>
          <span className="text-[#58a6ff] text-[9px] font-bold">[{detectedResult.name}]</span>
        </div>
        <div className="flex items-center gap-1">
          <Languages size={11} className="text-[#58a6ff] shrink-0" />
          <select
            value={manualLangOverride}
            onChange={(e) => handleLanguageSelect(e.target.value)}
            className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[9px] px-1.5 py-0.5 rounded outline-none cursor-pointer max-w-[140px]"
          >
            <option value="auto">⚡ Auto ({detectedResult.name})</option>
            {Object.values(SUPPORTED_LANGUAGES).map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
          {!isAutoDetectActive && (
            <button
              onClick={handleResetToAutoDetect}
              className="px-1 py-0.5 bg-[#21262d] text-[#3fb950] rounded text-[8px] flex items-center gap-0.5"
              title="Reset to Auto-Detection"
            >
              <RefreshCw size={8} /> Auto
            </button>
          )}
        </div>
      </div>

      {/* Transient Detection or Action Toast */}
      {(detectionNotice || actionFeedback) && (
        <div className={`${actionFeedback ? 'bg-[#238636]/90' : 'bg-[#1f6feb]/90'} text-white text-[11px] px-4 py-1 flex items-center justify-between shadow-md transition-all`}>
          <div className="flex items-center gap-2">
            <FileCheck size={13} />
            <span>{actionFeedback || detectionNotice}</span>
            <span className="opacity-75 font-mono">| Tab Size: {editorConfig.tabSize} spaces | Syntax: {editorConfig.monacoLanguage}</span>
          </div>
          <button onClick={() => { setDetectionNotice(null); setActionFeedback(null); }} className="text-white hover:opacity-75">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Main Monaco Engine */}
      <div className="flex-1 relative bg-[#151515] flex flex-col min-h-0">
         <div className="flex-1 relative">
            <Editor
               height="100%"
               language={editorConfig.monacoLanguage}
               value={activeCode}
               theme="nxs-dark"
               beforeMount={beforeMount}
               onChange={handleEditorChange}
               onMount={handleEditorDidMount}
               options={mergedMonacoOptions}
            />

            {/* AI Suggestion Inline Overlay */}
            {showSuggestion && suggestion && (
               <div 
                 className="absolute pointer-events-auto z-10 font-mono text-[14px] leading-relaxed flex"
                 style={{ 
                    top: `${cursorPos.top + 16}px`, 
                    left: `${cursorPos.left + 64}px`,
                 }}
               >
                 <div className="flex flex-col relative">
                    <pre className="text-[#888]/60 m-0 select-none">
                       {suggestion}
                    </pre>
                    <div className="absolute -left-3 -top-2 w-px h-full bg-[#bc8cff]/40"></div>
                    <div className="absolute top-full left-0 mt-2 bg-[#161b22] border border-[#bc8cff]/50 text-[#bc8cff] text-[10px] font-bold px-2 py-1 flex items-center gap-2 shadow-xl rounded-[4px] backdrop-blur-md">
                       <Sparkles size={12} className="text-[#bc8cff]" />
                       <span>{detectedResult.name} AI Suggestion</span>
                       <button
                         onClick={handleAcceptInlineSuggestion}
                         className="bg-[#bc8cff] hover:bg-[#d2a8ff] text-black px-2 py-0.5 rounded font-sans font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                       >
                         <Check size={11} /> Accept (Tab / 3x Enter)
                       </button>
                       <button
                         onClick={() => { setShowSuggestion(false); setSuggestion(null); }}
                         className="text-[#8b949e] hover:text-white p-0.5 cursor-pointer"
                         title="Dismiss"
                       >
                         <X size={11} />
                       </button>
                    </div>
                 </div>
               </div>
            )}

            {/* Syntax Error Diagnostic Floating Tooltip Widget */}
            {activeDiagnosticTooltip && (
              <SyntaxErrorTooltipWidget
                diagnostic={activeDiagnosticTooltip.diagnostic}
                position={activeDiagnosticTooltip.position}
                languageName={detectedResult.name}
                onFixWithAI={handleFixWithAI}
                onExplainWithAI={(diag) => {
                  setBottomPanelTab('ai_copilot');
                  setAiPromptInput(`Explain this ${detectedResult.name} syntax error: "${diag.message}" (Rule: ${diag.code}) on line ${diag.line}`);
                  setActiveDiagnosticTooltip(null);
                }}
                onDismiss={() => setActiveDiagnosticTooltip(null)}
                onJumpToLine={(line, col) => {
                  if (editorRef.current) {
                    editorRef.current.revealLineInCenter(line);
                    editorRef.current.setPosition({ lineNumber: line, column: col });
                    editorRef.current.focus();
                  }
                }}
                isFixing={isFixingDiagnostic}
              />
            )}

            {/* Custom Find & Replace Bar Overlay */}
            {showSearch && (
               <div className="absolute top-0 right-4 z-20 bg-[#151515] border border-[#222] border-t-0 shadow-lg p-2 w-[320px] flex flex-col gap-2 transition-all animate-in fade-in slide-in-from-top-2 rounded-b-[2px]">
                  {/* Find Row */}
                  <div className="flex items-center gap-2">
                     <Search size={12} className="text-[#888] shrink-0" />
                     <div className="relative flex-1">
                        <input
                        type="text"
                        autoFocus
                        placeholder="Find"
                        value={findText}
                        onChange={(e) => setFindText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleNext(); }}
                        className="w-full bg-[#101012] border border-[#222] text-[#fff] text-[11px] pl-2 pr-12 py-1 rounded-[2px] outline-none focus:border-[#58a6ff] transition-colors"
                        />
                        <span className="absolute right-2 top-[3px] text-[9px] text-[#888]">
                        {findText ? (matches.length > 0 ? `${currentMatch} / ${matches.length}` : 'No results') : ''}
                        </span>
                     </div>
                     <div className="flex bg-[#101012] border border-[#222] rounded-[2px] shrink-0 overflow-hidden">
                        <button onClick={handlePrev} className="p-1 hover:bg-[#202022] text-[#888] hover:text-[#fff] border-r border-[#222] transition-colors"><ChevronUp size={12}/></button>
                        <button onClick={handleNext} className="p-1 hover:bg-[#202022] text-[#888] hover:text-[#fff] transition-colors"><ChevronDown size={12}/></button>
                     </div>
                     <button onClick={() => setShowSearch(false)} className="p-1 text-[#888] hover:text-[#f85149] rounded-[2px] hover:bg-[#202022] transition-colors shrink-0"><X size={12}/></button>
                  </div>
                  
                  {/* Replace Row */}
                  <div className="flex items-center gap-2">
                     <ReplaceIcon size={12} className="text-[#888] shrink-0" />
                     <div className="relative flex-1">
                        <input
                        type="text"
                        placeholder="Replace"
                        value={replaceText}
                        onChange={(e) => setReplaceText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') replaceCurrent(); }}
                        className="w-full bg-[#101012] border border-[#222] text-[#fff] text-[11px] pl-2 pr-2 py-1 rounded-[2px] outline-none focus:border-[#58a6ff] transition-colors"
                        />
                     </div>
                     <div className="flex items-center gap-1 shrink-0">
                        <button onClick={replaceCurrent} className="px-2 py-1 bg-[#202022] border border-[#222] hover:border-[#888] text-[#fff] rounded-[2px] text-[9px] font-bold uppercase transition-colors uppercase tracking-wider">Replace</button>
                        <button onClick={replaceAll} className="px-2 py-1 bg-[#202022] border border-[#222] hover:border-[#888] text-[#fff] rounded-[2px] text-[9px] font-bold uppercase transition-colors uppercase tracking-wider">All</button>
                     </div>
                  </div>
               </div>
            )}

            {/* Floating Editor Controls */}
            <div className="absolute top-4 right-6 z-10 flex items-center gap-3">
               <div className="bg-[#151515]/90 backdrop-blur-md border border-[#222] rounded-[2px] flex shadow-md overflow-hidden text-[#888]">
                  <button onClick={handleUndo} className="p-1.5 hover:bg-[#202022] hover:text-[#fff] border-r border-[#222] transition-colors" title="Undo (Cmd+Z)"><Undo size={12} /></button>
                  <button onClick={handleRedo} className="p-1.5 hover:bg-[#202022] hover:text-[#fff] border-r border-[#222] transition-colors" title="Redo (Cmd+Shift+Z)"><Redo size={12} /></button>
                  <button onClick={() => setShowSearch(!showSearch)} className="p-1.5 hover:bg-[#202022] hover:text-[#fff] transition-colors" title="Find and Replace (Cmd+F)"><Search size={12} /></button>
               </div>
            </div>
         </div>

         {/* Bottom Interactive Diagnostics / Snippets Drawer */}
         {bottomPanelTab !== 'none' && (
           <div className="h-56 bg-[#0d1117] border-t border-[#30363d] flex flex-col shrink-0">
             {/* Panel Header */}
             <div className="bg-[#161b22] px-3 py-1.5 border-b border-[#30363d] flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <button
                   onClick={() => setBottomPanelTab('problems')}
                   className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded transition-colors ${
                     bottomPanelTab === 'problems'
                       ? 'bg-[#1f6feb] text-white'
                       : 'text-[#8b949e] hover:text-white'
                   }`}
                 >
                   <Bug size={13} /> Problems ({diagnostics.length})
                 </button>
                 <button
                   onClick={() => setBottomPanelTab('completions')}
                   className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded transition-colors ${
                     bottomPanelTab === 'completions'
                       ? 'bg-[#1f6feb] text-white'
                       : 'text-[#8b949e] hover:text-white'
                   }`}
                 >
                   <Zap size={13} className="text-[#e3b341]" /> {detectedResult.name} Completions ({languageCompletions.length})
                 </button>
                 <button
                   onClick={() => setBottomPanelTab('ai_copilot')}
                   className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded transition-colors ${
                     bottomPanelTab === 'ai_copilot'
                       ? 'bg-[#8957e5] text-white'
                       : 'text-[#bc8cff] hover:text-white'
                   }`}
                 >
                   <Sparkles size={13} className="text-[#d2a8ff]" /> {detectedResult.name} AI Copilot
                 </button>
               </div>
               <div className="flex items-center gap-2">
                 {bottomPanelTab === 'problems' && diagnostics.length > 0 && (
                   <button
                     onClick={handleFixAllErrorsWithAI}
                     disabled={isFixingDiagnostic}
                     className="px-2.5 py-1 bg-gradient-to-r from-[#8957e5] to-[#6f42c1] hover:from-[#9a67ea] hover:to-[#7c4dff] text-white text-[11px] font-sans font-bold rounded flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
                     title="Automatically resolve all detected syntax issues using AI"
                   >
                     <Sparkles size={12} className="text-[#e2b714]" />
                     <span>{isFixingDiagnostic ? 'Fixing...' : `Fix All with AI (${diagnostics.length})`}</span>
                   </button>
                 )}
                 <button
                   onClick={() => setBottomPanelTab('none')}
                   className="p-1 text-[#8b949e] hover:text-white rounded hover:bg-[#30363d] transition-colors"
                   title="Close Panel"
                 >
                   <X size={13} />
                 </button>
               </div>
             </div>

             {/* Problems List View */}
             {bottomPanelTab === 'problems' && (
               <div className="flex-1 overflow-y-auto p-2 font-mono text-xs divide-y divide-[#21262d]">
                 {diagnostics.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-[#8b949e] py-6">
                     <ShieldCheck size={28} className="text-[#3fb950] mb-2" />
                     <p className="font-sans font-bold text-white text-sm">No Syntax Errors Detected</p>
                     <p className="font-sans text-xs text-[#8b949e]">Your {detectedResult.name} code passes all grammar and structure checks.</p>
                   </div>
                 ) : (
                   diagnostics.map((diag) => (
                     <div
                       key={diag.id}
                       className="py-1.5 px-2 hover:bg-[#161b22] rounded flex items-start justify-between gap-3 group transition-colors"
                     >
                       <div 
                         onClick={() => handleJumpToDiagnostic(diag)}
                         className="flex items-start gap-2.5 flex-1 cursor-pointer"
                       >
                         {diag.severity === 'error' ? (
                           <AlertCircle size={14} className="text-[#f85149] shrink-0 mt-0.5" />
                         ) : diag.severity === 'warning' ? (
                           <AlertTriangle size={14} className="text-[#d29922] shrink-0 mt-0.5" />
                         ) : (
                           <Info size={14} className="text-[#58a6ff] shrink-0 mt-0.5" />
                         )}
                         <div className="flex-1">
                           <div className="flex items-center gap-2">
                             <span className="text-[#e6edf3] font-medium">{diag.message}</span>
                             <span className="text-[10px] px-1 bg-[#21262d] text-[#8b949e] rounded font-semibold">
                               {diag.code}
                             </span>
                           </div>
                           {diag.suggestion && (
                             <div className="text-[11px] text-[#58a6ff] mt-0.5">
                               💡 Suggestion: {diag.suggestion}
                             </div>
                           )}
                         </div>
                       </div>

                       <div className="flex items-center gap-2 shrink-0">
                         {diag.autoFixable && (
                           <button
                             onClick={() => handleApplyAutoFix(diag)}
                             className="px-2 py-0.5 bg-[#238636] hover:bg-[#2ea043] text-white text-[10px] font-sans font-bold rounded flex items-center gap-1 transition-colors"
                             title="Automatically apply recommended fix"
                           >
                             <Wrench size={10} /> Auto-Fix
                           </button>
                         )}
                         <button
                           onClick={() => handleJumpToDiagnostic(diag)}
                           className="px-2 py-0.5 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#58a6ff] text-[10px] rounded transition-colors"
                         >
                           Ln {diag.line}, Col {diag.column}
                         </button>
                       </div>
                     </div>
                   ))
                 )}
               </div>
             )}

             {/* Completions & Snippets Browser View */}
             {bottomPanelTab === 'completions' && (
               <div className="flex-1 overflow-y-auto p-3 font-sans text-xs">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                   {languageCompletions.length === 0 ? (
                     <div className="col-span-full text-center text-[#8b949e] py-6">
                       No pre-packaged snippets registered for {detectedResult.name}.
                     </div>
                   ) : (
                     languageCompletions.map((item, idx) => (
                       <div
                         key={idx}
                         className="bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] p-2.5 rounded flex flex-col justify-between transition-all"
                       >
                         <div>
                           <div className="flex items-center justify-between mb-1">
                             <span className="font-mono font-bold text-[#58a6ff]">{item.label}</span>
                             <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#21262d] text-[#8b949e] rounded font-bold">
                               {item.kind}
                             </span>
                           </div>
                           <p className="text-[11px] text-[#e6edf3] font-medium mb-1">{item.detail}</p>
                           <p className="text-[10px] text-[#8b949e] leading-snug line-clamp-2">{item.documentation}</p>
                         </div>
                         <button
                           onClick={() => handleInsertSnippet(item)}
                           className="mt-2.5 w-full py-1 bg-[#21262d] hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] text-[10px] font-bold rounded flex items-center justify-center gap-1 transition-colors"
                         >
                           <Code2 size={11} /> Insert at Cursor
                         </button>
                       </div>
                     ))
                   )}
                 </div>
               </div>
             )}

             {/* AI Language Copilot View */}
             {bottomPanelTab === 'ai_copilot' && (
               <div className="flex-1 overflow-y-auto p-3 font-sans text-xs flex flex-col gap-3">
                 {/* Quick Actions Bar */}
                 <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#30363d]">
                   <span className="text-[#8b949e] font-mono text-[10px] uppercase font-bold mr-1">AI Quick Actions:</span>
                   {tailoredQuickActions.map(action => (
                     <button
                       key={action.id}
                       onClick={() => handleExecuteQuickAction(action)}
                       disabled={isAiGenerating}
                       className="px-2.5 py-1 bg-[#161b22] border border-[#30363d] hover:border-[#bc8cff] hover:text-[#d2a8ff] text-[#c9d1d9] rounded text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                       title={action.description}
                     >
                       <Sparkles size={11} className="text-[#bc8cff]" />
                       {action.label}
                     </button>
                   ))}
                 </div>

                 {/* Prompt Generator Input */}
                 <form onSubmit={handleGeneratePromptCode} className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] rounded p-1.5 focus-within:border-[#bc8cff]">
                   <Sparkles size={14} className="text-[#bc8cff] shrink-0 ml-1" />
                   <input
                     type="text"
                     value={aiPromptInput}
                     onChange={(e) => setAiPromptInput(e.target.value)}
                     placeholder={`Ask AI to generate ${detectedResult.name} code, functions, or tests...`}
                     className="flex-1 bg-transparent text-white text-xs outline-none placeholder-[#8b949e]"
                   />
                   <button
                     type="submit"
                     disabled={isAiGenerating || !aiPromptInput.trim()}
                     className="px-3 py-1 bg-[#8957e5] hover:bg-[#a371f7] text-white rounded text-[10px] font-bold flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                   >
                     {isAiGenerating ? 'Generating...' : 'Generate & Insert'}
                   </button>
                 </form>

                 {/* Language Specific Suggestions & Cheat Sheet */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {/* Language Suggestions */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded p-2.5 flex flex-col gap-1.5">
                     <span className="font-bold text-[#e6edf3] text-xs flex items-center gap-1.5">
                       <Check size={12} className="text-[#3fb950]" />
                       {detectedResult.name} AI Tailored Patterns ({tailoredSuggestions.length})
                     </span>
                     <div className="space-y-2 overflow-y-auto max-h-40 pr-1">
                       {tailoredSuggestions.map((sug) => (
                         <div key={sug.id} className="bg-[#21262d] border border-[#30363d] rounded p-2 flex flex-col gap-1">
                           <div className="flex items-center justify-between">
                             <span className="font-semibold text-white text-[11px]">{sug.title}</span>
                             <button
                               onClick={() => handleInsertTailoredCode(sug.codeSnippet)}
                               className="px-2 py-0.5 bg-[#8957e5] hover:bg-[#a371f7] text-white text-[9px] font-bold rounded flex items-center gap-1 cursor-pointer"
                             >
                               <Code2 size={10} /> Insert
                             </button>
                           </div>
                           <p className="text-[#8b949e] text-[10px] leading-snug">{sug.description}</p>
                           <p className="text-[#58a6ff] text-[9px] italic">{sug.explanation}</p>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Language Cheat Sheet */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded p-2.5 flex flex-col gap-1.5">
                     <span className="font-bold text-[#e6edf3] text-xs flex items-center gap-1.5">
                       <Code2 size={12} className="text-[#58a6ff]" />
                       {languageCheatSheet.languageName} Quick Reference
                     </span>
                     <div className="space-y-1 text-[11px] text-[#8b949e]">
                       <div><strong className="text-white">Paradigm:</strong> {languageCheatSheet.paradigm}</div>
                       <div><strong className="text-white">Type System:</strong> {languageCheatSheet.typeSystem}</div>
                       <div><strong className="text-white">Testing:</strong> {languageCheatSheet.testFramework}</div>
                     </div>
                     <div className="mt-1">
                       <span className="text-[10px] font-bold text-[#3fb950] uppercase tracking-wider block mb-1">Idiomatic Tips:</span>
                       <ul className="list-disc list-inside space-y-0.5 text-[#c9d1d9] text-[10px]">
                         {languageCheatSheet.idiomaticTips.map((tip, i) => (
                           <li key={i} className="leading-snug">{tip}</li>
                         ))}
                       </ul>
                     </div>
                   </div>
                 </div>
               </div>
             )}
           </div>
         )}
      </div>

      {/* Editor Status Bar */}
      <div className="bg-[#0e1014] border-t border-[#222] px-3 py-1 flex items-center justify-between text-[11px] text-[#8b949e] shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: detectedResult.color }} />
            <strong className="text-white">{detectedResult.name}</strong>
            <span className="text-[10px] text-[#3fb950] font-semibold font-mono">({detectedResult.confidence}%)</span>
          </span>
          <span>•</span>
          <span>Monaco: <strong className="text-[#58a6ff]">{editorConfig.monacoLanguage}</strong></span>
          <span>•</span>
          <span>Indent: {editorConfig.tabSize} spaces</span>
          <span>•</span>
          <button 
            onClick={() => setBottomPanelTab(prev => prev === 'problems' ? 'none' : 'problems')}
            className={`flex items-center gap-1 hover:underline cursor-pointer ${errorCount > 0 ? 'text-[#f85149]' : warningCount > 0 ? 'text-[#d29922]' : 'text-[#3fb950]'}`}
          >
            {errorCount > 0 ? <AlertCircle size={11} /> : <ShieldCheck size={11} />}
            {errorCount} errors, {warningCount} warnings
          </button>
          <span>•</span>
          <button 
            onClick={() => setBottomPanelTab(prev => prev === 'ai_copilot' ? 'none' : 'ai_copilot')}
            className="flex items-center gap-1 text-[#bc8cff] hover:underline cursor-pointer"
          >
            <Sparkles size={11} /> AI Copilot Active
          </button>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span>Linter: {editorConfig.linterName}</span>
          <span>•</span>
          <span>{editorConfig.encoding}</span>
          <span>•</span>
          <span>{editorConfig.lineEnding}</span>
        </div>
      </div>

      {/* Project Workspace Management Modal */}
      <ProjectWorkspaceModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        initialTab={projectModalTab}
        activeProjectId={currentProject.id}
        onSelectProject={handleSwitchProject}
      />
    </div>
  );

  if (isPoppedOut) {
    return (
      <>
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-[#0d1117] text-[#8b949e]">
           <FileCode2 size={48} className="mb-4 text-[#30363d]" />
           <p className="text-xl text-white font-bold tracking-widest uppercase mb-2">Code Editor Detached</p>
           <p className="text-[11px] mb-6">This panel is currently running in a separate window.</p>
           <button onClick={() => setIsPoppedOut(false)} className="px-4 py-2 bg-[#1f6feb] text-white rounded text-xs font-bold hover:bg-[#388bfd] transition-colors shadow-lg">
             Restore to Main Window
           </button>
        </div>
        <PopOutPanel title={activeFilename || 'Code Editor'} onClose={() => setIsPoppedOut(false)}>
          {content}
        </PopOutPanel>
      </>
    );
  }

  return content;
}


