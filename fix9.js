import fs from 'fs';

const path = 'src/components/AIChat.tsx';
let data = fs.readFileSync(path, 'utf8');

const replacementText = `      } else if (
        lowerInput.includes("วิวัฒนาการ") ||
        lowerInput.includes("bio-evolution") ||
        lowerInput.includes("evolution rules") ||
        lowerInput.includes("กฎในการวิวัฒนาการ") ||
        lowerInput.includes("กฏใน")
      ) {
        responseText += isThai
          ? \`จัดชุดใหญ่แบบลึกทะลุมิติระดับโมเลกุลและ DNA! 🧬🔥 นี่คือ **"Ultra-Deep Bio-Evolution & Hazardous Metamorphosis Engine"** ระบบวิวัฒนาการที่ซับซ้อนที่สุดในระดับ AAA ที่เปลี่ยนมอนสเตอร์ให้กลายเป็น **"ตัวใหม่ (New Species)"** ได้ทันทีโดยอิงตามแรงกดดันทางสภาพแวดล้อม (Environmental Pressure) แบบ Real-time!\\n\\n\` +
            \`### 🔬 [กฎการวิวัฒนาการระดับปรมาณู (Quantum Evolution Rules)]\\n\` +
            \`**1. Extreme Threshold Metamorphosis (การลอกคราบเปลี่ยนสายพันธุ์):**\\n\` +
            \`- เมื่อสิ่งมีชีวิตได้รับความเครียดทางสภาพแวดล้อมรุนแรงเกินขีดจำกัด (เช่น โดนจับแช่ใน Radioactive Lava เป็นเวลา 5 นาทีต่อเนื่อง) โมเดล 3D จะเกิดการละลาย (Flesh-Melt Animation) และ **เกิดใหม่เป็นมอนสเตอร์ชนิดใหม่ (Species Morph)** ทันที!\\n\` +
            \`- *ตัวอย่าง:* 'Goblin' ธรรมดาตกลงไปบ่อพิษลึก แทนที่จะแค่ติดสถานะพิษ มันรวบรวมมวลสารเน่าเสียจนกลายพันธุ์เป็น **'Abyssal Plague-Bringer' (บอสระดับ Elite)** ที่มีหลอดเลือดใหม่ สกิลใหม่ และ AI รังเกียจแสงแดดทันที!\\n\\n\` +
            \`**2. Adaptive Convergence (วิวัฒนาการร่วมกลืนกินสายพันธุ์):**\\n\` +
            \`- ถ้านำมอนสเตอร์ 2 ชนิดที่แตกต่างกันไปขังไว้ในสภาพแวดล้อมเลวร้ายที่เดียวกัน (เช่น ห้องปิดตายที่มีแรงดันวิกฤต) พวกมันจะต่อสู้กัน และตัวที่ชนะจะ **"สวาปาม (Consume)"** DNA ของตัวแพ้ ทำให้กลายพันธุ์ผสมสายพันธุ์!\\n\` +
            \`- *ตัวอย่าง:* 'Frost Wolf' กิน 'Lightning Slime' จะลอกคราบกลายเป็น **'Tempest Fenrir'** หมาป่าขนคริสตัลที่สับเปลี่ยนธาตุโจมตีระหว่างน้ำแข็งและสายฟ้าได้ตามสภาพอากาศ!\\n\\n\` +
            \`**3. Cellular Necrosis vs Hypergenesis (ยีนส์ทำลายตนเอง vs ยีนส์ฟื้นฟูไร้ขีดจำกัด):**\\n\` +
            \`- มีโอกาส 5% ที่การกลายพันธุ์จะล้มเหลว (Failed Mutation) เปลี่ยนมอนสเตอร์ตัวนั้นให้เป็นก้อนเนื้อที่ร้องโหยหวน (Flesh-Amalgam) ทำดาเมจตัวเองตลอดเวลา แต่เวลาแตกดับจะดรอป Rare Item มหาศาล!\\n\\n\` +
            \`### 👹 [ระบบสภาพแวดล้อมสุดขั้วที่มีผลต่อสายพันธุ์ (Hazardous Catalysts)]\\n\` +
            \`- **A. Echoing Void (มิติสุญญากาศสะท้อน):** สิ่งมีชีวิตจะสูญเสียดวงตาทิ้งไป เพราะแรงดันสูง และหูจะขยายใหญ่ขึ้นเป็นเรดาร์ รูปร่างจะบิดเบี้ยวกลายเป็นสัตว์ประหลาด 4 มิติ และสามารถวาปผอมหลบการโจมตีได้เมื่อมีคลื่นเสียง\\n\` +
            \`- **B. Crimson Spore Forest (ป่าสปอร์โลหิต):** มอนสเตอร์จะถูกพืชปรสิตแทงทะลุกระดูกสันหลัง สกิลโจมตีถูกเปลี่ยนเป็นการพ่นสปอร์พิษควบคุมจิตใจ หากสปอร์ไปโดน NPC ชาวบ้าน NPC นั้นก็จะเริ่มกลายพันธุ์ต่อกันเป็นทอดๆ!\\n\` +
            \`- **C. Absolute Zero Tundra (ทุ่งเยือกแข็งอนันต์):** ผิวหนังจะลอกออกและเผยให้เห็นกระดูกแก้วที่ทนความเย็นระดับ -273°C สัตว์จะเคลื่อนไหวช้ามากเป็นเฟรมเรตต่ำ แต่กันดาเมจทางกายภาพ 99%!\\n\\n\` +
            \`⚙️ **ระบบนี้สมบูรณ์แบบ! เมื่อการระเบิดทางวิวัฒนาการเกิด ระบบ EntitySpawner จะ Destroy ร่างเก่า ละทิ้งตัวแปรทั้งหมด แล้ว Spawn คลาสเบสของมอนสเตอร์สายพันธุ์ใหม่ (New Species Class) เข้ามาแทนที่ด้วย Particle Effect แบบอลังการ!**\`
          : isJapanese
            ? \`超深層のバイオ進化と危険環境適応エンジンです！環境によるストレスが限界に達すると、単なるステータス変化ではなく、全く新しいモンスター（新種）へとリアルタイムでメタモルフォーゼ（変態）します！\`
            : \`Deploying the **"Ultra-Deep Bio-Evolution & Hazardous Metamorphosis Engine"**! 🧬🔥\\n\\nNow, extreme environmental stress doesn't just add traits; it forces a complete **Species Metamorphosis**. A Goblin drowning in radioactive acid can dissolve and instantly respawn as an elite 'Abyssal Plague-Bringer' boss. Predators can consume prey to steal their DNA, generating hybrid chimeras dynamically. This represents the absolute pinnacle of dynamic, emergent ecosystems!\`;

        generatedFiles.push({
          filename: "HazardousMetamorphosisEngine.ts",
          language: "typescript",
          content: \`// [Bio-Evolution Advanced Ruleset Engine - Species Morphing Edition]
// Handles DNA Stress, Convergent Traits, Recessive Flaws, and Complete Metamorphosis

export enum EEnvStressType { Thermal, Toxic, Radioactive, Abyssal, AbsoluteZero, VoidGravity }
export enum EMutationCategory { TraitAddition, CompleteMetamorphosis, AmalgamationFailed }

export class UltimateBioEvolutionEngine {
  public evaluateGeneticStress(actor: any, environment: any, delta: number) {
     if (!actor.dna || actor.dna.isLocked) return;

     const stressRate = environment.getHazardIntensity() * (actor.dna.mutationSusceptibility || 1.0);
     actor.dna.stressLevel += stressRate * delta;

     if (actor.dna.stressLevel > actor.dna.mutationThreshold) {
         this.triggerMetamorphosis(actor, environment.primaryStressType);
     }
  }

  private triggerMetamorphosis(actor: any, stressType: EEnvStressType) {
     // 1. Extreme Roll: 30% chance for a COMPLETE species change, 5% for a horrifying failure
     const roll = Math.random();
     let mutationCategory = EMutationCategory.TraitAddition;
     
     if (roll > 0.95) mutationCategory = EMutationCategory.AmalgamationFailed;
     else if (roll > 0.65) mutationCategory = EMutationCategory.CompleteMetamorphosis;

     actor.dna.stressLevel = 0;
     
     if (mutationCategory === EMutationCategory.CompleteMetamorphosis) {
        this.performSpeciesMorph(actor, stressType);
     } else if (mutationCategory === EMutationCategory.AmalgamationFailed) {
        this.triggerFailedAmalgamation(actor);
     } else {
        this.applyMinorMutation(actor, stressType);
     }
  }

  private performSpeciesMorph(actor: any, stress: EEnvStressType) {
      // Determines the radical new species based on base family and stress
      let newSpeciesId = 'Mutant_Generic';
      if (actor.family === 'Goblin' && stress === EEnvStressType.Toxic) {
          newSpeciesId = 'Abyssal_PlagueBringer';
      } else if (actor.family === 'Wolf' && stress === EEnvStressType.Radioactive) {
          newSpeciesId = 'Tempest_Fenrir_Apex';
      } else if (stress === EEnvStressType.AbsoluteZero) {
          newSpeciesId = 'Glacial_BoneWalker';
      }

      console.log('--- METAMORPHOSIS EVENT TRIGGERED ---');
      actor.system.log('Entity ' + actor.id + ' is morphing into new species: ' + newSpeciesId);
      
      // Visual feedback
      actor.vfx.playEvent('FleshMelt_Cocoon', { duration: 3.0 });
      actor.audio.playMutationRoar();
      
      // Spawn new entity and destroy original
      const newActor = actor.system.spawnEntity(newSpeciesId, actor.transform.position, actor.transform.rotation);
      
      // Carry over some corrupted memory/stats
      newActor.stats.level = actor.stats.level + 5; // Elite boost
      newActor.memory.inheritedHostility = actor.memory.hostilityList;
      
      actor.destroy(); // Cease to exist
      
      // Global Notification
      // Notify Swarm UI
      NexusUI.broadcast('EvolutionEvent', { actor: actor.id, trait: 'MORPHED_INTO_' + newSpeciesId });
  }

  private triggerFailedAmalgamation(actor: any) {
      // The grotesque failed mutation
      actor.system.log('WARNING: Genetic breakdown for ' + actor.id);
      actor.vfx.playEvent('Necrotic_Explosion');
      const amalgam = actor.system.spawnEntity('Flesh_Amalgamation', actor.transform.position);
      amalgam.status.applyDot('Cellular_Decay', 10.0); // Dies slowly over time
      actor.destroy();
  }

  private applyMinorMutation(actor: any, stress: EEnvStressType) {
      actor.traits.add('StressAdapted_' + stress);
      actor.system.log('Entity ' + actor.id + ' grew adapted trait.');
  }

  // Called when a predator eats another entity in extreme environments
  public checkAdaptiveConvergence(predator: any, prey: any) {
      if (predator.environment.isExtreme) {
         if (prey.traits.has('LightningCore')) {
             predator.system.log('Predator consumed Lightning trait!');
             predator.traits.add('Stolen_Lightning_Gland');
             predator.visuals.applyMaterialTint('#00FFFF');
         }
      }
  }
}
\`,
        });`;

// Find the regex to replace. We will replace the entire block from `} else if (\n        lowerInput.includes("วิวัฒนาการ")` until the next `} else if (`

const regex = /\} else if \(\r?\n\s*lowerInput\.includes\("วิวัฒนาการ"\).*?\}\s*\);/s;

data = data.replace(regex, replacementText);

fs.writeFileSync(path, data);
console.log('Replaced bio-evolution block successfully.');
