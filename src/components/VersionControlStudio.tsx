import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, Search, FileText, Check, Plus, RefreshCcw, Save, Trash2, Edit2, History, RotateCcw, PlusSquare } from 'lucide-react';

interface FileData {
  path: string;
  content: string;
}

interface FileChange {
  path: string;
  content: string;
  status: 'A' | 'M' | 'D'; // Added, Modified, Deleted
}

interface Commit {
  id: string;
  branch: string;
  message: string;
  timestamp: number;
  changes: FileChange[];
  parent?: string;
  snapshot: Record<string, string>; // complete file state at this commit
}

const generateId = () => Math.random().toString(16).substring(2, 8);

export default function VersionControlStudio() {
  const [branches, setBranches] = useState<string[]>(['main']);
  const [currentBranch, setCurrentBranch] = useState('main');
  
  const [commits, setCommits] = useState<Commit[]>([]);
  
  // The current state of files in the workspace
  const [workingDirectory, setWorkingDirectory] = useState<Record<string, string>>({
    'src/index.js': 'console.log("Hello, world!");',
    'README.md': '# Offline Project\n'
  });
  
  // Previous commit snapshot to compare against
  const [lastCommitSnapshot, setLastCommitSnapshot] = useState<Record<string, string>>({
    'src/index.js': 'console.log("Hello, world!");',
    'README.md': '# Offline Project\n'
  });

  const [stagedFiles, setStagedFiles] = useState<Set<string>>(new Set());
  const [commitMessage, setCommitMessage] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [newFileName, setNewFileName] = useState('');
  
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);

  // Initialize first commit if empty
  useEffect(() => {
    if (commits.length === 0) {
      const initialCommit: Commit = {
        id: generateId(),
        branch: 'main',
        message: 'Initial commit',
        timestamp: Date.now(),
        changes: [
          { path: 'src/index.js', content: 'console.log("Hello, world!");', status: 'A' },
          { path: 'README.md', content: '# Offline Project\n', status: 'A' }
        ],
        snapshot: {
          'src/index.js': 'console.log("Hello, world!");',
          'README.md': '# Offline Project\n'
        }
      };
      setCommits([initialCommit]);
      setLastCommitSnapshot(initialCommit.snapshot);
    }
  }, []);

  // Compute unstaged changes
  const getChanges = (): FileChange[] => {
    const changes: FileChange[] = [];
    
    // Check for Added or Modified
    for (const [path, content] of Object.entries(workingDirectory)) {
      const oldContent = lastCommitSnapshot[path];
      if (oldContent === undefined) {
        changes.push({ path, content, status: 'A' });
      } else if (oldContent !== content) {
        changes.push({ path, content, status: 'M' });
      }
    }
    
    // Check for Deleted
    for (const path of Object.keys(lastCommitSnapshot)) {
      if (workingDirectory[path] === undefined) {
        changes.push({ path, content: '', status: 'D' });
      }
    }
    
    return changes;
  };

  const changes = getChanges();

  const handleStageFile = (path: string) => {
    const newStaged = new Set(stagedFiles);
    if (newStaged.has(path)) {
      newStaged.delete(path);
    } else {
      newStaged.add(path);
    }
    setStagedFiles(newStaged);
  };

  const stageAll = () => {
    if (stagedFiles.size === changes.length) {
      setStagedFiles(new Set());
    } else {
      setStagedFiles(new Set(changes.map(c => c.path)));
    }
  };

  const handleCommit = () => {
    if (!commitMessage.trim() || stagedFiles.size === 0) return;
    
    const commitChanges = changes.filter(c => stagedFiles.has(c.path));
    
    const newSnapshot = { ...lastCommitSnapshot };
    for (const change of commitChanges) {
      if (change.status === 'D') {
        delete newSnapshot[change.path];
      } else {
        newSnapshot[change.path] = change.content;
      }
    }
    
    const parentId = commits.filter(c => c.branch === currentBranch).pop()?.id;

    const newCommit: Commit = {
      id: generateId(),
      branch: currentBranch,
      message: commitMessage,
      timestamp: Date.now(),
      changes: commitChanges,
      parent: parentId,
      snapshot: newSnapshot
    };

    setCommits([...commits, newCommit]);
    setLastCommitSnapshot(newSnapshot);
    setCommitMessage('');
    setStagedFiles(new Set());
    setSelectedCommit(null);
  };

  const handleCreateBranch = () => {
    const name = prompt('New branch name:');
    if (name && !branches.includes(name)) {
      setBranches([...branches, name]);
      setCurrentBranch(name);
    }
  };

  const handleSwitchBranch = (branch: string) => {
    const branchCommits = commits.filter(c => c.branch === branch);
    if (branchCommits.length > 0) {
      const lastCommit = branchCommits[branchCommits.length - 1];
      setCurrentBranch(branch);
      setLastCommitSnapshot(lastCommit.snapshot);
      setWorkingDirectory({ ...lastCommit.snapshot });
      setStagedFiles(new Set());
      setSelectedFile(null);
    } else {
      setCurrentBranch(branch);
    }
  };

  const handleRevert = (commit: Commit) => {
    if (confirm(`Revert workspace to commit: ${commit.message}? Any unsaved changes will be lost.`)) {
      setWorkingDirectory({ ...commit.snapshot });
      setLastCommitSnapshot(commit.snapshot);
      setStagedFiles(new Set());
      setSelectedFile(null);
    }
  };

  const handleSaveFile = () => {
    if (selectedFile) {
      setWorkingDirectory({
        ...workingDirectory,
        [selectedFile]: fileContent
      });
    }
  };

  const handleAddFile = () => {
    if (newFileName && !workingDirectory[newFileName]) {
      setWorkingDirectory({
        ...workingDirectory,
        [newFileName]: '// New file\n'
      });
      setNewFileName('');
    }
  };

  const handleDeleteFile = (path: string) => {
    const newWd = { ...workingDirectory };
    delete newWd[path];
    setWorkingDirectory(newWd);
    if (selectedFile === path) setSelectedFile(null);
  };

  const branchCommits = commits.filter(c => c.branch === currentBranch).reverse();

  return (
    <div className="w-full h-full bg-[#0d1117] text-gray-300 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#238636] to-[#2ea043] p-1.5 rounded-lg shadow-lg">
            <GitBranch size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-gray-100">Version Control</h1>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Offline System</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Branch:</span>
            <select 
              value={currentBranch} 
              onChange={(e) => handleSwitchBranch(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] text-sm text-gray-200 px-2 py-1 rounded focus:outline-none focus:border-[#58a6ff]"
            >
              {branches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleCreateBranch}
            className="flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-gray-200 border border-[#30363d] px-3 py-1.5 rounded text-xs font-medium transition-colors"
          >
            <Plus size={14} /> NEW BRANCH
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
          <div className="flex-1 flex flex-col min-h-0 border-b border-[#30363d]">
            <div className="p-3 bg-[#0d1117] border-b border-[#30363d] flex justify-between items-center shrink-0">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Workspace Files</h3>
            </div>
            
            <div className="p-2 border-b border-[#30363d] flex gap-2 shrink-0">
              <input 
                type="text" 
                placeholder="New filename..." 
                value={newFileName}
                onChange={e => setNewFileName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddFile()}
                className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-gray-200"
              />
              <button onClick={handleAddFile} className="p-1.5 bg-[#238636] text-white rounded hover:bg-[#2ea043]">
                <Plus size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
              {Object.keys(workingDirectory).map(path => (
                <div 
                  key={path}
                  onClick={() => { setSelectedFile(path); setFileContent(workingDirectory[path]); setSelectedCommit(null); }}
                  className={`flex items-center justify-between p-1.5 rounded cursor-pointer group ${selectedFile === path ? 'bg-[#1f6feb]/20 text-[#58a6ff]' : 'hover:bg-[#21262d] text-gray-300'}`}
                >
                  <div className="flex items-center gap-2 text-sm truncate">
                    <FileText size={14} className="shrink-0" />
                    <span className="truncate">{path}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteFile(path); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-3 bg-[#0d1117] border-b border-[#30363d] flex justify-between items-center shrink-0">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Changes</h3>
              <button onClick={stageAll} className="text-[10px] bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d] hover:bg-[#30363d]">
                {stagedFiles.size === changes.length && changes.length > 0 ? 'UNSTAGE ALL' : 'STAGE ALL'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar font-mono text-xs">
              {changes.length === 0 ? (
                <div className="text-center text-gray-500 mt-4 text-xs italic">No pending changes.</div>
              ) : (
                <div className="space-y-1">
                  {changes.map(change => (
                    <div 
                      key={change.path}
                      onClick={() => handleStageFile(change.path)}
                      className={`flex items-center justify-between p-1.5 rounded cursor-pointer border-l-2 ${stagedFiles.has(change.path) ? 'bg-[#238636]/20 border-[#3fb950]' : 'hover:bg-[#21262d] border-transparent'}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`font-bold shrink-0 ${change.status === 'A' ? 'text-[#3fb950]' : change.status === 'M' ? 'text-[#d29922]' : 'text-[#f85149]'}`}>
                          {change.status}
                        </span> 
                        <span className="truncate">{change.path}</span>
                      </div>
                      <Check size={14} className={stagedFiles.has(change.path) ? 'text-[#3fb950]' : 'text-gray-600'} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-[#30363d] bg-[#0d1117] flex flex-col gap-2 shrink-0">
              <textarea 
                value={commitMessage}
                onChange={e => setCommitMessage(e.target.value)}
                className="w-full h-20 bg-[#161b22] border border-[#30363d] rounded p-2 text-xs text-gray-200 resize-none focus:outline-none focus:border-[#58a6ff]" 
                placeholder="Commit message..."
              ></textarea>
              <button 
                onClick={handleCommit}
                disabled={stagedFiles.size === 0 || !commitMessage.trim()}
                className="w-full bg-[#238636] disabled:bg-[#238636]/50 hover:bg-[#2ea043] disabled:text-gray-400 text-white font-medium py-2 rounded text-xs transition-colors flex justify-center items-center gap-2"
              >
                <GitCommit size={14}/> COMMIT STAGED ({stagedFiles.size})
              </button>
            </div>
          </div>
        </div>

        <div className="w-80 border-r border-[#30363d] bg-[#0d1117] flex flex-col shrink-0">
          <div className="p-3 bg-[#161b22] border-b border-[#30363d] flex items-center gap-2">
            <History size={16} className="text-gray-400" />
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Commit History</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
            <div className="absolute left-7 top-6 bottom-4 w-0.5 bg-[#30363d] z-0"></div>
            {branchCommits.map(commit => (
              <div 
                key={commit.id} 
                onClick={() => { setSelectedCommit(commit); setSelectedFile(null); }}
                className={`relative z-10 flex gap-4 cursor-pointer group`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 mt-1 ${selectedCommit?.id === commit.id ? 'bg-[#238636] border-[#3fb950]' : 'bg-[#161b22] border-[#30363d] group-hover:border-[#58a6ff]'}`}>
                  <GitCommit size={12} className={selectedCommit?.id === commit.id ? 'text-white' : 'text-gray-400'} />
                </div>
                <div className={`flex-1 p-3 rounded-md border transition-colors ${selectedCommit?.id === commit.id ? 'bg-[#1f6feb]/10 border-[#1f6feb]/50' : 'bg-[#161b22] border-[#30363d] group-hover:border-gray-600'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-gray-200">{commit.message}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>{commit.id}</span>
                    <span>{new Date(commit.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-[#0d1117] flex flex-col min-w-0">
          {selectedCommit ? (
            <div className="flex-1 flex flex-col h-full">
              <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400 font-mono">{selectedCommit.id}</span>
                  <span className="font-medium text-gray-200">{selectedCommit.message}</span>
                </div>
                <button 
                  onClick={() => handleRevert(selectedCommit)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#8b949e]/20 hover:bg-[#8b949e]/40 text-gray-200 rounded text-xs font-medium transition-colors"
                >
                  <RotateCcw size={14} /> REVERT TO THIS
                </button>
              </div>
              <div className="p-4 border-b border-[#30363d] bg-[#161b22]/50">
                <h4 className="text-xs font-medium text-gray-400 uppercase mb-3">Changes in this commit</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCommit.changes.map(change => (
                    <div key={change.path} className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded">
                      <span className={`font-bold text-xs ${change.status === 'A' ? 'text-[#3fb950]' : change.status === 'M' ? 'text-[#d29922]' : 'text-[#f85149]'}`}>
                        {change.status}
                      </span>
                      <span className="font-mono text-xs text-gray-300 truncate">{change.path}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-6 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Read-only view of commit {selectedCommit.id}</p>
                </div>
              </div>
            </div>
          ) : selectedFile ? (
            <div className="flex-1 flex flex-col h-full">
              <div className="h-10 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2 text-sm text-gray-300 font-mono">
                  <Edit2 size={14} className="text-gray-500"/> {selectedFile}
                </div>
                <button 
                  onClick={handleSaveFile}
                  className="flex items-center gap-2 text-xs font-medium text-[#58a6ff] hover:text-[#79b8ff]"
                >
                  <Save size={14} /> SAVE FILE
                </button>
              </div>
              <textarea
                value={fileContent}
                onChange={e => setFileContent(e.target.value)}
                className="flex-1 w-full bg-[#0d1117] text-gray-200 p-4 font-mono text-sm resize-none focus:outline-none"
                spellCheck="false"
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 bg-[#0d1117]">
              <div className="text-center flex flex-col items-center">
                <GitBranch size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium text-gray-400">Offline Version Control</p>
                <p className="text-sm mt-2 max-w-sm">Select a file from the workspace to edit, or select a commit to view history.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
