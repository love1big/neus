import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Trophy, Target, Edit2, Save, X, Plus, Trash2, PieChart, Activity, Boxes, Code2, Music, ShieldCheck, Rocket, ChevronRight, CheckCircle, Percent, TrendingUp, Calendar, Flag, GripHorizontal, FileText, Copy, PlusCircle, Link, ZoomIn, ZoomOut, Maximize, Bell, BellRing } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { triggerNotification } from './NotificationSystem';
import MilestoneInspectorPanel from './MilestoneInspectorPanel';
import { AnimatePresence } from 'motion/react';

interface Metric {
  id: string;
  name: string;
  current: number;
  target: number;
}

interface Category {
  id: string;
  title: string;
  iconName: string;
  color: string;
  metrics: Metric[];
}

interface HistorySnapshot {
  timestamp: number;
  completed: number;
  remaining: number;
  target: number;
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface Milestone {
  id: string;
  title: string;
  timestamp: number;
  status: 'completed' | 'in-progress' | 'pending';
  dependencies?: string[];
  description?: string;
  subTasks?: SubTask[];
}

const defaultMilestones: Milestone[] = [
  { id: 'm1', title: 'Pre-production', timestamp: Date.now() - 30 * 24 * 3600 * 1000, status: 'completed', dependencies: [] },
  { id: 'm2', title: 'Vertical Slice', timestamp: Date.now() + 30 * 24 * 3600 * 1000, status: 'in-progress', dependencies: ['m1'] },
  { id: 'm3', title: 'Alpha Release', timestamp: Date.now() + 90 * 24 * 3600 * 1000, status: 'pending', dependencies: ['m2'] },
  { id: 'm4', title: 'Beta Release', timestamp: Date.now() + 150 * 24 * 3600 * 1000, status: 'pending', dependencies: ['m3'] },
  { id: 'm5', title: 'Gold Master', timestamp: Date.now() + 210 * 24 * 3600 * 1000, status: 'pending', dependencies: ['m4'] },
];

const defaultData: Category[] = [
  {
    id: "cat_1_gameplay",
    title: "1. Narrative, Quests & Items",
    iconName: "Target",
    color: "#58a6ff",
    metrics: [
      { id: "playtime", name: "Playtime (Hours)", current: 0, target: 40 },
      { id: "main_quests", name: "Main Quests", current: 0, target: 50 },
      { id: "side_quests", name: "Side Quests", current: 0, target: 120 },
      { id: "hidden_quests", name: "Hidden/Secret Quests", current: 0, target: 20 },
      { id: "std_items", name: "Standard Items", current: 0, target: 300 },
      { id: "quest_items", name: "Quest Items", current: 0, target: 150 },
      { id: "weapons", name: "Weapons (inc. Models)", current: 0, target: 100 },
      { id: "armor_torso", name: "Torso Armor (inc. Models)", current: 0, target: 50 },
      { id: "armor_arm", name: "Arm Armor (inc. Models)", current: 0, target: 50 },
      { id: "armor_leg", name: "Leg Armor (inc. Models)", current: 0, target: 50 },
      { id: "acc_1", name: "Accessory 1", current: 0, target: 40 },
      { id: "acc_2", name: "Accessory 2", current: 0, target: 40 },
      { id: "lore_docs", name: "Lore Documents", current: 0, target: 200 },
      { id: "dialogue_lines", name: "Dialogue/Voice Lines", current: 0, target: 5000 },
    ]
  },
  {
    id: "cat_2_world",
    title: "2. World & Assets",
    iconName: "Boxes",
    color: "#3fb950",
    metrics: [
      { id: "maps", name: "Total Maps", current: 0, target: 25 },
      { id: "special_zones", name: "Special Zones", current: 0, target: 10 },
      { id: "dungeons", name: "Dungeons", current: 0, target: 15 },
      { id: "mob_spawns", name: "Monster Spawn Points", current: 0, target: 500 },
      { id: "buildings", name: "Building/Castle Models", current: 0, target: 120 },
      { id: "mobs", name: "Monster Models", current: 0, target: 80 },
      { id: "npcs", name: "NPC Models", current: 0, target: 150 },
      { id: "chars", name: "Main/Sub Characters", current: 0, target: 30 },
      { id: "interactables", name: "Interactive Objects", current: 0, target: 300 },
      { id: "foliage", name: "Foliage/Environment Assets", current: 0, target: 250 },
    ]
  },
  {
    id: "cat_3_tech",
    title: "3. Tech, Systems & UI",
    iconName: "Code2",
    color: "#d29922",
    metrics: [
      { id: "core_sys", name: "Core Systems/Modules", current: 0, target: 40 },
      { id: "ui_pages", name: "UI/UX Screens", current: 0, target: 60 },
      { id: "loc_systems", name: "Code Modules Complete", current: 0, target: 100 },
      { id: "blueprints", name: "Visual Blueprints", current: 0, target: 200 },
      { id: "shaders", name: "Custom Shaders", current: 0, target: 45 },
      { id: "db_tables", name: "Database Tables", current: 0, target: 30 },
      { id: "ai_trees", name: "AI Behavior Trees", current: 0, target: 50 },
    ]
  },
  {
    id: "cat_4_audio",
    title: "4. Audio, Cinematics & VFX",
    iconName: "Music",
    color: "#f85149",
    metrics: [
      { id: "bgm", name: "BGM Tracks", current: 0, target: 45 },
      { id: "sfx", name: "SFX Assets", current: 0, target: 1500 },
      { id: "ambience", name: "Ambient Audio Zones", current: 0, target: 30 },
      { id: "cutscenes", name: "Cinematics/Cutscenes", current: 0, target: 25 },
      { id: "vfx", name: "Particle VFX", current: 0, target: 200 },
      { id: "post_proc", name: "Post-Processing Profiles", current: 0, target: 15 },
      { id: "foley", name: "Foley Sounds", current: 0, target: 500 },
      { id: "lipsync", name: "Lip-Sync Profiles", current: 0, target: 250 },
    ]
  },
  {
    id: "cat_5_qa",
    title: "5. QA, Optimization & Balance",
    iconName: "ShieldCheck",
    color: "#a371f7",
    metrics: [
      { id: "playtests", name: "Playtest Sessions", current: 0, target: 100 },
      { id: "bugs", name: "Bugs Fixed", current: 0, target: 1000 },
      { id: "perf_zones", name: "Performance Targets Achieved", current: 0, target: 25 },
      { id: "eco_bal", name: "Economy Balance Passes", current: 0, target: 10 },
      { id: "combat_bal", name: "Combat Balance Passes", current: 0, target: 20 },
      { id: "accessibility", name: "Accessibility Features", current: 0, target: 15 },
      { id: "mem_leaks", name: "Memory Leaks Patched", current: 0, target: 50 },
    ]
  },
  {
    id: "cat_6_marketing",
    title: "6. Publishing & LiveOps",
    iconName: "Rocket",
    color: "#05d6a0",
    metrics: [
      { id: "trailers", name: "Trailers & Promo Vids", current: 0, target: 5 },
      { id: "store_assets", name: "Store Screenshots/Assets", current: 0, target: 20 },
      { id: "locales", name: "Localization Languages", current: 0, target: 8 },
      { id: "dlc", name: "DLC / Expansion Plans", current: 0, target: 3 },
      { id: "achievements", name: "Achievements / Trophies", current: 0, target: 50 },
      { id: "devlogs", name: "Social Media Devlogs", current: 0, target: 52 },
      { id: "marketing", name: "Marketing Campaigns", current: 0, target: 4 },
      { id: "backend", name: "Server Backend Services", current: 0, target: 10 },
    ]
  }
];

const IconMap: Record<string, any> = {
  Target, Boxes, Code2, Music, ShieldCheck, Rocket, Trophy
};

export default function ProjectProgressDashboard() {
  const [data, setData] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Category[]>([]);
  const [history, setHistory] = useState<HistorySnapshot[]>([]);

  // Milestones State
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [editMilestones, setEditMilestones] = useState<Milestone[]>([]);
  const [isEditingMilestones, setIsEditingMilestones] = useState(false);
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [draggingMilestoneId, setDraggingMilestoneId] = useState<string | null>(null);
  const [trackWidth, setTrackWidth] = useState(1000);
  const [customViewRange, setCustomViewRange] = useState<{start: number, end: number} | null>(null);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>('default');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPerm(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotifPerm(perm);
      if (perm === 'granted') {
        triggerNotification('success', 'Notifications Enabled', 'You will now receive alerts for critical project health drops.', false);
      }
    }
  };

  const defaultTimelineRange = useMemo(() => {
    if (milestones.length === 0) return { start: 0, end: 0 };
    const allTimestamps = milestones.map(m => m.timestamp);
    let minDate = Math.min(...allTimestamps);
    let maxDate = Math.max(...allTimestamps);
    const padding = Math.max((maxDate - minDate) * 0.15, 30 * 24 * 3600 * 1000);
    return { start: minDate - padding, end: maxDate + padding };
  }, [milestones]);

  const minTimeline = customViewRange ? customViewRange.start : defaultTimelineRange.start;
  const maxTimeline = customViewRange ? customViewRange.end : defaultTimelineRange.end;

  const currentRangeRef = useRef(defaultTimelineRange);
  useEffect(() => {
    currentRangeRef.current = customViewRange || defaultTimelineRange;
  }, [customViewRange, defaultTimelineRange]);

  useEffect(() => {
    if (!timelineTrackRef.current) return;
    const observer = new ResizeObserver(entries => {
      setTrackWidth(entries[0].contentRect.width);
    });
    observer.observe(timelineTrackRef.current);
    return () => observer.disconnect();
  }, []);

  // Export State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportCopied, setExportCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('omni_project_progress');
    const savedHistory = localStorage.getItem('omni_project_progress_history');
    const savedMilestones = localStorage.getItem('omni_project_milestones');
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults in case of schema changes
        const merged = defaultData.map(defCat => {
          const savedCat = parsed.find((c: Category) => c.id === defCat.id);
          if (!savedCat) return defCat;
          return {
            ...defCat,
            metrics: defCat.metrics.map(defMet => {
              const savedMet = savedCat.metrics.find((m: Metric) => m.id === defMet.id);
              if (!savedMet) return defMet;
              return { ...defMet, current: savedMet.current, target: savedMet.target, name: savedMet.name };
            }).concat(savedCat.metrics.filter((m: Metric) => !defCat.metrics.find(dm => dm.id === m.id)))
          };
        });
        setData(merged);
      } catch (e) {
        setData(defaultData);
      }
    } else {
      setData(defaultData);
    }

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        setHistory([]);
      }
    }

    if (savedMilestones) {
      try {
        setMilestones(JSON.parse(savedMilestones));
      } catch (e) {
        setMilestones(defaultMilestones);
      }
    } else {
      setMilestones(defaultMilestones);
    }
  }, []);

  // Sync dragging logic for milestones
  useEffect(() => {
    if (!draggingMilestoneId) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!timelineTrackRef.current) return;
      const rect = timelineTrackRef.current.getBoundingClientRect();
      let percentX = (e.clientX - rect.left) / rect.width;
      
      const { start, end } = currentRangeRef.current;
      
      const rawTimestamp = start + percentX * (end - start);
      
      // Snap to grid (1 day intervals, 24 hours)
      const SNAP_INTERVAL = 24 * 3600 * 1000;
      const snappedTimestamp = Math.round(rawTimestamp / SNAP_INTERVAL) * SNAP_INTERVAL;
      
      setMilestones(prev => prev.map(m => 
        m.id === draggingMilestoneId ? { ...m, timestamp: snappedTimestamp } : m
      ));
    };

    const handlePointerUp = () => {
      setDraggingMilestoneId(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingMilestoneId, milestones]);

  // Persist milestones
  useEffect(() => {
    if (!draggingMilestoneId && milestones.length > 0) {
      localStorage.setItem('omni_project_milestones', JSON.stringify(milestones));
    }
  }, [milestones, draggingMilestoneId]);

  const { totalCurrent, totalTarget, overallPercent } = useMemo(() => {
    let curr = 0;
    let targ = 0;
    data.forEach(cat => {
      cat.metrics.forEach(m => {
        curr += m.current;
        targ += m.target;
      });
    });
    return {
      totalCurrent: curr,
      totalTarget: targ,
      overallPercent: targ > 0 ? Math.min(100, Math.round((curr / targ) * 100)) : 0
    };
  }, [data]);

  const projectHealth = useMemo(() => {
    if (milestones.length === 0) return { score: 0, status: 'Unknown', color: '#8b949e', bgColor: '#21262d' };
    
    const now = Date.now();
    let totalWeight = 0;
    let earnedWeight = 0;
    let overdueCount = 0;

    // Check linked milestones (dependencies) to calculate a more robust health score
    milestones.forEach(m => {
       totalWeight += 100;
       
       // Calculate dependency health multiplier
       let depMultiplier = 1;
       if (m.dependencies && m.dependencies.length > 0) {
         let depsCompleted = 0;
         m.dependencies.forEach(depId => {
           const dep = milestones.find(x => x.id === depId);
           if (dep && dep.status === 'completed') depsCompleted++;
           else if (dep && dep.status === 'in-progress') depsCompleted += 0.5;
         });
         depMultiplier = 0.5 + (0.5 * (depsCompleted / m.dependencies.length));
       }

       if (m.status === 'completed') {
         earnedWeight += 100;
       } else if (m.status === 'in-progress') {
         earnedWeight += 50 * depMultiplier;
         if (m.timestamp < now) overdueCount++;
       } else {
         if (m.timestamp < now) overdueCount++;
       }
    });

    const baseScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
    
    // Penalize for overdue milestones
    const penalty = overdueCount * 15;
    const finalScore = Math.max(0, baseScore - penalty);
    
    let status = 'Excellent';
    let color = '#3fb950'; // green
    let bgColor = '#238636';
    let icon = 'ShieldCheck';

    if (finalScore < 40 || overdueCount > 2) {
      status = 'Critical';
      color = '#f85149';
      bgColor = '#da3633';
      icon = 'Activity';
    } else if (finalScore < 70 || overdueCount > 0) {
      status = 'At Risk';
      color = '#d29922';
      bgColor = '#9e6a03';
      icon = 'TrendingUp';
    } else if (finalScore < 90) {
      status = 'Good';
      color = '#58a6ff';
      bgColor = '#1f6feb';
      icon = 'Activity';
    }
    
    return { score: finalScore, status, color, bgColor, overdueCount, baseScore, icon };
  }, [milestones]);

  const lastHealthStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (projectHealth.status === 'Critical' && lastHealthStatusRef.current !== 'Critical') {
      // Trigger notification if it just became critical
      triggerNotification(
        'critical', 
        'Project Health Alert', 
        `Warning: Project health has dropped to Critical level (Score: ${projectHealth.score}%). Please review overdue milestones immediately.`,
        true
      );
    }
    lastHealthStatusRef.current = projectHealth.status;
  }, [projectHealth.status, projectHealth.score]);

  // Handle initialization of history baseline if empty, or calculate projection
  const { chartData, projectedCompletionDate } = useMemo(() => {
    let baseHistory = [...history];
    const now = Date.now();
    
    // Seed baseline if empty to ensure the chart is visible immediately
    if (baseHistory.length === 0 && totalTarget > 0) {
      baseHistory = [
        { timestamp: now - (30 * 24 * 60 * 60 * 1000), completed: 0, remaining: totalTarget, target: totalTarget }
      ];
    }
    
    // Ensure current snapshot is represented
    if (baseHistory.length > 0 && totalTarget > 0) {
      const last = baseHistory[baseHistory.length - 1];
      // Only append "today" if it's been more than a minute or is a different value
      if (now - last.timestamp > 60000 || last.completed !== totalCurrent) {
        baseHistory.push({
          timestamp: now,
          completed: totalCurrent,
          remaining: Math.max(0, totalTarget - totalCurrent),
          target: totalTarget
        });
      }
    }

    if (baseHistory.length < 2 || totalTarget === 0) return { chartData: [], projectedCompletionDate: null };

    // Calculate velocity (tasks per day) based on first and last point
    const firstPoint = baseHistory[0];
    const lastPoint = baseHistory[baseHistory.length - 1];
    
    const timeDiffMs = lastPoint.timestamp - firstPoint.timestamp;
    const completedDiff = lastPoint.completed - firstPoint.completed;
    
    let chartNodes: any[] = baseHistory.map(h => ({
      dateStr: new Date(h.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      timestamp: h.timestamp,
      remaining: h.remaining,
      projected: h.remaining
    }));

    let estCompletionDate = null;

    if (timeDiffMs > 0 && completedDiff > 0 && lastPoint.remaining > 0) {
      const msPerTask = timeDiffMs / completedDiff;
      const msRemaining = msPerTask * lastPoint.remaining;
      const completionTime = lastPoint.timestamp + msRemaining;
      
      estCompletionDate = new Date(completionTime);

      // Add a projection point
      chartNodes.push({
        dateStr: estCompletionDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: completionTime,
        remaining: null,
        projected: 0
      });
    }

    return { chartData: chartNodes, projectedCompletionDate: estCompletionDate };
  }, [history, totalCurrent, totalTarget]);

  useEffect(() => {
    const container = timelineContainerRef.current;
    const track = timelineTrackRef.current;
    if (!container || !track) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = track.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      let percentX = cursorX / rect.width;
      
      const rangeVal = currentRangeRef.current.end - currentRangeRef.current.start;
      if (rangeVal <= 0) return;

      const zoomFactor = e.deltaY > 0 ? 1.15 : 0.85;
      
      const timeUnderCursor = currentRangeRef.current.start + rangeVal * percentX;
      
      const MAX_RANGE = 15 * 365 * 24 * 3600 * 1000; // 15 years max zoom out
      const MIN_RANGE = 7 * 24 * 3600 * 1000; // 7 days max zoom in
      
      let newRangeDuration = rangeVal * zoomFactor;
      if (newRangeDuration > MAX_RANGE) newRangeDuration = MAX_RANGE;
      if (newRangeDuration < MIN_RANGE) newRangeDuration = MIN_RANGE;
      
      const newStart = timeUnderCursor - newRangeDuration * percentX;
      const newEnd = timeUnderCursor + newRangeDuration * (1 - percentX);
      
      const newRange = { start: newStart, end: newEnd };
      currentRangeRef.current = newRange;
      setCustomViewRange(newRange);
    };

    let isPanning = false;
    let lastX = 0;

    const handlePointerDown = (e: PointerEvent) => {
       if ((e.target as HTMLElement).closest('.milestone-node')) return;
       if ((e.target as HTMLElement).tagName.toLowerCase() === 'button') return;
       
       isPanning = true;
       lastX = e.clientX;
       container.style.cursor = 'grabbing';
       container.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
       if (!isPanning) return;
       const rect = track.getBoundingClientRect();
       const deltaX = e.clientX - lastX;
       lastX = e.clientX;
       
       const rangeVal = currentRangeRef.current.end - currentRangeRef.current.start;
       const timePerPixel = rangeVal / rect.width;
       
       const timeShift = -deltaX * timePerPixel;
       
       const newRange = { start: currentRangeRef.current.start + timeShift, end: currentRangeRef.current.end + timeShift };
       currentRangeRef.current = newRange;
       setCustomViewRange(newRange);
    };

    const handlePointerUp = (e: PointerEvent) => {
       if (!isPanning) return;
       isPanning = false;
       container.style.cursor = '';
       container.releasePointerCapture(e.pointerId);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointercancel', handlePointerUp);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  const handleExportForAI = () => {
    let md = `# Project Progress Summary\n\n`;
    md += `**Overall Completion:** ${totalCurrent} / ${totalTarget} Tasks (${overallPercent}%)\n`;
    md += `**Project Health:** ${projectHealth.status} (Score: ${projectHealth.score}%, Overdue: ${projectHealth.overdueCount})\n\n`;
    
    md += `## Milestones\n`;
    milestones.forEach(m => {
      md += `- [${m.status === 'completed' ? 'x' : ' '}] **${m.title}**: ${new Date(m.timestamp).toLocaleDateString()} (${m.status})\n`;
      if (m.description) {
        md += `  - *Description:* ${m.description.replace(/\n/g, ' ')}\n`;
      }
      if (m.subTasks && m.subTasks.length > 0) {
        const comp = m.subTasks.filter(t => t.completed).length;
        md += `  - *Sub-tasks (${comp}/${m.subTasks.length}):*\n`;
        m.subTasks.forEach(st => {
          md += `    - [${st.completed ? 'x' : ' '}] ${st.title}\n`;
        });
      }
    });
    md += `\n`;

    md += `## Metrics Breakdown\n`;
    data.forEach(cat => {
      let catCur = 0; let catTarg = 0;
      cat.metrics.forEach(m => { catCur += m.current; catTarg += m.target; });
      md += `### ${cat.title} (${catCur}/${catTarg})\n`;
      cat.metrics.forEach(m => {
        md += `- [${m.current >= m.target ? 'x' : ' '}] ${m.name}: ${m.current} / ${m.target}\n`;
      });
      md += `\n`;
    });

    navigator.clipboard.writeText(md);
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2000);
  };

  const handleStartEdit = () => {
    setEditData(JSON.parse(JSON.stringify(data)));
    setIsEditing(true);
  };

  const handleStartMilestoneEdit = () => {
    setEditMilestones(JSON.parse(JSON.stringify(milestones)));
    setIsEditingMilestones(true);
  };

  const handleSaveMilestones = () => {
    // Sort milestones by date before saving
    const sorted = [...editMilestones].sort((a, b) => a.timestamp - b.timestamp);
    setMilestones(sorted);
    localStorage.setItem('omni_project_milestones', JSON.stringify(sorted));
    setIsEditingMilestones(false);
  };

  const handleMilestoneChange = (id: string, field: keyof Milestone, value: any) => {
    setEditMilestones(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleToggleDependency = (milestoneId: string, depId: string) => {
    setEditMilestones(prev => prev.map(m => {
      if (m.id !== milestoneId) return m;
      const deps = m.dependencies || [];
      return {
        ...m,
        dependencies: deps.includes(depId) ? deps.filter(d => d !== depId) : [...deps, depId]
      };
    }));
  };

  const handleAddMilestone = () => {
    const lastTimestamp = editMilestones.length > 0 ? Math.max(...editMilestones.map(m => m.timestamp)) : Date.now();
    setEditMilestones(prev => [...prev, {
      id: `m_${Date.now()}`,
      title: "New Milestone",
      timestamp: lastTimestamp + (30 * 24 * 3600 * 1000), // Default +30 days from last
      status: 'pending',
      dependencies: []
    }]);
  };

  const handleRemoveMilestone = (id: string) => {
    setEditMilestones(prev => prev.filter(m => m.id !== id));
  };

  const handleSave = () => {
    setData(editData);
    localStorage.setItem('omni_project_progress', JSON.stringify(editData));
    
    // Save snapshot to history
    let newTotalCurrent = 0;
    let newTotalTarget = 0;
    editData.forEach(cat => {
      cat.metrics.forEach(m => {
        newTotalCurrent += m.current;
        newTotalTarget += m.target;
      });
    });
    
    setHistory(prev => {
      const now = Date.now();
      let newHistory = [...prev];
      if (newHistory.length === 0) {
        newHistory.push({ timestamp: now - (30 * 24 * 60 * 60 * 1000), completed: 0, remaining: newTotalTarget, target: newTotalTarget });
      }
      
      const last = newHistory[newHistory.length - 1];
      // Only append if it's been a bit of time or value changed to avoid spamming same values
      if (now - last.timestamp > 60000 || last.completed !== newTotalCurrent) {
        newHistory.push({
          timestamp: now,
          completed: newTotalCurrent,
          remaining: Math.max(0, newTotalTarget - newTotalCurrent),
          target: newTotalTarget
        });
      }
      localStorage.setItem('omni_project_progress_history', JSON.stringify(newHistory));
      return newHistory;
    });

    setIsEditing(false);
  };

  const handleMetricChange = (catId: string, metricId: string, field: 'current' | 'target' | 'name', value: string | number) => {
    setEditData(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        metrics: cat.metrics.map(m => {
          if (m.id !== metricId) return m;
          return { ...m, [field]: value };
        })
      };
    }));
  };

  const addMetric = (catId: string) => {
    setEditData(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        metrics: [...cat.metrics, { id: `custom_${Date.now()}`, name: "New Metric", current: 0, target: 10 }]
      };
    }));
  };

  const removeMetric = (catId: string, metricId: string) => {
    setEditData(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        metrics: cat.metrics.filter(m => m.id !== metricId)
      };
    }));
  };

  const CircleProgress = ({ percentage, color }: { percentage: number, color: string }) => (
    <div className="relative w-20 h-20 shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#30363d" strokeWidth="8" />
        <circle 
          cx="50" cy="50" r="40" fill="transparent" 
          stroke={color} strokeWidth="8" 
          strokeDasharray="251.2" 
          strokeDashoffset={251.2 - (251.2 * percentage) / 100}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[16px] font-bold text-white leading-none">{percentage}%</span>
      </div>
    </div>
  );

  const displayData = isEditing ? editData : data;

  if (data.length === 0) return null;

  return (
    <div className="w-full h-full bg-[#0d1117] text-[#c9d1d9] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-8 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#58a6ff] via-[#3fb950] to-[#f85149]" />
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#d29922]">
            <Trophy size={20} />
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-white tracking-wide">Development Progress & Achievements</h1>
            <p className="text-[12px] text-[#8b949e]">Track overall completion across all game development domains.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-[#0d1117] border border-[#30363d] rounded-full pl-4 pr-1 py-1">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Project Health</span>
              <span className="text-[14px] font-bold" style={{ color: projectHealth.color }}>{projectHealth.status}</span>
            </div>
            <div 
              className="w-10 h-10 rounded-full border flex items-center justify-center font-bold text-[13px]"
              style={{ backgroundColor: `${projectHealth.bgColor}20`, borderColor: `${projectHealth.color}50`, color: projectHealth.color }}
              title={`Health Score: ${projectHealth.score}% | Overdue: ${projectHealth.overdueCount}`}
            >
              {projectHealth.icon === 'ShieldCheck' ? <ShieldCheck size={18} /> : projectHealth.icon === 'TrendingUp' ? <TrendingUp size={18} /> : <Activity size={18} />}
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#0d1117] border border-[#30363d] rounded-full pl-4 pr-1 py-1">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Overall Completion</span>
              <span className="text-[14px] font-bold text-white">{totalCurrent} / {totalTarget} Tasks</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#238636]/20 border border-[#238636]/50 flex items-center justify-center text-[#3fb950] font-bold text-[13px]">
              {overallPercent}%
            </div>
          </div>
          
          <div className="w-px h-8 bg-[#30363d]" />
          
          <button onClick={handleExportForAI} className="px-4 py-2 rounded-md bg-[#1f6feb]/10 text-[#58a6ff] font-bold text-[12px] flex items-center gap-2 hover:bg-[#1f6feb]/20 border border-[#1f6feb]/30 transition">
            {exportCopied ? <CheckCircle size={14} /> : <FileText size={14} />} 
            {exportCopied ? "Copied Data!" : "Export for AI Offline"}
          </button>
          
          <button 
            onClick={requestNotificationPermission} 
            className={`w-10 h-10 rounded-md flex items-center justify-center transition border ${
              notifPerm === 'granted' 
                ? 'bg-[#238636]/10 text-[#3fb950] border-[#3fb950]/30 hover:bg-[#238636]/20' 
                : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:text-white hover:bg-[#30363d]'
            }`}
            title={notifPerm === 'granted' ? "Notifications Enabled" : "Enable Notifications"}
          >
            {notifPerm === 'granted' ? <BellRing size={16} /> : <Bell size={16} />}
          </button>

          <div className="w-px h-8 bg-[#30363d]" />

          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-md bg-[#21262d] text-[#8b949e] font-bold text-[12px] hover:text-white border border-[#30363d] transition">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 rounded-md bg-[#238636] text-white font-bold text-[12px] flex items-center gap-2 hover:bg-[#2ea043] transition">
                <Save size={14} /> Save Metrics
              </button>
            </div>
          ) : (
            <button onClick={handleStartEdit} className="px-4 py-2 rounded-md bg-[#21262d] text-[#c9d1d9] font-bold text-[12px] flex items-center gap-2 hover:bg-[#30363d] border border-[#30363d] transition">
              <Edit2 size={14} /> Edit Targets & Progress
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
        
        {/* Interactive Milestone Timeline */}
        {milestones.length > 0 && (
          <div className="max-w-[1800px] mx-auto mb-8 bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#d29922]/10 border border-[#d29922]/30 flex items-center justify-center text-[#d29922]">
                  <Flag size={20} />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-white tracking-wide">Project Milestones & Deadlines</h2>
                  <p className="text-[12px] text-[#8b949e]">Interactive timeline mapping core completion stages. Drag background to pan, scroll to zoom, drag nodes to adjust deadlines.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isEditingMilestones && (
                  <>
                    <button 
                      onClick={() => setCustomViewRange(null)} 
                      className="w-8 h-8 flex items-center justify-center rounded bg-[#21262d] text-[#8b949e] hover:text-white border border-[#30363d] transition"
                      title="Reset View"
                    >
                      <Maximize size={14} />
                    </button>
                    <div className="w-px h-6 bg-[#30363d] mx-1" />
                  </>
                )}
                {isEditingMilestones ? (
                  <>
                    <button onClick={() => setIsEditingMilestones(false)} className="px-4 py-2 rounded-md bg-[#21262d] text-[#8b949e] font-bold text-[12px] hover:text-white border border-[#30363d] transition">
                      Cancel
                    </button>
                    <button onClick={handleSaveMilestones} className="px-4 py-2 rounded-md bg-[#238636] text-white font-bold text-[12px] flex items-center gap-2 hover:bg-[#2ea043] transition">
                      <Save size={14} /> Save Milestones
                    </button>
                  </>
                ) : (
                  <button onClick={handleStartMilestoneEdit} className="px-4 py-2 rounded-md bg-[#21262d] text-[#c9d1d9] font-bold text-[12px] flex items-center gap-2 hover:bg-[#30363d] border border-[#30363d] transition">
                    <Edit2 size={14} /> Manage
                  </button>
                )}
              </div>
            </div>

            {isEditingMilestones ? (
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                <div className="grid grid-cols-[1fr_200px_150px_40px] gap-4 mb-3 px-4 text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">
                  <div>Milestone Name</div>
                  <div>Target Date</div>
                  <div>Status</div>
                  <div></div>
                </div>
                <div className="space-y-2">
                  {editMilestones.map((m) => (
                    <div key={m.id} className="flex flex-col gap-2 bg-[#161b22] p-3 rounded-md border border-[#30363d]/50 hover:border-[#30363d] transition">
                      <div className="grid grid-cols-[1fr_200px_150px_40px] gap-4 items-center">
                        <input 
                          type="text" 
                          value={m.title} 
                          onChange={(e) => handleMilestoneChange(m.id, 'title', e.target.value)}
                          className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-[13px] text-white focus:border-[#58a6ff] outline-none w-full"
                          placeholder="Milestone Title"
                        />
                        <input 
                          type="date" 
                          value={new Date(m.timestamp).toISOString().split('T')[0]} 
                          onChange={(e) => handleMilestoneChange(m.id, 'timestamp', new Date(e.target.value).getTime())}
                          className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-[13px] text-[#c9d1d9] focus:border-[#58a6ff] outline-none w-full color-scheme-dark"
                          style={{ colorScheme: 'dark' }}
                        />
                        <select 
                          value={m.status} 
                          onChange={(e) => handleMilestoneChange(m.id, 'status', e.target.value as Milestone['status'])}
                          className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-[13px] text-[#c9d1d9] focus:border-[#58a6ff] outline-none w-full"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button 
                          onClick={() => handleRemoveMilestone(m.id)}
                          className="w-8 h-8 flex items-center justify-center rounded bg-[#21262d] text-[#8b949e] hover:text-[#f85149] hover:bg-[#30363d] transition"
                          title="Delete Milestone"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 items-center px-1 mt-1">
                        <span className="text-[10px] text-[#8b949e] uppercase font-bold mr-2 flex items-center gap-1">
                          <Link size={10} /> Depends On:
                        </span>
                        {editMilestones.filter(om => om.id !== m.id).map(om => {
                          const isDep = m.dependencies?.includes(om.id);
                          return (
                            <button 
                              key={om.id}
                              onClick={() => handleToggleDependency(m.id, om.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${isDep ? 'bg-[#58a6ff]/20 border-[#58a6ff] text-[#58a6ff]' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]'}`}
                            >
                              {om.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddMilestone}
                    className="w-full py-3 mt-4 border border-dashed border-[#30363d] rounded-md text-[13px] font-bold text-[#8b949e] hover:text-white hover:border-[#8b949e] flex items-center justify-center gap-2 transition"
                  >
                    <PlusCircle size={16} /> Add New Milestone
                  </button>
                </div>
              </div>
            ) : (
              <div ref={timelineContainerRef} className="relative pt-24 pb-20 px-12 select-none overflow-hidden cursor-grab active:cursor-grabbing">
                <div className="relative w-full h-2" ref={timelineTrackRef}>
                  {/* Dependency SVG Overlay */}
                  {trackWidth > 0 && milestones.some(m => m.dependencies?.length) && (
                    <svg className="absolute w-full h-[200px] -top-[100px] left-0 pointer-events-none z-0 overflow-visible">
                      <defs>
                        <marker id="arrow-normal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b949e" opacity="0.6" />
                        </marker>
                        <marker id="arrow-error" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f85149" />
                        </marker>
                      </defs>
                      {milestones.map(m => (m.dependencies || []).map(depId => {
                        const dep = milestones.find(x => x.id === depId);
                        if (!dep) return null;
                        
                        const p1Percent = maxTimeline === minTimeline ? 50 : ((dep.timestamp - minTimeline) / (maxTimeline - minTimeline)) * 100;
                        const p2Percent = maxTimeline === minTimeline ? 50 : ((m.timestamp - minTimeline) / (maxTimeline - minTimeline)) * 100;
                        
                        const p1X = (p1Percent / 100) * trackWidth;
                        const p2X = (p2Percent / 100) * trackWidth;
                        
                        // Error if dependency is completed after the current milestone target
                        const isError = dep.timestamp > m.timestamp;
                        const color = isError ? '#f85149' : '#8b949e';
                        const opacity = isError ? 1 : 0.4;
                        
                        // Dynamic arc height based on distance, to prevent flat arcs or overly tall arcs
                        const dist = Math.abs(p2X - p1X);
                        const arcHeight = Math.min(dist * 0.3, 80) + 10;
                        const startY = 88; // Just above the nodes (nodes are centered at 100)
                        
                        const d = `M ${p1X} ${startY} Q ${(p1X + p2X) / 2} ${startY - arcHeight} ${p2X} ${startY}`;
                        
                        return (
                          <path 
                            key={`${m.id}-${depId}`} 
                            d={d} 
                            fill="none" 
                            stroke={color} 
                            strokeWidth="2" 
                            strokeDasharray={isError ? "none" : "4 4"}
                            strokeOpacity={opacity}
                            markerEnd={`url(#arrow-${isError ? 'error' : 'normal'})`}
                          />
                        );
                      }))}
                    </svg>
                  )}

                  {/* Main Track Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-2 bg-[#0d1117] rounded-full border border-[#30363d] transform -translate-y-1/2 overflow-hidden pointer-events-none">
                    <div 
                      className="h-full bg-gradient-to-r from-[#238636] to-[#58a6ff]" 
                      style={{
                        width: `${milestones.filter(m => m.status === 'completed').length / milestones.length * 100}%`
                      }}
                    />
                  </div>

                  {/* Milestone Nodes */}
                  {milestones.map((milestone) => {
                    const percent = maxTimeline === minTimeline ? 50 : ((milestone.timestamp - minTimeline) / (maxTimeline - minTimeline)) * 100;
                    const isDragging = draggingMilestoneId === milestone.id;
                    
                    let bgColor = '#161b22';
                    let borderColor = '#30363d';
                    let textColor = '#8b949e';
                    
                    if (milestone.status === 'completed') {
                      borderColor = '#3fb950';
                      bgColor = '#238636';
                      textColor = '#3fb950';
                    } else if (milestone.status === 'in-progress') {
                      borderColor = '#d29922';
                      bgColor = '#d29922';
                      textColor = '#d29922';
                    } else {
                      borderColor = '#58a6ff';
                      textColor = '#58a6ff';
                    }

                    return (
                      <div 
                        key={milestone.id}
                        onClick={() => setSelectedMilestoneId(milestone.id)}
                        className={`absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group
                          ${isDragging ? 'z-50' : 'z-10 hover:z-40'}`}
                        style={{ left: `${percent}%` }}
                      >
                        {/* Tooltip Header (Above node) */}
                        <div className="absolute bottom-full mb-3 flex flex-col items-center w-max pointer-events-none transition-all group-hover:-translate-y-1">
                          <span className="text-[12px] font-bold text-white bg-[#0d1117] border border-[#30363d] px-2 py-1 rounded shadow-lg shadow-black/50">
                            {milestone.title}
                          </span>
                          <div className="w-px h-3 bg-[#30363d]" />
                        </div>

                        {/* Draggable Node Handle */}
                        <div 
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            setDraggingMilestoneId(milestone.id);
                          }}
                          className="w-5 h-5 rounded-full cursor-ew-resize flex items-center justify-center transition-transform hover:scale-125"
                          style={{ backgroundColor: bgColor, border: `2px solid ${borderColor}`, boxShadow: isDragging ? `0 0 15px ${borderColor}80` : 'none' }}
                        >
                          {isDragging && <GripHorizontal size={10} className="text-white absolute -top-4" />}
                        </div>

                        {/* Date label (Below node) */}
                        <div className="absolute top-full mt-3 flex flex-col items-center w-max">
                          <div className="w-px h-3 bg-[#30363d]" />
                          <span className="text-[11px] font-mono font-bold mt-1" style={{ color: textColor }}>
                            {new Date(milestone.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-[#8b949e] mt-0.5 border border-[#30363d] px-1 rounded-sm bg-[#0d1117]">
                            {milestone.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Inspector Panel */}
            <AnimatePresence>
              {selectedMilestoneId && (
                <MilestoneInspectorPanel
                  milestone={milestones.find(m => m.id === selectedMilestoneId)!}
                  onUpdate={(updated) => {
                    setMilestones(prev => prev.map(m => m.id === updated.id ? updated : m));
                  }}
                  onClose={() => setSelectedMilestoneId(null)}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Predictive Burndown Chart */}
        {chartData.length > 0 && (
          <div className="max-w-[1800px] mx-auto mb-8 bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#58a6ff]/10 border border-[#58a6ff]/30 flex items-center justify-center text-[#58a6ff]">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-white tracking-wide">Predictive Burndown Chart</h2>
                  <p className="text-[12px] text-[#8b949e]">Visualizing the gap between current progress and total project goals based on historical velocity.</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#8b949e] uppercase font-bold tracking-wider">Remaining Tasks</span>
                  <span className="text-[18px] font-bold text-[#f85149]">{totalTarget - totalCurrent}</span>
                </div>
                <div className="w-px h-10 bg-[#30363d]" />
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#8b949e] uppercase font-bold tracking-wider">Est. Completion</span>
                  <span className="text-[18px] font-bold text-[#58a6ff] flex items-center gap-2">
                    <Calendar size={16} /> 
                    {projectedCompletionDate ? projectedCompletionDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Need more data'}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#58a6ff" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#30363d" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#30363d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                  <XAxis 
                    dataKey="dateStr" 
                    stroke="#8b949e" 
                    fontSize={11}
                    tickMargin={10}
                    axisLine={{ stroke: '#30363d' }}
                  />
                  <YAxis 
                    stroke="#8b949e" 
                    fontSize={11}
                    tickFormatter={(value) => `${value}`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '8px', color: '#c9d1d9', fontSize: '12px' }}
                    itemStyle={{ color: '#58a6ff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="projected" 
                    name="Projected Trend" 
                    stroke="#8b949e" 
                    strokeDasharray="5 5"
                    fillOpacity={1} 
                    fill="url(#colorProjected)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="remaining" 
                    name="Actual Remaining" 
                    stroke="#58a6ff" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRemaining)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1800px] mx-auto">
          {displayData.map((category) => {
            const CatIcon = IconMap[category.iconName] || Trophy;
            
            let catCurrent = 0;
            let catTarget = 0;
            category.metrics.forEach(m => {
              catCurrent += m.current;
              catTarget += m.target;
            });
            const catPercent = catTarget > 0 ? Math.min(100, Math.round((catCurrent / catTarget) * 100)) : 0;

            return (
              <div key={category.id} className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden flex flex-col shadow-lg shadow-black/20">
                {/* Card Header */}
                <div className="p-5 border-b border-[#30363d] bg-gradient-to-b from-[#21262d]/50 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center shadow-inner" style={{ backgroundColor: `${category.color}15`, border: `1px solid ${category.color}30`, color: category.color }}>
                      <CatIcon size={16} />
                    </div>
                    <h2 className="text-[14px] font-bold text-white">{category.title}</h2>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-white">{catCurrent} <span className="text-[#8b949e] font-normal">/ {catTarget}</span></span>
                    </div>
                    <div className="w-8 h-8 relative">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#30363d" strokeWidth="4" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={category.color} strokeWidth="4" strokeDasharray={`${catPercent}, 100`} />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-2 flex-1 overflow-y-auto max-h-[350px] custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {category.metrics.map((metric, idx) => {
                        const mPercent = metric.target > 0 ? Math.min(100, Math.round((metric.current / metric.target) * 100)) : 0;
                        const isComplete = metric.current >= metric.target && metric.target > 0;
                        
                        return (
                          <tr key={metric.id} className="border-b border-[#30363d]/30 hover:bg-[#21262d]/40 transition group">
                            <td className="py-2.5 px-3">
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={metric.name} 
                                  onChange={(e) => handleMetricChange(category.id, metric.id, 'name', e.target.value)}
                                  className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[11px] text-white w-[140px] focus:border-[#58a6ff] outline-none"
                                />
                              ) : (
                                <div className="flex items-center gap-2">
                                  {isComplete ? <CheckCircle size={12} className="text-[#3fb950] shrink-0" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#30363d] shrink-0" />}
                                  <span className={`text-[12px] truncate max-w-[160px] ${isComplete ? 'text-[#8b949e]' : 'text-[#c9d1d9]'}`}>{metric.name}</span>
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-1">
                                  <input 
                                    type="number" 
                                    value={metric.current} 
                                    onChange={(e) => handleMetricChange(category.id, metric.id, 'current', Number(e.target.value))}
                                    className="bg-[#0d1117] border border-[#30363d] rounded px-1.5 py-1 text-[11px] text-white w-[50px] text-center focus:border-[#58a6ff] outline-none"
                                  />
                                  <span className="text-[#8b949e] text-[10px]">/</span>
                                  <input 
                                    type="number" 
                                    value={metric.target} 
                                    onChange={(e) => handleMetricChange(category.id, metric.id, 'target', Number(e.target.value))}
                                    className="bg-[#0d1117] border border-[#30363d] rounded px-1.5 py-1 text-[11px] text-white w-[50px] text-center focus:border-[#58a6ff] outline-none"
                                  />
                                  <button onClick={() => removeMetric(category.id, metric.id)} className="ml-1 text-[#8b949e] hover:text-[#f85149]">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-end">
                                  <span className="text-[12px] font-bold font-mono">
                                    {metric.current} <span className="text-[#8b949e] font-normal text-[10px]">/ {metric.target}</span>
                                  </span>
                                  <div className="w-24 h-1.5 bg-[#0d1117] rounded-full overflow-hidden mt-1 border border-[#30363d]/50">
                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${mPercent}%`, backgroundColor: isComplete ? '#3fb950' : category.color }} />
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {isEditing && (
                        <tr>
                          <td colSpan={2} className="p-2">
                            <button 
                              onClick={() => addMetric(category.id)}
                              className="w-full py-1.5 border border-dashed border-[#30363d] rounded text-[11px] text-[#8b949e] hover:text-white hover:border-[#8b949e] flex items-center justify-center gap-1 transition"
                            >
                              <Plus size={12} /> Add Metric
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Global Styles for Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #30363d;
          border-radius: 10px;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
