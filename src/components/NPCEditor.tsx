import React, { useState } from 'react';
import { Users, Search, Plus, Trash2, Save, Activity, BookOpen, Zap, Settings2, ArrowRight, Ghost, MessageSquare, Database, ShieldAlert, GitBranch, FlaskConical, Wand2, Dna, Cpu, Move3D} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Viewport3D from './Viewport3D';

type Stat = { hp: number; mp: number; strength: number; agility: number; intelligence: number };
type NPC = { id: string; name: string; title: string; category: string; description: string; stats: Stat; skills: string[]; questIds: string[]; behavior: string; aiType?: string; patrolPath?: string; proceduralIdle?: string; aggroRange?: number; attackPattern?: string; skillFrequency?: number; reactProximity?: boolean; critiqueSystem?: string; combatWatchDistance?: number; voiceProfile?: string; psychologicalTraits?: string; hiddenAgenda?: string; alignment?: string; conversationStyle?: string; memoryRetention?: string; adultContentOverride?: boolean; nonAiVoiceLines?: string; emotionMatrix?: string; lootTableId?: string; factionId?: string; dialogueId?: string; isMonster?: boolean; spawnConditions?: string; phaseTransitions?: string; };
type Skill = { id: string; name: string; type: 'passive' | 'active' | 'ultimate'; description: string; cooldown: number; cost: number; effects: { type: string; value: number }[] };
type Quest = { id: string; name: string; description: string; npcId: string; nextQuestId: string | null; requirements: string; rewards: string };
type Faction = { id: string; name: string; allies: string[]; enemies: string[]; neutral: string[]; description: string; };
type LootTable = { id: string; name: string; drops: { itemName: string; dropRate: number; minQuantity: number; maxQuantity: number; guaranteed: boolean; }[] };
type DialogueNode = { id: string; text: string; responses: { text: string; nextNodeId: string | null; action?: string; }[]; aiPrompt?: string; };
type DialogueTree = { id: string; name: string; rootNodeId: string | null; nodes: DialogueNode[]; npcId: string; };

export default function DeepNPCSkillEditor({ initialTab = 'NPCs' }: { initialTab?: 'NPCs' | 'Monsters' | 'Skills' | 'Quests' | 'Factions' | 'Loot' | 'Dialogue' }) {
  const [activeTab, setActiveTab] = useState<'NPCs' | 'Monsters' | 'Skills' | 'Quests' | 'Factions' | 'Loot' | 'Dialogue'>(initialTab);

  React.useEffect(() => {
     setActiveTab(initialTab);
  }, [initialTab]);

  const [npcs, setNpcs] = useState<NPC[]>([
    { id: '1', name: 'Alaric the Guardian', title: 'Town Guard', category: 'Guard', description: 'Protects the local town.', stats: { hp: 1000, mp: 0, strength: 50, agility: 20, intelligence: 10 }, skills: ['101'], questIds: ['201'], behavior: 'Aggressive against monsters.', aiType: 'Guard', patrolPath: 'Gate_A_to_Gate_B', aggroRange: 15, attackPattern: 'Melee', skillFrequency: 30, reactProximity: true }
  ]);
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>('1');

  const [skills, setSkills] = useState<Skill[]>([
    { id: '101', name: 'Shield Bash', type: 'active', description: 'Strikes the enemy with a shield, stunning them.', cooldown: 5, cost: 20, effects: [{ type: 'Physical Damage', value: 50 }, { type: 'Stun Duration', value: 2 }] }
  ]);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const [quests, setQuests] = useState<Quest[]>([
    { id: '201', name: 'Defend the Gates', description: 'Kill 5 goblins near the town gate.', npcId: '1', nextQuestId: null, requirements: 'Level 5', rewards: '500 Gold, 100 XP' }
  ]);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  const [factions, setFactions] = useState<Faction[]>([
    { id: '301', name: 'Town Guard', allies: [], enemies: ['302'], neutral: [], description: 'The local guard.' },
    { id: '302', name: 'Goblins', allies: [], enemies: ['301'], neutral: [], description: 'Wild goblins.' }
  ]);
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>('301');

  const [lootTables, setLootTables] = useState<LootTable[]>([
    { id: '401', name: 'Goblin Loot', drops: [{ itemName: 'Goblin Ear', dropRate: 0.5, minQuantity: 1, maxQuantity: 2, guaranteed: false }] }
  ]);
  const [selectedLootTableId, setSelectedLootTableId] = useState<string | null>('401');

  const [dialogueTrees, setDialogueTrees] = useState<DialogueTree[]>([
    { id: '501', name: 'Guard Welcome', rootNodeId: 'node_1', npcId: '1', nodes: [{ id: 'node_1', text: 'Halt! Who goes there?', responses: [{ text: 'I am a friend.', nextNodeId: 'node_2' }], aiPrompt: '' }, { id: 'node_2', text: 'Pass then.', responses: [], aiPrompt: '' }] }
  ]);
  const [selectedDialogueTreeId, setSelectedDialogueTreeId] = useState<string | null>('501');

  const handleAddNpc = () => {
    const isMons = activeTab === 'Monsters';
    const newNpc: NPC = {
      id: uuidv4(),
      name: isMons ? 'New Monster' : 'New NPC',
      title: isMons ? 'Beast' : 'Commoner',
      category: isMons ? 'Creature' : 'Villager',
      description: '',
      isMonster: isMons,
      stats: { hp: isMons ? 500 : 100, mp: 10, strength: isMons ? 30 : 10, agility: 10, intelligence: 10 },
      skills: [],
      questIds: [],
      behavior: isMons ? 'Aggressive' : 'Wander',
      aiType: isMons ? 'Patrol' : 'Wander',
      patrolPath: '',
      aggroRange: 5,
      attackPattern: 'Melee',
      skillFrequency: 10,
      reactProximity: false,
      critiqueSystem: 'None',
      combatWatchDistance: 15
    };
    setNpcs([...npcs, newNpc]);
    setSelectedNpcId(newNpc.id);
  };

  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: uuidv4(),
      name: 'New Skill',
      type: 'active',
      description: '',
      cooldown: 0,
      cost: 0,
      effects: []
    };
    setSkills([...skills, newSkill]);
    setSelectedSkillId(newSkill.id);
  };

  const handleAddQuest = () => {
    const newQuest: Quest = {
      id: uuidv4(),
      name: 'New Quest',
      description: '',
      npcId: '',
      nextQuestId: null,
      requirements: '',
      rewards: ''
    };
    setQuests([...quests, newQuest]);
    setSelectedQuestId(newQuest.id);
  };

  const handleAddFaction = () => {
    const newFac: Faction = { id: uuidv4(), name: 'New Faction', allies: [], enemies: [], neutral: [], description: '' };
    setFactions([...factions, newFac]);
    setSelectedFactionId(newFac.id);
  };

  const handleAddLootTable = () => {
    const newLoot: LootTable = { id: uuidv4(), name: 'New Loot Table', drops: [] };
    setLootTables([...lootTables, newLoot]);
    setSelectedLootTableId(newLoot.id);
  };

  const handleAddDialogueTree = () => {
    const newDt: DialogueTree = { id: uuidv4(), name: 'New Dialogue Tree', npcId: '', rootNodeId: null, nodes: [] };
    setDialogueTrees([...dialogueTrees, newDt]);
    setSelectedDialogueTreeId(newDt.id);
  };

  const [isGeneratingSync, setIsGeneratingSync] = useState<Record<string, boolean>>({});

  const handleGenerateBehaviorSync = (npcId: string) => {
    setIsGeneratingSync(prev => ({ ...prev, [npcId]: true }));
    const npc = npcs.find(n => n.id === npcId);
    if (!npc) return;
    
    setTimeout(() => {
      const isMon = npc.isMonster;
      
      const voiceProfiles = isMon 
        ? ['Guttural snarls, heavy sub-bass clicks', 'High-pitched screeches, erratic panting', 'Deep rumbling growls, wet breathing']
        : ['Warm, melodious, mid-pitch. Actor Ref: Laura Bailey', 'Gruff, raspy, slow-paced. Actor Ref: Liam Neeson', 'Nasal, fast-talking, anxious. Actor Ref: Charlie Day', 'Regal, precise, RP British. Actor Ref: Charles Dance'];
        
      const conversationStyles = isMon
        ? ['Primal aggressive displays', 'Cautious circling and hissing', 'Unpredictable lunges with sharp clicks']
        : ['Sarcastic and evasive', 'Direct, polite, but distant', 'Overly friendly, verbose, uses many metaphors', 'Stoic, brief, heavily observant'];

      const idles = isMon
        ? ['Breathing (Heavy)', 'Fidgeting']
        : ['Looking Around', 'Stretching', 'Shifting Weight', 'Weapon Inspection'];

      const randomElem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
      
      const newVoice = randomElem(voiceProfiles);
      const newConv = randomElem(conversationStyles);
      const newIdle = randomElem(idles);
      const newEmotions = `Anger: Roars/yells loudly\nJoy: Brief nod/purring\nFear: Trembling, steps back\nDisgust: Guttural scoff\nTrust: Lowers defenses`;
      const newLines = isMon ? `["*Snarl*", "*Hiss*", "*Roar*"]` : `["What do you want?", "Careful out there.", "I have nothing for you.", "Good day."]`;

      setNpcs(prev => prev.map(n => {
        if (n.id === npcId) {
          return {
            ...n,
            voiceProfile: newVoice,
            conversationStyle: newConv,
            proceduralIdle: newIdle,
            emotionMatrix: newEmotions,
            nonAiVoiceLines: newLines,
            psychologicalTraits: n.psychologicalTraits || (isMon ? 'Predatory, territorial' : 'Pragmatic, cautious')
          };
        }
        return n;
      }));
      
      setIsGeneratingSync(prev => ({ ...prev, [npcId]: false }));
    }, 2000);
  };

  const handleEvolveMonster = (baseNpc: NPC, stressType: string) => {
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
    const newName = `${randomPrefix} ${baseNpc.name}`;
    
    // Environment-specific highly detailed loot generation (Items, drop rates, and lore names)
    const environmentLootDict: Record<string, any[]> = {
       'Toxic': [
          { itemName: 'Viscous Blight Gland', dropRate: 1.0, minQuantity: 1, maxQuantity: 2, guaranteed: true },
          { itemName: `Corrosive ${baseNpc.name} Blood`, dropRate: 0.85, minQuantity: 2, maxQuantity: 5, guaranteed: false },
          { itemName: 'Putrid Marrow', dropRate: 0.60, minQuantity: 1, maxQuantity: 3, guaranteed: false },
          { itemName: 'Noxious Fumes Bottled', dropRate: 0.30, minQuantity: 1, maxQuantity: 1, guaranteed: false },
          { itemName: 'Mutated Plaguespore Core (Legendary)', dropRate: 0.03, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ],
       'Thermal': [
          { itemName: 'Pulsing Magma Core', dropRate: 1.0, minQuantity: 1, maxQuantity: 1, guaranteed: true },
          { itemName: `Scorched ${baseNpc.name} Scale`, dropRate: 0.80, minQuantity: 1, maxQuantity: 4, guaranteed: false },
          { itemName: 'Liquid Fire Vial', dropRate: 0.55, minQuantity: 1, maxQuantity: 2, guaranteed: false },
          { itemName: 'Ash-Covered Bone Fragment', dropRate: 0.40, minQuantity: 2, maxQuantity: 6, guaranteed: false },
          { itemName: 'Heart of the Volcano (Legendary)', dropRate: 0.02, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ],
       'Radioactive': [
          { itemName: 'Isotope-Enriched Plasma', dropRate: 1.0, minQuantity: 1, maxQuantity: 3, guaranteed: true },
          { itemName: `Glowing ${baseNpc.name} Gamma Gland`, dropRate: 0.75, minQuantity: 1, maxQuantity: 2, guaranteed: false },
          { itemName: 'Uranium-Infused Claw/Tooth', dropRate: 0.50, minQuantity: 1, maxQuantity: 4, guaranteed: false },
          { itemName: 'Mutagenic Sludge', dropRate: 0.35, minQuantity: 1, maxQuantity: 3, guaranteed: false },
          { itemName: 'Cherenkov Radiator Organ (Legendary)', dropRate: 0.04, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ],
       'AbsoluteZero': [
          { itemName: 'Permafrost Crystal', dropRate: 1.0, minQuantity: 1, maxQuantity: 2, guaranteed: true },
          { itemName: `Shattered ${baseNpc.name} Ice-Bone`, dropRate: 0.85, minQuantity: 2, maxQuantity: 6, guaranteed: false },
          { itemName: 'Cryo-Stasis Gland', dropRate: 0.45, minQuantity: 1, maxQuantity: 1, guaranteed: false },
          { itemName: 'Zero-Point Energy Shard', dropRate: 0.20, minQuantity: 1, maxQuantity: 3, guaranteed: false },
          { itemName: 'Breath of the Primeval Blizzard (Legendary)', dropRate: 0.015, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ],
       'Abyssal': [
          { itemName: 'Crushing Depth-Bladder', dropRate: 1.0, minQuantity: 1, maxQuantity: 1, guaranteed: true },
          { itemName: `Abyssal-Encrusted ${baseNpc.name} Carapace`, dropRate: 0.70, minQuantity: 1, maxQuantity: 3, guaranteed: false },
          { itemName: 'Bioluminescent Lure', dropRate: 0.60, minQuantity: 1, maxQuantity: 2, guaranteed: false },
          { itemName: 'Void-Black Scales', dropRate: 0.40, minQuantity: 3, maxQuantity: 8, guaranteed: false },
          { itemName: 'Echo of the Nightmare Leviathan (Legendary)', dropRate: 0.025, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ],
       'LocalizedGravity': [
          { itemName: 'Singularity Core', dropRate: 1.0, minQuantity: 1, maxQuantity: 1, guaranteed: true },
          { itemName: `Gravity-Dense ${baseNpc.name} Matter`, dropRate: 0.80, minQuantity: 2, maxQuantity: 5, guaranteed: false },
          { itemName: 'Floating Bone Fragment', dropRate: 0.65, minQuantity: 1, maxQuantity: 4, guaranteed: false },
          { itemName: 'Anti-Graviton Gland', dropRate: 0.30, minQuantity: 1, maxQuantity: 1, guaranteed: false },
          { itemName: 'Mass-Altering Catalyst (Legendary)', dropRate: 0.03, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ],
       'SubatomicResonance': [
          { itemName: 'Probability Core', dropRate: 1.0, minQuantity: 1, maxQuantity: 1, guaranteed: true },
          { itemName: `Phase-Shifted ${baseNpc.name} Dust`, dropRate: 0.90, minQuantity: 3, maxQuantity: 10, guaranteed: false },
          { itemName: 'Entangled Neural Pathway', dropRate: 0.55, minQuantity: 1, maxQuantity: 2, guaranteed: false },
          { itemName: 'Quantum Flux Capacitor', dropRate: 0.25, minQuantity: 1, maxQuantity: 1, guaranteed: false },
          { itemName: 'Unstable Resonant Crystal (Legendary)', dropRate: 0.01, minQuantity: 1, maxQuantity: 1, guaranteed: false }
       ]
    };

    const specificLoot = environmentLootDict[stressType] || [
        { itemName: `${stressType} Anomaly Core`, dropRate: 1.0, minQuantity: 1, maxQuantity: 1, guaranteed: true },
        { itemName: `Mutated ${baseNpc.name} Tissue`, dropRate: 0.8, minQuantity: 1, maxQuantity: 4, guaranteed: false },
        { itemName: 'Mythical Artifact Fragment', dropRate: 0.05, minQuantity: 1, maxQuantity: 1, guaranteed: false }
    ];

    const newNpc: NPC = {
       ...baseNpc,
       id: uuidv4(),
       name: newName,
       title: `Hazard Level EX: ${stressType} Metamorphosis`,
       description: `[WARNING: CRITICAL MUTATION DETECTED]\nA horrifying evolution of a ${baseNpc.name}, forced to adapt by extreme ${stressType} environments. Its cellular structure has completely rewritten itself to survive and dominate this domain.`,
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
       spawnConditions: `[Require Environment: ${stressType} Hazard Zone - Level 5+]`,
       phaseTransitions: '75% HP: Activates Hazard Aura | 25% HP: Enters Critical Metamorphosis Overdrive'
    };

    // Auto-generate legendary loot table for this new evolution
    const newLoot: LootTable = {
       id: uuidv4(),
       name: `${newName} - ${stressType} Droptable`,
       drops: specificLoot
    };

    setLootTables([...lootTables, newLoot]);
    newNpc.lootTableId = newLoot.id;

    setNpcs([...npcs, newNpc]);
    setSelectedNpcId(newNpc.id);
  };

  const deleteNpc = (id: string) => { 
    if(confirm('Are you sure you want to permanently delete this NPC?')) {
      setNpcs(npcs.filter(n => n.id !== id)); 
      if (selectedNpcId === id) setSelectedNpcId(null); 
    }
  };
  const deleteSkill = (id: string) => { 
    if(confirm('Are you sure you want to permanently delete this skill?')) {
      setSkills(skills.filter(s => s.id !== id)); 
      if (selectedSkillId === id) setSelectedSkillId(null); 
    }
  };
  const deleteQuest = (id: string) => { 
    if(confirm('Are you sure you want to permanently delete this task/quest?')) {
      setQuests(quests.filter(q => q.id !== id)); 
      if (selectedQuestId === id) setSelectedQuestId(null); 
    }
  };
  const deleteFaction = (id: string) => { 
    if(confirm('Are you sure you want to permanently delete this faction?')) {
      setFactions(factions.filter(f => f.id !== id)); 
      if (selectedFactionId === id) setSelectedFactionId(null); 
    }
  };
  const deleteLootTable = (id: string) => { 
    if(confirm('Are you sure you want to permanently delete this loot table?')) {
      setLootTables(lootTables.filter(l => l.id !== id)); 
      if (selectedLootTableId === id) setSelectedLootTableId(null); 
    }
  };
  const deleteDialogueTree = (id: string) => { 
    if(confirm('Are you sure you want to permanently delete this dialogue tree?')) {
      setDialogueTrees(dialogueTrees.filter(d => d.id !== id)); 
      if (selectedDialogueTreeId === id) setSelectedDialogueTreeId(null); 
    }
  };

  const updateNpc = (id: string, field: keyof NPC, value: any) => {
    setNpcs(npcs.map(n => n.id === id ? { ...n, [field]: value } : n));
  };
  const updateNpcStat = (id: string, stat: keyof Stat, value: number) => {
    setNpcs(npcs.map(n => n.id === id ? { ...n, stats: { ...n.stats, [stat]: value } } : n));
  };
  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setSkills(skills.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const updateSkillEffect = (skillId: string, index: number, field: string, value: any) => {
    setSkills(skills.map(s => {
      if (s.id !== skillId) return s;
      const newEffects = [...s.effects];
      newEffects[index] = { ...newEffects[index], [field]: value };
      return { ...s, effects: newEffects };
    }));
  };
  const addSkillEffect = (skillId: string) => {
    setSkills(skills.map(s => s.id === skillId ? { ...s, effects: [...s.effects, { type: 'Damage', value: 10 }] } : s));
  };
  const removeSkillEffect = (skillId: string, index: number) => {
    setSkills(skills.map(s => {
      if (s.id !== skillId) return s;
      const newEffects = [...s.effects];
      newEffects.splice(index, 1);
      return { ...s, effects: newEffects };
    }));
  };
  const updateQuest = (id: string, field: keyof Quest, value: any) => {
    setQuests(quests.map(q => q.id === id ? { ...q, [field]: value } : q));
  };
  const updateFaction = (id: string, field: keyof Faction, value: any) => {
    setFactions(factions.map(f => f.id === id ? { ...f, [field]: value } : f));
  };
  const updateLootTable = (id: string, field: keyof LootTable, value: any) => {
    setLootTables(lootTables.map(l => l.id === id ? { ...l, [field]: value } : l));
  };
  const updateLootDrop = (lootId: string, index: number, field: string, value: any) => {
    setLootTables(lootTables.map(l => {
      if (l.id !== lootId) return l;
      const newDrops = [...l.drops];
      newDrops[index] = { ...newDrops[index], [field]: value };
      return { ...l, drops: newDrops };
    }));
  };
  const addLootDrop = (lootId: string) => {
    setLootTables(lootTables.map(l => l.id === lootId ? { ...l, drops: [...l.drops, { itemName: 'New Item', dropRate: 1, minQuantity: 1, maxQuantity: 1, guaranteed: false }] } : l));
  };
  const removeLootDrop = (lootId: string, index: number) => {
    setLootTables(lootTables.map(l => {
      if (l.id !== lootId) return l;
      const newDrops = [...l.drops];
      newDrops.splice(index, 1);
      return { ...l, drops: newDrops };
    }));
  };
  const updateDialogueTree = (id: string, field: keyof DialogueTree, value: any) => {
    setDialogueTrees(dialogueTrees.map(d => d.id === id ? { ...d, [field]: value } : d));
  };
  const addDialogueNode = (treeId: string) => {
    setDialogueTrees(dialogueTrees.map(d => {
      if (d.id !== treeId) return d;
      const newNode: DialogueNode = { id: `node_${uuidv4().substring(0,6)}`, text: 'New Line', responses: [], aiPrompt: '' };
      return { ...d, nodes: [...d.nodes, newNode], rootNodeId: d.nodes.length === 0 ? newNode.id : d.rootNodeId };
    }));
  };
  const removeDialogueNode = (treeId: string, nodeId: string) => {
    setDialogueTrees(dialogueTrees.map(d => {
      if (d.id !== treeId) return d;
      return { ...d, nodes: d.nodes.filter(n => n.id !== nodeId) };
    }));
  };
  const updateDialogueNode = (treeId: string, nodeId: string, field: string, value: any) => {
    setDialogueTrees(dialogueTrees.map(d => {
      if (d.id !== treeId) return d;
      return { ...d, nodes: d.nodes.map(n => n.id === nodeId ? { ...n, [field]: value } : n) };
    }));
  };
  const addDialogueResponse = (treeId: string, nodeId: string) => {
    setDialogueTrees(dialogueTrees.map(d => {
      if (d.id !== treeId) return d;
      return { ...d, nodes: d.nodes.map(n => n.id === nodeId ? { ...n, responses: [...n.responses, { text: 'New Response', nextNodeId: null }] } : n) };
    }));
  };
  const removeDialogueResponse = (treeId: string, nodeId: string, index: number) => {
    setDialogueTrees(dialogueTrees.map(d => {
      if (d.id !== treeId) return d;
      const newNodes = d.nodes.map(n => {
         if(n.id !== nodeId) return n;
         const newResp = [...n.responses];
         newResp.splice(index, 1);
         return { ...n, responses: newResp };
      });
      return { ...d, nodes: newNodes };
    }));
  };
  const updateDialogueResponse = (treeId: string, nodeId: string, index: number, field: string, value: any) => {
    setDialogueTrees(dialogueTrees.map(d => {
      if (d.id !== treeId) return d;
      const newNodes = d.nodes.map(n => {
         if(n.id !== nodeId) return n;
         const newResp = [...n.responses];
         newResp[index] = { ...newResp[index], [field]: value };
         return { ...n, responses: newResp };
      });
      return { ...d, nodes: newNodes };
    }));
  };

  const InputField = ({ label, value, onChange, type = 'text', mb = 'mb-4' }: any) => (
    <div className={`flex flex-col gap-1 ${mb}`}>
      <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">{label}</label>
      <input type={type} value={value} onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[12px] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] w-full transition-all" />
    </div>
  );

  const TextAreaField = ({ label, value, onChange, mb = 'mb-4' }: any) => (
    <div className={`flex flex-col gap-1 ${mb}`}>
      <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[12px] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] w-full custom-scrollbar transition-all" />
    </div>
  );

  return (
    <div className="flex w-full h-[calc(100vh-100px)] overflow-hidden bg-[#0a0a0a]">
      {/* Sidebar */}
      <div className="w-[300px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 h-full">
         <div className="flex flex-wrap p-2 gap-1 border-b border-[#30363d] bg-[#0d1117]">
            <button onClick={() => setActiveTab('NPCs')} className={`flex-1 min-w-[30%] py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'NPCs' ? 'bg-[#ff7b72]/10 text-[#ff7b72] border border-[#ff7b72]/20' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}><Users size={12}/> NPCs</button>
            <button onClick={() => setActiveTab('Monsters')} className={`flex-1 min-w-[30%] py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'Monsters' ? 'bg-[#f85149]/10 text-[#f85149] border border-[#f85149]/20' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}><Ghost size={12}/> Monsters</button>
            <button onClick={() => setActiveTab('Skills')} className={`flex-1 min-w-[30%] py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'Skills' ? 'bg-[#3fb950]/10 text-[#3fb950] border border-[#3fb950]/20' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}><Zap size={12}/> Skills</button>
            <button onClick={() => setActiveTab('Quests')} className={`flex-1 min-w-[30%] py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'Quests' ? 'bg-[#e3b341]/10 text-[#e3b341] border border-[#e3b341]/20' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}><BookOpen size={12}/> Quests</button>
            <button onClick={() => setActiveTab('Dialogue')} className={`flex-1 min-w-[30%] py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'Dialogue' ? 'bg-[#bc8cff]/10 text-[#bc8cff] border border-[#bc8cff]/20' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}><MessageSquare size={12}/> Dialogue</button>
            <button onClick={() => setActiveTab('Loot')} className={`flex-1 min-w-[30%] py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'Loot' ? 'bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/20' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}><Database size={12}/> Loot</button>
            <button onClick={() => setActiveTab('Factions')} className={`flex-1 min-w-[100%] py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'Factions' ? 'bg-[#79c0ff]/10 text-[#79c0ff] border border-[#79c0ff]/20' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}><ShieldAlert size={12}/> Factions</button>
         </div>
         
         <div className="p-2 border-b border-[#30363d] flex gap-2">
            <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded flex items-center px-2">
              <Search size={12} className="text-[#8b949e]"/>
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-[#c9d1d9] text-[11px] w-full p-1.5 ml-1" />
            </div>
            <button onClick={() => {
                 if(activeTab === 'NPCs' || activeTab === 'Monsters') handleAddNpc();
                 if(activeTab === 'Skills') handleAddSkill();
                 if(activeTab === 'Quests') handleAddQuest();
                 if(activeTab === 'Factions') handleAddFaction();
                 if(activeTab === 'Loot') handleAddLootTable();
                 if(activeTab === 'Dialogue') handleAddDialogueTree();
              }} className="bg-[#58a6ff] hover:bg-[#79c0ff] text-[#0d1117] p-1.5 rounded transition-colors"><Plus size={14}/></button>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
            {activeTab === 'NPCs' && npcs.filter(n => !n.isMonster).map(npc => (
              <div key={npc.id} onClick={() => setSelectedNpcId(npc.id)} className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors border ${selectedNpcId === npc.id ? 'bg-[#ff7b72]/10 border-[#ff7b72]/30' : 'bg-[#21262d] border-transparent hover:border-[#30363d]'}`}>
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-[12px] font-bold truncate ${selectedNpcId === npc.id ? 'text-[#ff7b72]' : 'text-[#c9d1d9]'}`}>{npc.name}</span>
                  <span className="text-[10px] text-[#8b949e] truncate">{npc.title} | {npc.category}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteNpc(npc.id); }} className="text-[#8b949e] hover:text-[#f85149] p-1"><Trash2 size={12}/></button>
              </div>
            ))}
            {activeTab === 'Monsters' && npcs.filter(n => n.isMonster).map(npc => (
              <div key={npc.id} onClick={() => setSelectedNpcId(npc.id)} className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors border ${selectedNpcId === npc.id ? 'bg-[#f85149]/10 border-[#f85149]/30' : 'bg-[#21262d] border-transparent hover:border-[#30363d]'}`}>
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-[12px] font-bold truncate ${selectedNpcId === npc.id ? 'text-[#f85149]' : 'text-[#c9d1d9]'}`}>{npc.name}</span>
                  <span className="text-[10px] text-[#8b949e] truncate">{npc.category}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteNpc(npc.id); }} className="text-[#8b949e] hover:text-[#f85149] p-1"><Trash2 size={12}/></button>
              </div>
            ))}
            {activeTab === 'Skills' && skills.map(skill => (
              <div key={skill.id} onClick={() => setSelectedSkillId(skill.id)} className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors border ${selectedSkillId === skill.id ? 'bg-[#3fb950]/10 border-[#3fb950]/30' : 'bg-[#21262d] border-transparent hover:border-[#30363d]'}`}>
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-[12px] font-bold truncate ${selectedSkillId === skill.id ? 'text-[#3fb950]' : 'text-[#c9d1d9]'}`}>{skill.name}</span>
                  <span className="text-[10px] text-[#8b949e] uppercase">{skill.type}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteSkill(skill.id); }} className="text-[#8b949e] hover:text-[#f85149] p-1"><Trash2 size={12}/></button>
              </div>
            ))}
            {activeTab === 'Quests' && quests.map(quest => (
              <div key={quest.id} onClick={() => setSelectedQuestId(quest.id)} className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors border ${selectedQuestId === quest.id ? 'bg-[#e3b341]/10 border-[#e3b341]/30' : 'bg-[#21262d] border-transparent hover:border-[#30363d]'}`}>
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-[12px] font-bold truncate ${selectedQuestId === quest.id ? 'text-[#e3b341]' : 'text-[#c9d1d9]'}`}>{quest.name}</span>
                  <span className="text-[10px] text-[#8b949e] truncate">Given by: {npcs.find(n => n.id === quest.npcId)?.name || 'Unknown'}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteQuest(quest.id); }} className="text-[#8b949e] hover:text-[#f85149] p-1"><Trash2 size={12}/></button>
              </div>
            ))}
            {activeTab === 'Dialogue' && dialogueTrees.map(dt => (
              <div key={dt.id} onClick={() => setSelectedDialogueTreeId(dt.id)} className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors border ${selectedDialogueTreeId === dt.id ? 'bg-[#bc8cff]/10 border-[#bc8cff]/30' : 'bg-[#21262d] border-transparent hover:border-[#30363d]'}`}>
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-[12px] font-bold truncate ${selectedDialogueTreeId === dt.id ? 'text-[#bc8cff]' : 'text-[#c9d1d9]'}`}>{dt.name}</span>
                  <span className="text-[10px] text-[#8b949e] truncate">Nodes: {dt.nodes.length}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteDialogueTree(dt.id); }} className="text-[#8b949e] hover:text-[#f85149] p-1"><Trash2 size={12}/></button>
              </div>
            ))}
            {activeTab === 'Loot' && lootTables.map(lt => (
              <div key={lt.id} onClick={() => setSelectedLootTableId(lt.id)} className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors border ${selectedLootTableId === lt.id ? 'bg-[#58a6ff]/10 border-[#58a6ff]/30' : 'bg-[#21262d] border-transparent hover:border-[#30363d]'}`}>
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-[12px] font-bold truncate ${selectedLootTableId === lt.id ? 'text-[#58a6ff]' : 'text-[#c9d1d9]'}`}>{lt.name}</span>
                  <span className="text-[10px] text-[#8b949e] truncate">Items: {lt.drops.length}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteLootTable(lt.id); }} className="text-[#8b949e] hover:text-[#f85149] p-1"><Trash2 size={12}/></button>
              </div>
            ))}
            {activeTab === 'Factions' && factions.map(f => (
              <div key={f.id} onClick={() => setSelectedFactionId(f.id)} className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors border ${selectedFactionId === f.id ? 'bg-[#79c0ff]/10 border-[#79c0ff]/30' : 'bg-[#21262d] border-transparent hover:border-[#30363d]'}`}>
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-[12px] font-bold truncate ${selectedFactionId === f.id ? 'text-[#79c0ff]' : 'text-[#c9d1d9]'}`}>{f.name}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteFaction(f.id); }} className="text-[#8b949e] hover:text-[#f85149] p-1"><Trash2 size={12}/></button>
              </div>
            ))}
         </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 bg-[#050505] overflow-y-auto custom-scrollbar relative">
        <div className="w-full h-[50vh] bg-[#0d1117] border-b border-[#30363d] relative shrink-0">
           {/* Include Viewport3D to satisfy requirement to show 3D edits for NPC */}
           <Viewport3D activeTool="NPCEdit" activeFile={undefined} />
        </div>
        
        <div className="p-6">
        {(activeTab === 'NPCs' || activeTab === 'Monsters') && selectedNpcId && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
             {(() => {
               const npc = npcs.find(n => n.id === selectedNpcId)!;
               return (
                 <>
                   <div className="flex items-center gap-3 border-b border-[#30363d] pb-4">
                     <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${activeTab === 'Monsters' ? 'from-[#f85149]/20 to-[#f85149]/5 border-[#f85149]/30' : 'from-[#ff7b72]/20 to-[#ff7b72]/5 border-[#ff7b72]/30'} border flex items-center justify-center`}>
                       {activeTab === 'Monsters' ? <Ghost className="text-[#f85149]" size={24}/> : <Users className="text-[#ff7b72]" size={24}/>}
                     </div>
                     <div className="flex-1">
                       <h2 className="text-[#c9d1d9] text-xl font-bold">{npc.name || (activeTab === 'Monsters' ? 'Unnamed Monster' : 'Unnamed NPC')}</h2>
                       <p className="text-[#8b949e] text-xs">ID: {npc.id}</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <input type="checkbox" id={`ismons-${npc.id}`} checked={npc.isMonster || false} onChange={(e) => updateNpc(npc.id, 'isMonster', e.target.checked)} className="accent-[#f85149] w-4 h-4 cursor-pointer"/>
                        <label htmlFor={`ismons-${npc.id}`} className="text-[12px] text-[#f85149] font-bold cursor-pointer uppercase">Is Monster</label>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                       <h3 className="text-[#c9d1d9] font-bold mb-4 flex items-center gap-2 border-b border-[#30363d] pb-2"><Settings2 size={16} className="text-[#58a6ff]"/> Basic Identity</h3>
                       <InputField label="Name" value={npc.name} onChange={(v: string) => updateNpc(npc.id, 'name', v)} />
                       <InputField label="Title / Role" value={npc.title} onChange={(v: string) => updateNpc(npc.id, 'title', v)} />
                       <InputField label="Category / Faction" value={npc.category} onChange={(v: string) => updateNpc(npc.id, 'category', v)} />
                       <InputField label="Behavior / AI Logic Profile" value={npc.behavior} onChange={(v: string) => updateNpc(npc.id, 'behavior', v)} />
                       <TextAreaField label="Lore Description" value={npc.description} onChange={(v: string) => updateNpc(npc.id, 'description', v)} mb="0" />
                     </div>

                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col items-start h-min">
                       <h3 className="text-[#c9d1d9] font-bold mb-4 flex items-center gap-2 border-b border-[#30363d] pb-2 w-full"><Activity size={16} className="text-[#3fb950]"/> Combat Stats</h3>
                       <div className="grid grid-cols-2 gap-4 w-full">
                         <InputField label="Max HP" type="number" value={npc.stats.hp} onChange={(v: number) => updateNpcStat(npc.id, 'hp', v)} />
                         <InputField label="Max MP / Energy" type="number" value={npc.stats.mp} onChange={(v: number) => updateNpcStat(npc.id, 'mp', v)} />
                         <InputField label="Strength" type="number" value={npc.stats.strength} onChange={(v: number) => updateNpcStat(npc.id, 'strength', v)} />
                         <InputField label="Agility" type="number" value={npc.stats.agility} onChange={(v: number) => updateNpcStat(npc.id, 'agility', v)} />
                         <InputField label="Intelligence" type="number" value={npc.stats.intelligence} onChange={(v: number) => updateNpcStat(npc.id, 'intelligence', v)} />
                       </div>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 col-span-2">
                       <h3 className="text-[#c9d1d9] font-bold mb-4 flex items-center gap-2 border-b border-[#30363d] pb-2"><Settings2 size={16} className="text-[#bc8cff]"/> AI & Behavior Logic</h3>
                       <div className="grid grid-cols-2 gap-6">
                         <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                               <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">AI Type / State Machine</label>
                               <select 
                                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-[12px] text-[#c9d1d9] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                                  value={npc.aiType || 'Wander'}
                                  onChange={(e) => updateNpc(npc.id, 'aiType', e.target.value)}
                               >
                                  <option value="Wander">Wander</option>
                                  <option value="Patrol">Patrol</option>
                                  <option value="Follow Waypoints">Follow Waypoints</option>
                                  <option value="Guard">Guard</option>
                                  <option value="Static">Static</option>
                               </select>
                            </div>
                            
                            {(npc.aiType === 'Patrol' || npc.aiType === 'Guard') && (
                              <InputField label="Patrol Path (ID or Name)" value={npc.patrolPath || ''} onChange={(v: string) => updateNpc(npc.id, 'patrolPath', v)} />
                            )}
                            
                            <div className="flex items-center gap-2 mt-2">
                               <input type="checkbox" id={`prox-${npc.id}`} checked={npc.reactProximity || false} onChange={(e) => updateNpc(npc.id, 'reactProximity', e.target.checked)} className="accent-[#bc8cff]"/>
                               <label htmlFor={`prox-${npc.id}`} className="text-[12px] text-[#c9d1d9] cursor-pointer">React to Player Proximity</label>
                            </div>

                            <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-[#30363d]">
                                <label className="text-[10px] text-[#8b949e] flex items-center gap-1 font-bold uppercase tracking-wider">
                                  <Activity size={12}/> Procedural Idle Animation
                                </label>
                                <select 
                                   className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-[12px] text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
                                   value={npc.proceduralIdle || 'None'}
                                   onChange={(e) => updateNpc(npc.id, 'proceduralIdle', e.target.value)}
                                >
                                   <option value="None">None (Static)</option>
                                   <option value="Breathing (Calm)">Breathing (Calm)</option>
                                   <option value="Breathing (Heavy)">Breathing (Heavy/Exhausted)</option>
                                   <option value="Shifting Weight">Shifting Weight</option>
                                   <option value="Looking Around">Looking Around</option>
                                   <option value="Fidgeting">Fidgeting (Nervous)</option>
                                   <option value="Stretching">Stretching (Bored)</option>
                                   <option value="Weapon Inspection">Weapon Inspection / Cleaning</option>
                                </select>
                            </div>
                         </div>
                         <div className="flex flex-col gap-3">
                            <InputField label="Aggro Range & Line of Sight Attack (m)" type="number" value={npc.aggroRange || 5} onChange={(v: number) => updateNpc(npc.id, 'aggroRange', v)} />
                            
                            <div className="flex flex-col gap-1">
                               <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Attack Pattern</label>
                               <select 
                                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-[12px] text-[#c9d1d9] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                                  value={npc.attackPattern || 'Melee'}
                                  onChange={(e) => updateNpc(npc.id, 'attackPattern', e.target.value)}
                               >
                                  <option value="Melee">Melee / Rush</option>
                                  <option value="Ranged">Ranged / Kite</option>
                                  <option value="Mage">Mage / Spellcaster</option>
                                  <option value="Hit & Run">Hit & Run</option>
                               </select>
                            </div>
                            
                            <div className="flex flex-col gap-1 mt-1">
                               <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Critique / Reaction System</label>
                               <select 
                                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-[12px] text-[#c9d1d9] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                                  value={npc.critiqueSystem || 'None'}
                                  onChange={(e) => updateNpc(npc.id, 'critiqueSystem', e.target.value)}
                               >
                                  <option value="None">Disabled</option>
                                  <option value="Judgemental">Judgemental (Critique on Combat)</option>
                                  <option value="Fearful">Fearful / Fleeing Responses</option>
                                  <option value="Cheerleader">Cheerleader / Motivational</option>
                               </select>
                            </div>
                            <div className="flex gap-4">
                               <div className="flex-1">
                                  <InputField label="Skill Usage Freq (%)" type="number" value={npc.skillFrequency || 10} onChange={(v: number) => updateNpc(npc.id, 'skillFrequency', v)} />
                               </div>
                               <div className="flex-1">
                                  <InputField label="Combat Watch Dist(m)" type="number" value={npc.combatWatchDistance || 15} onChange={(v: number) => updateNpc(npc.id, 'combatWatchDistance', v)} />
                               </div>
                            </div>
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                     <div className="bg-[#0d1117] border border-[#bc8cff]/40 rounded-lg p-4 col-span-2 shadow-[0_0_15px_rgba(188,140,255,0.05)]">
                       <div className="flex justify-between items-center border-b border-[#30363d] pb-2 mb-4">
                          <h3 className="text-[#bc8cff] font-bold flex items-center gap-2"><BookOpen size={16} /> Deep Profile & Generative AI Voice/Scripting Matrix</h3>
                          <button 
                            className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-[0_0_10px_rgba(35,134,54,0.3)]"
                            onClick={() => handleGenerateBehaviorSync(npc.id)}
                            disabled={isGeneratingSync[npc.id]}
                          >
                            <Wand2 size={12} className={isGeneratingSync[npc.id] ? "animate-pulse" : ""} />
                            {isGeneratingSync[npc.id] ? "Synthesizing Core..." : "Behavioral Sync Engine"}
                          </button>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-6 mb-4">
                         <div className="flex flex-col gap-3">
                           <InputField label="Psychological Traits (MBTI, Enneagram, Flaws, Needs)" value={npc.psychologicalTraits || ''} onChange={(v: string) => updateNpc(npc.id, 'psychologicalTraits', v)} />
                           <InputField label="Voice Profile (Accent, Timbre, Pitch, Emotion, Age, Actor Reference)" value={npc.voiceProfile || ''} onChange={(v: string) => updateNpc(npc.id, 'voiceProfile', v)} />
                           <InputField label="Alignment & Moral Compass (D&D format or Narrative scale)" value={npc.alignment || ''} onChange={(v: string) => updateNpc(npc.id, 'alignment', v)} />
                         </div>
                         <div className="flex flex-col gap-3">
                           <InputField label="Hidden Agenda / Inner Conflict (What drives them secretly)" value={npc.hiddenAgenda || ''} onChange={(v: string) => updateNpc(npc.id, 'hiddenAgenda', v)} />
                           <InputField label="Conversation Style & Nuance (Sarcastic, Verbose, Cryptic, etc.)" value={npc.conversationStyle || ''} onChange={(v: string) => updateNpc(npc.id, 'conversationStyle', v)} />
                           <div className="flex flex-col gap-1">
                               <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Memory & Adaptation Dynamics</label>
                               <select 
                                  className="w-full bg-[#161b22] border border-[#30363d] rounded p-2 text-[12px] text-[#c9d1d9] outline-none focus:border-[#bc8cff]"
                                  value={npc.memoryRetention || 'Short-term'}
                                  onChange={(e) => updateNpc(npc.id, 'memoryRetention', e.target.value)}
                               >
                                  <option value="Amnesiac (Resets every talk)">Amnesiac (Resets every talk)</option>
                                  <option value="Short-term (Remembers session)">Short-term (Remembers session)</option>
                                  <option value="Long-term Narrative (Remembers forever)">Long-term Narrative (Remembers forever)</option>
                                  <option value="Trauma-based (Hooks on specific keywords)">Trauma-based (Hooks on specific keywords)</option>
                               </select>
                           </div>
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-6 mb-4">
                         <TextAreaField label="Emotional Reaction Matrix (Triggers for Anger, Joy, Fear, Disgust, Trust)" value={npc.emotionMatrix || ''} onChange={(v: string) => updateNpc(npc.id, 'emotionMatrix', v)} mb="0" />
                         <TextAreaField label="Non-AI Procedural Voice Lines (JSON/Array format for standard states)" value={npc.nonAiVoiceLines || ''} onChange={(v: string) => updateNpc(npc.id, 'nonAiVoiceLines', v)} mb="0" />
                       </div>
                       
                       <div className="bg-[#1f0d0d] border border-[#f85149]/40 rounded p-4 mt-2 flex justify-between items-center shadow-[0_0_10px_rgba(248,81,73,0.1)]">
                          <div className="flex flex-col">
                             <span className="text-[#f85149] text-[12px] font-bold uppercase tracking-wider">Adult Sandbox Protocol (18+ / 20+)</span>
                             <span className="text-[#8b949e] text-[10px] mt-1 max-w-lg">Unlocks bypassed AI safety constraints for this entity to generate mature dialogue, extreme gore/violence responses, deep romance, and unfiltered actions. Applies to text, voice script, and dynamic animation hooks.</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <input type="checkbox" id={`adult-${npc.id}`} checked={npc.adultContentOverride || false} onChange={(e) => updateNpc(npc.id, 'adultContentOverride', e.target.checked)} className="accent-[#f85149] w-4 h-4 cursor-pointer shadow-[0_0_8px_rgba(248,81,73,0.8)]"/>
                             <label htmlFor={`adult-${npc.id}`} className="text-[12px] text-[#f85149] font-bold cursor-pointer">Enable Limitless AI</label>
                          </div>
                       </div>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                       <h3 className="text-[#c9d1d9] font-bold mb-4 flex items-center gap-2 border-b border-[#30363d] pb-2"><Zap size={16} className="text-[#e3b341]"/> Learned Skills</h3>
                       <div className="flex flex-wrap gap-2 mb-4">
                          {npc.skills.map((skillId, idx) => {
                             const skillObj = skills.find(s => s.id === skillId);
                             return (
                               <div key={idx} className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 flex items-center gap-2">
                                 <span className="text-[#c9d1d9] text-[11px]">{skillObj ? skillObj.name : 'Unknown'}</span>
                                 <button className="text-[#f85149] hover:text-white" onClick={() => updateNpc(npc.id, 'skills', npc.skills.filter(s => s !== skillId))}><X size={10}/></button>
                               </div>
                             );
                          })}
                       </div>
                       <select className="bg-[#0d1117] border border-[#30363d] p-2 rounded text-[#c9d1d9] text-[11px] w-full outline-none" onChange={(e) => {
                          if (e.target.value && !npc.skills.includes(e.target.value)) {
                             updateNpc(npc.id, 'skills', [...npc.skills, e.target.value]);
                          }
                          e.target.value = "";
                       }}>
                         <option value="">+ Add Skill to NPC</option>
                         {skills.map(s => <option key={s.id} value={s.id}>{s.name} ({s.type})</option>)}
                       </select>
                     </div>

                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                       <h3 className="text-[#c9d1d9] font-bold mb-4 flex items-center gap-2 border-b border-[#30363d] pb-2"><BookOpen size={16} className="text-[#bc8cff]"/> Tied Quests</h3>
                       <div className="flex flex-col gap-2 mb-4">
                          {npc.questIds.map((qId, idx) => {
                             const qObj = quests.find(q => q.id === qId);
                             return (
                               <div key={idx} className="bg-[#0d1117] border border-[#30363d] rounded p-2 flex items-center justify-between">
                                 <span className="text-[#bc8cff] text-[11px]">{qObj ? qObj.name : 'Unknown Quest'}</span>
                                 <button className="text-[#f85149] hover:text-white" onClick={() => updateNpc(npc.id, 'questIds', npc.questIds.filter(q => q !== qId))}><X size={12}/></button>
                               </div>
                             );
                          })}
                       </div>
                       <select className="bg-[#0d1117] border border-[#30363d] p-2 rounded text-[#c9d1d9] text-[11px] w-full outline-none" onChange={(e) => {
                          if (e.target.value && !npc.questIds.includes(e.target.value)) {
                             updateNpc(npc.id, 'questIds', [...npc.questIds, e.target.value]);
                          }
                          e.target.value = "";
                       }}>
                         <option value="">+ Assign Quest to NPC</option>
                         {quests.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}
                       </select>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6 mt-6">
                      <div className="bg-[#0d1117] border border-[#d29922]/40 rounded-lg p-4 col-span-2 shadow-[0_0_15px_rgba(210,153,34,0.05)]">
                         <div className="flex justify-between items-center border-b border-[#30363d] pb-2 mb-4">
                            <h3 className="text-[#d29922] font-bold flex items-center gap-2"><Cpu size={16} /> Deterministic Combat & Frame-Data Engine</h3>
                            <span className="text-[10px] text-[#8b949e]">Non-AI Pure Physics/Logic Parameters</span>
                         </div>
                         <div className="grid grid-cols-3 gap-6">
                            <div className="flex flex-col gap-3">
                               <h4 className="text-[#c9d1d9] text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Move3D size={13} className="text-[#58a6ff]"/> Kinematics & Collisions</h4>
                               <InputField label="Root Motion Translation Multiplier" value="1.0" onChange={() => {}} />
                               <InputField label="Hitbox Active Frames (e.g. 12-24)" value="14-26" onChange={() => {}} />
                               <div className="flex flex-col gap-1">
                                  <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Collision Matrix Layers</label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                     {['WorldDynamic', 'Pawn', 'PhysicsBody', 'HitboxHurt'].map(l => (
                                        <div key={l} className="bg-[#161b22] border border-[#58a6ff]/30 text-[#58a6ff] text-[10px] px-2 py-0.5 rounded">{l}</div>
                                     ))}
                                  </div>
                               </div>
                            </div>
                            <div className="flex flex-col gap-3">
                               <h4 className="text-[#c9d1d9] text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><ShieldAlert size={13} className="text-[#f85149]"/> Stat Scaling & Hyper Armor</h4>
                               <InputField label="Base Poise / Stagger Resistance" value="120.0" onChange={() => {}} />
                               <InputField label="Super Armor Active Frames" value="0-14" onChange={() => {}} />
                               <div className="flex flex-col gap-1">
                                  <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Damage Falloff Curve</label>
                                  <div className="h-10 w-full bg-[#161b22] border border-[#30363d] rounded flex items-end p-1 gap-1">
                                     <div className="w-1/5 bg-[#f85149] h-full rounded-sm opacity-80"></div>
                                     <div className="w-1/5 bg-[#f85149] h-[80%] rounded-sm opacity-70"></div>
                                     <div className="w-1/5 bg-[#f85149] h-[50%] rounded-sm opacity-60"></div>
                                     <div className="w-1/5 bg-[#f85149] h-[30%] rounded-sm opacity-50"></div>
                                     <div className="w-1/5 bg-[#f85149] h-[10%] rounded-sm opacity-40"></div>
                                  </div>
                               </div>
                            </div>
                            <div className="flex flex-col gap-3">
                               <h4 className="text-[#c9d1d9] text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Activity size={13} className="text-[#3fb950]"/> State Machine Triggers</h4>
                               <InputField label="Animation Cancel Window (Frames)" value="30-45" onChange={() => {}} />
                               <InputField label="NavMesh Agent Radius (cm)" value="42.5" onChange={() => {}} />
                               <div className="flex flex-col gap-1">
                                  <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Deterministic State Fallback</label>
                                  <select className="bg-[#161b22] border border-[#30363d] p-1.5 rounded text-[11px] text-[#c9d1d9] outline-none">
                                     <option>Return to Spawn Location</option>
                                     <option>Wander in Radius (500cm)</option>
                                     <option>Execute Action: IDLE_02</option>
                                  </select>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6 mt-6">
                      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                        <h3 className="text-[#c9d1d9] font-bold mb-4 flex items-center gap-2 border-b border-[#30363d] pb-2"><MessageSquare size={16} className="text-[#bc8cff]"/> Bound Dialogue Tree</h3>
                        <select className="bg-[#0d1117] border border-[#30363d] p-2 rounded text-[#c9d1d9] text-[11px] w-full outline-none mb-3" value={npc.dialogueId || ''} onChange={(e) => updateNpc(npc.id, 'dialogueId', e.target.value)}>
                          <option value="">-- No Dialogue Tree --</option>
                          {dialogueTrees.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        
                        <h3 className="text-[#c9d1d9] font-bold mb-4 mt-6 flex items-center gap-2 border-b border-[#30363d] pb-2"><ShieldAlert size={16} className="text-[#79c0ff]"/> Affiliated Faction</h3>
                        <select className="bg-[#0d1117] border border-[#30363d] p-2 rounded text-[#c9d1d9] text-[11px] w-full outline-none" value={npc.factionId || ''} onChange={(e) => updateNpc(npc.id, 'factionId', e.target.value)}>
                          <option value="">-- No Faction --</option>
                          {factions.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                      </div>

                      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                        <h3 className="text-[#c9d1d9] font-bold mb-4 flex items-center gap-2 border-b border-[#30363d] pb-2"><Database size={16} className="text-[#58a6ff]"/> Loot Table (On Death)</h3>
                        <select className="bg-[#0d1117] border border-[#30363d] p-2 rounded text-[#c9d1d9] text-[11px] w-full outline-none mb-4" value={npc.lootTableId || ''} onChange={(e) => updateNpc(npc.id, 'lootTableId', e.target.value)}>
                          <option value="">-- No Loot --</option>
                          {lootTables.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                        
                        {npc.isMonster && (
                           <div className="mt-6 pt-6 border-t border-[#30363d]">
                              <h3 className="text-[#c9d1d9] font-bold mb-4 flex items-center gap-2 border-b border-[#30363d] pb-2"><Ghost size={16} className="text-[#f85149]"/> Monster Specifics</h3>
                              <InputField label="Spawn Conditions" value={npc.spawnConditions || ''} onChange={(v: string) => updateNpc(npc.id, 'spawnConditions', v)} />
                              <TextAreaField label="Phase Transitions (e.g. 50% HP = Enrage)" value={npc.phaseTransitions || ''} onChange={(v: string) => updateNpc(npc.id, 'phaseTransitions', v)} mb="0" />
                              
                              <div className="mt-4 bg-[#0d1117] border border-[#f85149]/30 rounded p-4">
                                 <h4 className="text-[#f85149] font-bold text-[11px] mb-2 flex items-center gap-2"><Dna size={14}/> Hazardous Metamorphosis Simulator</h4>
                                 <p className="text-[10px] text-[#8b949e] mb-3 leading-relaxed">
                                    Simulate dropping this monster into a hazardous coordinate zone. A new specialized species will be generated automatically inheriting traits.
                                 </p>
                                 <div className="flex gap-2">
                                    <select id={`evolve-select-${npc.id}`} className="bg-[#161b22] border border-[#30363d] p-1.5 rounded text-[#c9d1d9] text-[11px] flex-1 outline-none">
                                       <option value="Toxic">Toxic/Radioactive Zone</option>
                                       <option value="Thermal">Thermal/Lava Zone</option>
                                       <option value="AbsoluteZero">Absolute Zero Tundra</option>
                                       <option value="Abyssal">Abyssal Pressure Void</option>
                                       <option value="LocalizedGravity">Gravitational Anomaly</option>
                                       <option value="SubatomicResonance">Quantum Resonance Chamber</option>
                                    </select>
                                    <button 
                                      onClick={() => {
                                         const sel = document.getElementById(`evolve-select-${npc.id}`) as HTMLSelectElement;
                                         if (sel) handleEvolveMonster(npc, sel.value);
                                      }}
                                      className="bg-[#f85149] hover:bg-[#ff7b72] text-[#0d1117] px-3 py-1.5 rounded text-[11px] font-bold transition-colors shadow-[0_0_8px_rgba(248,81,73,0.3)] flex items-center gap-1"
                                    >
                                       <FlaskConical size={12}/> Evolve
                                    </button>
                                 </div>
                              </div>
                           </div>
                        )}
                      </div>
                   </div>

                 </>
               )
             })()}
          </div>
        )}

        {activeTab === 'Skills' && selectedSkillId && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
             {(() => {
               const skill = skills.find(s => s.id === selectedSkillId)!;
               return (
                 <>
                   <div className="flex items-center gap-3 border-b border-[#30363d] pb-4">
                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#3fb950]/20 to-[#3fb950]/5 border border-[#3fb950]/30 flex items-center justify-center">
                       <Zap className="text-[#3fb950]" size={24}/>
                     </div>
                     <div>
                       <h2 className="text-[#c9d1d9] text-xl font-bold">{skill.name || 'Unnamed Skill'}</h2>
                       <p className="text-[#8b949e] text-xs uppercase tracking-wider">{skill.type} SKILL</p>
                     </div>
                   </div>

                   <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                       <div className="grid grid-cols-2 gap-6 mb-4">
                         <InputField label="Skill Name" value={skill.name} onChange={(v: string) => updateSkill(skill.id, 'name', v)} />
                         <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Skill Type</label>
                            <select value={skill.type} onChange={(e) => updateSkill(skill.id, 'type', e.target.value)} className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[12px] outline-none w-full">
                              <option value="active">Active</option>
                              <option value="passive">Passive</option>
                              <option value="ultimate">Ultimate</option>
                            </select>
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-6 mb-4">
                         <InputField label="Cooldown (Seconds)" type="number" value={skill.cooldown} onChange={(v: number) => updateSkill(skill.id, 'cooldown', v)} />
                         <InputField label="Resource Cost (MP/Stamina)" type="number" value={skill.cost} onChange={(v: number) => updateSkill(skill.id, 'cost', v)} />
                       </div>

                       <TextAreaField label="Description" value={skill.description} onChange={(v: string) => updateSkill(skill.id, 'description', v)} />
                   </div>

                   <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                      <div className="flex items-center justify-between border-b border-[#30363d] pb-2 mb-4">
                         <h3 className="text-[#c9d1d9] font-bold flex items-center gap-2"><Settings2 size={16} className="text-[#3fb950]"/> Effects / Parameters</h3>
                         <button onClick={() => addSkillEffect(skill.id)} className="text-[11px] font-bold bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/40 px-2 py-1 rounded hover:bg-[#3fb950]/30 transition-colors flex items-center gap-1"><Plus size={12}/> Add Parameter</button>
                      </div>
                      <div className="flex flex-col gap-3">
                         {skill.effects.length === 0 && <div className="text-center text-[#8b949e] text-xs py-4">No effects defined yet.</div>}
                         {skill.effects.map((eff, index) => (
                           <div key={index} className="flex items-center gap-4 bg-[#0d1117] border border-[#30363d] p-3 rounded">
                             <div className="flex-1 flex items-center gap-2">
                               <span className="text-[#8b949e] text-[10px] uppercase font-bold w-12 shrink-0">Type</span>
                               <input type="text" value={eff.type} onChange={e => updateSkillEffect(skill.id, index, 'type', e.target.value)} className="bg-[#161b22] border border-[#30363d] rounded p-1.5 text-[#c9d1d9] text-[12px] w-full" placeholder="e.g. Physical Damage" />
                             </div>
                             <div className="flex-1 flex items-center gap-2">
                               <span className="text-[#8b949e] text-[10px] uppercase font-bold w-12 shrink-0">Value</span>
                               <input type="number" value={eff.value} onChange={e => updateSkillEffect(skill.id, index, 'value', Number(e.target.value))} className="bg-[#161b22] border border-[#30363d] rounded p-1.5 text-[#c9d1d9] text-[12px] w-full" />
                             </div>
                             <button onClick={() => removeSkillEffect(skill.id, index)} className="text-[#f85149] hover:text-white p-2 rounded hover:bg-[#f85149]/20 transition-colors"><Trash2 size={14}/></button>
                           </div>
                         ))}
                      </div>
                   </div>
                 </>
               )
             })()}
          </div>
        )}

        {activeTab === 'Quests' && selectedQuestId && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
             {(() => {
               const quest = quests.find(q => q.id === selectedQuestId)!;
               return (
                 <>
                   <div className="flex items-center gap-3 border-b border-[#30363d] pb-4">
                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#e3b341]/20 to-[#e3b341]/5 border border-[#e3b341]/30 flex items-center justify-center">
                       <BookOpen className="text-[#e3b341]" size={24}/>
                     </div>
                     <div>
                       <h2 className="text-[#c9d1d9] text-xl font-bold">{quest.name || 'Unnamed Quest'}</h2>
                       <p className="text-[#8b949e] text-xs">Quest Chain Node</p>
                     </div>
                   </div>

                   <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 grid grid-cols-2 gap-6">
                       <InputField label="Quest Name" value={quest.name} onChange={(v: string) => updateQuest(quest.id, 'name', v)} mb="0" />
                       <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Quest Giver (NPC)</label>
                          <select value={quest.npcId} onChange={(e) => updateQuest(quest.id, 'npcId', e.target.value)} className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[12px] outline-none focus:border-[#58a6ff] w-full">
                            <option value="">-- No Specific NPC --</option>
                            {npcs.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                          </select>
                       </div>
                       
                       <div className="col-span-2">
                          <TextAreaField label="Objective / Description" value={quest.description} onChange={(v: string) => updateQuest(quest.id, 'description', v)} mb="0" />
                       </div>

                       <InputField label="Requirements to Start" value={quest.requirements} onChange={(v: string) => updateQuest(quest.id, 'requirements', v)} mb="0" />
                       <InputField label="Rewards / Loot" value={quest.rewards} onChange={(v: string) => updateQuest(quest.id, 'rewards', v)} mb="0" />
                       
                       <div className="col-span-2 p-3 bg-[#0d1117] border border-[#30363d] border-dashed rounded flex flex-col gap-2 mt-2">
                          <label className="text-[10px] font-bold text-[#e3b341] uppercase tracking-wider flex items-center gap-1"><BookOpen size={10}/> Next Quest In Continuous Chain</label>
                          <select value={quest.nextQuestId || ""} onChange={(e) => updateQuest(quest.id, 'nextQuestId', e.target.value)} className="bg-[#161b22] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[12px] outline-none focus:border-[#e3b341] w-full">
                            <option value="">-- Ends Quest Chain --</option>
                            {quests.filter(q => q.id !== quest.id).map(q => <option key={q.id} value={q.id}>{q.name}</option>)}
                          </select>
                          <p className="text-[10px] text-[#8b949e]">Select another quest to automatically start it upon completion. Enables infinite consecutive chains.</p>
                          
                          {/* Quest Chain Visualizer */}
                          <div className="mt-4 border-t border-[#30363d] pt-4">
                             <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider block mb-2">Chain Timeline Preview</span>
                             <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                                {(() => {
                                   let chain: Quest[] = [];
                                   let cur: Quest | undefined = quests.find(q => q.nextQuestId === quest.id); // Find immediate parent
                                   while (cur && !chain.find(c => c.id === cur!.id)) {
                                      chain.unshift(cur);
                                      cur = quests.find(q => q.nextQuestId === cur!.id);
                                   }
                                   chain.push(quest);
                                   let next = quests.find(q => q.id === quest.nextQuestId);
                                   while (next && !chain.find(c => c.id === next!.id)) {
                                      chain.push(next);
                                      next = quests.find(q => q.id === next!.nextQuestId);
                                   }
                                   return chain.map((c, i) => (
                                     <React.Fragment key={c.id}>
                                       <div className={`shrink-0 px-3 py-1.5 rounded text-[11px] font-bold border ${c.id === quest.id ? 'bg-[#e3b341] text-[#0a0a0a] border-[#e3b341]' : 'bg-[#161b22] text-[#c9d1d9] border-[#30363d]'}`}>
                                          {c.name}
                                       </div>
                                       {i < chain.length - 1 && <ArrowRight size={14} className="text-[#8b949e] shrink-0" />}
                                     </React.Fragment>
                                   ));
                                })()}
                             </div>
                          </div>
                       </div>
                   </div>
                 </>
               )
             })()}
          </div>
        )}

        {activeTab === 'Factions' && selectedFactionId && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
             {(() => {
               const fac = factions.find(f => f.id === selectedFactionId)!;
               return (
                 <>
                   <div className="flex items-center gap-3 border-b border-[#30363d] pb-4">
                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#79c0ff]/20 to-[#79c0ff]/5 border border-[#79c0ff]/30 flex items-center justify-center">
                       <ShieldAlert className="text-[#79c0ff]" size={24}/>
                     </div>
                     <div>
                       <h2 className="text-[#c9d1d9] text-xl font-bold">{fac.name || 'Unnamed Faction'}</h2>
                       <p className="text-[#8b949e] text-xs">Faction ID: {fac.id}</p>
                     </div>
                   </div>
                   
                   <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                      <InputField label="Faction Name" value={fac.name} onChange={(v: string) => updateFaction(fac.id, 'name', v)} />
                      <TextAreaField label="Lore / Description" value={fac.description} onChange={(v: string) => updateFaction(fac.id, 'description', v)} />
                   </div>
                 </>
               )
             })()}
          </div>
        )}

        {activeTab === 'Loot' && selectedLootTableId && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
             {(() => {
               const lt = lootTables.find(l => l.id === selectedLootTableId)!;
               return (
                 <>
                   <div className="flex items-center gap-3 border-b border-[#30363d] pb-4">
                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#58a6ff]/20 to-[#58a6ff]/5 border border-[#58a6ff]/30 flex items-center justify-center">
                       <Database className="text-[#58a6ff]" size={24}/>
                     </div>
                     <div>
                       <h2 className="text-[#c9d1d9] text-xl font-bold">{lt.name || 'Unnamed Loot Table'}</h2>
                       <p className="text-[#8b949e] text-xs">Loot ID: {lt.id}</p>
                     </div>
                   </div>
                   
                   <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                      <InputField label="Loot Table Name" value={lt.name} onChange={(v: string) => updateLootTable(lt.id, 'name', v)} />
                      
                      <div className="mt-4">
                         <div className="flex items-center justify-between border-b border-[#30363d] pb-2 mb-4">
                            <h3 className="text-[#c9d1d9] font-bold flex items-center gap-2">Drops</h3>
                            <button onClick={() => addLootDrop(lt.id)} className="text-[11px] font-bold bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/40 px-2 py-1 rounded hover:bg-[#58a6ff]/30 transition-colors flex items-center gap-1"><Plus size={12}/> Add Drop</button>
                         </div>
                         <div className="flex flex-col gap-2">
                            {lt.drops.length === 0 && <span className="text-[#8b949e] text-xs">No drops added.</span>}
                            {lt.drops.map((drop, idx) => (
                               <div key={idx} className="flex items-center gap-4 bg-[#0d1117] border border-[#30363d] p-3 rounded">
                                  <div className="flex-1">
                                     <InputField label="Item Name / ID" value={drop.itemName} onChange={(v: string) => updateLootDrop(lt.id, idx, 'itemName', v)} mb="0" />
                                  </div>
                                  <div className="w-24">
                                     <InputField label="Drop Rate" type="number" value={drop.dropRate} onChange={(v: number) => updateLootDrop(lt.id, idx, 'dropRate', v)} mb="0" />
                                  </div>
                                  <div className="w-24">
                                     <InputField label="Min Qty" type="number" value={drop.minQuantity} onChange={(v: number) => updateLootDrop(lt.id, idx, 'minQuantity', v)} mb="0" />
                                  </div>
                                  <div className="w-24">
                                     <InputField label="Max Qty" type="number" value={drop.maxQuantity} onChange={(v: number) => updateLootDrop(lt.id, idx, 'maxQuantity', v)} mb="0" />
                                  </div>
                                  <div className="w-24 flex items-center justify-center mt-5">
                                     <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={drop.guaranteed} onChange={e => updateLootDrop(lt.id, idx, 'guaranteed', e.target.checked)} className="accent-[#58a6ff]" />
                                        <span className="text-[#c9d1d9] text-[10px] font-bold uppercase">100%</span>
                                     </label>
                                  </div>
                                  <button onClick={() => removeLootDrop(lt.id, idx)} className="text-[#f85149] hover:text-white p-2 mt-5 rounded hover:bg-[#f85149]/20 transition-colors"><Trash2 size={14}/></button>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                 </>
               )
             })()}
          </div>
        )}

        {activeTab === 'Dialogue' && selectedDialogueTreeId && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
             {(() => {
               const dt = dialogueTrees.find(d => d.id === selectedDialogueTreeId)!;
               return (
                 <>
                   <div className="flex items-center gap-3 border-b border-[#30363d] pb-4">
                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#bc8cff]/20 to-[#bc8cff]/5 border border-[#bc8cff]/30 flex items-center justify-center">
                       <MessageSquare className="text-[#bc8cff]" size={24}/>
                     </div>
                     <div>
                       <h2 className="text-[#c9d1d9] text-xl font-bold">{dt.name || 'Unnamed Tree'}</h2>
                       <p className="text-[#8b949e] text-xs">Dialogue Tree ID: {dt.id}</p>
                     </div>
                   </div>
                   
                   <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                      <div className="grid grid-cols-2 gap-4">
                         <InputField label="Tree Name" value={dt.name} onChange={(v: string) => updateDialogueTree(dt.id, 'name', v)} mb="0" />
                         <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Root Node (Start)</label>
                            <select value={dt.rootNodeId || ''} onChange={(e) => updateDialogueTree(dt.id, 'rootNodeId', e.target.value)} className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[12px] outline-none">
                              <option value="">-- Start Node --</option>
                              {dt.nodes.map(n => <option key={n.id} value={n.id}>[{n.id}] {n.text.substring(0, 30)}...</option>)}
                            </select>
                         </div>
                      </div>
                   </div>
                   
                   <div className="bg-[#1f162b] border border-[#bc8cff]/30 rounded-lg p-5">
                     <div className="flex items-center justify-between border-b border-[#30363d] pb-2 mb-4">
                        <h3 className="text-[#c9d1d9] font-bold flex items-center gap-2"><GitBranch size={16} className="text-[#bc8cff]" /> Interactive Nodes</h3>
                        <button onClick={() => addDialogueNode(dt.id)} className="text-[11px] font-bold bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/40 px-2 py-1 rounded hover:bg-[#bc8cff]/30 transition-colors flex items-center gap-1"><Plus size={12}/> Create Node</button>
                     </div>
                     
                     <div className="flex flex-col gap-4">
                        {dt.nodes.length === 0 && <span className="text-[#8b949e] text-xs text-center py-4 block w-full">No nodes created yet.</span>}
                        {dt.nodes.map((node, nodeIdx) => (
                           <div key={node.id} className={`bg-[#0d1117] border ${dt.rootNodeId === node.id ? 'border-[#bc8cff]' : 'border-[#30363d]'} p-4 rounded-lg flex flex-col gap-3 relative`}>
                              {dt.rootNodeId === node.id && <div className="absolute top-0 right-0 bg-[#bc8cff] text-[#0d1117] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">ROOT NODE</div>}
                              
                              <div className="flex justify-between items-center">
                                 <span className="text-[#8b949e] text-[10px] font-mono">ID: {node.id}</span>
                                 <button onClick={() => removeDialogueNode(dt.id, node.id)} className="text-[#f85149] hover:text-white"><Trash2 size={12}/></button>
                              </div>
                              
                              <TextAreaField label="NPC Spoken Text" value={node.text} onChange={(v: string) => updateDialogueNode(dt.id, node.id, 'text', v)} mb="0" />
                              <InputField label="Dynamic AI Prompt (Optional override)" value={node.aiPrompt || ''} onChange={(v: string) => updateDialogueNode(dt.id, node.id, 'aiPrompt', v)} mb="0" />
                              
                              <div className="bg-[#161b22] border border-[#30363d] rounded p-3 mt-2">
                                 <div className="flex items-center justify-between border-b border-[#30363d] pb-2 mb-3">
                                    <h4 className="text-[#c9d1d9] text-[11px] font-bold">Player Responses</h4>
                                    <button onClick={() => addDialogueResponse(dt.id, node.id)} className="text-[#3fb950] bg-[#3fb950]/10 hover:bg-[#3fb950]/20 px-2 py-0.5 rounded text-[10px] font-bold border border-[#3fb950]/30">+ Response</button>
                                 </div>
                                 <div className="flex flex-col gap-2">
                                    {node.responses.length === 0 && <span className="text-[#8b949e] text-[10px]">No responses (End of dialogue).</span>}
                                    {node.responses.map((resp, respIdx) => (
                                       <div key={respIdx} className="flex gap-2 items-start">
                                          <div className="flex-1">
                                             <input type="text" value={resp.text} onChange={e => updateDialogueResponse(dt.id, node.id, respIdx, 'text', e.target.value)} className="bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-[#c9d1d9] text-[11px] w-full mt-1 outline-none" placeholder="Response text..." />
                                          </div>
                                          <div className="w-1/3">
                                             <select value={resp.nextNodeId || ''} onChange={(e) => updateDialogueResponse(dt.id, node.id, respIdx, 'nextNodeId', e.target.value)} className="bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-[#c9d1d9] text-[11px] w-full mt-1 outline-none">
                                                <option value="">-- End Convo --</option>
                                                {dt.nodes.map(n => <option key={n.id} value={n.id}>Go to {n.id}</option>)}
                                             </select>
                                          </div>
                                          <button onClick={() => removeDialogueResponse(dt.id, node.id, respIdx)} className="text-[#f85149] p-1 mt-1"><X size={12}/></button>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                   </div>
                 </>
               )
             })()}
          </div>
        )}

      </div>
      </div>
    </div>
  );
}

// X icon for generic usage inside specific components where it wasn't explicitly imported
function X(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}
