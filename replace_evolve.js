import fs from 'fs';

let content = fs.readFileSync('src/components/NPCEditor.tsx', 'utf8');

const replacement = `  const handleEvolveMonster = (baseNpc: NPC, stressType: string) => {
    // Generate AI/Procedural Name based on stress type and base name
    const prefixes: Record<string, string[]> = {
       'Toxic': ['Abyssal', 'Plague', 'Venomous', 'Blighted', '腐敗した (Rotten)', 'Bio-Hazard', 'Noxious'],
       'Thermal': ['Infernal', 'Magma', 'Scorched', 'Volcanic', '灼熱の (Blazing)', 'Ash-Born', 'Pyroclastic'],
       'Radioactive': ['Mutant', 'Nuclear', 'Gamma', 'Warped', '放射能 (Radiant)', 'Isotope', 'Cherenkov'],
       'AbsoluteZero': ['Glacial', 'Everfrost', 'Cryo', 'Shattered', '絶対零度の (Absolute Zero)', 'Permafrost', 'Frostbite'],
       'Abyssal': ['Void', 'Deep', 'Pressure-Crushed', 'Dark', '深淵の (Abyssal)', 'Trench-Dweller', 'Eldritch'],
       'LocalizedGravity': ['Dense', 'Singularity', 'Gravity-Bound', 'Floating', '重力の (Gravitational)', 'Crushing', 'Supermassive'],
       'SubatomicResonance': ['Phase-Shifted', 'Quantum', 'Unstable', 'Flickering', '量子の (Quantum)', 'Entangled', 'Dimensional']
    };
    
    const randomPrefix = prefixes[stressType] ? prefixes[stressType][Math.floor(Math.random() * prefixes[stressType].length)] : 'Evolved';
    const newName = \`\${randomPrefix} \${baseNpc.name}\`;
    
    // Environment-specific highly detailed loot generation (Items, drop rates, and lore names)
    const environmentLootDict: Record<string, any[]> = {
       'Toxic': [
          { itemName: 'Viscous Blight Gland', dropRate: 1.0, minQuantity: 1, maxQuantity: 2, guaranteed: true },
          { itemName: \`Corrosive \${baseNpc.name} Blood\`, dropRate: 0.85, minQuantity: 2, maxQuantity: 5, guaranteed: false },
          { itemName: 'Putrid Marrow', dropRate: 0.60, minQuantity: 1, maxQuantity: 3, guaranteed: false },
          { itemName: 'Noxious Fumes Bottled', dropRate: 0.30, minQuantity: 1, maxQuantity: 1, guaranteed: false },
          { itemName: 'Mutated Plaguespore Core (Legendary)', dropRate: 0.03, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ],
       'Thermal': [
          { itemName: 'Pulsing Magma Core', dropRate: 1.0, minQuantity: 1, maxQuantity: 1, guaranteed: true },
          { itemName: \`Scorched \${baseNpc.name} Scale\`, dropRate: 0.80, minQuantity: 1, maxQuantity: 4, guaranteed: false },
          { itemName: 'Liquid Fire Vial', dropRate: 0.55, minQuantity: 1, maxQuantity: 2, guaranteed: false },
          { itemName: 'Ash-Covered Bone Fragment', dropRate: 0.40, minQuantity: 2, maxQuantity: 6, guaranteed: false },
          { itemName: 'Heart of the Volcano (Legendary)', dropRate: 0.02, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ],
       'Radioactive': [
          { itemName: 'Isotope-Enriched Plasma', dropRate: 1.0, minQuantity: 1, maxQuantity: 3, guaranteed: true },
          { itemName: \`Glowing \${baseNpc.name} Gamma Gland\`, dropRate: 0.75, minQuantity: 1, maxQuantity: 2, guaranteed: false },
          { itemName: 'Uranium-Infused Claw/Tooth', dropRate: 0.50, minQuantity: 1, maxQuantity: 4, guaranteed: false },
          { itemName: 'Mutagenic Sludge', dropRate: 0.35, minQuantity: 1, maxQuantity: 3, guaranteed: false },
          { itemName: 'Cherenkov Radiator Organ (Legendary)', dropRate: 0.04, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ],
       'AbsoluteZero': [
          { itemName: 'Permafrost Crystal', dropRate: 1.0, minQuantity: 1, maxQuantity: 2, guaranteed: true },
          { itemName: \`Shattered \${baseNpc.name} Ice-Bone\`, dropRate: 0.85, minQuantity: 2, maxQuantity: 6, guaranteed: false },
          { itemName: 'Cryo-Stasis Gland', dropRate: 0.45, minQuantity: 1, maxQuantity: 1, guaranteed: false },
          { itemName: 'Zero-Point Energy Shard', dropRate: 0.20, minQuantity: 1, maxQuantity: 3, guaranteed: false },
          { itemName: 'Breath of the Primeval Blizzard (Legendary)', dropRate: 0.015, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ],
       'Abyssal': [
          { itemName: 'Crushing Depth-Bladder', dropRate: 1.0, minQuantity: 1, maxQuantity: 1, guaranteed: true },
          { itemName: \`Abyssal-Encrusted \${baseNpc.name} Carapace\`, dropRate: 0.70, minQuantity: 1, maxQuantity: 3, guaranteed: false },
          { itemName: 'Bioluminescent Lure', dropRate: 0.60, minQuantity: 1, maxQuantity: 2, guaranteed: false },
          { itemName: 'Void-Black Scales', dropRate: 0.40, minQuantity: 3, maxQuantity: 8, guaranteed: false },
          { itemName: 'Echo of the Nightmare Leviathan (Legendary)', dropRate: 0.025, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ],
       'LocalizedGravity': [
          { itemName: 'Singularity Core', dropRate: 1.0, minQuantity: 1, maxQuantity: 1, guaranteed: true },
          { itemName: \`Gravity-Dense \${baseNpc.name} Matter\`, dropRate: 0.80, minQuantity: 2, maxQuantity: 5, guaranteed: false },
          { itemName: 'Floating Bone Fragment', dropRate: 0.65, minQuantity: 1, maxQuantity: 4, guaranteed: false },
          { itemName: 'Anti-Graviton Gland', dropRate: 0.30, minQuantity: 1, maxQuantity: 1, guaranteed: false },
          { itemName: 'Mass-Altering Catalyst (Legendary)', dropRate: 0.03, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ],
       'SubatomicResonance': [
          { itemName: 'Probability Core', dropRate: 1.0, minQuantity: 1, maxQuantity: 1, guaranteed: true },
          { itemName: \`Phase-Shifted \${baseNpc.name} Dust\`, dropRate: 0.90, minQuantity: 3, maxQuantity: 10, guaranteed: false },
          { itemName: 'Entangled Neural Pathway', dropRate: 0.55, minQuantity: 1, maxQuantity: 2, guaranteed: false },
          { itemName: 'Quantum Flux Capacitor', dropRate: 0.25, minQuantity: 1, maxQuantity: 1, guaranteed: false },
          { itemName: 'Unstable Resonant Crystal (Legendary)', dropRate: 0.01, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ]
    };

    const specificLoot = environmentLootDict[stressType] || [
        { itemName: \`\${stressType} Anomaly Core\`, dropRate: 1.0, minQuantity: 1, maxQuantity: 1, guaranteed: true },
        { itemName: \`Mutated \${baseNpc.name} Tissue\`, dropRate: 0.8, minQuantity: 1, maxQuantity: 4, guaranteed: false },
        { itemName: 'Mythical Artifact Fragment', dropRate: 0.05, minQuantity: 1, maxQuantity: 1, guaranteed: false }
    ];

    const newNpc: NPC = {
       ...baseNpc,
       id: uuidv4(),
       name: newName,
       title: \`Hazard Level EX: \${stressType} Metamorphosis\`,
       description: \`[WARNING: CRITICAL MUTATION DETECTED]\\nA horrifying evolution of a \${baseNpc.name}, forced to adapt by extreme \${stressType} environments. Its cellular structure has completely rewritten itself to survive and dominate this domain.\`,
       stats: {
          hp: Math.floor(baseNpc.stats.hp * 2.8),
          mp: Math.floor(baseNpc.stats.mp * 1.8),
          strength: Math.floor(baseNpc.stats.strength * 2.2),
          agility: Math.floor(baseNpc.stats.agility * 1.5),
          intelligence: Math.floor(baseNpc.stats.intelligence * 2.0),
       },
       behavior: 'Hyper-Aggressive (Apex Predator)',
       lootTableId: '', // Will generate a new loot table below
       isMonster: true,
       spawnConditions: \`[Require Environment: \${stressType} Hazard Zone - Level 5+]\`,
       phaseTransitions: '75% HP: Activates Hazard Aura | 25% HP: Enters Critical Metamorphosis Overdrive'
    };

    // Auto-generate legendary loot table for this new evolution
    const newLoot: LootTable = {
       id: uuidv4(),
       name: \`\${newName} - \${stressType} Droptable\`,
       drops: specificLoot
    };

    setLootTables([...lootTables, newLoot]);
    newNpc.lootTableId = newLoot.id;

    setNpcs([...npcs, newNpc]);
    setSelectedNpcId(newNpc.id);
  };`;

content = content.replace(/  const handleEvolveMonster = \(baseNpc\: NPC, stressType\: string\) => \{[\s\S]*?setSelectedNpcId\(newNpc\.id\);\n  \};/, replacement);

fs.writeFileSync('src/components/NPCEditor.tsx', content);
