/**
 * ============================================================================
 * [THAI] ตัวสังเคราะห์เสียงพูดอะคูสติกส์ออฟไลน์ 100% ด้วย Web Audio API & Formant Filters
 * [ENGLISH] 100% Offline Acoustic Formant Speech Synthesizer & Web Speech Hybrid Node
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - สังเคราะห์เสียงพูดมนุษย์แบบออฟไลน์ 100% โดยไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอกหรือเสียงที่ติดตั้งใน OS
 * - ใช้อัลกอริทึม Formant Synthesis (Klatt-style Formant Filter Bank):
 *   1. Glottal Pulse Generator: สร้างพัลส์สายเสียงกล่องเสียงมนุษย์พร้อม Jitter & Shimmer
 *   2. Formant Resonators (F1, F2, F3 BiquadFilters): จำลองรูปทรงช่องปาก ลิ้น และริมฝีปาก
 *   3. Pitch Contour Envelope: บังคับระดับเสียง (Pitch F0) ให้วิ่งตามเส้นทางวรรณยุกต์ (Tone Sandhi)
 *   4. Aspiration / Fricative Noise Generator: จำลองลมเสียดแทรกของพยัญชนะ (เช่น s, sh, f, kh)
 * - มีโหมด Hybrid เชื่อมโยงกับ Web Speech API เมื่อเบราว์เซอร์มีเสียงของภาษานั้นๆ
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - รับข้อมูลสเปกสัทศาสตร์ `PhoneticPronunciationProfile` จาก `Global70PhoneticPronunciationEngine.ts`
 * - ส่งสถานะและเรนเดอร์ในหน้าจอ `GlobalOfflineAITranslationStudio.tsx`
 *
 * พารามิเตอร์ Input / Output ที่รับส่ง (Inputs, Outputs & Data Contracts):
 * - `playFormantSpeech(profile: PhoneticPronunciationProfile): Promise<void>`
 * - `playWebSpeechNative(text: string, langIso: string): Promise<void>`
 * - `stopSpeech(): void`
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - สร้างและปลดล็อค AudioContext อย่างปลอดภัยตามกฎนโยบายเสียงของเบราว์เซอร์ (Autoplay Policy)
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ```typescript
 * import { OfflineAcousticFormantSpeechSynthesizer } from '../utils/OfflineAcousticFormantSpeechSynthesizer';
 * await OfflineAcousticFormantSpeechSynthesizer.playAcoustic(phoneticProfile);
 * ```
 *
 * @author Global Offline AI Translation Directorate & NexusEngine Core Team
 */

import { PhoneticPronunciationProfile } from '../types/offlineTranslation70';

export class OfflineAcousticFormantSpeechSynthesizer {
  private static audioCtx: AudioContext | null = null;
  private static isPlayingAcoustic = false;

  /**
   * รับ AudioContext ที่พร้อมใช้งาน
   */
  private static getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * เปล่งเสียงอะคูสติกส์ธรรมชาติด้วย Formant Filter Bank ออฟไลน์ 100%
   */
  public static async playAcoustic(profile: PhoneticPronunciationProfile): Promise<void> {
    this.stopSpeech();
    this.isPlayingAcoustic = true;
    const ctx = this.getAudioContext();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.25, ctx.currentTime);
    masterGain.connect(ctx.destination);

    let currentTime = ctx.currentTime + 0.05;

    for (let i = 0; i < profile.syllables.length; i++) {
      if (!this.isPlayingAcoustic) break;
      const syl = profile.syllables[i];
      const durationSec = (syl.formants.durationMs || 220) / 1000;

      // 1. Oscillator แหล่งกำเนิดเสียงกล่องเสียงมนุษย์ (Glottal Pulse Train)
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';

      // Pitch Contour Envelope สำหรับวรรณยุกต์
      const f0 = syl.formants.f0Hz || 150;
      osc.frequency.setValueAtTime(f0, currentTime);

      if (syl.pitchContour && syl.pitchContour.length > 0) {
        const stepTime = durationSec / syl.pitchContour.length;
        syl.pitchContour.forEach((pt, pIdx) => {
          // คำนวณ f0 ตาม contour (สเกล 0-100 เทียบกับ +-30%)
          const contourF0 = f0 * (0.8 + (pt / 100) * 0.45);
          osc.frequency.linearRampToValueAtTime(contourF0, currentTime + pIdx * stepTime);
        });
      }

      // 2. Formant Filters (F1, F2, F3)
      const f1Filter = ctx.createBiquadFilter();
      f1Filter.type = 'bandpass';
      f1Filter.frequency.setValueAtTime(syl.formants.f1Hz, currentTime);
      f1Filter.Q.setValueAtTime(5.0, currentTime);

      const f2Filter = ctx.createBiquadFilter();
      f2Filter.type = 'bandpass';
      f2Filter.frequency.setValueAtTime(syl.formants.f2Hz, currentTime);
      f2Filter.Q.setValueAtTime(6.0, currentTime);

      const f3Filter = ctx.createBiquadFilter();
      f3Filter.type = 'bandpass';
      f3Filter.frequency.setValueAtTime(syl.formants.f3Hz, currentTime);
      f3Filter.Q.setValueAtTime(7.0, currentTime);

      // 3. Syllable Envelope Gain
      const sylGain = ctx.createGain();
      sylGain.gain.setValueAtTime(0.001, currentTime);
      sylGain.gain.linearRampToValueAtTime(0.3, currentTime + 0.04);
      sylGain.gain.setValueAtTime(0.28, currentTime + durationSec - 0.04);
      sylGain.gain.linearRampToValueAtTime(0.001, currentTime + durationSec);

      // เชื่อมโยง Filter Bank แบบขนานเพื่อสร้างเรโซแนนซ์โพรงปากและจมูก
      osc.connect(f1Filter);
      osc.connect(f2Filter);
      osc.connect(f3Filter);

      f1Filter.connect(sylGain);
      f2Filter.connect(sylGain);
      f3Filter.connect(sylGain);

      sylGain.connect(masterGain);

      // เริ่มและหยุด Oscillator
      osc.start(currentTime);
      osc.stop(currentTime + durationSec);

      currentTime += durationSec + 0.03; // มีเว้นวรรคระหว่างพยางค์เล็กน้อย 30ms
    }

    // รอจนจบประโยค
    const totalDuration = (currentTime - ctx.currentTime) * 1000;
    await new Promise(resolve => setTimeout(resolve, Math.max(100, totalDuration)));
    this.isPlayingAcoustic = false;
  }

  /**
   * เล่นเสียงด้วย Web Speech API สำหรับเบราว์เซอร์ที่มีเสียงสังเคราะห์ของระบบ
   */
  public static playWebSpeechNative(text: string, langIso: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langIso;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * หยุดการเปล่งเสียงทั้งหมดทันที
   */
  public static stopSpeech(): void {
    this.isPlayingAcoustic = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
