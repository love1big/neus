/**
 * ============================================================================
 * [THAI] สตูดิโอระบบและอัลกอริทึมออกเสียง 30++ ภาษา สตรีมมิ่งออฟไลน์ และ AI ตรวจสอบไวยากรณ์
 * [ENGLISH] Global 30+ Languages Phonetics, Offline Streaming & AI Grammar Studio
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - หน้าจอหลักสำหรับควบคุมระบบสัทศาสตร์การออกเสียง ครอบคลุม 40 ภาษาและสำเนียงทั่วโลก:
 *   - จีนทุกภาค (Mandarin, Cantonese, Hokkien, Shanghainese, Hakka, Sichuanese)
 *   - ไทยทุกภาค (Central, Isan, Northern, Southern)
 *   - เกาหลี (Seoul Standard, Busan Gyeongsang)
 *   - อังกฤษ (US, UK, Australian, Indian, Scottish)
 *   - ญี่ปุ่น (Tokyo, Kansai)
 *   - อินเดีย 7 ภาษา (Hindi, Tamil, Telugu, Bengali, Marathi, Punjabi, Gujarati)
 *   - สากล (French, German, Spanish, Italian, Russian, Arabic, Vietnamese, etc.)
 * - ระบบสตรีมมิ่งเสียงออฟไลน์ (Offline AI Audio Streaming 20ms-50ms) พร้อม Visualizer
 * - ระบบตรวจสอบความถูกต้องตามหลักภาษาและสัทศาสตร์ (Linguistic & Acoustic Verifier)
 * - ระบบเช็คแปลและตรวจสอบไวยากรณ์ ระดับความสุภาพ โดย AI (AI Grammar Translation Verifier)
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - เชื่อมต่อกับ `GlobalPhonetics30Engine`, `GlobalAudioStreamingEngine`, `MultilingualGrammarTranslationVerifier`
 * - Export เป็น React Component รองรับ Lazy Loading ใน `App.tsx`
 *
 * @author Global Linguistic Engineering Directorate & NexusEngine Core Team
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Globe,
  Mic,
  Mic2,
  Volume2,
  Play,
  Square,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Activity,
  ShieldCheck,
  FileAudio,
  Sliders,
  Languages,
  Layers,
  BookOpen,
  ArrowRightLeft,
  Radio,
  Gauge,
  Zap,
  ChevronRight,
  Info
} from 'lucide-react';

import {
  DialectVoiceProfile,
  LinguisticVerificationResult,
  StreamingAudioChunk,
  StreamingSessionConfig,
  TranslationVerificationReport
} from '../types/multilingualPhonetics';
import { GlobalPhonetics30Engine } from '../utils/GlobalPhonetics30Engine';
import { GlobalAudioStreamingEngine } from '../utils/GlobalAudioStreamingEngine';
import { MultilingualGrammarTranslationVerifier } from '../utils/MultilingualGrammarTranslationVerifier';

export const GlobalPhonetics30Studio: React.FC = () => {
  // สตรีมมิ่งเอนจิน Instance
  const streamingEngine = useMemo(() => new GlobalAudioStreamingEngine(), []);

  // แท็บหลักของสตูดิโอ
  const [activeTab, setActiveTab] = useState<'phonetics' | 'streaming' | 'translation'>('phonetics');

  // ภาษา/สำเนียงที่เลือก
  const [selectedDialectId, setSelectedDialectId] = useState<string>('zh-cmn');
  const activeProfile: DialectVoiceProfile = useMemo(
    () => GlobalPhonetics30Engine.getProfileById(selectedDialectId),
    [selectedDialectId]
  );

  // ข้อมูลข้อความทดสอบการออกเสียง
  const [inputText, setInputText] = useState<string>('您好，很高兴认识您。');
  const [ipaOutput, setIpaOutput] = useState<string>('');

  // การตั้งค่าสตรีมมิ่ง
  const [streamingConfig, setStreamingConfig] = useState<StreamingSessionConfig>({
    sampleRate: 48000,
    bufferLatencyMs: 30,
    pitchShiftSemitones: 0,
    speakingRate: 1.0,
    volume: 0.9,
    enableAcousticFilter: true,
    enableFormantMorphing: true
  });

  // สถานะสตรีมมิ่ง
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [chunksReceived, setChunksReceived] = useState<number>(0);
  const [lastWavBlob, setLastWavBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<LinguisticVerificationResult | null>(null);

  // การแปลและตรวจสอบไวยากรณ์ (Tab 3)
  const [transSourceLang, setTransSourceLang] = useState<string>('th-central');
  const [transTargetLang, setTransTargetLang] = useState<string>('zh-cmn');
  const [transInputText, setTransInputText] = useState<string>('สวัสดีครับ ยินดีที่ได้รู้จักครับ');
  const [politenessLevel, setPolitenessLevel] = useState<'Casual' | 'Polite' | 'Formal' | 'Honorific' | 'Royal'>('Polite');
  const [transReport, setTransReport] = useState<TranslationVerificationReport | null>(null);

  // Canvas Waveform Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pcmHistoryRef = useRef<number[]>([]);

  // อัปเดตข้อความเริ่มต้นและ IPA เมื่อเปลี่ยนสำเนียง
  useEffect(() => {
    if (activeProfile.samplePhrases.length > 0) {
      const phrase = activeProfile.samplePhrases[0];
      setInputText(phrase.originalText);
      setIpaOutput(phrase.ipa);
    } else {
      const generatedIpa = GlobalPhonetics30Engine.convertTextToIPA(inputText, selectedDialectId);
      setIpaOutput(generatedIpa);
    }
    // คำนวณ Verification ครั้งแรก
    const report = GlobalPhonetics30Engine.verifyLinguisticAccuracy(inputText, selectedDialectId);
    setVerificationResult(report);
  }, [selectedDialectId]);

  // สมัครรับ Event Streaming จาก Engine
  useEffect(() => {
    const unsubState = streamingEngine.subscribeToState((active) => {
      setIsStreaming(active);
    });

    const unsubChunks = streamingEngine.subscribeToChunks((chunk: StreamingAudioChunk) => {
      setChunksReceived((prev) => prev + 1);

      // วาดคลื่นเสียงลง Waveform Buffer
      if (chunk.pcmData && chunk.pcmData.length > 0) {
        const step = Math.max(1, Math.floor(chunk.pcmData.length / 32));
        for (let i = 0; i < chunk.pcmData.length; i += step) {
          pcmHistoryRef.current.push(chunk.pcmData[i]);
          if (pcmHistoryRef.current.length > 300) {
            pcmHistoryRef.current.shift();
          }
        }
        drawWaveform();
      }
    });

    return () => {
      unsubState();
      unsubChunks();
      streamingEngine.stopStreaming();
    };
  }, [streamingEngine]);

  // ฟังก์ชันวาดรูปคลื่นเสียงลง Canvas
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();

    const data = pcmHistoryRef.current;
    const sliceWidth = width / Math.max(1, data.length);
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i];
      const y = (height / 2) + (v * (height / 2) * 0.95);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };

  // ดำเนินการสตรีมมิ่งและสังเคราะห์เสียงออฟไลน์
  const handleStartStreamingSynthesis = async () => {
    try {
      setChunksReceived(0);
      const pcmData = await streamingEngine.startOfflineStreamingSynthesis(
        inputText,
        activeProfile,
        streamingConfig
      );

      // สร้างไฟล์ WAV Blob
      const blob = GlobalAudioStreamingEngine.exportPcmToWavBlob(pcmData, streamingConfig.sampleRate);
      setLastWavBlob(blob);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(URL.createObjectURL(blob));

      // ตรวจสอบความถูกต้องทางสัทศาสตร์พร้อมข้อมูล PCM
      const report = GlobalPhonetics30Engine.verifyLinguisticAccuracy(inputText, selectedDialectId, pcmData);
      setVerificationResult(report);
    } catch (err) {
      console.error('Streaming synthesis failed:', err);
    }
  };

  // เล่นเสียงผ่าน Web Speech API (ถ้ามีเสียงออฟไลน์ของเบราว์เซอร์)
  const handleBrowserSpeechPlayback = async () => {
    try {
      await streamingEngine.speakWithBrowserEngine(
        inputText,
        activeProfile.languageCode,
        streamingConfig.speakingRate,
        1.0 + (streamingConfig.pitchShiftSemitones / 12)
      );
    } catch (err) {
      console.warn('Fallback to neural streaming:', err);
      handleStartStreamingSynthesis();
    }
  };

  // ดำเนินการตรวจสอบการแปลและไวยากรณ์ (Tab 3)
  const handleRunTranslationVerification = () => {
    const report = MultilingualGrammarTranslationVerifier.verifyAndTranslate(
      transInputText,
      transSourceLang,
      transTargetLang,
      politenessLevel
    );
    setTransReport(report);
  };

  // รันการแปลครั้งแรกเมื่อเข้าแท็บ 3
  useEffect(() => {
    if (activeTab === 'translation' && !transReport) {
      handleRunTranslationVerification();
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0d1117] text-[#e6edf3] font-sans select-none overflow-hidden">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#161b22] border-b border-[#30363d] shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40">
            <Globe size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                GLOBAL 30++ PHONETICS & OFFLINE STREAMING STUDIO
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#238636]/30 text-[#3fb950] border border-[#238636] rounded-full">
                40 DIALECTS AAA ENGINE
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#8957e5]/30 text-[#d2a8ff] border border-[#8957e5] rounded-full">
                OFFLINE LAPTOP READY
              </span>
            </div>
            <p className="text-xs text-[#8b949e]">
              ระบบสัทศาสตร์ 30++ ภาษา/สำเนียง (จีนทุกภาค, ไทยทุกภาค, เกาหลี, อังกฤษ, ญี่ปุ่น, อินเดีย) + สตรีมมิ่งออฟไลน์ & AI เช็คไวยากรณ์
            </p>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex items-center space-x-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
          <button
            onClick={() => setActiveTab('phonetics')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'phonetics'
                ? 'bg-[#1f6feb] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Languages size={14} />
            <span>สัทศาสตร์ 30++ ภาษา</span>
          </button>
          <button
            onClick={() => setActiveTab('streaming')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'streaming'
                ? 'bg-[#1f6feb] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Radio size={14} />
            <span>สตรีมมิ่งเสียง & ตรวจสอบ AI</span>
          </button>
          <button
            onClick={() => setActiveTab('translation')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'translation'
                ? 'bg-[#1f6feb] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <ShieldCheck size={14} />
            <span>AI ตรวจสอบการแปล & ไวยากรณ์</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content View Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================================================================= */}
        {/* TAB 1: สัทศาสตร์การออกเสียง 30++ ภาษาทั่วโลก                      */}
        {/* ================================================================= */}
        {activeTab === 'phonetics' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Dialect Picker Sidebar */}
            <div className="w-80 bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
              <div className="p-3 border-b border-[#30363d] bg-[#0d1117]/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                  คลัง 40 ภาษา & สำเนียงภูมิภาค
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#21262d] text-[#58a6ff] rounded border border-[#30363d]">
                  {GlobalPhonetics30Engine.DIALECT_PROFILES.length} สำเนียง
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {GlobalPhonetics30Engine.DIALECT_PROFILES.map((p) => {
                  const isSelected = p.id === selectedDialectId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedDialectId(p.id)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all flex flex-col ${
                        isSelected
                          ? 'bg-[#1f6feb]/15 border-[#1f6feb] text-white shadow-sm'
                          : 'bg-[#21262d]/40 border-transparent text-[#c9d1d9] hover:bg-[#21262d] hover:border-[#30363d]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-semibold truncate">{p.nameThai}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0d1117] text-[#8b949e] border border-[#30363d]">
                          {p.languageCode}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-[#8b949e]">
                        <span className="truncate">{p.region}</span>
                        <span className="text-[10px] text-[#58a6ff] font-mono">
                          {p.toneCount > 0 ? `${p.toneCount} วรรณยุกต์` : 'Non-Tonal'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Phonetics Rules & G2P Playground */}
            <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto p-6 space-y-6">
              {/* Dialect Banner Overview */}
              <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-white">{activeProfile.nameThai}</h2>
                    <span className="px-2 py-0.5 text-xs rounded bg-[#388bfd]/20 text-[#58a6ff] border border-[#388bfd]/30">
                      {activeProfile.family}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded bg-[#8957e5]/20 text-[#d2a8ff] border border-[#8957e5]/30">
                      Tone: {activeProfile.toneType} ({activeProfile.toneCount})
                    </span>
                  </div>
                  <p className="text-xs text-[#8b949e] mt-1">{activeProfile.nameEnglish} • {activeProfile.region}</p>
                  <div className="flex items-center space-x-4 mt-3 text-xs text-[#c9d1d9]">
                    <span className="flex items-center space-x-1">
                      <Gauge size={14} className="text-[#3fb950]" />
                      <span>ช่วงความถี่ Pitch: <b>{activeProfile.pitchRangeHz[0]} - {activeProfile.pitchRangeHz[1]} Hz</b></span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Sliders size={14} className="text-[#e3b341]" />
                      <span>Formants: <b>F1={activeProfile.formantDefaults.F1} F2={activeProfile.formantDefaults.F2} F3={activeProfile.formantDefaults.F3}</b></span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleStartStreamingSynthesis}
                    disabled={isStreaming}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold rounded-lg shadow transition-all disabled:opacity-50"
                  >
                    <Play size={14} />
                    <span>สังเคราะห์เสียงสตรีมมิ่ง</span>
                  </button>
                  <button
                    onClick={handleBrowserSpeechPlayback}
                    className="flex items-center space-x-2 px-3 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-semibold rounded-lg border border-[#30363d] transition-all"
                  >
                    <Volume2 size={14} />
                    <span>เสียงเบราว์เซอร์</span>
                  </button>
                </div>
              </div>

              {/* G2P Converter Box */}
              <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen size={16} className="text-[#58a6ff]" />
                    <span className="text-sm font-semibold text-white">
                      ตัวแปลงสัทอักษรสากลอัตโนมัติ (G2P / IPA Converter)
                    </span>
                  </div>
                  <span className="text-xs text-[#8b949e]">เลือกประโยคตัวอย่างหรือพิมพ์ข้อความ</span>
                </div>

                {/* Sample Phrases Chips */}
                <div className="flex flex-wrap gap-2">
                  {activeProfile.samplePhrases.map((phrase, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputText(phrase.originalText);
                        setIpaOutput(phrase.ipa);
                      }}
                      className="text-xs px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded border border-[#30363d] transition-all"
                    >
                      {phrase.originalText}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs text-[#8b949e] block mb-1">ข้อความภาษาต้นทาง</label>
                    <textarea
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        setIpaOutput(GlobalPhonetics30Engine.convertTextToIPA(e.target.value, selectedDialectId));
                      }}
                      rows={3}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#1f6feb]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8b949e] block mb-1">สัทอักษรสากล (International Phonetic Alphabet / IPA)</label>
                    <div className="w-full h-[86px] bg-[#0d1117] border border-[#30363d] rounded-lg p-3 font-mono text-sm text-[#38bdf8] overflow-y-auto">
                      {ipaOutput || 'สัทอักษรจะปรากฏที่นี่...'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Phonetic Rules Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers size={16} className="text-[#3fb950]" />
                    <span className="text-sm font-semibold text-white">
                      กฎสัทศาสตร์เฉพาะและทำนองเสียงประจำสำเนียง (Phonological & Sandhi Rules)
                    </span>
                  </div>
                  <span className="text-xs text-[#8b949e]">
                    {activeProfile.phoneticRules.length} กฎระดับลึก
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeProfile.phoneticRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#1f6feb]/50 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#58a6ff]">{rule.ruleNameThai}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#0d1117] text-[#8b949e] rounded border border-[#30363d]">
                          {rule.patternTrigger}
                        </span>
                      </div>
                      <p className="text-xs text-[#c9d1d9] leading-relaxed">{rule.descriptionThai}</p>
                      <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[#8b949e]">ตัวอย่าง:</span>
                          <span className="font-semibold text-white">{rule.exampleWord}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#8b949e]">สัทอักษร IPA:</span>
                          <span className="font-mono text-[#38bdf8]">{rule.examplePronunciation}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#8b949e]">ความหมาย:</span>
                          <span className="text-[#3fb950]">{rule.exampleMeaningThai}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#8b949e] italic border-t border-[#30363d]/60 pt-2">
                        💡 {rule.acousticFeatureNote}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: ระบบสตรีมมิ่งเสียงออฟไลน์ & ตรวจสอบความถูกต้องโดย AI          */}
        {/* ================================================================= */}
        {activeTab === 'streaming' && (
          <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto p-6 space-y-6">
            {/* Streaming Dashboard Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Settings Box */}
              <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center space-x-2">
                    <Sliders size={16} className="text-[#58a6ff]" />
                    <span>การตั้งค่าสตรีมมิ่งแบบเรียลไทม์</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isStreaming
                      ? 'bg-[#238636]/30 text-[#3fb950] border border-[#238636] animate-pulse'
                      : 'bg-[#30363d] text-[#8b949e]'
                  }`}>
                    {isStreaming ? 'STREAMING ACTIVE' : 'IDLE'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#8b949e] flex justify-between">
                      <span>Buffer Latency (ความหน่วง):</span>
                      <span className="font-mono text-[#58a6ff]">{streamingConfig.bufferLatencyMs} ms</span>
                    </label>
                    <input
                      type="range"
                      min={20}
                      max={80}
                      step={5}
                      value={streamingConfig.bufferLatencyMs}
                      onChange={(e) => setStreamingConfig({ ...streamingConfig, bufferLatencyMs: Number(e.target.value) })}
                      className="w-full accent-[#1f6feb] mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[#8b949e] flex justify-between">
                      <span>Speaking Speed (อัตราความเร็ว):</span>
                      <span className="font-mono text-[#58a6ff]">{streamingConfig.speakingRate}x</span>
                    </label>
                    <input
                      type="range"
                      min={0.5}
                      max={1.8}
                      step={0.1}
                      value={streamingConfig.speakingRate}
                      onChange={(e) => setStreamingConfig({ ...streamingConfig, speakingRate: Number(e.target.value) })}
                      className="w-full accent-[#1f6feb] mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[#8b949e] flex justify-between">
                      <span>Pitch Shift (ระดับเสียงกึ่งเสียง):</span>
                      <span className="font-mono text-[#58a6ff]">{streamingConfig.pitchShiftSemitones} st</span>
                    </label>
                    <input
                      type="range"
                      min={-6}
                      max={6}
                      step={1}
                      value={streamingConfig.pitchShiftSemitones}
                      onChange={(e) => setStreamingConfig({ ...streamingConfig, pitchShiftSemitones: Number(e.target.value) })}
                      className="w-full accent-[#1f6feb] mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[#8b949e] flex justify-between">
                      <span>Sample Rate:</span>
                      <span className="font-mono text-[#58a6ff]">{streamingConfig.sampleRate} Hz</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {[24000, 44100, 48000].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setStreamingConfig({ ...streamingConfig, sampleRate: rate as any })}
                          className={`py-1 text-center rounded border text-[11px] font-mono ${
                            streamingConfig.sampleRate === rate
                              ? 'bg-[#1f6feb]/20 border-[#1f6feb] text-white'
                              : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'
                          }`}
                        >
                          {rate / 1000}k
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={handleStartStreamingSynthesis}
                    disabled={isStreaming}
                    className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded-lg shadow transition-all disabled:opacity-50"
                  >
                    <Play size={14} />
                    <span>เริ่มสตรีมเสียงสังเคราะห์</span>
                  </button>
                  {isStreaming && (
                    <button
                      onClick={() => streamingEngine.stopStreaming()}
                      className="px-3 py-2.5 bg-[#da3633] hover:bg-[#f85149] text-white text-xs font-bold rounded-lg shadow transition-all"
                    >
                      <Square size={14} />
                    </button>
                  )}
                </div>

                {lastWavBlob && audioUrl && (
                  <a
                    href={audioUrl}
                    download={`speech_${selectedDialectId}_${Date.now()}.wav`}
                    className="flex items-center justify-center space-x-2 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-semibold rounded-lg border border-[#30363d] transition-all"
                  >
                    <Download size={14} />
                    <span>ดาวน์โหลดไฟล์เสียง WAV</span>
                  </a>
                )}
              </div>

              {/* Center Real-time Waveform Canvas */}
              <div className="lg:col-span-2 p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity size={16} className="text-[#38bdf8]" />
                    <span className="text-sm font-bold text-white">
                      เรียลไทม์ออสซิลโลสโคป (Live PCM Streaming Oscilloscope)
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-[#8b949e]">
                    <span>Chunks: <b className="text-white font-mono">{chunksReceived}</b></span>
                    <span>Buffer Latency: <b className="text-[#38bdf8] font-mono">{streamingConfig.bufferLatencyMs}ms</b></span>
                  </div>
                </div>

                <div className="w-full h-44 bg-[#0d1117] rounded-lg border border-[#30363d] p-2 flex items-center justify-center relative overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={160}
                    className="w-full h-full block"
                  />
                  {!isStreaming && pcmHistoryRef.current.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-[#8b949e]/60 pointer-events-none">
                      กดปุ่ม "เริ่มสตรีมเสียงสังเคราะห์" เพื่อดูรูปคลื่นเสียงแบบเรียลไทม์
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-[#8b949e] border-t border-[#30363d] pt-3">
                  <span>สถานะความสมบูรณ์สัญญาณ: <b className="text-[#3fb950]">Ultra-Low Latency PCM Stream</b></span>
                  <span>Dialect Target: <b className="text-white">{activeProfile.nameThai}</b></span>
                </div>
              </div>
            </div>

            {/* AI Linguistic & Acoustic Verification Report */}
            {verificationResult && (
              <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck size={18} className="text-[#3fb950]" />
                    <span className="text-sm font-bold text-white">
                      รายงานการตรวจสอบความถูกต้องตามหลักภาษาและสัทศาสตร์โดย AI (Linguistic QA Report)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-[#8b949e]">ความถูกต้องรวม:</span>
                    <span className="text-sm font-bold text-[#3fb950] font-mono">
                      {verificationResult.scorePercent}%
                    </span>
                  </div>
                </div>

                {/* Score Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
                    <span className="text-[11px] text-[#8b949e]">Phoneme Accuracy</span>
                    <div className="text-base font-bold text-[#38bdf8] font-mono">
                      {verificationResult.phonemeAccuracy}%
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
                    <span className="text-[11px] text-[#8b949e]">Tone Conformity</span>
                    <div className="text-base font-bold text-[#3fb950] font-mono">
                      {verificationResult.toneConformity}%
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
                    <span className="text-[11px] text-[#8b949e]">Pitch Stability</span>
                    <div className="text-base font-bold text-[#d2a8ff] font-mono">
                      {verificationResult.acousticIntegrity.pitchStability}%
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
                    <span className="text-[11px] text-[#8b949e]">Spectral Centroid</span>
                    <div className="text-base font-bold text-[#e3b341] font-mono">
                      {verificationResult.acousticIntegrity.spectralCentroidHz} Hz
                    </div>
                  </div>
                </div>

                {/* Detected Sandhi & Liaison Details */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#c9d1d9]">
                    กฎการเชื่อมเสียงและการผันวรรณยุกต์ที่ตรวจพบ (Detected Sandhi / Liaison Rules):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {verificationResult.detectedSandhiOrLiaison.length > 0 ? (
                      verificationResult.detectedSandhiOrLiaison.map((ruleText, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded bg-[#238636]/15 text-[#3fb950] border border-[#238636]/40 text-xs flex items-center space-x-1"
                        >
                          <CheckCircle size={12} />
                          <span>{ruleText}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#8b949e]">ไม่มีกฎการเปลี่ยนเสียงซับซ้อนในวลีนี้</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: AI ตรวจสอบการแปลและไวยากรณ์ตามหลักภาษาต่างๆ                 */}
        {/* ================================================================= */}
        {activeTab === 'translation' && (
          <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto p-6 space-y-6">
            {/* Translation Input & Options Bar */}
            <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  {/* Source Language */}
                  <div>
                    <label className="text-[11px] text-[#8b949e] block mb-1">ภาษาต้นทาง (Source)</label>
                    <select
                      value={transSourceLang}
                      onChange={(e) => setTransSourceLang(e.target.value)}
                      className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#1f6feb]"
                    >
                      {GlobalPhonetics30Engine.DIALECT_PROFILES.map((p) => (
                        <option key={p.id} value={p.id}>{p.nameThai}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 text-[#8b949e]">
                    <ArrowRightLeft size={16} />
                  </div>

                  {/* Target Language */}
                  <div>
                    <label className="text-[11px] text-[#8b949e] block mb-1">ภาษาเป้าหมาย (Target)</label>
                    <select
                      value={transTargetLang}
                      onChange={(e) => setTransTargetLang(e.target.value)}
                      className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#1f6feb]"
                    >
                      {GlobalPhonetics30Engine.DIALECT_PROFILES.map((p) => (
                        <option key={p.id} value={p.id}>{p.nameThai}</option>
                      ))}
                    </select>
                  </div>

                  {/* Politeness Level */}
                  <div>
                    <label className="text-[11px] text-[#8b949e] block mb-1">ระดับความสุภาพ (Formality)</label>
                    <select
                      value={politenessLevel}
                      onChange={(e) => setPolitenessLevel(e.target.value as any)}
                      className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-[#58a6ff] font-semibold focus:outline-none focus:border-[#1f6feb]"
                    >
                      <option value="Casual">Casual (กันเอง / 반말 / タメ口)</option>
                      <option value="Polite">Polite (สุภาพมาตรฐาน / 해요체 / 丁寧語)</option>
                      <option value="Formal">Formal (ทางการ / 합쇼체 / 敬語)</option>
                      <option value="Honorific">Honorific (ยกย่องระดับสูง / 존댓말)</option>
                      <option value="Royal">Royal (ราชาศัพท์ / ราชาธิบดี)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleRunTranslationVerification}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#1f6feb] hover:bg-[#388bfd] text-white text-xs font-bold rounded-lg shadow transition-all mt-4"
                >
                  <Sparkles size={14} />
                  <span>ตรวจสอบและแปลโดย AI</span>
                </button>
              </div>

              {/* Text Input */}
              <div className="pt-2">
                <label className="text-xs text-[#8b949e] block mb-1">ประโยคต้นทางที่ต้องการแปลและตรวจสอบไวยากรณ์</label>
                <textarea
                  value={transInputText}
                  onChange={(e) => setTransInputText(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#1f6feb]"
                />
              </div>
            </div>

            {/* Translation Verification Report Display */}
            {transReport && (
              <div className="space-y-6">
                {/* Result Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Translated Text Card */}
                  <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">
                        คำแปลภาษาเป้าหมาย (Target Translation)
                      </span>
                      <button
                        onClick={() => {
                          streamingEngine.startOfflineStreamingSynthesis(
                            transReport.translatedText,
                            GlobalPhonetics30Engine.getProfileById(transTargetLang),
                            streamingConfig
                          );
                        }}
                        className="flex items-center space-x-1 text-xs text-[#3fb950] hover:underline"
                      >
                        <Volume2 size={13} />
                        <span>ฟังเสียงออกเสียง</span>
                      </button>
                    </div>

                    <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] text-base font-semibold text-white">
                      {transReport.translatedText}
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[#8b949e]">
                        <span>สัทอักษร IPA:</span>
                        <span className="font-mono text-[#38bdf8]">{transReport.ipaTargetPhonetics}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#8b949e]">
                        <span>Romanization:</span>
                        <span className="text-[#c9d1d9]">{transReport.romanizedTargetText}</span>
                      </div>
                    </div>
                  </div>

                  {/* Back-Translation Verification Card */}
                  <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#d2a8ff] uppercase tracking-wider">
                        การแปลย้อนกลับเพื่อยืนยันความหมาย (Back-Translation)
                      </span>
                      <span className="text-xs font-mono font-bold text-[#3fb950]">
                        ความสอดคล้อง: {transReport.semanticAlignmentScore}%
                      </span>
                    </div>

                    <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] text-sm text-[#c9d1d9]">
                      {transReport.backTranslatedText}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#8b949e]">
                      <span>ระดับความสุภาพที่ตรวจพบ:</span>
                      <span className="px-2 py-0.5 rounded bg-[#1f6feb]/20 text-[#58a6ff] font-bold">
                        {transReport.politenessLevelDetected}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grammar & False Friends Audit Section */}
                <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck size={18} className="text-[#3fb950]" />
                      <span className="text-sm font-bold text-white">
                        ผลการตรวจสอบไวยากรณ์และความถูกต้องทางภาษาศาสตร์ (Grammar & False-Friend Audit)
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#38bdf8]">
                      คะแนนไวยากรณ์: {transReport.grammaticalCorrectnessScore}%
                    </span>
                  </div>

                  {transReport.grammarAnomalies.length > 0 ? (
                    <div className="space-y-2">
                      {transReport.grammarAnomalies.map((ano, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-[#da3633]/15 border border-[#da3633]/40 text-xs text-[#f85149] flex items-start space-x-2"
                        >
                          <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">[{ano.issueType}]: </span>
                            <span>{ano.descriptionThai}</span>
                            <div className="mt-1 text-[#e6edf3]">
                              ข้อแนะนำการแก้ไข: <b className="text-[#3fb950]">{ano.recommendedCorrection}</b>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-[#238636]/15 border border-[#238636]/40 text-xs text-[#3fb950] flex items-center space-x-2">
                      <CheckCircle size={15} />
                      <span>
                        โครงสร้างไวยากรณ์สมบูรณ์แบบ ไม่พบคำลวง (False Friends) และระดับความสุภาพสอดคล้องกับบริบทวัฒนธรรม
                      </span>
                    </div>
                  )}

                  <div className="text-xs text-[#8b949e] italic border-t border-[#30363d] pt-2">
                    💬 {transReport.idiomPreservationNote}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalPhonetics30Studio;
