with open('src/components/AIChat.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
old_import = "import { offlineAICodeCommentBrander } from '../utils/OfflineAICodeCommentBrander';"
new_import = """import { offlineAICodeCommentBrander } from '../utils/OfflineAICodeCommentBrander';
import AICodeBrandingConfigModal from './AICodeBrandingConfigModal';
import { Settings } from 'lucide-react';"""

if old_import in content:
    content = content.replace(old_import, new_import, 1)
    print('1. Imports updated')
else:
    print('1. Import target not found')

# 2. State & Effect
old_state = """  const [autoBrandCode, setAutoBrandCode] = useState<boolean>(() => {
    return localStorage.getItem('omni_offline_ai_branding_enabled') !== 'false';
  });"""

new_state = """  const [autoBrandCode, setAutoBrandCode] = useState<boolean>(() => {
    return localStorage.getItem('omni_offline_ai_branding_enabled') !== 'false';
  });
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState<boolean>(false);
  const [brandingAuthorName, setBrandingAuthorName] = useState<string>(() => offlineAICodeCommentBrander.getAuthorName());

  useEffect(() => {
    return offlineAICodeCommentBrander.subscribe(() => {
      setBrandingAuthorName(offlineAICodeCommentBrander.getAuthorName());
    });
  }, []);"""

if old_state in content:
    content = content.replace(old_state, new_state, 1)
    print('2. State updated')
else:
    print('2. State target not found')

# 3. Toolbar button group
old_btn = """             <button
               type="button"
               onClick={() => {
                 const next = !autoBrandCode;
                 setAutoBrandCode(next);
                 localStorage.setItem('omni_offline_ai_branding_enabled', String(next));
               }}
               className={autoBrandCode ? "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-all cursor-pointer bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]" : "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-all cursor-pointer bg-transparent text-gray-500 border-[#30363d] hover:text-gray-300"}
               title="ใส่หมายเหตุ *by love1big โดยโปรแกรม ชื่อโปรแกรม* ทุกบรรทัดของโค้ดที่ AI สร้างขึ้น"
             >
               <Sparkles size={11} className={autoBrandCode ? 'text-amber-400' : ''} />
               <span>หมายเหตุลิขสิทธิ์โค้ดทุกบรรทัด: {autoBrandCode ? 'ON' : 'OFF'}</span>
             </button>"""

new_btn = """             <div className="inline-flex items-center rounded border border-[#30363d] overflow-hidden shadow-sm">
               <button
                 type="button"
                 onClick={() => {
                   const next = !autoBrandCode;
                   setAutoBrandCode(next);
                   localStorage.setItem('omni_offline_ai_branding_enabled', String(next));
                 }}
                 className={autoBrandCode ? "inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer bg-amber-500/20 text-amber-300 hover:bg-amber-500/30" : "inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer bg-transparent text-gray-500 hover:text-gray-300"}
                 title={`ใส่หมายเหตุ ${offlineAICodeCommentBrander.getBrandTag()} ทุกบรรทัดของโค้ดที่ AI สร้างขึ้น`}
               >
                 <Sparkles size={11} className={autoBrandCode ? 'text-amber-400' : ''} />
                 <span>หมายเหตุลิขสิทธิ์ ({brandingAuthorName}): {autoBrandCode ? 'ON' : 'OFF'}</span>
               </button>
               <button
                 type="button"
                 onClick={() => setIsBrandingModalOpen(true)}
                 className="px-1.5 py-0.5 bg-[#21262d] hover:bg-[#30363d] text-amber-400 hover:text-amber-300 transition-colors border-l border-[#30363d] cursor-pointer flex items-center justify-center"
                 title={`ตั้งค่าชื่อผู้พัฒนา/ทีมผู้พัฒนา (*by ${brandingAuthorName} โดยโปรแกรม OMNI Engine STUDIO*)`}
               >
                 <Settings size={11} />
               </button>
             </div>"""

if old_btn in content:
    content = content.replace(old_btn, new_btn, 1)
    print('3. Toolbar button group updated')
else:
    print('3. Toolbar button target not found')

# 4. Modal rendering
old_end = """      {showCamera && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-[#161b22] p-4 rounded-lg flex flex-col items-center">
               <video ref={videoRef} autoPlay className="max-w-full h-[300px] bg-black rounded mb-4" />
               <canvas ref={canvasRef} className="hidden" />
               <div className="flex space-x-4">
                 <button type="button" onClick={captureImage} className="bg-[#58a6ff] text-white px-4 py-2 rounded text-sm font-bold">Capture</button>
                 <button type="button" onClick={stopCamera} className="bg-transparent border border-[#8b949e] text-[#c9d1d9] px-4 py-2 rounded text-sm font-bold">Cancel</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}"""

new_end = """      {showCamera && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-[#161b22] p-4 rounded-lg flex flex-col items-center">
               <video ref={videoRef} autoPlay className="max-w-full h-[300px] bg-black rounded mb-4" />
               <canvas ref={canvasRef} className="hidden" />
               <div className="flex space-x-4">
                 <button type="button" onClick={captureImage} className="bg-[#58a6ff] text-white px-4 py-2 rounded text-sm font-bold">Capture</button>
                 <button type="button" onClick={stopCamera} className="bg-transparent border border-[#8b949e] text-[#c9d1d9] px-4 py-2 rounded text-sm font-bold">Cancel</button>
               </div>
            </div>
         </div>
      )}

      {/* Code Attribution & Branding Config Modal */}
      <AICodeBrandingConfigModal
        isOpen={isBrandingModalOpen}
        onClose={() => setIsBrandingModalOpen(false)}
        onSaved={() => setBrandingAuthorName(offlineAICodeCommentBrander.getAuthorName())}
      />
    </div>
  );
}"""

if old_end in content:
    content = content.replace(old_end, new_end, 1)
    print('4. Modal render added')
else:
    print('4. End target not found')

with open('src/components/AIChat.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done modifying AIChat.tsx')
