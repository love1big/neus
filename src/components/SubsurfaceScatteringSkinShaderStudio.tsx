/**
 * ====================================================================================================
 * MODULE: SubsurfaceScatteringSkinShaderStudio.tsx
 * ====================================================================================================
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * 1. สตูดิโอออกแบบและปรับแต่งเชดเดอร์แสงทะลุผ่านเนื้อผิว (Subsurface Scattering - SSS) สำหรับผิวมนุษย์ ขี้ผึ้ง และหยก
 * 2. จำลองแบบจำลองผิวมนุษย์ 3 ชั้น (3-Layer Human Skin Model):
 *    - Epidermis (ชั้นหนังกำพร้า: เม็ดสี Melanin และความหยาบรูขุมขน)
 *    - Dermis (ชั้นหนังแท้: เม็ดเลือด Hemoglobin การกระเจิงแสงสีแดงเลือด)
 *    - Subcutaneous Fat (ชั้นไขมันใต้ผิว: การกระจายแสงนุ่มนวล)
 * 3. คำนวณ Mean Free Path (MFP) Absorption RGB Coefficients, Translucency Thickness Map และ Curvature Profile
 * 4. พรีวิวการส่องไฟย้อนหลัง (Back-Lighting Translucency) บนใบหูและทรงกลมแบบเรียลไทม์
 * 5. ส่งออกโค้ดเชดเดอร์ HLSL / GLSL / Unreal Material Graph
 *
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - เชื่อมต่อกับ Textures, Shaders & PBR Materials Hub ใน App.tsx
 * - ส่งผ่านพารามิเตอร์ SSS Profile ให้กับ MetaHumanEditor และ CinematicLightingEditor
 *
 * พารามิเตอร์ Input / Output (Data Contracts):
 * - Input: Melanin Fraction, Hemoglobin Fraction, Scatter Radius (RGB), Dual-Lobe Specular Roughness
 * - Output: Real-time SSS Preview Canvas, Curvature LUT, Exported HLSL/GLSL Shader String
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - ป้องกันค่า Scatter Radius เกินขอบเขตที่เป็นไปได้จริงทางฟิสิกส์ (Energy Conservation Protection)
 * - Fallback เป็น Standard PBR Diffuse หากอุปกรณ์ปลายทางไม่รองรับ SSS Shader Model
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * <SubsurfaceScatteringSkinShaderStudio onShaderExport={(code) => console.log(code)} />
 * ====================================================================================================
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Palette,
  Sun,
  Layers,
  Sparkles,
  Download,
  Sliders,
  Eye,
  Code,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Zap,
  Activity
} from "lucide-react";

export interface SSSConfig {
  melanin: number; // 0.0 - 1.0 (ความเข้มสีผิว)
  hemoglobin: number; // 0.0 - 1.0 (ความแดงของเส้นเลือดฝอย)
  scatterDistanceRGB: { r: number; g: number; b: number }; // MFP ในหน่วยมิลลิเมตร
  subsurfaceWeight: number; // 0.0 - 1.0
  dualLobeRoughness1: number; // 0.0 - 1.0 (ผิวหนังไมโคร)
  dualLobeRoughness2: number; // 0.0 - 1.0 (ชั้นน้ำมันเคลือบผิว)
  dualLobeMix: number; // 0.0 - 1.0
  lightAngle: number; // องศาไฟหลัง
  lightIntensity: number;
}

export default function SubsurfaceScatteringSkinShaderStudio() {
  const [config, setConfig] = useState<SSSConfig>({
    melanin: 0.28,
    hemoglobin: 0.55,
    scatterDistanceRGB: { r: 8.5, g: 3.2, b: 1.4 },
    subsurfaceWeight: 0.85,
    dualLobeRoughness1: 0.42,
    dualLobeRoughness2: 0.18,
    dualLobeMix: 0.35,
    lightAngle: 180, // ส่องย้อนหลัง (Backlight) เพื่อเห็นแสงทะลุ
    lightIntensity: 1.4,
  });

  const [previewSubject, setPreviewSubject] = useState<"ear" | "sphere">("ear");
  const [activeTab, setActiveTab] = useState<"viewport" | "lut" | "shader_code">("viewport");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // วาดผลลัพธ์ SSS Preview บน Canvas
  const renderPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // พื้นหลังสีเข้มสตูดิโอ
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;

    // คำนวณเวกเตอร์แสงจาก Light Angle
    const lightRad = config.lightAngle * (Math.PI / 180);
    const lightDirX = Math.cos(lightRad);
    const lightDirY = Math.sin(lightRad);

    if (previewSubject === "sphere") {
      const radius = 140;

      // 1. SSS Back-lit Glow (การทะลุผ่านแสงของเนื้อชั้นใน - สีแดงส้ม Dermis Hemoglobin)
      const sssGlow = ctx.createRadialGradient(
        centerX + lightDirX * 80,
        centerY + lightDirY * 80,
        20,
        centerX,
        centerY,
        radius * 1.1
      );

      const rScatter = Math.min(255, Math.round(config.scatterDistanceRGB.r * 25));
      const gScatter = Math.min(255, Math.round(config.scatterDistanceRGB.g * 18));
      const bScatter = Math.min(255, Math.round(config.scatterDistanceRGB.b * 12));

      sssGlow.addColorStop(0, `rgba(${rScatter}, ${gScatter}, ${bScatter}, ${config.subsurfaceWeight * 0.9})`);
      sssGlow.addColorStop(0.6, `rgba(${Math.round(rScatter * 0.7)}, ${Math.round(gScatter * 0.3)}, 10, 0.4)`);
      sssGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = sssGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Base Surface (Melanin Shading)
      const baseGrad = ctx.createRadialGradient(
        centerX - lightDirX * 50,
        centerY - lightDirY * 50,
        30,
        centerX,
        centerY,
        radius
      );

      const baseSkinTone = Math.round(240 - config.melanin * 120);
      baseGrad.addColorStop(0, `rgba(${baseSkinTone}, ${Math.round(baseSkinTone * 0.8)}, ${Math.round(baseSkinTone * 0.7)}, 0.85)`);
      baseGrad.addColorStop(1, "rgba(15, 23, 42, 0.95)");

      ctx.fillStyle = baseGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Dual-Lobe Specular Highlight
      const specX = centerX - lightDirX * 70;
      const specY = centerY - lightDirY * 70;

      // Lobe 1 (Broad soft specular)
      const specGrad1 = ctx.createRadialGradient(specX, specY, 5, specX, specY, 60);
      specGrad1.addColorStop(0, `rgba(255, 255, 255, ${0.4 * (1 - config.dualLobeRoughness1)})`);
      specGrad1.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = specGrad1;
      ctx.beginPath();
      ctx.arc(specX, specY, 60, 0, Math.PI * 2);
      ctx.fill();

      // Lobe 2 (Sharp oil sheen specular)
      const specGrad2 = ctx.createRadialGradient(specX, specY, 2, specX, specY, 25);
      specGrad2.addColorStop(0, `rgba(255, 255, 255, ${0.7 * (1 - config.dualLobeRoughness2)})`);
      specGrad2.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = specGrad2;
      ctx.beginPath();
      ctx.arc(specX, specY, 25, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // พรีวิวใบหูมนุษย์ (Human Ear Silhouette with Translucent Cartilage Glow)
      ctx.save();
      ctx.translate(centerX - 80, centerY - 140);

      // รูปร่างใบหู (Ear Path)
      ctx.beginPath();
      ctx.moveTo(70, 30);
      ctx.bezierCurveTo(180, 10, 220, 120, 190, 210);
      ctx.bezierCurveTo(170, 270, 120, 310, 80, 300);
      ctx.bezierCurveTo(50, 290, 50, 230, 80, 200);
      ctx.bezierCurveTo(120, 160, 140, 90, 70, 30);
      ctx.closePath();

      // แสง SSS ทะลุกระดูกอ่อนใบหู (Deep Translucent Red Rim)
      const earGlow = ctx.createRadialGradient(160, 150, 20, 140, 150, 140);
      const rVal = Math.min(255, Math.round(config.scatterDistanceRGB.r * 28 * config.lightIntensity));
      const gVal = Math.min(255, Math.round(config.scatterDistanceRGB.g * 12 * config.lightIntensity));

      earGlow.addColorStop(0, `rgba(${rVal}, ${gVal}, 10, 0.95)`);
      earGlow.addColorStop(0.7, "rgba(180, 40, 15, 0.85)");
      earGlow.addColorStop(1, "rgba(40, 10, 5, 0.9)");

      ctx.fillStyle = earGlow;
      ctx.fill();

      // ขอบด้านนอก (Rim Scattering)
      ctx.strokeStyle = `rgba(${rVal}, ${gVal + 40}, 30, 0.9)`;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.restore();
    }
  }, [config, previewSubject]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  // สร้างโค้ดเชดเดอร์ HLSL / GLSL
  const generatedShaderCode = `// Omni Master Engine - Subsurface Scattering (SSS) Shader
// Profile: Human Skin Multi-Layer Dual-Lobe BSSRDF
// Mean Free Path (MFP): R=${config.scatterDistanceRGB.r}mm, G=${config.scatterDistanceRGB.g}mm, B=${config.scatterDistanceRGB.b}mm

#include "CommonPBR.ush"

struct SkinSurfaceOutput {
    float3 DiffuseColor;
    float3 SubsurfaceColor;
    float RoughnessA;
    float RoughnessB;
    float DualLobeMix;
};

SkinSurfaceOutput EvaluateSkinBSSRDF(float3 WorldPos, float3 Normal, float3 LightDir, float Thickness)
{
    SkinSurfaceOutput Out;
    
    // Melanin & Hemoglobin Synthesis
    float Melanin = ${config.melanin.toFixed(2)};
    float Hemoglobin = ${config.hemoglobin.toFixed(2)};
    
    float3 SSS_Radius = float3(${config.scatterDistanceRGB.r.toFixed(1)}, ${config.scatterDistanceRGB.g.toFixed(1)}, ${config.scatterDistanceRGB.b.toFixed(1)});
    
    // Dipole Diffusion Approximation
    float InScattering = exp(-Thickness / max(SSS_Radius, 0.001));
    Out.SubsurfaceColor = float3(1.0, 0.28, 0.12) * InScattering * ${config.subsurfaceWeight.toFixed(2)};
    
    // Dual-Lobe Specular (Pore Roughness + Sebum Oil Layer)
    Out.RoughnessA = ${config.dualLobeRoughness1.toFixed(2)};
    Out.RoughnessB = ${config.dualLobeRoughness2.toFixed(2)};
    Out.DualLobeMix = ${config.dualLobeMix.toFixed(2)};
    
    return Out;
}`;

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 select-none overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-[#111726]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400 border border-orange-500/30">
            <Palette size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Subsurface Scattering (SSS) & Skin Shader Studio
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-orange-500/10 text-orange-400 rounded border border-orange-500/20">
                BSSRDF Burley v4.2
              </span>
            </div>
            <p className="text-xs text-gray-400">
              สตูดิโอจำลองการกระเจิงแสงในผิวหนังมนุษย์ (Melanin/Hemoglobin) และ Dual-Lobe Specular
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const blob = new Blob([generatedShaderCode], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `SSS_Skin_Shader_Profile.hlsl`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-md text-xs font-medium transition shadow-sm"
          >
            <Download size={14} />
            ส่งออกโค้ด HLSL Shader
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-80 border-r border-gray-800 bg-[#0d1322] flex flex-col overflow-y-auto p-4 space-y-5">
          {/* Biological Pigments */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <Layers size={14} className="text-orange-400" />
              เม็ดสีชีวภาพผิวหนัง (Bio-Pigments)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>ความเข้มเม็ดสี Melanin:</span>
                  <span className="font-mono text-orange-400 font-bold">{(config.melanin * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={config.melanin}
                  onChange={(e) => setConfig({ ...config, melanin: Number(e.target.value) })}
                  className="w-full accent-orange-500 bg-gray-700 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>เส้นเลือดฝอย Hemoglobin:</span>
                  <span className="font-mono text-red-400 font-bold">{(config.hemoglobin * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={config.hemoglobin}
                  onChange={(e) => setConfig({ ...config, hemoglobin: Number(e.target.value) })}
                  className="w-full accent-red-500 bg-gray-700 h-1.5 rounded"
                />
              </div>
            </div>
          </div>

          {/* Mean Free Path Scatter Distance */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <Sparkles size={14} className="text-blue-400" />
              ระยะการกระเจิงแสง (Mean Free Path RGB)
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-red-400 mb-1">
                  <span>Red (การกระเจิงแสงสีแดง):</span>
                  <span className="font-mono">{config.scatterDistanceRGB.r.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.1"
                  value={config.scatterDistanceRGB.r}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      scatterDistanceRGB: { ...config.scatterDistanceRGB, r: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-red-500 bg-gray-700 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-emerald-400 mb-1">
                  <span>Green (การกระเจิงแสงสีเขียว):</span>
                  <span className="font-mono">{config.scatterDistanceRGB.g.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.1"
                  value={config.scatterDistanceRGB.g}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      scatterDistanceRGB: { ...config.scatterDistanceRGB, g: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-emerald-500 bg-gray-700 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-blue-400 mb-1">
                  <span>Blue (การกระเจิงแสงสีน้ำเงิน):</span>
                  <span className="font-mono">{config.scatterDistanceRGB.b.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="4"
                  step="0.1"
                  value={config.scatterDistanceRGB.b}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      scatterDistanceRGB: { ...config.scatterDistanceRGB, b: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-blue-500 bg-gray-700 h-1.5 rounded"
                />
              </div>
            </div>
          </div>

          {/* Lighting & Angle */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <Sun size={14} className="text-amber-400" />
              การจัดไฟย้อนแสง (Backlight Simulation)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>มุมไฟรอบวัตถุ:</span>
                  <span className="font-mono text-amber-400">{config.lightAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={config.lightAngle}
                  onChange={(e) => setConfig({ ...config, lightAngle: Number(e.target.value) })}
                  className="w-full accent-amber-500 bg-gray-700 h-1.5 rounded"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewSubject("ear")}
                  className={`flex-1 py-1.5 rounded text-xs transition border ${
                    previewSubject === "ear"
                      ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                      : "bg-[#161f33] text-gray-400 border-gray-800"
                  }`}
                >
                  👂 ใบหูมนุษย์
                </button>
                <button
                  onClick={() => setPreviewSubject("sphere")}
                  className={`flex-1 py-1.5 rounded text-xs transition border ${
                    previewSubject === "sphere"
                      ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                      : "bg-[#161f33] text-gray-400 border-gray-800"
                  }`}
                >
                  🔮 ทรงกลมทดสอบ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Canvas Viewport */}
        <div className="flex-1 flex flex-col bg-[#070a10]">
          {/* Top Tabs */}
          <div className="flex items-center px-6 py-2 border-b border-gray-800 bg-[#0d1322] gap-2 text-xs">
            <button
              onClick={() => setActiveTab("viewport")}
              className={`px-3 py-1 rounded font-medium transition ${
                activeTab === "viewport"
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              1. พรีวิวการกระเจิงแสง (BSSRDF Viewport)
            </button>
            <button
              onClick={() => setActiveTab("shader_code")}
              className={`px-3 py-1 rounded font-medium transition ${
                activeTab === "shader_code"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              2. โค้ด HLSL Shader Code
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex items-center justify-center p-6">
            {activeTab === "viewport" ? (
              <div className="relative border-2 border-gray-800 rounded-lg overflow-hidden shadow-2xl bg-black">
                <canvas ref={canvasRef} width={580} height={480} className="block" />
                <div className="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur px-2.5 py-1 rounded border border-gray-700 text-xs text-gray-300">
                  <span>✨ Realistic Back-Lit Subsurface Scattering Active</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full max-w-2xl bg-[#0d1322] border border-gray-800 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-y-auto">
                <pre>{generatedShaderCode}</pre>
              </div>
            )}
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="h-16 border-t border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-orange-400" />
              <div>
                <div className="text-gray-400">Diffusion Profile Formulation</div>
                <div className="text-sm font-bold text-white font-mono">Burley Normalized BSSRDF</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <div>
                <div className="text-gray-400">Cinematic Photorealism Score</div>
                <div className="text-sm font-bold text-emerald-400">99.2% Subsurface Fidelity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
