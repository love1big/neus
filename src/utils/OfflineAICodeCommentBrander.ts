/**
 * ============================================================================
 * MODULE: OfflineAICodeCommentBrander.ts
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * ระบบแทรกและรับประกันหมายเหตุประทับตราลิขสิทธิ์ประจำโปรแกรม OMNI Engine STUDIO
 * (Offline AI Code Comment & Branding Injector Node):
 *   - ตามข้อกำหนดของผู้ใช้:
 *     "ทำให้ตั้งค่าใน โปรแกรมได้ด้วย ตั้งค่า ตรง
 *      *by *ชื่อที่ตั้งค่า* โดยโปรแกรม OMNI Engine STUDIO*
 *      ชื่อที่ตั้งค่า พื้นฐาน คือ love1big สามารถแก้ไขตรงนี้ได้ บ่างทีอาจจะใส่ชื่อผู้พัฒนาเองได้ หรือชือทีมผู้พัฒนา"
 *   - จัดเก็บค่าชื่อผู้พัฒนา (Author Name) และชื่อโปรแกรม (Program Name) อย่างถาวรใน LocalStorage
 *   - มีระบบ Event Listener แจ้งเตือนทุก Component ในระบบแบบเรียลไทม์เมื่อมีการเปลี่ยนแปลงค่า
 *   - แทรกหมายเหตุต่อท้ายหรือนำหน้าทุกบรรทัดของโค้ดอย่างถูกต้องตาม Syntax ไวยากรณ์
 *     ของแต่ละภาษาโปรแกรมมิ่ง (TypeScript, JavaScript, Python, C++, C#, Rust, Lua, HTML, CSS, SQL, Shell, etc.)
 *   - ป้องกันการแทรกคอมเมนต์ซ้ำซ้อน (Idempotent Injection)
 * 
 * [ENGLISH - ภาษาอังกฤษ]
 * 2. Architecture & System Integration:
 * ----------------------------------------------------------------------------
 * - Consumed by:
 *     - `src/components/AIChat.tsx` (real-time Markdown code block branding & Editor apply)
 *     - `src/components/AICodeBrandingConfigModal.tsx` (interactive UI configuration)
 *     - `src/utils/OfflineCommandPromptEngine.ts` (CLI command `brand` & `brand set-author`)
 * 
 * 3. Data Contracts & Interfaces:
 * ----------------------------------------------------------------------------
 * - `getAuthorName()`: Returns active author name (default: "love1big")
 * - `setAuthorName(name)`: Updates author name and broadcasts to subscribers
 * - `getProgramName()`: Returns active program name (default: "OMNI Engine STUDIO")
 * - `setProgramName(name)`: Updates program name and broadcasts to subscribers
 * - `getBrandTag()`: Returns `*by ${author} โดยโปรแกรม ${program}*`
 * - `brandCode(rawCode, language, options)`: Returns `BrandedCodeResult`
 * ============================================================================
 */

import { 
  codeBrandingSyntaxSafetyEngine, 
  BrandingPlacementMode, 
  BrandedSafetyResult 
} from './CodeBrandingSyntaxSafetyEngine';
import {
  omniDigitalForensicWatermarkEngine,
  LOCKED_OMNI_ENGINE_NAME,
  ForensicInspectionResult,
  LegalEvidenceCertificate,
  OmniForensicPayload
} from './OmniDigitalForensicWatermarkEngine';

export type { BrandingPlacementMode, ForensicInspectionResult, LegalEvidenceCertificate, OmniForensicPayload };

export interface BrandingOptions {
  brandTag?: string;
  brandEmptyLines?: boolean;
  position?: 'end-of-line' | 'start-of-line';
  mode?: BrandingPlacementMode;
  injectInvisibleForensicWatermark?: boolean;
}

export interface BrandedCodeResult {
  originalCode: string;
  brandedCode: string;
  totalLines: number;
  brandedLines: number;
  skippedLines?: number;
  language: string;
  mode?: BrandingPlacementMode;
  hasInvisibleWatermark?: boolean;
}

export interface BrandingConfig {
  authorName: string;
  programName: string;
  isProgramLocked: boolean;
  brandTag: string;
  placementMode: BrandingPlacementMode;
  invisibleForensicEnabled: boolean;
}

export class OfflineAICodeCommentBrander {
  private static instance: OfflineAICodeCommentBrander | null = null;
  
  public static readonly DEFAULT_AUTHOR = "love1big";
  public static readonly DEFAULT_PROGRAM = LOCKED_OMNI_ENGINE_NAME; // "OMNI Engine STUDIO" (ล็อคถาวรตามกฎหมาย)
  public static readonly DEFAULT_PLACEMENT_MODE: BrandingPlacementMode = "brace_or_statement_end";
  
  private static readonly STORAGE_AUTHOR_KEY = "omni_branding_author_name";
  private static readonly STORAGE_PROGRAM_KEY = "omni_branding_program_name";
  private static readonly STORAGE_MODE_KEY = "omni_branding_placement_mode";
  private static readonly STORAGE_FORENSIC_KEY = "omni_branding_forensic_enabled";

  private listeners: Set<() => void> = new Set();
  private currentAuthor: string = OfflineAICodeCommentBrander.DEFAULT_AUTHOR;
  private readonly currentProgram: string = LOCKED_OMNI_ENGINE_NAME; // ล็อคถาวรไม่สามารถแก้ไขได้
  private currentPlacementMode: BrandingPlacementMode = OfflineAICodeCommentBrander.DEFAULT_PLACEMENT_MODE;
  private invisibleForensicEnabled: boolean = true;

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): OfflineAICodeCommentBrander {
    if (!OfflineAICodeCommentBrander.instance) {
      OfflineAICodeCommentBrander.instance = new OfflineAICodeCommentBrander();
    }
    return OfflineAICodeCommentBrander.instance;
  }

  /**
   * โหลดการตั้งค่าจาก LocalStorage
   */
  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedAuthor = localStorage.getItem(OfflineAICodeCommentBrander.STORAGE_AUTHOR_KEY);
      if (savedAuthor && savedAuthor.trim().length > 0) {
        this.currentAuthor = savedAuthor.trim();
      }

      // ตรวจสอบสถานะการเปิดใช้งานลายน้ำดิจิทัลล่องหน
      const savedForensic = localStorage.getItem(OfflineAICodeCommentBrander.STORAGE_FORENSIC_KEY);
      if (savedForensic !== null) {
        this.invisibleForensicEnabled = savedForensic === 'true';
      }

      const savedMode = localStorage.getItem(OfflineAICodeCommentBrander.STORAGE_MODE_KEY);
      if (savedMode && ['brace_only', 'brace_or_statement_end', 'all_safe_lines'].includes(savedMode)) {
        this.currentPlacementMode = savedMode as BrandingPlacementMode;
      }
    }
  }

  /**
   * ดึงโหมดการวางตำแหน่งคอมเมนต์ปัจจุบัน
   * - 'brace_or_statement_end': ใส่หลัง '}' หรือหลังจบ code บรรทัดนั้น (แนะนำ)
   * - 'brace_only': ใส่หลัง '}' เท่านั้น
   * - 'all_safe_lines': ใส่ทุกบรรทัดโค้ดที่ปลอดภัย
   */
  public getPlacementMode(): BrandingPlacementMode {
    return this.currentPlacementMode || OfflineAICodeCommentBrander.DEFAULT_PLACEMENT_MODE;
  }

  /**
   * กำหนดโหมดการวางตำแหน่งคอมเมนต์
   */
  public setPlacementMode(mode: BrandingPlacementMode): void {
    if (['brace_only', 'brace_or_statement_end', 'all_safe_lines'].includes(mode)) {
      this.currentPlacementMode = mode;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(OfflineAICodeCommentBrander.STORAGE_MODE_KEY, mode);
      }
      this.notifyListeners();
    }
  }

  /**
   * ดึงชื่อผู้พัฒนา / ทีมผู้พัฒนาปัจจุบัน (ค่าเริ่มต้น: love1big)
   */
  public getAuthorName(): string {
    return this.currentAuthor || OfflineAICodeCommentBrander.DEFAULT_AUTHOR;
  }

  /**
   * กำหนดและบันทึกชื่อผู้พัฒนา / ทีมผู้พัฒนา
   */
  public setAuthorName(name: string): void {
    const trimmed = (name || '').trim();
    this.currentAuthor = trimmed.length > 0 ? trimmed : OfflineAICodeCommentBrander.DEFAULT_AUTHOR;
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(OfflineAICodeCommentBrander.STORAGE_AUTHOR_KEY, this.currentAuthor);
    }
    this.notifyListeners();
  }

  /**
   * ดึงชื่อโปรแกรมต้นกำเนิด (ล็อคถาวร: OMNI Engine STUDIO)
   * ไม่สามารถแก้ไขได้ เพื่อการันตีต้นกำเนิดของเครื่องยนต์และสิทธิทางกฎหมายสากล
   */
  public getProgramName(): string {
    return LOCKED_OMNI_ENGINE_NAME;
  }

  /**
   * ตรวจสอบว่าชื่อโปรแกรมถูกล็อคตามข้อกำหนดทางกฎหมายหรือไม่
   */
  public isProgramLocked(): boolean {
    return true;
  }

  /**
   * พยายามกำหนดชื่อโปรแกรม (ล็อคถาวรเป็น OMNI Engine STUDIO เสมอ)
   */
  public setProgramName(_program: string): void {
    // ไม่อนุญาตให้แก้ไขตามคำสั่งของผู้ใช้ เพื่อรักษาการตรวจสอบต้นกำเนิดตามกฎหมาย
    this.notifyListeners();
  }

  /**
   * ดึงสถานะการฝังลายน้ำนิติวิทยาศาสตร์ล่องหน (Invisible Forensic Watermark)
   */
  public getInvisibleForensicEnabled(): boolean {
    return this.invisibleForensicEnabled;
  }

  /**
   * สลับเปิด/ปิดการฝังลายน้ำนิติวิทยาศาสตร์ล่องหน
   */
  public setInvisibleForensicEnabled(enabled: boolean): void {
    this.invisibleForensicEnabled = enabled;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(OfflineAICodeCommentBrander.STORAGE_FORENSIC_KEY, enabled ? 'true' : 'false');
    }
    this.notifyListeners();
  }

  /**
   * สร้างแท็กตราประทับลิขสิทธิ์สมบูรณ์ตามรูปแบบ:
   * *by [ชื่อที่ตั้งค่า] โดยโปรแกรม OMNI Engine STUDIO*
   */
  public getBrandTag(customAuthor?: string, _customProgram?: string): string {
    const author = (customAuthor !== undefined ? customAuthor.trim() : this.getAuthorName()) || OfflineAICodeCommentBrander.DEFAULT_AUTHOR;
    return `*by ${author} โดยโปรแกรม ${LOCKED_OMNI_ENGINE_NAME}*`;
  }

  /**
   * ดึงข้อมูลการตั้งค่าทั้งหมด
   */
  public getConfig(): BrandingConfig {
    return {
      authorName: this.getAuthorName(),
      programName: LOCKED_OMNI_ENGINE_NAME,
      isProgramLocked: true,
      brandTag: this.getBrandTag(),
      placementMode: this.getPlacementMode(),
      invisibleForensicEnabled: this.getInvisibleForensicEnabled()
    };
  }

  /**
   * คืนค่าการตั้งค่ากลับเป็นค่าตั้งต้นทั้งหมด (love1big & OMNI Engine STUDIO & brace_or_statement_end)
   */
  public resetToDefaults(): void {
    this.setAuthorName(OfflineAICodeCommentBrander.DEFAULT_AUTHOR);
    this.setPlacementMode(OfflineAICodeCommentBrander.DEFAULT_PLACEMENT_MODE);
    this.setInvisibleForensicEnabled(true);
  }

  /**
   * สแกน ตรวจสอบ และพิสูจน์หลักฐานดิจิทัลว่าไฟล์หรือโค้ดนี้เขียนจาก OMNI Engine STUDIO จริงหรือไม่
   */
  public inspectForensicProvenance(rawCode: string): ForensicInspectionResult {
    return omniDigitalForensicWatermarkEngine.inspectForensicProvenance(rawCode);
  }

  /**
   * ออกใบรับรองหลักฐานดิจิทัลทางกฎหมายอย่างเป็นทางการ (Legal Evidence Certificate)
   */
  public generateLegalCertificate(inspection: ForensicInspectionResult): LegalEvidenceCertificate {
    return omniDigitalForensicWatermarkEngine.generateLegalCertificate(inspection);
  }

  /**
   * ระบบติดตามการเปลี่ยนแปลง (Subscriber / Observer Pattern)
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('[OfflineAICodeCommentBrander] Listener error:', err);
      }
    });
  }

  /**
   * คืนค่าสัญลักษณ์คอมเมนต์ที่ถูกต้องตามภาษาโปรแกรมมิ่ง
   */
  public getCommentSyntax(language: string = 'typescript'): { linePrefix: string; isBlock?: boolean; blockOpen?: string; blockClose?: string } {
    return codeBrandingSyntaxSafetyEngine.getCommentSyntax(language);
  }

  /**
   * แทรกหมายเหตุแบรนด์ตามรูปแบบ *by [ชื่อที่ตั้งค่า] โดยโปรแกรม OMNI Engine STUDIO*
   * พร้อมทั้งฝังลายน้ำดิจิทัลล่องหนทางนิติวิทยาศาสตร์ (Zero-Width Steganography) หลังบ้าน
   */
  public brandCode(
    rawCode: string,
    language: string = 'typescript',
    options?: BrandingOptions
  ): BrandedCodeResult {
    if (!rawCode) {
      return {
        originalCode: '',
        brandedCode: '',
        totalLines: 0,
        brandedLines: 0,
        skippedLines: 0,
        language,
        mode: options?.mode || this.getPlacementMode(),
        hasInvisibleWatermark: false
      };
    }

    const brandTag = options?.brandTag || this.getBrandTag();
    const mode = options?.mode || this.getPlacementMode();
    const brandEmptyLines = options?.brandEmptyLines ?? false;
    const shouldInjectInvisible = options?.injectInvisibleForensicWatermark ?? this.invisibleForensicEnabled;

    const safetyResult = codeBrandingSyntaxSafetyEngine.processCode(rawCode, language, {
      brandTag,
      mode,
      brandEmptyLines
    });

    let finalCode = safetyResult.brandedCode;
    let hasInvisible = false;

    // ฝังลายน้ำดิจิทัลแบบล่องหน (Invisible Steganographic Watermark)
    if (shouldInjectInvisible) {
      const author = this.getAuthorName();
      const injected = omniDigitalForensicWatermarkEngine.injectInvisibleWatermark(finalCode, author);
      finalCode = injected.watermarkedContent;
      hasInvisible = true;
    }

    return {
      originalCode: safetyResult.originalCode,
      brandedCode: finalCode,
      totalLines: safetyResult.totalLines,
      brandedLines: safetyResult.brandedLines,
      skippedLines: safetyResult.skippedLines,
      language: safetyResult.language,
      mode: safetyResult.mode,
      hasInvisibleWatermark: hasInvisible
    };
  }

  /**
   * สแกนข้อความ Markdown ที่ AI สร้างขึ้น และแทรกหมายเหตุลงในทุกบล็อกโค้ด (```lang ... ```)
   */
  public brandMarkdownCodeBlocks(markdownText: string): string {
    if (!markdownText || !markdownText.includes('```')) {
      return markdownText;
    }

    // Regex จับบล็อกโค้ดใน Markdown: ```language\n...content...\n```
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

    return markdownText.replace(codeBlockRegex, (match, lang, codeContent) => {
      const detectedLang = lang || 'typescript';
      const branded = this.brandCode(codeContent, detectedLang, { brandEmptyLines: false });
      return `\`\`\`${detectedLang}\n${branded.brandedCode}\n\`\`\``;
    });
  }
}

export const offlineAICodeCommentBrander = OfflineAICodeCommentBrander.getInstance();
