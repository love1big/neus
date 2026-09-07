/**
 * ============================================================================
 * [THAI] สตูดิโอระบบแปลภาษา AI ออฟไลน์ 70++ ภาษาที่คนใช้งานมากที่สุดในโลก
 * [ENGLISH] Global 70+ Most Spoken Languages Offline AI Translation Studio
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - หน้าจอส่วนติดต่อผู้ใช้ระดับมืออาชีพ (AAA Professional UI) สำหรับระบบแปลภาษาออฟไลน์ 100%:
 *   1. Interactive Translation Console: แปลข้อความสด รองรับ 75+ ภาษาหลักทั่วโลก รวมถึงภาษาไทย
 *   2. Tone & Register Selector: ปรับแต่งระดับความสุภาพ (Formal, Casual, Neutral, Literary, Technical)
 *   3. Bidirectional Back-Translation: ยืนยันความถูกต้องของความหมายพร้อมคะแนนสัจจะความหมาย
 *   4. Quality & Hallucination Metrics: ตรวจวัดคะแนน BLEU, chrF, สัดส่วนความยาว และความเสี่ยงหลอน
 *   5. Global 75+ Languages Catalog: คลังสำรวจข้อมูลภาษา ตระกูลภาษา อักขรวิธี และจำนวนผู้พูด
 *   6. Offline Batch Document Translator: แปลไฟล์ JSON, CSV, Subtitle SRT, Markdown แบบกลุ่ม
 *   7. Glossary Terminology Lock Manager: ระบบล็อกคำศัพท์เฉพาะ ป้องกันชื่อตัวละคร/ไอเทมเพี้ยน
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - เชื่อมต่อกับ `GlobalOfflineAITranslationEngine`, `global70LanguagesCatalog`,
 *   `OfflineTranslationQualityEvaluator`, และ `OfflineBatchTranslationNode`
 * - Export เป็น React Functional Component สำหรับโหลดใน `App.tsx`
 *
 * @author Global Offline AI Translation Directorate & NexusEngine Core Team
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Download,
  Upload,
  Volume2,
  VolumeX,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Sliders,
  Layers,
  Sparkles,
  BookOpen,
  Search,
  Globe,
  Database,
  Lock,
  Plus,
  Trash2,
  Play,
  Clock,
  Gauge,
  Info,
  Activity,
  CheckCircle2,
  XCircle,
  Mic,
  Waves,
  Square,
  ArrowRight
} from 'lucide-react';

import {
  BatchTranslationJob,
  GlobalLanguageProfile,
  OfflineGlossaryRule,
  OfflineTranslationConfig,
  OfflineTranslationResult,
  TranslationDomain,
  TranslationRegister,
  TranslationAuditReport,
  PhoneticPronunciationProfile
} from '../types/offlineTranslation70';
import {
  GLOBAL_70_LANGUAGES,
  detectLanguageFromText,
  getLanguageProfileById
} from '../data/global70LanguagesCatalog';
import { GlobalOfflineAITranslationEngine } from '../utils/GlobalOfflineAITranslationEngine';
import { OfflineBatchTranslationNode } from '../utils/OfflineBatchTranslationNode';
import { OfflineAITranslationAuditorNode } from '../utils/OfflineAITranslationAuditorNode';
import { Global70PhoneticPronunciationEngine } from '../utils/Global70PhoneticPronunciationEngine';
import { OfflineAcousticFormantSpeechSynthesizer } from '../utils/OfflineAcousticFormantSpeechSynthesizer';
import { GlobalOfflineAITranslationAuditorView } from './GlobalOfflineAITranslationAuditorView';
import { Global70PhoneticPronunciationStudioView } from './Global70PhoneticPronunciationStudioView';
import { LocalizationVerificationDashboard } from './LocalizationVerificationDashboard';

export const GlobalOfflineAITranslationStudio: React.FC = () => {
  // แท็บหลักของสตูดิโอ (เพิ่มศูนย์ตรวจการแปล 8 มิติ, สัทศาสตร์, และแดชบอร์ดตรวจสอบบริบทการโลคัลไลซ์)
  const [activeTab, setActiveTab] = useState<'console' | 'audit' | 'verify' | 'phonetics' | 'catalog' | 'batch' | 'glossary'>('console');

  // การตั้งค่าการแปล
  const [sourceLangId, setSourceLangId] = useState<string>('auto');
  const [targetLangId, setTargetLangId] = useState<string>('th');
  const [register, setRegister] = useState<TranslationRegister>('formal');
  const [domain, setDomain] = useState<TranslationDomain>('general');
  const [preserveGlossary, setPreserveGlossary] = useState<boolean>(true);

  // ข้อความต้นทางและผลลัพธ์
  const [sourceText, setSourceText] = useState<string>(
    'Hello and welcome to the advanced offline neural translation studio. This system works completely offline without any internet connection.'
  );
  const [translationResult, setTranslationResult] = useState<OfflineTranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // ระบบตรวจสอบคุณภาพ 8 มิติโดย AI ออฟไลน์ (Offline AI Translation Audit)
  const [auditReport, setAuditReport] = useState<TranslationAuditReport | null>(null);

  // ระบบสัทศาสตร์และการออกเสียงธรรมชาติ (Phonetic & Natural Speech Engine)
  const [phoneticProfile, setPhoneticProfile] = useState<PhoneticPronunciationProfile | null>(null);
  const [phoneticSelectedLangId, setPhoneticSelectedLangId] = useState<string>('th');
  const [phoneticCustomText, setPhoneticCustomText] = useState<string>('สวัสดีครับ ยินดีต้อนรับสู่ระบบแปลภาษา');
  const [phoneticGender, setPhoneticGender] = useState<'neutral' | 'female' | 'male'>('neutral');
  const [isAcousticPlaying, setIsAcousticPlaying] = useState<boolean>(false);
  const [selectedPhoneticTabProfile, setSelectedPhoneticTabProfile] = useState<PhoneticPronunciationProfile | null>(null);

  // ค้นหาใน Catalog
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<string>('all');

  // คลัง Glossary เฉพาะ
  const [glossaryRules, setGlossaryRules] = useState<OfflineGlossaryRule[]>([
    {
      id: 'rule_1',
      sourceTerm: 'NexusEngine',
      targetTerm: 'NexusEngine',
      sourceLang: '',
      targetLang: '',
      caseSensitive: true,
      domain: 'gaming',
      notes: 'ชื่อเอนจินหลัก ห้ามแปล'
    },
    {
      id: 'rule_2',
      sourceTerm: 'Dragon Slayer',
      targetTerm: 'ดาบพิฆาตมังกร',
      sourceLang: 'en',
      targetLang: 'th',
      caseSensitive: false,
      domain: 'gaming',
      notes: 'ชื่อไอเทมในเกม'
    }
  ]);
  const [newSourceTerm, setNewSourceTerm] = useState<string>('');
  const [newTargetTerm, setNewTargetTerm] = useState<string>('');

  // งานแปลเอกสารกลุ่ม (Batch Job)
  const [batchFormat, setBatchFormat] = useState<'json' | 'srt' | 'csv' | 'txt'>('json');
  const [batchInputText, setBatchInputText] = useState<string>(
    `{\n  "app_welcome": "Welcome to the game",\n  "app_start": "Start Adventure",\n  "app_options": "Game Settings",\n  "app_exit": "Exit Game"\n}`
  );
  const [batchJob, setBatchJob] = useState<BatchTranslationJob | null>(null);
  const [isBatchProcessing, setIsBatchProcessing] = useState<boolean>(false);

  // ดึงโปรไฟล์ภาษาเป้าหมายและภาษาต้นทางที่ตรวจพบ
  const targetProfile = useMemo(() => getLanguageProfileById(targetLangId), [targetLangId]);
  const effectiveSourceProfile = useMemo(() => {
    if (sourceLangId === 'auto') {
      return detectLanguageFromText(sourceText);
    }
    return getLanguageProfileById(sourceLangId);
  }, [sourceLangId, sourceText]);

  // ฟังก์ชันสั่งแปลข้อความ
  const handlePerformTranslation = () => {
    setIsTranslating(true);
    try {
      const config: OfflineTranslationConfig = {
        sourceLangId,
        targetLangId,
        register,
        domain,
        preserveFormatting: true,
        preserveGlossary,
        subwordTokenization: true,
        detectToneDrift: true
      };

      const result = GlobalOfflineAITranslationEngine.translate(sourceText, config, glossaryRules);
      setTranslationResult(result);

      // รันการตรวจสอบคุณภาพ 8 มิติโดย AI Offline โดยอัตโนมัติ
      const audit = OfflineAITranslationAuditorNode.auditTranslation(
        sourceText,
        result.translatedText,
        sourceLangId,
        targetLangId,
        config,
        glossaryRules
      );
      setAuditReport(audit);

      // วิเคราะห์สัทศาสตร์ IPA และการออกเสียงสำหรับผลการแปล
      const phonetics = Global70PhoneticPronunciationEngine.analyze(
        result.translatedText,
        targetLangId,
        { gender: phoneticGender }
      );
      setPhoneticProfile(phonetics);
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // ดำเนินการวิเคราะห์สัทศาสตร์ในแท็บ Phonetics
  const handleAnalyzePhoneticLab = () => {
    const profile = Global70PhoneticPronunciationEngine.analyze(
      phoneticCustomText,
      phoneticSelectedLangId,
      { gender: phoneticGender }
    );
    setSelectedPhoneticTabProfile(profile);
  };

  useEffect(() => {
    handleAnalyzePhoneticLab();
  }, [phoneticCustomText, phoneticSelectedLangId, phoneticGender]);

  // เปล่งเสียงด้วย Acoustic Formant Synthesizer 100% ออฟไลน์
  const handlePlayAcousticFormants = async (profileToPlay?: PhoneticPronunciationProfile | null) => {
    const profile = profileToPlay || phoneticProfile;
    if (!profile) return;
    setIsAcousticPlaying(true);
    try {
      await OfflineAcousticFormantSpeechSynthesizer.playAcoustic(profile);
    } catch (err) {
      console.warn('Acoustic speech synth error:', err);
    } finally {
      setIsAcousticPlaying(false);
    }
  };

  const handleStopAcoustic = () => {
    OfflineAcousticFormantSpeechSynthesizer.stopSpeech();
    setIsAcousticPlaying(false);
  };

  // ใช้งานข้อเสนอแนะที่ AI ตรวจสอบและแก้ไขให้โดยอัตโนมัติ
  const handleApplyAutoCorrectSuggestion = (corrected: string) => {
    if (!translationResult) return;
    setTranslationResult({
      ...translationResult,
      translatedText: corrected
    });
    const config: OfflineTranslationConfig = {
      sourceLangId,
      targetLangId,
      register,
      domain,
      preserveFormatting: true,
      preserveGlossary,
      subwordTokenization: true,
      detectToneDrift: true
    };
    const newAudit = OfflineAITranslationAuditorNode.auditTranslation(
      sourceText,
      corrected,
      sourceLangId,
      targetLangId,
      config,
      glossaryRules
    );
    setAuditReport(newAudit);
    const newPhonetics = Global70PhoneticPronunciationEngine.analyze(
      corrected,
      targetLangId,
      { gender: phoneticGender }
    );
    setPhoneticProfile(newPhonetics);
  };

  // ดำเนินการแปลครั้งแรกเมื่อเริ่มต้น
  useEffect(() => {
    handlePerformTranslation();
  }, [sourceLangId, targetLangId, register, domain, preserveGlossary]);

  // สลับภาษาต้นทางและเป้าหมาย
  const handleSwapLanguages = () => {
    const newTarget = effectiveSourceProfile.id;
    const newSource = targetLangId;
    setSourceLangId(newSource);
    setTargetLangId(newTarget);
    if (translationResult?.translatedText) {
      setSourceText(translationResult.translatedText);
    }
  };

  // คัดลอกข้อความแปล
  const handleCopyTranslation = () => {
    if (translationResult?.translatedText) {
      navigator.clipboard.writeText(translationResult.translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ฟังเสียงอ่านผ่าน Web Speech API
  const handleSpeakText = (text: string, langIso: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langIso;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // กรองภาษาใน Catalog
  const filteredCatalog = useMemo(() => {
    return GLOBAL_70_LANGUAGES.filter((item) => {
      const matchQuery =
        item.nameThai.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        item.nameEnglish.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        item.nativeName.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        item.id.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        item.regionOfOrigin.toLowerCase().includes(catalogSearch.toLowerCase());

      const matchFamily =
        selectedFamilyFilter === 'all' || item.family.includes(selectedFamilyFilter);

      return matchQuery && matchFamily;
    });
  }, [catalogSearch, selectedFamilyFilter]);

  // ดำเนินการแปล Batch File
  const handleRunBatchTranslation = async () => {
    setIsBatchProcessing(true);
    try {
      const config: OfflineTranslationConfig = {
        sourceLangId: sourceLangId === 'auto' ? effectiveSourceProfile.id : sourceLangId,
        targetLangId,
        register,
        domain,
        preserveFormatting: true,
        preserveGlossary,
        subwordTokenization: true,
        detectToneDrift: true
      };

      const job = await OfflineBatchTranslationNode.processBatch(
        batchInputText,
        batchFormat,
        `batch_export_${batchFormat}.${batchFormat}`,
        config,
        glossaryRules
      );
      setBatchJob(job);
    } catch (err) {
      console.error('Batch translation failed:', err);
    } finally {
      setIsBatchProcessing(false);
    }
  };

  // ดาวน์โหลดไฟล์ผลลัพธ์ Batch
  const handleDownloadBatchExport = () => {
    if (!batchJob) return;
    const blob = OfflineBatchTranslationNode.exportBatchResult(batchJob);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translated_${batchJob.targetLangId}_${batchJob.fileName}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // เพิ่มกฎ Glossary ใหม่
  const handleAddGlossaryRule = () => {
    if (!newSourceTerm.trim() || !newTargetTerm.trim()) return;
    const newRule: OfflineGlossaryRule = {
      id: `rule_${Date.now()}`,
      sourceTerm: newSourceTerm.trim(),
      targetTerm: newTargetTerm.trim(),
      sourceLang: '',
      targetLang: '',
      caseSensitive: false,
      domain: 'general'
    };
    setGlossaryRules([...glossaryRules, newRule]);
    setNewSourceTerm('');
    setNewTargetTerm('');
  };

  // ลบกฎ Glossary
  const handleDeleteGlossaryRule = (id: string) => {
    setGlossaryRules(glossaryRules.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0d1117] text-[#e6edf3] font-sans select-none overflow-hidden">
      {/* 1. Top Header Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#161b22] border-b border-[#30363d] shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40">
            <Languages size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                GLOBAL 70++ OFFLINE AI TRANSLATION STUDIO
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#238636]/30 text-[#3fb950] border border-[#238636] rounded-full">
                75 TOP GLOBAL LANGUAGES
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#1f6feb]/30 text-[#58a6ff] border border-[#1f6feb] rounded-full">
                100% OFFLINE / ZERO CLOUD
              </span>
            </div>
            <p className="text-xs text-[#8b949e]">
              ระบบ AI แปลภาษาออฟไลน์โดยเฉพาะ ครอบคลุม 75+ ภาษาที่คนใช้งานมากที่สุดในโลก (รวมภาษาไทย) ทำงานบนแล็ปท็อปโดยไม่ต้องต่อเน็ต
            </p>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex items-center space-x-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'console'
                ? 'bg-[#1f6feb] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Sparkles size={14} />
            <span>ห้องแปลภาษาเรียลไทม์</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'audit'
                ? 'bg-[#238636] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <ShieldCheck size={14} className={auditReport && auditReport.overallHealthScore >= 90 ? 'text-[#3fb950]' : 'text-[#d29922]'} />
            <span>ศูนย์ตรวจการแปล 8 มิติ</span>
            {auditReport && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded bg-black/40 text-white">
                {auditReport.overallHealthScore}% ({auditReport.grade})
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'verify'
                ? 'bg-[#0969da] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <CheckCircle2 size={14} className="text-[#38bdf8]" />
            <span>ตรวจยืนยันบริบท (Verification Dashboard)</span>
          </button>
          <button
            onClick={() => setActiveTab('phonetics')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'phonetics'
                ? 'bg-[#8957e5] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Waves size={14} className="text-[#a371f7]" />
            <span>สัทศาสตร์ & การออกเสียง 70++ ภาษา</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'catalog'
                ? 'bg-[#1f6feb] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Globe size={14} />
            <span>คลัง 75+ ภาษา</span>
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'batch'
                ? 'bg-[#1f6feb] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <FileText size={14} />
            <span>แปลกลุ่มเอกสาร</span>
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'glossary'
                ? 'bg-[#1f6feb] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Lock size={14} />
            <span>ล็อกคำศัพท์ ({glossaryRules.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================================================================= */}
        {/* TAB 1: ห้องแปลภาษาเรียลไทม์ (Interactive Translation Console)       */}
        {/* ================================================================= */}
        {activeTab === 'console' && (
          <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto p-6 space-y-6">
            {/* Language Selection & Mode Bar */}
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                {/* Source Language Picker */}
                <div>
                  <label className="text-[11px] text-[#8b949e] block mb-1">ภาษาต้นทาง (Source)</label>
                  <select
                    value={sourceLangId}
                    onChange={(e) => setSourceLangId(e.target.value)}
                    className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#1f6feb]"
                  >
                    <option value="auto">✨ ตรวจจับภาษาอัตโนมัติ (Auto Detect)</option>
                    {GLOBAL_70_LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.nameThai} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <button
                  onClick={handleSwapLanguages}
                  title="สลับภาษาต้นทางและเป้าหมาย"
                  className="mt-4 p-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] transition-all"
                >
                  <ArrowRightLeft size={16} />
                </button>

                {/* Target Language Picker */}
                <div>
                  <label className="text-[11px] text-[#8b949e] block mb-1">ภาษาเป้าหมาย (Target)</label>
                  <select
                    value={targetLangId}
                    onChange={(e) => setTargetLangId(e.target.value)}
                    className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#1f6feb]"
                  >
                    {GLOBAL_70_LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.nameThai} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Register / Politeness */}
                <div>
                  <label className="text-[11px] text-[#8b949e] block mb-1">ระดับความสุภาพ (Register)</label>
                  <select
                    value={register}
                    onChange={(e) => setRegister(e.target.value as any)}
                    className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-[#58a6ff] font-semibold focus:outline-none focus:border-[#1f6feb]"
                  >
                    <option value="neutral">Neutral (มาตรฐานทั่วไป)</option>
                    <option value="formal">Formal (ทางการ / สุภาพ)</option>
                    <option value="casual">Casual (กันเอง / สนทนา)</option>
                    <option value="literary">Literary (วรรณกรรม / บรรยาย)</option>
                    <option value="technical">Technical (เทคนิค / ไอที)</option>
                  </select>
                </div>

                {/* Domain */}
                <div>
                  <label className="text-[11px] text-[#8b949e] block mb-1">บริบท (Domain)</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as any)}
                    className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-[#d2a8ff] focus:outline-none focus:border-[#1f6feb]"
                  >
                    <option value="general">ทั่วไป (General)</option>
                    <option value="gaming">เกมและเนื้อเรื่อง (Gaming & Lore)</option>
                    <option value="software_ui">ส่วนต่อประสาน (Software UI)</option>
                    <option value="dialogue">บทสนทนาตัวละคร (Dialogue)</option>
                    <option value="business">ธุรกิจ (Business)</option>
                    <option value="travel">การท่องเที่ยว (Travel)</option>
                  </select>
                </div>
              </div>

              {/* Quick Action Button */}
              <div className="flex items-center space-x-2 mt-4">
                <button
                  onClick={handlePerformTranslation}
                  disabled={isTranslating}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded-lg shadow transition-all disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isTranslating ? 'animate-spin' : ''} />
                  <span>แปลภาษาทันที</span>
                </button>
              </div>
            </div>

            {/* Translation Workspace Dual Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Panel: Source Text */}
              <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      ภาษาต้นทาง:
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/30">
                      {effectiveSourceProfile.nameThai} ({effectiveSourceProfile.nativeName})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-[#8b949e]">
                    <span>{sourceText.length} ตัวอักษร</span>
                    <button
                      onClick={() => handleSpeakText(sourceText, effectiveSourceProfile.iso639_1)}
                      title="ฟังเสียงอ่านต้นทาง"
                      className="p-1 text-[#8b949e] hover:text-white"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                </div>

                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  dir={effectiveSourceProfile.direction}
                  rows={6}
                  placeholder="พิมพ์ข้อความที่ต้องการแปลที่นี่..."
                  className="w-full flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#1f6feb] leading-relaxed resize-none"
                />

                {/* Quick Phrases */}
                <div className="pt-2 border-t border-[#30363d]/60 flex items-center justify-between">
                  <span className="text-[11px] text-[#8b949e]">ตัวอย่างข้อความประจำภาษา:</span>
                  <button
                    onClick={() => setSourceText(effectiveSourceProfile.sampleSentence)}
                    className="text-[11px] text-[#58a6ff] hover:underline truncate max-w-xs"
                  >
                    "{effectiveSourceProfile.sampleSentence}"
                  </button>
                </div>
              </div>

              {/* Right Panel: Translated Output */}
              <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      ภาษาเป้าหมาย:
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/30">
                      {targetProfile.nameThai} ({targetProfile.nativeName})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* เปล่งเสียงด้วย Acoustic Formant Synthesizer 100% ออฟไลน์ */}
                    {isAcousticPlaying ? (
                      <button
                        onClick={handleStopAcoustic}
                        title="หยุดเสียงอะคูสติกส์"
                        className="flex items-center space-x-1 px-2 py-1 bg-[#da3633] hover:bg-[#f85149] text-white text-xs font-bold rounded transition-all"
                      >
                        <Square size={11} />
                        <span>หยุด</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePlayAcousticFormants()}
                        title="เปล่งเสียงอ่านด้วย Acoustic Formant Synthesizer ออฟไลน์ 100%"
                        className="flex items-center space-x-1 px-2 py-1 bg-[#8957e5]/20 hover:bg-[#8957e5]/40 text-[#a371f7] rounded border border-[#8957e5]/40 text-xs transition-all"
                      >
                        <Waves size={12} />
                        <span>🔊 อะคูสติกส์</span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleSpeakText(
                          translationResult?.translatedText || '',
                          targetProfile.iso639_1
                        )
                      }
                      title="ฟังเสียงอ่านระบบ (Web Speech Native)"
                      className="p-1 text-[#8b949e] hover:text-white"
                    >
                      <Volume2 size={15} />
                    </button>
                    <button
                      onClick={handleCopyTranslation}
                      title="คัดลอกข้อความแปล"
                      className="flex items-center space-x-1 px-2 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded border border-[#30363d] text-xs transition-all"
                    >
                      {copied ? <Check size={12} className="text-[#3fb950]" /> : <Copy size={12} />}
                      <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                    </button>
                  </div>
                </div>

                <div
                  dir={targetProfile.direction}
                  className="w-full flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-base text-[#38bdf8] font-medium leading-relaxed overflow-y-auto min-h-[148px]"
                >
                  {translationResult?.translatedText || (
                    <span className="text-xs text-[#8b949e]/60">ผลการแปลจะแสดงที่นี่...</span>
                  )}
                </div>

                {/* Phonetics IPA & Tone Bar */}
                {phoneticProfile && (
                  <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#8b949e] text-[11px]">IPA:</span>
                      <span className="font-mono text-[#a371f7] font-semibold">{phoneticProfile.overallIpa}</span>
                      {phoneticProfile.romanizedGuide && (
                        <span className="text-[#8b949e] font-mono">({phoneticProfile.romanizedGuide})</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setPhoneticSelectedLangId(targetLangId);
                        setPhoneticCustomText(translationResult?.translatedText || '');
                        setActiveTab('phonetics');
                      }}
                      className="text-[11px] text-[#58a6ff] hover:underline flex items-center space-x-1 font-medium"
                    >
                      <span>ตรวจสัทศาสตร์และรูปปาก</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-[#30363d]/60 flex items-center justify-between text-xs text-[#8b949e]">
                  <span>ความเร็วประมวลผล: <b className="text-white font-mono">{translationResult?.processingTimeMs || 0} ms</b></span>
                  <span>ทิศทางการเขียน: <b className="text-[#58a6ff] uppercase">{targetProfile.direction}</b></span>
                </div>
              </div>
            </div>

            {/* Quality Evaluation & 8-Dimensional Audit Card */}
            {translationResult && (
              <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck size={18} className="text-[#3fb950]" />
                    <span className="text-sm font-bold text-white">
                      รายงานการตรวจสอบคุณภาพและความถูกต้องของความหมาย (Quality & Semantic Audit)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {auditReport && (
                      <button
                        onClick={() => setActiveTab('audit')}
                        className="flex items-center space-x-1.5 px-3 py-1 bg-[#238636]/20 hover:bg-[#238636]/40 text-[#3fb950] border border-[#238636]/40 rounded-lg text-xs font-bold transition-all"
                      >
                        <ShieldCheck size={13} />
                        <span>ศูนย์ตรวจ 8 มิติ ({auditReport.overallHealthScore}% - เกรด {auditReport.grade})</span>
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab('verify')}
                      className="flex items-center space-x-1.5 px-3 py-1 bg-[#1f6feb]/20 hover:bg-[#1f6feb]/40 text-[#58a6ff] border border-[#1f6feb]/40 rounded-lg text-xs font-bold transition-all"
                      title="เปิดแดชบอร์ดตรวจสอบความถูกต้องเทียบกับบริบทเกมและ UI"
                    >
                      <CheckCircle2 size={13} />
                      <span>ตรวจยืนยันบริบท (Localization Verification)</span>
                    </button>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs text-[#8b949e]">ความถูกต้องเชิงความหมาย:</span>
                      <span className="text-sm font-bold text-[#3fb950] font-mono">
                        {translationResult.metrics.semanticFidelityScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
                    <span className="text-[11px] text-[#8b949e]">BLEU Score Estimate</span>
                    <div className="text-base font-bold text-[#38bdf8] font-mono">
                      {translationResult.metrics.bleuScoreEstimate} / 100
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
                    <span className="text-[11px] text-[#8b949e]">chrF N-gram Score</span>
                    <div className="text-base font-bold text-[#3fb950] font-mono">
                      {translationResult.metrics.chrFScoreEstimate} / 100
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
                    <span className="text-[11px] text-[#8b949e]">Length Expansion Ratio</span>
                    <div className="text-base font-bold text-[#d2a8ff] font-mono">
                      {translationResult.metrics.lengthRatio}x
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
                    <span className="text-[11px] text-[#8b949e]">ความเสี่ยง Hallucination</span>
                    <div className={`text-base font-bold uppercase font-mono ${
                      translationResult.metrics.hallucinationRisk === 'low'
                        ? 'text-[#3fb950]'
                        : translationResult.metrics.hallucinationRisk === 'medium'
                        ? 'text-[#e3b341]'
                        : 'text-[#f85149]'
                    }`}>
                      {translationResult.metrics.hallucinationRisk}
                    </div>
                  </div>
                </div>

                {/* Back-Translation Verification */}
                <div className="p-3.5 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#8b949e]">
                    <span className="flex items-center space-x-1.5">
                      <ArrowRightLeft size={13} className="text-[#58a6ff]" />
                      <span className="font-semibold text-[#c9d1d9]">
                        การแปลย้อนกลับเพื่อยืนยันความหมาย (Bidirectional Back-Translation):
                      </span>
                    </span>
                    <span className="text-[#3fb950] font-mono">
                      Confidence: {(translationResult.metrics.confidenceScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-[#c9d1d9] italic">
                    "{translationResult.backTranslatedText}"
                  </p>
                </div>

                {/* Applied Glossary Terms */}
                {translationResult.appliedGlossaryTerms.length > 0 && (
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-[#8b949e]">คำศัพท์เฉพาะที่ล็อกไว้ (Glossary Locked):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {translationResult.appliedGlossaryTerms.map((term, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-[#8957e5]/20 text-[#d2a8ff] border border-[#8957e5]/40"
                        >
                          🔒 {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: ศูนย์ตรวจการแปลภาษา AI ออฟไลน์ 8 มิติ (8-Dimensional Audit)     */}
        {/* ================================================================= */}
        {activeTab === 'audit' && (
          <GlobalOfflineAITranslationAuditorView
            auditReport={auditReport}
            sourceText={sourceText}
            translatedText={translationResult?.translatedText || ''}
            sourceLang={effectiveSourceProfile}
            targetLang={targetProfile}
            onApplyFix={handleApplyAutoCorrectSuggestion}
            onSwitchToTranslate={() => setActiveTab('console')}
          />
        )}

        {/* ================================================================= */}
        {/* TAB: แดชบอร์ดตรวจสอบและยืนยันการโลคัลไลซ์ตามบริบท (Localization Verification) */}
        {/* ================================================================= */}
        {activeTab === 'verify' && (
          <LocalizationVerificationDashboard
            sourceText={sourceText}
            translatedText={translationResult?.translatedText || ''}
            sourceLang={effectiveSourceProfile}
            targetLang={targetProfile}
            glossaryRules={glossaryRules}
            onApplyFix={handleApplyAutoCorrectSuggestion}
            onSwitchToConsole={() => setActiveTab('console')}
          />
        )}

        {/* ================================================================= */}
        {/* TAB: สัทศาสตร์และการออกเสียง 70++ ภาษา (Phonetics & Speech Lab)    */}
        {/* ================================================================= */}
        {activeTab === 'phonetics' && (
          <Global70PhoneticPronunciationStudioView
            initialLangId={phoneticSelectedLangId}
            initialText={phoneticCustomText || translationResult?.translatedText || targetProfile.sampleSentence}
          />
        )}

        {/* ================================================================= */}
        {/* TAB 2: คลังข้อมูล 75+ ภาษาทั่วโลก (75+ Global Languages Catalog)   */}
        {/* ================================================================= */}
        {activeTab === 'catalog' && (
          <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto p-6 space-y-6">
            {/* Catalog Filter Header */}
            <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center space-x-2">
                    <Globe size={18} className="text-[#58a6ff]" />
                    <span>สารบบ 75+ ภาษาที่คนใช้งานมากที่สุดในโลก</span>
                  </h2>
                  <p className="text-xs text-[#8b949e]">
                    สำรวจข้อมูลภาษา อักขรวิธี ตระกูลภาษา ประชากรผู้พูด และประโยคตัวอย่าง
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-2.5 text-[#8b949e]" />
                    <input
                      type="text"
                      placeholder="ค้นหาชื่อภาษา, ประเทศ, รหัส..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="bg-[#0d1117] border border-[#30363d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-[#1f6feb] w-64"
                    />
                  </div>

                  {/* Family Filter */}
                  <select
                    value={selectedFamilyFilter}
                    onChange={(e) => setSelectedFamilyFilter(e.target.value)}
                    className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-[#58a6ff] focus:outline-none focus:border-[#1f6feb]"
                  >
                    <option value="all">ทุกตระกูลภาษา (All Families)</option>
                    <option value="Indo-European">Indo-European (อินโด-ยูโรเปียน)</option>
                    <option value="Sino-Tibetan">Sino-Tibetan (จีน-ทิเบต)</option>
                    <option value="Kra-Dai">Kra-Dai (ขร้า-ไท)</option>
                    <option value="Austronesian">Austronesian (ออสโตรนีเซียน)</option>
                    <option value="Afroasiatic">Afroasiatic (แอฟโฟรเอเชียติก)</option>
                    <option value="Dravidian">Dravidian (ดราวิเดียน)</option>
                    <option value="Turkic">Turkic (เตอร์กิก)</option>
                    <option value="Niger-Congo">Niger-Congo (ไนเจอร์-คองโก)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Languages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCatalog.map((lang) => (
                <div
                  key={lang.id}
                  className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#1f6feb]/60 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{lang.nameThai}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/30">
                          {lang.iso639_1}
                        </span>
                      </div>
                      <span className="text-xs text-[#8b949e] font-mono">{lang.nativeName}</span>
                    </div>

                    <div className="text-xs text-[#8b949e] space-y-1">
                      <p>ตระกูลภาษา: <b className="text-[#c9d1d9]">{lang.family}</b></p>
                      <p>อักขรวิธี: <b className="text-[#c9d1d9]">{lang.script}</b> | ทิศทาง: <b className="text-[#58a6ff] uppercase">{lang.direction}</b></p>
                      <p>ผู้พูดโดยประมาณ: <b className="text-[#3fb950] font-mono">{lang.speakersCountMillion} ล้านคน</b></p>
                      <p className="truncate">ภูมิภาค: {lang.regionOfOrigin}</p>
                    </div>

                    <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] space-y-1 text-xs">
                      <div className="text-[#8b949e] text-[10px] uppercase">ประโยคตัวอย่าง:</div>
                      <div dir={lang.direction} className="text-white font-medium">
                        "{lang.sampleSentence}"
                      </div>
                      <div className="text-[#38bdf8] text-[11px]">
                        ไทย: {lang.sampleTranslationTh}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#30363d]/60 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setTargetLangId(lang.id);
                        setActiveTab('console');
                      }}
                      className="text-xs text-[#58a6ff] hover:underline flex items-center space-x-1"
                    >
                      <Play size={12} />
                      <span>แปลเป็นภาษานี้</span>
                    </button>
                    <button
                      onClick={() => handleSpeakText(lang.sampleSentence, lang.iso639_1)}
                      className="text-xs text-[#8b949e] hover:text-white flex items-center space-x-1"
                    >
                      <Volume2 size={13} />
                      <span>ฟังเสียง</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: แปลเอกสารและไฟล์กลุ่มแบบออฟไลน์ (Batch Translation Lab)      */}
        {/* ================================================================= */}
        {activeTab === 'batch' && (
          <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto p-6 space-y-6">
            {/* Batch Header & Configuration */}
            <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center space-x-2">
                    <FileText size={18} className="text-[#3fb950]" />
                    <span>ระบบแปลไฟล์เอกสารและไฟล์กลุ่มแบบออฟไลน์ (Batch File Translator)</span>
                  </h2>
                  <p className="text-xs text-[#8b949e]">
                    แปลไฟล์เกมและซอฟต์แวร์ เช่น JSON Key-Value, ซับไตเติล SubRip (.srt), ตาราง CSV หรือ Markdown
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Format Selector */}
                  <div>
                    <label className="text-[11px] text-[#8b949e] block mb-1">รูปแบบไฟล์ (Format)</label>
                    <select
                      value={batchFormat}
                      onChange={(e) => setBatchFormat(e.target.value as any)}
                      className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-[#58a6ff] font-semibold focus:outline-none focus:border-[#1f6feb]"
                    >
                      <option value="json">JSON Localization Key-Value</option>
                      <option value="srt">SubRip Subtitle (.srt)</option>
                      <option value="csv">CSV Translation Table</option>
                      <option value="txt">Plain Text / Markdown</option>
                    </select>
                  </div>

                  {/* Target Language */}
                  <div>
                    <label className="text-[11px] text-[#8b949e] block mb-1">ภาษาเป้าหมาย</label>
                    <select
                      value={targetLangId}
                      onChange={(e) => setTargetLangId(e.target.value)}
                      className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#1f6feb]"
                    >
                      {GLOBAL_70_LANGUAGES.map((l) => (
                        <option key={l.id} value={l.id}>{l.nameThai}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleRunBatchTranslation}
                    disabled={isBatchProcessing}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded-lg shadow transition-all mt-4 disabled:opacity-50"
                  >
                    <Play size={14} />
                    <span>เริ่มการแปลเอกสาร</span>
                  </button>
                </div>
              </div>

              {/* Input Textarea for Content */}
              <div>
                <label className="text-xs text-[#8b949e] block mb-1">
                  วางเนื้อหาไฟล์ต้นทาง หรือข้อความที่ต้องการแปล ({batchFormat.toUpperCase()}):
                </label>
                <textarea
                  value={batchInputText}
                  onChange={(e) => setBatchInputText(e.target.value)}
                  rows={5}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 font-mono text-xs text-[#c9d1d9] focus:outline-none focus:border-[#1f6feb]"
                />
              </div>
            </div>

            {/* Batch Translation Job Results */}
            {batchJob && (
              <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-white">
                      ผลการประมวลผลไฟล์: {batchJob.fileName}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 font-mono">
                      แปลสำเร็จ {batchJob.completedItems} / {batchJob.totalItems} รายการ
                    </span>
                  </div>

                  <button
                    onClick={handleDownloadBatchExport}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white text-xs font-bold rounded-lg shadow transition-all"
                  >
                    <Download size={14} />
                    <span>ดาวน์โหลดไฟล์ผลลัพธ์ ({batchJob.format.toUpperCase()})</span>
                  </button>
                </div>

                {/* Items Preview Table */}
                <div className="border border-[#30363d] rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0d1117] border-b border-[#30363d] text-[#8b949e]">
                      <tr>
                        <th className="p-3 w-28">Key / Line</th>
                        <th className="p-3">ข้อความต้นฉบับ</th>
                        <th className="p-3">ข้อความแปล ({targetProfile.nameThai})</th>
                        <th className="p-3 w-28 text-right">BLEU Est.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#30363d]">
                      {batchJob.items.map((item) => (
                        <tr key={item.id} className="hover:bg-[#21262d]/40">
                          <td className="p-3 font-mono text-[#8b949e]">{item.key || item.id}</td>
                          <td className="p-3 text-[#c9d1d9]">{item.sourceText}</td>
                          <td className="p-3 text-[#38bdf8] font-medium">{item.translatedText}</td>
                          <td className="p-3 text-right font-mono text-[#3fb950]">
                            {item.metrics?.bleuScoreEstimate || 90}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: คลังศัพท์เฉพาะและกฎล็อกคำ (Glossary & Terminology Lock)      */}
        {/* ================================================================= */}
        {activeTab === 'glossary' && (
          <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto p-6 space-y-6">
            {/* Glossary Description */}
            <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center space-x-2">
                    <Lock size={18} className="text-[#d2a8ff]" />
                    <span>ระบบล็อกคำศัพท์เฉพาะและป้องกันการแปลเพี้ยน (Terminology Lock Engine)</span>
                  </h2>
                  <p className="text-xs text-[#8b949e]">
                    กำหนดคำเฉพาะ (ชื่อเกม, ชื่อตัวละคร, สกิล, แบรนด์, ไอเทม) ที่ห้ามแปล หรือกำหนดคำแปลที่ตายตัว
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-xs text-[#c9d1d9] flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preserveGlossary}
                      onChange={(e) => setPreserveGlossary(e.target.checked)}
                      className="accent-[#1f6feb]"
                    />
                    <span>เปิดใช้งานกฎล็อกศัพท์ (Enforce Glossary)</span>
                  </label>
                </div>
              </div>

              {/* Add New Glossary Rule Form */}
              <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="คำต้นทาง เช่น NexusEngine, Excalibur"
                  value={newSourceTerm}
                  onChange={(e) => setNewSourceTerm(e.target.value)}
                  className="bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-[#1f6feb] flex-1"
                />
                <input
                  type="text"
                  placeholder="คำที่ต้องการให้คงไว้ หรือคำแปลเจาะจง"
                  value={newTargetTerm}
                  onChange={(e) => setNewTargetTerm(e.target.value)}
                  className="bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-[#1f6feb] flex-1"
                />
                <button
                  onClick={handleAddGlossaryRule}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded-lg transition-all"
                >
                  <Plus size={14} />
                  <span>เพิ่มคำศัพท์</span>
                </button>
              </div>
            </div>

            {/* Glossary Table */}
            <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                รายการคำศัพท์ที่ถูกคุ้มครอง ({glossaryRules.length} รายการ)
              </span>

              <div className="border border-[#30363d] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0d1117] border-b border-[#30363d] text-[#8b949e]">
                    <tr>
                      <th className="p-3">คำศัพท์ต้นทาง (Source Term)</th>
                      <th className="p-3">คำแปลที่บังคับใช้ (Locked Term)</th>
                      <th className="p-3">หมวดหมู่</th>
                      <th className="p-3 w-20 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363d]">
                    {glossaryRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-[#21262d]/40">
                        <td className="p-3 font-semibold text-white">🔒 {rule.sourceTerm}</td>
                        <td className="p-3 text-[#38bdf8] font-semibold">{rule.targetTerm}</td>
                        <td className="p-3 text-[#8b949e]">{rule.domain}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteGlossaryRule(rule.id)}
                            className="p-1 text-[#f85149] hover:bg-[#da3633]/20 rounded transition-all"
                            title="ลบคำศัพท์"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalOfflineAITranslationStudio;
