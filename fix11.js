import fs from 'fs';

let content = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

const replacement1 = `export enum EMutationCategory { 
  TraitAddition, CompleteMetamorphosis, AmalgamationFailed, 
  SymbioticMerge, ChronoReversal, HiveMindShift, MechanicalCrystallization,
  GravitationalShift, SubatomicResonance
}`;

content = content.replace(/export enum EMutationCategory \{[\s\S]*?\}/, replacement1);

const replacement2 = `export enum EEnvStressType { 
  Thermal, Toxic, Radioactive, Abyssal, AbsoluteZero, VoidGravity, 
  ChronoRadiation, ElectroMagnetic, SporeInfection, LocalizedGravity
}`;

content = content.replace(/export enum EEnvStressType \{[\s\S]*?\}/, replacement2);

const replacement3 = `     // 1. Quantum Roll: Determine the radical path of evolution
     const roll = Math.random();
     let mutationCategory = EMutationCategory.TraitAddition;
     
     if (roll > 0.98) mutationCategory = EMutationCategory.ChronoReversal;
     else if (roll > 0.96) mutationCategory = EMutationCategory.SubatomicResonance;
     else if (roll > 0.93) mutationCategory = EMutationCategory.AmalgamationFailed;
     else if (roll > 0.88) mutationCategory = EMutationCategory.GravitationalShift;
     else if (roll > 0.80) mutationCategory = EMutationCategory.MechanicalCrystallization;
     else if (roll > 0.65) mutationCategory = EMutationCategory.SymbioticMerge;
     else if (roll > 0.35) mutationCategory = EMutationCategory.CompleteMetamorphosis;

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
        case EMutationCategory.GravitationalShift:
            this.triggerGravitationalShift(actor);
            break;
        case EMutationCategory.SubatomicResonance:
            this.triggerSubatomicResonance(actor);
            break;
        default:
            this.applyMinorMutation(actor, stressType);
            break;
     }`;

content = content.replace(/     \/\/ 1\. Quantum Roll: Determine the radical path of evolution[\s\S]*?break;\n     \}/, replacement3);

const replacement4 = `  private triggerBioCrystallization(actor: any) {
      actor.system.log('Flesh converted to electromagnetized crystal.');
      actor.vfx.playEvent('Metal_Crystal_Freeze');
      const bioMech = actor.system.spawnEntity('Bio_Mech_Crystallized', actor.transform.position);
      bioMech.stats.setPhysicalResistance(0.99); // 99% reduction
      actor.destroy();
  }

  private triggerGravitationalShift(actor: any) {
      actor.system.log('Entity mass altered by localized gravitational stress.');
      actor.vfx.playEvent('Gravity_Distortion_Wave');
      
      // Dynamically modify mass and movement speed based on current hazard gravity
      const gravityIntensity = actor.environment?.getHazardIntensity() || 1.0;
      
      // If gravity is high, become dense/slow. If low, become light/fast.
      if (gravityIntensity > 0.5) {
          actor.physics.mass *= 3.0;
          actor.stats.movementSpeed *= 0.4;
          actor.visuals.applyScale({x: 1.5, y: 0.7, z: 1.5}); // Squashed, dense
          actor.stats.addTrait('Dense_Gravity_Core');
      } else {
          actor.physics.mass *= 0.2;
          actor.stats.movementSpeed *= 2.5;
          actor.physics.enableFlight = true;
          actor.visuals.applyScale({x: 0.5, y: 1.8, z: 0.5}); // Elongated, floaty
          actor.stats.addTrait('Zero_G_Hover');
      }
      
      if(actor.stats.fullHeal) actor.stats.fullHeal();
  }

  private triggerSubatomicResonance(actor: any) {
      actor.system.log('Target achieved Subatomic Resonance. Particles shifting out of phase.');
      actor.vfx.playEvent('Quantum_Phase_Shift');
      
      // Entity phases between dimensions, gaining high evasion
      actor.visuals.applyMaterialTint('#a371f7', { opacity: 0.5, glowing: true });
      actor.stats.evasionRate = 0.85; // 85% chance to dodge
      if(actor.abilities) actor.abilities.grantSkill('Phase_Blink');
      actor.stats.addTrait('Quantum_Unstable');
      
      // Has a chance to randomly teleport nearby during combat
      if(actor.behavior) actor.behavior.setPattern('Quantum_Erratic');
  }

  // Pre-condition:`;

content = content.replace(/  private triggerBioCrystallization\(actor\: any\) \{[\s\S]*?  \/\/ Pre-condition\:/, replacement4);

fs.writeFileSync('src/components/AIChat.tsx', content);
