import React, { useState } from 'react';
import { Zap, Activity, Clock, Shield, Target, Plus, Database, MousePointer2, MoveRight, Layers, Flame, Droplet, Wind, Crosshair, Tag, Settings2, Play } from 'lucide-react';

export default function GameplayAbilitySystem() {
  const [activeTab, setActiveTab] = useState('abilities');
  const [selectedAbility, setSelectedAbility] = useState('Fireball_T1');

  const abilities = [
    { id: 'Fireball_T1', name: 'Pyromancer Fireball', type: 'Active', tags: ['Damage.Fire', 'Projectile'] },
    { id: 'Dash_Evade', name: 'Shadow Dash', type: 'Movement', tags: ['Movement.Evade', 'IFrame'] },
    { id: 'Passive_Regen', name: 'Troll Blood', type: 'Passive', tags: ['Buff.Regen.Health'] },
    { id: 'Ultimate_Meteor', name: 'Meteor Strike', type: 'Ultimate', tags: ['Damage.Fire', 'AoE', 'CrowdControl'] },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#d29922]/20 border border-[#d29922]/50 rounded">
            <Zap className="text-[#d29922]" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide">Gameplay Ability System (GAS)</h1>
            <p className="text-[10px] text-[#8b949e]">Data-Driven Abilities, Attributes, and Gameplay Effects</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
            <Settings2 size={14} /> Tag Dictionary
          </button>
          <button className="px-3 py-1.5 bg-[#238636] border border-[#2ea043] rounded text-xs flex items-center gap-2 hover:bg-[#2c974b]">
            <Play size={14} /> Simulate Ability
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Ability List */}
        <div className="w-64 border-r border-[#30363d] flex flex-col bg-[#161b22]">
          <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e] flex justify-between items-center">
            <div className="flex items-center gap-2"><Database size={14} /> ABILITY BLUEPRINTS</div>
            <Plus size={14} className="hover:text-white cursor-pointer" />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {abilities.map(ability => (
              <div 
                key={ability.id}
                onClick={() => setSelectedAbility(ability.id)}
                className={`p-3 rounded cursor-pointer mb-2 border ${
                  selectedAbility === ability.id ? 'bg-[#d29922]/10 border-[#d29922]/50' : 'bg-[#0d1117] border-[#30363d] hover:border-[#8b949e]'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className={`text-sm font-bold ${selectedAbility === ability.id ? 'text-[#d29922]' : 'text-[#c9d1d9]'}`}>
                    {ability.name}
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#21262d] rounded text-[#8b949e]">{ability.type}</span>
                </div>
                <div className="flex gap-1 flex-wrap mt-2">
                  {ability.tags.map(t => (
                    <span key={t} className="text-[9px] text-[#58a6ff] bg-[#58a6ff]/10 px-1 rounded flex items-center gap-1">
                      <Tag size={8} /> {t.split('.').pop()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Ability Editor Canvas */}
        <div className="flex-1 flex flex-col bg-[#010409]">
          {/* Editor Tabs */}
          <div className="flex border-b border-[#30363d] bg-[#161b22]">
            <button className="px-6 py-3 text-sm font-bold border-b-2 border-[#d29922] text-[#d29922] flex items-center gap-2">
              <Activity size={16} /> Config & Execution
            </button>
            <button className="px-6 py-3 text-sm font-bold border-b-2 border-transparent text-[#8b949e] hover:text-[#c9d1d9] flex items-center gap-2">
              <Layers size={16} /> Gameplay Effects (GE)
            </button>
            <button className="px-6 py-3 text-sm font-bold border-b-2 border-transparent text-[#8b949e] hover:text-[#c9d1d9] flex items-center gap-2">
              <Tag size={16} /> Gameplay Tags
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6" style={{ backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Cost & Cooldown */}
              <div className="bg-[#161b22]/90 backdrop-blur border border-[#30363d] rounded-xl overflow-hidden shadow-xl">
                <div className="px-4 py-2 border-b border-[#30363d] bg-[#0d1117] text-xs font-bold text-[#8b949e] flex items-center gap-2">
                  <Clock size={14} className="text-[#58a6ff]" /> COST & COOLDOWN (GE_Cost, GE_Cooldown)
                </div>
                <div className="p-6 flex gap-8">
                  <div className="flex-1">
                    <div className="text-xs text-[#8b949e] mb-2">Resource Cost</div>
                    <div className="flex items-center gap-2">
                      <select className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-sm text-[#58a6ff] outline-none w-1/2">
                        <option>Mana</option>
                        <option>Stamina</option>
                        <option>Health</option>
                      </select>
                      <input type="number" defaultValue="25" className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-sm text-white w-1/4 outline-none" />
                      <span className="text-xs text-[#8b949e]">pts</span>
                    </div>
                  </div>
                  <div className="w-px bg-[#30363d]"></div>
                  <div className="flex-1">
                    <div className="text-xs text-[#8b949e] mb-2">Cooldown Duration</div>
                    <div className="flex items-center gap-2">
                      <input type="number" defaultValue="4.5" step="0.1" className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-sm text-[#d29922] w-1/3 outline-none" />
                      <span className="text-xs text-[#8b949e]">seconds</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tag Requirements */}
              <div className="bg-[#161b22]/90 backdrop-blur border border-[#30363d] rounded-xl overflow-hidden shadow-xl">
                <div className="px-4 py-2 border-b border-[#30363d] bg-[#0d1117] text-xs font-bold text-[#8b949e] flex items-center gap-2">
                  <Tag size={14} className="text-[#3fb950]" /> ABILITY ACTIVATION TAGS
                </div>
                <div className="p-6 grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-bold text-[#c9d1d9] mb-2 border-b border-[#30363d] pb-1">Activation Required Tags</div>
                    <div className="text-[10px] text-[#8b949e] mb-2">Caster MUST have these tags to cast.</div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs text-[#8b949e] italic">None</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#c9d1d9] mb-2 border-b border-[#30363d] pb-1">Activation Blocked Tags</div>
                    <div className="text-[10px] text-[#8b949e] mb-2">Caster CANNOT cast if they have these.</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-[#f85149]/10 border border-[#f85149]/50 rounded text-xs text-[#f85149]">State.Dead</span>
                      <span className="px-2 py-1 bg-[#f85149]/10 border border-[#f85149]/50 rounded text-xs text-[#f85149]">State.Stunned</span>
                      <span className="px-2 py-1 bg-[#f85149]/10 border border-[#f85149]/50 rounded text-xs text-[#f85149]">State.Silenced</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Execution Graph Mock */}
              <div className="bg-[#161b22]/90 backdrop-blur border border-[#30363d] rounded-xl overflow-hidden shadow-xl">
                <div className="px-4 py-2 border-b border-[#30363d] bg-[#0d1117] text-xs font-bold text-[#8b949e] flex items-center gap-2">
                  <Target size={14} className="text-[#f85149]" /> EXECUTION PIPELINE
                </div>
                <div className="p-6 overflow-x-auto">
                  <div className="flex items-center min-w-max gap-4 p-4">
                    
                    <div className="w-48 bg-[#0d1117] border-2 border-[#58a6ff] rounded-lg p-3 relative">
                      <div className="text-xs text-[#58a6ff] font-bold mb-1">1. TryActivateAbility</div>
                      <div className="text-[10px] text-[#8b949e]">Checks Tags, Cost, Cooldown.</div>
                    </div>
                    
                    <MoveRight className="text-[#30363d]" />
                    
                    <div className="w-48 bg-[#0d1117] border-2 border-[#d29922] rounded-lg p-3 relative">
                      <div className="text-xs text-[#d29922] font-bold mb-1">2. Play Montages</div>
                      <div className="text-[10px] text-[#8b949e]">Anim: Anim_CastFireball</div>
                      <div className="text-[10px] text-[#8b949e]">Waits for AnimNotify event.</div>
                    </div>

                    <MoveRight className="text-[#30363d]" />

                    <div className="w-48 bg-[#0d1117] border-2 border-[#f85149] rounded-lg p-3 relative shadow-[0_0_15px_rgba(248,81,73,0.2)]">
                      <div className="text-xs text-[#f85149] font-bold mb-1">3. Apply Gameplay Effect</div>
                      <div className="text-[10px] text-[#8b949e]">GE_FireballDamage</div>
                      <div className="text-[10px] text-white mt-1 p-1 bg-[#21262d] rounded">Base Dmg: 150</div>
                    </div>

                    <MoveRight className="text-[#30363d]" />

                    <div className="w-40 bg-[#0d1117] border-2 border-[#3fb950] rounded-lg p-3 relative">
                      <div className="text-xs text-[#3fb950] font-bold mb-1">4. End Ability</div>
                      <div className="text-[10px] text-[#8b949e]">Returns control to player.</div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
