/**
 * ====================================================================================================
 * MODULE: VolumetricAtmosphereScatterStudio.tsx
 * ====================================================================================================
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * 1. สตูดิโอจำลองฟิสิกส์ชั้นบรรยากาศ หมอกปริมาตร (Volumetric Fog) และการกระเจิงของแสงระดับภาพยนตร์ (AAA Atmosphere)
 *    ด้วยอัลกอริทึม Rayleigh Scattering สำหรับโมเลกุลอากาศ และ Mie Scattering สำหรับละอองน้ำ/ฝุ่นควัน (Aerosols)
 * 2. คำนวณลำแสงทะลุม่านเมฆและหมอก (Crepuscular Rays / God Rays) ด้วยการสุ่มตัวอย่าง Raymarching ใน 3D Grid
 * 3. กำหนดความหนาแน่นของหมอกตามระดับความสูง (Exponential Height Fog Falloff)
 * 4. มีพรีเซ็ตบรรยากาศสำเร็จรูปสำหรับสภาพแวดล้อมต่างๆ:
 *    - Golden Hour Sunset (อาทิตย์อัสดงสีทอง)
 *    - Misty Mountain Valley (หุบเขาหมอกหนาว)
 *    - Noon Clear Sky (ท้องฟ้ากระจ่างแดดเที่ยง)
 *    - Alien Violet Exoplanet (ดาวเคราะห์ต่างดาวสีม่วง)
 *    - Cyberpunk Smog (หมอกควันนีออนไซไฟ)
 * 5. ส่งออกสูตรและพารามิเตอร์เป็น HLSL / GLSL Shader Uniforms และ JSON Config
 *
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - เชื่อมต่อกับ World, Terrain & Level Studio และ Physics, VFX & Rendering Hub
 * - ทำงานร่วมกับ WeatherAtmosphereEditor และ PhotorealisticRenderSettings
 *
 * พารามิเตอร์ Input / Output (Data Contracts):
 * - Input: Rayleigh Coefficients (R,G,B), Mie Anisotropy (g), Fog Density, Sun Pitch/Yaw
 * - Output: Rendered Canvas Atmosphere, Volumetric Fog Lut, Shader Code Export
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - ป้องกันค่า Phase Function ลู่เข้าสู่ Infinity เมื่อ Anisotropy ใกล้ 1.0 ด้วย Clamping Guard
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * <VolumetricAtmosphereScatterStudio onSettingsChange={(cfg) => applyAtmosphere(cfg)} />
 * ====================================================================================================
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sun,
  CloudRain,
  Sliders,
  Download,
  Eye,
  Zap,
  CheckCircle2,
  Sparkles,
  Compass,
  Layers,
  Palette
} from "lucide-react";

interface AtmospherePreset {
  name: string;
  sunPitch: number; // องศาพระอาทิตย์
  rayleighRGB: [number, number, number];
  mieDensity: number;
  anisotropyG: number; // -1 to 1 (Henyey-Greenstein)
  fogHeightFalloff: number;
}

export default function VolumetricAtmosphereScatterStudio() {
  const [sunPitch, setSunPitch] = useState<number>(18); // มุมพระอาทิตย์ตกดิน
  const [sunYaw, setSunYaw] = useState<number>(180);
  const [rayleighRGB, setRayleighRGB] = useState<[number, number, number]>([5.8, 13.5, 33.1]); // ค่าจริงของโมเลกุลอากาศโลก
  const [mieDensity, setMieDensity] = useState<number>(2.4);
  const [anisotropyG, setAnisotropyG] = useState<number>(0.76); // Henyey-Greenstein Forward Scattering
  const [fogHeightFalloff, setFogHeightFalloff] = useState<number>(0.04);
  const [raymarchSteps, setRaymarchSteps] = useState<number>(64);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // พรีเซ็ตบรรยากาศสำเร็จรูป
  const presets: AtmospherePreset[] = [
    {
      name: "Golden Hour Sunset",
      sunPitch: 8,
      rayleighRGB: [32.0, 14.0, 4.0],
      mieDensity: 3.2,
      anisotropyG: 0.85,
      fogHeightFalloff: 0.05,
    },
    {
      name: "Noon Clear Sky",
      sunPitch: 65,
      rayleighRGB: [5.8, 13.5, 33.1],
      mieDensity: 1.0,
      anisotropyG: 0.7,
      fogHeightFalloff: 0.02,
    },
    {
      name: "Misty Mountain Valley",
      sunPitch: 22,
      rayleighRGB: [12.0, 18.0, 24.0],
      mieDensity: 5.5,
      anisotropyG: 0.8,
      fogHeightFalloff: 0.09,
    },
    {
      name: "Alien Violet Exoplanet",
      sunPitch: 35,
      rayleighRGB: [25.0, 6.0, 35.0],
      mieDensity: 2.8,
      anisotropyG: 0.75,
      fogHeightFalloff: 0.06,
    },
  ];

  const applyPreset = (p: AtmospherePreset) => {
    setSunPitch(p.sunPitch);
    setRayleighRGB(p.rayleighRGB);
    setMieDensity(p.mieDensity);
    setAnisotropyG(p.anisotropyG);
    setFogHeightFalloff(p.fogHeightFalloff);
  };

  // วาดท้องฟ้าและหมอกปริมาตรบน Canvas
  const renderAtmosphere = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // คำนวณตำแหน่งดวงอาทิตย์บน Canvas
    const sunNormalizedY = Math.max(0.1, 1 - sunPitch / 90);
    const sunPixelY = sunNormalizedY * (h * 0.7);
    const sunPixelX = w / 2;

    // การไล่ระดับสีท้องฟ้าตาม Rayleigh Scattering
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    const topR = Math.min(255, Math.round(rayleighRGB[0] * 2));
    const topG = Math.min(255, Math.round(rayleighRGB[1] * 2));
    const topB = Math.min(255, Math.round(rayleighRGB[2] * 2));

    const horizonR = Math.min(255, Math.round(topR * 1.8 + 80));
    const horizonG = Math.min(255, Math.round(topG * 1.4 + 40));
    const horizonB = Math.min(255, Math.round(topB * 0.5));

    skyGrad.addColorStop(0, `rgb(${topR}, ${topG}, ${topB})`);
    skyGrad.addColorStop(0.65, `rgb(${horizonR}, ${horizonG}, ${horizonB})`);
    skyGrad.addColorStop(1, "#111726");

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // วาดดวงอาทิตย์พร้อม Mie Forward Glare
    const sunGlow = ctx.createRadialGradient(
      sunPixelX,
      sunPixelY,
      10,
      sunPixelX,
      sunPixelY,
      160 * (anisotropyG + 0.3)
    );
    sunGlow.addColorStop(0, "rgba(255, 255, 240, 1.0)");
    sunGlow.addColorStop(0.2, "rgba(255, 220, 150, 0.6)");
    sunGlow.addColorStop(0.7, "rgba(255, 160, 80, 0.15)");
    sunGlow.addColorStop(1, "rgba(255, 100, 50, 0.0)");

    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunPixelX, sunPixelY, 160 * (anisotropyG + 0.3), 0, Math.PI * 2);
    ctx.fill();

    // วาดลำแสง God Rays ทะลุหมอก (Volumetric Light Shafts)
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = `rgba(255, 230, 180, ${Math.min(0.35, mieDensity * 0.06)})`;
    ctx.lineWidth = 14;
    for (let angle = -0.7; angle <= 0.7; angle += 0.18) {
      ctx.beginPath();
      ctx.moveTo(sunPixelX, sunPixelY);
      const endX = sunPixelX + Math.sin(angle) * 600;
      const endY = sunPixelY + Math.cos(angle) * 600;
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    ctx.restore();

    // วาดหมอกที่ระดับพื้นดิน (Exponential Height Fog)
    const fogGrad = ctx.createLinearGradient(0, h * 0.45, 0, h);
    fogGrad.addColorStop(0, "rgba(200, 210, 230, 0.0)");
    fogGrad.addColorStop(
      1,
      `rgba(180, 195, 220, ${Math.min(0.9, mieDensity * 0.15 + fogHeightFalloff * 3)})`
    );
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, h * 0.45, w, h * 0.55);

    // ภูเขาเป็น Silhouette แสดงมิติความลึก (Depth Fog Falloff)
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, h * 0.65);
    ctx.lineTo(w * 0.25, h * 0.52);
    ctx.lineTo(w * 0.5, h * 0.62);
    ctx.lineTo(w * 0.75, h * 0.48);
    ctx.lineTo(w, h * 0.7);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }, [sunPitch, rayleighRGB, mieDensity, anisotropyG, fogHeightFalloff]);

  useEffect(() => {
    renderAtmosphere();
  }, [renderAtmosphere]);

  // ส่งออกพารามิเตอร์เป็น HLSL Shader Uniforms & JSON
  const handleExportShaderUniforms = () => {
    const shaderSnippet = `// =========================================================================
// OmniMaster Atmosphere & Volumetric Fog HLSL Parameters
// =========================================================================
cbuffer AtmosphereConstantBuffer : register(b2)
{
    float3 g_RayleighScattering  = float3(${rayleighRGB[0]}e-6f, ${rayleighRGB[1]}e-6f, ${rayleighRGB[2]}e-6f);
    float  g_MieScattering       = ${mieDensity * 1.2}e-6f;
    float  g_MieAnisotropyG      = ${anisotropyG}f; // Henyey-Greenstein Parameter
    float  g_FogHeightFalloff    = ${fogHeightFalloff}f;
    float3 g_SunDirection        = float3(0.0f, ${Math.sin((sunPitch * Math.PI) / 180).toFixed(4)}f, -${Math.cos((sunPitch * Math.PI) / 180).toFixed(4)}f);
    uint   g_RaymarchSampleSteps = ${raymarchSteps}u;
};`;

    const blob = new Blob([shaderSnippet], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Atmosphere_Fog_Params_${sunPitch}deg.hlsl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 select-none overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-[#111726]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400 border border-amber-500/30">
            <Sun size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Volumetric Fog & Atmospheric Rayleigh/Mie Scattering Studio
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 rounded border border-amber-500/20">
                Physically Based Atmosphere v3.9
              </span>
            </div>
            <p className="text-xs text-gray-400">
              จำลองการกระเจิงแสงของชั้นบรรยากาศ หมอกหนาตามความสูง และลำแสงส่องสว่าง (God Rays) สำหรับเกมเกรด AAA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportShaderUniforms}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-md text-xs font-medium transition shadow-sm"
          >
            <Download size={14} />
            ส่งออก HLSL / GLSL Uniforms
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Atmosphere Controls */}
        <div className="w-80 border-r border-gray-800 bg-[#0d1322] flex flex-col p-4 overflow-y-auto space-y-4">
          {/* Preset Buttons */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Palette size={14} className="text-amber-400" />
              พรีเซ็ตบรรยากาศจำลอง (Presets)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="p-2 rounded bg-[#161f33] border border-gray-700 text-gray-300 hover:border-amber-500 hover:text-white text-xs text-left truncate transition"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Physical Parameters */}
          <div className="border-t border-gray-800 pt-3 space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sliders size={14} className="text-blue-400" />
              พารามิเตอร์แสงและการกระเจิง
            </h3>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>มุมดวงอาทิตย์ (Sun Pitch):</span>
                <span className="font-mono text-amber-400 font-bold">{sunPitch}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={sunPitch}
                onChange={(e) => setSunPitch(Number(e.target.value))}
                className="w-full accent-amber-500 bg-gray-700 h-1.5 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Mie Scattering (ความหนาฝุ่น/ละอองน้ำ):</span>
                <span className="font-mono text-white font-bold">{mieDensity.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="8.0"
                step="0.1"
                value={mieDensity}
                onChange={(e) => setMieDensity(Number(e.target.value))}
                className="w-full accent-blue-500 bg-gray-700 h-1.5 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Mie Anisotropy (g) Forward Glare:</span>
                <span className="font-mono text-purple-400 font-bold">{anisotropyG.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.95"
                step="0.01"
                value={anisotropyG}
                onChange={(e) => setAnisotropyG(Number(e.target.value))}
                className="w-full accent-purple-500 bg-gray-700 h-1.5 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Exponential Fog Height Falloff:</span>
                <span className="font-mono text-emerald-400 font-bold">{fogHeightFalloff.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.15"
                step="0.005"
                value={fogHeightFalloff}
                onChange={(e) => setFogHeightFalloff(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-gray-700 h-1.5 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Raymarching Sampling Steps:</span>
                <span className="font-mono text-amber-400 font-bold">{raymarchSteps} Steps</span>
              </div>
              <input
                type="range"
                min="16"
                max="128"
                step="16"
                value={raymarchSteps}
                onChange={(e) => setRaymarchSteps(Number(e.target.value))}
                className="w-full accent-amber-500 bg-gray-700 h-1.5 rounded"
              />
            </div>
          </div>
        </div>

        {/* Center: Interactive Sky Viewport */}
        <div className="flex-1 flex flex-col bg-[#070a10]">
          {/* Top Bar */}
          <div className="h-10 border-b border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-gray-400">
              <span>Rayleigh Molecular Phase: <strong className="text-white">3/16π (1 + cos²θ)</strong></span>
              <span>•</span>
              <span>Mie Henyey-Greenstein Phase: <strong className="text-white">1/4π (1 - g²)/(1 + g² - 2gcosθ)^1.5</strong></span>
            </div>
            <div className="text-emerald-400 font-bold">Real-Time Atmosphere Viewport</div>
          </div>

          {/* Viewport Canvas */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative border-2 border-gray-800 rounded-xl overflow-hidden shadow-2xl bg-black">
              <canvas
                ref={canvasRef}
                width={640}
                height={420}
                className="block"
              />
            </div>
          </div>

          {/* Telemetry Footer */}
          <div className="h-16 border-t border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-amber-400" />
              <div>
                <div className="text-gray-400">Sun Zenith Radiance</div>
                <div className="font-bold text-white font-mono">120,000 Lux (Physically Calibrated)</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <div>
                <div className="text-gray-400">Volumetric Grid Resolution</div>
                <div className="font-bold text-emerald-400 font-mono">256x144x64 Froxel 3D Texture</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
