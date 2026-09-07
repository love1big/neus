/**
 * @file VoiceQualityAssuranceStudio.tsx
 * @description
 * ============================================================================
 * [THAI]
 * สตูดิโอควบคุมและตรวจรับรองคุณภาพเสียงพากย์และเสียงสังเคราะห์ AI แบบมืออาชีพ (Ultra AI Voice QC/QA Studio)
 * ตรวจสอบความถูกต้องของเสียงพากย์ทุกภาษา ความถูกต้องของวรรณยุกต์ และความสมจริงของอารมณ์ 100%:
 *   1. ระบบวิเคราะห์ 5 มิติ (5D Voice Quality Matrix): สัทศาสตร์ (Phonetics), อารมณ์ (Emotion), อะคูสติก (Acoustic), ความเป็นธรรมชาติ (Prosody), การซิงก์เวลา (Sync)
 *   2. แผนผังเรดาร์คุณภาพเสียง (QA Radar Spider Chart) และเกรดประเมินระดับสตูดิโอ (A+, A, B, C, D, Fail)
 *   3. ตัวตรวจจับจุดบกพร่องบนรูปคลื่นเสียง (Waveform Defect Locator): ระบุตำแหน่ง Clipping, Plosive Pop, Harsh Sibilance และ DC Offset อย่างแม่นยำ
 *   4. ระบบตรวจสอบความถูกต้องของสัทศาสตร์หลายภาษา (Thai, English, Japanese, Mandarin, Korean, Spanish, French, German)
 *   5. เครื่องมือซ่อมแซมและขัดเกลาเสียงอัตโนมัติ 1-Click DSP Auto-Remediation (De-Esser, Peak Limiter, EBU R128 Normalizer)
 *   6. สวิตช์เปรียบเทียบเสียง Original vs Remediated (A/B Test Player)
 *   7. ระบบบันทึกเสียงสดจากไมโครโฟนเพื่อส่งเข้ากระบวนการ QA แบบเรียลไทม์
 *   8. การส่งออกใบรับรองการตรวจคุณภาพ (Export QA Audit Certificate & JSON Logs)
 *
 * [ENGLISH]
 * Enterprise Studio for AI Voice Dubbing Quality Control, Phonetic Verification & Emotional Congruence.
 * Features:
 *   - 5D Quality Assessment Matrix with Interactive Radar Chart
 *   - Multilingual Phonetic Engine (TH/EN/JP/CN/KR/ES/FR/DE)
 *   - Dynamic Waveform Visualizer with Time-Stamped Defect Annotations
 *   - Emotional Acting Congruence Benchmark Evaluator
 *   - 1-Click Auto-Remediation DSP Pipeline with Instant A/B Comparison Playback
 *   - Live Microphone Ingest QA Analyzer
 *   - Exportable Studio QA Audit Inspection Certificate
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Volume2,
  Play, Pause, RotateCcw, Download, Sparkles, Sliders,
  Activity, Layers, BookOpen, Mic, FileText, Check, ArrowRight,
  TrendingUp, Radio, RefreshCw, Eye, Award, Music
} from 'lucide-react';

import {
  VoiceQualityAssuranceEngine,
  FullVoiceQAResult,
  QAGrade
} from '../utils/VoiceQualityAssuranceEngine';

import {
  AcousticMetricsAnalyzer,
  AcousticDefectMarker
} from '../utils/AcousticMetricsAnalyzer';

import {
  TargetEmotionType,
  EMOTION_BENCHMARKS
} from '../utils/EmotionalProsodyValidator';

import {
  SupportedQALanguage,
  SUPPORTED_QA_LANGUAGES
} from '../utils/MultilingualPhoneticQAEngine';

import { ThaiPhoneticSpeechSynthesizer } from '../utils/ThaiPhoneticSpeechSynthesizer';

export default function VoiceQualityAssuranceStudio() {
  // Navigation tabs: 'audit_dashboard' | 'waveform_defects' | 'phonetic_matrix' | 'emotion_radar' | 'auto_remediation'
  const [activeTab, setActiveTab] = useState<
    'audit_dashboard' | 'waveform_defects' | 'phonetic_matrix' | 'emotion_radar' | 'auto_remediation'
  >('audit_dashboard');

  // Input & Configuration state
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedQALanguage>('thai');
  const [selectedEmotion, setSelectedEmotion] = useState<TargetEmotionType>('angry');
  const [scriptText, setScriptText] = useState<string>(
    'ข้าจะไม่ยอมให้เจ้าทำลายดินแดนนี้เด็ดขาด! จงถอยไปซะก่อนที่ดาบเล่มนี้จะปลิดชีพเจ้า!'
  );

  // QA Audit State
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [qaResult, setQaResult] = useState<FullVoiceQAResult | null>(null);

  // Audio Buffer State (Original vs Remediated)
  const [originalAudio, setOriginalAudio] = useState<Float32Array | null>(null);
  const [remediatedAudio, setRemediatedAudio] = useState<Float32Array | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activePlayMode, setActivePlayMode] = useState<'original' | 'remediated'>('original');

  // Mic Recording
  const [isRecordingMic, setIsRecordingMic] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micChunksRef = useRef<Blob[]>([]);

  // Canvas visualizer refs
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initial audit run on mount
  useEffect(() => {
    handleRunFullAudit();
  }, []);

  // Update audit when changing language preset
  const handleSelectLanguagePreset = (lang: SupportedQALanguage) => {
    setSelectedLanguage(lang);
    const spec = SUPPORTED_QA_LANGUAGES[lang];
    if (spec) {
      setScriptText(spec.sampleScript);
    }
  };

  // Run full QA analysis pipeline
  const handleRunFullAudit = async () => {
    setIsAuditing(true);
    try {
      // Generate synthetic sample or use recorded
      const sampleRate = 44100;
      const rawAudio = originalAudio || VoiceQualityAssuranceEngine.generateSimulatedVoiceBuffer(
        scriptText,
        selectedEmotion,
        sampleRate
      );

      setOriginalAudio(rawAudio);

      // Run full audit
      const result = await VoiceQualityAssuranceEngine.runFullAudit({
        scriptText,
        language: selectedLanguage,
        targetEmotion: selectedEmotion,
        audioSamples: rawAudio,
        sampleRate
      });

      setQaResult(result);

      // Prepare remediated audio
      const cleaned = VoiceQualityAssuranceEngine.applyAutoRemediation(rawAudio, sampleRate);
      setRemediatedAudio(cleaned);
    } catch (err) {
      console.error('QA Audit Error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  // 1-Click Auto Remediation Trigger
  const handleApplyRemediation = async () => {
    if (!originalAudio) return;
    setIsAuditing(true);
    const sampleRate = 44100;
    const cleaned = VoiceQualityAssuranceEngine.applyAutoRemediation(originalAudio, sampleRate);
    setRemediatedAudio(cleaned);

    // Re-audit the remediated audio
    const newResult = await VoiceQualityAssuranceEngine.runFullAudit({
      scriptText,
      language: selectedLanguage,
      targetEmotion: selectedEmotion,
      audioSamples: cleaned,
      sampleRate
    });

    setQaResult(newResult);
    setActivePlayMode('remediated');
    setIsAuditing(false);
  };

  // Playback Handler
  const handlePlayAudio = (mode: 'original' | 'remediated') => {
    if (isPlayingAudio) {
      if (activeSourceRef.current) {
        try {
          activeSourceRef.current.stop();
        } catch (e) {}
      }
      setIsPlayingAudio(false);
      return;
    }

    const targetBuffer = mode === 'remediated' ? remediatedAudio : originalAudio;
    if (!targetBuffer) return;

    setActivePlayMode(mode);
    setIsPlayingAudio(true);

    const source = VoiceQualityAssuranceEngine.playAudioBuffer(targetBuffer, 44100);
    activeSourceRef.current = source;
    source.onended = () => {
      setIsPlayingAudio(false);
    };
  };

  // Microphone Ingest QA Handler
  const handleToggleMicRecord = async () => {
    if (isRecordingMic) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecordingMic(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      micChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) micChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(micChunksRef.current, { type: 'audio/webm' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const tempCtx = new AudioContextClass();
        const decoded = await tempCtx.decodeAudioData(arrayBuffer);
        const floatSamples = decoded.getChannelData(0);

        setOriginalAudio(floatSamples);
        stream.getTracks().forEach((t) => t.stop());

        // Run audit on mic input
        const res = await VoiceQualityAssuranceEngine.runFullAudit({
          scriptText,
          language: selectedLanguage,
          targetEmotion: selectedEmotion,
          audioSamples: floatSamples,
          sampleRate: decoded.sampleRate
        });
        setQaResult(res);

        const cleaned = VoiceQualityAssuranceEngine.applyAutoRemediation(floatSamples, decoded.sampleRate);
        setRemediatedAudio(cleaned);
      };

      mediaRecorder.start();
      setIsRecordingMic(true);
    } catch (err) {
      console.warn('Mic access error:', err);
    }
  };

  // Draw Waveform Canvas with Defect Annotations
  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const samples = activePlayMode === 'remediated' ? remediatedAudio : originalAudio;

    ctx.clearRect(0, 0, width, height);

    // Background grid
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!samples || samples.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('No audio buffer loaded', width / 2 - 60, centerY);
      return;
    }

    // Draw Waveform Bars
    const step = Math.ceil(samples.length / width);
    const waveColor = activePlayMode === 'remediated' ? '#10b981' : '#38bdf8';

    ctx.fillStyle = waveColor;
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = samples[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      const barHeight = Math.max(2, (max - min) * centerY * 0.85);
      ctx.fillRect(i, centerY - barHeight / 2, 1, barHeight);
    }

    // Draw Defect Markers if in original mode
    if (activePlayMode === 'original' && qaResult && qaResult.acousticReport.defects.length > 0) {
      const durationMs = qaResult.acousticReport.durationMs || 1;
      qaResult.acousticReport.defects.forEach((defect) => {
        const x = (defect.timestampMs / durationMs) * width;
        ctx.fillStyle = defect.type === 'clipping' ? '#ef4444' : defect.type === 'plosive_pop' ? '#a855f7' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, 15, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw vertical marker line
        ctx.strokeStyle = defect.type === 'clipping' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.3)';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }
  }, [originalAudio, remediatedAudio, activePlayMode, qaResult]);

  // Draw 5D Radar Spider Chart
  useEffect(() => {
    const canvas = radarCanvasRef.current;
    if (!canvas || !qaResult) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 35;

    ctx.clearRect(0, 0, width, height);

    const categories = [
      { label: 'สัทศาสตร์ (Phonetics)', score: qaResult.scores.phoneticFidelity },
      { label: 'อารมณ์ (Emotion)', score: qaResult.scores.emotionalCongruence },
      { label: 'สัญญาณ (Acoustic)', score: qaResult.scores.acousticIntegrity },
      { label: 'ธรรมชาติ (Prosody)', score: qaResult.scores.prosodicNaturalness },
      { label: 'การซิงก์ (Sync)', score: qaResult.scores.timingAndSync }
    ];

    const totalAxes = categories.length;
    const angleStep = (Math.PI * 2) / totalAxes;

    // Draw concentric polygon rings (20%, 40%, 60%, 80%, 100%)
    for (let r = 1; r <= 5; r++) {
      const ringRadius = (radius / 5) * r;
      ctx.strokeStyle = r === 5 ? '#334155' : '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < totalAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + ringRadius * Math.cos(angle);
        const y = centerY + ringRadius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw axis lines and labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    for (let i = 0; i < totalAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Label
      const labelX = centerX + (radius + 20) * Math.cos(angle);
      const labelY = centerY + (radius + 15) * Math.sin(angle);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(categories[i].label, labelX, labelY);
    }

    // Draw Score Polygon
    ctx.beginPath();
    for (let i = 0; i < totalAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const scoreRatio = categories[i].score / 100;
      const x = centerX + radius * scoreRatio * Math.cos(angle);
      const y = centerY + radius * scoreRatio * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw score vertex nodes
    for (let i = 0; i < totalAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const scoreRatio = categories[i].score / 100;
      const x = centerX + radius * scoreRatio * Math.cos(angle);
      const y = centerY + radius * scoreRatio * Math.sin(angle);

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [qaResult]);

  // Export JSON Report
  const handleDownloadReport = () => {
    if (!qaResult) return;
    const jsonStr = VoiceQualityAssuranceEngine.generateExportableReport(qaResult);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-qa-audit-${qaResult.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="voice-qa-studio-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Studio Header Bar */}
      <header id="qa-header" className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-400 p-0.5 shadow-emerald-500/20 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                ระบบตรวจสอบและรับรองคุณภาพเสียงพากย์ AI (Universal Voice QA/QC)
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Studio QC Master
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              ตรวจสอบสัทศาสตร์ทุกภาษา • ความสมจริงของอารมณ์ • สัญญาณอะคูสติก • การซ่อมแซมเสียง 1-Click DSP
            </p>
          </div>
        </div>

        {/* Global Tab Navigation */}
        <nav id="qa-nav-tabs" className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('audit_dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'audit_dashboard'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>ภาพรวมการตรวจ (Audit Overview)</span>
          </button>

          <button
            onClick={() => setActiveTab('waveform_defects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'waveform_defects'
                ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>ตรวจจับจุดบกพร่อง (Defect Map)</span>
          </button>

          <button
            onClick={() => setActiveTab('phonetic_matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'phonetic_matrix'
                ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>สัทศาสตร์หลายภาษา (Phonetics)</span>
          </button>

          <button
            onClick={() => setActiveTab('emotion_radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'emotion_radar'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>เรดาร์อารมณ์การแสดง (Emotion Radar)</span>
          </button>

          <button
            onClick={() => setActiveTab('auto_remediation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'auto_remediation'
                ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ซ่อมแซมเสียง 1-Click DSP</span>
          </button>
        </nav>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Control Bar: Script Input, Language Selector, Emotion Selector & Ingest Tools */}
        <section id="qa-input-control-panel" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Language Selection Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs text-slate-400 font-medium shrink-0">ภาษาเป้าหมาย:</span>
              {Object.values(SUPPORTED_QA_LANGUAGES).map((l) => (
                <button
                  key={l.lang}
                  onClick={() => handleSelectLanguagePreset(l.lang)}
                  className={`text-xs px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                    selectedLanguage === l.lang
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="mr-1">{l.flag}</span>
                  <span>{l.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Target Emotion Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">อารมณ์บทพากย์:</span>
              <select
                value={selectedEmotion}
                onChange={(e) => setSelectedEmotion(e.target.value as TargetEmotionType)}
                className="bg-slate-950 border border-slate-800 text-xs text-amber-300 font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-500"
              >
                {Object.values(EMOTION_BENCHMARKS).map((em) => (
                  <option key={em.emotion} value={em.emotion}>
                    {em.nameThai}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Script Text Input */}
          <div className="space-y-2">
            <textarea
              id="qa-script-input"
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              rows={2}
              placeholder="พิมพ์บทพากย์เพื่อส่งเข้าตรวจสอบความถูกต้องของสัทศาสตร์และอารมณ์..."
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Action Buttons: Run Audit, Mic Test, 1-Click Fix, Export */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                id="run-full-audit-btn"
                onClick={handleRunFullAudit}
                disabled={isAuditing}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                <span>{isAuditing ? 'กำลังประมวลผล QC...' : 'เริ่มตรวจสอบคุณภาพเสียง (Run Full QA Audit)'}</span>
              </button>

              <button
                onClick={handleToggleMicRecord}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs border transition-all ${
                  isRecordingMic
                    ? 'bg-rose-500 text-white animate-pulse border-rose-400 shadow-lg shadow-rose-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecordingMic ? 'หยุดบันทึกเสียงสด' : 'ทดสอบเสียงจากไมโครโฟน'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyRemediation}
                disabled={!originalAudio}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md text-xs transition-all active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>ซ่อมแซมอัตโนมัติ (1-Click Auto-Fix)</span>
              </button>

              <button
                onClick={handleDownloadReport}
                disabled={!qaResult}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs transition-all disabled:opacity-50"
                title="ดาวน์โหลดใบรับรองผลการตรวจ QA (JSON Report)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ส่งออกรายงาน</span>
              </button>
            </div>
          </div>
        </section>

        {/* Audio Waveform & Defect Visualizer Strip */}
        <section id="waveform-defect-visualizer-strip" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-semibold text-white">Waveform Spectrum & Defect Map</h2>
              </div>

              {/* A/B Switch Mode */}
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActivePlayMode('original')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activePlayMode === 'original'
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  เสียงต้นฉบับ (Original)
                </button>
                <button
                  onClick={() => setActivePlayMode('remediated')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activePlayMode === 'remediated'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  เสียงปรับแก้แล้ว (Remediated DSP)
                </button>
              </div>
            </div>

            {/* Play Button & Defect Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Clipping
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Sibilance
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Plosive
                </span>
              </div>

              <button
                onClick={() => handlePlayAudio(activePlayMode)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                }`}
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingAudio ? 'หยุดเล่น' : 'ฟังเสียงทดสอบ'}</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-800">
            <canvas ref={waveformCanvasRef} width={800} height={120} className="w-full h-28 block" />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TAB 1: AUDIT DASHBOARD OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'audit_dashboard' && qaResult && (
          <div id="qa-dashboard-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Grade Card & 5D Score Breakdown (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Studio Grade Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      ระดับการประเมินคุณภาพเสียง (Studio QA Rating)
                    </div>
                    <div className="text-3xl font-black mt-1 flex items-baseline gap-2" style={{ color: qaResult.gradeColor }}>
                      <span>GRADE {qaResult.grade}</span>
                      <span className="text-base font-semibold text-slate-300">
                        ({qaResult.compositeScore}/100)
                      </span>
                    </div>
                  </div>

                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg"
                    style={{ backgroundColor: `${qaResult.gradeColor}20`, color: qaResult.gradeColor, border: `1px solid ${qaResult.gradeColor}40` }}
                  >
                    {qaResult.grade}
                  </div>
                </div>

                <p className="text-xs font-medium leading-relaxed" style={{ color: qaResult.gradeColor }}>
                  {qaResult.gradeLabelThai}
                </p>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    {qaResult.isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    <span>บทสรุปผลการตรวจสอบ (Audit Verdict):</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {qaResult.summaryVerdictThai}
                  </p>
                </div>
              </div>

              {/* 5-Dimensional Scores List */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                  คะแนนแยกตามมิติการตรวจ (5D Score Metrics)
                </h3>

                <div className="space-y-2.5 text-xs">
                  {[
                    { label: 'สัทศาสตร์และการออกเสียง (Phonetics)', score: qaResult.scores.phoneticFidelity, color: 'bg-indigo-500' },
                    { label: 'ความสมจริงของอารมณ์ (Emotion Congruence)', score: qaResult.scores.emotionalCongruence, color: 'bg-amber-500' },
                    { label: 'ความบริสุทธิ์ของสัญญาณ (Acoustic Integrity)', score: qaResult.scores.acousticIntegrity, color: 'bg-emerald-500' },
                    { label: 'ความเป็นธรรมชาติของเสียง (Prosody)', score: qaResult.scores.prosodicNaturalness, color: 'bg-sky-500' },
                    { label: 'ความตรงเวลาและการซิงก์ (Timing & Sync)', score: qaResult.scores.timingAndSync, color: 'bg-purple-500' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-300">{item.label}</span>
                        <span className="text-white font-mono">{item.score}/100</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: 5D Radar Chart & Actionable Remediations (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Radar Chart Display */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-white">แผนผังเรดาร์คุณภาพเสียง 5 มิติ (5D Quality Radar)</h3>
                  </div>
                  <span className="text-xs text-slate-400">Target Benchmark Alignment</span>
                </div>

                <div className="flex justify-center py-2 bg-slate-950/60 rounded-xl border border-slate-800">
                  <canvas ref={radarCanvasRef} width={400} height={260} className="max-w-full block" />
                </div>
              </div>

              {/* Actionable Remediation Checklist */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-white">คำแนะนำการปรับปรุงคุณภาพเสียง (Actionable Remediation)</h3>
                  </div>
                  <button
                    onClick={handleApplyRemediation}
                    className="text-xs px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 transition-colors font-medium"
                  >
                    แก้ไขทันที 1-Click
                  </button>
                </div>

                <div className="space-y-2">
                  {qaResult.actionableRemediationsThai.map((rem, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300"
                    >
                      <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{rem}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: WAVEFORM DEFECTS LOCATOR */}
        {/* ========================================================================= */}
        {activeTab === 'waveform_defects' && qaResult && (
          <div id="defects-view" className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ตารางจุดบกพร่องทางอะคูสติก (Acoustic Defects Log)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    ตรวจจับการคลิปปิ้ง, เสียงระเบิดไมค์, เสียงแหลมบาดหู และสัญญาณไฟตรงในไฟล์เสียง
                  </p>
                </div>
                <div className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                  พบ {qaResult.acousticReport.defects.length} จุดบกพร่อง
                </div>
              </div>

              {/* Defects Grid / Table */}
              {qaResult.acousticReport.defects.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="font-bold text-sm text-white">ไม่พบจุดบกพร่องทางสัญญาณเสียง</div>
                  <p className="text-xs text-slate-400">สัญญาณเสียงมีความสมบูรณ์ตามเกณฑ์สตูดิโอดิจิทัล</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {qaResult.acousticReport.defects.map((defect) => (
                    <div
                      key={defect.id}
                      className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                              defect.severity === 'critical'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : defect.severity === 'high'
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {defect.severity}
                          </span>
                          <span className="font-mono text-xs text-sky-400">
                            เวลา: {(defect.timestampMs / 1000).toFixed(2)}s
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 uppercase font-mono">{defect.type}</span>
                      </div>

                      <div className="text-xs text-slate-200 font-medium">
                        {defect.descriptionThai}
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-900 flex justify-between">
                        <span>ค่าที่วัดได้: {defect.measuredValue.toFixed(3)}</span>
                        <span>เกณฑ์มาตรฐาน: {defect.threshold.toFixed(3)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MULTILINGUAL PHONETIC MATRIX */}
        {/* ========================================================================= */}
        {activeTab === 'phonetic_matrix' && qaResult && (
          <div id="phonetic-matrix-view" className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  การวิเคราะห์สัทศาสตร์และการออกเสียง ({qaResult.phoneticReport.languageSpecs.nameThai})
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {qaResult.phoneticReport.languageSpecs.keyRuleThai}
                </p>
              </div>

              {/* Phonetic Score Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">ความถูกต้องวรรณยุกต์/โทนเสียง</div>
                  <div className="text-2xl font-bold text-indigo-400">{qaResult.phoneticReport.toneAccuracyScore}%</div>
                </div>
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">ความคมชัดของฐานกรณ์ (Articulation)</div>
                  <div className="text-2xl font-bold text-emerald-400">{qaResult.phoneticReport.articulationScore}%</div>
                </div>
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">ความลื่นไหลต่อเนื่อง (Fluency)</div>
                  <div className="text-2xl font-bold text-sky-400">{qaResult.phoneticReport.fluencyScore}%</div>
                </div>
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">จำนวนพยางค์รวม (Total Syllables)</div>
                  <div className="text-2xl font-bold text-amber-400">{qaResult.phoneticReport.totalSyllables}</div>
                </div>
              </div>

              {/* Syllable-by-Syllable Inspection Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  จำแนกหน่วยเสียงพยางค์และสัทอักษรสากล (Phoneme Token Matrix)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {qaResult.phoneticReport.phoneticBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{item.token}</span>
                        <span className="font-mono text-xs text-indigo-400">{item.ipa}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: EMOTION BENCHMARK & ACTING RADAR */}
        {/* ========================================================================= */}
        {activeTab === 'emotion_radar' && qaResult && (
          <div id="emotion-radar-view" className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  การประเมินอารมณ์และน้ำเสียงการแสดง ({qaResult.emotionalEvaluation.benchmark.nameThai})
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {qaResult.emotionalEvaluation.benchmark.descriptionThai}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Benchmark Metrics Comparison */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    เปรียบเทียบพารามิเตอร์จริง vs เกณฑ์บทบาท (Measured vs Benchmark)
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between p-2.5 rounded-lg bg-slate-900">
                      <span className="text-slate-400">ความกว้างคีย์เสียง (Pitch Variance):</span>
                      <span className="font-mono text-white">
                        {qaResult.emotionalEvaluation.measuredMetrics.pitchVarianceSt} st (เกณฑ์:{' '}
                        {qaResult.emotionalEvaluation.benchmark.expectedPitchVarianceSt} st)
                      </span>
                    </div>

                    <div className="flex justify-between p-2.5 rounded-lg bg-slate-900">
                      <span className="text-slate-400">ความเร็วพากย์ (Syllable Rate):</span>
                      <span className="font-mono text-white">
                        {qaResult.emotionalEvaluation.measuredMetrics.syllableRate} syl/s (เกณฑ์:{' '}
                        {qaResult.emotionalEvaluation.benchmark.expectedSyllableRate} syl/s)
                      </span>
                    </div>

                    <div className="flex justify-between p-2.5 rounded-lg bg-slate-900">
                      <span className="text-slate-400">ไดนามิกความดัง (Dynamic Range):</span>
                      <span className="font-mono text-white">
                        {qaResult.emotionalEvaluation.measuredMetrics.rmsDynamicRangeDb} dB (เกณฑ์:{' '}
                        {qaResult.emotionalEvaluation.benchmark.expectedRmsDynamicRangeDb} dB)
                      </span>
                    </div>

                    <div className="flex justify-between p-2.5 rounded-lg bg-slate-900">
                      <span className="text-slate-400">อัตราลมหายใจ (Breathiness):</span>
                      <span className="font-mono text-white">
                        {(qaResult.emotionalEvaluation.measuredMetrics.breathiness * 100).toFixed(0)}% (เกณฑ์:{' '}
                        {(qaResult.emotionalEvaluation.benchmark.expectedBreathiness * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acting Critiques */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                    คำวิจารณ์ด้านการแสดง (Acting Performance Critiques)
                  </h3>

                  <div className="space-y-2">
                    {qaResult.emotionalEvaluation.actingCritiquesThai.map((crit, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300">
                        ✨ {crit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: 1-CLICK DSP AUTO-REMEDIATION */}
        {/* ========================================================================= */}
        {activeTab === 'auto_remediation' && (
          <div id="auto-remediation-view" className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    ห้องปรับแต่งและซ่อมแซมเสียงอัตโนมัติ (1-Click Intelligent Audio Polish)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    ปรับจูนคลื่นเสียงด้วยอัลกอริทึม DSP ออฟไลน์: De-Esser, Peak Limiter, Normalizer และ DC Offset Filter
                  </p>
                </div>

                <button
                  onClick={handleApplyRemediation}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all text-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ประมวลผลซ่อมแซมเสียงทันที (Apply DSP Polish)</span>
                </button>
              </div>

              {/* DSP Processing Chain Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { step: '01', title: 'DC Killer', desc: 'ล้างสัญญาณไฟตรงรั่วไหล คืนพื้นที่ Headroom' },
                  { step: '02', title: '80Hz High-Pass', desc: 'ตัดเสียงลมไมค์กระแทกต่ำกว่า 80Hz' },
                  { step: '03', title: 'Auto De-Esser', desc: 'ลดทอนความแหลมเสียดแทงย่าน 5.5k-8kHz' },
                  { step: '04', title: 'EBU Normalizer', desc: 'เกลี่ยความดังมาตรฐาน -14 LUFS' },
                  { step: '05', title: 'Soft Limiter', desc: 'เพดานเสียง -1.0 dB True Peak ป้องกัน Clip' }
                ].map((dsp, idx) => (
                  <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono text-indigo-400">{dsp.step}</div>
                    <div className="font-bold text-xs text-white">{dsp.title}</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{dsp.desc}</p>
                  </div>
                ))}
              </div>

              {/* A/B Comparison Playback Bar */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">เปรียบเทียบเสียง:</span>
                  <button
                    onClick={() => handlePlayAudio('original')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    🔊 ฟังเสียงต้นฉบับ (Before)
                  </button>
                  <button
                    onClick={() => handlePlayAudio('remediated')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-slate-950 transition-colors"
                  >
                    ✨ ฟังเสียงที่ปรับแก้แล้ว (After)
                  </button>
                </div>

                <div className="text-xs text-emerald-400 font-medium">
                  พร้อมใช้งานในเกมและงานโปรดักชันทันที
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
