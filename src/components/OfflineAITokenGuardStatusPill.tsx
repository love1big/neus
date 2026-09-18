/**
 * ====================================================================================================
 * MODULE: OfflineAITokenGuardStatusPill.tsx
 * PURPOSE: Global Header Status Pill & Instant Switcher for 100% Offline AI (Zero Tokens)
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * 1. ปุ่มและสถานะแสดงผลบนแถบหัวของ IDE (Header / Workspace Top Bar)
 * 2. บ่งบอกสถานะการทำงานของ AI ว่าเป็น "100% Offline (0 Tokens)" หรือ "Hybrid"
 * 3. แสดงยอด Token ที่ประหยัดได้แบบสะสม (เช่น "+2.45M Tokens Saved")
 * 4. คลิกเพื่อเปิดแดชบอร์ด OfflineAITokenGuardDashboard หรือสลับโหมดทันที
 * 
 * ARCHITECTURE & SYSTEM INTEGRATION:
 * - เชื่อมต่อกับ UniversalOfflineAITokenGuard
 * 
 * INPUTS, OUTPUTS & DATA CONTRACTS:
 * - onOpenDashboard?: () => void
 * ====================================================================================================
 */

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Lock } from 'lucide-react';
import { UniversalOfflineAITokenGuard, TokenGuardTelemetry } from '../utils/UniversalOfflineAITokenGuard';

interface Props {
  onOpenDashboard?: () => void;
}

export default function OfflineAITokenGuardStatusPill({ onOpenDashboard }: Props) {
  const [telemetry, setTelemetry] = useState<TokenGuardTelemetry>(() =>
    UniversalOfflineAITokenGuard.getTelemetry()
  );

  useEffect(() => {
    return UniversalOfflineAITokenGuard.subscribe((data) => {
      setTelemetry(data);
    });
  }, []);

  const formatTokens = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toString();
  };

  return (
    <button
      onClick={onOpenDashboard}
      title="คลิกเพื่อเปิดศูนย์ควบคุม AI ออฟไลน์ 100% และระบบประหยัด Token"
      className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 text-xs font-medium transition-all shadow-sm group select-none cursor-pointer"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>

      <Shield className="w-3.5 h-3.5 text-emerald-400" />
      <span className="font-semibold tracking-tight">AI Offline 100%</span>
      <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-mono">
        +{formatTokens(telemetry.totalTokensSavedLifetime)} Tokens Saved
      </span>
    </button>
  );
}
