import fs from 'fs';

const path = 'src/components/AIChat.tsx';
let data = fs.readFileSync(path, 'utf8');

const replacementText = `        responseText += isThai
          ? \`จัดชุดใหญ่แบบลึกทะลุมิติระดับ DNA และโมเลกุล! 🧬🔥 นี่คือ **"Ultra-Deep Bio-Evolution & Hazardous Metamorphosis Engine"** ระบบวิวัฒนาการที่ซับซ้อนและไร้ขีดจำกัดที่สุดเท่าที่เอนจินเกมเคยมีมา มอนสเตอร์จะไม่ใช่แค่รับบัฟสถานะ แต่รูปร่าง โครงสร้างกระดูก สกิล และเผ่าพันธุ์จะเปลี่ยนไปอย่างสิ้นเชิงตามแรงกดดันของสภาพแวดล้อมแบบ Real-Time!\\n\\n\` +
            \`### 🔬 **[กฎการวิวัฒนาการระดับทรงพลานุภาพ (Quantum & Cellular Evolution Rules)]**\\n\` +
            \`**1. Extreme Threshold Metamorphosis (การลอกคราบเปลี่ยนสายพันธุ์ฉับพลัน):**\\n\` +
            \`- เมื่อสิ่งมีชีวิตทนรับ **Genetic Stress** จากจุดวิกฤติ (เช่น โดนจับแช่ใน Radioactive Lava 5 นาที) โมเดล 3D จะละลายเป็นของเหลว (Flesh-Melt Animation) ก่อนจะหลอมรวมร่างใหม่เป็น **New Species** ทันที!\\n\` +
            \`- *ตัวอย่าง:* 'Goblin' ธรรมดาตกบ่อกัมมันตรังสีลึก ร่างมันจะบิดเบี้ยวกลายเป็นก้อนเนื้อและฟักออกมาเป็น **'Abyssal Plague-Bringer' (Elite Boss)** ที่มีออร่าพิษ รังเกียจแสงแดด และสามารถเสกหนองพิษใส่ผู้เล่นได้!\\n\\n\` +
            \`**2. Adaptive Convergence (วิวัฒนาการกลืนกินสายพันธุ์ - Predatory Assimilation):**\\n\` +
            \`- หากมอนสเตอร์ต่างสปีชีส์ 2 ชนิดถูกขังในห้องแรงดันวิกฤติ พวกมันจะล่ากันเอง ตัวที่ชนะจะสวาปาม (Consume) อวัยวะของตัวแพ้ และขโมยยีนเด่นมารวมเป็นร่าง **Chimera** แบบไดนามิก!\\n\` +
            \`- *ตัวอย่าง:* 'Frost Wolf' กิน 'Lightning Slime' จะกลายร่างเป็น **'Tempest Fenrir'** หมาป่าขนคริสตัลที่สลับการสร้างพายุหิมะและการปล่อยสายฟ้าผ่าตามจังหวะชีพจร!\\n\\n\` +
            \`**3. Cellular Necrosis vs Hypergenesis (การล้มเหลวทางพันธุกรรม vs การเกิดใหม่ไร้ขอบเขต):**\\n\` +
            \`- ทุกการวิวัฒนาการมีโอกาส **5% ที่ยีนจะพังทลาย (Failed Mutation)** เปลี่ยนร่างนั้นให้เป็นก้อนเนื้อเหนียวหนืดที่กรีดร้องตลอดเวลา (Flesh-Amalgam) มันจะทำดาเมจใส่ตัวเองเรื่อยๆ แลกกับการดรอปไอเทมระดับ **Mythical** เมื่อมันแตกดับ!\\n\\n\` +
            \`**4. Symbiotic Mutualism Metamorphosis (การวิวัฒนาการแบบพึ่งพาอาศัยขั้นสุดยอด):**\\n\` +
            \`- มอนสเตอร์สามารถหลอมรวมร่างกับ **พืชปรสิตหรือเห็ดรา (Fungi/Spores)** ในระบบนิเวศ เกิดเป็นร่างที่มีจิตใจร่วมกัน\\n\` +
            \`- *ตัวอย่าง:* กอบลินติดเชื้อเห็ดรา จะกลายเป็น **'Cordyceps-Host Goblin'** เมื่อมันตาย ร่างมันจะระเบิดเป็นสปอร์ฟุ้งกระจายไปสิงสู่ NPC หรือมอนสเตอร์ตัวอื่นในแมพ ทำให้โรคระบาดนี้ขยายวงกว้างได้เองโดยที่ผู้พัฒนาไม่ต้องเขียนสคริปต์รายตัว!\\n\\n\` +
            \`**5. Reverse Evolution (วิวัฒนาการย้อนกลับยุคดึกดำบรรพ์):**\\n\` +
            \`- หากสัมผัสกับศิลาโบราณ หรือโดนระเบิดพลังงานย้อนกลับ (Chrono-Radiation) ยีนจะสลายสายพันธุ์ปัจจุบัน กลับไปเป็นสปีชีส์ต้นตระกูล เช่น จาก 'หมีเกราะเหล็ก' หดกลับไปเป็น 'แมลงดึกดำบรรพ์ยักษ์' ที่โคตรดุร้ายและดรอปซากฟอสซิล!\\n\\n\` +
            \`**6. Electromagnetic Crystalization (การกลายพันธุ์เป็นแร่โลหะ):**\\n\` +
            \`- ในพื้นที่ที่มีพายุแม่เหล็กไฟฟ้าแรงสูงมากๆ เลือดในตัวสิ่งมีชีวิตจะเริ่มแข็งตัวเป็นแร่ธาตุ มอนสเตอร์สายพันธุ์เนื้อจะกลายเป็นไซบอร์กจักรกลเสมือน (Bio-Mech) ที่ยิงเลเซอร์ได้และป้องกันดาเมจกายภาพได้เกือบ 100%!\\n\\n\` +
            \`**7. Hive-Mind Assimilation (วิวัฒนาการจิตวิญญาณกลุ่ม):**\\n\` +
            \`- มอนสเตอร์ชนิดเดียวกันที่มารวมตัวกันเกิน 50 ตัวในพื้นที่แออัด จะวิวัฒนาการเชื่อมสมองกัน สเกลพลังจะคูณตามจำนวนตัว สั่งการโจมตีแบบประสานงาน (Phalanx Formation) ได้อย่างสมบูรณ์ไร้รอยต่อ!\\n\\n\` +
            \`### 👹 **[รูปแบบสภาพแวดล้อมสุดขั้วและผลกระทบ (Hazardous Catalysts)]**\\n\` +
            \`- **A. Echoing Void (มิติสุญญากาศสะท้อน):** สูญเสียดวงตาทิ้งไป เพราะแรงดันสูง หูจะขยายใหญ่ขึ้นเป็นเรดาร์ รูปร่างจะบิดเบี้ยวกลายเป็นมอนสเตอร์ 4 มิติ และสามารถ **วาปหลบการโจมตี (Phase Shift)** ทันทีที่มีคลื่นเสียงตกกระทบ!\\n\` +
            \`- **B. Crimson Spore Forest (ป่าสปอร์โลหิต):** มอนสเตอร์จะถูกพืชปรสิตแทงทะลุกระดูกสันหลัง สกิลถูกเปลี่ยนเป็นการพ่นสปอร์พิษควบคุมจิตใจ หากสปอร์ไปโดน NPC ชาวบ้าน NPC นั้นก็จะเริ่มบ้าคลั่งกลายพันธุ์ต่อกันเป็นทอดๆ ประดุจซอมบี้ไวรัส!\\n\` +
            \`- **C. Absolute Zero Tundra (ทุ่งเยือกแข็งอนันต์ -273°C):** ผิวหนังลอกออก เผยโครงกระดูกแก้วทนทาน สัตว์จะเคลื่อนไหวในระดับเฟรมเรตต่ำ แต่เกราะกันการโจมตีกายภาพสะท้อนกลับไป 500%!\\n\` +
            \`- **D. Gravity Sinkhole (หุบเหวแรงโน้มถ่วงผันผวน):** กระดูกสันหลังจะล้มเหลว พวกมันจะใช้วิธีลอยตัวในอากาศแทน มีออร่าดึงดูดวัตถุรอบตัว (รวมถึงผู้เล่น) เข้ามาหาตัวเองเรื่อยๆ เหมือนแบล็คโฮลขนาดย่อม!\\n\` +
            \`- **E. Celestial Radiation (จุดตกอุกกาบาต):** สัตว์ประหลาดจะมีแร่หายากงอกทะลุกะโหลก เพิ่มความฉลาดของ AI อย่างรวดเร็ว มีสกิลหลบหลีกจากการคำนวณล่วงหน้าได้เหมือนเปิดโปรแกรมโกง (Hitbox Evasion Matrix)!\\n\\n\` +
            \`⚙️ **ระบบทั้งหมดนี้ทำงานอัตโนมัติบน EntitySpawner เมื่อขีดจำกัดวิวัฒนาการปะทุ มันจะ Destroy ร่างเก่า สลายคอมโพเนนต์เดิม และ Spawn คลาสเบสของมอนสเตอร์ระดับสปีชีส์ใหม่เข้ามาพร้อมกับ Particle Effect ยิ่งใหญ่กระหึ่มจอ! ทั้งหมดนี้ขับเคลื่อนด้วย Data-Driven System แบบจ๊าดๆ!**\`
          : isJapanese
            ? \`超深層のバイオ進化と危険環境適応エンジンです！環境によるストレスが限界に達すると、単なるステータス変化ではなく、全く新しいモンスターへとリアルタイムで究極のメタモルフォーゼを遂げます！\`
            : \`Deploying the **"Ultra-Deep Bio-Evolution & Hazardous Metamorphosis Engine"**! 🧬🔥\\n\\nNow, extreme environmental stress forces a complete **Species Metamorphosis** utilizing dozens of profound genetic rules like Symbiosis, Necrosis, Chrono-Radiation, and Hive-Mind formations!\`;

        generatedFiles.push({
          filename: "HazardousMetamorphosisEngine.ts",
          language: "typescript",
          content: \`// [Bio-Evolution Advanced Ruleset Engine - Ultimate Species Morphing Edition]
// Handles DNA Stress, Convergent Traits, Recessive Flaws, Metamorphosis, Hive-Mind, and Necrosis

export enum EEnvStressType { 
  Thermal, Toxic, Radioactive, Abyssal, AbsoluteZero, VoidGravity, 
  ChronoRadiation, ElectroMagnetic, SporeInfection 
}
export enum EMutationCategory { 
  TraitAddition, CompleteMetamorphosis, AmalgamationFailed, 
  SymbioticMerge, ChronoReversal, HiveMindShift, MechanicalCrystallization 
}

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
     // 1. Quantum Roll: Determine the radical path of evolution
     const roll = Math.random();
     let mutationCategory = EMutationCategory.TraitAddition;
     
     if (roll > 0.98) mutationCategory = EMutationCategory.ChronoReversal;
     else if (roll > 0.95) mutationCategory = EMutationCategory.AmalgamationFailed;
     else if (roll > 0.85) mutationCategory = EMutationCategory.MechanicalCrystallization;
     else if (roll > 0.70) mutationCategory = EMutationCategory.SymbioticMerge;
     else if (roll > 0.40) mutationCategory = EMutationCategory.CompleteMetamorphosis;

     actor.dna.stressLevel = 0;
     
     switch (mutationCategory) {
        case EMutationCategory.CompleteMetamorphosis:
            this.performSpeciesMorph(actor, stressType);
            break;
        case EMutationCategory.AmalgamationFailed:
            this.triggerFailedAmalgamation(actor);
            break;
        case EMutationCategory.SymbioticMerge:
            this.performSymbioticPact(actor, stressType);
            break;
        case EMutationCategory.ChronoReversal:
            this.triggerReverseEvolution(actor);
            break;
        case EMutationCategory.MechanicalCrystallization:
            this.triggerBioCrystallization(actor);
            break;
        default:
            this.applyMinorMutation(actor, stressType);
            break;
     }
  }

  private performSpeciesMorph(actor: any, stress: EEnvStressType) {
      // Radical new species based on base family & precise environmental triggers
      let newSpeciesId = 'Mutant_Generic';
      
      if (actor.family === 'Goblin' && stress === EEnvStressType.Toxic) {
          newSpeciesId = 'Abyssal_PlagueBringer';
      } else if (actor.family === 'Wolf' && stress === EEnvStressType.Radioactive) {
          newSpeciesId = 'Tempest_Fenrir_Apex';
      } else if (stress === EEnvStressType.AbsoluteZero) {
          newSpeciesId = 'Glacial_BoneWalker';
      } else if (stress === EEnvStressType.VoidGravity) {
          newSpeciesId = 'Dimensional_Horror_4D';
      }

      console.log('--- EXTREME METAMORPHOSIS INITIATED ---');
      actor.system.log('Entity ' + actor.id + ' morphing into: ' + newSpeciesId);
      
      // Flashy VFX
      actor.vfx.playEvent('FleshMelt_Cocoon', { duration: 3.5 });
      actor.audio.playMutationRoar({ pitch: 0.2, reverb: 8.0 });
      
      // Spawn new Elite entity
      const newActor = actor.system.spawnEntity(newSpeciesId, actor.transform.position, actor.transform.rotation);
      
      // Corrupted memory inheritance
      newActor.stats.level = actor.stats.level + 15; // Massive buff
      newActor.memory.inheritedHostility = actor.memory.hostilityList;
      
      actor.destroy();
      NexusUI.broadcast('EvolutionEvent', { state: 'MORPHED', actor: newActor.id, origin: actor.id });
  }

  private performSymbioticPact(actor: any, stress: EEnvStressType) {
      if (stress === EEnvStressType.SporeInfection) {
          actor.system.log('Entity ' + actor.id + ' fused with Spores.');
          actor.vfx.playEvent('Burst_Crimson_Spores');
          const infectedHost = actor.system.spawnEntity('Cordyceps_Host_' + actor.family, actor.transform.position);
          infectedHost.abilities.grantSkill('Mind_Control_Spores');
          actor.destroy();
      }
  }

  private triggerFailedAmalgamation(actor: any) {
      actor.system.log('CRITICAL: Genetic collapse on ' + actor.id);
      actor.vfx.playEvent('Necrotic_Gore_Explosion');
      const amalgam = actor.system.spawnEntity('Flesh_Amalgamation', actor.transform.position);
      // Degrades over time but drops mythical tier items
      amalgam.status.applyDot('Cellular_Decay', 50.0); 
      amalgam.lootTable.overrideWith('Tier_Mythical_Cursed');
      actor.destroy();
  }

  private triggerReverseEvolution(actor: any) {
      actor.system.log('Chrono-Radiance triggered reverse evolution!');
      actor.vfx.playEvent('Time_Ripple_Distortion');
      actor.system.spawnEntity('Primordial_Palaeo_Beast', actor.transform.position);
      actor.destroy();
  }

  private triggerBioCrystallization(actor: any) {
      actor.system.log('Flesh converted to electromagnetized crystal.');
      actor.vfx.playEvent('Metal_Crystal_Freeze');
      const bioMech = actor.system.spawnEntity('Bio_Mech_Crystallized', actor.transform.position);
      bioMech.stats.setPhysicalResistance(0.99); // 99% reduction
      actor.destroy();
  }

  // Pre-condition: Triggered when predator executes prey successfully
  public checkAdaptiveConvergence(predator: any, prey: any) {
      if (predator.environment.getHazardIntensity() > 0.5) {
         if (prey.traits.has('LightningCore') || prey.family === 'Slime') {
             predator.system.log('Predator consumed genetic identity of prey!');
             predator.vfx.playEvent('DNA_Absorption_Rays');
             predator.transformInto('Chimera_Mutant_' + predator.family); // e.g. Tempest Fenrir
             predator.stats.addTrait('Stolen_Element_Burst');
             predator.visuals.applyMaterialTint('#00FFFF');
         }
      }
  }
}
\`,
        });`;

const regex = /responseText \+\= isThai\s*\?\s*\`จัดชุดใหญ่แบบลึกทะลุมิติระดับโมเลกุลและ DNA\!.*?\}\)\;/s;

data = data.replace(regex, replacementText);

fs.writeFileSync(path, data);
console.log('Massive Bio-Evolution Details replaced successfully.');
