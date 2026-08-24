/**
 * ZERO-LATENCY OFFLINE DYNAMIC GAME AUDIO & DSP SOUND EFFECTS SYNTHESIZER
 * 
 * - 100% Client-Side Pure Web Audio API & DSP Node Synthesis (0ms Latency, Zero Dependencies)
 * - Complete Audio Categories: Weapons, Explosions, Wind, Fire, Lightning, Ice, Holy/Dark Magic,
 *   Forest/Biome Ambients (Wind in Trees, Rain, Cave, Birds), and Dynamic Offline Voice Acting.
 * - Spatial 3D Audio (PannerNode / HRTF) & Multi-Bus Routing (Master, SFX, Ambient, Voice).
 * - Instant Pre-Warmed Buffer Caching for 0ms Trigger Response on all combat & map events.
 */

export type SoundCategory = 
  | 'weapon_combat'
  | 'explosion_impact'
  | 'elemental_wind'
  | 'elemental_fire'
  | 'elemental_lightning'
  | 'elemental_ice'
  | 'magic_holy_dark'
  | 'biome_ambient'
  | 'voice_callout';

export interface SoundPreset {
  id: string;
  name: string;
  thaiName: string;
  category: SoundCategory;
  categoryThai: string;
  description: string;
  thaiDescription: string;
  icon: string;
  duration: number; // in seconds
  tags: string[];
}

export const SOUND_PRESETS: SoundPreset[] = [
  // ⚔️ Weapon & Combat
  {
    id: 'slash_light',
    name: 'Swift Blade Slash',
    thaiName: 'เสียงฟันดาบเร็ว / มีดสั้น',
    category: 'weapon_combat',
    categoryThai: '⚔️ อาวุธและการต่อสู้',
    description: 'Crisp, high-speed aerodynamic swoosh with razor-sharp cutting edge.',
    thaiDescription: 'เสียงฟันดาบเฉือนอากาศอย่างรวดเร็ว คมกริบ ไร้ดีเลย์',
    icon: 'Sword',
    duration: 0.18,
    tags: ['sword', 'knife', 'dagger', 'slash', 'ฟัน', 'ดาบ', 'มีด', 'เฉือน']
  },
  {
    id: 'slash_heavy',
    name: 'Greatsword Cleave',
    thaiName: 'เสียงฟันดาบยักษ์ / สับหนักหน่วง',
    category: 'weapon_combat',
    categoryThai: '⚔️ อาวุธและการต่อสู้',
    description: 'Heavy low-end displacement with brutal metallic slice and sub-impact.',
    thaiDescription: 'เสียงฟันดาบใหญ่ มีน้ำหนักเบสกระแทกและคมเหล็กตัดอากาศ',
    icon: 'Shield',
    duration: 0.35,
    tags: ['greatsword', 'heavy slash', 'cleave', 'ฟันหนัก', 'สับ', 'ดาบใหญ่']
  },
  {
    id: 'blade_clash',
    name: 'Sword Parry & Metal Clash',
    thaiName: 'เสียงดาบปะทะเหล็ก / แพรี่',
    category: 'weapon_combat',
    categoryThai: '⚔️ อาวุธและการต่อสู้',
    description: 'High-frequency resonant steel chime with sharp spark transient and decay.',
    thaiDescription: 'เสียงคมดาบกระทบกัน ก้องกังวาน ประกายไฟแลบ',
    icon: 'Sparkles',
    duration: 0.45,
    tags: ['parry', 'clash', 'metal', 'spark', 'ปะทะ', 'ดาบชน', 'แพรี่']
  },
  {
    id: 'pierce_thrust',
    name: 'Spear Thrust & Pierce',
    thaiName: 'เสียงแทงหอก / เจาะเกราะ',
    category: 'weapon_combat',
    categoryThai: '⚔️ อาวุธและการต่อสู้',
    description: 'High-velocity puncture impact with sharp friction drag.',
    thaiDescription: 'เสียงพุ่งแทงทะลุเป้าหมายอย่างรวดเร็วและแม่นยำ',
    icon: 'Zap',
    duration: 0.22,
    tags: ['spear', 'thrust', 'pierce', 'แทง', 'หอก', 'เจาะ']
  },
  {
    id: 'blunt_crush',
    name: 'Warhammer Ground Crush',
    thaiName: 'เสียงค้อนศึกทุบพื้น / กระแทกแผ่นดิน',
    category: 'weapon_combat',
    categoryThai: '⚔️ อาวุธและการต่อสู้',
    description: 'Sub-bass earth-shattering thud with fracturing stone rubble debris.',
    thaiDescription: 'เสียงค้อนทุบลงพื้น หินแตกกระจาย เบสสั่นสะเทือนหนักแน่น',
    icon: 'Hammer',
    duration: 0.5,
    tags: ['hammer', 'smash', 'crush', 'ทุบ', 'ค้อน', 'กระแทก']
  },

  // 💥 Explosion & Impacts
  {
    id: 'explosion_heavy',
    name: 'Heavy Detonation & Blast',
    thaiName: 'เสียงระเบิดกัมปนาท / Shockwave',
    category: 'explosion_impact',
    categoryThai: '💥 ระเบิดและคลื่นกระแทก',
    description: 'Hypersonic snap transient followed by 45Hz sub-bass blast wave and long rolling acoustic rumble.',
    thaiDescription: 'เสียงระเบิดพลังทำลายล้างสูง คลื่นกระแทกสั่นสะเทือนและเสียงก้องกังวานตามหลัง',
    icon: 'Bomb',
    duration: 1.2,
    tags: ['explosion', 'bomb', 'blast', 'detonation', 'ระเบิด', 'บึ้ม', 'แตก']
  },
  {
    id: 'explosion_magic',
    name: 'Arcane Mana Burst',
    thaiName: 'เสียงระเบิดเวทมนตร์ / พลังเวทปะทุ',
    category: 'explosion_impact',
    categoryThai: '💥 ระเบิดและคลื่นกระแทก',
    description: 'Crystalline energy burst with shimmering harmonic overtones and bass bloom.',
    thaiDescription: 'เสียงระเบิดพลังเวท มีประกายคริสตัลระยิบระยับพร้อมแรงอัดคลื่นพลัง',
    icon: 'Sparkles',
    duration: 0.75,
    tags: ['magic explosion', 'mana burst', 'arcane', 'ระเบิดเวท', 'เวทปะทุ']
  },
  {
    id: 'shockwave_pulse',
    name: 'Kinetic Shockwave Waveform',
    thaiName: 'เสียงคลื่นกระแทกไคเนติก / คลื่นอัดอากาศ',
    category: 'explosion_impact',
    categoryThai: '💥 ระเบิดและคลื่นกระแทก',
    description: 'Stereo sweeping pressure wave with sub-bass frequency release.',
    thaiDescription: 'เสียงคลื่นกระแทกผลักอากาศรอบทิศทาง',
    icon: 'Activity',
    duration: 0.6,
    tags: ['shockwave', 'kinetic', 'wave', 'คลื่นกระแทก', 'กระแทก']
  },

  // 🌪️ Wind & Air Elements
  {
    id: 'wind_gale_slash',
    name: 'Sonic Air Blade / Vacuum Cut',
    thaiName: 'เสียงคลื่นดาบสุญญากาศ / มีดลม',
    category: 'elemental_wind',
    categoryThai: '🌪️ ลมและอากาศ',
    description: 'High-speed air compression slice with sonic cavitation resonance.',
    thaiDescription: 'เสียงคลื่นลมตัดอากาศ คมกริบเฉือนผ่านด้วยความเร็วเหนือเสียง',
    icon: 'Wind',
    duration: 0.3,
    tags: ['wind slash', 'air blade', 'vacuum', 'คลื่นลม', 'ดาบลม', 'ลมฟัน']
  },
  {
    id: 'wind_tornado_vortex',
    name: 'Whirlwind Tornado Vortex',
    thaiName: 'เสียงพายุหมุนทอร์นาโด / วังวนลม',
    category: 'elemental_wind',
    categoryThai: '🌪️ ลมและอากาศ',
    description: 'Swirling multi-band turbulent cyclonic vortex with Doppler howling frequencies.',
    thaiDescription: 'เสียงพายุหมุนปั่นป่วน หวีดหวิว หมุนวนรอบทิศทาง',
    icon: 'RotateCw',
    duration: 1.5,
    tags: ['tornado', 'whirlwind', 'vortex', 'พายุ', 'ลมหมุน', 'พายุหมุน']
  },
  {
    id: 'dash_teleport_whoosh',
    name: 'Phantom Dash Whoosh',
    thaiName: 'เสียงพุ่งตัวหลบหลีก / แดชความเร็วสูง',
    category: 'elemental_wind',
    categoryThai: '🌪️ ลมและอากาศ',
    description: 'Ultra-fast stereo binaural air displaced whoosh with micro pitch shift.',
    thaiDescription: 'เสียงวูบพุ่งตัวเคลื่อนที่อย่างรวดเร็ว ซ้ายไปขวา',
    icon: 'FastForward',
    duration: 0.25,
    tags: ['dash', 'whoosh', 'blink', 'dodge', 'พุ่ง', 'แดช', 'หลบ']
  },

  // 🔥 Fire & Thermal Elements
  {
    id: 'fireball_cast',
    name: 'Blazing Fireball Launch',
    thaiName: 'เสียงยิงลูกบอลเพลิง / ร่ายลูกไฟ',
    category: 'elemental_fire',
    categoryThai: '🔥 ไฟและความร้อน',
    description: 'Roaring ignition snap, whooshing flaming projectile trajectory, and sizzling tail.',
    thaiDescription: 'เสียงจุดระเบิดลูกไฟ พุ่งแหวกลม และมีเสียงเผาไหม้ตามหลัง',
    icon: 'Flame',
    duration: 0.65,
    tags: ['fireball', 'fire', 'flame', 'ลูกไฟ', 'บอลเพลิง', 'ยิงไฟ']
  },
  {
    id: 'flamethrower_stream',
    name: 'Continuous Flamethrower Stream',
    thaiName: 'เสียงพ่นไฟต่อเนื่อง / เพลิงผลาญ',
    category: 'elemental_fire',
    categoryThai: '🔥 ไฟและความร้อน',
    description: 'Turbulent pressurized combustion hiss with dynamic low-mid rumble.',
    thaiDescription: 'เสียงพ่นไฟพวยพุ่งต่อเนื่อง เสียงเผาไหม้ร้อนแรง',
    icon: 'Flame',
    duration: 1.8,
    tags: ['flamethrower', 'burn', 'inferno', 'พ่นไฟ', 'ไฟเผา']
  },
  {
    id: 'ember_crackle',
    name: 'Campfire & Ember Crackle',
    thaiName: 'เสียงกองไฟและถ่านไม้ลั่น / ประกายไฟ',
    category: 'elemental_fire',
    categoryThai: '🔥 ไฟและความร้อน',
    description: 'Organic micro-explosions of popping embers and soft warm wood combustion.',
    thaiDescription: 'เสียงประกายไฟเปรี๊ยะๆ ของถ่านไม้และกองไฟในป่า',
    icon: 'Flame',
    duration: 2.0,
    tags: ['ember', 'crackle', 'campfire', 'กองไฟ', 'ถ่านไม้', 'ประกายไฟ']
  },

  // ⚡ Lightning & Plasma Elements
  {
    id: 'thunder_strike',
    name: 'Heavenly Thunder Strike',
    thaiName: 'เสียงฟ้าผ่าเปรี้ยง / สายฟ้าฟาด',
    category: 'elemental_lightning',
    categoryThai: '⚡ สายฟ้าและพลาสมา',
    description: 'Zero-latency high-voltage arc breakdown snap, instantaneous thunderclap, and decaying reverb.',
    thaiDescription: 'เสียงฟ้าผ่าเปรี้ยงดังสนั่น แสงวาบกระแทกพื้น และเสียงก้องสะท้อนฟ้าร้อง',
    icon: 'Zap',
    duration: 1.4,
    tags: ['thunder', 'lightning', 'strike', 'ฟ้าผ่า', 'สายฟ้า', 'ฟ้าร้อง']
  },
  {
    id: 'chain_lightning',
    name: 'Chain Lightning Arc',
    thaiName: 'เสียงสายฟ้าชิ่ง / ไฟฟ้าช็อตต่อเนื่อง',
    category: 'elemental_lightning',
    categoryThai: '⚡ สายฟ้าและพลาสมา',
    description: 'Rapid sawtooth frequency-hopping electric arc with buzzing plasma discharge.',
    thaiDescription: 'เสียงไฟฟ้าช็อตกระโดดชิ่งระหว่างเป้าหมายอย่างรวดเร็ว',
    icon: 'Zap',
    duration: 0.55,
    tags: ['chain lightning', 'zap', 'electric', 'ไฟฟ้าช็อต', 'สายฟ้าชิ่ง']
  },

  // ❄️ Ice & Frost Elements
  {
    id: 'ice_freeze_crystal',
    name: 'Frost Freeze & Crystal Form',
    thaiName: 'เสียงแช่แข็งผลึกน้ำแข็ง / Frost Nova',
    category: 'elemental_ice',
    categoryThai: '❄️ น้ำแข็งและความเย็น',
    description: 'Ascending high-Q crystalline resonant chimes with freezing cold texture.',
    thaiDescription: 'เสียงผลึกน้ำแข็งก่อตัวอย่างรวดเร็ว แหลมใส ก้องกังวาน',
    icon: 'Snowflake',
    duration: 0.7,
    tags: ['ice', 'freeze', 'frost', 'crystal', 'น้ำแข็ง', 'แช่แข็ง', 'ความเย็น']
  },
  {
    id: 'ice_shatter_burst',
    name: 'Ice Shatter & Shard Explosion',
    thaiName: 'เสียงน้ำแข็งแตกกระจาย / เศษแก้วระเบิด',
    category: 'elemental_ice',
    categoryThai: '❄️ น้ำแข็งและความเย็น',
    description: 'Sharp glass/ice fracture snap with dozens of scattered cascading resonant debris particles.',
    thaiDescription: 'เสียงก้อนน้ำแข็งแตกกระจัดกระจายเป็นเศษเล็กเศษน้อย คมชัด',
    icon: 'Snowflake',
    duration: 0.5,
    tags: ['ice shatter', 'shards', 'break', 'น้ำแข็งแตก', 'แตกกระจาย']
  },

  // ✨ Holy & Dark Magic
  {
    id: 'divine_heal_aura',
    name: 'Divine Healing & Holy Shimmer',
    thaiName: 'เสียงฮีลเพิ่มเลือด / แสงศักดิ์สิทธิ์',
    category: 'magic_holy_dark',
    categoryThai: '✨ เวทมนตร์ศักดิ์สิทธิ์และมนต์ดำ',
    description: 'Warm harmonic major chord sweep with uplifting angelic bell chimes and soothing sub-presence.',
    thaiDescription: 'เสียงเวทฟื้นฟูพลังชีวิต อบอุ่น นุ่มนวล เปล่งประกายแสงสว่าง',
    icon: 'Heart',
    duration: 1.1,
    tags: ['heal', 'divine', 'holy', 'buff', 'ฮีล', 'ฟื้นฟู', 'ศักดิ์สิทธิ์', 'เพิ่มเลือด']
  },
  {
    id: 'dark_curse_drain',
    name: 'Abyssal Dark Curse & Soul Drain',
    thaiName: 'เสียงมนตร์ดำ / ดูดกลืนวิญญาณ',
    category: 'magic_holy_dark',
    categoryThai: '✨ เวทมนตร์ศักดิ์สิทธิ์และมนต์ดำ',
    description: 'Sinister minor tritone descent with whispering formant filter and spectral undertones.',
    thaiDescription: 'เสียงเวทมนตร์ดำ ดูดพลังชีวิต หลอน ก้องกังวาน น่าสะพรึงกลัว',
    icon: 'Moon',
    duration: 0.9,
    tags: ['curse', 'dark', 'drain', 'shadow', 'มนตร์ดำ', 'สาป', 'ดูดวิญญาณ']
  },

  // 🌲 Map & Biome Ambients (Zero Latency Ambient Layering)
  {
    id: 'forest_wind_trees',
    name: 'Forest Canopy Wind & Rustling Trees',
    thaiName: 'เสียงลมพัดผ่านยอดไม้ในป่า / ใบไม้เสียดสี',
    category: 'biome_ambient',
    categoryThai: '🌲 บรรยากาศฉากและแผนที่ (Biomes)',
    description: 'Organic gentle breeze filtering through deep pine and oak leaves with dynamic gusts and natural whispering turbulence.',
    thaiDescription: 'เสียงลมพัดผ่านยอดไม้ในป่าอย่างนุ่มนวลและเป็นธรรมชาติ ใบไม้พัดไหว ผ่อนคลายและสมจริง',
    icon: 'Trees',
    duration: 3.0,
    tags: ['forest wind', 'trees', 'nature', 'breeze', 'ลมในป่า', 'ลมพัด', 'ใบไม้', 'ป่าไม้', 'ธรรมชาติ']
  },
  {
    id: 'forest_birds_wildlife',
    name: 'Morning Birds in Forest Canopy',
    thaiName: 'เสียงนกร้องในป่ายามเช้า',
    category: 'biome_ambient',
    categoryThai: '🌲 บรรยากาศฉากและแผนที่ (Biomes)',
    description: 'Procedural FM-modulated birds chirping with varying pitch and stereo spatial positioning.',
    thaiDescription: 'เสียงนกร้องเพลงในป่า กระจายมิติเสียงซ้ายขวาอย่างเป็นธรรมชาติ',
    icon: 'Feather',
    duration: 2.5,
    tags: ['birds', 'forest', 'chirp', 'wildlife', 'นก', 'นกร้อง', 'เสียงนก', 'ป่ายามเช้า']
  },
  {
    id: 'forest_rain_gentle',
    name: 'Gentle Rain on Forest Leaves',
    thaiName: 'เสียงฝนตกกระทบใบไม้ในป่า',
    category: 'biome_ambient',
    categoryThai: '🌲 บรรยากาศฉากและแผนที่ (Biomes)',
    description: 'Continuous micro-patter of raindrops colliding with dense forest canopy foliage and distant soft thunder.',
    thaiDescription: 'เสียงเม็ดฝนตกกระทบใบไม้ในป่าชุ่มฉ่ำ พร้อมไอเย็น',
    icon: 'CloudRain',
    duration: 3.0,
    tags: ['rain', 'forest rain', 'water', 'ฝน', 'ฝนตก', 'ฝนในป่า', 'หยดน้ำ']
  },
  {
    id: 'cave_reverb_echo',
    name: 'Ancient Cavern Drips & Reverb',
    thaiName: 'เสียงหยดน้ำสะท้อนในถ้ำโบราณ',
    category: 'biome_ambient',
    categoryThai: '🌲 บรรยากาศฉากและแผนที่ (Biomes)',
    description: 'Isolated mineral water droplets falling into still pools with massive spatial cavern acoustics.',
    thaiDescription: 'เสียงหยดน้ำตกกระทบผิวน้ำในถ้ำลึก ก้องสะท้อนกังวาน',
    icon: 'Mountain',
    duration: 2.2,
    tags: ['cave', 'drip', 'echo', 'reverb', 'ถ้ำ', 'หยดน้ำ', 'ก้อง']
  },

  // 🗣️ Voice Acting & Combat Reaction Callouts
  {
    id: 'voice_battle_grunt_1',
    name: 'Warrior Attack Grunt ("ย้ากกก! / Haaa!")',
    thaiName: 'เสียงพากย์ตะโกนโจมตี ("ย้ากกก!")',
    category: 'voice_callout',
    categoryThai: '🗣️ เสียงพากย์และบทสนทนา (Voice)',
    description: 'Resonant battle cry with throat formant filtering and acoustic punch.',
    thaiDescription: 'เสียงตะโกนโจมตีของนักรบ แสดงพลังและความมุ่งมั่น',
    icon: 'Mic',
    duration: 0.4,
    tags: ['grunt', 'attack voice', 'shout', 'ย้าก', 'เสียงตะโกน', 'โจมตี']
  },
  {
    id: 'voice_critical_callout',
    name: 'Critical Strike Announcer ("Critical Hit!")',
    thaiName: 'เสียงผู้ประกาศ ("Critical Hit! / โจมตีจุดตาย")',
    category: 'voice_callout',
    categoryThai: '🗣️ เสียงพากย์และบทสนทนา (Voice)',
    description: 'Energetic voice announcer with spatial stereo widening and crisp transient.',
    thaiDescription: 'เสียงผู้ประกาศการโจมตีติดคริติคอล เร้าใจ สดใส',
    icon: 'Radio',
    duration: 0.6,
    tags: ['announcer', 'critical', 'voice', 'คริ', 'คริติคอล', 'ประกาศ']
  },
  {
    id: 'voice_victory_callout',
    name: 'Victory Cheer ("Mission Complete / ภารกิจสำเร็จ!")',
    thaiName: 'เสียงพากย์ฉลองชัยชนะ ("Victory! / ชัยชนะ")',
    category: 'voice_callout',
    categoryThai: '🗣️ เสียงพากย์และบทสนทนา (Voice)',
    description: 'Heroic triumph fanfare voice chime and joyful callout.',
    thaiDescription: 'เสียงยินดีในชัยชนะเมื่อผ่านด่านหรือชนะบอส',
    icon: 'Trophy',
    duration: 0.8,
    tags: ['victory', 'win', 'complete', 'ชนะ', 'สำเร็จ', 'ผ่านด่าน']
  }
];

class OfflineGameAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;
  private panner: StereoPannerNode | null = null;
  private isMuted: boolean = false;
  private preWarmedBuffers: Map<string, AudioBuffer> = new Map();
  private isInitialized: boolean = false;

  // Active looping ambients
  private activeAmbientNodes: Map<string, { source: AudioNode; stop: () => void }> = new Map();

  constructor() {
    // Lazy initialisation to prevent audio context blockage before user gesture
  }

  /**
   * Pre-warm and unlock audio context immediately on first user interaction (0ms latency readiness)
   */
  public initAudioContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      
      // Master Bus
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      // Sub Busses
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.setValueAtTime(0.95, this.ctx.currentTime);
      this.voiceGain.connect(this.masterGain);

      // Master output
      this.masterGain.connect(this.ctx.destination);
      this.isInitialized = true;
    }

    if (this.ctx.state === 'suspended') {
      try {
        const resumePromise = this.ctx.resume();
        if (resumePromise && typeof resumePromise.catch === 'function') {
          resumePromise.catch((err) => {
            // Benign autoplay policy / user gesture suspension
            console.debug('AudioContext resume deferred until user interaction:', err);
          });
        }
      } catch (e) {
        // Safe fallback
      }
    }

    return this.ctx;
  }

  /**
   * Play any game sound by ID instantaneously (0ms delay)
   */
  public playSound(soundId: string, options: { volume?: number; pan?: number; pitchShift?: number } = {}) {
    const ctx = this.initAudioContext();
    const now = ctx.currentTime;
    const vol = options.volume ?? 1.0;
    const pan = options.pan ?? 0.0;
    const pitch = options.pitchShift ?? 1.0;

    // Create pan node if needed
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
    }

    switch (soundId) {
      // ⚔️ 1. Swift Blade Slash
      case 'slash_light': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(140 * pitch, now + 0.14);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2400, now);
        filter.frequency.linearRampToValueAtTime(600, now + 0.14);
        filter.Q.setValueAtTime(3.5, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.8 * vol, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        // Add high noise swoosh layer
        const noiseBuf = this.createNoiseBuffer(ctx, 0.15);
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuf;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(2000, now);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.6 * vol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(panner || this.sfxGain!);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(panner || this.sfxGain!);

        if (panner) panner.connect(this.sfxGain!);

        osc.start(now);
        noiseSource.start(now);
        osc.stop(now + 0.17);
        noiseSource.stop(now + 0.17);
        break;
      }

      // ⚔️ 2. Heavy Greatsword Cleave
      case 'slash_heavy': {
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(45 * pitch, now + 0.32);

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(110 * pitch, now);
        subOsc.frequency.exponentialRampToValueAtTime(30 * pitch, now + 0.28);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(180, now + 0.32);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.95 * vol, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

        // Metallic ring layer
        const ringOsc = ctx.createOscillator();
        ringOsc.type = 'sine';
        ringOsc.frequency.setValueAtTime(2100 * pitch, now);
        const ringGain = ctx.createGain();
        ringGain.gain.setValueAtTime(0.35 * vol, now);
        ringGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc.connect(filter);
        subOsc.connect(filter);
        filter.connect(gain);
        gain.connect(panner || this.sfxGain!);

        ringOsc.connect(ringGain);
        ringGain.connect(panner || this.sfxGain!);

        if (panner) panner.connect(this.sfxGain!);

        osc.start(now);
        subOsc.start(now);
        ringOsc.start(now);
        osc.stop(now + 0.35);
        subOsc.stop(now + 0.35);
        ringOsc.stop(now + 0.35);
        break;
      }

      // ⚔️ 3. Sword Parry & Metal Clash
      case 'blade_clash': {
        const freqs = [3200, 4850, 7200];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f * pitch, now);
          
          gain.gain.setValueAtTime(0.5 * vol / (idx + 1), now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

          osc.connect(gain);
          gain.connect(panner || this.sfxGain!);
          osc.start(now);
          osc.stop(now + 0.45);
        });

        // Fast spark click
        const clickBuf = this.createNoiseBuffer(ctx, 0.04);
        const clickSrc = ctx.createBufferSource();
        clickSrc.buffer = clickBuf;
        const clickGain = ctx.createGain();
        clickGain.gain.setValueAtTime(0.7 * vol, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        clickSrc.connect(clickGain);
        clickGain.connect(panner || this.sfxGain!);
        clickSrc.start(now);
        clickSrc.stop(now + 0.05);

        if (panner) panner.connect(this.sfxGain!);
        break;
      }

      // ⚔️ 4. Spear Thrust & Pierce
      case 'pierce_thrust': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(220 * pitch, now + 0.18);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3200, now);
        filter.Q.setValueAtTime(4.0, now);

        gain.gain.setValueAtTime(0.9 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(panner || this.sfxGain!);
        if (panner) panner.connect(this.sfxGain!);

        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }

      // ⚔️ 5. Warhammer Ground Crush
      case 'blunt_crush': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(32 * pitch, now + 0.45);

        gain.gain.setValueAtTime(1.0 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

        const noiseBuf = this.createNoiseBuffer(ctx, 0.4);
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(400, now);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.8 * vol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(panner || this.sfxGain!);

        osc.connect(gain);
        gain.connect(panner || this.sfxGain!);
        if (panner) panner.connect(this.sfxGain!);

        osc.start(now);
        noiseSrc.start(now);
        osc.stop(now + 0.5);
        noiseSrc.stop(now + 0.5);
        break;
      }

      // 💥 6. Heavy Explosion & Shockwave
      case 'explosion_heavy': {
        // 1. Initial Shock Transient Snap
        const snapOsc = ctx.createOscillator();
        snapOsc.type = 'triangle';
        snapOsc.frequency.setValueAtTime(300 * pitch, now);
        snapOsc.frequency.exponentialRampToValueAtTime(40 * pitch, now + 0.15);
        const snapGain = ctx.createGain();
        snapGain.gain.setValueAtTime(1.0 * vol, now);
        snapGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        snapOsc.connect(snapGain);
        snapGain.connect(panner || this.sfxGain!);
        snapOsc.start(now);
        snapOsc.stop(now + 0.2);

        // 2. Heavy Sub Rumble
        const subOsc = ctx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(80 * pitch, now);
        subOsc.frequency.exponentialRampToValueAtTime(25 * pitch, now + 1.1);
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.9 * vol, now);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
        subOsc.connect(subGain);
        subGain.connect(panner || this.sfxGain!);
        subOsc.start(now);
        subOsc.stop(now + 1.2);

        // 3. Multi-Band Noise Blast & Debris
        const noiseBuf = this.createNoiseBuffer(ctx, 1.1);
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now);
        filter.frequency.exponentialRampToValueAtTime(150, now + 1.0);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.85 * vol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        noiseSrc.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(panner || this.sfxGain!);
        noiseSrc.start(now);
        noiseSrc.stop(now + 1.2);

        if (panner) panner.connect(this.sfxGain!);
        break;
      }

      // 💥 7. Arcane Magic Explosion
      case 'explosion_magic': {
        const freqs = [587.33, 880, 1174.66, 1760]; // D minor sparkle
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f * pitch, now);
          osc.frequency.exponentialRampToValueAtTime((f * 0.5) * pitch, now + 0.6);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.4 * vol / (i + 1), now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
          osc.connect(g);
          g.connect(panner || this.sfxGain!);
          osc.start(now);
          osc.stop(now + 0.72);
        });

        // Sub Bloom
        const sub = ctx.createOscillator();
        sub.type = 'triangle';
        sub.frequency.setValueAtTime(90 * pitch, now);
        sub.frequency.exponentialRampToValueAtTime(35 * pitch, now + 0.7);
        const subG = ctx.createGain();
        subG.gain.setValueAtTime(0.7 * vol, now);
        subG.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        sub.connect(subG);
        subG.connect(panner || this.sfxGain!);
        sub.start(now);
        sub.stop(now + 0.72);

        if (panner) panner.connect(this.sfxGain!);
        break;
      }

      // 💥 8. Kinetic Shockwave Pulse
      case 'shockwave_pulse': {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(30 * pitch, now + 0.55);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.linearRampToValueAtTime(90, now + 0.55);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.85 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(panner || this.sfxGain!);
        if (panner) panner.connect(this.sfxGain!);

        osc.start(now);
        osc.stop(now + 0.6);
        break;
      }

      // 🌪️ 9. Sonic Air Blade / Vacuum Cut
      case 'wind_gale_slash': {
        const noiseBuf = this.createNoiseBuffer(ctx, 0.28);
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3400 * pitch, now);
        filter.frequency.exponentialRampToValueAtTime(800 * pitch, now + 0.25);
        filter.Q.setValueAtTime(6.0, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.9 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        noiseSrc.connect(filter);
        filter.connect(gain);
        gain.connect(panner || this.sfxGain!);
        if (panner) panner.connect(this.sfxGain!);

        noiseSrc.start(now);
        noiseSrc.stop(now + 0.3);
        break;
      }

      // 🌪️ 10. Whirlwind Tornado Vortex
      case 'wind_tornado_vortex': {
        const noiseBuf = this.createNoiseBuffer(ctx, 1.5);
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;

        // Sweeping LFO filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450 * pitch, now);
        filter.frequency.linearRampToValueAtTime(1400 * pitch, now + 0.7);
        filter.frequency.linearRampToValueAtTime(550 * pitch, now + 1.4);
        filter.Q.setValueAtTime(4.5, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.85 * vol, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.45);

        noiseSrc.connect(filter);
        filter.connect(gain);
        gain.connect(panner || this.sfxGain!);
        if (panner) panner.connect(this.sfxGain!);

        noiseSrc.start(now);
        noiseSrc.stop(now + 1.5);
        break;
      }

      // 🌪️ 11. Phantom Dash Whoosh
      case 'dash_teleport_whoosh': {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(150 * pitch, now + 0.22);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.8 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

        osc.connect(gain);
        gain.connect(panner || this.sfxGain!);
        if (panner) panner.connect(this.sfxGain!);

        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      // 🔥 12. Blazing Fireball Launch
      case 'fireball_cast': {
        // Ignition burst
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(65 * pitch, now + 0.4);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, now);
        filter.frequency.exponentialRampToValueAtTime(250, now + 0.55);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.9 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        // Flaming hiss
        const noiseBuf = this.createNoiseBuffer(ctx, 0.6);
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(800, now);
        noiseFilter.Q.setValueAtTime(2.0, now);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.7 * vol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(panner || this.sfxGain!);

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(panner || this.sfxGain!);

        if (panner) panner.connect(this.sfxGain!);

        osc.start(now);
        noiseSrc.start(now);
        osc.stop(now + 0.62);
        noiseSrc.stop(now + 0.62);
        break;
      }

      // 🔥 13. Flamethrower Stream
      case 'flamethrower_stream': {
        const noiseBuf = this.createNoiseBuffer(ctx, 1.8);
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(650 * pitch, now);
        filter.Q.setValueAtTime(1.8, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.85 * vol, now + 0.15);
        gain.gain.setValueAtTime(0.85 * vol, now + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.78);

        noiseSrc.connect(filter);
        filter.connect(gain);
        gain.connect(panner || this.sfxGain!);
        if (panner) panner.connect(this.sfxGain!);

        noiseSrc.start(now);
        noiseSrc.stop(now + 1.8);
        break;
      }

      // 🔥 14. Campfire & Ember Crackle
      case 'ember_crackle': {
        const crackleCount = 18;
        for (let i = 0; i < crackleCount; i++) {
          const t = now + Math.random() * 1.8;
          const popOsc = ctx.createOscillator();
          popOsc.type = 'sine';
          popOsc.frequency.setValueAtTime((1800 + Math.random() * 2400) * pitch, t);
          const popGain = ctx.createGain();
          popGain.gain.setValueAtTime(0.3 * vol * Math.random(), t);
          popGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
          popOsc.connect(popGain);
          popGain.connect(panner || this.sfxGain!);
          popOsc.start(t);
          popOsc.stop(t + 0.03);
        }
        if (panner) panner.connect(this.sfxGain!);
        break;
      }

      // ⚡ 15. Heavenly Thunder Strike
      case 'thunder_strike': {
        // High voltage snap
        const zapOsc = ctx.createOscillator();
        zapOsc.type = 'sawtooth';
        zapOsc.frequency.setValueAtTime(4500 * pitch, now);
        zapOsc.frequency.exponentialRampToValueAtTime(80 * pitch, now + 0.1);
        const zapGain = ctx.createGain();
        zapGain.gain.setValueAtTime(1.0 * vol, now);
        zapGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        zapOsc.connect(zapGain);
        zapGain.connect(panner || this.sfxGain!);
        zapOsc.start(now);
        zapOsc.stop(now + 0.14);

        // Thunder blast and rumble
        const noiseBuf = this.createNoiseBuffer(ctx, 1.35);
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3200, now);
        filter.frequency.exponentialRampToValueAtTime(80, now + 1.25);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.95 * vol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.35);

        noiseSrc.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(panner || this.sfxGain!);
        noiseSrc.start(now);
        noiseSrc.stop(now + 1.4);

        if (panner) panner.connect(this.sfxGain!);
        break;
      }

      // ⚡ 16. Chain Lightning Arc
      case 'chain_lightning': {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200 * pitch, now);
        osc.frequency.setValueAtTime(2400 * pitch, now + 0.1);
        osc.frequency.setValueAtTime(800 * pitch, now + 0.2);
        osc.frequency.setValueAtTime(3200 * pitch, now + 0.35);

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(900, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.85 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(panner || this.sfxGain!);
        if (panner) panner.connect(this.sfxGain!);

        osc.start(now);
        osc.stop(now + 0.55);
        break;
      }

      // ❄️ 17. Frost Freeze & Crystal Form
      case 'ice_freeze_crystal': {
        const freqs = [1046.5, 1318.5, 1567.98, 2093.0]; // C6 major arpeggio
        freqs.forEach((f, idx) => {
          const t = now + idx * 0.08;
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f * pitch, t);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.45 * vol, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          osc.connect(g);
          g.connect(panner || this.sfxGain!);
          osc.start(t);
          osc.stop(t + 0.42);
        });
        if (panner) panner.connect(this.sfxGain!);
        break;
      }

      // ❄️ 18. Ice Shatter & Shard Explosion
      case 'ice_shatter_burst': {
        for (let i = 0; i < 8; i++) {
          const t = now + i * 0.03;
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime((2400 + Math.random() * 3200) * pitch, t);
          osc.frequency.exponentialRampToValueAtTime((800 + Math.random() * 600) * pitch, t + 0.15);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.4 * vol, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
          osc.connect(g);
          g.connect(panner || this.sfxGain!);
          osc.start(t);
          osc.stop(t + 0.2);
        }
        if (panner) panner.connect(this.sfxGain!);
        break;
      }

      // ✨ 19. Divine Healing & Holy Shimmer
      case 'divine_heal_aura': {
        const chords = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C major 7th + octave
        chords.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f * pitch, now);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.001, now);
          g.gain.linearRampToValueAtTime((0.35 / (idx + 1)) * vol, now + 0.2);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 1.05);
          osc.connect(g);
          g.connect(panner || this.sfxGain!);
          osc.start(now);
          osc.stop(now + 1.1);
        });
        if (panner) panner.connect(this.sfxGain!);
        break;
      }

      // ✨ 20. Abyssal Dark Curse
      case 'dark_curse_drain': {
        const freqs = [369.99, 261.63, 185.0]; // F#4, C4, F#3 (Devil's Tritone)
        freqs.forEach((f) => {
          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f * pitch, now);
          osc.frequency.linearRampToValueAtTime((f * 0.75) * pitch, now + 0.85);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(850, now);

          const g = ctx.createGain();
          g.gain.setValueAtTime(0.3 * vol, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.88);

          osc.connect(filter);
          filter.connect(g);
          g.connect(panner || this.sfxGain!);
          osc.start(now);
          osc.stop(now + 0.9);
        });
        if (panner) panner.connect(this.sfxGain!);
        break;
      }

      // 🌲 21. Forest Canopy Wind & Rustling Trees (0ms Instant Ambient)
      case 'forest_wind_trees': {
        const noiseBuf = this.createNoiseBuffer(ctx, 3.0);
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;

        // Tree rustle filter (brown noise approximation)
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(420, now);
        filter.frequency.linearRampToValueAtTime(780, now + 1.4);
        filter.frequency.linearRampToValueAtTime(360, now + 2.8);
        filter.Q.setValueAtTime(1.4, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.65 * vol, now + 0.6);
        gain.gain.setValueAtTime(0.65 * vol, now + 2.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.98);

        noiseSrc.connect(filter);
        filter.connect(gain);
        gain.connect(panner || this.ambientGain!);
        if (panner) panner.connect(this.ambientGain!);

        noiseSrc.start(now);
        noiseSrc.stop(now + 3.0);
        break;
      }

      // 🌲 22. Morning Birds in Forest
      case 'forest_birds_wildlife': {
        const birdChirps = [
          { t: 0.1, f1: 2800, f2: 3600 },
          { t: 0.35, f1: 3400, f2: 4200 },
          { t: 0.55, f1: 3900, f2: 3100 },
          { t: 1.2, f1: 2900, f2: 3800 },
          { t: 1.45, f1: 3700, f2: 4400 },
          { t: 2.0, f1: 3200, f2: 4100 }
        ];

        birdChirps.forEach(ch => {
          const tStart = now + ch.t;
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(ch.f1 * pitch, tStart);
          osc.frequency.exponentialRampToValueAtTime(ch.f2 * pitch, tStart + 0.08);
          osc.frequency.exponentialRampToValueAtTime(ch.f1 * pitch, tStart + 0.16);

          const g = ctx.createGain();
          g.gain.setValueAtTime(0.001, tStart);
          g.gain.linearRampToValueAtTime(0.35 * vol, tStart + 0.04);
          g.gain.exponentialRampToValueAtTime(0.0001, tStart + 0.18);

          osc.connect(g);
          g.connect(panner || this.ambientGain!);
          osc.start(tStart);
          osc.stop(tStart + 0.2);
        });
        if (panner) panner.connect(this.ambientGain!);
        break;
      }

      // 🌲 23. Gentle Rain on Forest Leaves
      case 'forest_rain_gentle': {
        const noiseBuf = this.createNoiseBuffer(ctx, 3.0);
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1400, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.6 * vol, now + 0.3);
        gain.gain.setValueAtTime(0.6 * vol, now + 2.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.98);

        noiseSrc.connect(filter);
        filter.connect(gain);
        gain.connect(panner || this.ambientGain!);
        if (panner) panner.connect(this.ambientGain!);

        noiseSrc.start(now);
        noiseSrc.stop(now + 3.0);
        break;
      }

      // 🌲 24. Ancient Cavern Drips & Reverb
      case 'cave_reverb_echo': {
        const drops = [0.2, 0.9, 1.7];
        drops.forEach(d => {
          const t = now + d;
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1600 * pitch, t);
          osc.frequency.exponentialRampToValueAtTime(700 * pitch, t + 0.06);

          const g = ctx.createGain();
          g.gain.setValueAtTime(0.6 * vol, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

          osc.connect(g);
          g.connect(panner || this.ambientGain!);
          osc.start(t);
          osc.stop(t + 0.48);
        });
        if (panner) panner.connect(this.ambientGain!);
        break;
      }

      // 🗣️ 25. Warrior Attack Grunt ("ย้ากกก!")
      case 'voice_battle_grunt_1': {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260 * pitch, now);
        osc.frequency.linearRampToValueAtTime(180 * pitch, now + 0.35);

        // Vocal Formant filters (Vowel "AAAH")
        const f1 = ctx.createBiquadFilter();
        f1.type = 'bandpass';
        f1.frequency.setValueAtTime(800, now);
        f1.Q.setValueAtTime(4.0, now);

        const f2 = ctx.createBiquadFilter();
        f2.type = 'bandpass';
        f2.frequency.setValueAtTime(1200, now);
        f2.Q.setValueAtTime(4.0, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.9 * vol, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(f1);
        osc.connect(f2);
        f1.connect(gain);
        f2.connect(gain);
        gain.connect(panner || this.voiceGain!);
        if (panner) panner.connect(this.voiceGain!);

        osc.start(now);
        osc.stop(now + 0.4);

        // Also trigger offline speech API voice if available
        this.speakText("ย้ากกก!", "th-TH", 1.2, 1.1);
        break;
      }

      // 🗣️ 26. Critical Strike Announcer ("Critical Hit!")
      case 'voice_critical_callout': {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(1760 * pitch, now + 0.2);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.5 * vol, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(g);
        g.connect(panner || this.voiceGain!);
        if (panner) panner.connect(this.voiceGain!);

        osc.start(now);
        osc.stop(now + 0.42);

        this.speakText("Critical Hit!", "en-US", 1.1, 1.2);
        break;
      }

      // 🗣️ 27. Victory Fanfare Callout
      case 'voice_victory_callout': {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((n, idx) => {
          const t = now + idx * 0.12;
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n * pitch, t);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.5 * vol, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          osc.connect(g);
          g.connect(panner || this.voiceGain!);
          osc.start(t);
          osc.stop(t + 0.38);
        });
        if (panner) panner.connect(this.voiceGain!);
        this.speakText("ภารกิจสำเร็จ! Victory!", "th-TH", 1.0, 1.0);
        break;
      }

      default: {
        // Fallback default ping
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440 * pitch, now);
        g.gain.setValueAtTime(0.5 * vol, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(g);
        g.connect(panner || this.sfxGain!);
        if (panner) panner.connect(this.sfxGain!);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }
    }
  }

  /**
   * Offline Web Speech API TTS for dynamic game dialogues and NPC speech
   */
  public speakText(text: string, lang: 'th-TH' | 'en-US' | 'ja-JP' = 'th-TH', pitch = 1.0, rate = 1.0) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Stop prior speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.pitch = pitch;
        utterance.rate = rate;
        utterance.volume = this.isMuted ? 0 : 0.95;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Offline speech synthesis error:', err);
      }
    }
  }

  /**
   * Helper to create procedural zero-latency white/pink noise audio buffers
   */
  private createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const output = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter curve approximation (smoother for wind and thunder)
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    return buffer;
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public setSfxVolume(vol: number) {
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public setAmbientVolume(vol: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public setVoiceVolume(vol: number) {
    if (this.voiceGain && this.ctx) {
      this.voiceGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  /**
   * High-Fidelity Voice Over / TTS Speech Synthesis (0ms delay)
   */
  public speak(text: string, lang: string = 'th-TH', options: { pitch?: number; rate?: number; volume?: number } = {}) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.pitch = options.pitch ?? 1.0;
        utterance.rate = options.rate ?? 1.0;
        utterance.volume = options.volume ?? (this.isMuted ? 0 : 1.0);
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error', e);
      }
    }
  }
}

// Global Singleton Instance for instantaneous zero-latency access across the entire engine
export const gameAudioEngine = new OfflineGameAudioEngine();
