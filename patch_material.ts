import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

const regex = /      \} else if \(lowerInput\.includes\('เพิ่มระบบอะไร'\)/;

const replacement = `      } else if (lowerInput.includes('material editor') || lowerInput.includes('pbr') || lowerInput.includes('material') || lowerInput.includes('real-time adjustment')) {
        responseText += isThai ? \`ผมได้สร้าง **Material Editor (PBR)** ให้คุณเรียบร้อยแล้วครับ! 🎨✨\\n\\nคุณสามารถใช้งาน **Node-based Material Editor** เพื่อปรับแต่งคุณสมบัติต่างๆ ของ PBR (Physically Based Rendering) ได้แบบ Real-time เช่น Base Color, Metallic, Specular, Roughness, Normal และ Emission ครับ\\n\\nเครื่องมือนี้รองรับระบบ **Undo/Redo (Ctrl+Z)** ระบบ AI Generate Material Map จากข้อความ การโหลด Preset ต่างๆ และสามารถ Import Texture ของคุณเองเข้ามาผสม (Blend) ได้ทันที!\\n\\nเปิดใช้งานได้ที่แผงเครื่องมือซ้ายมือ **🎨 Material** ได้เลยครับ!\` :
                        isJapanese ? \`PBRプロパティをリアルタイムで調整できる **マテリアルエディタ (Material Editor)** を作成しました！🎨✨ ベースカラー、メタリック、ラフネス、ノーマルなどの調整が可能です。\` :
                        \`I have created a **Material Editor (PBR)** for you! 🎨✨\\n\\nYou can use this **Node-based Material Editor** to adjust PBR (Physically Based Rendering) properties in real-time. It includes inputs for Base Color, Metallic, Specular, Roughness, Normal, and Emission.\\n\\nIt features an **Undo/Redo** system, AI-driven Material Generation, Presets, and Texture Importing. You can access it via the sidebar tool **🎨 Material**!\`;
        
        generatedFiles.push({
           filename: 'MaterialEditorCore.ts',
           language: 'typescript',
           content: \`// PBR Material Editor Features API\\nexport interface PBRMaterialProps {\\n  baseColor: string;\\n  metallic: number; // 0.0 to 1.0\\n  roughness: number; // 0.0 to 1.0\\n  specular: number;\\n  normalMap?: string;\\n  emissiveColor: string;\\n}\\n\\n// Real-time Adjustment Engine\\nexport class MaterialEditorEngine {\\n  public updatePBR(properties: Partial<PBRMaterialProps>) {\\n    console.log('[MaterialEditor] Real-time updating PBR properties:', properties);\\n    // Broadcast to Render Pipeline\\n  }\\n}\\n\`
        });
      } else if (lowerInput.includes('เพิ่มระบบอะไร')`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/AIChat.tsx', code);
