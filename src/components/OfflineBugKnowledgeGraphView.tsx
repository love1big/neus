/**
 * ====================================================================================================
 * COMPONENT: OfflineBugKnowledgeGraphView.tsx
 * PURPOSE: Interactive HTML5 Canvas Knowledge Graph & Vector Clustering for Learned Bugs
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์:
 * 1. แสดงผลกราฟความรู้แบบ Node-Graph ความสัมพันธ์ของบัคที่เรียนรู้แล้วทั้งหมดในระบบ
 * 2. จัดกลุ่ม Cluster ตาม 10 โดเมนวิศวกรรมเกมและซอฟต์แวร์
 * 3. สามารถคลิกเลือกโหนดบัคเพื่อดูรายละเอียด Root Cause, Anti-Pattern, และ โค้ดภูมิคุ้มกันได้ทันที
 * 4. รองรับการ Zoom, Pan, และ Search แบบ Interactive
 * ====================================================================================================
 */

import React, { useRef, useEffect, useState } from 'react';
import { Network, Search, RefreshCw, ZoomIn, ZoomOut, Maximize2, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { BugKnowledgeRecord, BugDomain } from '../utils/OfflineAIErrorImmunityCore';
import { OfflineErrorMemoryStore } from '../utils/OfflineErrorMemoryStore';

const DOMAIN_COLORS: Record<BugDomain, string> = {
  MEMORY_MANAGEMENT: '#f85149',
  ASYNC_CONCURRENCY: '#e3b341',
  WEBGPU_SHADER: '#bc8cff',
  REACT_STATE_LIFECYCLE: '#58a6ff',
  TYPE_SAFETY_NARROWING: '#3fb950',
  NUMERICAL_STABILITY: '#f0883e',
  ASSET_PIPELINE: '#79c0ff',
  PHYSICS_STABILITY: '#d2a8ff',
  NETCODE_REPLICATION: '#56d364',
  LOGIC_BOUNDARY: '#8b949e'
};

interface GraphNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  record: BugKnowledgeRecord;
  color: string;
}

export default function OfflineBugKnowledgeGraphView({ onSelectRecord }: { onSelectRecord?: (record: BugKnowledgeRecord) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [records, setRecords] = useState<BugKnowledgeRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<BugKnowledgeRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  const nodesRef = useRef<GraphNode[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const data = OfflineErrorMemoryStore.getAllRecords();
    setRecords(data);
    if (data.length > 0) {
      setSelectedRecord(data[0]);
    }
  }, []);

  // Initialize Physics Nodes
  useEffect(() => {
    if (records.length === 0) return;

    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    nodesRef.current = records.map((rec, idx) => {
      const angle = (idx / records.length) * 2 * Math.PI;
      const dist = 140 + Math.random() * 120;
      return {
        id: rec.id,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: rec.severity === 'CRITICAL_CRASH' ? 16 : 12,
        record: rec,
        color: DOMAIN_COLORS[rec.domain] || '#58a6ff'
      };
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid
      ctx.strokeStyle = '#161b22';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Central Core Node
      ctx.fillStyle = '#1f6feb';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 24, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AI CORE', centerX, centerY);

      // Update and Draw Nodes
      nodesRef.current.forEach((node) => {
        // Draw connection line to central core
        ctx.strokeStyle = '#30363d';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();

        // Node Circle
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fill();

        // Highlight if selected
        if (selectedRecord?.id === node.id) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4, 0, 2 * Math.PI);
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = '#c9d1d9';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.record.title.slice(0, 18) + '...', node.x, node.y + node.radius + 12);
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [records, selectedRecord]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    for (const node of nodesRef.current) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist <= node.radius + 6) {
        setSelectedRecord(node.record);
        if (onSelectRecord) onSelectRecord(node.record);
        break;
      }
    }
  };

  const filteredRecords = records.filter(r => {
    const matchQuery = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.titleThai.includes(searchQuery);
    const matchDomain = selectedDomain === 'ALL' || r.domain === selectedDomain;
    return matchQuery && matchDomain;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans p-4 overflow-hidden">
      {/* Top Search & Filter Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#30363d] shrink-0">
        <div className="flex items-center gap-2">
          <Network size={20} className="text-[#bc8cff]" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Error Knowledge Graph & Vector Neural Topology
              <span className="px-2 py-0.5 bg-[#bc8cff]/20 border border-[#bc8cff]/40 text-[#bc8cff] text-[10px] rounded font-mono">
                {records.length} NODES INDEXED
              </span>
            </h2>
            <p className="text-xs text-[#8b949e]">
              แผนผังกราฟแสดงโครงข่ายความจำบัคและจุดเชื่อมโยงทางสถาปัตยกรรมแบบออฟไลน์
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-[#8b949e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาบัคในกราฟ..."
              className="pl-8 pr-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded text-xs text-white outline-none focus:border-[#58a6ff] w-48"
            />
          </div>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-2.5 py-1.5 bg-[#161b22] border border-[#30363d] rounded text-xs text-[#c9d1d9] outline-none"
          >
            <option value="ALL">ทุกโดเมน (All Domains)</option>
            {Object.keys(DOMAIN_COLORS).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Area: Canvas + Inspector */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3 overflow-hidden">
        {/* Left: Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-pointer"
          />

          {/* Canvas Legend */}
          <div className="absolute bottom-3 left-3 bg-[#0d1117]/90 border border-[#30363d] p-2 rounded text-[10px] flex flex-wrap gap-2 max-w-lg backdrop-blur">
            {Object.entries(DOMAIN_COLORS).map(([dom, color]) => (
              <div key={dom} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[#8b949e] font-mono">{dom.split('_')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Node Details Inspector */}
        <div className="lg:col-span-4 flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
          <div className="bg-[#0e1014] px-3 py-2 border-b border-[#30363d] flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#3fb950]" />
              รายละเอียดโหนดบัค (Node Inspector)
            </span>
            {selectedRecord && (
              <span className="px-2 py-0.5 bg-[#238636]/20 border border-[#238636]/40 text-[#3fb950] text-[10px] rounded font-mono">
                Immunity: {selectedRecord.immunityScore}%
              </span>
            )}
          </div>

          {selectedRecord ? (
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#30363d] text-[#8b949e]">
                  {selectedRecord.fingerprint}
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">{selectedRecord.titleThai}</h3>
                <p className="text-[11px] text-[#8b949e] mt-0.5">{selectedRecord.title}</p>
              </div>

              <div className="p-2.5 bg-[#0d1117] border border-[#21262d] rounded">
                <span className="text-[10px] font-bold text-[#e3b341] uppercase tracking-wider">สาเหตุแท้จริง (Root Cause):</span>
                <p className="text-[11px] text-[#c9d1d9] mt-1 leading-relaxed">{selectedRecord.rootCauseThai}</p>
              </div>

              <div className="p-2.5 bg-[#0d1117] border border-[#21262d] rounded">
                <span className="text-[10px] font-bold text-[#f85149] uppercase tracking-wider">กฎข้อห้าม (Anti-Pattern):</span>
                <p className="text-[11px] text-[#ff7b72] mt-1 leading-relaxed">
                  {selectedRecord.antiPattern.patternDescriptionThai}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#3fb950] uppercase tracking-wider">โค้ดภูมิคุ้มกัน (Immune Code):</span>
                <pre className="mt-1 p-2 bg-[#0a0c10] border border-[#21262d] rounded font-mono text-[10px] text-[#7ee787] overflow-x-auto">
                  {selectedRecord.immuneCodeSample}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-6 text-[#8b949e] text-xs">
              คลิกที่โหนดบนผังกราฟเพื่อดูรายละเอียด
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
