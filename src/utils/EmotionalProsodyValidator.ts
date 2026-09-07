/**
 * @file EmotionalProsodyValidator.ts
 * @description
 * ============================================================================
 * [THAI]
 * ระบบตรวจสอบความสอดคล้องของอารมณ์เสียงพากย์และน้ำเสียงการแสดง (Emotional Prosody & Acting Sentiment Validator)
 * ตรวจสอบทางคณิตศาสตร์สถิติและสัทศาสตร์ว่า เสียงที่พากย์ออกมามีอารมณ์ตรงตามบทภาพยนตร์/เกมจริงหรือไม่:
 *   1. ตรวจสอบความกว้างของคีย์เสียง (F0 Pitch Dynamic Range & Trajectory Variance)
 *   2. ตรวจสอบความเร็วและจังหวะของพยางค์ (Speech Tempo / Syllable Rate in Syllables/Sec)
 *   3. ตรวจสอบไดนามิกความดังและการเน้นคำ (Loudness RMS Dynamics & Stress Contrast)
 *   4. ตรวจสอบอัตราส่วนลมหายใจและความสั่นเครือ (Aspiration Breathiness & Micro-Tremor)
 *   5. เปรียบเทียบกับแม่แบบอารมณ์ 8 รูปแบบ (ธรรมดา, โกรธ/ดุดัน, ตื่นเต้น/ดีใจ, ดราม่า/จริงจัง, กระซิบ, เศร้า/สะอื้น, มหากาพย์/กึกก้อง, ตกใจ/หวาดกลัว)
 *   6. สรุปคะแนนความสมจริงของอารมณ์ (Emotional Congruence Score 0 - 100) พร้อมคำแนะนำปรับปรุง
 *
 * [ENGLISH]
 * Offline Emotional Congruence & Acting Sentiment Verification Engine for AI Voice Dubbing.
 * Validates acoustic emotional parameters against intended script dramaturgy:
 *   - Pitch Contour Variance (F0 Semitone Dynamics)
 *   - Speech Cadence & Syllabic Rate (Tempo in Syllables/Sec)
 *   - RMS Loudness Modulation & Emotional Stress Contrast
 *   - Glottal Aspiration Noise & Micro-Tremor Vibrato
 *   - Target Profiles for 8 Emotional States (Neutral, Angry, Joy/Excited, Dramatic, Whisper, Sad, Epic, Fearful)
 *   - Outputs Quantitative Emotional Congruence Score (0 - 100) with Acting Defect Diagnostics
 * ============================================================================
 *
 * 1. MODULE RESPONSIBILITY & PURPOSE:
 *    - Validates that voice delivery acoustically matches the target dramatic intention.
 *    - Pinpoints emotional defects (e.g. delivered 'angry' line with monotone pitch).
 *
 * 2. ARCHITECTURE & SYSTEM INTEGRATION:
 *    - Consumed by: VoiceQualityAssuranceEngine.ts, VoiceQualityAssuranceStudio.tsx.
 * ============================================================================
 */

export type TargetEmotionType =
  | 'neutral'
  | 'angry'
  | 'excited'
  | 'dramatic'
  | 'whisper'
  | 'sad'
  | 'epic'
  | 'fearful';

export interface EmotionProfileBenchmark {
  emotion: TargetEmotionType;
  nameThai: string;
  expectedPitchVarianceSt: number; // in semitones (e.g. Neutral: 2-4st, Angry: 8-14st)
  expectedSyllableRate: number; // syllables / sec (e.g. Neutral: 3.5 - 4.5, Excited: 5.5 - 7.0)
  expectedRmsDynamicRangeDb: number; // (e.g. Whisper: 6-10dB, Epic: 20-30dB)
  expectedBreathiness: number; // 0.0 - 1.0 (Whisper: 0.7 - 0.9, Angry: 0.1 - 0.2)
  expectedAttackTimeMs: number; // (e.g. Angry: 15-40ms, Sad: 120-250ms)
  descriptionThai: string;
}

export const EMOTION_BENCHMARKS: Record<TargetEmotionType, EmotionProfileBenchmark> = {
  neutral: {
    emotion: 'neutral',
    nameThai: 'ธรรมดา / เล่าเรื่อง (Neutral / Narrative)',
    expectedPitchVarianceSt: 3.5,
    expectedSyllableRate: 4.2,
    expectedRmsDynamicRangeDb: 14,
    expectedBreathiness: 0.2,
    expectedAttackTimeMs: 80,
    descriptionThai: 'น้ำเสียงเรียบนิ่ง สม่ำเสมอ ความเร็วปานกลาง ไม่แกว่งคีย์รุนแรง'
  },
  angry: {
    emotion: 'angry',
    nameThai: 'โกรธ / ดุดัน (Angry / Aggressive)',
    expectedPitchVarianceSt: 11.0,
    expectedSyllableRate: 5.8,
    expectedRmsDynamicRangeDb: 26,
    expectedBreathiness: 0.1,
    expectedAttackTimeMs: 25,
    descriptionThai: 'เสียงกระแทกคมชัด คีย์กระชากสูง ไดนามิกกว้าง ความเร็วสูง พลังเสียงอัดแน่น'
  },
  excited: {
    emotion: 'excited',
    nameThai: 'ตื่นเต้น / ร่าเริง (Excited / Joy)',
    expectedPitchVarianceSt: 9.5,
    expectedSyllableRate: 6.2,
    expectedRmsDynamicRangeDb: 22,
    expectedBreathiness: 0.25,
    expectedAttackTimeMs: 40,
    descriptionThai: 'คีย์เสียงยกสูง มีความสดใส จังหวะกระชั้นชิด ความแปรผันของคีย์สูง'
  },
  dramatic: {
    emotion: 'dramatic',
    nameThai: 'ดราม่า / จริงจัง (Dramatic / Tense)',
    expectedPitchVarianceSt: 6.5,
    expectedSyllableRate: 3.4,
    expectedRmsDynamicRangeDb: 20,
    expectedBreathiness: 0.35,
    expectedAttackTimeMs: 90,
    descriptionThai: 'มีจังหวะหยุดพักทรงพลัง (Dramatic Pauses) ทุ้มลึก เน้นคำสำคัญอย่างหนักแน่น'
  },
  whisper: {
    emotion: 'whisper',
    nameThai: 'กระซิบ / ลึกลับ (Whisper / Intimate)',
    expectedPitchVarianceSt: 1.8,
    expectedSyllableRate: 3.8,
    expectedRmsDynamicRangeDb: 8,
    expectedBreathiness: 0.85,
    expectedAttackTimeMs: 140,
    descriptionThai: 'คลื่นลมหายใจสูงมาก (Aspiration) ความดันสายเสียงต่ำ คีย์แทบไม่แกว่ง'
  },
  sad: {
    emotion: 'sad',
    nameThai: 'เศร้า / สะอื้น (Sad / Melancholy)',
    expectedPitchVarianceSt: 4.8,
    expectedSyllableRate: 2.8,
    expectedRmsDynamicRangeDb: 12,
    expectedBreathiness: 0.55,
    expectedAttackTimeMs: 160,
    descriptionThai: 'จังหวะพูดช้ามาก หางเสียงตกทอด มีการสั่นเครือของสายเสียง (Vocal Tremor)'
  },
  epic: {
    emotion: 'epic',
    nameThai: 'มหากาพย์ / กึกก้อง (Epic / Cinematic)',
    expectedPitchVarianceSt: 8.0,
    expectedSyllableRate: 3.6,
    expectedRmsDynamicRangeDb: 28,
    expectedBreathiness: 0.15,
    expectedAttackTimeMs: 50,
    descriptionThai: 'พลังเสียงกึกก้อง กว้างขวาง หนักแน่นสะกดผู้ฟัง เปล่งเสียงเต็มทรวงอก'
  },
  fearful: {
    emotion: 'fearful',
    nameThai: 'ตกใจ / หวาดกลัว (Fearful / Panicked)',
    expectedPitchVarianceSt: 12.5,
    expectedSyllableRate: 6.8,
    expectedRmsDynamicRangeDb: 24,
    expectedBreathiness: 0.6,
    expectedAttackTimeMs: 30,
    descriptionThai: 'คีย์สูงแกว่งกระตุก ลมหายใจถี่ จังหวะเร็วและขาดห้วง'
  }
};

export interface EmotionalProsodyEvaluation {
  targetEmotion: TargetEmotionType;
  congruenceScore: number; // 0 - 100
  measuredMetrics: {
    pitchVarianceSt: number;
    syllableRate: number;
    rmsDynamicRangeDb: number;
    breathiness: number;
    estimatedAttackTimeMs: number;
  };
  benchmark: EmotionProfileBenchmark;
  deviations: {
    pitchMatchPercent: number;
    tempoMatchPercent: number;
    dynamicsMatchPercent: number;
    breathinessMatchPercent: number;
  };
  actingCritiquesThai: string[];
  actingCritiquesEng: string[];
  remediationSuggestionsThai: string[];
}

export class EmotionalProsodyValidator {
  /**
   * Evaluates the prosodic parameters of an audio stream against an expected emotional archetype.
   */
  public static evaluateEmotionalCongruence(
    samples: Float32Array,
    sampleRate: number,
    targetEmotion: TargetEmotionType,
    syllableCount: number
  ): EmotionalProsodyEvaluation {
    const benchmark = EMOTION_BENCHMARKS[targetEmotion] || EMOTION_BENCHMARKS.neutral;
    const durationSec = samples.length / sampleRate || 1.0;

    // 1. Measure Pitch Variance (Simulation via Zero-Crossing Rate variation & Auto-Correlation)
    const pitchVarianceSt = this.estimatePitchVarianceSemitones(samples, sampleRate);

    // 2. Measure Syllable Rate
    const measuredSyllables = Math.max(1, syllableCount);
    const syllableRate = Math.round((measuredSyllables / durationSec) * 10) / 10;

    // 3. Measure RMS Dynamic Range
    const rmsDynamicRangeDb = this.estimateDynamicRangeDb(samples, sampleRate);

    // 4. Measure Breathiness (Spectral flatness in high frequency vs fundamental energy)
    const breathiness = this.estimateBreathinessRatio(samples, sampleRate);

    // 5. Estimate Attack Time
    const estimatedAttackTimeMs = this.estimateAttackTimeMs(samples, sampleRate);

    // 6. Compare with Benchmark Targets
    const pitchMatch = Math.max(
      0,
      100 - Math.abs(pitchVarianceSt - benchmark.expectedPitchVarianceSt) * 11
    );
    const tempoMatch = Math.max(
      0,
      100 - Math.abs(syllableRate - benchmark.expectedSyllableRate) * 18
    );
    const dynamicsMatch = Math.max(
      0,
      100 - Math.abs(rmsDynamicRangeDb - benchmark.expectedRmsDynamicRangeDb) * 4.5
    );
    const breathinessMatch = Math.max(
      0,
      100 - Math.abs(breathiness - benchmark.expectedBreathiness) * 120
    );

    // Weighted Overall Score
    const congruenceScore = Math.max(
      15,
      Math.min(
        100,
        Math.round(
          pitchMatch * 0.35 +
            tempoMatch * 0.25 +
            dynamicsMatch * 0.25 +
            breathinessMatch * 0.15
        )
      )
    );

    // 7. Generate Acting Critiques & Suggestions
    const critiquesThai: string[] = [];
    const critiquesEng: string[] = [];
    const suggestionsThai: string[] = [];

    // Pitch critique
    if (pitchVarianceSt < benchmark.expectedPitchVarianceSt * 0.65) {
      critiquesThai.push(
        `ความแปรผันของคีย์เสียงเรียบเกินไป (${pitchVarianceSt.toFixed(1)} st) สำหรับบท ${benchmark.nameThai}`
      );
      critiquesEng.push(
        `Pitch dynamic variance is too flat (${pitchVarianceSt.toFixed(1)} st) for ${targetEmotion} delivery.`
      );
      suggestionsThai.push('เพิ่มความลื่นไหลและจุดพีคของคีย์เสียง (F0 Modulation Depth +30%)');
    } else if (pitchVarianceSt > benchmark.expectedPitchVarianceSt * 1.5) {
      critiquesThai.push(
        `คีย์เสียงแกว่งสูงเกินไป (${pitchVarianceSt.toFixed(1)} st) ทำให้ฟังดูไม่เป็นธรรมชาติ`
      );
      critiquesEng.push(
        `Excessive pitch variance (${pitchVarianceSt.toFixed(1)} st) causes unnatural pitch leaps.`
      );
      suggestionsThai.push('ควบคุมเส้นทางเดินคีย์เสียงให้อยู่ในกรอบอารมณ์เป้าหมาย');
    }

    // Tempo critique
    if (syllableRate < benchmark.expectedSyllableRate * 0.7) {
      critiquesThai.push(
        `จังหวะการพูดช้าเกินไป (${syllableRate} พยางค์/วิ) เมื่อเทียบกับเกณฑ์ ${benchmark.expectedSyllableRate} พยางค์/วิ`
      );
      critiquesEng.push(`Delivery cadence is too slow (${syllableRate} syl/sec).`);
      suggestionsThai.push('เร่งความเร็วพากย์ให้กระชับขึ้น (Tempo +15-25%)');
    } else if (syllableRate > benchmark.expectedSyllableRate * 1.4) {
      critiquesThai.push(
        `การรัวคำเร็วเกินไป (${syllableRate} พยางค์/วิ) ทำให้ฟังเนื้อหาไม่ทัน`
      );
      critiquesEng.push(`Speech rate is overly rushed (${syllableRate} syl/sec).`);
      suggestionsThai.push('เว้นจังหวะหายใจและลดความเร็วคำพูด (Tempo -20%)');
    }

    // Breathiness critique
    if (targetEmotion === 'whisper' && breathiness < 0.5) {
      critiquesThai.push('บทกระซิบแต่มีเสียงสายเสียงแท้มากเกินไป ขาดลมหายใจลึกลับ');
      suggestionsThai.push('เพิ่ม Aspiration Breathiness และลดการสั่นของสายเสียงหลัก');
    } else if (targetEmotion === 'angry' && breathiness > 0.4) {
      critiquesThai.push('บทดุดันมีเสียงลมแทรกมากเกินไป ทำให้ขาดพลังความหนักแน่น');
      suggestionsThai.push('เพิ่มแรงดันสายเสียง Glottal Closure และตัดลมหายใจส่วนเกิน');
    }

    if (critiquesThai.length === 0) {
      critiquesThai.push('การแสดงออกทางอารมณ์และจังหวะพากย์สอดคล้องกับบทอย่างสมบูรณ์แบบ');
      critiquesEng.push('Prosodic parameters align with targeted emotion benchmark.');
    }

    return {
      targetEmotion,
      congruenceScore,
      measuredMetrics: {
        pitchVarianceSt: Math.round(pitchVarianceSt * 10) / 10,
        syllableRate,
        rmsDynamicRangeDb: Math.round(rmsDynamicRangeDb * 10) / 10,
        breathiness: Math.round(breathiness * 100) / 100,
        estimatedAttackTimeMs: Math.round(estimatedAttackTimeMs)
      },
      benchmark,
      deviations: {
        pitchMatchPercent: Math.round(pitchMatch),
        tempoMatchPercent: Math.round(tempoMatch),
        dynamicsMatchPercent: Math.round(dynamicsMatch),
        breathinessMatchPercent: Math.round(breathinessMatch)
      },
      actingCritiquesThai: critiquesThai,
      actingCritiquesEng: critiquesEng,
      remediationSuggestionsThai: suggestionsThai
    };
  }

  private static estimatePitchVarianceSemitones(samples: Float32Array, sampleRate: number): number {
    const frameSize = Math.floor(sampleRate * 0.04); // 40ms
    const numFrames = Math.floor(samples.length / frameSize);
    if (numFrames < 2) return 3.5;

    const detectedFrequencies: number[] = [];

    for (let f = 0; f < numFrames; f++) {
      const start = f * frameSize;
      let zeroCrossings = 0;
      let frameEnergy = 0;

      for (let i = 0; i < frameSize - 1; i++) {
        const s1 = samples[start + i];
        const s2 = samples[start + i + 1];
        frameEnergy += s1 * s1;
        if ((s1 >= 0 && s2 < 0) || (s1 < 0 && s2 >= 0)) {
          zeroCrossings++;
        }
      }

      const frameRms = Math.sqrt(frameEnergy / frameSize);
      if (frameRms > 0.03) {
        // Approximate fundamental frequency
        const approxFreq = (zeroCrossings * sampleRate) / (2 * frameSize);
        if (approxFreq >= 65 && approxFreq <= 600) {
          detectedFrequencies.push(approxFreq);
        }
      }
    }

    if (detectedFrequencies.length < 3) return 3.5;

    let minFreq = Infinity;
    let maxFreq = -Infinity;
    for (const freq of detectedFrequencies) {
      if (freq < minFreq) minFreq = freq;
      if (freq > maxFreq) maxFreq = freq;
    }

    if (minFreq <= 0 || maxFreq <= minFreq) return 3.5;

    // Convert frequency range ratio into semitones (12 * log2(max/min))
    const semitones = 12 * Math.log2(maxFreq / minFreq);
    return Math.min(24, Math.max(0.5, semitones));
  }

  private static estimateDynamicRangeDb(samples: Float32Array, sampleRate: number): number {
    const frameSize = Math.floor(sampleRate * 0.05); // 50ms
    const numFrames = Math.floor(samples.length / frameSize);
    if (numFrames < 2) return 14;

    const rmsList: number[] = [];
    for (let f = 0; f < numFrames; f++) {
      let sum = 0;
      const start = f * frameSize;
      for (let i = 0; i < frameSize; i++) {
        const s = samples[start + i];
        sum += s * s;
      }
      const r = Math.sqrt(sum / frameSize);
      if (r > 1e-4) rmsList.push(r);
    }

    if (rmsList.length === 0) return 14;
    rmsList.sort((a, b) => a - b);

    const p10 = rmsList[Math.floor(rmsList.length * 0.1)] || 1e-4;
    const p90 = rmsList[Math.floor(rmsList.length * 0.9)] || 1e-1;

    const db = 20 * Math.log10(Math.max(p90 / p10, 1.0));
    return Math.min(45, Math.max(4, db));
  }

  private static estimateBreathinessRatio(samples: Float32Array, sampleRate: number): number {
    // Measure ratio of high-frequency noisy energy (above 4kHz) to mid energy
    let highNoiseSum = 0;
    let totalSum = 0;
    let prev = 0;

    for (let i = 0; i < samples.length; i++) {
      const s = samples[i];
      const diff = s - prev;
      highNoiseSum += diff * diff;
      totalSum += s * s;
      prev = s;
    }

    const ratio = highNoiseSum / (totalSum * 2 || 1);
    return Math.min(1.0, Math.max(0.05, ratio));
  }

  private static estimateAttackTimeMs(samples: Float32Array, sampleRate: number): number {
    // Find how fast audio reaches 80% peak from silence
    let peak = 0;
    for (let i = 0; i < samples.length; i++) {
      const abs = Math.abs(samples[i]);
      if (abs > peak) peak = abs;
    }

    const threshold = peak * 0.8;
    for (let i = 0; i < samples.length; i++) {
      if (Math.abs(samples[i]) >= threshold) {
        return Math.min(500, (i / sampleRate) * 1000);
      }
    }
    return 80;
  }
}
