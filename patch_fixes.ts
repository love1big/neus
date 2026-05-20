import fs from 'fs';

let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

// For CharacterAnimator.ts
code = code.replace(
  "console.log(`Blending ${animA} and ${animB} at weight ${weight}`);",
  "console.log(\\`Blending \\${animA} and \\${animB} at weight \\${weight}\\`);"
);

// For AdvancedGenerativePipeline.ts
code = code.replace(
  "console.log(`Simulating ${iterations} years of hydraulic and thermal erosion...`);",
  "console.log(\\`Simulating \\${iterations} years of hydraulic and thermal erosion...\\`);"
);

// For ExtremeFootprintSystem.ts
code = code.replace(
  "console.log(`Applying ${soleTexture} footprint on ${surface} at ${position} with kinetic weight ${weight}`);",
  "console.log(\\`Applying \\${soleTexture} footprint on \\${surface} at \\${position} with kinetic weight \\${weight}\\`);"
);

// For MaterialTransmuter.ts
code = code.replace(
  "console.log(`Transmuted successfully. Entity is now linked to ${targetMaterialType} physics rules.`);",
  "console.log(\\`Transmuted successfully. Entity is now linked to \\${targetMaterialType} physics rules.\\`);"
);

// For BP_InteractableObject.ts 1
code = code.replace(
  "console.log(`Press [E] to interact with ${this.itemName}`);",
  "console.log(\\`Press [E] to interact with \\${this.itemName}\\`);"
);

// For BP_InteractableObject.ts 2
code = code.replace(
  "console.log(`[Pickup] ${player.name} added ${this.itemName} to inventory.`);",
  "console.log(\\`[Pickup] \\${player.name} added \\${this.itemName} to inventory.\\`);"
);

fs.writeFileSync('src/components/AIChat.tsx', code);
