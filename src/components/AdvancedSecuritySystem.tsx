import React from 'react';
import { ShieldCheck, Lock, Key, AlertOctagon, Activity, Users, ShieldAlert, FileKey} from 'lucide-react';

export default function AdvancedSecuritySystem() {
  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      <div className="flex-1 flex flex-col">
         {/* Header */}
         <div className="h-16 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <ShieldCheck size={20} className="text-green-400" />
               </div>
               <div>
                  <h1 className="font-bold text-white text-sm">Security & Compliance Dashboard</h1>
                  <p className="text-[10px] text-gray-400 font-mono">System Status: SECURE | All encryption layers active</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right flex flex-col items-end">
                  <span className="text-xs text-gray-400">Active Sessions</span>
                  <span className="text-lg font-mono text-white font-bold">14,203</span>
               </div>
               <button className="px-4 py-2 bg-[#2a2b3d] hover:bg-[#30363d] rounded text-xs font-medium border border-[#30363d]">View Audit Logs</button>
            </div>
         </div>

         <div className="flex-1 p-6 grid grid-cols-3 gap-6 overflow-y-auto">
            {/* Core Protections */}
            <div className="col-span-2 flex flex-col gap-6">
               <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Lock size={16} className="text-blue-400"/> Core Infrastructure
               </h3>
               
               <div className="grid grid-cols-2 gap-4">
                  {/* Card 1 */}
                  <div className="bg-[#141525] border border-[#2a2b3d] rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                     <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-blue-500/10 rounded text-blue-400"><FileKey size={20}/></div>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] uppercase font-bold rounded">Active</span>
                     </div>
                     <h4 className="font-bold text-white text-sm mb-1">Data at Rest Encryption</h4>
                     <p className="text-xs text-gray-400 mb-3">AES-256-GCM encryption for all database volumes and asset storage.</p>
                     <div className="text-[10px] font-mono text-gray-500 flex justify-between border-t border-[#2a2b3d] pt-2">
                        <span>Key Rotation: 12 days left</span>
                        <span className="text-blue-400 cursor-pointer">Manage Keys &rarr;</span>
                     </div>
                  </div>
                  
                  {/* Card 2 */}
                  <div className="bg-[#141525] border border-[#2a2b3d] rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                     <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-purple-500/10 rounded text-purple-400"><Users size={20}/></div>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] uppercase font-bold rounded">Active</span>
                     </div>
                     <h4 className="font-bold text-white text-sm mb-1">Identity & Auth (IAM)</h4>
                     <p className="text-xs text-gray-400 mb-3">OAuth 2.0 / OIDC provider configuration with mandatory MFA for admins.</p>
                     <div className="text-[10px] font-mono text-gray-500 flex justify-between border-t border-[#2a2b3d] pt-2">
                        <span>Provider: Firebase Auth</span>
                        <span className="text-purple-400 cursor-pointer">Configure Policies &rarr;</span>
                     </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#141525] border border-[#2a2b3d] rounded-lg p-4 hover:border-red-500/50 transition-colors">
                     <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-red-500/10 rounded text-red-400"><ShieldAlert size={20}/></div>
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] uppercase font-bold rounded">Monitoring</span>
                     </div>
                     <h4 className="font-bold text-white text-sm mb-1">Anti-Cheat System</h4>
                     <p className="text-xs text-gray-400 mb-3">Client-side memory integrity checks and server-side heuristic analysis.</p>
                     <div className="text-[10px] font-mono text-gray-500 flex justify-between border-t border-[#2a2b3d] pt-2">
                        <span>Bans Today: 14</span>
                        <span className="text-red-400 cursor-pointer">View Reports &rarr;</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Live Alerts Panel */}
            <div className="col-span-1 bg-[#141525] border border-[#2a2b3d] rounded-lg flex flex-col h-[500px]">
               <div className="p-4 border-b border-[#2a2b3d] flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                     <Activity size={16} className="text-amber-500"/> Security Events
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Live</span>
               </div>
               <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
                  <div className="bg-[#0a0a0f] border border-amber-500/30 p-3 rounded flex gap-3 items-start">
                     <AlertOctagon size={16} className="text-amber-500 shrink-0 mt-0.5"/>
                     <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-amber-200">Failed Admin Login</span>
                        <span className="text-[10px] text-gray-400">Multiple failed attempts from IP 192.168.1.42. Account locked for 15 mins.</span>
                        <span className="text-[9px] text-gray-500 mt-1 font-mono">Just now</span>
                     </div>
                  </div>
                  <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-3 rounded flex gap-3 items-start">
                     <Key size={16} className="text-blue-400 shrink-0 mt-0.5"/>
                     <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-gray-300">API Key Rotated</span>
                        <span className="text-[10px] text-gray-400">Production environment key 'stripe_prod' automatically rotated.</span>
                        <span className="text-[9px] text-gray-500 mt-1 font-mono">2 hours ago</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
