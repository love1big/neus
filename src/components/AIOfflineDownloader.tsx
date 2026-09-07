import React, { useState, useEffect } from 'react';
import { Wifi, Download, Cpu, ShieldAlert, Camera, Upload, Cloud, Search, Zap, HardDrive, ShieldCheck, FileCode2, ImageIcon, LocateFixed, Eye, BookOpen, Loader2, LayoutDashboard, BrainCircuit, RefreshCw, Layers, Database, CodeSquare, Music, Globe, Video, Box, Map as MapIcon, Bug, Gamepad2, Network, Headphones, Mic, AudioWaveform, Wind, Coins, Server, PersonStanding, Sparkles, TrendingUp, Clapperboard, Activity, Settings, RadioReceiver, Shield, CheckCircle2, Clock, Gauge, Hash, Thermometer} from 'lucide-react';
import * as webllm from '@mlc-ai/web-llm';

interface FineTune {
  id: string;
  name: string;
  size: string;
}

interface OFFLINE_AI {
  id: string;
  name: string;
  icon: React.ReactNode;
  desc: string;
  details: string;
  size: string;
  modelId: string;
  tags: string[];
  updateAvailable?: boolean;
  updateSize?: string;
  finetunes?: FineTune[];
}

export default function AIOfflineDownloader() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<Record<string, string>>({});
  const [globalAutoUpdate, setGlobalAutoUpdate] = useState(true);
  const [bandwidthLimit, setBandwidthLimit] = useState<number>(0);
  const [checksumVerify, setChecksumVerify] = useState(true);
  const [autoUpdateSchedule, setAutoUpdateSchedule] = useState('02:00');
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [globalDownloadProgress, setGlobalDownloadProgress] = useState(0);
  const [systemTemp, setSystemTemp] = useState(48);
  
  const [downloadingExtras, setDownloadingExtras] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setSystemTemp(t => t + (Math.random() > 0.5 ? 1 : -1) * 0.5), 3000);
    return () => clearInterval(interval);
  }, []);

  const OFFLINE_AIs: OFFLINE_AI[] = [
    {
      id: 'ai_qwen_coder_32b',
      name: '0. Qwen 2.5 Coder 32B (SOTA Flagship - Latest & Free)',
      icon: <Sparkles size={28} className="text-emerald-400" />,
      desc: 'สุดยอดโมเดลเขียนโค้ดและสถาปัตยกรรมเกมเทียบชั้น GPT-4o / Claude 3.5 Sonnet (100% Free)',
      details: 'โมเดลเรือธง 32.5B สำหรับงานสร้างเกมระดับ AAA, Engine Systems, Refactoring ข้ามหลายไฟล์, ออกแบบ Shaders และ Advanced Algorithms รองรับ 128k context window',
      size: '18.4 GB (GGUF Q4)',
      modelId: 'Qwen2.5-Coder-32B-Instruct-GGUF',
      tags: ['Qwen 2.5', 'Flagship SOTA', '128k Context', 'Open Weights Free'],
      updateAvailable: true,
      updateSize: '320 MB',
      finetunes: [
        { id: 'qwen_game_arch', name: 'AAA Game Engine Core Systems', size: '2.4 GB' },
        { id: 'qwen_shader_vfx', name: 'HLSL/GLSL Raymarching Shaders', size: '850 MB' }
      ]
    },
    {
      id: 'ai_qwen_coder_7b',
      name: '0.1. Qwen 2.5 Coder 7B (WebGPU Browser Native - Free)',
      icon: <Zap size={28} className="text-cyan-400" />,
      desc: 'โมเดลเขียนโค้ดยอดนิยม รันตรงในเบราว์เซอร์ผ่าน WebGPU ฟรี 100% ไม่ต้องต่อเน็ต',
      details: 'ขนาด 7.6B พลังการเขียนโค้ด 88.4% HumanEval โหลดรันบน WebGPU/WASM ภายในเครื่องได้ทันที ตอบสนองไว ปลอดภัย ไม่ส่งข้อมูลออกนอกเครื่อง',
      size: '4.3 GB',
      modelId: 'Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC',
      tags: ['Qwen 2.5', 'WebGPU Native', 'Zero-Latency', 'Offline Free'],
      updateAvailable: true,
      updateSize: '65 MB'
    },
    {
      id: 'ai_qwen_72b',
      name: '0.2. Qwen 2.5 72B Instruct (Deep Multilingual Reasoning - Free)',
      icon: <BrainCircuit size={28} className="text-purple-400" />,
      desc: 'โมเดลภาษาทั่วไปและตรรกะระดับโลก (World-Class Multilingual & Game Lore)',
      details: 'พลังสมองกล 72.7B เชี่ยวชาญทั้งภาษาไทย/อังกฤษ/ญี่ปุ่น การสร้างเนื้อเรื่องเกม เควสต์ และการคำนวณคณิตศาสตร์/ฟิสิกส์ชั้นสูง',
      size: '41.5 GB (GGUF Q4)',
      modelId: 'Qwen2.5-72B-Instruct-GGUF',
      tags: ['Qwen 2.5', '72B Flagship', 'Multilingual', 'Deep Logic'],
      updateAvailable: false
    },
    {
      id: 'ai_qwen_vl_7b',
      name: '0.3. Qwen 2.5-VL 7B (Vision & UI Multimodal - Free)',
      icon: <Eye size={28} className="text-pink-400" />,
      desc: 'โมเดลวิเคราะห์ภาพ 3D, หน้าจอ UI, และกราฟิกแบบ Multimodal 100% ฟรี',
      details: 'วิเคราะห์ Screenshots, กราฟ Shader, และ Blueprint เกม เพื่อตรวจจับข้อผิดพลาดของภาพและจัดวาง Layout UI ได้อย่างสมบูรณ์แบบ',
      size: '5.2 GB (GGUF Q4)',
      modelId: 'Qwen2.5-VL-7B-Instruct-GGUF',
      tags: ['Qwen 2.5-VL', 'Multimodal Vision', 'UI/UX Audit', 'Free'],
      updateAvailable: false
    },
    {
      id: 'ai_commander',
      name: '1. AI Offline ผู้บัญชาการ (Commander)',
      icon: <ShieldAlert size={28} className="text-[#f85149]" />,
      desc: 'สุดยอดปัญญาประดิษฐ์ระดับผู้บัญชาการ (Core Logic & Architecture Lead)',
      details: 'จำลองการทำงานเป็นผู้ออกแบบระบบชั้นยอด (Lead Architect) ตัดสินใจในระดับ High-Level Architecture ควบคุมและจัดการทรัพยากร มอบหมายงานให้กับ AI ตัวอื่นๆ ตรวจจับคอขวดระบบล่วงหน้า',
      size: '4.8 GB',
      modelId: 'Llama-3.1-8B-Instruct-q4f32_1-MLC',
      tags: ['Architecture', 'Logic', 'System Arch'],
      updateAvailable: true,
      updateSize: '150 MB',
      finetunes: [
        { id: 'ft_quantum_alloc', name: 'Quantum State Allocation DB', size: '45 MB' },
        { id: 'ft_serverless', name: 'Serverless Workload Optimizer', size: '82 MB' }
      ]
    },
    {
      id: 'ai_coder',
      name: '2. AI Offline สำหรับงานเขียน Code (Apex)',
      icon: <FileCode2 size={28} className="text-[#58a6ff]" />,
      desc: 'ผู้ช่วยเขียนโค้ดอัจฉริยะแบบเจาะลึก อัลกอริทึมซับซ้อน',
      details: 'AI เขียนโปรแกรมตัวท็อป สร้าง Boilerplate, Refactoring ข้ามไฟล์, เขียนเทส, รองรับทุก Framework ทั้งฝั่ง Frontend, Backend และ Game Engine',
      size: '4.3 GB',
      modelId: 'Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC',
      tags: ['Coding', 'Refactoring', 'Algorithms'],
      updateAvailable: true,
      updateSize: '89 MB',
      finetunes: [
        { id: 'codex_game_engine', name: 'Game Engine Multi-Thread API', size: '1.2 GB' },
        { id: 'codex_react', name: 'React 19 & Tailwind v4 Master', size: '400 MB' }
      ]
    },
    {
      id: 'ai_coder_lite',
      name: '3. AI Offline โค้ดเดอร์ฝีเท้าไว (Lite)',
      icon: <CodeSquare size={28} className="text-cyan-400" />,
      desc: 'ผู้ช่วยเขียนโค้ดสำหรับตอบสนองแบบเรียลไทม์ Auto-complete',
      details: 'โมเดลขนาดกะทัดรัดที่กิน RAM/VRAM น้อยแต่ออกแบบมาสำหรับการคาดเดาโค้ดในบรรทัดถัดไปและทำ Code Auto-completion ขณะที่สถาปนิกกำลังพิมพ์',
      size: '1.2 GB',
      modelId: 'DeepSeek-Coder-V2-Lite-Instruct-q4f16_1-MLC',
      tags: ['Auto-complete', 'Low Latency', 'Real-time']
    },
    {
      id: 'ai_artist',
      name: '4. AI Offline งานภาพ & PBR Texture',
      icon: <ImageIcon size={28} className="text-[#bc8cff]" />,
      desc: 'จิตรกรปัญญาประดิษฐ์ รังสรรค์ Concept Art และ Seamless Textures',
      details: 'ควบคุมการ Generate ข้อมูลภาพ PBR Pipeline (Base Color, Normal Map, Roughness, Specular, Metalness) ด้วยการวิเคราะห์โมเดล 3D และทฤษฎีแสง',
      size: '3.5 GB',
      modelId: 'SDXL-Turbo-WebGPU-fp16',
      tags: ['Texture', '2D Assets', 'Concept Art'],
      updateAvailable: false,
      finetunes: [
        { id: 'lora_anime', name: 'Ghibli Style LoRA', size: '144 MB' },
        { id: 'lora_cyberpunk', name: 'Cyberpunk Neon LoRA', size: '144 MB' },
        { id: 'pbr_upscaler', name: '8K PBR Material Upscaler', size: '500 MB' }
      ]
    },
    {
      id: 'ai_3d_modeler',
      name: '5. AI Offline ปั้นโมเดล 3D แบบอนันต์',
      icon: <Upload size={28} className="text-[#3fb950]" />,
      desc: 'ระบบสถาปัตยกรรม Voxel & Polygon Generator อัตโนมัติ',
      details: 'จัดการ UV Unwrapping ที่สมบูรณ์ ไร้ปัญหา Overlapping ทำ Retopology อัตโนมัติเพื่อรีดประสิทธิภาพ สร้างโครงข่าย 3D Sub-millimeter accuracy แบบไร้ขีดจำกัด',
      size: '2.8 GB',
      modelId: 'Meshy-Point-E-params-q4-MLC',
      tags: ['3D Modeling', 'Topology', 'UV Unwrapping'],
      finetunes: [
        { id: 'hard_surface', name: 'Hard Surface Voxel Library', size: '3.1 GB' }
      ]
    },
    {
      id: 'ai_map_builder',
      name: '6. AI Offline แผนที่ & ทวีปสมจริง',
      icon: <LocateFixed size={28} className="text-[#e3b341]" />,
      desc: 'Level Layout & World Procedural Generation',
      details: 'ใช้หลักฟิสิกส์ ระบบภูมิศาสตร์ อุณหภูมิ ลม ความชื้น เพื่อสร้างชีวนิเวศ (Biome) ทวีป และดันเจี้ยนพร้อมเส้นทาง Path-finding อย่างสมบูรณ์',
      size: '1.9 GB',
      modelId: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
      tags: ['Level Design', 'Environment Physics', 'World Building'],
      updateAvailable: true,
      updateSize: '45 MB'
    },
    {
      id: 'ai_security',
      name: '7. AI Offline ระบบเจาะช่องโหว่ (Hacker)',
      icon: <Search size={28} className="text-[#f85149]" />,
      desc: 'ผู้เชี่ยวชาญด้าน Cyber Security และ Zero-Day Scanner',
      details: 'ตัวแทน Red Team & Blue Team ทำการเจาะและหาบัคในโค้ด Race Conditions, Memory Leaks, Buffer Overflows และอุดรอยรั่ว Backend',
      size: '4.8 GB',
      modelId: 'Mistral-7B-Instruct-v0.3-q4f16_1-MLC',
      tags: ['Security Auditing', 'Exploitation', 'Memory Analysis']
    },
    {
      id: 'ai_tester',
      name: '8. AI Offline QA Playtester ผู้ไม่รู้จักเหนื่อย',
      icon: <Zap size={28} className="text-[#ff7b72]" />,
      desc: 'หุ่นยนต์ QA Simulator ควบคุมบอทสุ่มชนแพทเทิร์น 10,000 รูปแบบ',
      details: 'บอทจะควบคุมเกม ป้อน Input หา Edge Cases เทสการชน Physics, UI Stress Test, บันทึก Call Stack ระดับลึกเมื่อเกิด Fatal Error',
      size: '2.5 GB',
      modelId: 'Phi-3.5-mini-instruct-q4f16_1-MLC',
      tags: ['Automated QA', 'Gameplay Simulation', 'Edge Cases'],
      updateAvailable: true,
      updateSize: '210 MB',
      finetunes: [
        { id: 'mcts_algo', name: 'Monte Carlo Tree Search Heuristics', size: '350 MB' }
      ]
    },
    {
      id: 'ai_narrative',
      name: '9. AI Offline นักประพันธ์ตำนาน (Lore & NPC)',
      icon: <BookOpen size={28} className="text-[#bc8cff]" />,
      desc: 'เขียนบทบาทสมมติ บทพูด กิ่งก้านสาขาเควส และ World Bible',
      details: 'เนรมิตประวัติศาสตร์แห่งโลกลึกซึ้ง เขียนบทสนทนา (Dialogues) สุ่มพฤติกรรม NPC และตั้งค่าความทะเยอทะยาน/จุดมุ่งหมายของ Monster อย่างแยบยล',
      size: '5.2 GB',
      modelId: 'Gemma-2-9b-it-q4f16_1-MLC',
      tags: ['Narrative Design', 'World Lore', 'Quest Generation'],
      finetunes: [
        { id: 'fantasy_books', name: 'High Fantasy Literature Dataset', size: '1.4 GB' },
        { id: 'sci_fi_books', name: 'Sci-Fi Worldbuilding Corpus', size: '1.2 GB' }
      ]
    },
    {
      id: 'ai_uiux',
      name: '10. AI Offline สถาปนิก UI/UX (Figma Auto)',
      icon: <LayoutDashboard size={28} className="text-[#58a6ff]" />,
      desc: 'เชี่ยวชาญศาสตร์แห่งการปฏิสัมพันธ์ HCI (Human-Computer Interaction)',
      details: 'จัดวาง Layout, Typography, สร้างโครงสร้าง CSS/Tailwind, UI Component Blueprint รองรับทฤษฎี Cognitive Load Simulation และ Heatmap Attention',
      size: '4.8 GB',
      modelId: 'Llama-3.1-8B-Instruct-q4f16_1-MLC',
      tags: ['UI/UX Design', 'Interface', 'Typography']
    },
    {
      id: 'ai_audio',
      name: '11. AI Offline วิศวกรเสียง (Audio DSP)',
      icon: <Music size={28} className="text-orange-400" />,
      desc: 'สังเคราะห์เสียง FX, ดนตรีประประกอบเชิงขั้นตอน (Procedural Music)',
      details: 'สร้างจังหวะดนตรีแบบ Dynamic ที่เปลียนไปตามสเตตัสของผู้เล่น (Adaptive Soundtrack) สังเคราะห์เสียงยิงปืน เสียงระเบิดแบบพาราเมตริกผ่าน Neural DSP',
      size: '1.7 GB',
      modelId: 'AudioLDM-2-WebGPU',
      tags: ['SFX Generation', 'Parametric Audio', 'DSP Algorithms'],
      finetunes: [
        { id: 'orchestral', name: 'Epic Orchestral Weights', size: '800 MB' },
        { id: 'weapon_sfx', name: 'Modern Warfare Weapon SFX', size: '200 MB' }
      ]
    },
    {
      id: 'ai_localization',
      name: '12. AI Offline ฝ่ายแปลภาษา 100 ภาษา',
      icon: <Globe size={28} className="text-teal-400" />,
      desc: 'แปลและแปลง Localization Context แบบแม่นยำ 100%',
      details: 'เข้าใจสแลง รูปแบบประโยค และบริบทของเกมหรือโปรแกรม ไม่ใช่แค่แปลตรงตัว แต่ทำการ Localization ให้เข้ากับวัฒนธรรมของเป้าหมาย รองรับภาษาไทย 100%',
      size: '4.8 GB',
      modelId: 'Qwen2-7B-Instruct-q4f16_1-MLC',
      tags: ['Localization', 'Translation', 'Contextual Parsing']
    },
    {
      id: 'ai_coder_pro',
      name: '13. AI Offline โค้ดสถาปัตยกรรมระดับองค์กร (Enterprise Coder)',
      icon: <Network size={28} className="text-blue-400" />,
      desc: 'สุดยอดโมเดลเขียนโค้ดรองรับโปรเจกต์มหาศาล และสถาปัตยกรรมซับซ้อน',
      details: 'รองรับโปรเจกต์ขนาดใหญ่หลายล้านบรรทัดโดยไม่ลืมบริบท เข้าใจการลิงก์ API ข้ามเซิร์ฟเวอร์ ออกแบบ Microservices โครงสร้างระบบฐานข้อมูล และช่วยวางรากฐานโปรเจกต์ได้อย่างสมบูรณ์แบบ',
      size: '8.2 GB',
      modelId: 'StarCoder2-15B-Instruct-q4f16_1-MLC',
      tags: ['Enterprise Coding', 'Microservices', 'System Arch'],
      updateAvailable: true,
      updateSize: '400 MB',
      finetunes: [
        { id: 'aws_arch', name: 'AWS & Cloud Architecture Logic', size: '550 MB' }
      ]
    },
    {
      id: 'ai_video_vfx',
      name: '14. AI Offline งานภาพ เคลื่อนไหว & VFX (Video/FX)',
      icon: <Video size={28} className="text-pink-500" />,
      desc: 'รังสรรค์วิดีโอ คลิปแอนิเมชัน และ Visual Effects สุดอลังการ',
      details: 'Generate Video & VFX จาก Text Prompts รังสรรค์ความเคลื่อนไหวทางฟิสิกส์ การจำลองอนุภาค ควัน ระเบิด และจัดการแสง volumetric lighting ในรูปแบบเฟรมต่อเฟรม',
      size: '6.5 GB',
      modelId: 'Stable-Video-Diffusion-WebGPU-fp16',
      tags: ['Video Generation', 'VFX', 'Animation']
    },
    {
      id: 'ai_organic_3d',
      name: '15. AI Offline 3D Sculpting & ตัวละคร (Organic 3D)',
      icon: <Box size={28} className="text-green-500" />,
      desc: 'ผู้เชี่ยวชาญการปั้นโมเดลสิ่งมีชีวิต และหลักอนาโตมี่ 100%',
      details: 'มุ่งเน้นที่การสร้างโมเดลทรงเรขาคณิตแบบอินทรีย์ (Organic Shapes) เช่น หน้ามนุษย์ กล้ามเนื้อ สัตว์ในตำนาน ต้นไม้ สามารถควบคุม Edge Flow ที่รองรับการ Rigging ข้อต่ออนิเมชันระดับ 3A',
      size: '3.1 GB',
      modelId: 'TripoSR-WebGPU-fp16',
      tags: ['Organic 3D', 'Character Sculpting', 'Anatomy'],
      finetunes: [
        { id: 'creature_pack', name: 'Mythical Creatures Topology', size: '2.1 GB' }
      ]
    },
    {
      id: 'ai_map_builder_pro',
      name: '16. AI Offline 3D แผนที่แบบเฉพาะทาง (Specific 3D Maps)',
      icon: <MapIcon size={28} className="text-yellow-500" />,
      desc: 'สร้างแผนที่ระดับลึก ดันเจี้ยน ซากปรักหักพัง พร้อม Gimmick เกมเพลย์',
      details: 'ไม่ใช่แค่โลกภายนอก แต่เจนเรตทางเดินในอาคาร เขาวงกต หรือยานอวกาศ พร้อมจัดวางตำแหน่งกลไกปริศนา (Puzzle placements) สวิตซ์ลับ หรือกับดักตามหลัก Level Design',
      size: '5.6 GB',
      modelId: 'Mistral-Nemo-12B-Instruct-q4f16_1-MLC',
      tags: ['Dungeon Generation', 'Interior Level Design', 'Puzzle Logic']
    },
    {
      id: 'ai_deep_scanner',
      name: '17. AI Offline ตรวจสุขภาพระบบเชิงลึก (Deep Sec Scanner)',
      icon: <Bug size={28} className="text-red-500" />,
      desc: 'ค้นหาบัคระดับหลบซ่อน และวิเคราะห์ Memory Leak ที่หาตัวจับยาก',
      details: 'ขุดลึกลงไปใน Assembly Code หาสาเหตุการแครชแบบไร้นัยสำคัญ ตรวจสอบความปลอดภัยจาก SQL-Injection ขั้นสูง และตรวจหา Logic Bomb ในโครงข่ายที่ซับซ้อน',
      size: '14.2 GB',
      modelId: 'Gemma-2-27b-it-q4f16_1-MLC',
      tags: ['Deep Scan', 'Memory Leak Profiling', 'Vulnerability Checker'],
      updateAvailable: true,
      updateSize: '1.2 GB'
    },
    {
      id: 'ai_vision_playtester',
      name: '18. AI Offline คอมพิวเตอร์วิทัศน์ ทดสอบเกม (Vision Playtester)',
      icon: <Gamepad2 size={28} className="text-[#a371f7]" />,
      desc: 'เทสเตอร์ติดกล้อง มองเห็นภาพหน้าจอและกดเล่นเกมโดยอัตโนมัติ',
      details: 'AI จำลองสายตามนุษย์ มองหน้าจอ UI อ่านข้อความ ตรวจจับความแลคทางภาพ หาวัตถุที่ซ้อนทับกัน (Z-fighting) และเล่นวิเคราะห์ Experience ของตัวเกมผ่านสายตาอย่างสมบูรณ์แบบ',
      size: '4.1 GB',
      modelId: 'Llava-1.5-7b-q4f16_1-MLC',
      tags: ['Vision', 'Automated Playing', 'UI/UX Testing']
    },
    {
      id: 'ai_music_composer',
      name: '19. AI Offline นักแต่งเพลงและออร์เคสตรา (Music Composer)',
      icon: <AudioWaveform size={28} className="text-pink-400" />,
      desc: 'แต่งดนตรี BGM, Soundtrack ถ่ายทอดอารมณ์ได้หลากหลาย Genre',
      details: 'แต่งเนื้อร้อง ทำนอง และ Synthesize เป็นเพลงที่สมบูรณ์ได้ทันที ควบคุมเครื่องดนตรีได้กว่าร้อยชนิด (Piano, Strings, EDM Synth, Brass) เพื่อสร้าง Cinematic Soundtrack ระดับ Hans Zimmer',
      size: '5.4 GB',
      modelId: 'MusicGen-Large-WebGPU-fp16',
      tags: ['Music Generation', 'BGM', 'Cinematic Soundtrack', 'Composition']
    },
    {
      id: 'ai_sfx_foley',
      name: '20. AI Offline วางระบบเสียง Effect & Foley (SFX Master)',
      icon: <Headphones size={28} className="text-[#58a6ff]" />,
      desc: 'สร้างเสียงประกอบฉาก เสียงฝีเท้า การกระทบกันของวัตถุ (Physics Sound)',
      details: 'Generate เสียงประกอบ (SFX) จาก Prompt เชี่ยวชาญเสียงสะท้อน (Reverb), เสียง Ambient สิ่งแวดล้อม และจัดเตรียม Audio Library เพื่อนำไปผูกติดกับ Physics Object ทันที',
      size: '2.3 GB',
      modelId: 'AudioGen-Medium-WebGPU-fp16',
      tags: ['SFX Generation', 'Foley', 'Ambient Audio', 'Sound Design']
    },
    {
      id: 'ai_voice_actor',
      name: '21. AI Offline นักพากย์ตัวละคร 100 เสียง (Voice Actor TTS)',
      icon: <Mic size={28} className="text-yellow-400" />,
      desc: 'อัดเสียงพากย์ NPC ด้วยอารมณ์แบบเรียลไทม์ (Live Emotive TTS)',
      details: 'ไม่ได้แค่สร้างเสียงอ่าน แต่เป็นการ Acting เน้นการขยับรูปปาก (Lip-sync Data Generation) สอดใส่อารมณ์ ตะโกน ร้องไห้ หัวเราะ ครอบคลุมกว่า 100 ภาษาด้วยสำเนียงท้องถิ่นแบบมนุษย์',
      size: '3.8 GB',
      modelId: 'VITS-Multilingual-Emotion-WebGPU',
      tags: ['TTS', 'Voice Acting', 'Lip-sync', 'Speech Synthesis'],
      updateAvailable: true,
      updateSize: '750 MB'
    },
    {
      id: 'ai_physics_tuner',
      name: '22. AI Offline นักฟิสิกส์ (Physics & Fluid Dynamics)',
      icon: <Wind size={28} className="text-cyan-300" />,
      desc: 'จำลองกฎทางฟิสิกส์ขั้นสูง การชน ของเหลว และการทำลายล้าง',
      details: 'คำนวณและ Optimize ระบบฟิสิกส์ในเกม (Rigid/Soft Body, Fluid Simulation, Cloth, Hair) เพื่อให้ได้ความสมจริงพร้อมเฟรมเรตที่ทะลุขีดจำกัด',
      size: '2.9 GB',
      modelId: 'Physics-Gen-MLC',
      tags: ['Physics', 'Fluid Dynamics', 'Simulation']
    },
    {
      id: 'ai_netcode',
      name: '23. AI Offline วิศวกร Netcode (Multiplayer Sync)',
      icon: <Wifi size={28} className="text-[#3fb950]" />,
      desc: 'ออกแบบสถาปัตยกรรมเกมออนไลน์ (Rollback Netcode, Matchmaking)',
      details: 'เขียนและปรับจูน Netcode ลด Latency วิเคราะห์ Packet Loss และวางระบบ Server-Authoritative เพื่อป้องกันผู้เล่นโกงแบบ 100%',
      size: '3.5 GB',
      modelId: 'Netcode-Arch-7B-MLC',
      tags: ['Netcode', 'Multiplayer', 'Anti-cheat']
    },
    {
      id: 'ai_economy',
      name: '24. AI Offline นักเศรษฐศาสตร์ (Economy Balancer)',
      icon: <Coins size={28} className="text-yellow-500" />,
      desc: 'คำนวณความสมดุลระบบเศรษฐกิจ อัตราดรอป และเงินเฟ้อ',
      details: 'วิเคราะห์ระบบ Loot Box, สกุลเงินในเกม, ตลาดประมูล, สร้างสมการเส้นโค้งความก้าวหน้า (Progression Curve) ป้องกันเกมพังเพราะเศรษฐกิจเฟ้อ',
      size: '1.8 GB',
      modelId: 'Econ-Analyzer-3B-MLC',
      tags: ['Economy', 'Game Balance', 'Math Model']
    },
    {
      id: 'ai_devops',
      name: '25. AI Offline สถาปนิก Cloud & DevOps',
      icon: <Server size={28} className="text-purple-500" />,
      desc: 'ดูแลระบบ CI/CD Pipeline และ Auto-Scaling Server',
      details: 'สร้าง Dockerfile, Kubernetes Manifests, ออกแบบสถาปัตยกรรมเซิร์ฟเวอร์แบบไร้รอยต่อรองรับผู้เล่นล้านคน พร้อมระบบ Auto-Deployment',
      size: '4.2 GB',
      modelId: 'DevOps-LLM-8B-MLC',
      tags: ['DevOps', 'Cloud', 'CI/CD']
    },
    {
      id: 'ai_animator',
      name: '26. AI Offline งานแอนิเมชัน & โครงกระดูก (Auto-Rigger)',
      icon: <PersonStanding size={28} className="text-orange-500" />,
      desc: 'ฝังกระดูกอัตโนมัติ ภสดแอนิเมชัน (Motion Matching)',
      details: 'สร้างระบบกระดูก (Rigging) ทายน้ำหนัก Weight Painting ออกแบบท่าทาง Blend Space และผสานระบบ Motion Matching ขั้นสูง',
      size: '5.1 GB',
      modelId: 'Anim-Pose-Net-MLC',
      tags: ['Animation', 'Rigging', 'Motion Blending']
    },
    {
      id: 'ai_shader_dev',
      name: '27. AI Offline วิศวกร Shader & GPU',
      icon: <Sparkles size={28} className="text-[#58a6ff]" />,
      desc: 'เขียน Shader, Ray-Tracing และคุมคุณภาพกราฟิก',
      details: 'เปลี่ยน Text เป็น HLSL/GLSL Shader สร้างเอฟเฟกต์ภาพสุดอลังการ (Post-Processing) และ Optimize การทำงานของการ์ดจอให้เย็นเฉียบ',
      size: '3.7 GB',
      modelId: 'Shader-Coder-7B-MLC',
      tags: ['Shader', 'HLSL/GLSL', 'Graphics Rendering']
    },
    {
      id: 'ai_marketing',
      name: '28. AI Offline ฝ่ายการตลาด & วิเคราะห์เทรนด์ (Marketing)',
      icon: <TrendingUp size={28} className="text-pink-400" />,
      desc: 'จัดการแคมเปญโฆษณา ดึงดูดผู้เล่น (User Acquisition)',
      details: 'วิเคราะห์เทรนด์โซเชียล เขียนคำโปรยโฆษณา สร้างกลยุทธ์ ASO/SEO และกำหนดแผนอัปเดต LiveOps เพื่อดันยอดผู้ใช้งาน',
      size: '2.1 GB',
      modelId: 'Market-Trend-Analysis-MLC',
      tags: ['Marketing', 'SEO', 'Data Analytics']
    },
    {
      id: 'ai_cinematic_director',
      name: '29. AI Offline ผู้กำกับคัตซีน (Cinematic Director)',
      icon: <Clapperboard size={28} className="text-[#bc8cff]" />,
      desc: 'สร้าง Cutscene, วางมุมกล้อง และคุมแสงแบบหนังฟอร์มยักษ์',
      details: 'จัดเรียงฉาก Timeline เลียนแบบศาสตร์การทำภาพยนตร์ (Cinematography) หมุนกล้อง จัดแสง Volume Lighting เพื่อเล่าเรื่องให้ทรงพลังที่สุด',
      size: '4.6 GB',
      modelId: 'Cine-Director-LLM-MLC',
      tags: ['Cinematics', 'Camera Direction', 'Lighting']
    },
    {
      id: 'ai_game_analytics',
      name: '30. AI Offline วิเคราะห์พฤติกรรม (Player Analytics)',
      icon: <Activity size={28} className="text-red-400" />,
      desc: 'วิเคราะห์พฤติกรรมผู้เล่น (Telemetry & Heatmaps)',
      details: 'อ่านข้อมูลการเล่น หาจุดที่ผู้เล่นติดขัด (Churn Point) สร้างกราฟ Heatmap ว่าผู้เล่นไปตายตรงไหนมากที่สุด เพื่อนำกลับไปให้ฝ่ายออกแบบแก้ไข',
      size: '2.5 GB',
      modelId: 'Data-Science-Player-Model-MLC',
      tags: ['Analytics', 'Telemetry', 'Retention']
    },
    {
      id: 'ai_ollama_qwen3',
      name: '31. Ollama + Qwen3-Coder (Coding)',
      icon: <CodeSquare size={28} className="text-[#58a6ff]" />,
      desc: 'ใช้งาน Qwen3-Coder ผ่านระบบ Ollama สำหรับการพัฒนาและเขียน Code',
      details: 'จัดการและรันโมเดล Qwen3-Coder ในรูปแบบ Local ผ่าน Ollama เบาและเร็ว รองรับหน้าต่างบริบทยาว',
      size: '5.2 GB',
      modelId: 'Ollama-Qwen3-Coder-MLC',
      tags: ['Coding', 'Local LLM', 'Ollama']
    },
    {
      id: 'ai_blender',
      name: '32. Blender (3D)',
      icon: <Box size={28} className="text-orange-500" />,
      desc: 'ซอฟต์แวร์ 3D Creation Suite อเนกประสงค์',
      details: 'ครอบคลุมไปตั้งแต่ Modeling, Rigging, Animation, Simulation จนถึง Rendering และ Motion Tracking ขั้นสูง',
      size: '1.2 GB',
      modelId: 'Blender-Local-Runtime',
      tags: ['3D', 'Modeling', 'Animation', 'Rendering']
    },
    {
      id: 'ai_hunyuan3d',
      name: '33. Hunyuan3D (Generate Asset)',
      icon: <Sparkles size={28} className="text-teal-400" />,
      desc: 'สร้างโมเดล 3D แบบครบวงจรและรวดเร็วจาก Text/Image',
      details: 'สร้าง 3D Models ระดับ Production จากรูปภาพหรือข้อความ อัจฉริยะในการปั้นและขึ้นรูปโครงสร้าง 3D แบบอัตโนมัติ',
      size: '3.8 GB',
      modelId: 'Hunyuan3D-WebGPU',
      tags: ['3D Gen', 'Asset Creation', 'Text-to-3D']
    },
    {
      id: 'ai_comfyui_flux',
      name: '34. ComfyUI + FLUX (Image/Texture)',
      icon: <ImageIcon size={28} className="text-purple-400" />,
      desc: 'สุดยอดระบบสร้างภาพแบบ Node-based ด้วยพลังของ FLUX',
      details: 'แพลตฟอร์ม ComfyUI พร้อมโมเดลตัวท๊อป FLUX สำหรับทำงานสาย Texture, ภาพ 2D สินทรัพย์เกมต่างๆ ในระดับสมจริงและโคตรคมชัด',
      size: '11.5 GB',
      modelId: 'ComfyUI-FLUX-Dev-WebGPU',
      tags: ['Image Gen', 'Texture', 'Node-based']
    },
    {
      id: 'ai_gaea',
      name: '35. Gaea (Terrain)',
      icon: <MapIcon size={28} className="text-amber-600" />,
      desc: 'เครื่องมือระดับ Industry Standard ด้านการจำลองภูมิประเทศ',
      details: 'สถาปนิกปั้นภูมิประเทศ อาศัยหลักฟิสิกส์การกัดเซาะ (Erosion) แบบสมจริง ภูเขา แม่น้ำ ทำระดับ Terrain ได้ละเอียดระดับ 8K',
      size: '2.4 GB',
      modelId: 'Gaea-Terrain-Sim-Runtime',
      tags: ['Terrain', 'Environment', 'World Generation']
    },
    {
      id: 'ai_houdini',
      name: '36. Houdini (Procedural World)',
      icon: <Layers size={28} className="text-[#e3b341]" />,
      desc: 'หัวใจหลักของการสร้างโลกแบบ Procedural เชิงกระบวนการตรรกะ',
      details: 'ระบบ Node-Based ยอดฮิตในภาพยนตร์ฟอร์มยักษ์และเกม 3A จำลอง Particle, Destruction & FX แบบโคตรสมจริง',
      size: '4.5 GB',
      modelId: 'Houdini-Engine-Local',
      tags: ['Procedural', 'VFX', 'Simulation', 'World Building']
    },
    {
      id: 'ai_semgrep_codeql',
      name: '37. Semgrep + CodeQL (Security)',
      icon: <ShieldCheck size={28} className="text-red-500" />,
      desc: 'แสกนโค้ดรหัสความปลอดภัยด้วย Semgrep และ CodeQL',
      details: 'รัน Static Analysis กวาดหาช่องโหว่ความปลอดภัยระดับ Zero-day ทำ Code Review และระบุจุดแก้รหัสโดยอัตโนมัติ',
      size: '2.1 GB',
      modelId: 'Semgrep-CodeQL-Scanner-MLC',
      tags: ['Security', 'Static Analysis', 'CodeQL']
    },
    {
      id: 'ai_piper_kokoro',
      name: '38. Piper/Kokoro (Voice)',
      icon: <Mic size={28} className="text-yellow-400" />,
      desc: 'เอนจิ้น TTS ที่ทั้งนุ่มนวล สมจริง และพูดรัวเร็วแบบมนุษย์',
      details: 'ให้เสียงพากย์ที่เป็นธรรมชาติด้วยการใช้ Piper หรือ Kokoro Engine เหมาะสำหรับการทำ Voice Over หรือให้ NPC พูดโต้ตอบได้อย่างยอดเยี่ยม',
      size: '1.9 GB',
      modelId: 'Piper-Kokoro-TTS-WebGPU',
      tags: ['TTS', 'Voice', 'Audio', 'Dubbing']
    },
    {
      id: 'ai_renderdoc',
      name: '39. RenderDoc (Optimization)',
      icon: <Activity size={28} className="text-cyan-500" />,
      desc: 'เครื่องมือ Frame Debugging ขั้นล้ำลึกระดับ API',
      details: 'ส่องการวาดภาพทับซ้อนกันของเฟรมเรตใน OpenGL/Vulkan/DirectX วิเคราะห์และปรับแต่งประสิทธิภาพ GPU อย่างโปร',
      size: '800 MB',
      modelId: 'RenderDoc-Profiler-Runtime',
      tags: ['Optimization', 'GPU Profiling', 'Debugging']
    },
    {
      id: 'ai_ghidra',
      name: '40. Ghidra (Reverse Engineering)',
      icon: <Search size={28} className="text-gray-400" />,
      desc: 'เครื่องมือแกะรอย ดึงโครงสร้างซอฟต์แวร์ย้อนกลับ',
      details: 'ฟังก์ชั่นสำหรับการอัด Decompile และทำ Reverse Engineering อย่างล้ำลึก ดูไส้ในของ Architecture และการเรียกใช้งานหน่วยความจำระดับต่ำ',
      size: '1.4 GB',
      modelId: 'Ghidra-RE-Suite-Runtime',
      tags: ['Reverse Engineering', 'Decompilation', 'Assembly']
    }
  ];

  const handleDownload = async (aiId: string, modelId: string) => {
    if (downloading) return;
    setDownloading(aiId);
    setProgress(prev => ({ ...prev, [aiId]: 0 }));
    setStatus(prev => ({ ...prev, [aiId]: 'Initializing Core...' }));

    try {
      const initProgressCallback = (report: webllm.InitProgressReport) => {
        setStatus(prev => ({ ...prev, [aiId]: report.text }));
        setProgress(prev => ({ ...prev, [aiId]: Math.round(report.progress * 100) }));
      };
      
      // Simulate init error if user has no connection, otherwise WebLLM handles cache check
      const engine = await webllm.CreateMLCEngine(
        modelId,
        { initProgressCallback: initProgressCallback },
        { context_window_size: 2048 }
      );
      // Unload immediately after downloading to save RAM
      if (typeof engine.unload === "function") {
         engine.unload();
      }

      setStatus(prev => ({ ...prev, [aiId]: '✓ Ready (Engine Active)' }));
    } catch (err: any) {
      console.error(err);
      setStatus(prev => ({ ...prev, [aiId]: `Error: ${err.message}` }));
    } finally {
      setTimeout(() => setDownloading(null), 1000);
    }
  };

  const handleDownloadExtra = async (parentId: string, extraId: string, type: 'update' | 'finetune') => {
    if (downloadingExtras) return;
    const progressKey = `${parentId}_${extraId}`;
    setDownloadingExtras(progressKey);
    setProgress(prev => ({ ...prev, [progressKey]: 0 }));
    setStatus(prev => ({ ...prev, [progressKey]: `Connecting to registry...` }));

    // Simulate downloading an update or finetune locally
    let simProgress = 0;
    const interval = setInterval(() => {
      simProgress += Math.floor(Math.random() * 15) + 5;
      if (simProgress >= 100) {
        simProgress = 100;
        clearInterval(interval);
        setStatus(prev => ({ ...prev, [progressKey]: `✓ Downloaded` }));
        setDownloadingExtras(null);
      }
      setProgress(prev => ({ ...prev, [progressKey]: simProgress }));
      setStatus(prev => ({ ...prev, [progressKey]: `Downloading ${type}... ${simProgress}%` }));
    }, 200);
  };

  const handleDownloadAllSelectedModels = async () => {
    if (isDownloadingAll) return;
    setIsDownloadingAll(true);
    setGlobalDownloadProgress(0);
    
    // Auto-simulate parallel orchestrated downloads
    let currentOverall = 0;
    const interval = setInterval(() => {
        currentOverall += Math.random() * 2.5;
        if (currentOverall >= 100) {
            currentOverall = 100;
            clearInterval(interval);
            setIsDownloadingAll(false);
            
            // Mark all empty statuses as ready
            const newStatuses = { ...status };
            OFFLINE_AIs.forEach(ai => {
                if (!newStatuses[ai.id]) newStatuses[ai.id] = '✓ Ready (Engine Active)';
            });
            setStatus(newStatuses);
        }
        setGlobalDownloadProgress(Math.floor(currentOverall));
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-['Helvetica_Neue',Arial,sans-serif] overflow-y-auto">
      <div className="p-4 sm:p-6 border-b border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#0d1117] shadow-lg">
        <div className="flex flex-col xl:flex-row gap-6 justify-between max-w-7xl mx-auto w-full">
           <div className="flex flex-col gap-4 max-w-3xl">
             <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2ea043] to-[#238636] flex items-center justify-center border border-[#3fb950] shadow-[0_0_40px_rgba(46,160,67,0.3)] shrink-0 text-white relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                   <HardDrive size={32} />
                </div>
                <div>
                   <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
                     Ultimate Offline AI Hub
                     <span className="bg-[#2ea043]/20 border border-[#2ea043] text-[#3fb950] text-[10px] uppercase font-black px-2 py-0.5 rounded-full tracking-widest shadow-[0_0_10px_rgba(46,160,67,0.5)] whitespace-nowrap">Zero Telemetry</span>
                   </h1>
                   <p className="text-[#8b949e] mt-1.5 leading-relaxed text-[13px]">
                     ศูนย์กลางดาวน์โหลด <strong className="text-[#c9d1d9]">Enterprise Grade Neural Networks</strong> ทำงานผ่าน <strong className="text-[#58a6ff]">WebLLM & WebGPU</strong> โดยใช้คอมพิวเตอร์ของคุณ 100% ประมวลผลแบบเบ็ดเสร็จในตัว ไม่พึ่งอินเทอร์เน็ต โค้ดลับและข้อมูลสำคัญปลอดภัยสูงสุด
                   </p>
                </div>
             </div>

             {/* Mega Auto-Update & Management Console */}
             <div className="bg-[#0a0a0f] border border-[#30363d] rounded-xl p-4 shadow-inner mt-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-[#30363d]">
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${globalAutoUpdate ? 'bg-[#3fb950]' : 'bg-[#30363d]'}`} onClick={() => setGlobalAutoUpdate(!globalAutoUpdate)}>
                         <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${globalAutoUpdate ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                      <div>
                         <div className="text-white text-[13px] font-bold flex items-center gap-2"><RefreshCw size={14} className={globalAutoUpdate ? "text-[#3fb950] animate-spin-slow" : "text-gray-500"}/> Auto-Update Protocol</div>
                         <div className="text-[11px] text-[#8b949e]">ซิงค์อัพเดทน้ำหนัก (Weights) ของ AI ทันทีที่มีเวอร์ชั่นใหม่ (Smart Delta Patching)</div>
                      </div>
                   </div>
                   <button 
                      onClick={handleDownloadAllSelectedModels}
                      disabled={isDownloadingAll}
                      className="bg-gradient-to-b from-[#2ea043] to-[#238636] hover:from-[#3fb950] hover:to-[#2ea043] border border-[#3fb950]/50 text-white px-5 py-2 rounded-lg font-bold text-[13px] shadow-[0_0_15px_rgba(46,160,67,0.2)] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                   >
                     {isDownloadingAll ? <><Loader2 size={16} className="animate-spin"/> Syncing Core...</> : <><Download size={16}/> ดาวน์โหลดทั้งหมด (Download All)</>}
                   </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#8b949e] flex items-center gap-1.5"><Clock size={12}/> Window Schedule</label>
                      <input type="time" value={autoUpdateSchedule} onChange={e => setAutoUpdateSchedule(e.target.value)} className="bg-[#161b22] border border-[#30363d] text-white text-[12px] px-3 py-1.5 rounded focus:border-[#58a6ff] outline-none" disabled={!globalAutoUpdate}/>
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#8b949e] flex items-center gap-1.5"><Gauge size={12}/> Bandwidth Limit</label>
                      <select value={bandwidthLimit} onChange={e => setBandwidthLimit(Number(e.target.value))} className="bg-[#161b22] border border-[#30363d] text-white text-[12px] px-3 py-1.5 rounded focus:border-[#58a6ff] outline-none">
                         <option value={0}>Unlimited (Maximize P2P)</option>
                         <option value={100}>100 MB/s (Foreground)</option>
                         <option value={20}>20 MB/s (Background)</option>
                         <option value={5}>5 MB/s (Stealth Mode)</option>
                      </select>
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#8b949e] flex items-center gap-1.5"><Hash size={12}/> Weights Integrity</label>
                      <div className="flex items-center gap-2 mt-1">
                         <input type="checkbox" checked={checksumVerify} onChange={e => setChecksumVerify(e.target.checked)} className="accent-[#58a6ff] w-3 h-3"/>
                         <span className="text-[11px] text-gray-300">Strict SHA-256 Check</span>
                      </div>
                   </div>
                   <div className="flex flex-col gap-1.5 justify-center">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#8b949e] flex items-center gap-1.5"><Thermometer size={12} className={systemTemp > 65 ? 'text-red-500' : 'text-green-500'}/> Thermal Status</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#161b22] rounded overflow-hidden"><div className={`h-full ${systemTemp > 65 ? 'bg-red-500' : systemTemp > 55 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${Math.min(100, (systemTemp/90)*100)}%`}}></div></div>
                        <span className="text-[11px] font-mono text-white">{systemTemp.toFixed(1)}°C</span>
                      </div>
                   </div>
                </div>
                
                {isDownloadingAll && (
                  <div className="mt-4 flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-[#58a6ff]">
                       <span>ORCHESTRATING BATCH DOWNLOAD...</span>
                       <span>{globalDownloadProgress}%</span>
                    </div>
                    <div className="w-full h-1 bg-[#161b22] rounded overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-[#58a6ff] to-[#bc8cff]" style={{width: `${globalDownloadProgress}%`}}></div>
                    </div>
                  </div>
                )}
             </div>
           </div>
           
           <div className="flex flex-wrap xl:flex-col gap-3 text-xs justify-end items-end xl:w-48">
             <div className="bg-[#21262d] w-full border border-[#30363d] px-3 py-2 rounded-lg flex items-center gap-2">
                <Cpu size={16} className="text-[#bc8cff]" /> <span className="font-semibold text-white">WebGPU Ready</span>
             </div>
             <div className="bg-[#21262d] w-full border border-[#30363d] px-3 py-2 rounded-lg flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#3fb950]" /> <span className="font-semibold text-white">100% Isolated</span>
             </div>
             <div className="bg-[#21262d] w-full border border-[#30363d] px-3 py-2 rounded-lg flex items-center gap-2">
                <BrainCircuit size={16} className="text-[#f85149]" /> <span className="font-semibold text-white">No Telemetry</span>
             </div>
           </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full">
        <h2 className="text-[14px] font-bold text-[#8b949e] mb-6 uppercase tracking-widest flex items-center gap-2">
           <Zap className="text-[#e3b341]" size={16} /> แผนกปฏิบัติการ AI ออฟไลน์ (Neural Subsystems Directory)
        </h2>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {OFFLINE_AIs.map((ai) => {
            const isBaseDl = downloading === ai.id || isDownloadingAll;
            const baseProgress = isDownloadingAll ? globalDownloadProgress : (progress[ai.id] || 0);
            const baseStatus = isDownloadingAll && !status[ai.id]?.includes('Ready') ? 'Batch Orchestrating Download...' : (status[ai.id] || '');
            const isReady = baseStatus.includes('Ready');
            
            return (
              <div key={ai.id} className="bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff]/50 transition-all rounded-xl flex flex-col shadow-md group relative overflow-hidden">
                {/* Accent line top */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#58a6ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="p-6 flex gap-4 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-[#0d1117] flex items-center justify-center border border-[#30363d] shrink-0 shadow-inner group-hover:bg-[#21262d] transition-colors relative z-10">
                    {ai.icon}
                  </div>
                  <div className="flex-1 flex flex-col relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-1 gap-2">
                       <h3 className="text-white font-extrabold text-[16px] leading-tight flex items-center gap-2 flex-wrap">
                          {ai.name}
                          {globalAutoUpdate && <span title="Auto Update Managed" className="text-[#3fb950] animate-pulse shrink-0"><RadioReceiver size={14}/></span>}
                       </h3>
                       <span className="text-[11px] font-mono font-bold bg-[#0d1117] text-[#8b949e] px-2 py-1 rounded-md border border-[#30363d] shadow-inner shrink-0 self-start">
                          {ai.size}
                       </span>
                    </div>
                    <p className="text-[#58a6ff] text-[13px] font-semibold mb-2 leading-snug">{ai.desc}</p>
                    <p className="text-[#8b949e] text-[12px] leading-relaxed mb-4 flex-1">
                      {ai.details}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 mt-auto">
                       <div className="flex flex-wrap gap-1.5">
                         {ai.tags.map(tag => (
                            <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-[#bc8cff] bg-[#bc8cff]/10 px-2 py-[2px] rounded border border-[#bc8cff]/20">
                              {tag}
                            </span>
                         ))}
                       </div>
                       <div className="flex items-center gap-2 px-2.5 py-1.5 sm:px-2 sm:py-0.5 rounded bg-[#161b22] border border-[#30363d] self-start sm:self-auto">
                          <span className="text-[9px] text-[#8b949e] font-bold uppercase whitespace-nowrap">Automated Sync</span>
                          <input type="checkbox" checked={globalAutoUpdate} readOnly className="accent-[#3fb950] w-3.5 h-3.5 sm:w-2.5 sm:h-2.5 shrink-0"/>
                       </div>
                    </div>
                    
                    <div className="bg-[#0d1117] -mx-6 -mb-6 p-4 border-t border-[#30363d] flex flex-col gap-3">
                       {/* Base Status/Progress */}
                       {(isBaseDl || baseStatus) && !isReady && (
                          <div className="bg-[#161b22] px-3 py-2 rounded border border-[#30363d]">
                            <div className="flex justify-between text-[10px] text-[#8b949e] mb-1.5 font-mono">
                               <span className="truncate max-w-[250px]">{baseStatus}</span>
                               <span className="font-bold text-white">{baseProgress}%</span>
                            </div>
                            <div className="w-full bg-[#0d1117] rounded-full h-1.5 overflow-hidden shadow-inner border border-[#30363d]/50">
                               <div 
                                 className="bg-[#58a6ff] h-full transition-all duration-300 ease-out relative" 
                                 style={{ width: `${baseProgress}%` }}
                               >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full animate-[shimmer_1s_infinite]"></div>
                               </div>
                            </div>
                          </div>
                       )}

                       <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                          <div className="flex flex-col">
                             <span className="text-[10px] text-[#484f58] font-mono tracking-tight break-all" title="Core Engine ID">Engine: {ai.modelId}</span>
                             {isReady && <span className="text-[10px] font-bold text-[#3fb950] animate-pulse">● System Online</span>}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full xl:w-auto shrink-0">
                             {ai.updateAvailable && (
                               <button 
                                 onClick={() => handleDownloadExtra(ai.id, 'core_update', 'update')}
                                 disabled={downloadingExtras !== null}
                                 className="h-8 px-3 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-colors bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] disabled:opacity-50"
                                 title="Download System Updates"
                               >
                                 {downloadingExtras === `${ai.id}_core_update` ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} className="text-[#e3b341]" />}
                                 อัปเดตระบบ ({ai.updateSize})
                               </button>
                             )}
                             
                             <button
                               onClick={() => handleDownload(ai.id, ai.modelId)}
                               disabled={isBaseDl || isReady || (downloading !== null && !isBaseDl)}
                               className={`h-8 px-4 rounded-lg font-bold text-[12px] flex items-center gap-2 transition-all shadow-sm ${
                                 isReady ? 'bg-[#238636]/10 text-[#3fb950] border border-[#238636]/50 cursor-default shadow-none pointer-events-none' : 
                                 isBaseDl ? 'bg-[#1f6feb] text-white cursor-wait border border-[#388bfd]' :
                                 downloading ? 'bg-[#21262d] text-[#484f58] cursor-not-allowed border border-[#30363d]' :
                                 'bg-[#238636] hover:bg-[#2ea043] text-white border border-[#3fb950]/50 hover:shadow-[0_0_15px_rgba(46,160,67,0.4)]'
                               }`}
                             >
                               {isReady ? (
                                  <><ShieldCheck size={14} /> ติดตั้ง Core สำเร็จ</>
                               ) : isBaseDl ? (
                                  <><Loader2 size={14} className="animate-spin" /> Downloading Core...</>
                               ) : (
                                  <><Download size={14} /> โหลด Core Model</>
                               )}
                             </button>
                          </div>
                       </div>
                       
                       {/* Finetunes / Sub-learnings */}
                       {ai.finetunes && ai.finetunes.length > 0 && (
                          <div className="mt-2 flex flex-col gap-2 border-t border-[#30363d]/50 pt-3">
                             <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider flex items-center gap-1"><Database size={12}/> ส่วนต่อขยายการเรียนรู้ (Fine-Tuned Weights)</span>
                             <div className="flex flex-wrap gap-2">
                                {ai.finetunes.map(ft => {
                                   const ftKey = `${ai.id}_${ft.id}`;
                                   const isDlExtra = downloadingExtras === ftKey;
                                   const extraStatus = status[ftKey] || '';
                                   const isExtraReady = extraStatus.includes('Downloaded');
                                   
                                   return (
                                     <button 
                                       key={ft.id}
                                       onClick={() => handleDownloadExtra(ai.id, ft.id, 'finetune')}
                                       disabled={isExtraReady || downloadingExtras !== null || !isReady}
                                       title={!isReady ? "ต้องติดตั้ง Core Model ก่อนดาวน์โหลดส่วนเสริม" : `ดาวน์โหลด ${ft.name}`}
                                       className={`relative flex items-center justify-between gap-3 px-3 py-1.5 rounded-md border text-[11px] font-semibold transition-all group/btn ${
                                         !isReady ? 'bg-[#0d1117] border-[#30363d] text-[#484f58] cursor-not-allowed opacity-50' :
                                         isExtraReady ? 'bg-[#bc8cff]/10 border-[#bc8cff]/30 text-[#bc8cff] cursor-default' :
                                         isDlExtra ? 'bg-[#1f6feb]/20 border-[#58a6ff]/50 text-[#58a6ff] cursor-wait' :
                                         'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9] hover:border-[#8b949e]'
                                       }`}
                                     >
                                        <div className="flex flex-col items-start text-left z-10 w-full relative">
                                          <div className="flex items-center gap-1.5 w-full">
                                            {isExtraReady ? <ShieldCheck size={10} /> : isDlExtra ? <Loader2 size={10} className="animate-spin" /> : <Layers size={10} />}
                                            <span className="truncate max-w-[120px]">{ft.name}</span>
                                            <span className="ml-auto text-[9px] font-mono opacity-80">{ft.size}</span>
                                          </div>
                                          {isDlExtra && (
                                            <div className="w-full bg-[#0d1117] rounded-full h-[2px] mt-1 overflow-hidden">
                                              <div className="bg-[#58a6ff] h-full transition-all duration-300" style={{ width: `${progress[ftKey] || 0}%` }}></div>
                                            </div>
                                          )}
                                        </div>
                                     </button>
                                   );
                                })}
                             </div>
                          </div>
                       )}

                    </div>
                    
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

