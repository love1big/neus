import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, Plus, Check, RefreshCcw, Command, Download, UploadCloud } from 'lucide-react';
import { IDEFile } from '../lib/project';

interface GitCommitRecord {
  id: string;
  message: string;
  timestamp: Date;
  filesSnapshot: Record<string, string>;
}

interface GitPanelProps {
  files: IDEFile[];
}

export default function GitPanel({ files }: GitPanelProps) {
  const [gitInitialized, setGitInitialized] = useState(false);
  const [commits, setCommits] = useState<GitCommitRecord[]>([]);
  const [stagedFiles, setStagedFiles] = useState<Set<string>>(new Set());
  const [commitMessage, setCommitMessage] = useState('');
  const [lastCommitState, setLastCommitState] = useState<Record<string, string>>({});

  // Compute modified files based on the latest commit state
  const modifiedFiles = files.filter(f => {
    // If no commits yet, everything is inherently a new/modified file waiting for initial commit
    if (!gitInitialized || commits.length === 0) return true;
    return lastCommitState[f.id] !== f.content;
  });

  const handleInitRepo = () => {
    setGitInitialized(true);
  };

  const handleStageAll = () => {
    const newStaged = new Set(stagedFiles);
    modifiedFiles.forEach(f => newStaged.add(f.id));
    setStagedFiles(newStaged);
  };

  const handleStageFile = (fileId: string) => {
    const newStaged = new Set(stagedFiles);
    newStaged.add(fileId);
    setStagedFiles(newStaged);
  };

  const handleUnstageFile = (fileId: string) => {
    const newStaged = new Set(stagedFiles);
    newStaged.delete(fileId);
    setStagedFiles(newStaged);
  };

  const handleCommit = () => {
    if (stagedFiles.size === 0 || !commitMessage) return;

    const newSnapshot = { ...lastCommitState };
    files.forEach(f => {
      if (stagedFiles.has(f.id)) {
        newSnapshot[f.id] = f.content;
      }
    });

    const newCommit: GitCommitRecord = {
      id: Math.random().toString(36).substr(2, 7),
      message: commitMessage,
      timestamp: new Date(),
      filesSnapshot: newSnapshot
    };

    setCommits([newCommit, ...commits]);
    setLastCommitState(newSnapshot);
    setStagedFiles(new Set());
    setCommitMessage('');
  };

  if (!gitInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <GitBranch size={48} className="text-[#8b949e] mb-4 opacity-50" />
        <h3 className="text-[#c9d1d9] font-medium mb-2">Source Control</h3>
        <p className="text-[#8b949e] text-[12px] mb-6">Track changes, commit, and push your AI projects safely to the cloud repository.</p>
        <button 
          onClick={handleInitRepo}
          className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded text-[12px] font-medium transition-colors w-full"
        >
          Initialize Repository
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#161b22] overflow-hidden">
      {/* Git Actions */}
      <div className="p-3 border-b border-[#30363d] flex flex-col gap-3">
        <div className="flex bg-[#0d1117] rounded border border-[#30363d] focus-within:border-[#58a6ff] transition-colors p-2">
           <textarea 
             placeholder="Message (Cmd+Enter to commit)"
             value={commitMessage}
             onChange={e => setCommitMessage(e.target.value)}
             className="bg-transparent w-full outline-none text-[#c9d1d9] text-[12px] resize-none h-16 placeholder:text-[#8b949e]"
           />
        </div>
        <div className="flex gap-2">
           <button 
              onClick={handleCommit}
              disabled={stagedFiles.size === 0 || !commitMessage}
              className={`flex-1 py-1.5 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors ${stagedFiles.size > 0 && commitMessage ? 'bg-[#238636] hover:bg-[#2ea043] text-white' : 'bg-[#21262d] text-[#8b949e] border border-[#30363d] opacity-50 cursor-not-allowed'}`}
           >
              <Check size={12} /> Commit
           </button>
           <button className="p-1.5 rounded bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-[#c9d1d9] transition-colors" title="Sync Changes">
              <RefreshCcw size={12} />
           </button>
        </div>
        <div className="flex gap-2 mt-1">
            <button className="flex-1 py-1 bg-transparent border border-[#30363d] hover:border-[#58a6ff] rounded text-[11px] text-[#58a6ff] flex items-center justify-center gap-1 transition-colors">
               <UploadCloud size={12} /> Push
            </button>
            <button className="flex-1 py-1 bg-transparent border border-[#30363d] hover:border-[#58a6ff] rounded text-[11px] text-[#58a6ff] flex items-center justify-center gap-1 transition-colors">
               <Download size={12} /> Pull
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Staged Changes */}
        {stagedFiles.size > 0 && (
          <div className="mb-4">
            <div className="px-4 py-2 text-[11px] uppercase tracking-[1px] text-[#c9d1d9] bg-[#0d1117] flex justify-between items-center group font-medium">
               <span>Staged Changes</span>
               <span className="bg-[#21262d] px-1.5 rounded text-[10px]">{stagedFiles.size}</span>
            </div>
            {files.filter(f => stagedFiles.has(f.id)).map(f => (
              <div key={f.id} className="flex items-center justify-between px-4 py-1.5 group hover:bg-[#21262d] transition-colors">
                <span className="text-[12px] text-[#c9d1d9] truncate flex-1">
                   {f.folder ? `${f.folder}/` : ''}{f.name}
                </span>
                <span className="text-[10px] text-[#3fb950] font-mono mr-2">M</span>
                <button 
                  onClick={() => handleUnstageFile(f.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-[#c9d1d9] transition-all"
                  title="Unstage Change"
                >
                  <Command size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Changes */}
        {modifiedFiles.filter(f => !stagedFiles.has(f.id)).length > 0 && (
          <div>
            <div className="px-4 py-2 text-[11px] uppercase tracking-[1px] text-[#c9d1d9] bg-[#0d1117] flex justify-between items-center group font-medium">
               <span>Changes</span>
               <div className="flex items-center gap-2">
                 <span className="bg-[#21262d] px-1.5 rounded text-[10px]">{modifiedFiles.filter(f => !stagedFiles.has(f.id)).length}</span>
                 <button 
                   onClick={handleStageAll}
                   className="opacity-0 group-hover:opacity-100 text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
                   title="Stage All Changes"
                 >
                   <Plus size={12} />
                 </button>
               </div>
            </div>
            {modifiedFiles.filter(f => !stagedFiles.has(f.id)).map(f => (
              <div key={f.id} className="flex items-center justify-between px-4 py-1.5 group hover:bg-[#21262d] transition-colors">
                <span className="text-[12px] text-[#8b949e] group-hover:text-[#c9d1d9] truncate flex-1 transition-colors">
                   {f.folder ? `${f.folder}/` : ''}{f.name}
                </span>
                <span className="text-[10px] text-[#e3b341] font-mono mr-2">M</span>
                <button 
                  onClick={() => handleStageFile(f.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-[#c9d1d9] transition-all"
                  title="Stage Change"
                >
                  <Plus size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {modifiedFiles.length === 0 && (
           <div className="p-6 text-center text-[#8b949e] text-[12px]">
             No outstanding changes.<br/>Workspace is clean.
           </div>
        )}
      </div>
      
      {/* Recent Commits Log */}
      {commits.length > 0 && (
         <div className="border-t border-[#30363d] max-h-[150px] overflow-y-auto bg-[#0d1117]">
             <div className="px-4 py-1.5 text-[10px] uppercase tracking-[1px] text-[#8b949e] bg-[#0d1117] sticky top-0 font-medium">Recent Commits</div>
             <div className="flex flex-col">
                {commits.slice(0, 5).map(c => (
                   <div key={c.id} className="px-4 py-2 hover:bg-[#21262d] border-b border-[#30363d]/50 flex flex-col gap-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                         <span className="text-[12px] text-[#c9d1d9] font-medium truncate">{c.message}</span>
                         <span className="text-[10px] text-[#8b949e] font-mono">{c.id}</span>
                      </div>
                      <span className="text-[10px] text-[#8b949e] flex items-center gap-1">
                         <GitCommit size={10} /> {c.timestamp.toLocaleTimeString()}
                      </span>
                   </div>
                ))}
             </div>
         </div>
      )}
    </div>
  );
}
