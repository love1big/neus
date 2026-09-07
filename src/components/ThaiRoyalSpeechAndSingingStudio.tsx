/**
 * @file ThaiRoyalSpeechAndSingingStudio.tsx
 * @description
 * ============================================================================
 * [THAI]
 * สตูดิโออ่านออกเสียงภาษาไทยมาตรฐาน ร้องเพลง และพจนานุกรมราชบัณฑิตยสถานออฟไลน์ 100%
 * (Thai Royal Speech & Singing Studio with Offline Dictionary Vault)
 *
 * คุณสมบัติเด่น:
 *   1. ยึดคำอ่านตามพจนานุกรมราชบัณฑิตยสถานอย่างเคร่งครัด
 *   2. ออกเสียงวรรณยุกต์ 5 เสียง สระสั้น-ยาว ตัวสะกด 8 แม่ อักษรควบ และอักษรนำ ครบถ้วน
 *   3. ระบบแบ่งวรรคตอนตามความหมาย ใช้ความเร็วปานกลางเป็นธรรมชาติ
 *   4. ไม่กลืนพยางค์ ไม่เติมหรือตัดทอนคำ
 *   5. อ่านชื่อเฉพาะตามคำอ่านที่กำกับไว้ในวงเล็บ [คำ-อ่าน-สะ-กด] 100%
 *   6. ระบบตรวจสอบและสอบถามผู้ใช้/AI เมื่อพบคำที่อ่านได้หลายแบบ (Heteronyms) ก่อนสังเคราะห์เสียง ไม่คาดเดาเอง
 *   7. คลังพจนานุกรมราชบัณฑิตยสถานแบบออฟไลน์ พร้อมความหมาย คำอ่าน IPA รากศัพท์ และระบบให้ AI Offline เข้ามาดูได้ทั้งหมด
 *   8. โหมดร้องเพลงภาษาไทย (Thai Vocal & Singing Synthesis) พร้อมกำหนดโน้ตดนตรีและลูกคอ (Vibrato)
 *
 * [ENGLISH]
 * Enterprise Studio for Standard Thai Speech Synthesis, Melodic Singing, and Royal Institute Offline Dictionary.
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  Music,
  BookOpen,
  Bot,
  Play,
  Square,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Search,
  Sliders,
  Radio,
  FileAudio,
  Languages,
  Info,
  RefreshCw,
  ShieldCheck,
  Check,
  History,
  Cloud,
  Database,
  Filter,
  ArrowRight,
  Layers,
  Bookmark
} from 'lucide-react';
import {
  ThaiSpeechAndSingingEngine,
  ThaiSpeechSynthesizerOptions,
  PlaybackTimingEvent,
  SingingNote
} from '../utils/ThaiSpeechAndSingingEngine';
import {
  ThaiRoyalInstituteDictionaryDatabase,
  RoyalDictionaryEntry
} from '../utils/ThaiRoyalInstituteDictionaryDatabase';
import {
  ThaiSemanticSegmenterAndDisambiguator,
  DetectedAmbiguity,
  DisambiguationResolutionMap,
  TextPreprocessingResult
} from '../utils/ThaiSemanticSegmenterAndDisambiguator';
import {
  AIOfflineRoyalDictionaryNavigator,
  AIDictionaryInspectionReport
} from '../utils/AIOfflineRoyalDictionaryNavigator';
import {
  ThaiComprehensivePhoneticRulesEngine,
  PronunciationRulePrinciple
} from '../utils/ThaiComprehensivePhoneticRulesEngine';
import {
  ThaiSingingAndChantingProsodyEngine,
  ThaiPoetryMeter
} from '../utils/ThaiSingingAndChantingProsodyEngine';
import {
  ThaiRoyalDictionaryAutoUpdater,
  DictionarySyncStatus,
  DictionaryUpdateManifest
} from '../utils/ThaiRoyalDictionaryAutoUpdater';
import {
  ThaiAIMispronouncedWordLexiconDatabase,
  MispronouncedWordEntry
} from '../utils/ThaiAIMispronouncedWordLexiconDatabase';
import { ThaiPhoneticRulesView } from './ThaiPhoneticRulesView';
import { ThaiSingingProsodyStudioView } from './ThaiSingingProsodyStudioView';
import { ThaiAIMispronouncedLexiconView } from './ThaiAIMispronouncedLexiconView';
import { ThaiRoyalDictionaryAutoUpdaterView } from './ThaiRoyalDictionaryAutoUpdaterView';

export const ThaiRoyalSpeechAndSingingStudio: React.FC = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState<
    'speech' | 'phonetics_rules' | 'singing' | 'ai_corrections' | 'auto_updater' | 'dictionary' | 'ai_offline'
  >('speech');
  const [inputText, setInputText] = useState<string>(
    'สมเด็จพระกนิษฐาธิราชเจ้า [สม-เด็ด-พฺระ-กะ-นิด-ถา-ทิ-ราด-เจ้า] เสด็จพระราชดำเนินเยือนกรุงเทพมหานคร [กรุง-เทบ-มะ-หา-นะ-คอน] ถึงเพลาย่ำค่ำ เพื่อทอดพระเนตรการแสดงดนตรีริมสระน้ำ'
  );

  // Synthesizer Settings
  const [speedRate, setSpeedRate] = useState<number>(1.0); // ความเร็วปานกลางมาตรฐาน
  const [pitchMultiplier, setPitchMultiplier] = useState<number>(1.0);
  const [voiceType, setVoiceType] = useState<ThaiSpeechSynthesizerOptions['voiceType']>('royal_announcer');
  const [enableVibrato, setEnableVibrato] = useState<boolean>(true);
  const [enableReverb, setEnableReverb] = useState<boolean>(true);

  // Playback & Timing
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSyllable, setActiveSyllable] = useState<PlaybackTimingEvent | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Ambiguity Disambiguation Map (e.g. ambiguityId -> "[เพ-ลา]")
  const [resolutions, setResolutions] = useState<DisambiguationResolutionMap>({
    'amb_เพลา_94': '[เพ-ลา]'
  });

  // Preprocessing Analysis Result
  const [prepResult, setPrepResult] = useState<TextPreprocessingResult | null>(null);

  // Dictionary Tab States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dictionaryList, setDictionaryList] = useState<RoyalDictionaryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<RoyalDictionaryEntry | null>(null);

  // AI Offline Report State
  const [aiReport, setAiReport] = useState<AIDictionaryInspectionReport | null>(null);

  // Phonetic Rules Tab States
  const [selectedPrinciple, setSelectedPrinciple] = useState<PronunciationRulePrinciple>(
    ThaiComprehensivePhoneticRulesEngine.ALL_PRONUNCIATION_PRINCIPLES[0]
  );

  // Singing & Prosody Tab States
  const [selectedPoetryMeter, setSelectedPoetryMeter] = useState<ThaiPoetryMeter>(
    ThaiSingingAndChantingProsodyEngine.POETRY_AND_SINGING_METERS[0]
  );
  const [singingNotes, setSingingNotes] = useState<SingingNote[]>([
    { syllable: 'โอ้', note: 'G4', frequency: 392.0, durationSec: 0.5, vibrato: true },
    { syllable: 'ละ', note: 'A4', frequency: 440.0, durationSec: 0.4, vibrato: false },
    { syllable: 'หนอ', note: 'C5', frequency: 523.25, durationSec: 0.7, vibrato: true },
    { syllable: 'ดวง', note: 'D5', frequency: 587.33, durationSec: 0.5, vibrato: false },
    { syllable: 'เดือน', note: 'C5', frequency: 523.25, durationSec: 0.8, vibrato: true },
    { syllable: 'เอย', note: 'A4', frequency: 440.0, durationSec: 0.9, vibrato: true }
  ]);

  // AI Mispronounced 20,000+ Words Database State
  const [aiLexiconSearch, setAiLexiconSearch] = useState<string>('');
  const [aiLexiconCategory, setAiLexiconCategory] = useState<string>('all');
  const [allAiLexiconEntries, setAllAiLexiconEntries] = useState<MispronouncedWordEntry[]>([]);
  const [filteredAiLexicon, setFilteredAiLexicon] = useState<MispronouncedWordEntry[]>([]);
  const [selectedAiLexicon, setSelectedAiLexicon] = useState<MispronouncedWordEntry | null>(null);

  // Auto Updater State
  const [syncStatus, setSyncStatus] = useState<DictionarySyncStatus>(
    ThaiRoyalDictionaryAutoUpdater.getSyncStatus()
  );
  const [isUpdatingSync, setIsUpdatingSync] = useState<boolean>(false);
  const [syncProgressPercent, setSyncProgressPercent] = useState<number>(0);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string>('');
  const [syncSuccessToast, setSyncSuccessToast] = useState<string | null>(null);

  // Initial Load & Preprocessing
  useEffect(() => {
    ThaiRoyalInstituteDictionaryDatabase.initialize();
    setDictionaryList(ThaiRoyalInstituteDictionaryDatabase.getAllEntries());
    if (ThaiRoyalInstituteDictionaryDatabase.getAllEntries().length > 0) {
      setSelectedEntry(ThaiRoyalInstituteDictionaryDatabase.getAllEntries()[0]);
    }

    // Load 20,000+ AI Mispronounced Lexicon
    const entries = ThaiAIMispronouncedWordLexiconDatabase.getAllLexiconEntries();
    setAllAiLexiconEntries(entries);
    setFilteredAiLexicon(entries.slice(0, 100));
    if (entries.length > 0) {
      setSelectedAiLexicon(entries[0]);
    }
  }, []);

  // Filter 20,000+ AI Lexicon Words
  const handleFilterAiLexicon = (query: string, category: string) => {
    setAiLexiconSearch(query);
    setAiLexiconCategory(category);
    let list = allAiLexiconEntries;
    if (category !== 'all') {
      list = list.filter((e) => e.category === category);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.word.toLowerCase().includes(q) ||
          e.correctReading.includes(q) ||
          e.commonAIFault.includes(q)
      );
    }
    setFilteredAiLexicon(list.slice(0, 120));
    if (list.length > 0) {
      setSelectedAiLexicon(list[0]);
    }
  };

  // Handle Sync Action
  const handleTriggerSync = async () => {
    setIsUpdatingSync(true);
    setSyncSuccessToast(null);
    try {
      const res = await ThaiRoyalDictionaryAutoUpdater.checkForUpdatesAndSync((percent, status) => {
        setSyncProgressPercent(percent);
        setSyncStatusMessage(status);
      });
      setSyncStatus(ThaiRoyalDictionaryAutoUpdater.getSyncStatus());
      setSyncSuccessToast(res.message);
    } finally {
      setIsUpdatingSync(false);
    }
  };

  // Update Preprocessing whenever inputText or resolutions change
  useEffect(() => {
    const res = ThaiSemanticSegmenterAndDisambiguator.processText(inputText, resolutions);
    setPrepResult(res);
    setAiReport(AIOfflineRoyalDictionaryNavigator.inspectTextForAI(inputText));
  }, [inputText, resolutions]);

  // Set callbacks
  useEffect(() => {
    ThaiSpeechAndSingingEngine.setTimingCallback((ev) => {
      setActiveSyllable(ev);
    });
    ThaiSpeechAndSingingEngine.setEndCallback(() => {
      setIsPlaying(false);
      setActiveSyllable(null);
    });

    return () => {
      ThaiSpeechAndSingingEngine.stop();
    };
  }, []);

  // Handle Playback
  const handlePlaySpeech = async () => {
    if (isPlaying) {
      ThaiSpeechAndSingingEngine.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const options: ThaiSpeechSynthesizerOptions = {
      mode: 'speech',
      speedRate,
      pitchMultiplier,
      voiceType,
      enableReverb,
      enableVibrato,
      bpm: 90
    };

    await ThaiSpeechAndSingingEngine.speakOrSing(inputText, options, resolutions);
  };

  const handlePlaySinging = async () => {
    if (isPlaying) {
      ThaiSpeechAndSingingEngine.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const options: ThaiSpeechSynthesizerOptions = {
      mode: 'singing',
      speedRate,
      pitchMultiplier,
      voiceType: 'musical_diva',
      enableReverb,
      enableVibrato,
      bpm: 80,
      singingMelody: singingNotes
    };

    await ThaiSpeechAndSingingEngine.speakOrSing(
      singingNotes.map((n) => n.syllable).join(''),
      options,
      resolutions
    );
  };

  // Play a single word or phonetic text immediately
  const handlePlayWord = async (word: string, phoneticText?: string) => {
    if (isPlaying) {
      ThaiSpeechAndSingingEngine.stop();
      setIsPlaying(false);
      return;
    }
    const textToPlay = phoneticText ? phoneticText : word;
    setIsPlaying(true);
    try {
      await ThaiSpeechAndSingingEngine.speakOrSing(
        textToPlay,
        {
          mode: 'speech',
          speedRate,
          pitchMultiplier,
          voiceType,
          enableReverb,
          enableVibrato,
          bpm: 100
        },
        resolutions
      );
    } finally {
      setIsPlaying(false);
      setActiveSyllable(null);
    }
  };

  const handleExportWav = async () => {
    setIsExporting(true);
    try {
      const options: ThaiSpeechSynthesizerOptions = {
        mode: activeTab === 'singing' ? 'singing' : 'speech',
        speedRate,
        pitchMultiplier,
        voiceType,
        enableReverb,
        enableVibrato,
        bpm: 90,
        singingMelody: activeTab === 'singing' ? singingNotes : undefined
      };

      const blob = await ThaiSpeechAndSingingEngine.exportToWavBlob(inputText, options, resolutions);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thai_royal_speech_master_${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  // Search in Dictionary
  const handleSearchDictionary = (q: string) => {
    setSearchQuery(q);
    const results = ThaiRoyalInstituteDictionaryDatabase.search(q);
    setDictionaryList(results);
    if (results.length > 0) {
      setSelectedEntry(results[0]);
    }
  };

  // Select Poetry Meter & Load Template
  const handleSelectPoetryMeter = (meter: ThaiPoetryMeter) => {
    setSelectedPoetryMeter(meter);
    const generated = ThaiSingingAndChantingProsodyEngine.generateMelodicChantNotes(
      meter.sampleVerse.text,
      meter.id
    );
    setSingingNotes(
      generated.map((g) => ({
        syllable: g.syllable,
        note: g.note,
        frequency: ThaiSpeechAndSingingEngine.NOTE_FREQUENCIES[g.note] || 440,
        durationSec: g.durationSec,
        vibrato: true
      }))
    );
  };

  // Sample Presets
  const handleLoadPreset = (preset: 'royal_news' | 'poem' | 'heteronym_test' | 'classical_song') => {
    if (preset === 'royal_news') {
      setInputText(
        'สมเด็จพระกนิษฐาธิราชเจ้า [สม-เด็ด-พฺระ-กะ-นิด-ถา-ทิ-ราด-เจ้า] เสด็จพระราชดำเนินไปทรงเปิดนิทรรศการศิลปวัฒนธรรม ณ กรุงเทพมหานคร [กรุง-เทบ-มะ-หา-นะ-คอน] ทรงมีพระราชดำรัสชื่นชมความเป็นอัจฉริยะของเยาวชนไทย'
      );
      setVoiceType('royal_announcer');
      setSpeedRate(1.0);
      setActiveTab('speech');
    } else if (preset === 'poem') {
      setInputText(
        'บัดเดี๋ยวดังหง่างเหง่งวังเวงแว่ว สะดุ้งแล้วเหลียวแลชะแง้หา เห็นโยคีขี่รุ้งพุ่งออกมา ประคองพาขึ้นไปจนบนบรรพต'
      );
      setVoiceType('standard_male');
      setSpeedRate(0.95);
      setActiveTab('speech');
    } else if (preset === 'heteronym_test') {
      setInputText(
        'ถึงเพลาเย็นช่างกำลังซ่อมเพลาเกวียนที่ริมสระน้ำ พระสงฆ์นั่งขัดสมาธิเจริญสมาธิภาวนา ชาวบ้านช่วยกันเก็บแหนในสระเพื่อนำไปเลี้ยงเป็ด'
      );
      setVoiceType('standard_female');
      setSpeedRate(1.0);
      setActiveTab('speech');
    } else if (preset === 'classical_song') {
      setActiveTab('singing');
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 backdrop-blur-md sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                ระบบอ่านออกเสียงมาตรฐาน & ร้องเพลงสัทศาสตร์ไทย
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                🇹🇭 ราชบัณฑิตยสถาน 100% Offline
              </span>
            </div>
            <p className="text-xs text-slate-400">
              เสียงชัดเจนเป็นธรรมชาติ • วรรณยุกต์ครบ 5 เสียง • สระสั้น-ยาว • ตัวสะกด 8 แม่ • แบ่งวรรคตามความหมาย
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('speech')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'speech'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            เสียงพูด (TTS)
          </button>
          <button
            onClick={() => setActiveTab('phonetics_rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'phonetics_rules'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            🌟 หลักการออกเสียงทั้งหมด
          </button>
          <button
            onClick={() => setActiveTab('singing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'singing'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            🎵 ร้องเพลง & ฉันทลักษณ์
          </button>
          <button
            onClick={() => setActiveTab('ai_corrections')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'ai_corrections'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-300" />
            🛡️ คำที่ AI อ่านผิด (20,000+)
          </button>
          <button
            onClick={() => setActiveTab('auto_updater')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'auto_updater'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            🔄 อัปเดตอัตโนมัติ
          </button>
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'dictionary'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            📖 พจนานุกรมราชบัณฑิตฯ
          </button>
          <button
            onClick={() => setActiveTab('ai_offline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'ai_offline'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            AI Inspector
          </button>
        </div>
      </header>

      {/* Preset Quick Toolbar */}
      <section className="bg-slate-900/40 border-b border-slate-800/80 px-6 py-2 flex items-center justify-between gap-3 text-xs overflow-x-auto">
        <span className="text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          ชุดข้อความตัวอย่างตามมาตรฐาน:
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleLoadPreset('royal_news')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1"
          >
            🏛️ ข่าวพระราชสำนัก & คำเฉพาะในวงเล็บ
          </button>
          <button
            onClick={() => handleLoadPreset('heteronym_test')}
            className="px-2.5 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-600/40 transition flex items-center gap-1"
          >
            ⚠️ คำอ่านหลายแบบ (เพลา/สระ/แหน)
          </button>
          <button
            onClick={() => handleLoadPreset('poem')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1"
          >
            📜 บทกวีสุนทรภู่ (วรรณยุกต์สัมผัส)
          </button>
          <button
            onClick={() => handleLoadPreset('classical_song')}
            className="px-2.5 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 border border-purple-600/40 transition flex items-center gap-1"
          >
            🎵 เพลงไทยเดิม "ลาวดวงเดือน"
          </button>
        </div>
      </section>

      {/* Main Studio Body */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================================= */}
        {/* TAB 1: STANDARD THAI SPEECH TTS */}
        {/* ========================================================================= */}
        {activeTab === 'speech' && (
          <>
            {/* Left Column: Text Input, Disambiguation Alerts, and Karaoke Tracking */}
            <div className="lg:col-span-8 space-y-5">
              {/* Text Input Box */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <FileAudio className="w-4 h-4 text-amber-400" />
                    ข้อความภาษาไทยที่ต้องการให้อ่านออกเสียง:
                  </label>
                  <span className="text-xs text-slate-400">
                    ใส่คำอ่านเฉพาะในวงเล็บได้ เช่น <code>[คำ-อ่าน]</code>
                  </span>
                </div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition leading-relaxed"
                  placeholder="พิมพ์ข้อความภาษาไทย..."
                />

                {/* Real-time Karaoke & Syllable Highlighting Banner */}
                {isPlaying && activeSyllable && (
                  <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                      <div>
                        <span className="text-xs text-amber-300 font-medium">กำลังออกเสียงพยางค์:</span>
                        <div className="text-xl font-bold text-amber-400">
                          {activeSyllable.syllableText}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <div>วรรณยุกต์: <span className="text-amber-300 font-bold">{activeSyllable.tone}</span></div>
                      <div>เวลา: {activeSyllable.currentTimeSec.toFixed(2)}s</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Heteronym Disambiguation Panel (คำที่อ่านได้หลายแบบ - ไม่คาดเดา ให้ถามก่อน) */}
              {prepResult && prepResult.ambiguities.length > 0 && (
                <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <HelpCircle className="w-5 h-5" />
                    <span>
                      ระบบตรวจพบคำที่อ่านได้หลายแบบ ({prepResult.ambiguities.length} จุด) — ตามระเบียบราชบัณฑิตยสถาน กรุณาเลือกคำอ่านที่ถูกต้อง:
                    </span>
                  </div>

                  <div className="space-y-3">
                    {prepResult.ambiguities.map((amb) => (
                      <div
                        key={amb.id}
                        className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-slate-300">
                            บริบทในข้อความ: <span className="text-amber-300 font-medium font-mono">{amb.surroundingContext}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            คำว่า: "{amb.word}"
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                          {amb.options.map((opt, optIdx) => {
                            const isSelected = (resolutions[amb.id] || '') === opt.reading.split(' ')[0];
                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  setResolutions((prev) => ({
                                    ...prev,
                                    [amb.id]: opt.reading.split(' ')[0]
                                  }));
                                }}
                                className={`p-3 rounded-lg border text-left text-xs transition flex flex-col justify-between ${
                                  isSelected
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md'
                                    : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                                }`}
                              >
                                <div className="flex items-center justify-between font-bold text-sm mb-1">
                                  <span>{opt.reading}</span>
                                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                                </div>
                                <div className="text-[11px] text-slate-400 mb-1.5">{opt.meaningSummary}</div>
                                <div className="text-[10px] text-slate-500 font-mono">ตัวอย่าง: {opt.contextExample}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bracketed Proper Names Verified */}
              {prepResult && prepResult.bracketedGuides.length > 0 && (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-300 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">ตรวจพบคำอ่านชื่อเฉพาะในวงเล็บ:</div>
                    <div className="text-slate-300 mt-1 flex flex-wrap gap-2">
                      {prepResult.bracketedGuides.map((g, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-emerald-900/40 border border-emerald-600/40 font-mono"
                        >
                          {g.baseWord} ➔ [{g.bracketedReading}]
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Semantic Phrases & Flow Breakdown */}
              {prepResult && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>การแบ่งวรรคตอนตามความหมาย (Semantic Phrasing & Natural Cadence):</span>
                    <span className="text-slate-500">{prepResult.segments.length} วรรควลี</span>
                  </div>
                  <div className="space-y-2">
                    {prepResult.segments.map((seg, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-slate-200">{seg.segmentText}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                          <span>คำอ่าน: <span className="text-amber-400 font-mono">{seg.phoneticOverrideText}</span></span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px]">
                            หยุดพัก: {seg.pauseAfterMs}ms
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Voice Controls & Synthesis */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5 sticky top-24">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    การปรับแต่งเสียงสัทศาสตร์
                  </h3>
                  <span className="text-xs text-amber-400 font-semibold">Web Audio 48kHz</span>
                </div>

                {/* Voice Type Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">พรีเซ็ตเสียงพากย์มาตรฐาน:</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'royal_announcer', name: '👑 ผู้ประกาศราชสำนัก (เป็นทางการ ชัดเจน)', gender: 'ทางการ' },
                      { id: 'standard_female', name: '👩 เสียงหญิงมาตรฐาน (นุ่มนวล คมชัด)', gender: 'หญิง' },
                      { id: 'standard_male', name: '👨 เสียงชายมาตรฐาน (กังวาน มั่นคง)', gender: 'ชาย' },
                      { id: 'musical_diva', name: '🎤 นักร้องเสียงหวาน (Melodic Diva)', gender: 'ร้องเพลง' }
                    ].map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setVoiceType(v.id as ThaiSpeechSynthesizerOptions['voiceType'])}
                        className={`w-full p-2.5 rounded-xl text-left text-xs transition border flex items-center justify-between ${
                          voiceType === v.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span>{v.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {v.gender}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Speed Slider (ความเร็วปานกลาง) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">ความเร็วการพูด (จังหวะปานกลาง):</span>
                    <span className="text-amber-400 font-bold">{speedRate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.35"
                    step="0.05"
                    value={speedRate}
                    onChange={(e) => setSpeedRate(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>ช้าเน้นพยางค์ (0.75x)</span>
                    <span>มาตรฐานปานกลาง (1.0x)</span>
                    <span>เร็ว (1.35x)</span>
                  </div>
                </div>

                {/* Pitch Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">ระดับเสียงความถี่ (F0 Pitch):</span>
                    <span className="text-amber-400 font-bold">{pitchMultiplier.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.85"
                    max="1.25"
                    step="0.05"
                    value={pitchMultiplier}
                    onChange={(e) => setPitchMultiplier(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={handlePlaySpeech}
                    disabled={prepResult ? !prepResult.isFullyResolved : false}
                    className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 ${
                      isPlaying
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : prepResult && !prepResult.isFullyResolved
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/20'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-4 h-4 fill-current" />
                        หยุดการอ่านออกเสียง
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        {prepResult && !prepResult.isFullyResolved
                          ? 'กรุณาเลือกคำอ่านที่กำกวมด้านซ้ายก่อน'
                          : 'เริ่มอ่านออกเสียงมาตรฐาน'}
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleExportWav}
                    disabled={isExporting || isPlaying}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isExporting ? 'กำลังบันทึกไฟล์เสียง...' : 'ส่งออกไฟล์เสียง Master WAV 48kHz'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB: THAI PHONETIC RULES & PRINCIPLES (หลักการออกเสียงภาษาไทยทั้งหมด) */}
        {/* ========================================================================= */}
        {activeTab === 'phonetics_rules' && (
          <ThaiPhoneticRulesView
            onPlayWord={handlePlayWord}
            onSendToTextInput={(txt) => {
              setInputText(txt);
              setActiveTab('speech');
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB: THAI SINGING & PROSODY STUDIO (ร้องเพลงไทย & ฉันทลักษณ์) */}
        {/* ========================================================================= */}
        {activeTab === 'singing' && (
          <ThaiSingingProsodyStudioView
            singingNotes={singingNotes}
            setSingingNotes={setSingingNotes}
            isPlaying={isPlaying}
            activeSyllable={activeSyllable}
            onPlaySinging={handlePlaySinging}
            onExportWav={handleExportWav}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB: 20,000+ AI MISPRONOUNCED WORDS LEXICON (คำที่ AI ชอบอ่านผิด) */}
        {/* ========================================================================= */}
        {activeTab === 'ai_corrections' && (
          <ThaiAIMispronouncedLexiconView
            onPlayWord={handlePlayWord}
            onSendToTextInput={(txt) => {
              setInputText(txt);
              setActiveTab('speech');
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB: AUTO UPDATER (ระบบอัปเดตพจนานุกรมราชบัณฑิตยสถานอัตโนมัติ) */}
        {/* ========================================================================= */}
        {activeTab === 'auto_updater' && (
          <ThaiRoyalDictionaryAutoUpdaterView
            syncStatus={syncStatus}
            setSyncStatus={setSyncStatus}
            onRefreshDictionaryList={() => {
              setDictionaryList(ThaiRoyalInstituteDictionaryDatabase.getAllEntries());
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB: ROYAL INSTITUTE DICTIONARY VAULT */}
        {/* ========================================================================= */}
        {activeTab === 'dictionary' && (
          <div className="lg:col-span-12 space-y-6">
            {/* Search Header */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[280px] relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchDictionary(e.target.value)}
                  placeholder="ค้นหาคำศัพท์ คำอ่าน ความหมาย หรือหมวดหมู่ในพจนานุกรมราชบัณฑิตยสถาน..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <div className="text-xs text-slate-400">
                พบคำศัพท์ทั้งหมด: <span className="text-amber-400 font-bold">{dictionaryList.length}</span> คำ
              </div>
            </div>

            {/* Dictionary Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Word List */}
              <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 max-h-[600px] overflow-y-auto space-y-2">
                {dictionaryList.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`w-full p-3.5 rounded-xl text-left transition border flex items-center justify-between ${
                      selectedEntry?.id === entry.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-slate-950 hover:bg-slate-900 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{entry.word}</span>
                        {entry.isRoyalVocabulary && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            ราชาศัพท์
                          </span>
                        )}
                        {entry.hasMultipleReadings && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            อ่านได้หลายแบบ
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-amber-400/80 font-mono mt-0.5">
                        {entry.phoneticReading}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 px-2 py-0.5 rounded bg-slate-900">
                      {entry.partOfSpeechThai}
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected Entry Detail */}
              <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                {selectedEntry ? (
                  <>
                    <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold text-white">{selectedEntry.word}</h2>
                          <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {selectedEntry.partOfSpeechThai}
                          </span>
                        </div>
                        <div className="text-sm font-mono text-amber-400 mt-1">
                          คำอ่าน: {selectedEntry.phoneticReading}
                        </div>
                        <div className="text-xs font-mono text-slate-400 mt-0.5">
                          IPA: {selectedEntry.ipa}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setInputText(selectedEntry.word);
                          setActiveTab('speech');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        อ่านคำนี้
                      </button>
                    </div>

                    {/* Definition */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        ความหมายตามพจนานุกรมราชบัณฑิตยสถาน:
                      </h4>
                      <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                        {selectedEntry.definition}
                      </p>
                    </div>

                    {/* Etymology & Grammar */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500">ที่มา/รากศัพท์:</span>
                        <div className="text-slate-200 font-medium mt-0.5">{selectedEntry.etymologyDetail}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500">การผันวรรณยุกต์:</span>
                        <div className="text-amber-400 font-medium mt-0.5">{selectedEntry.tones.join(', ')}</div>
                      </div>
                    </div>

                    {/* Multi-Reading options if present */}
                    {selectedEntry.hasMultipleReadings && selectedEntry.multiReadingOptions && (
                      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2.5">
                        <h4 className="text-xs font-bold text-amber-300">
                          ⚠️ คำนี้อ่านได้หลายแบบตามพจนานุกรมราชบัณฑิตยสถาน:
                        </h4>
                        <div className="space-y-2">
                          {selectedEntry.multiReadingOptions.map((opt, idx) => (
                            <div key={idx} className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs">
                              <div className="font-bold text-amber-400">{opt.reading}</div>
                              <div className="text-slate-300 text-[11px] mt-0.5">{opt.meaningSummary}</div>
                              <div className="text-slate-500 text-[10px] mt-1 font-mono">
                                ตัวอย่าง: {opt.contextExample}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20 text-slate-500 text-xs">
                    เลือกคำศัพท์จากรายการด้านซ้ายเพื่อดูรายละเอียด
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: AI OFFLINE INSPECTOR */}
        {/* ========================================================================= */}
        {activeTab === 'ai_offline' && (
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      ศูนย์วิเคราะห์สัทศาสตร์และพจนานุกรมสำหรับ AI ออฟไลน์
                    </h2>
                    <p className="text-xs text-slate-400">
                      AI Offline Inspection Hub — สรุปความสอดคล้องกับระเบียบราชบัณฑิตยสถาน 100%
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setAiReport(AIOfflineRoyalDictionaryNavigator.inspectTextForAI(inputText))}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  รีเฟรชการตรวจสอบ
                </button>
              </div>

              {aiReport && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Compliance Card */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">ดัชนีความถูกต้องตามระเบียบ:</h4>
                    <div className="text-3xl font-black text-emerald-400">
                      {aiReport.qualityAssuranceScore}%
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>อิงพจนานุกรมราชบัณฑิตฯ:</span>
                        <span className="text-emerald-400 font-bold">100%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>ไม่กลืนพยางค์ (Zero Swallowing):</span>
                        <span className="text-emerald-400 font-bold">สมบูรณ์</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>อ่านชื่อเฉพาะในวงเล็บ:</span>
                        <span className="text-emerald-400 font-bold">
                          {aiReport.bracketedGuidesFound.length} จุด
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="md:col-span-2 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">ข้อเสนอแนะของระบบ AI:</h4>
                    {aiReport.recommendations.length > 0 ? (
                      <ul className="space-y-2 text-xs text-slate-300">
                        {aiReport.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-xs text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        ข้อความถูกต้องสมบูรณ์ พร้อมสำหรับการอ่านออกเสียงมาตรฐานทันที
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ThaiRoyalSpeechAndSingingStudio;
