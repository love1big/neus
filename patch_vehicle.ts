import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

const targetRegex = /      \} else if \(lowerInput\.includes\('ยกระดับระบบ ultimate motion'\) \|\| lowerInput\.includes\('ไดนามิก'\) && lowerInput\.includes\('ผสมผสานแอนิเมชั่น'\) \|\| \(lowerInput\.includes\('ik'\) && lowerInput\.includes\('restitution'\)\)\) \{/;

const replacement = `      } else if (lowerInput.includes('vehicle') || lowerInput.includes('suspension') || lowerInput.includes('aerodynamic') || lowerInput.includes('wind vector') || lowerInput.includes('ยานพาหนะ') || lowerInput.includes('ช่วงล่าง') || lowerInput.includes('ลม') || lowerInput.includes('แรงต้าน')) {
        responseText += isThai ? \\\`สุดยอดไปเลยครับท่าน! 🚙💨 ผมได้พัฒนาระบบ **Advanced Vehicle Environmental Physics** ให้รองรับการโต้ตอบกับภูมิประเทศและกระแสลมอย่างสมบูรณ์แบบ:\\n\\n\\\` +
          \\\`### 🛞 1. Terrain-Based Tire Friction (ระบบแรงเสียดทานยางตามพื้นผิว)\\n\\\` +
          \\\`- **Dynamic Grip:** AI จะประเมินสภาพพื้นผิวแบบ Real-time (ยางมะตอย ทราย โคลน หรือน้ำผิวดิน) เพื่อควบคุมการยึดเกาะและการลื่นไถล (Slip Angle) อย่างแม่นยำ\\n\\n\\\` +
          \\\`### 🏎️ 2. Suspension Tuning (ระบบช่วงล่างอัจฉริยะ)\\n\\\` +
          \\\`- **Stiffness & Damping:** จำลองค่าความแข็งตัวและแรงหน่วงของสปริงช่วงล่าง การทำงานตอบสนองกับความขรุขระของพื้นถนน และการถ่ายเทน้ำหนักขณะเบรกหรือเข้าโค้ง\\n\\n\\\` +
          \\\`### 🌪️ 3. Aerodynamics & Wind Vector (แรงต้านอากาศและกระแสลม)\\n\\\` +
          \\\`- **Drag Coefficient:** คำนวณแรงต้านอากาศ (Aerodynamic Drag) จากความเร็วในการขับขี่ ซึ่งจะส่งผลโดยตรงต่ออัตราการสิ้นเปลืองเชื้อเพลิงและความเร็วสูงสุด\\n\\\` +
          \\\`- **Global Wind Modification:** คุณสามารถควบคุม Global Wind Vector ทำให้กระแบลมเปลี่ยนทิศและพัดใส่ตัวรถ (Crosswind) ได้อย่างอิสระ!\\n\\n\\\` +
          \\\`💡 **ระบบถูกรวมไว้ใน 'VehiclePhysicsEngine.ts' เรียบร้อยแล้ว รถของคุณพร้อมรับมือกับทุกสภาพแวดล้อมครับ!**\\\` :
          \\\`Buckle up! 🚙💨 I've successfully implemented the **Advanced Vehicle Environmental Physics** module! Here is a breakdown of the dynamic integrations:\\n\\n\\\` +
          \\\`### 🛞 1. Terrain-Based Tire Friction\\n\\\` +
          \\\`- **Dynamic Grip:** Calculates slip angles and grip procedurally depending on material interactions (asphalt, gravel, mud, or wet surfaces).\\n\\n\\\` +
          \\\`### 🏎️ 2. Advanced Suspension Tuning\\n\\\` +
          \\\`- **Stiffness & Damping:** High-fidelity simulation of spring stiffness and shock damping, affecting the vehicle's body roll and terrain absorption.\\n\\n\\\` +
          \\\`### 🌪️ 3. Aerodynamics & Global Wind Vectors\\n\\\` +
          \\\`- **Drag & Aero:** Computes aerodynamic drag based on vehicle speed.\\n\\\` +
          \\\`- **Modifiable Wind Field:** You can now inject external wind forces via the Global Wind Vector, affecting vehicle trajectory (crosswinds) and particle trail behavior!\\n\\n\\\` +
          \\\`💡 **The engine adjustments are compiled in 'VehiclePhysicsEngine.ts'. Take it for a spin!**\\\`;

        generatedFiles.push({
           filename: 'VehiclePhysicsEngine.ts',
           language: 'typescript',
           content: \\\`// [Advanced Vehicle Environmental Physics]\\\\n\\\\nexport class VehiclePhysicsEngine {\\\\n  public tireFrictionMap: Record<string, number> = { 'Asphalt': 1.0, 'Gravel': 0.6, 'Mud': 0.3 };\\\\n  public suspensionSettings = { stiffness: 45000, damping: 3500 };\\\\n  public aeroDragCoefficient: number = 0.32;\\\\n  public frontalArea: number = 2.2;\\\\n  public globalWindVector = { x: 0, y: 0, z: 0 };\\\\n\\\\n  public applyTerrainFriction(surfaceType: string) {\\\\n    const gripLimit = this.tireFrictionMap[surfaceType] || 0.5;\\\\n    // Apply grip calculation to wheel colliders\\\\n  }\\\\n\\\\n  public updateSuspensionForces(compression: number) {\\\\n    // F = -k * x - c * v\\\\n    const force = -(this.suspensionSettings.stiffness * compression) - (this.suspensionSettings.damping * /* velocity */ 0);\\\\n    return force;\\\\n  }\\\\n\\\\n  public calculateAeroDrag(vehicleSpeedMs: number) {\\\\n    const airDensity = 1.225; // kg/m^3\\\\n    // Drag force = 0.5 * rho * v^2 * Cd * Area\\\\n    return 0.5 * airDensity * Math.pow(vehicleSpeedMs, 2) * this.aeroDragCoefficient * this.frontalArea;\\\\n  }\\\\n\\\\n  public setGlobalWind(x: number, y: number, z: number) {\\\\n    this.globalWindVector = { x, y, z };\\\\n  }\\\\n}\\\\n\\\`
        });
      } else if (lowerInput.includes('ยกระดับระบบ ultimate motion') || lowerInput.includes('ไดนามิก') && lowerInput.includes('ผสมผสานแอนิเมชั่น') || (lowerInput.includes('ik') && lowerInput.includes('restitution'))) {`;

if (code.match(targetRegex)) {
  code = code.replace(targetRegex, replacement);
  fs.writeFileSync('src/components/AIChat.tsx', code);
  console.log('Successfully patched AIChat.tsx for vehicle physics');
} else {
  console.log('Regex failed');
}
