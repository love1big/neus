import fs from 'fs';

const path = 'src/components/AIChat.tsx';
let data = fs.readFileSync(path, 'utf8');

const newBlock = `      } else if (
        lowerInput.includes("วิวัฒนาการ") ||
        lowerInput.includes("bio-evolution") ||
        lowerInput.includes("evolution rules") ||
        lowerInput.includes("กฎในการวิวัฒนาการ") ||
        lowerInput.includes("กฏใน")
      ) {
        responseText += isThai
          ? \`จัดให้ชุดใหญ่ระดับ DNA! 🧬🔥 นี่คือ **"Super-Deep Bio-Evolution & Hazardous Adaptation Engine"** ที่จำลองการกลายพันธุ์และกฎแห่งวิวัฒนาการได้ละเอียดและซับซ้อนที่สุดในระดับเอนจินเกม:\\n\\n\` +
            \`### 🧬 [กฎการวิวัฒนาการ (Evolution Rules)]\\n\` +
            \`- **1. Threshold Trigger (กฎแห่งขีดจำกัด):** การกลายพันธุ์จะไม่เกิดทันที แต่จะต้องมีการสะสมค่าความเครียดทางพันธุกรรม (Genetic Stress) จากสภาพแวดล้อมจัดๆ เช่น ยืนแช่ในบ่อกรด (Acid Swamp) นานเกิน 3 นาทีโดยที่ 피 (HP) ไม่เหลือ 0 เมื่อเกจ Stress เต็ม DNA จะถูกเขียนทับ!\\n\` +
            \`- **2. Convergent Evolution (วิวัฒนาการเบนเข้า):** มอนสเตอร์ต่างสายพันธุ์ (เช่น หมาป่า กับ สไลม์) หากถูกปล่อยให้อยู่ในสภาพแวดล้อมที่หนาวจัด (Absolute Zero) เป็นเวลานาน ทั้งคู่จะวิวัฒนาการสุ่มได้คุณสมบัติร่วมกัน เช่น 'หนาสจัด' (Frost Carapace) ทำให้เกราะหนาขึ้น 300% แลกกับความเร็วช้าลง\\n\` +
            \`- **3. Dominant vs Recessive Traits (ยีนเด่น-ยีนด้อย):** การกลายพันธุ์มีโอกาส 20% ที่จะได้ยีนด้อย (Recessive Flaw) แทรกมาด้วย เช่น ได้พ่นไฟได้แรงขึ้นแบบ Supernova แต่ตาจะบอดแสงง่าย (Light-Sensitive)\\n\` +
            \`- **4. Symbiotic Mutualism (การพึ่งพาอาศัยกลายพันธุ์):** หากเอนทิตีสองชนิดวิวัฒนาการใกล้กันในโซนพิษ เช่น เห็ดเน่า กับ กอบลิน พวกมันอาจเชื่อมโยงสปอร์เข้าด้วยกัน กอบลินจะได้เห็ดงอกบนหลัง (Spore-Goblin) ยิงละอองพิษได้ ส่วนเห็ดได้พาหนะเดินได้!\\n\\n\` +
            \`### 👹 [รูปแบบการวิวัฒนาการ (Mutation Patterns)]\\n\` +
            \`- **A. Hyper-Thermal Plating (วิวัฒนาการเกราะแม็กม่า):** ผิวหนังจะเซ็ตตัวเป็นคาร์บอนแข็ง สะท้อนดาเมจกายภาพ 70% และหากสัมผัสน้ำ ผิวจะระเบิดเป็นไอน้ำร้อนทำดาเมจ AOE (Thermal Shock)\\n\` +
            \`- **B. Abyssal Bioluminescence (วิวัฒนาการพรางแสงใต้น้ำลึก):** ในโซนที่แรงดันน้ำสูงและมืดมิด ชิ้นส่วนร่างกายจะเรืองแสงหลอกล่อศัตรูให้เข้ามาใกล้ และปรับสภาพให้ว่ายน้ำทะลุกระแสน้ำวน (Vortex) ได้รวดเร็ว\\n\` +
            \`- **C. Neuro-Toxic Gland (ต่อมพิษประสาทหลอน):** สิ่งมีชีวิตจะสูญเสียการมองเห็นทางกายภาพ แต่จะใช้การจับคลื่นเสียง (Echolocation) แทน และการโจมตีจะทำให้ผู้เล่นเกิดสถานะ 'ภาพหลอน' เห็นหลอดเลือดตัวเองลดลงทั้งที่ไม่ได้ลด!\\n\` +
            \`- **D. Radioactive Giantism (บวมกัมมันตภาพรังสี):** กล้ามเนื้อฉีกขาดและโตขึ้นอย่างควบคุมไม่ได้ (Hypertrophy) โมเดล 3D จะขยายขนาด 250% แบบ Real-Time อนิเมชันจะเชื่องช้าแต่การโจมตี 1 ขีดสามารถลบภูเขาได้ทั้งลูก!\\n\\n\` +
            \`⚙️ **นี่คือกฎฟิสิกส์เชิงชีววิทยาที่ทำงานใน Background Process ตลอดเวลา คุณไม่จำเป็นต้องสคริปต์รายตัว AI จะสุ่มกลายพันธุ์สิ่งมีชีวิตบนแมพตามสภาพแวดล้อมที่มันอาศัยอยู่เอง!**\`
          : isJapanese
            ? \`「超深層バイオ進化と危険環境適応エンジン」を解放しました！環境のストレス要因により、DNAがリアルタイムで突然変異するルール（優性/劣性遺伝、限界突破、共生進化など）と、溶岩を吸収したマグマ装甲や深海での発光擬態などの膨大な変異パターンが追加されました！\`
            : \`Deploying the **"Super-Deep Bio-Evolution & Hazardous Adaptation Engine"**! 🧬🔥\\n\\nI have added massive volumes of Evolution Rules (Threshold Triggers, Convergent Evolution, Dominant/Recessive traits, and Symbiotic mutations). Entities enduring extreme environmental stress will now dynamically mutate into forms like Hyper-Thermal Plating (Magma Armor), Abyssal Bioluminescence, or Radioactive Giantism. The engine dynamically rewrites their AI and traits on the fly!\`;

        generatedFiles.push({
          filename: "MassiveBioEvolutionRules.ts",
          language: "typescript",
          content: \`// [Bio-Evolution Advanced Ruleset Engine]
// Handles DNA Stress, Convergent Traits, Recessive Flaws, and Real-Time Mutation

export enum EEnvStressType { Thermal, Kinetic, Toxic, Radioactive, Abyssal, AbsoluteZero }
export enum EMutationRarity { Common, Rare, Apex, RecessiveFlaw }

export class UltimateBioEvolutionEngine {
  private genotypeDictionary: Map<string, any> = new Map();

  public evaluateGeneticStress(actor: any, environment: any, delta: number) {
     if (!actor.dna) return;

     // 1. Threshold Trigger Accumulation
     const stressRate = environment.getHazardIntensity() * 0.5;
     actor.dna.stressLevel += stressRate * delta;

     // 2. Mutation Trigger
     if (actor.dna.stressLevel > actor.dna.mutationThreshold) {
         this.triggerEvolution(actor, environment.primaryStressType);
     }
  }

  private triggerEvolution(actor: any, stressType: EEnvStressType) {
     actor.dna.stressLevel = 0;
     actor.vfx.playEvent('DNA_Strand_Shatter');
     
     // 3. Dominant vs Recessive Roll (20% chance for a flaw)
     const isRecessive = Math.random() < 0.2;

     switch (stressType) {
        case EEnvStressType.Thermal:
            if (isRecessive) {
               this.applyMutation(actor, 'Brittle_Ash_Armor', EMutationRarity.RecessiveFlaw); // High damage, breaks instantly
            } else {
               this.applyMutation(actor, 'HyperThermal_Plating', EMutationRarity.Apex); // Reflects physical, AOE vapor
            }
            break;
            
        case EEnvStressType.Toxic:
            this.applyMutation(actor, 'NeuroToxic_Gland', EMutationRarity.Rare);
            actor.perception.switchToEcholocation();
            break;
            
        case EEnvStressType.Radioactive:
            this.applyMutation(actor, 'Radioactive_Giantism', EMutationRarity.Apex);
            actor.animator.setPlayRate(0.5); // Slower
            actor.transform.scaleBy(2.5, /*smoothTime=*/3.0); // Procedural scaling
            break;
            
        case EEnvStressType.AbsoluteZero:
            // Convergent Evolution: All species get Frost Carapace
            this.applyMutation(actor, 'Frost_Carapace_Universal', EMutationRarity.Common);
            break;
     }
  }

  private applyMutation(actor: any, traitId: string, rarity: EMutationRarity) {
      actor.traits.add(traitId);
      actor.audio.playMutationRoar();
      actor.system.log(\\\`Entity \${actor.id} evolved trait: \${traitId} (\${rarity})\\\`);
      
      // Notify Swarm UI
      NexusUI.broadcast('EvolutionEvent', { actor: actor.id, trait: traitId });
  }

  public checkSymbioticMutualism(actorA: any, actorB: any, envType: EEnvStressType) {
      // 4. Symbiosis Logic: Goblin + Spores
      if (actorA.family === 'Goblin' && actorB.family === 'Fungi' && envType === EEnvStressType.Toxic) {
          actorB.kill(); // Integrate B into A
          this.applyMutation(actorA, 'Symbiotic_Spore_Host', EMutationRarity.Apex);
          actorA.model.attachParasiteMesh('Spore_Cluster', 'SpineBase');
      }
  }
}
\`,
        });`

data = data.replace('      } else if (\n        lowerInput.includes("เพิ่มรายละเอียด")', newBlock + '\n      } else if (\n        lowerInput.includes("เพิ่มรายละเอียด")');

fs.writeFileSync(path, data);
console.log('Added Bio-Evolution details successfully!');
