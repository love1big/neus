import React, { useState } from 'react';
import { 
  Code2, Terminal, FolderTree, Cpu, Play, Settings, Wand2, FileCode, Search, 
  Sparkles, MessageSquare, AlertCircle, Check, ArrowRight, ShieldCheck, Box, 
  Layers, ChevronRight, FileText, CheckCircle2, Split
} from 'lucide-react';

interface ModularFileInfo {
  name: string;
  role: string;
  path: string;
  status: 'Clean' | 'Refactored' | 'New';
  code: string;
}

const MODULAR_FILES: ModularFileInfo[] = [
  {
    name: "PlayerMovementInputNode.cs",
    role: "New Input System Reader Node",
    path: "src/Player/Movement/PlayerMovementInputNode.cs",
    status: "Refactored",
    code: `/**
 * =========================================================================================
 * @file PlayerMovementInputNode.cs
 * @system Player Controller & Movement Architecture
 * @module Input System Action Map Evaluator Node
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * อ่านค่าสัญญาณควบคุมจาก Unity Input System Package (Vector2 Move, Jump, Sprint)
 * แยกตรรกะการรับ Input ออกจากฟิสิกส์ เพื่อให้รองรับ Gamepad, Keyboard และ Touch Control
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture]:
 * - ทำหน้าที่เป็น Input Provider ให้กับ PlayerKinematicsPhysicsNode.cs
 * - ไม่มีการคำนวณฟิสิกส์ในไฟล์นี้ (Strict Single Responsibility)
 * =========================================================================================
 */

using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerMovementInputNode : MonoBehaviour
{
    [Header("Input Vector Cache")]
    public Vector2 MoveVector { get; private set; }
    public bool IsJumpTriggered { get; private set; }
    public bool IsSprintHeld { get; private set; }

    public void OnMove(InputAction.CallbackContext context)
    {
        MoveVector = context.ReadValue<Vector2>();
    }

    public void OnJump(InputAction.CallbackContext context)
    {
        if (context.performed)
        {
            IsJumpTriggered = true;
        }
    }

    public void LateUpdate()
    {
        // Reset 1-frame trigger buffers safely
        IsJumpTriggered = false;
    }
}`
  },
  {
    name: "PlayerKinematicsPhysicsNode.cs",
    role: "Character Controller Physics & Kinematics",
    path: "src/Player/Movement/PlayerKinematicsPhysicsNode.cs",
    status: "New",
    code: `/**
 * =========================================================================================
 * @file PlayerKinematicsPhysicsNode.cs
 * @system Player Controller & Movement Architecture
 * @module Character Controller Physics & Kinematics Engine
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * คำนวณความเร็ว (Velocity), แรงโน้มถ่วง (Gravity Scaling), และแรงเฉื่อย (Acceleration/Deceleration)
 * รับ Input จาก PlayerMovementInputNode.cs
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture]:
 * - แยกเป็น 1 Module = 1 File ตามมาตรฐาน AAA
 * - ส่งข้อมูลความเร็วไปยัง PlayerAnimationSyncModule.cs
 * =========================================================================================
 */

using UnityEngine;

[RequireComponent(typeof(CharacterController))]
public class PlayerKinematicsPhysicsNode : MonoBehaviour
{
    [SerializeField] private PlayerMovementInputNode inputNode;
    [SerializeField] private float walkSpeed = 6.0f;
    [SerializeField] private float gravity = -18.0f;

    private CharacterController controller;
    private Vector3 verticalVelocity;

    private void Awake()
    {
        controller = GetComponent<CharacterController>();
    }

    private void Update()
    {
        Vector2 input = inputNode.MoveVector;
        Vector3 move = transform.right * input.x + transform.forward * input.y;
        
        controller.Move(move * walkSpeed * Time.deltaTime);

        // Apply decoupled gravity
        if (controller.isGrounded && verticalVelocity.y < 0)
        {
            verticalVelocity.y = -2f;
        }
        verticalVelocity.y += gravity * Time.deltaTime;
        controller.Move(verticalVelocity * Time.deltaTime);
    }
}`
  },
  {
    name: "PlayerAnimationSyncModule.cs",
    role: "Animator Parameter Synchronizer",
    path: "src/Player/Animation/PlayerAnimationSyncModule.cs",
    status: "Clean",
    code: `/**
 * =========================================================================================
 * @file PlayerAnimationSyncModule.cs
 * @system Player Controller & Movement Architecture
 * @module Animator Parameter Synchronizer
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * อัปเดตพารามิเตอร์ Animator (Speed, IsGrounded, IsFalling, TurnAngle)
 * ให้ตรงกับการเคลื่อนไหวจริง โดยไม่ไปยุ่งเกี่ยวกับโค้ดฟิสิกส์
 * =========================================================================================
 */

using UnityEngine;

public class PlayerAnimationSyncModule : MonoBehaviour
{
    [SerializeField] private Animator animator;
    [SerializeField] private CharacterController controller;

    private static readonly int SpeedHash = Animator.StringToHash("Speed");
    private static readonly int GroundedHash = Animator.StringToHash("IsGrounded");

    private void Update()
    {
        float currentSpeed = controller.velocity.magnitude;
        animator.SetFloat(SpeedHash, currentSpeed);
        animator.SetBool(GroundedHash, controller.isGrounded);
    }
}`
  }
];

export default function AICodeAgentStudio() {
  const [selectedFile, setSelectedFile] = useState<ModularFileInfo>(MODULAR_FILES[0]);
  const [chat, setChat] = useState([
    { 
      role: 'ai', 
      msg: "🤖 ผมได้ทำการวิเคราะห์ AST และแยกสถาปัตยกรรมของตัวละครออกเป็น 3 ไฟล์แยกกันตามกฎ **1 Module = 1 File**:\n\n" +
           "1. `PlayerMovementInputNode.cs` (รับ Input แบบ New Input System)\n" +
           "2. `PlayerKinematicsPhysicsNode.cs` (คำนวณฟิสิกส์และการเคลื่อนไหว)\n" +
           "3. `PlayerAnimationSyncModule.cs` (ซิงค์ Animation เข้า Animator)\n\n" +
           "ทุกไฟล์มี Header Docs อธิบาย Input/Output และหน้าที่ชัดเจน พร้อมนำไปใช้งานครับ!" 
    }
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setChat(prev => [...prev, { role: 'user', msg: userMsg }]);
    setInput('');
    setTimeout(() => {
      setChat(prev => [
        ...prev, 
        { 
          role: 'ai', 
          msg: `✨ รับทราบครับ! ได้ทำการวิเคราะห์ตามหลัก **1 Module = 1 File** และเพิ่มคำอธิบายสถาปัตยกรรม (Detailed Docs & Contracts) ในทุกส่วนของระบบเรียบร้อยแล้ว!` 
        }
      ]);
    }, 600);
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Header */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-700 p-1.5 rounded-lg shadow-lg">
            <Cpu size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">
                AI Autonomous <span className="text-blue-400">Code Agent</span>
              </h1>
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[9px] px-1.5 py-0.5 rounded font-mono">
                1 Module = 1 File Policy
              </span>
            </div>
            <div className="text-[9px] text-gray-400 tracking-wider">
              AST Modular Decomposition & Multi-File Architecture Engine
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs bg-[#1a1a1c] border border-[#3e3e42] px-3 py-1 rounded text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 size={13} /> Strict Modularity Enforced
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Context Explorer */}
        <div className="w-72 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 z-10">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c] flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2">
              <FolderTree size={14} className="text-blue-400" /> Modular AST Tree
            </h3>
            <span className="text-[9px] bg-blue-900/50 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/50 font-mono">
              3 Modules
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 text-xs text-gray-300 font-mono custom-scrollbar">
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1 text-gray-400 font-bold">
                <FolderTree size={12} className="text-yellow-400"/> src/Player
              </div>
              
              <div className="pl-3 space-y-1">
                {MODULAR_FILES.map(file => {
                  const isSelected = selectedFile.name === file.name;
                  return (
                    <div 
                      key={file.name}
                      onClick={() => setSelectedFile(file)}
                      className={`p-2 rounded cursor-pointer transition-all border ${
                        isSelected 
                          ? 'bg-blue-900/40 text-blue-200 border-blue-500/50 shadow-sm' 
                          : 'bg-[#1e1e1e] border-transparent text-gray-400 hover:text-white hover:bg-[#333]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <FileCode size={12} className={isSelected ? 'text-blue-400' : 'text-gray-400'}/>
                          <span className="font-semibold truncate text-white">{file.name}</span>
                        </div>
                        <span className={`text-[8px] px-1 rounded uppercase font-sans ${
                          file.status === 'Refactored' ? 'bg-amber-500/20 text-amber-300' :
                          file.status === 'New' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-700 text-gray-300'
                        }`}>
                          {file.status}
                        </span>
                      </div>
                      <div className="text-[9px] text-gray-500 font-sans truncate pl-4">
                        {file.role}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-4 space-y-2 px-2">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase font-sans flex items-center gap-1">
                <ShieldCheck size={11} className="text-emerald-400" /> Modularity Quality
              </h4>
              <div className="text-[10px] text-gray-400 bg-[#1a1a1c] p-2.5 rounded border border-[#3e3e42] leading-relaxed">
                • <strong>Single Responsibility:</strong> 100% Passed<br/>
                • <strong>In-File Detailed Docs:</strong> Complete<br/>
                • <strong>Coupling Factor:</strong> 0.12 (Highly Decoupled)<br/>
                • <strong>Maintainability Index:</strong> 96/100
              </div>
            </div>
          </div>
        </div>

        {/* Center: Editor / Code View */}
        <div className="flex-1 bg-[#1e1e1e] flex flex-col relative">
          <div className="h-10 bg-[#2d2d2d] border-b border-[#3e3e42] flex items-center px-3 justify-between">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-[#1e1e1e] text-blue-400 text-xs font-mono border-t-2 border-blue-500 flex items-center gap-2">
                <FileCode size={12} /> {selectedFile.name}
              </div>
              <span className="text-[10px] text-gray-400">({selectedFile.role})</span>
            </div>

            <span className="text-[10px] bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
              ✓ Header Docs Verified
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto font-mono text-xs leading-relaxed p-4 custom-scrollbar bg-[#1e1e1e] text-gray-300">
            <pre className="whitespace-pre-wrap">{selectedFile.code}</pre>
          </div>
          
          <div className="p-3 bg-[#252526] border-t border-[#3e3e42] flex justify-between items-center text-xs">
            <div className="text-[11px] text-gray-400">
              📌 สถาปัตยกรรมแบบแยกไฟล์ทำให้บำรุงรักษาง่าย และแก้ไขข้อผิดพลาดโดยไม่กระทบโมดูลอื่น
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  navigator.clipboard?.writeText(selectedFile.code).catch(() => {});
                }}
                className="bg-[#333] hover:bg-[#444] px-3 py-1.5 rounded text-xs font-bold text-gray-200 shadow-md"
              >
                คัดลอกโค้ด
              </button>
              <button className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-xs font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center gap-1.5">
                <Check size={14}/> ใช้งานไฟล์นี้
              </button>
            </div>
          </div>
        </div>

        {/* Right: Agent Chat */}
        <div className="w-[360px] bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 z-10">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c] flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} className="text-blue-400"/> Modular Agent Chat
            </h3>
            <span className="text-[9px] text-emerald-400 font-mono">100% Offline</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chat.map((c, i) => (
              <div key={i} className={`flex gap-3 ${c.role === 'ai' ? '' : 'flex-row-reverse'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${c.role === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}`}>
                  {c.role === 'ai' ? <Cpu size={12}/> : <UserIcon size={12}/>}
                </div>
                <div className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] ${c.role === 'ai' ? 'bg-[#1a1a1c] border border-[#3e3e42] text-gray-300' : 'bg-blue-900/40 border border-blue-500/30 text-blue-100'}`}>
                  {c.msg}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t border-[#3e3e42] bg-[#1a1a1c]">
            <div className="relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                className="w-full bg-[#252526] border border-[#3e3e42] rounded-lg pl-3 pr-10 py-2.5 text-xs text-gray-200 resize-none focus:outline-none focus:border-blue-500 custom-scrollbar h-20"
                placeholder="สั่ง AI แยกไฟล์โมดูลาร์ หรือเพิ่มโหนด..."
              />
              <button onClick={send} className="absolute right-2 bottom-2 p-1.5 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const UserIcon = ({size}:any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
