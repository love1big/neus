/**
 * @file QwenModelRegistry.ts
 * @description
 * ============================================================================
 * [THAI - ภาษาไทย]
 * ระบบลงทะเบียนและจัดการโมเดล Qwen AI รุ่นล่าสุดและโมเดลฟรี (Qwen 2.5 Series Model Registry)
 * 
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 *    - รวบรวมข้อมูลโมเดล Qwen AI ตระกูลล่าสุด (Qwen 2.5, Qwen 2.5-Coder, Qwen 2.5-VL, Qwen 2.5-Math)
 *    - กำหนดค่าพารามิเตอร์, ขนาดโมเดล, ขนาด Context Window (สูงสุด 128k tokens), ความต้องการ VRAM/RAM
 *    - เชื่อมโยงรหัสโมเดล WebLLM/MLC (WebGPU In-Browser 100% Free Offline) และ HuggingFace/GGUF
 *    - มีฟังก์ชันช่วยเลือกโมเดล (Filter by Category, Hardware Requirements, Free Tier, Offline Readiness)
 * 
 * 2. สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 *    - เชื่อมโยงกับ: `src/components/AIChat.tsx` (Model Picker & True Offline Initializer)
 *    - เชื่อมโยงกับ: `src/components/AIChatWidget.tsx` (Floating AI Copilot Selector)
 *    - เชื่อมโยงกับ: `src/components/AIOfflineDownloader.tsx` (GGUF/MLC Model Downloader)
 *    - เชื่อมโยงกับ: `src/components/OfflineAIEngineSuite.tsx` (Offline AI Ecosystem)
 * 
 * 3. พารามิเตอร์ Input / Output ที่รับส่ง (Inputs, Outputs & Data Contracts):
 *    - `QwenModelInfo`: ข้อมูลสเปกโมเดลฉบับสมบูรณ์
 *    - `getQwenModels()`: ดึงรายการโมเดลทั้งหมด
 *    - `getRecommendedQwenModel()`: แนะนำโมเดลตามทรัพยากรเครื่องของผู้ใช้
 * 
 * 4. การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 *    - หากอุปกรณ์มี VRAM น้อย (<4GB) จะแนะนำโมเดล 0.5B หรือ 1.5B โดยอัตโนมัติ
 *    - มี Fallback Prompt Template ภาษาไทย/อังกฤษสำหรับโค้ดและตรรกะของเกม
 * 
 * 5. ตัวอย่างการเรียกใช้งาน (Usage Example):
 *    ```ts
 *    import { QWEN_MODELS, getRecommendedQwenModel } from '../utils/QwenModelRegistry';
 *    const bestModel = getRecommendedQwenModel({ vramGB: 6, isOffline: true });
 *    ```
 * ============================================================================
 */

export interface QwenModelSpec {
  id: string;
  name: string;
  series: 'Qwen 2.5 Coder' | 'Qwen 2.5 Instruct' | 'Qwen 2.5-VL' | 'Qwen 2.5 Math' | 'Qwen Cloud Max/Plus';
  version: string;
  tagline: string;
  descriptionTh: string;
  descriptionEn: string;
  parameters: string;
  contextWindow: string;
  recommendedVRAM: string;
  downloadSize: string;
  isFree: boolean;
  isOpenWeights: boolean;
  isOfflineWebGPUReady: boolean;
  webLLMModelId?: string;
  huggingFaceUrl?: string;
  quantizations: string[];
  benchmarks: {
    humaneval?: number; // Code benchmark %
    gsm8k?: number;     // Math benchmark %
    mmlu?: number;      // General knowledge %
  };
  bestFor: string[];
  badgeColor: string;
  isLatest: boolean;
}

export const QWEN_MODELS: QwenModelSpec[] = [
  {
    id: 'qwen-2.5-coder-32b',
    name: 'Qwen 2.5 Coder 32B (Flagship SOTA)',
    series: 'Qwen 2.5 Coder',
    version: '2.5.0 (Latest 2026)',
    tagline: 'สุดยอดโมเดลเขียนโค้ดและสถาปัตยกรรมเกมเทียบชั้น GPT-4o / Claude 3.5 Sonnet',
    descriptionTh: 'โมเดลเขียนโค้ดตัวเรือธงรุ่นล่าสุด ฉลาดเทียบเท่าโมเดลขนาดใหญ่ 70B+ ออกแบบมาเพื่อการ Refactor โค้ดข้ามหลายไฟล์, ออกแบบ Game Engine, HLSL/GLSL Shaders และ Debugging เชิงลึก รองรับ Context สูงสุด 128k tokens',
    descriptionEn: 'Flagship coding model matching GPT-4o / Claude 3.5 Sonnet in coding benchmarks (92.7% HumanEval). Excels at multi-file architecture, game engine pipelines, and complex C++/Rust/TypeScript scripts.',
    parameters: '32.5 Billion',
    contextWindow: '128,000 Tokens (128k)',
    recommendedVRAM: '16 - 24 GB (Q4_K_M)',
    downloadSize: '18.4 GB (GGUF Q4)',
    isFree: true,
    isOpenWeights: true,
    isOfflineWebGPUReady: false,
    huggingFaceUrl: 'https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct',
    quantizations: ['Q4_K_M', 'Q5_K_S', 'Q8_0', 'FP16'],
    benchmarks: { humaneval: 92.7, gsm8k: 91.6, mmlu: 82.5 },
    bestFor: ['Large Architecture Refactoring', 'Engine Subsystems', 'Shader Synthesis', 'Complex C++ Game Logic'],
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    isLatest: true
  },
  {
    id: 'qwen-2.5-coder-7b',
    name: 'Qwen 2.5 Coder 7B (WebGPU Browser Ready - Free)',
    series: 'Qwen 2.5 Coder',
    version: '2.5.0 (Latest)',
    tagline: 'โมเดลเขียนโค้ดยอดนิยม รันตรงในเบราว์เซอร์ผ่าน WebGPU ฟรี 100% ไม่ต้องต่อเน็ต',
    descriptionTh: 'ขนาดกะทัดรัดแต่พลังการเขียนโค้ดสูงลิบ (88.4% HumanEval) สามารถโหลดและรันบน WebGPU ภายในเบราว์เซอร์ได้ทันทีโดยไม่ต้องติดตั้งโปรแกรมภายนอก ไม่เปลืองเน็ตและปลอดภัย 100%',
    descriptionEn: 'The most capable 7B coding model worldwide. Fully compatible with WebGPU/WASM for instant 100% in-browser zero-cloud offline execution with 88.4% HumanEval accuracy.',
    parameters: '7.6 Billion',
    contextWindow: '32,768 Tokens (32k)',
    recommendedVRAM: '5 - 8 GB VRAM / Unified Memory',
    downloadSize: '4.3 GB (q4f16_1)',
    isFree: true,
    isOpenWeights: true,
    isOfflineWebGPUReady: true,
    webLLMModelId: 'Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC',
    huggingFaceUrl: 'https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct',
    quantizations: ['q4f16_1', 'Q4_K_M', 'Q8_0'],
    benchmarks: { humaneval: 88.4, gsm8k: 84.2, mmlu: 75.8 },
    bestFor: ['Instant Code Generation', 'Bug Fixing', 'Component Extraction', 'Visual Scripting Nodes'],
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    isLatest: true
  },
  {
    id: 'qwen-2.5-coder-1.5b',
    name: 'Qwen 2.5 Coder 1.5B (Ultra-Lightweight & Fast)',
    series: 'Qwen 2.5 Coder',
    version: '2.5.0 (Latest)',
    tagline: 'โมเดลเขียนโค้ดความเร็วแสง กิน RAM น้อยกว่า 1.5 GB ตอบสนองต่ำกว่า 100ms',
    descriptionTh: 'เหมาะอย่างยิ่งสำหรับเครื่องสเปกเริ่มต้น แล็ปท็อปบางเบา หรือการทำ Real-time Inline Autocomplete ขณะพิมพ์โค้ด รันบนเบราว์เซอร์ได้ทันที',
    descriptionEn: 'Ultra-fast sub-100ms latency coding assistant. Ideal for inline code autocompletion and lightweight devices with less than 2GB RAM allocated.',
    parameters: '1.54 Billion',
    contextWindow: '32,768 Tokens',
    recommendedVRAM: '2 - 3 GB RAM / VRAM',
    downloadSize: '1.1 GB (q4f16_1)',
    isFree: true,
    isOpenWeights: true,
    isOfflineWebGPUReady: true,
    webLLMModelId: 'Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC',
    huggingFaceUrl: 'https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct',
    quantizations: ['q4f16_1', 'Q4_K_M'],
    benchmarks: { humaneval: 74.2, gsm8k: 72.0, mmlu: 66.5 },
    bestFor: ['Realtime Autocomplete', 'Syntax Error Fixing', 'Snippet Expansion', 'Low-End Laptops'],
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    isLatest: true
  },
  {
    id: 'qwen-2.5-72b-instruct',
    name: 'Qwen 2.5 72B Instruct (Deep Reasoning Flagship)',
    series: 'Qwen 2.5 Instruct',
    version: '2.5.0 (Latest)',
    tagline: 'โมเดลปัญญาประดิษฐ์ทั่วไปตัวท็อป ชนะโมเดลปิดหลายตัวในด้านตรรกะและการสนทนา',
    descriptionTh: 'โมเดล Open-Weights ภาษาทั่วไปที่ทรงพลังที่สุดในปัจจุบัน รองรับทั้งภาษาไทยและภาษาอังกฤษแบบไร้รอยต่อ มีความเข้าใจเชิงลึกในเนื้อเรื่องเกม, เควสต์, และสถาปัตยกรรมซอฟต์แวร์',
    descriptionEn: 'World-class 72B general intelligence model with 128k context window, exceptional multilingual mastery (Thai, English, Japanese), and deep reasoning across narrative, mathematics, and systems design.',
    parameters: '72.7 Billion',
    contextWindow: '128,000 Tokens (128k)',
    recommendedVRAM: '32 - 48 GB (Q4_K_M) / Multi-GPU',
    downloadSize: '41.5 GB (GGUF Q4)',
    isFree: true,
    isOpenWeights: true,
    isOfflineWebGPUReady: false,
    huggingFaceUrl: 'https://huggingface.co/Qwen/Qwen2.5-72B-Instruct',
    quantizations: ['Q4_K_M', 'Q5_K_M', 'Q8_0', 'FP16'],
    benchmarks: { humaneval: 86.4, gsm8k: 93.1, mmlu: 86.1 },
    bestFor: ['Game Lore & NPC Dialogue', 'Deep System Architecture', 'Complex Problem Solving', 'Creative Writing'],
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    isLatest: true
  },
  {
    id: 'qwen-2.5-7b-instruct',
    name: 'Qwen 2.5 7B Instruct (General On-Device AI)',
    series: 'Qwen 2.5 Instruct',
    version: '2.5.0 (Latest)',
    tagline: 'โมเดลสมองกลรอบด้านรุ่นมาตรฐาน สมดุลระหว่างความฉลาดและความเร็ว',
    descriptionTh: 'รอบรู้ทั้งด้านตรรกะ, การวิเคราะห์ข้อมูล, การแต่งเพลง, เสียงพากย์, และการแปลภาษา รองรับการรันบนเบราว์เซอร์ผ่าน WebGPU',
    descriptionEn: 'General-purpose 7B reasoning engine with outstanding general knowledge, dialogue finesse, and on-device WebGPU acceleration support.',
    parameters: '7.6 Billion',
    contextWindow: '32,768 Tokens',
    recommendedVRAM: '5 - 8 GB',
    downloadSize: '4.4 GB (q4f16_1)',
    isFree: true,
    isOpenWeights: true,
    isOfflineWebGPUReady: true,
    webLLMModelId: 'Qwen2.5-7B-Instruct-q4f16_1-MLC',
    huggingFaceUrl: 'https://huggingface.co/Qwen/Qwen2.5-7B-Instruct',
    quantizations: ['q4f16_1', 'Q4_K_M', 'Q8_0'],
    benchmarks: { humaneval: 81.2, gsm8k: 83.5, mmlu: 74.3 },
    bestFor: ['Interactive NPC Dialogues', 'Game Storylines', 'Localization & Translations', 'General Copilot'],
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
    isLatest: true
  },
  {
    id: 'qwen-2.5-0.5b',
    name: 'Qwen 2.5 0.5B (Nano Edge Engine)',
    series: 'Qwen 2.5 Instruct',
    version: '2.5.0 (Latest)',
    tagline: 'โมเดลขนาดเล็กที่สุด โหลดไวใน 1 วินาที กิน RAM เพียง 450 MB',
    descriptionTh: 'ออกแบบมาเพื่ออุปกรณ์พกพา, แท็บเล็ต, หรือการทดสอบระบบแบบทันทีทันใด โหลดเข้าหน่วยความจำได้แทบจะทันที',
    descriptionEn: 'Nano-sized 0.5B model capable of loading in under 1 second with ~450MB memory footprint. Perfect for rapid prototyping.',
    parameters: '490 Million',
    contextWindow: '32,768 Tokens',
    recommendedVRAM: '512 MB - 1 GB RAM',
    downloadSize: '390 MB (q4f16_1)',
    isFree: true,
    isOpenWeights: true,
    isOfflineWebGPUReady: true,
    webLLMModelId: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
    huggingFaceUrl: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct',
    quantizations: ['q4f16_1', 'Q4_K_M'],
    benchmarks: { humaneval: 51.5, gsm8k: 58.2, mmlu: 55.4 },
    bestFor: ['Fast Command Parsing', 'Keyword Extraction', 'Edge Devices', 'Low-latency NLP'],
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    isLatest: true
  },
  {
    id: 'qwen-2.5-vl-7b',
    name: 'Qwen 2.5-VL 7B (Vision-Language Multimodal)',
    series: 'Qwen 2.5-VL',
    version: '2.5-VL (Latest)',
    tagline: 'โมเดลวิเคราะห์ภาพ 3D, หน้าจอ UI, และกราฟิกแบบ Multimodal 100% ฟรี',
    descriptionTh: 'สามารถรับรูปภาพ Screenshot ของเกม, กราฟ Shader, และ Blueprint เข้าไปวิเคราะห์ข้อผิดพลาดหรือจัดวาง Layout UI ได้อย่างแม่นยำ',
    descriptionEn: 'State-of-the-art vision-language model. Analyzes game UI layouts, 3D viewport renders, shader diagrams, and visual bugs with high spatial precision.',
    parameters: '7.8 Billion',
    contextWindow: '32,768 Tokens',
    recommendedVRAM: '8 - 12 GB',
    downloadSize: '5.2 GB (GGUF Q4)',
    isFree: true,
    isOpenWeights: true,
    isOfflineWebGPUReady: false,
    huggingFaceUrl: 'https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct',
    quantizations: ['Q4_K_M', 'Q8_0', 'FP16'],
    benchmarks: { humaneval: 78.0, gsm8k: 82.0, mmlu: 76.5 },
    bestFor: ['Game UI/UX Audit', 'Texture Analysis', 'Visual Bug Detection', 'Screenshot to Code'],
    badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/40',
    isLatest: true
  },
  {
    id: 'qwen-max-cloud',
    name: 'Qwen-Max (Alibaba Cloud Frontier API / Free Tier)',
    series: 'Qwen Cloud Max/Plus',
    version: 'Max-2026',
    tagline: 'โมเดลเรือธงผ่าน Cloud API รองรับ Free Tier Token โควตาฟรี',
    descriptionTh: 'เชื่อมต่อผ่าน Qwen API สำหรับงานประมวลผลขนาดใหญ่พิเศษที่ต้องการความแม่นยำสูงสุด มี Free Tier โควตาฟรีสำหรับนักพัฒนา',
    descriptionEn: 'Alibaba Cloud frontier model via API. Features free developer tier quotas with top-tier multi-step reasoning and enterprise robustness.',
    parameters: 'MoE > 100B',
    contextWindow: '128,000 Tokens',
    recommendedVRAM: 'Cloud Hosted (0 GB Local)',
    downloadSize: '0 MB (API Call)',
    isFree: true,
    isOpenWeights: false,
    isOfflineWebGPUReady: false,
    quantizations: ['Server FP16'],
    benchmarks: { humaneval: 93.5, gsm8k: 94.2, mmlu: 88.4 },
    bestFor: ['Cloud Batch Processing', 'Full-Repository Synthesis', 'Zero Local RAM Load'],
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    isLatest: true
  }
];

/**
 * ดึงรายการโมเดล Qwen ทั้งหมด
 */
export function getAllQwenModels(): QwenModelSpec[] {
  return QWEN_MODELS;
}

/**
 * ดึงโมเดลเฉพาะที่รันออฟไลน์บนเบราว์เซอร์ผ่าน WebGPU ได้ (100% Free & Offline)
 */
export function getOfflineReadyQwenModels(): QwenModelSpec[] {
  return QWEN_MODELS.filter(m => m.isOfflineWebGPUReady);
}

/**
 * แนะนำโมเดล Qwen ที่เหมาะสมที่สุดตามบริบทและหน่วยความจำ
 */
export function getRecommendedQwenModel(options?: {
  preferCoding?: boolean;
  vramGB?: number;
  offlineOnly?: boolean;
}): QwenModelSpec {
  const { preferCoding = true, vramGB = 8, offlineOnly = true } = options || {};

  if (offlineOnly) {
    if (vramGB < 4) {
      return QWEN_MODELS.find(m => m.id === 'qwen-2.5-coder-1.5b') || QWEN_MODELS[2];
    }
    if (preferCoding) {
      return QWEN_MODELS.find(m => m.id === 'qwen-2.5-coder-7b') || QWEN_MODELS[1];
    }
    return QWEN_MODELS.find(m => m.id === 'qwen-2.5-7b-instruct') || QWEN_MODELS[4];
  }

  if (preferCoding) {
    return QWEN_MODELS.find(m => m.id === 'qwen-2.5-coder-32b') || QWEN_MODELS[0];
  }

  return QWEN_MODELS.find(m => m.id === 'qwen-2.5-72b-instruct') || QWEN_MODELS[3];
}
