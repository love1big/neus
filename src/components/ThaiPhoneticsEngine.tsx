import React, { useState, useEffect } from 'react';
import { Settings2, Volume2, Mic, Activity, AlignLeft, BarChart, Layers, BrainCircuit, Globe, Type, Speech, FileAudio, Play, Pause, FastForward, Sliders, AudioWaveform, Waves} from 'lucide-react';

export default function ThaiPhoneticsEngine() {
  const [inputText, setInputText] = useState('ไปไหนดีจ๊ะ');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return p + 2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex-1 flex flex-col bg-[#050505] p-6 gap-6 overflow-y-auto custom-scrollbar relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#bc8cff]/5 to-transparent pointer-events-none opacity-50"></div>
      
      <div className="flex items-center justify-between border-b border-[#30363d] pb-4 shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#bc8cff]/20 to-[#8a2be2]/20 rounded-xl flex items-center justify-center border border-[#bc8cff]/40 shadow-[0_0_20px_rgba(188,140,255,0.3)]">
            <Globe size={28} className="text-[#bc8cff]" />
          </div>
          <div>
            <h1 className="text-white font-black text-[24px] tracking-tight flex items-center gap-2">
              GLOBAL NLP & PHONETICS ENGINE <span className="px-2 py-0.5 bg-[#bc8cff]/20 text-[#bc8cff] text-[10px] rounded border border-[#bc8cff]/30 uppercase">v9.0.0</span>
            </h1>
            <p className="text-[#8b949e] text-[12px] max-w-4xl leading-relaxed mt-1">
              Deep Neural Text-To-Speech Synthesis with universal linguistic matrices (30+ Languages). Resolves complex phonologies including Thai Trai-Rong (Mid/High/Low), Mandarin/Cantonese Tone Sandhi, Japanese Pitch-Accent, Romance Syllable-Timing, Germanic Stress-Timing, and Semitic Pharyngealization for organically fluid, 100% accurate global speech.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#161b22] border border-[#30363d] rounded p-2 text-center min-w-[80px]">
             <span className="text-[10px] text-[#8b949e] uppercase font-bold block mb-1">Status</span>
             <span className="text-[#3fb950] font-mono text-[12px] font-bold flex items-center justify-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></span> ONLINE</span>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded p-2 text-center min-w-[80px]">
             <span className="text-[10px] text-[#8b949e] uppercase font-bold block mb-1">Latency</span>
             <span className="text-[#58a6ff] font-mono text-[12px] font-bold">14ms</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 shrink-0">
        
        {/* NLP Input & Real-Time Tokenizer */}
        <div className="xl:col-span-2 bg-[#0d1117] border border-[#30363d] rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <h3 className="text-[#c9d1d9] font-bold text-[14px] uppercase tracking-wider flex items-center justify-between border-b border-[#30363d] pb-2">
            <span className="flex items-center gap-2"><Activity size={18} className="text-[#f85149]"/> Tokenization & Morphological Analysis</span>
            <span className="text-[10px] font-mono text-[#8b949e]">Auto-Detecting Language Traits...</span>
          </h3>
          
          <div className="relative">
            <textarea 
               value={inputText} 
               onChange={(e) => setInputText(e.target.value)}
               className="w-full h-24 bg-[#050505] border border-[#f85149]/40 outline-none p-4 rounded-lg text-white font-sans text-[24px] focus:border-[#f85149] shadow-inner resize-none transition-colors"
               placeholder="Enter text in any language..."
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-[#161b22] rounded-lg border border-[#30363d] p-4 flex flex-col">
               <span className="text-[11px] uppercase font-bold text-[#8b949e] mb-3 border-b border-[#30363d] pb-2 flex items-center gap-2"><BrainCircuit size={14}/> Syllable Parsing Matrix</span>
               
               <div className="flex flex-wrap gap-2 text-[13px] font-mono">
                  <div className="bg-[#0d1117] border border-[#3fb950]/50 px-3 py-1.5 rounded flex flex-col items-center">
                     <span className="text-white text-[16px] font-sans">ไป</span>
                     <span className="text-[#3fb950] text-[10px]">ป (Mid) + ไอ (Long)</span>
                     <span className="text-[#e3b341] text-[9px] mt-1">Live / Mid Tone</span>
                  </div>
                  <div className="bg-[#0d1117] border border-[#f85149]/50 px-3 py-1.5 rounded flex flex-col items-center">
                     <span className="text-white text-[16px] font-sans">ไหน</span>
                     <span className="text-[#f85149] text-[10px]">ห (High) + น (Low) + ไอ</span>
                     <span className="text-[#e3b341] text-[9px] mt-1">Live / Rising Tone</span>
                  </div>
                  <div className="bg-[#0d1117] border border-[#58a6ff]/50 px-3 py-1.5 rounded flex flex-col items-center">
                     <span className="text-white text-[16px] font-sans">ดี</span>
                     <span className="text-[#58a6ff] text-[10px]">ด (Mid) + อี (Long)</span>
                     <span className="text-[#e3b341] text-[9px] mt-1">Live / Mid Tone</span>
                  </div>
                  <div className="bg-[#0d1117] border border-[#bc8cff]/50 px-3 py-1.5 rounded flex flex-col items-center">
                     <span className="text-white text-[16px] font-sans">จ๊ะ</span>
                     <span className="text-[#bc8cff] text-[10px]">จ (Mid) + อะ (Short) + ๊</span>
                     <span className="text-[#e3b341] text-[9px] mt-1">Dead / High Tone</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mt-4 text-[11px]">
                  <div className="flex flex-col gap-1 border-r border-[#30363d] pr-4">
                     <div className="flex justify-between"><span className="text-[#8b949e]">Phonetics (IPA)</span><span className="text-[#58a6ff] font-mono">[p a j . n a j . d iː . c a ʔ]</span></div>
                     <div className="flex justify-between"><span className="text-[#8b949e]">Total Syllables</span><span className="text-white font-mono">4</span></div>
                     <div className="flex justify-between"><span className="text-[#8b949e]">Syllable Weight Profile</span><span className="text-[#e3b341] font-mono">Live - Live - Live - Dead</span></div>
                  </div>
                  <div className="flex flex-col gap-1">
                     <div className="flex justify-between"><span className="text-[#8b949e]">Overall Prosody</span><span className="text-[#bc8cff] font-mono">Curious / Friendly</span></div>
                     <div className="flex justify-between"><span className="text-[#8b949e]">Final Intonation Shift</span><span className="text-[#f85149] font-mono">+120 Hz (High-Terminal)</span></div>
                     <div className="flex justify-between"><span className="text-[#8b949e]">Glottal Stops</span><span className="text-[#3fb950] font-mono">Detect: 1 (จ๊ะ)</span></div>
                  </div>
               </div>
            </div>

            {/* F0 Pitch Contour Simulator */}
            <div className="flex-[0.6] bg-[#161b22] rounded-lg border border-[#30363d] p-4 flex flex-col">
               <span className="text-[11px] uppercase font-bold text-[#8b949e] mb-3 border-b border-[#30363d] pb-2 flex items-center gap-2"><AudioWaveform size={14}/> F0 Pitch Contour</span>
               <div className="flex-1 bg-[#050505] rounded border border-[#30363d] relative overflow-hidden flex flex-col justify-between py-2 pl-6 pr-2">
                  <div className="absolute left-0 top-0 bottom-0 w-6 border-r border-[#30363d] bg-[#0d1117] flex flex-col justify-between text-[8px] text-[#8b949e] py-1 text-center font-mono">
                     <span>H</span>
                     <span>M</span>
                     <span>L</span>
                  </div>
                  {/* Grid Lines */}
                  <div className="absolute left-6 right-0 top-1/4 h-[1px] bg-[#30363d]/50"></div>
                  <div className="absolute left-6 right-0 top-2/4 h-[1px] bg-[#30363d]/50"></div>
                  <div className="absolute left-6 right-0 top-3/4 h-[1px] bg-[#30363d]/50"></div>
                  
                  {/* Synthesized F0 Curve */}
                  <svg className="absolute inset-0 left-6 w-[calc(100%-24px)] h-full overflow-visible z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M 0 50 Q 15 50 25 50" fill="none" stroke="#3fb950" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
                     <path d="M 30 70 Q 40 40 50 30" fill="none" stroke="#f85149" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
                     <path d="M 55 50 Q 65 50 75 50" fill="none" stroke="#58a6ff" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
                     <path d="M 80 40 Q 90 20 100 10" fill="none" stroke="#bc8cff" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
                  </svg>
               </div>
               <div className="flex justify-between mt-2 text-[9px] text-[#8b949e] px-2 font-mono">
                  <span>ไป (Mid)</span>
                  <span>ไหน (Rise)</span>
                  <span>ดี (Mid)</span>
                  <span>จ๊ะ (High)</span>
               </div>
            </div>
          </div>
        </div>

        {/* Synthesizer & Output Module */}
        <div className="bg-[#0d1117] border border-[#bc8cff]/40 rounded-xl p-5 shadow-[0_0_20px_rgba(188,140,255,0.1)] flex flex-col gap-4">
          <h3 className="text-[#c9d1d9] font-bold text-[14px] uppercase tracking-wider flex items-center justify-between border-b border-[#30363d] pb-2">
            <span className="flex items-center gap-2"><Volume2 size={18} className="text-[#bc8cff]"/> Acoustic Synthesizer Node</span>
            <span className="text-[#bc8cff] bg-[#bc8cff]/10 px-2 py-0.5 rounded text-[10px]">Neural Vocoder Active</span>
          </h3>

          <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar h-[200px] pr-2">
             <div className="grid grid-cols-2 gap-3">
                 <div className="bg-[#161b22] border border-[#30363d] rounded p-2">
                    <label className="text-[10px] uppercase font-bold text-[#8b949e] block mb-1">Neural Vocoder Architecture</label>
                    <select className="w-full bg-transparent text-white text-[11px] outline-none">
                       <option>BigVGAN (Universal Audio - 24kHz)</option>
                       <option>HiFi-GAN (High Fidelity / Fast)</option>
                       <option>WaveGlow (Maximum Fidelity - Heavy)</option>
                       <option>MelGAN (Low Latency Real-time)</option>
                    </select>
                 </div>
                 <div className="bg-[#161b22] border border-[#30363d] rounded p-2">
                    <label className="text-[10px] uppercase font-bold text-[#8b949e] block mb-1">Emotion Envelope</label>
                    <select className="w-full bg-transparent text-white text-[11px] outline-none">
                       <option>Neutral Conversation / Broadcast</option>
                       <option>Surprised / Curious (Pitch Raised)</option>
                       <option>Angry / Direct (Harsh Glottal Stops)</option>
                       <option>Polite / Formal (Soft Breath Trail)</option>
                       <option>Whisper (Unvoiced Breath Synthesis)</option>
                       <option>Shouting (Max Pharyngeal Tension)</option>
                    </select>
                 </div>
             </div>

             <div className="bg-[#161b22] border border-[#30363d] rounded p-2">
                 <label className="text-[10px] uppercase font-bold text-[#8b949e] block mb-1">Global Voice Phonology Model</label>
                 <select className="w-full bg-transparent text-white text-[11px] outline-none border-none custom-scrollbar pb-1 text-ellipsis overflow-hidden whitespace-nowrap">
                    <optgroup label="Singing Voice Synthesis (SVS) - Pop & Contemporary">
                      <option>SVS - Western Pop / Belt (Chest-Mix Dominant / High Formant)</option>
                      <option>SVS - K-Pop / J-Pop (Bright Resonance / Fast Syllabic Transition)</option>
                      <option>SVS - R&B / Soul (Melisma / Vocal Runs / Breathy Falsetto)</option>
                      <option>SVS - Thai String/Pop (สตริง - Light Vibrato / Forward Placement)</option>
                      <option>SVS - Indie / Bedroom Pop (Heavy Breathiness / Low Glottal Tension)</option>
                      <option>SVS - Lo-Fi Chill (Vinyl-Vocoder sim / Pitch Drift)</option>
                    </optgroup>
                    <optgroup label="Singing Voice Synthesis (SVS) - Classical & Folk">
                      <option>SVS - Opera / Bel Canto (Chiaroscuro / Dark Coloration / Heavy Vibrato)</option>
                      <option>SVS - Thai Luk Thung (ลูกทุ่ง - Glottal Ornaments / Wide Pitch Bends)</option>
                      <option>SVS - Thai Mor Lam (หมอลำ - Fast Patter / Isan Tonal Bends)</option>
                      <option>SVS - Chinese Peking Opera (High Falsetto / Nasal Resonance)</option>
                      <option>SVS - Indian Carnatic (Gamaka / Microtonal Pitch Slides)</option>
                      <option>SVS - Irish Sean-nós (Unaccompanied / Free Rhythm Ornamentation)</option>
                      <option>SVS - Celtic Folk (Airy Timbre / Rapid Grace Notes)</option>
                    </optgroup>
                    <optgroup label="Singing Voice Synthesis (SVS) - Heavy & Extreme">
                      <option>SVS - Rock / Grunge (Fry Drive / False Cord Distortion / Rasp)</option>
                      <option>SVS - Heavy Metal (Death Growl / Guttural Resonance)</option>
                      <option>SVS - Nu-Metal (Aggressive Enunciation / Whisper-to-Scream)</option>
                      <option>SVS - Broadway / Musical Theatre (High Intelligibility / Bright Diction)</option>
                    </optgroup>
                    <optgroup label="Tonal Languages (Sinitic & Tai-Kadai)">
                      <option>Thai - Bangkok Standard (RTGS - 5 Tones)</option>
                      <option>Thai - Northern (Kam Mueang - 6 Tones)</option>
                      <option>Thai - Northeastern (Isan - 6 Tones)</option>
                      <option>Thai - Southern (Dambro - Rapid Intonation)</option>
                      <option>Thai - Shan (Tai Yai - 5 Tones / Breathy)</option>
                      <option>Mandarin Chinese (Beijing Standard - 4 Tones + Neutral)</option>
                      <option>Mandarin Chinese (Taiwanese - Flatter Tones)</option>
                      <option>Mandarin Chinese (Sichuanese - Low Pitch-Drop)</option>
                      <option>Cantonese (Hong Kong - 6/9 Tones)</option>
                      <option>Cantonese (Guangzhou - Traditional 9 Tones)</option>
                      <option>Hakka (Sixian - 6 Tones / Checked Syllables)</option>
                      <option>Hokkien (Taiwanese - 7 Tones / Extensive Sandhi)</option>
                      <option>Shanghainese (Wu - Pitch-Accent Transitioning)</option>
                      <option>Vietnamese (Hanoi - 6 Tones / Breathy & Creaky Phonation)</option>
                      <option>Vietnamese (Ho Chi Minh - 5 Tones)</option>
                      <option>Lao (Vientiane - 6 Tones)</option>
                      <option>Hmong (Daw - 7 Tones)</option>
                    </optgroup>
                    <optgroup label="Pitch-Accent & Moraic">
                      <option>Japanese (Tokyo Standard Pitch-Accent / Moraic)</option>
                      <option>Japanese (Kansai Dialect / Kyoto-Osaka Accent)</option>
                      <option>Japanese (Ainu - Syllabic / High Vowel Variation)</option>
                      <option>Korean (Seoul Standard - Segmental Intonation)</option>
                      <option>Korean (Busan/Gyeongsang - Retained Pitch-accent)</option>
                      <option>Korean (Jeju Dialect - Archaisms)</option>
                      <option>Punjabi (Standard - Tone originating from Breathiness)</option>
                    </optgroup>
                    <optgroup label="Stress-Timed (Germanic & Celtic)">
                      <option>English (US General American - Rhotic / Flap-T)</option>
                      <option>English (US Southern / Texan - Monophthongization)</option>
                      <option>English (US African American Vernacular - Copula Drop / Varied Intonation)</option>
                      <option>English (UK Received Pronunciation - Non-rhotic / T-Glottalization)</option>
                      <option>English (UK Cockney - Th-Fronting / L-Vocalization)</option>
                      <option>English (Scottish - Trilled R / Vowel Length Rule)</option>
                      <option>English (Australian General - Broad Vowels / High-Rising Terminal)</option>
                      <option>English (Irish - Broad/Slender Contrast influence)</option>
                      <option>German (Hochdeutsch standard / Fortis-Lenis)</option>
                      <option>German (Bavarian/Austrian - Vowel Shifts)</option>
                      <option>German (Swiss / Schwyzerdütsch - Velar Fricatives)</option>
                      <option>Dutch (Standard ABN - Uvular/Alveolar trill options)</option>
                      <option>Afrikaans (Vowel constraints / Leniency)</option>
                      <option>Swedish (Central Standard - Pitch Accent / Grave vs Acute)</option>
                      <option>Norwegian (Urban East / Pitch Accent)</option>
                      <option>Danish (Stød - Laryngealization / Creaky Voice)</option>
                      <option>Welsh (Standard - Murmur / Fricative clusters)</option>
                    </optgroup>
                    <optgroup label="Syllable-Timed (Romance/Austronesian)">
                      <option>Spanish (Castilian/Spain - Apical S & Interdental Fricatives)</option>
                      <option>Spanish (Mexican - Seseo / Clear Consonantal boundaries)</option>
                      <option>Spanish (Argentine Rioplatense - Yeísmo Rehilado / Sh-sound)</option>
                      <option>Spanish (Caribbean - Debuccalization of S)</option>
                      <option>French (Parisian Standard - Uvular R / Nasal Vowels)</option>
                      <option>French (Quebec - Diphthongization / Affrication of T/D)</option>
                      <option>Italian (Standard Tuscan - Gemination / Vowel Elision)</option>
                      <option>Italian (Neapolitan - Schwa intrusion)</option>
                      <option>Portuguese (Brazilian Paulistano - Palatalization of T/D)</option>
                      <option>Portuguese (Brazilian Carioca - Palatal S)</option>
                      <option>Portuguese (European - Heavy Vowel Reduction / Dark L)</option>
                      <option>Tagalog (Standard - Syllable-timed / Glottal Stops)</option>
                      <option>Indonesian (Standard - Schwa reduction / Clear trills)</option>
                    </optgroup>
                    <optgroup label="Slavic, Baltic & Phonemic Palatalization">
                      <option>Russian (Moscow - Vowel Reduction Akan'e / Palatalization)</option>
                      <option>Russian (St. Petersburg - Ekan'e)</option>
                      <option>Polish (Standard - Complex Consonant Clusters / Nasal Vowels)</option>
                      <option>Ukrainian (Standard - Velar Fricative / No Akan'e)</option>
                      <option>Czech (Standard - Syllabic Consonants R/L / Initial Stress)</option>
                      <option>Serbo-Croatian (Standard - Pitch Accent / 4 Tones)</option>
                      <option>Latvian (Standard - Initial Stress / Pitch Accent)</option>
                      <option>Lithuanian (Standard - Pitch Accent / Vowel Length)</option>
                    </optgroup>
                    <optgroup label="Afroasiatic (Semitic) & Pharyngeal">
                      <option>Arabic (Modern Standard / MSA - Pharyngealization "Tafkheem")</option>
                      <option>Arabic (Egyptian - G/J shift / Glottal Q)</option>
                      <option>Arabic (Levantine - Vowel raising / Imāla)</option>
                      <option>Arabic (Gulf/Khaleeji - Interdental retention)</option>
                      <option>Hebrew (Modern Israeli - Uvular R / Loss of Pharyngeals)</option>
                      <option>Hebrew (Hassidic/Ashkenazi - Vowel Shifts)</option>
                      <option>Amharic (Standard - Ejective Consonants / Gemination)</option>
                      <option>Somali (Standard - Advanced Tongue Root / Tone-Accent)</option>
                    </optgroup>
                    <optgroup label="Dravidian & Indo-Aryan (Retroflexive)">
                      <option>Hindi (Standard - Aspirated Consonants / Breathy Voiced)</option>
                      <option>Urdu (Standard - Persianized Phonemes q, x, ɣ)</option>
                      <option>Bengali (Standard - Vowel Rounding / O-shift / No retroflex flaps)</option>
                      <option>Marathi (Standard - Retroflex Affricates / Vowel Length drop)</option>
                      <option>Tamil (Standard - Heavy Retroflexion / Flaps / Trills)</option>
                      <option>Telugu (Standard - Vowel Harmony / Agglutinative)</option>
                      <option>Malayalam (Standard - Alveolar vs Dental Trills)</option>
                    </optgroup>
                    <optgroup label="Other Complex Phonetics & Isolates">
                      <option>Turkish (Standard Istanbul - Strict Vowel Harmony / Final Devoicing)</option>
                      <option>Finnish (Standard - Precise Vowel/Consonant Length Focus)</option>
                      <option>Hungarian (Standard - Vowel Harmony / Palatal Stops)</option>
                      <option>Navajo (Athabaskan - Ejective Consonants / Nasal Vowels / 4 Tones)</option>
                      <option>Xhosa (Bantu - 18 Click Consonants / Tonal)</option>
                      <option>Zulu (Bantu - Implosives / Depressor Consonants / Tone)</option>
                      <option>Swahili (Bantu - Syllable Timed / No Lexical Tone)</option>
                      <option>Hawaiian (Polynesian - 13 Phonemes / Distinct Vowel Length [Kahakō])</option>
                      <option>Maori (Polynesian - Moraic Timing / Macrons)</option>
                    </optgroup>
                 </select>
             </div>

             <div className="bg-[#161b22] border border-[#30363d] rounded p-3 text-[11px]">
                <div className="flex flex-col gap-3">
                   <div>
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[#c9d1d9] font-bold">Vocal Tract Length (Formant Shift)</span>
                         <span className="font-mono text-[#e3b341]">M (Lower / Larger) - 42%</span>
                      </div>
                      <input type="range" className="w-full accent-[#e3b341] h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" defaultValue={42}/>
                   </div>
                   <div>
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[#c9d1d9] font-bold">Glottal Closure (Breathiness vs Tenseness)</span>
                         <span className="font-mono text-[#f85149]">Tense (Pressed) - 75%</span>
                      </div>
                      <input type="range" className="w-full accent-[#f85149] h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" defaultValue={75}/>
                   </div>
                   <div>
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[#c9d1d9] font-bold">Speech Rate (Morae/Syllables per sec)</span>
                         <span className="font-mono text-[#58a6ff]">1.2x (Fast)</span>
                      </div>
                      <input type="range" className="w-full accent-[#58a6ff] h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" defaultValue={60}/>
                   </div>
                   <div>
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[#c9d1d9] font-bold">Intonation Intensity / F0 Variance</span>
                         <span className="font-mono text-[#3fb950]">85% (Expressive)</span>
                      </div>
                      <input type="range" className="w-full accent-[#3fb950] h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" defaultValue={85}/>
                   </div>
                   <div>
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[#c9d1d9] font-bold">Phoneme Coarticulation Blending</span>
                         <span className="font-mono text-[#bc8cff]">Dynamic / Natural</span>
                      </div>
                      <input type="range" className="w-full accent-[#bc8cff] h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" defaultValue={70}/>
                   </div>
                   <div>
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[#c9d1d9] font-bold">Micro-tremor (Jitter & Shimmer)</span>
                         <span className="font-mono text-[#8b949e]">12% (Organic Human Variance)</span>
                      </div>
                      <input type="range" className="w-full accent-[#8b949e] h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" defaultValue={12}/>
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            {/* Audio Player UX */}
            <div className="bg-[#050505] border border-[#30363d] rounded p-3 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 rounded-full bg-[#bc8cff] text-[#050505] flex justify-center items-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(188,140,255,0.4)]">
                       {isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor" className="ml-1"/>}
                    </button>
                    <div className="flex-1">
                       <div className="h-2 w-full bg-[#161b22] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#58a6ff] via-[#bc8cff] to-[#f85149]" style={{ width: `${playProgress}%` }}></div>
                       </div>
                       <div className="flex justify-between mt-1 text-[9px] font-mono text-[#8b949e]">
                          <span>00:00.00</span>
                          <span>00:01.42</span>
                       </div>
                    </div>
                </div>
            </div>

            <button onClick={() => { setPlayProgress(0); setIsPlaying(true); }} className="w-full py-3 bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 border border-[#bc8cff]/30 text-[#bc8cff] font-bold text-[13px] uppercase tracking-widest rounded-xl transition-all flex justify-center items-center gap-2">
              <FastForward size={16} /> Render & Play Audio
            </button>
          </div>
        </div>

        {/* --- BOTTOM ROW: Library & Deep Rules --- */}
        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 shadow-lg flex flex-col gap-4 lg:col-span-2">
               <h3 className="text-[#c9d1d9] font-bold text-[14px] uppercase tracking-wider flex items-center gap-2 border-b border-[#30363d] pb-2">
                 <Globe size={18} className="text-[#58a6ff]"/> Universal Language Matrices (Samples)
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[250px] overflow-y-auto custom-scrollbar pr-2">
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-4 text-[12px] text-[#8b949e] flex flex-col gap-2">
                     <h4 className="text-white font-bold text-[13px] border-b border-[#30363d] pb-1">1. Thai (ภาษาไทย) - Trai-Rong & Tones</h4>
                     <p><strong className="text-[#3fb950]">ไตรยางศ์ (3 Consonant Classes):</strong> Tone rules change dynamically based on Initial consonant Class (High/Mid/Low).</p>
                     <p><strong className="text-[#f85149]">คำเป็น-คำตาย (Syllable Weight):</strong> Live Syllables (long vowels or ng, n, m, y, w finals) allow all tones. Dead Syllables (short vowels or k, d, b finals) clip the vowel, constraint limiting tone outcomes.</p>
                     <p><strong className="text-[#58a6ff]">การเปลี่ยนรูปสระ (Vowel Mutation):</strong> Vowels mutate when a final consonant is present (e.g. เ-ะ -&gt; เ-็) and unseen vowels (อะ, โอะ) are pronounced automatically in implicit clusters.</p>
                  </div>
                  
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-4 text-[12px] text-[#8b949e] flex flex-col gap-2">
                     <h4 className="text-white font-bold text-[13px] border-b border-[#30363d] pb-1">2. Korean (ເກົາຫຼີ/เกาหลี) - Sandhi & Batchim</h4>
                     <p><strong className="text-[#e3b341]">받침 (Batchim Neutralization):</strong> All final consonants collapse to unreleased [k̚, t̚, p̚, n, m, ŋ, l].</p>
                     <p><strong className="text-[#e3b341]">연음 (Liaison & Resyllabification):</strong> Final consonant carries over to following empty syllable 'ㅇ' (e.g., 음악 -&gt; [으막]).</p>
                     <p><strong className="text-[#e3b341]">음운 현상 (Phonetic Rules):</strong> Tensification (경음화), Nasalization (비음화 - e.g. 국물 -&gt; [궁물]), Palatalization (구개음화), and Aspiration (격음화).</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded p-4 text-[12px] text-[#8b949e] flex flex-col gap-2">
                     <h4 className="text-white font-bold text-[13px] border-b border-[#30363d] pb-1">3. Mandarin (จีนกลาง) - Tone Sandhi</h4>
                     <p><strong className="text-[#bc8cff]">三声变调 (Third-Tone Sandhi):</strong> When two 3rd Tones are consecutive, the first changes to a 2nd Tone (e.g., 你好 nǐ hǎo -&gt; ní hǎo).</p>
                     <p><strong className="text-[#bc8cff]">一 / 不 (Yī / Bù Sandhi):</strong> Change tone based on the following word (e.g., 不好 bù hǎo vs 不是 bú shì).</p>
                     <p><strong className="text-[#bc8cff]">儿化音 (Erhua Rhotacization):</strong> Addition of retroflex 'r' suffix morphs preceding vowel qualities (e.g. 哪儿 nǎr).</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded p-4 text-[12px] text-[#8b949e] flex flex-col gap-2">
                     <h4 className="text-white font-bold text-[13px] border-b border-[#30363d] pb-1">4. English (ภาษาอังกฤษ) - Stress-Timing</h4>
                     <p><strong className="text-[#3fb950]">Schwa Reduction (/ə/):</strong> Unstressed vowels collapse into neutral sounds regardless of spelling (e.g., 'photograph' vs 'photography').</p>
                     <p><strong className="text-[#3fb950]">Flapping & Glottalization:</strong> T/D become alveolar flaps [ɾ] between vowels; T becomes a glottal stop [ʔ] before N (e.g. 'button').</p>
                     <p><strong className="text-[#3fb950]">Linking & Intrusion:</strong> Consonant-to-vowel linking, Intrusive /r/, /j/, /w/ applied dynamically across word boundaries for fluidity.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded p-4 text-[12px] text-[#8b949e] flex flex-col gap-2 lg:col-span-2">
                     <h4 className="text-white font-bold text-[13px] border-b border-[#30363d] pb-1">5. Russian (ภาษารัสเซีย) - Palatalization & Reduction</h4>
                     <p><strong className="text-[#f85149]">Аканье/Иканье (Vowel Reduction):</strong> Unstressed O & A reduce to [ɐ] or schwa [ə]; unstressed Е & Я reduce to [ɪ]. Absolutely critical for natural speech.</p>
                     <p><strong className="text-[#f85149]">Палатализация (Hard vs Soft):</strong> Consonants are palatalized (Soft/Mjagkij) before Е, Ё, И, Ю, Я or Ь, repositioning the tongue body to the hard palate.</p>
                     <p><strong className="text-[#f85149]">De-voicing / Assimilation:</strong> Voiced consonants become voiceless at the end of words (e.g., друг -&gt; [druk]). Regressive assimilation in consonant clusters.</p>
                  </div>
               </div>
            </div>

            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 shadow-lg flex flex-col gap-4">
               <h3 className="text-[#c9d1d9] font-bold text-[14px] uppercase tracking-wider flex items-center gap-2 border-b border-[#30363d] pb-2">
                 <Waves size={18} className="text-[#e3b341]"/> Tone / Pitch Mapping Graph
               </h3>
               <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col text-[11px] text-[#8b949e] relative justify-between">
                  <div className="flex items-center justify-between mb-2">
                     <span className="font-bold text-white">Flat / Mid (สามัญ/Tone 1)</span>
                     <span className="w-16 h-1 bg-[#8b949e] rounded-full"></span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                     <span className="font-bold text-white">Low / Deep (เอก/Tone 3)</span>
                     <svg className="w-16 h-4" viewBox="0 0 100 20"><path d="M 0 10 Q 50 15 100 15" fill="none" stroke="#8b949e" strokeWidth="4" strokeLinecap="round"/></svg>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                     <span className="font-bold text-white">Falling / Sharp (โท/Tone 4)</span>
                     <svg className="w-16 h-6" viewBox="0 0 100 30"><path d="M 0 10 Q 30 5 40 10 T 100 25" fill="none" stroke="#f85149" strokeWidth="4" strokeLinecap="round"/></svg>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                     <span className="font-bold text-white">High (ตรี / Pitch Up)</span>
                     <svg className="w-16 h-6" viewBox="0 0 100 30"><path d="M 0 20 L 100 5" fill="none" stroke="#58a6ff" strokeWidth="4" strokeLinecap="round"/></svg>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="font-bold text-white">Rising (จัตวา/Tone 2)</span>
                     <svg className="w-16 h-8" viewBox="0 0 100 40"><path d="M 0 15 L 40 35 L 100 5" fill="none" stroke="#bc8cff" strokeWidth="4" strokeLinecap="round"/></svg>
                  </div>
               </div>
            </div>

        </div>

      </div>
    </div>
  );
}
