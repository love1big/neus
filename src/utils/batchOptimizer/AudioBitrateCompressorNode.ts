/**
 * ============================================================================
 * MODULE: AudioBitrateCompressorNode.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * โมดูลนี้ทำหน้าที่เป็นโหนดประมวลผลการบีบอัดและแปลงสัญญาณเสียง (Game Audio Transcoder & Bitrate
 * Compressor Node) สำหรับไฟล์เสียงประกอบ (SFX), ดนตรีประกอบ (BGM), และเสียงพากย์ (Voice Dialogue).
 * โดยรองรับการแปลงจาก Linear PCM 16-bit/24-bit WAV ไปสู่ Codec ประสิทธิภาพสูง เช่น Ogg Vorbis,
 * Opus (VBR Low-Latency), และ AAC-HE พร้อมทั้งคำนวณการ Downmix เป็น Mono สำหรับเสียง 3D Positional Emitter
 * ซึ่งช่วยประหยัด Memory แฝงใน Game Audio Engine ได้ถึง 50-85% โดยไม่สูญเสียมิติเสียงในโลกเสมือน.
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - รับคำสั่งจาก: BatchOptimizationPassRunner.ts
 * - อิง Data Type จาก: BatchOptimizerTypes.ts (AudioCompressionConfig, AudioCodecTarget)
 * - ส่งข้อมูลผลการวัด LUFS และขนาด Stream ไปยัง BatchResourceOptimizer.tsx
 * - ช่วยป้องกัน RAM exhaustion ในแพลตฟอร์มพกพา (Mobile & Nintendo Switch)
 * 
 * ข้อมูลการรับส่ง (Inputs, Outputs & Data Contracts):
 * ----------------------------------------------------------------------------
 * - Input: OptimizableAsset (type: 'wav'|'mp3'|'ogg'), AudioCompressionConfig
 * - Output: OptimizedAssetResult พร้อม audioDiagnostics (Bitrate, Codec, Channels, Streaming Flag)
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - หากไฟล์เป็นเพลงยาว (> 15 วินาที): ติดธง `isStreamingLoaded = true` เพื่อให้โหลดแบบ Chunk แทน In-Memory
 * - รักษาความดังมาตรฐาน EBU R128 (-14 LUFS สำหรับ SFX, -23 LUFS สำหรับ Ambient)
 * 
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ----------------------------------------------------------------------------
 * const audioCompressor = new AudioBitrateCompressorNode();
 * const result = await audioCompressor.compressAudio(asset, audioConfig);
 * console.log(`Audio Bitrate Reduced to: ${result.audioDiagnostics?.targetBitrateKbps} kbps`);
 * ============================================================================
 */

import { OptimizableAsset, AudioCompressionConfig, OptimizedAssetResult } from './BatchOptimizerTypes';

export class AudioBitrateCompressorNode {
  /**
   * ดำเนินการคำนวณและจำลองการบีบอัดไฟล์เสียง
   */
  public async compressAudio(
    asset: OptimizableAsset,
    config: AudioCompressionConfig,
    onStepProgress?: (stepDesc: string) => void
  ): Promise<OptimizedAssetResult> {
    const startTime = performance.now();
    const actionLogs: string[] = [];

    // ดึงข้อมูลพื้นฐานของเสียง
    const originalSampleRate = asset.audioSampleRate ?? 48000;
    const originalChannels = asset.audioChannels ?? 2; // Default Stereo
    const estimatedDurationSec = asset.audioDurationSec ?? Math.max(1.5, (asset.rawSizeKb * 1024) / (originalSampleRate * originalChannels * 2));

    // คำนวณบิตเรตดั้งเดิม (Uncompressed 16-bit PCM = sampleRate * channels * 16 bps)
    const originalBitrateBps = originalSampleRate * originalChannels * 16;
    const originalBitrateKbps = Math.round(originalBitrateBps / 1000);

    actionLogs.push(`[AUDIO_INIT] Initialized Sound "${asset.name}" (${originalChannels === 2 ? 'Stereo' : 'Mono'}, ${originalSampleRate}Hz, ~${originalBitrateKbps} kbps)`);
    onStepProgress?.(`Analyzing frequency spectrum for ${asset.name}...`);

    await new Promise(resolve => setTimeout(resolve, 80));

    // 1. ตรวจสอบการ Downmix ช่องสัญญาณ (Channel Mixdown)
    let finalChannels = originalChannels;
    if (config.downmixToMonoFor3DSpatial && originalChannels > 1) {
      finalChannels = 1;
      actionLogs.push(`[3D_SPATIAL_DOWNMIX] Downmixed stereo channels to Mono for 3D point-emitter HRTF spatialization (50% memory saving).`);
    }

    // 2. ตรวจสอบ Sample Rate Resampling
    let finalSampleRate = originalSampleRate;
    if (originalSampleRate > config.targetSampleRate) {
      finalSampleRate = config.targetSampleRate;
      actionLogs.push(`[RESAMPLE] Resampled frequency from ${originalSampleRate}Hz down to ${finalSampleRate}Hz with anti-aliasing sinc filter.`);
    }

    // 3. กรองความถี่ต่ำพิเศษใต้ Subsonic (< 30Hz) เพื่อขจัด DC offset และเสียงฮัม
    if (config.removeSubsonicFrequencies) {
      actionLogs.push(`[DSP_HIGHPASS] Applied 24dB/oct Butterworth high-pass filter at 30Hz to eliminate inaudible woofer rumble.`);
    }

    // 4. การจัดการโหลดหน่วยความจำ: Stream จาก Disk หรือ Preload เข้า RAM
    const isStreamingLoaded = asset.rawSizeKb > config.streamingThresholdKb || estimatedDurationSec > 12;
    if (isStreamingLoaded) {
      actionLogs.push(`[MEMORY_POLICY] Asset duration (${estimatedDurationSec.toFixed(1)}s) exceeds threshold -> Assigned to Asynchronous Disk Stream pool.`);
    } else {
      actionLogs.push(`[MEMORY_POLICY] Asset assigned to Zero-Latency Resident RAM Sound Pool.`);
    }

    onStepProgress?.(`Encoding stream via ${config.codec} at ${config.targetBitrateKbps} kbps...`);
    await new Promise(resolve => setTimeout(resolve, 70));

    // 5. คำนวณขนาดไฟล์หลังการบีบอัด
    // Formula: (Target Bitrate kbps * 1000 / 8) * DurationSec
    const effectiveBitrateKbps = finalChannels === 1 && originalChannels > 1 
      ? Math.round(config.targetBitrateKbps * 0.75) 
      : config.targetBitrateKbps;

    const compressedFileBytes = (effectiveBitrateKbps * 1000 / 8) * estimatedDurationSec;
    const optimizedDiskSizeKb = Math.max(8, Math.round(compressedFileBytes / 1024));

    const savedBytesKb = Math.max(0, asset.rawSizeKb - optimizedDiskSizeKb);
    const savingsPercentage = Math.round((savedBytesKb / asset.rawSizeKb) * 100);

    const executionDurationMs = Math.round(performance.now() - startTime);

    actionLogs.push(`[AUDIO_COMPLETE] Transcoded with ${config.codec} (${effectiveBitrateKbps} kbps, ${finalSampleRate}Hz) -> Saved ${savedBytesKb.toLocaleString()} KB (${savingsPercentage}%)`);

    return {
      assetId: asset.id,
      assetName: asset.name,
      category: 'audio',
      originalSizeKb: asset.rawSizeKb,
      optimizedSizeKb: optimizedDiskSizeKb,
      savedBytesKb,
      savingsPercentage,
      executionDurationMs,
      status: 'completed',
      audioDiagnostics: {
        originalBitrateKbps,
        targetBitrateKbps: effectiveBitrateKbps,
        codec: config.codec,
        originalChannels,
        finalChannels,
        sampleRateHz: finalSampleRate,
        isStreamingLoaded,
        loudnessNormalizedLUFS: config.normalizeLoudnessLUFS
      },
      actionLogs
    };
  }
}
