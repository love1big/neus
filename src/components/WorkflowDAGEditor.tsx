import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Target, Server, Search, Plus, Save, Play, Pause, StepForward, Settings, Move, Mic, Flame, Zap, MousePointer2, GitCommit, GitBranch, Box, FileText, CheckCircle, Database, LayoutTemplate, TerminalSquare, Clock, CheckCircle2, AlertCircle, PlayCircle, History, Network, MessageSquareWarning, Trash2, 
  GitPullRequest, Github, Package, CloudRain, Slack, Send, Layers, Globe, Shield, CreditCard, Key, AlignEndVertical, HardDrive, Smartphone, Share2, Shuffle,
  FileJson, Braces, FileCode, Binary, Settings2, Hash, FileArchive, Music, Video, Image as ImageIcon, Cpu, Fingerprint, Activity, Code2, SearchCode, Webhook, Anchor, Table, BarChart, ServerCog, Terminal, Command, Wrench, Lock, Wifi, KeyRound, Bug, Stethoscope
} from 'lucide-react';

interface AINote {
  id: string;
  text: string;
  isResolved: boolean;
  resolutionText?: string;
}

interface DagNode {
  id: string;
  type: string;
  title: string;
  x: number;
  y: number;
  agent: string;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'waiting';
  color: string;
  icon: React.ReactNode;
  progress?: number;
  elapsedMs?: number;
  memoryUsage?: string;
  lastLog?: string;
  notes: AINote[];
  scheduleMode?: 'immediate' | 'delay' | 'cron';
  scheduleValue?: string; // delay in ms or cron string
}

interface DagConnection {
  id: string;
  fromNode: string;
  toNode: string;
}

interface ExecutionLog {
  id: string;
  timestamp: string;
  nodeId: string;
  taskTitle: string;
  agent: string;
  status: 'started' | 'success' | 'failed';
  elapsedTimeMs?: number;
}

interface DagGroup {
  id: string;
  title: string;
  notes: AINote[];
  nodes: string[];
  color: string;
}

const TOOL_CATEGORIES = [
  {
    category: 'AI Agents',
    tools: [
      { type: 'design', title: 'Design Agent', agent: 'LoreMaster', color: '#f85149', icon: <FileText size={14} /> },
      { type: 'code', title: 'Code Architect', agent: 'SysArch-Bot', color: '#58a6ff', icon: <Database size={14} /> },
      { type: 'model', title: '3D Generator', agent: 'MeshWeaver-AI', color: '#3fb950', icon: <Box size={14} /> },
      { type: 'rig', title: 'Auto-Rigger', agent: 'KinematicBot', color: '#e3b341', icon: <LayoutTemplate size={14} /> },
      { type: 'texture', title: 'Texture Synthesis', agent: 'TextureDiff', color: '#bc8cff', icon: <Flame size={14} /> },
      { type: 'voice', title: 'Voice Synth', agent: 'AudioVox', color: '#ff7b72', icon: <Mic size={14} /> },
    ]
  },
  {
    category: 'Core Execution (Manual)',
    tools: [
      { type: 'shell_exec', title: 'Bash/Zsh Script', agent: 'SystemCore', color: '#8b949e', icon: <TerminalSquare size={14} /> },
      { type: 'python_exec', title: 'Python 3 Script', agent: 'PythonRuntime', color: '#e3b341', icon: <Code2 size={14} /> },
      { type: 'binary_exec', title: 'Execute Binary', agent: 'OS_Kernel', color: '#58a6ff', icon: <Binary size={14} /> },
      { type: 'kill_pid', title: 'Kill Process (PID)', agent: 'TaskMgr', color: '#f85149', icon: <Activity size={14} /> },
      { type: 'syscall', title: 'System Call', agent: 'OS_Kernel', color: '#d2a8ff', icon: <Settings2 size={14} /> },
      { type: 'lua_script', title: 'Lua Engine Script', agent: 'LuaJIT', color: '#0668E1', icon: <Code2 size={14} /> },
      { type: 'ruby_script', title: 'Ruby Script', agent: 'RubyCore', color: '#f85149', icon: <Code2 size={14} /> },
      { type: 'go_run', title: 'Go Run Source', agent: 'GoToolchain', color: '#58a6ff', icon: <TerminalSquare size={14} /> },
      { type: 'rust_cargo', title: 'Cargo Build/Run', agent: 'Rustc', color: '#e3b341', icon: <Package size={14} /> },
    ]
  },
  {
    category: 'Data & String Parse',
    tools: [
      { type: 'parse_json', title: 'Parse JSON String', agent: 'DataUtil', color: '#f0883e', icon: <FileJson size={14} /> },
      { type: 'regex_match', title: 'Regex Extractor', agent: 'StringParser', color: '#d2a8ff', icon: <SearchCode size={14} /> },
      { type: 'base64_enc', title: 'Base64 Enc/Dec', agent: 'DataUtil', color: '#bc8cff', icon: <Braces size={14} /> },
      { type: 'hash_sha', title: 'SHA-256 Hash Gen', agent: 'CryptoLib', color: '#f85149', icon: <Hash size={14} /> },
      { type: 'xml_convert', title: 'XML to JSON', agent: 'DataUtil', color: '#58a6ff', icon: <FileCode size={14} /> },
      { type: 'yaml_parse', title: 'YAML Parser', agent: 'DataUtil', color: '#3fb950', icon: <FileJson size={14} /> },
      { type: 'csv_extract', title: 'CSV Extract & Map', agent: 'DataUtil', color: '#58a6ff', icon: <Database size={14} /> },
      { type: 'json_jsonnet', title: 'Jsonnet Compile', agent: 'JsonnetEngine', color: '#bc8cff', icon: <Code2 size={14} /> },
    ]
  },
  {
    category: 'Advanced Math & Cryptography',
    tools: [
      { type: 'matrix_calc', title: 'Matrix Math Det/Inv', agent: 'MathLib', color: '#0078D4', icon: <Activity size={14} /> },
      { type: 'fft_analyze', title: 'FFT Transf/Analyze', agent: 'DSPCore', color: '#FFD21E', icon: <Activity size={14} /> },
      { type: 'aes_encrypt', title: 'AES-256 Encrypt/Dec', agent: 'CryptoCore', color: '#f85149', icon: <Shield size={14} /> },
      { type: 'rsa_keygen', title: 'RSA KeyPair Gen', agent: 'CryptoCore', color: '#8b949e', icon: <Key size={14} /> },
      { type: 'bignum_calc', title: 'BigNum Arithmetic', agent: 'MathLib', color: '#58a6ff', icon: <Hash size={14} /> },
    ]
  },
  {
    category: 'File System (I/O)',
    tools: [
      { type: 'read_file', title: 'Read File Content', agent: 'FS-Module', color: '#3fb950', icon: <FileText size={14} /> },
      { type: 'write_file', title: 'Write/Append File', agent: 'FS-Module', color: '#58a6ff', icon: <Save size={14} /> },
      { type: 'zip_archive', title: 'Zip/Tar Archive', agent: 'ArchiveUtil', color: '#e3b341', icon: <FileArchive size={14} /> },
      { type: 'delete_dir', title: 'Wipe Directory', agent: 'FS-Module', color: '#f85149', icon: <Trash2 size={14} /> },
      { type: 'chmod', title: 'Change Permissions', agent: 'FS-Module', color: '#8b949e', icon: <Fingerprint size={14} /> },
      { type: 'watch_dir', title: 'Watch Directory (Inotify)', agent: 'FS-Module', color: '#22B8CD', icon: <Search size={14} /> },
      { type: 'symlink', title: 'Create Symlink', agent: 'FS-Module', color: '#d2a8ff', icon: <Network size={14} /> },
    ]
  },
  {
    category: 'Network & HTTP & IPC',
    tools: [
      { type: 'http_get', title: 'HTTP GET Request', agent: 'Net-Curl', color: '#58a6ff', icon: <Globe size={14} /> },
      { type: 'http_post', title: 'HTTP POST/PUT', agent: 'Net-Curl', color: '#3fb950', icon: <Globe size={14} /> },
      { type: 'graphql', title: 'GraphQL Query', agent: 'GQL-Client', color: '#d2a8ff', icon: <Network size={14} /> },
      { type: 'ftp_upload', title: 'FTP/SFTP Upload', agent: 'Net-Transfer', color: '#e3b341', icon: <Server size={14} /> },
      { type: 'ws_msg', title: 'WebSocket Emit', agent: 'Socket-Client', color: '#ff7b72', icon: <Activity size={14} /> },
      { type: 'webhook', title: 'Trigger Webhook', agent: 'System', color: '#d2a8ff', icon: <Webhook size={14} /> },
      { type: 'tcp_socket', title: 'Raw TCP Socket Send', agent: 'Net-Core', color: '#f0883e', icon: <Share2 size={14} /> },
      { type: 'udp_broadcast', title: 'UDP Net Broadcast', agent: 'Net-Core', color: '#e3b341', icon: <Share2 size={14} /> },
      { type: 'grpc_call', title: 'gRPC Unary Call', agent: 'Net-Core', color: '#0668E1', icon: <Globe size={14} /> },
      { type: 'mqtt_pub', title: 'MQTT Publish', agent: 'IoT-Hub', color: '#3fb950', icon: <CloudRain size={14} /> },
    ]
  },
  {
    category: 'Engine / Compilers',
    tools: [
      { type: 'compile_shader', title: 'SPIR-V Shader Compile', agent: 'RenderCore', color: '#f85149', icon: <Cpu size={14} /> },
      { type: 'bake_light', title: 'Bake Lightmaps', agent: 'Lighting-Engine', color: '#e3b341', icon: <Flame size={14} /> },
      { type: 'navmesh', title: 'Generate NavMesh', agent: 'AI-Nav', color: '#3fb950', icon: <Network size={14} /> },
      { type: 'compress_tex', title: 'ASTC/BC7 Compress', agent: 'Asset-Pipeline', color: '#bc8cff', icon: <Layers size={14} /> },
      { type: 'pack_vfs', title: 'Pack Virtual FS', agent: 'Build-Tools', color: '#d2a8ff', icon: <Package size={14} /> },
      { type: 'wasm_compile', title: 'C++ to WebAssembly', agent: 'Emscripten', color: '#F97316', icon: <Binary size={14} /> },
    ]
  },
  {
    category: 'Media Processing',
    tools: [
      { type: 'resize_img', title: 'Image Resize/Crop', agent: 'ImageMagick', color: '#58a6ff', icon: <ImageIcon size={14} /> },
      { type: 'encode_video', title: 'FFmpeg Encode', agent: 'Media-Encoder', color: '#ff7b72', icon: <Video size={14} /> },
      { type: 'trim_audio', title: 'Trim/Normalize WAV', agent: 'Audio-DSP', color: '#3fb950', icon: <Music size={14} /> },
      { type: 'pdf_gen', title: 'Generate PDF', agent: 'ReportCore', color: '#d2a8ff', icon: <FileText size={14} /> },
      { type: 'excel_export', title: 'Create Excel/XLSX', agent: 'DataExport', color: '#3fb950', icon: <Database size={14} /> },
      { type: 'watermark', title: 'Watermark Media', agent: 'ImageMagick', color: '#8b949e', icon: <ImageIcon size={14} /> },
    ]
  },
  {
    category: 'System Diagnostics & Profiling',
    tools: [
      { type: 'perf_stat', title: 'Perf CPU Profiler', agent: 'SysCore', color: '#e3b341', icon: <Activity size={14} /> },
      { type: 'strace_log', title: 'Strace Monitor', agent: 'SysCore', color: '#f85149', icon: <Stethoscope size={14} /> },
      { type: 'valgrind_check', title: 'Valgrind MemCheck', agent: 'MemGuard', color: '#bc8cff', icon: <Bug size={14} /> },
      { type: 'tcpdump', title: 'TCP Dump/Sniffer', agent: 'NetSec', color: '#58a6ff', icon: <Wifi size={14} /> },
      { type: 'gdb_debug', title: 'GDB Attach', agent: 'Debugger', color: '#ff7b72', icon: <Command size={14} /> },
    ]
  },
  {
    category: 'Database & KVS',
    tools: [
      { type: 'sql_exec', title: 'Execute SQL Query', agent: 'DBEngine', color: '#3fb950', icon: <Database size={14} /> },
      { type: 'mongo_find', title: 'Mongo Aggregation', agent: 'NoSQLCore', color: '#58a6ff', icon: <Table size={14} /> },
      { type: 'redis_set', title: 'Redis Set/Get', agent: 'KVS', color: '#f85149', icon: <HardDrive size={14} /> },
      { type: 'db_migrate', title: 'Run DB Migration', agent: 'DBEngine', color: '#e3b341', icon: <ServerCog size={14} /> },
      { type: 'parquet_read', title: 'Read Parquet Data', agent: 'DataCore', color: '#bc8cff', icon: <BarChart size={14} /> },
    ]
  },
  {
    category: 'DevSecOps & Crypto',
    tools: [
      { type: 'verify_jwt', title: 'Verify JWT/OAuth', agent: 'IAMGuard', color: '#58a6ff', icon: <KeyRound size={14} /> },
      { type: 'ssl_check', title: 'X.509 SSL Check', agent: 'NetSec', color: '#3fb950', icon: <Lock size={14} /> },
      { type: 'vuln_scan', title: 'Static Vuln Scan', agent: 'SecOps', color: '#f85149', icon: <Shield size={14} /> },
      { type: 'docker_build', title: 'Build Docker Image', agent: 'DockerDaemon', color: '#58a6ff', icon: <Package size={14} /> },
      { type: 'k8s_deploy', title: 'K8s Apply YAML', agent: 'KubeCtl', color: '#e3b341', icon: <Anchor size={14} /> },
    ]
  },
  {
    category: 'Online AI Learning (Free)',
    tools: [
      { type: 'web_search', title: 'Web Search First', agent: 'DuckDuckGo', color: '#e3b341', icon: <Globe size={14} /> },
      { type: 'ai_deepseek', title: 'DeepSeek Chat', agent: 'DeepSeek', color: '#58a6ff', icon: <Cpu size={14} /> },
      { type: 'ai_chatgpt', title: 'ChatGPT Free', agent: 'OpenAI', color: '#3fb950', icon: <Cpu size={14} /> },
      { type: 'ai_gemini', title: 'Gemini Free', agent: 'Google', color: '#d2a8ff', icon: <Cpu size={14} /> },
      { type: 'ai_claude', title: 'Claude Free', agent: 'Anthropic', color: '#f0883e', icon: <Cpu size={14} /> },
      { type: 'ai_kimi', title: 'Kimi Moonshot', agent: 'Moonshot', color: '#ff7b72', icon: <Cpu size={14} /> },
      { type: 'ai_grok', title: 'Grok X', agent: 'xAI', color: '#8b949e', icon: <Cpu size={14} /> },
      { type: 'ai_meta', title: 'Meta AI Free', agent: 'Meta', color: '#0668E1', icon: <Cpu size={14} /> },
      { type: 'ai_copilot', title: 'Copilot (Bing)', agent: 'Microsoft', color: '#0078D4', icon: <Cpu size={14} /> },
      { type: 'ai_perplexity', title: 'Perplexity Free', agent: 'Perplexity', color: '#22B8CD', icon: <Cpu size={14} /> },
      { type: 'ai_hugging', title: 'HuggingChat', agent: 'HuggingFace', color: '#FFD21E', icon: <Cpu size={14} /> },
      { type: 'ai_mistral', title: 'Le Chat (Mistral)', agent: 'Mistral', color: '#F97316', icon: <Cpu size={14} /> },
      { type: 'ai_poe', title: 'Poe Free Models', agent: 'Quora', color: '#7E57C2', icon: <Cpu size={14} /> },
    ]
  },
  {
    category: 'CI/CD & DevOps',
    tools: [
      { type: 'git_pull', title: 'Git Pull Origin', agent: 'System', color: '#d2a8ff', icon: <Github size={14} /> },
      { type: 'build', title: 'Run Build', agent: 'Jenkins', color: '#f0883e', icon: <Package size={14} /> },
      { type: 'test', title: 'Unit Tests', agent: 'Jest/PyTest', color: '#3fb950', icon: <CheckCircle2 size={14} /> },
      { type: 'docker', title: 'Build Image', agent: 'DockerDaemon', color: '#58a6ff', icon: <Layers size={14} /> },
      { type: 'deploy', title: 'K8S Deploy', agent: 'Kubectl', color: '#3fb950', icon: <Globe size={14} /> },
      { type: 'aws', title: 'AWS Sync', agent: 'AWS CLI', color: '#e3b341', icon: <CloudRain size={14} /> },
      { type: 'terraform_plan', title: 'Terraform Plan/Apply', agent: 'TF-Runner', color: '#7E57C2', icon: <CloudRain size={14} /> },
      { type: 'ansible_pb', title: 'Ansible Playbook', agent: 'Ansible', color: '#f85149', icon: <TerminalSquare size={14} /> },
    ]
  },
  {
    category: 'Integrations',
    tools: [
      { type: 'slack', title: 'Slack Notify', agent: 'SlackBot', color: '#ff7b72', icon: <Slack size={14} /> },
      { type: 'email', title: 'Send Email', agent: 'SendGrid', color: '#58a6ff', icon: <Send size={14} /> },
      { type: 'stripe', title: 'Sync Stripe', agent: 'StripeAPI', color: '#bc8cff', icon: <CreditCard size={14} /> },
      { type: 'sms', title: 'Twilio SMS', agent: 'Twilio', color: '#3fb950', icon: <Smartphone size={14} /> },
      { type: 'discord_webhook', title: 'Discord Webhook', agent: 'DiscordAPI', color: '#58a6ff', icon: <MessageSquareWarning size={14} /> },
      { type: 'jira_ticket', title: 'Create Jira Ticket', agent: 'JiraBot', color: '#0668E1', icon: <CheckCircle2 size={14} /> },
    ]
  },
  {
    category: 'Logic Gates & Sequencing',
    tools: [
      { type: 'if_else', title: 'Condition Branch', agent: 'Logic', color: '#8b949e', icon: <Shuffle size={14} /> },
      { type: 'switch_case', title: 'Switch / Router', agent: 'Logic', color: '#d2a8ff', icon: <Network size={14} /> },
      { type: 'merge', title: 'Merge Parallel', agent: 'Logic', color: '#8b949e', icon: <AlignEndVertical size={14} /> },
      { type: 'foreach_loop', title: 'For-Each Loop', agent: 'Logic', color: '#ff7b72', icon: <History size={14} /> },
      { type: 'while_loop', title: 'While Condition Loop', agent: 'Logic', color: '#f0883e', icon: <History size={14} /> },
    ]
  },
  {
    category: 'Timers & Scheduling',
    tools: [
      { type: 'wait', title: 'Wait / Delay Ms', agent: 'Timer', color: '#e3b341', icon: <Clock size={14} /> },
      { type: 'cron_schedule', title: 'Cron Scheduler Config', agent: 'CronDaemon', color: '#0668E1', icon: <Clock size={14} /> },
      { type: 'timeout_guard', title: 'Timeout Guard', agent: 'Timer', color: '#f85149', icon: <AlertCircle size={14} /> },
      { type: 'throttle', title: 'Throttle Execution', agent: 'RateLimiter', color: '#bc8cff', icon: <Clock size={14} /> },
    ]
  }
];

export default function WorkflowDAGEditor() {
  const [nodes, setNodes] = useState<DagNode[]>([
    { id: 'task_1', type: 'design', title: 'Game Design Document', x: 50, y: 150, agent: 'Director-Prime', status: 'completed', color: '#f85149', icon: <FileText size={14} />, notes: [] },
    { id: 'task_2', type: 'code', title: 'C++ Systems Architecture', x: 300, y: 50, agent: 'SysArch-C++', status: 'completed', color: '#58a6ff', icon: <Database size={14} />, notes: [] },
    { id: 'task_3', type: 'model', title: 'Generate Base Mesh', x: 300, y: 250, agent: 'MeshWeaver-AI', status: 'running', color: '#3fb950', icon: <Box size={14} />, notes: [
      { id: 'n_t3_1', text: 'Optimize polygon density before passing to rig.', isResolved: false }
    ] },
    { id: 'task_4', type: 'rig', title: 'Auto-Rigging (Humanoid)', x: 550, y: 250, agent: 'KinematicBot', status: 'idle', color: '#e3b341', icon: <LayoutTemplate size={14} />, notes: [] },
    { id: 'task_5', type: 'texture', title: 'Apply PBR Textures', x: 800, y: 250, agent: 'TextureDiff-X', status: 'idle', color: '#bc8cff', icon: <Flame size={14} />, notes: [] },
  ]);

  const [connections, setConnections] = useState<DagConnection[]>([
    { id: 'c1', fromNode: 'task_1', toNode: 'task_2' },
    { id: 'c2', fromNode: 'task_1', toNode: 'task_3' },
    { id: 'c3', fromNode: 'task_3', toNode: 'task_4' },
    { id: 'c4', fromNode: 'task_4', toNode: 'task_5' },
  ]);

  const [toolSearchQuery, setToolSearchQuery] = useState('');

  const [groups, setGroups] = useState<DagGroup[]>([
    { 
      id: 'g_1', 
      title: 'Asset Generation Pipeline', 
      notes: [
        {
          id: 'n_1',
          text: 'AI Offline Note: Please review the topology of Generation Base Mesh. The auto-rigging step fails if polygon count exceeds 50k.',
          isResolved: false
        },
        {
          id: 'n_2',
          text: 'The Python script in "MeshWeaver-AI" needs Decimate modifier tweaked. Fix the density variable before running.',
          isResolved: true,
          resolutionText: 'Decimate modifier ratio updated successfully. Script redeployed to execution node.'
        }
      ], 
      nodes: ['task_3', 'task_4', 'task_5'], 
      color: '#3fb950' 
    }
  ]);

  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [drawingConnection, setDrawingConnection] = useState<{fromNode: string, x: number, y: number} | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.shiftKey) {
      setSelectedNodes(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);
    } else {
      if (!selectedNodes.includes(id)) {
        setSelectedNodes([id]);
      }
      setDraggingNode(id);
    }
  };

  const startConnection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
       const rect = containerRef.current.getBoundingClientRect();
       setDrawingConnection({ fromNode: id, x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode) {
      setNodes(nodes.map(n => {
        if (selectedNodes.includes(n.id)) {
           return { ...n, x: n.x + e.movementX, y: n.y + e.movementY };
        }
        return n;
      }));
    } else if (drawingConnection && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDrawingConnection({ ...drawingConnection, x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
    setDrawingConnection(null);
  };

  const completeConnection = (toNodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (drawingConnection && drawingConnection.fromNode !== toNodeId) {
       // Check if connection already exists
       const exists = connections.some(c => c.fromNode === drawingConnection.fromNode && c.toNode === toNodeId);
       if (!exists) {
           setConnections([...connections, { id: `c_${Date.now()}`, fromNode: drawingConnection.fromNode, toNode: toNodeId }]);
       }
    }
    setDrawingConnection(null);
  };

  const handleCanvasClick = () => {
    closeMenu();
    setSelectedNodes([]);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMenuPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const closeMenu = () => setMenuPos(null);

  const [expandedScheduleNodeId, setExpandedScheduleNodeId] = useState<string | null>(null);

  const updateNodeSchedule = (nodeId: string, mode: 'immediate' | 'delay' | 'cron', value: string) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, scheduleMode: mode, scheduleValue: value } : n));
  };

  const addNode = (type: string, title: string, agent: string, color: string, icon: React.ReactNode) => {
    if (!menuPos) return;
    const newNode: DagNode = {
      id: `task_${Date.now()}`,
      type,
      title,
      x: menuPos.x,
      y: menuPos.y,
      agent,
      status: 'idle',
      color,
      icon,
      progress: 0,
      elapsedMs: 0,
      memoryUsage: '0MB',
      lastLog: 'Awaiting execution...',
      notes: [],
    };
    setNodes([...nodes, newNode]);
    closeMenu();
  };

  const groupSelectedNodes = () => {
    if (selectedNodes.length < 2) return;
    const newGroup: DagGroup = {
      id: `group_${Date.now()}`,
      title: 'New Sub-Pipeline',
      notes: [{ id: `n_${Date.now()}`, text: 'Initial note for offline AI processing...', isResolved: false }],
      nodes: [...selectedNodes],
      color: '#58a6ff'
    };
    setGroups([...groups, newGroup]);
    setSelectedNodes([]);
    closeMenu();
  };

  const [isPaused, setIsPaused] = useState(false);
  const pauseRef = useRef(false);
  const stepRef = useRef(false);

  const togglePause = () => {
     setIsPaused(!isPaused);
     pauseRef.current = !isPaused;
  };

  const stepNext = () => {
     if (isPaused) {
       stepRef.current = true;
     }
  };

  const executePipeline = async () => {
    if (isExecuting) {
      if (isPaused) togglePause(); // resume if already executing and paused
      return;
    }
    setIsExecuting(true);
    setIsPaused(false);
    pauseRef.current = false;
    stepRef.current = false;
    setLogs([]);
    
    setNodes(prev => prev.map(n => ({ 
      ...n, 
      status: 'idle', 
      progress: 0, 
      elapsedMs: 0, 
      memoryUsage: '0MB', 
      lastLog: 'Awaiting execution...' 
    })));

    // Create execution plan
    const inDegree: Record<string, number> = {};
    const adj: Record<string, string[]> = {};
    nodes.forEach(n => {
      inDegree[n.id] = 0;
      adj[n.id] = [];
    });

    connections.forEach(c => {
      if (adj[c.fromNode] && inDegree[c.toNode] !== undefined) {
         adj[c.fromNode].push(c.toNode);
         inDegree[c.toNode]++;
      }
    });

    const runQueue: string[] = [];
    Object.keys(inDegree).forEach(id => {
      if (inDegree[id] === 0) runQueue.push(id);
    });

    const runNode = async (nodeId: string) => {
      // Re-fetch node obj inside loop if needed, but here it's static
      const nodeObj = nodes.find(n => n.id === nodeId);
      if (!nodeObj) return;

      const startTime = Date.now();
      const timestampStr = new Date(startTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 2 });
      
      // Handling Scheduling/Timer
      if (nodeObj.scheduleMode === 'delay' || nodeObj.scheduleMode === 'cron') {
         setNodes(prev => prev.map(n => n.id === nodeId ? { 
           ...n, 
           status: 'waiting',
           progress: 0,
           elapsedMs: 0,
           lastLog: nodeObj.scheduleMode === 'delay' ? `Delaying for ${nodeObj.scheduleValue}ms...` : `Waiting for next cron tick: ${nodeObj.scheduleValue}...`
         } : n));
         
         const waitMs = nodeObj.scheduleMode === 'delay' ? parseInt(nodeObj.scheduleValue || '1000') || 1000 : 2500;
         await new Promise(r => setTimeout(r, waitMs));
      }

      setNodes(prev => prev.map(n => n.id === nodeId ? { 
        ...n, 
        status: 'running',
        progress: 0,
        elapsedMs: 0,
        memoryUsage: `${Math.floor(Math.random() * 50) + 10}MB`,
        lastLog: 'Initializing context...'
      } : n));
      setLogs(prev => [...prev, {
        id: `log_${Date.now()}_${Math.random()}`,
        timestamp: timestampStr,
        nodeId: nodeId,
        taskTitle: nodeObj.title,
        agent: nodeObj.agent,
        status: 'started'
      }]);

      // simulate execution time (2s to 4s)
      const executionTime = Math.floor(Math.random() * 2000) + 2000;
      const intervalMs = 100;
      const steps = executionTime / intervalMs;
      
      for (let i = 1; i <= steps; i++) {
        while (pauseRef.current && !stepRef.current) {
          await new Promise(r => setTimeout(r, 50));
        }
        if (stepRef.current) {
          stepRef.current = false;
        }

        await new Promise(r => setTimeout(r, intervalMs));
        const currentElapsed = i * intervalMs;
        const progress = Math.min(100, Math.floor((currentElapsed / executionTime) * 100));
        
        let logMsg = 'Processing data elements...';
        if (nodeObj.type?.startsWith('ai_')) {
            if (progress > 80) logMsg = `Waiting for Human to paste response from ${nodeObj.title}...`;
            else if (progress > 50) logMsg = 'Copying prompt to clipboard...';
            else if (progress > 20) logMsg = `Opening ${nodeObj.title} interface via proxy...`;
            else logMsg = 'Initializing Web Proxy interface...';
        } else if (nodeObj.type === 'web_search') {
            if (progress > 80) logMsg = 'Compiling search results for offline DB...';
            else if (progress > 50) logMsg = 'Parsing DuckDuckGo SERP...';
            else if (progress > 20) logMsg = 'Executing Web Search query...';
            else logMsg = 'Starting browser engine...';
        } else {
            if (progress > 85) logMsg = 'Finalizing output payload...';
            else if (progress > 60) logMsg = 'Running core routine transformations...';
            else if (progress > 30) logMsg = 'Allocating memory and parsing headers...';
            else if (progress > 10) logMsg = 'Loading agent dependencies...';
        }

        // Add 5% chance of minor warning log
        if (Math.random() < 0.05 && progress > 20 && progress < 80 && !nodeObj.type?.startsWith('ai_') && nodeObj.type !== 'web_search') {
           logMsg = 'WARN: Memory spike detected, adjusting GC pressure.';
        }

        setNodes(prev => prev.map(n => n.id === nodeId ? { 
           ...n, 
           progress, 
           elapsedMs: currentElapsed,
           memoryUsage: `${Math.floor(Math.random() * 150) + 50}MB`,
           lastLog: logMsg
        } : n));
      }

      // 10% chance to fail just to show failure state handling, unless it's task_1 which we keep green
      const isFailed = (nodeId !== 'task_1') && Math.random() < 0.15;
      const endStatus = isFailed ? 'failed' : 'completed';

      let failLog = 'ERR_SEGFAULT: Access Violation at 0x00A1B2 or Agent Timeout.';
      if (nodeObj.type?.startsWith('ai_')) {
          failLog = 'ERR_RATE_LIMIT: Exhausted Free Tier. Falling back to next available AI.';
      } else if (nodeObj.type === 'web_search') {
          failLog = 'ERR_CAPTCHA_BLOCK: Search engine blocked request. Try another Web node.';
      } else if (['design', 'code', 'model', 'rig', 'texture', 'voice'].includes(nodeObj.type || '')) {
          failLog = 'ERR_OFFLINE_CAPACITY: Offline model failed. Use Web Learning Fallback button below.';
      }

      const endTime = Date.now();
      const endTimestampStr = new Date(endTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 2 });

      setNodes(prev => prev.map(n => n.id === nodeId ? { 
        ...n, 
        status: endStatus,
        progress: isFailed ? n.progress : 100,
        lastLog: isFailed ? failLog : 'Task completed successfully with 0 warnings.',
        memoryUsage: isFailed ? n.memoryUsage : '0MB'
      } : n));
      setLogs(prev => [...prev, {
        id: `log_${Date.now()}_${Math.random()}`,
        timestamp: endTimestampStr,
        nodeId: nodeId,
        taskTitle: nodeObj.title,
        agent: nodeObj.agent,
        status: isFailed ? 'failed' : 'success',
        elapsedTimeMs: executionTime
      }]);

      if (isFailed) {
         return; // Stop downstream execution for this branch
      }

      // Release children
      const children = adj[nodeId] || [];
      const newlyEnabled: string[] = [];
      children.forEach(childId => {
        inDegree[childId]--;
        if (inDegree[childId] === 0) {
          newlyEnabled.push(childId);
        }
      });

      // Run children concurrently
      await Promise.all(newlyEnabled.map(childId => runNode(childId)));
    };

    // Run roots concurrently
    await Promise.all(runQueue.map(rootId => runNode(rootId)));

    setIsExecuting(false);
    setIsPaused(false);
    pauseRef.current = false;
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Header */}
      <div className="h-14 border-b border-[#30363d] flex items-center justify-between px-6 bg-[#161b22] shrink-0">
        <div className="flex items-center gap-3">
          <Server className="text-[#58a6ff]" size={20} />
          <div>
            <h1 className="text-sm font-bold text-white">Workflow Directed Acyclic Graph (DAG) Editor</h1>
            <p className="text-[10px] text-[#8b949e]">Define execution dependencies and track task resolution pipelines</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8b949e]" />
             <input 
               type="text" 
               placeholder="Search AI notes..." 
               className="bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#58a6ff] transition-colors w-56"
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
             />
           </div>
           {!isExecuting ? (
             <button 
               className={`px-3 py-1.5 rounded textxs font-bold transition-colors border flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border-[#30363d]`}
               onClick={executePipeline}
             >
               <Play size={14} /> Execute Pipeline
             </button>
           ) : (
             <>
               <button 
                 className={`px-3 py-1.5 rounded textxs font-bold transition-colors border flex items-center gap-2 ${isPaused ? 'bg-[#e3b341]/20 text-[#e3b341] border-[#e3b341]/40' : 'bg-[#30363d] text-[#c9d1d9] border-[#30363d]'}`}
                 onClick={togglePause}
               >
                 {isPaused ? <Play size={14} /> : <Pause size={14} />} {isPaused ? 'Resume' : 'Pause'}
               </button>
               <button 
                 className={`px-3 py-1.5 rounded textxs font-bold transition-colors border flex items-center gap-2 ${!isPaused ? 'opacity-50 cursor-not-allowed bg-[#30363d] text-[#8b949e] border-[#30363d]' : 'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border-[#30363d]'}`}
                 onClick={stepNext}
                 disabled={!isPaused}
                 title="Step Forward (1 tick)"
               >
                 <StepForward size={14} /> Step
               </button>
             </>
           )}
           <button className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded textxs font-bold transition-colors shadow-sm flex items-center gap-2">
             <Save size={14} /> Save DAG
           </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tool Arsenal Sidebar */}
        <div className="w-[240px] bg-[#0d1117] border-r border-[#30363d] flex flex-col shrink-0 overflow-y-auto no-scrollbar">
          <div className="p-4 border-b border-[#30363d] bg-[#161b22] sticky top-0 z-10 flex flex-col gap-3">
            <div>
              <h2 className="text-xs font-bold text-[#c9d1d9] uppercase tracking-wider flex items-center gap-2"><Package size={14}/> Node Arsenal</h2>
              <p className="text-[10px] text-[#8b949e] mt-1 line-clamp-2">Drag tools onto the canvas to construct your workflow pipeline.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1.5 text-[#8b949e]" size={12} />
              <input
                type="text"
                placeholder="Search tools & agents..."
                value={toolSearchQuery}
                onChange={(e) => setToolSearchQuery(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded text-[11px] text-[#c9d1d9] pl-7 pr-2 py-1 outline-none focus:border-[#58a6ff] transition-colors"
              />
            </div>
          </div>
          {TOOL_CATEGORIES.map(category => {
            const filteredTools = toolSearchQuery
              ? category.tools.filter(t => 
                  t.title.toLowerCase().includes(toolSearchQuery.toLowerCase()) || 
                  t.agent.toLowerCase().includes(toolSearchQuery.toLowerCase()) || 
                  t.type.toLowerCase().includes(toolSearchQuery.toLowerCase())
                )
              : category.tools;

            if (filteredTools.length === 0) return null;

            return (
              <div key={category.category} className="border-b border-[#30363d]/50 pb-2">
                <div className="px-4 py-3 text-[9px] font-bold text-[#8b949e] uppercase tracking-wider">{category.category}</div>
                <div className="flex flex-col gap-0.5 px-2">
                    {filteredTools.map(tool => (
                    <div
                      key={tool.title}
                      draggable
                      onDragStart={(e) => {
                          e.dataTransfer.setData('application/reactflow', JSON.stringify({ ...tool, icon: undefined })); // can't stringify react node, we'll map icon by type later
                          e.dataTransfer.effectAllowed = 'move';
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#161b22] cursor-grab active:cursor-grabbing border border-transparent hover:border-[#30363d] transition-colors"
                      title={tool.agent}
                    >
                      <div style={{ color: tool.color }}>{tool.icon}</div>
                      <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#c9d1d9]">{tool.title}</span>
                          <span className="text-[9px] text-[#8b949e]/70">{tool.agent}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
        </div>

        {/* Canvas */}
        <div 
           className="flex-1 relative bg-[#040506] overflow-hidden"
           ref={containerRef}
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}
           onMouseLeave={handleMouseUp}
           onContextMenu={handleContextMenu}
           onClick={handleCanvasClick}
           onDragOver={e => e.preventDefault()}
           onDrop={e => {
              e.preventDefault();
              const data = e.dataTransfer.getData('application/reactflow');
              if (data && containerRef.current) {
                 const toolData = JSON.parse(data);
                 // Recover icon from TOOL_CATEGORIES
                 let iconNode = <Box size={14}/>;
                 for (const cat of TOOL_CATEGORIES) {
                   const found = cat.tools.find(t => t.title === toolData.title);
                   if (found) iconNode = found.icon;
                 }
                 
                 const rect = containerRef.current.getBoundingClientRect();
                 const x = e.clientX - rect.left - 50; // offset for grab
                 const y = e.clientY - rect.top - 20;
                 const newNode: DagNode = {
                     id: `task_${Date.now()}`,
                     type: toolData.type,
                     title: toolData.title,
                     x,
                     y,
                     agent: toolData.agent,
                     status: 'idle',
                     color: toolData.color,
                     icon: iconNode,
                     progress: 0,
                     elapsedMs: 0,
                     memoryUsage: '0MB',
                     lastLog: 'Awaiting execution...',
                     notes: [],
                 };
                 setNodes(prev => [...prev, newNode]);
              }
           }}
        >
           {/* Grid */}
           <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#161b22 1px, transparent 1px), linear-gradient(90deg, #161b22 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }} />

           {/* Groups / Sub-Pipelines */}
           {groups.map(group => {
              const groupNodes = nodes.filter(n => group.nodes.includes(n.id));
              if (groupNodes.length === 0) return null;
              
              const minX = Math.min(...groupNodes.map(n => n.x)) - 24;
              const minY = Math.min(...groupNodes.map(n => n.y)) - 54;
              const maxX = Math.max(...groupNodes.map(n => n.x + 288)) + 24; // node width 288
              const maxY = Math.max(...groupNodes.map(n => n.y + 240)) + 24; // approx node height 240
              
              return (
                 <div 
                   key={group.id} 
                   className="absolute z-0 border-2 border-dashed rounded-xl flex flex-col pointer-events-none transition-all duration-300"
                   style={{
                     left: minX,
                     top: minY,
                     width: maxX - minX,
                     height: maxY - minY,
                     borderColor: `${group.color}60`,
                     backgroundColor: `${group.color}08`,
                   }}
                 >
                   <div className="absolute -top-7 left-0 px-3 py-1 flex items-center gap-2 rounded-tl-lg rounded-tr-lg border border-b-0 pointer-events-auto" style={{ backgroundColor: `${group.color}15`, borderColor: `${group.color}60`, backdropFilter: 'blur(4px)' }}>
                     <Network size={12} style={{ color: group.color }} />
                     <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: group.color }}>{group.title}</span>
                   </div>
                   
                   {/* AI Note Panel attached to group bottom */}
                   <div className="absolute top-[100%] left-0 mt-3 w-full max-w-[400px] p-3 rounded-lg border shadow-xl bg-[#0d1117] border-[#30363d] z-20 pointer-events-auto flex flex-col gap-2">
                      <div className="text-[10px] font-bold text-[#e3b341] uppercase tracking-wider flex items-center justify-between mb-1">
                         <div className="flex items-center gap-1.5"><MessageSquareWarning size={12}/> AI / Offline Collaboration Notes</div>
                         <div className="flex items-center gap-2">
                           <button 
                              className="bg-[#21262d] hover:bg-[#3fb950] hover:text-white text-[#8b949e] px-2 py-0.5 rounded text-[9px] transition-colors flex items-center gap-1"
                              onClick={() => {
                                 const newNote: AINote = { id: `n_${Date.now()}`, text: '', isResolved: false };
                                 setGroups(groups.map(g => g.id === group.id ? { ...g, notes: [...g.notes, newNote] } : g));
                              }}
                           >
                              <Plus size={10} /> Add Note
                           </button>
                           <button 
                              className="bg-[#21262d] hover:bg-[#f85149] hover:text-white text-[#8b949e] px-2 py-0.5 rounded text-[9px] transition-colors"
                              onClick={() => setGroups(groups.filter(g => g.id !== group.id))}
                           >
                              Ungroup
                           </button>
                         </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
                         {group.notes.map(note => (
                            <div key={note.id} className={`flex flex-col gap-1.5 p-2 rounded border transition-colors ${note.isResolved ? 'bg-[#161b22] border-[#2ea043]/30' : 'bg-[#161b22] border-[#30363d]'}`}>
                               <div className="flex items-start gap-2">
                                  <button onClick={() => {
                                     setGroups(groups.map(g => g.id === group.id ? { ...g, notes: g.notes.map(n => n.id === note.id ? { ...n, isResolved: !n.isResolved } : n) } : g));
                                  }}>
                                     {note.isResolved ? <CheckCircle size={14} className="text-[#3fb950] mt-0.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-[#8b949e] mt-0.5 hover:border-[#3fb950] transition-colors" />}
                                  </button>
                                  <textarea 
                                     className={`flex-1 bg-transparent border-none text-[11px] outline-none resize-none overflow-hidden min-h-[20px] ${note.isResolved ? 'text-[#8b949e] line-through' : 'text-[#c9d1d9]'}`}
                                     value={note.text}
                                     placeholder="Describe the task or issue..."
                                     onChange={(e) => {
                                        setGroups(groups.map(g => g.id === group.id ? { ...g, notes: g.notes.map(n => n.id === note.id ? { ...n, text: e.target.value } : n) } : g));
                                     }}
                                     onMouseDown={e => e.stopPropagation()}
                                     rows={Math.max(1, note.text.split('\n').length)}
                                  />
                                  <button className="text-[#8b949e] hover:text-[#f85149] transition-colors" onClick={() => {
                                     setGroups(groups.map(g => g.id === group.id ? { ...g, notes: g.notes.filter(n => n.id !== note.id) } : g));
                                  }}>
                                     <Trash2 size={12} />
                                  </button>
                               </div>

                               {/* Resolution Details */}
                               {note.isResolved && (
                                  <div className="ml-5 mt-1 pl-2 border-l-2 border-[#2ea043]/30 flex flex-col gap-1">
                                    <span className="text-[9px] text-[#2ea043] font-bold uppercase tracking-wider flex items-center gap-1">
                                      <TerminalSquare size={10} /> AI Agent Resolution Log
                                    </span>
                                    <textarea
                                      className="w-full bg-[#0d1117] border border-[#2ea043]/20 text-[10px] text-[#c9d1d9] rounded p-1.5 outline-none focus:border-[#3fb950] transition-colors resize-none h-12 shadow-inner font-mono"
                                      value={note.resolutionText || ''}
                                      placeholder="Offline AI: Describe what was done to resolve this..."
                                      onChange={(e) => {
                                         setGroups(groups.map(g => g.id === group.id ? { ...g, notes: g.notes.map(n => n.id === note.id ? { ...n, resolutionText: e.target.value } : n) } : g));
                                      }}
                                      onMouseDown={e => e.stopPropagation()}
                                    />
                                  </div>
                               )}
                            </div>
                         ))}
                         {group.notes.length === 0 && (
                            <div className="text-[10px] text-[#8b949e] text-center py-2 italic border border-dashed border-[#30363d] rounded">
                               No AI collaboration notes.
                            </div>
                         )}
                      </div>
                   </div>
                 </div>
              );
           })}

           {/* SPLINES */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
             <defs>
               <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#58a6ff" stopOpacity="1" />
                 <stop offset="100%" stopColor="#bc8cff" stopOpacity="1" />
               </linearGradient>
               <style dangerouslySetInnerHTML={{__html: `
                 @keyframes dash {
                   to {
                     stroke-dashoffset: -20;
                   }
                 }
               `}} />
             </defs>
             {connections.map(conn => {
                 const fromNode = nodes.find(n => n.id === conn.fromNode);
                 const toNode = nodes.find(n => n.id === conn.toNode);
                 if(!fromNode || !toNode) return null;
                 
                 const startX = fromNode.x + 288; // w-72 = 288px
                 const startY = fromNode.y + 70;  // vertical center (approx with header + progress)
                 
                 const endX = toNode.x;
                 const endY = toNode.y + 70;

                 // Cubic bezier curve logic
                 const cp1x = startX + 50;
                 const cp1y = startY;
                 const cp2x = endX - 50;
                 const cp2y = endY;

                 const pathD = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
                 
                 // Determine connection active states
                 const isActive = fromNode.status === 'running';
                 const isCompleted = fromNode.status === 'completed' && toNode.status === 'completed';

                 return (
                    <g key={conn.id}>
                      {/* Shadow/Base Line */}
                      <path 
                        d={pathD}
                        fill="none"
                        stroke={isCompleted ? '#2ea04360' : isActive ? '#58a6ff40' : '#30363d'}
                        strokeWidth={2}
                      />
                      {/* Animated Active Line */}
                      {isActive && (
                        <path 
                          d={pathD}
                          fill="none"
                          stroke="url(#glow)"
                          strokeWidth={2.5}
                          strokeDasharray="10 10"
                          style={{ animation: 'dash 1s linear infinite' }}
                        />
                      )}
                      <circle cx={startX} cy={startY} r={4} fill={fromNode.status === 'completed' ? "#2ea043" : isActive ? "#58a6ff" : "#8b949e"} />
                      <circle cx={endX} cy={endY} r={4} fill={toNode.status === 'completed' ? "#2ea043" : toNode.status === 'running' ? "#58a6ff" : "#30363d"} />
                    </g>
                 )
             })}
             
             {/* Temporary Spline for Drawing */}
             {drawingConnection && nodes.find(n => n.id === drawingConnection.fromNode) && (
               () => {
                 const fromNode = nodes.find(n => n.id === drawingConnection.fromNode)!;
                 const startX = fromNode.x + 288;
                 const startY = fromNode.y + 70;
                 const endX = drawingConnection.x;
                 const endY = drawingConnection.y;
                 const cp1x = startX + 50;
                 const cp1y = startY;
                 const cp2x = endX - 50;
                 const cp2y = endY;
                 
                 return (
                   <g>
                     <path 
                       d={`M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`}
                       fill="none"
                       stroke="#58a6ff"
                       strokeWidth={2}
                       strokeDasharray="5 5"
                     />
                     <circle cx={startX} cy={startY} r={4} fill="#58a6ff" />
                     <circle cx={endX} cy={endY} r={4} fill="#58a6ff" />
                   </g>
                 );
               }
             )()}
           </svg>

           {/* Nodes */}
           {nodes.map(node => {
             const isMatch = !searchQuery || (node.notes && node.notes.some(n => 
                n.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (n.resolutionText && n.resolutionText.toLowerCase().includes(searchQuery.toLowerCase()))
             ));
             
             return (
             <div 
               key={node.id}
               className={`absolute z-10 w-72 bg-[#0d1117] border rounded-lg shadow-xl overflow-visible transition-all duration-300 ${selectedNodes.includes(node.id) ? 'ring-2 ring-offset-2 ring-offset-[#040506] ring-[#58a6ff]' : ''} ${!isMatch ? 'opacity-20 grayscale pointer-events-none' : ''}`}
               style={{ 
                 left: node.x, top: node.y,
                 borderColor: (node.status === 'running' && isPaused) ? '#e3b341' : node.status === 'running' ? '#58a6ff' : node.status === 'completed' ? '#2ea043' : node.status === 'failed' ? '#f85149' : '#30363d',
                 boxShadow: (node.status === 'running' && isPaused) ? '0 0 20px rgba(227,179,65,0.4), inset 0 0 10px rgba(227,179,65,0.2)' : node.status === 'running' ? '0 0 20px rgba(88,166,255,0.4), inset 0 0 10px rgba(88,166,255,0.2)' : node.status === 'failed' ? '0 0 20px rgba(248,81,73,0.4), inset 0 0 10px rgba(248,81,73,0.1)' : node.status === 'completed' ? '0 0 10px rgba(46,160,67,0.2)' : '0 4px 12px rgba(0,0,0,0.5)'
               }}
               onMouseDown={(e) => handleMouseDown(node.id, e)}
               onMouseUp={(e) => completeConnection(node.id, e)}
             >
               {/* Output Port */}
               <div 
                  className="absolute -right-2 top-[70px] -translate-y-1/2 w-4 h-4 bg-[#0d1117] border border-[#30363d] rounded-full cursor-crosshair z-20 hover:bg-[#58a6ff] transition-colors"
                  onMouseDown={(e) => startConnection(node.id, e)}
                  title="Drag to connect"
               />
               
               {/* Input Port (invisible drop target logic is handled by onMouseUp on the whole card) */}
               <div className={`absolute -left-2 top-[70px] -translate-y-1/2 w-4 h-4 bg-[#0d1117] border border-[#30363d] rounded-full pointer-events-none z-20 ${drawingConnection ? 'bg-[#30363d] animate-pulse' : ''}`} />

               {/* Animated Pulse Overlay when Running */}
               {node.status === 'running' && !isPaused && (
                 <div className="absolute inset-0 pointer-events-none rounded-lg ring-2 ring-[#58a6ff] animate-ping opacity-20" />
               )}
               {node.status === 'running' && isPaused && (
                 <div className="absolute inset-0 pointer-events-none rounded-lg ring-2 ring-[#e3b341] animate-pulse opacity-40 bg-[#e3b341]/10" />
               )}
               {node.status === 'failed' && (
                 <div className="absolute inset-0 pointer-events-none rounded-lg ring-2 ring-[#f85149] animate-pulse opacity-30" />
               )}

               {/* Node Header */}
               <div className="px-3 py-2.5 flex items-center gap-2 cursor-move relative z-10" style={{ backgroundColor: `${node.color}15`, borderBottom: `1px solid ${node.color}30` }}>
                  <div style={{ color: node.color }}>{node.icon}</div>
                  <span className="text-[11px] font-bold truncate flex-1" style={{ color: node.color }}>{node.title}</span>
                  
                  {/* Real-time Visual Badge Component with Tooltip */}
                  <div className="relative group">
                    <div className={`cursor-help flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-colors
                        ${node.status === 'completed' ? 'bg-[#2ea043]/20 text-[#3fb950] border-[#2ea043]' :
                          node.status === 'running' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border-[#58a6ff] animate-pulse shadow-[0_0_12px_rgba(88,166,255,0.8)]' :
                          node.status === 'waiting' ? 'bg-[#e3b341]/20 text-[#e3b341] border-[#e3b341] animate-pulse' :
                          node.status === 'failed' ? 'bg-[#f85149]/20 text-[#f85149] border-[#f85149] shadow-[0_0_12px_rgba(248,81,73,0.8)]' :
                          'bg-[#30363d] text-[#8b949e] border-[#30363d]'}`}
                    >
                       {node.status === 'running' && <div className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] animate-ping"/>}
                       {node.status === 'completed' && <CheckCircle size={10} className="text-[#3fb950]" />}
                       {node.status === 'failed' && <AlertCircle size={10} className="text-[#f85149]" />}
                       {node.status === 'waiting' && <Clock size={10} className="text-[#e3b341]" />}
                       {node.status === 'idle' && <Clock size={10} />}
                       <span>{node.status === 'idle' ? 'Pending' : node.status}</span>
                    </div>

                    {/* Status Summary Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 flex flex-col gap-1.5">
                       <span className="text-[10px] font-bold text-[#c9d1d9] border-b border-[#30363d] pb-1 flex items-center justify-between">
                         Status Summary
                         {node.status === 'completed' ? <CheckCircle size={10} className="text-[#3fb950]" /> : 
                          node.status === 'running' ? <Settings size={10} className="text-[#58a6ff] animate-spin" /> : 
                          node.status === 'waiting' ? <Clock size={10} className="text-[#e3b341] animate-bounce" /> :
                          node.status === 'failed' ? <AlertCircle size={10} className="text-[#f85149]" /> : 
                          <Clock size={10} className="text-[#8b949e]" />}
                       </span>
                       <div className="flex flex-col text-[9px] font-mono text-[#8b949e]">
                         <span>State: <span className={node.status === 'running' ? 'text-[#58a6ff]' : node.status === 'waiting' ? 'text-[#e3b341]' : node.status === 'completed' ? 'text-[#3fb950]' : node.status === 'failed' ? 'text-[#f85149]' : 'text-[#8b949e]'}>{node.status.toUpperCase()}</span></span>
                         {node.status !== 'idle' && (
                           <>
                             <span>CPU Load: {node.status === 'completed' ? '0%' : `${Math.floor(Math.random() * 60) + 10}%`}</span>
                             <span>VRAM: {node.memoryUsage || '0MB'} Allocated</span>
                             <span>Network: Rx 0b / Tx 0b</span>
                           </>
                         )}
                         {node.status === 'idle' && <span>Waiting for upstream dependencies...</span>}
                       </div>
                    </div>
                  </div>
               </div>
               
               {/* Progress Bar (Dynamic) */}
               <div className="h-1 w-full bg-[#161b22]">
                  <div 
                    className="h-full transition-all duration-100 ease-linear shadow-[0_0_8px_currentColor]" 
                    style={{ 
                       width: `${node.progress || 0}%`, 
                       backgroundColor: node.status === 'failed' ? '#f85149' : node.status === 'completed' ? '#3fb950' : '#58a6ff' 
                    }} 
                  />
               </div>

               {/* Node Body - Massive Details Layout */}
               <div className="p-3 flex flex-col gap-2.5">
                  {/* Agent Target Banner */}
                  <div className="flex items-center justify-between border border-[#30363d] bg-[#161b22] rounded px-2 py-1.5 shadow-inner">
                     <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#0d1117] border border-[#30363d] rounded-full flex items-center justify-center">
                           <Target size={10} className="text-[#e3b341]" />
                        </div>
                        <span className="text-[10px] text-[#c9d1d9] font-bold tracking-wide">{node.agent}</span>
                     </div>
                     <span className="text-[9px] text-[#8b949e] font-mono opacity-70">{node.id}</span>
                  </div>

                  {/* Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                     <div className="flex flex-col border border-[#30363d] rounded p-1.5 bg-[#0d1117]">
                        <span className="text-[#8b949e] uppercase mb-0.5 tracking-wider">Exec Time</span>
                        <span className={`font-bold ${(node.elapsedMs || 0) > 2000 ? 'text-[#e3b341]' : 'text-[#3fb950]'}`}>
                           {node.elapsedMs ? `${node.elapsedMs}ms` : '0ms'}
                        </span>
                     </div>
                     <div className="flex flex-col border border-[#30363d] rounded p-1.5 bg-[#0d1117]">
                        <span className="text-[#8b949e] uppercase mb-0.5 tracking-wider">Memory Peak</span>
                        <span className="font-bold text-[#bc8cff]">{node.memoryUsage || '0MB'}</span>
                     </div>
                  </div>

                  {/* Embedded Console Log Window */}
                  <div className={`border rounded p-1.5 flex items-start gap-1.5 h-14 overflow-hidden transition-colors ${node.status === 'running' ? 'border-[#58a6ff]/40 bg-[#040506]' : 'border-[#30363d] bg-[#040506]'}`}>
                     <TerminalSquare size={10} className={`${node.status === 'running' ? 'text-[#58a6ff]' : 'text-[#8b949e]'} mt-0.5 shrink-0`} />
                     <span className={`text-[9px] font-mono leading-tight ${node.status === 'failed' ? 'text-[#f85149]' : 'text-[#c9d1d9]'} opacity-80 break-words line-clamp-3`}>
                        {node.lastLog || 'Awaiting execution...'}
                        {node.status === 'running' && <span className="animate-pulse font-bold text-[#58a6ff]">_</span>}
                     </span>
                  </div>

                  {/* Web Launch Button */}
                  {(node.type?.startsWith('ai_') || node.type === 'web_search' || ['design', 'code', 'model', 'rig', 'texture', 'voice'].includes(node.type || '')) && (
                     <button
                        className="w-full py-1.5 mt-1 rounded border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-[10px] font-bold tracking-wide transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        onClick={(e) => {
                           e.stopPropagation();
                           let url = 'https://chatgpt.com/'; // Default fallback for offline AIs
                           switch(node.type) {
                               case 'ai_deepseek': url = 'https://chat.deepseek.com/'; break;
                               case 'ai_chatgpt': url = 'https://chatgpt.com/'; break;
                               case 'ai_gemini': url = 'https://gemini.google.com/app'; break;
                               case 'ai_claude': url = 'https://claude.ai/new'; break;
                               case 'ai_kimi': url = 'https://kimi.moonshot.cn/'; break;
                               case 'ai_grok': url = 'https://grok.com/'; break;
                               case 'ai_meta': url = 'https://www.meta.ai/'; break;
                               case 'ai_copilot': url = 'https://copilot.microsoft.com/'; break;
                               case 'ai_perplexity': url = 'https://www.perplexity.ai/'; break;
                               case 'ai_hugging': url = 'https://huggingface.co/chat/'; break;
                               case 'ai_mistral': url = 'https://chat.mistral.ai/'; break;
                               case 'ai_poe': url = 'https://poe.com/'; break;
                               case 'web_search': url = 'https://duckduckgo.com/'; break;
                           }
                           
                           // If notes exist, use the first note as prompt
                           const promptText = node.notes && node.notes.length > 0 ? node.notes[0].text : '';
                           if (promptText) {
                               if (node.type === 'web_search' || url.includes('chatgpt.com')) {
                                   url += `?q=${encodeURIComponent(promptText)}`;
                               } else {
                                   navigator.clipboard.writeText(promptText);
                                   alert('Prompt copied to clipboard! Paste it in the chat.');
                               }
                           }
                           
                           window.open(url, '_blank');
                        }}
                     >
                        <Globe size={11} className="mt-[-1px] text-[#58a6ff]" /> {node.type?.startsWith('ai_') || node.type === 'web_search' ? 'Open Web Interface' : 'Web Learning Fallback'}
                     </button>
                  )}

                  {/* Scheduling & Timers Section */}
                  <div className="flex flex-col mt-1 border-t border-[#30363d] pt-2">
                     <div 
                        className="flex items-center justify-between cursor-pointer hover:bg-[#161b22] px-1 py-0.5 rounded transition-colors group"
                        onClick={(e) => {
                           e.stopPropagation();
                           setExpandedScheduleNodeId(expandedScheduleNodeId === node.id ? null : node.id);
                        }}
                     >
                        <span className="text-[9px] font-bold text-[#bc8cff] uppercase tracking-wider flex items-center gap-1">
                           <Clock size={10}/> 
                           {node.scheduleMode === 'delay' ? `Delay: ${node.scheduleValue}ms` : node.scheduleMode === 'cron' ? `Cron: ${node.scheduleValue}` : 'Schedule (Immediate)'}
                        </span>
                        <Settings2 size={10} className="text-[#8b949e] group-hover:text-[#c9d1d9]" />
                     </div>
                     
                     {expandedScheduleNodeId === node.id && (
                        <div className="flex flex-col gap-2 mt-2 p-2 bg-[#040506] border border-[#30363d] rounded cursor-default" onClick={e => e.stopPropagation()}>
                           <div className="flex items-center gap-2">
                              <select 
                                 className="bg-[#161b22] text-[#c9d1d9] text-[10px] border border-[#30363d] rounded px-1.5 py-1 outline-none focus:border-[#58a6ff] w-1/2"
                                 value={node.scheduleMode || 'immediate'}
                                 onChange={(e) => updateNodeSchedule(node.id, e.target.value as any, node.scheduleValue || '')}
                              >
                                 <option value="immediate">Immediate</option>
                                 <option value="delay">Delay (ms)</option>
                                 <option value="cron">Cron Pattern</option>
                              </select>
                              
                              <input 
                                 type="text" 
                                 className="bg-[#161b22] text-[#c9d1d9] text-[10px] font-mono border border-[#30363d] rounded px-2 py-1 outline-none focus:border-[#58a6ff] w-1/2 placeholder:text-[#8b949e]"
                                 placeholder={node.scheduleMode === 'delay' ? "e.g. 5000" : node.scheduleMode === 'cron' ? "*/5 * * * *" : "N/A"}
                                 value={node.scheduleValue || ''}
                                 disabled={node.scheduleMode === 'immediate' || !node.scheduleMode}
                                 onChange={(e) => updateNodeSchedule(node.id, node.scheduleMode || 'immediate', e.target.value)}
                              />
                           </div>
                           <span className="text-[8px] text-[#8b949e] italic leading-tight">
                              {node.scheduleMode === 'delay' ? 'Wait this long in milliseconds before executing.' : node.scheduleMode === 'cron' ? 'Execute node recurringly on standard cron pattern.' : 'Execute continuously as fast as possible when dependencies are met.'}
                           </span>
                        </div>
                     )}
                  </div>

                  {/* AI Notes Section for Node */}
                  <div className="flex flex-col gap-1.5 mt-1 border-t border-[#30363d] pt-2">
                     <div className="flex items-center justify-between">
                         <span className="text-[9px] font-bold text-[#e3b341] uppercase tracking-wider flex items-center gap-1">
                            <MessageSquareWarning size={10}/> Node Notes ({node.notes ? node.notes.length : 0})
                         </span>
                         <button 
                            className="text-[#8b949e] hover:text-[#58a6ff] transition-colors"
                            onClick={(e) => {
                               e.stopPropagation();
                               const newNote: AINote = { id: `n_${Date.now()}`, text: '', isResolved: false };
                               setNodes(nodes.map(n => n.id === node.id ? { ...n, notes: [...(n.notes || []), newNote] } : n));
                            }}
                         >
                            <Plus size={10} />
                         </button>
                     </div>
                     {node.notes && node.notes.length > 0 && (
                        <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                           {node.notes.map(note => (
                              <div key={note.id} className={`flex flex-col gap-1 p-1.5 rounded border transition-colors ${note.isResolved ? 'bg-[#161b22] border-[#2ea043]/30' : 'bg-[#161b22] border-[#30363d]'}`}>
                                 <div className="flex items-start gap-1.5">
                                    <button onClick={(e) => {
                                       e.stopPropagation();
                                       setNodes(nodes.map(n => n.id === node.id ? { ...n, notes: n.notes.map(nn => nn.id === note.id ? { ...nn, isResolved: !nn.isResolved } : nn) } : n));
                                    }}>
                                       {note.isResolved ? <CheckCircle size={10} className="text-[#3fb950] mt-0.5" /> : <div className="w-2.5 h-2.5 rounded-full border border-[#8b949e] mt-0.5 hover:border-[#3fb950] transition-colors" />}
                                    </button>
                                    <textarea 
                                       className={`flex-1 bg-transparent border-none text-[9px] outline-none resize-none overflow-hidden min-h-[14px] ${note.isResolved ? 'text-[#8b949e] line-through' : 'text-[#c9d1d9]'}`}
                                       value={note.text}
                                       placeholder="Task note..."
                                       onChange={(e) => {
                                          setNodes(nodes.map(n => n.id === node.id ? { ...n, notes: n.notes.map(nn => nn.id === note.id ? { ...nn, text: e.target.value } : nn) } : n));
                                       }}
                                       onMouseDown={e => e.stopPropagation()}
                                       rows={Math.max(1, note.text.split('\n').length)}
                                    />
                                    <button className="text-[#8b949e] hover:text-[#f85149] transition-colors" onClick={(e) => {
                                       e.stopPropagation();
                                       setNodes(nodes.map(n => n.id === node.id ? { ...n, notes: n.notes.filter(nn => nn.id !== note.id) } : n));
                                    }}>
                                       <Trash2 size={10} />
                                    </button>
                                 </div>
                                 {note.isResolved && (
                                   <textarea
                                     className="w-full bg-[#0d1117] border border-[#2ea043]/20 text-[9px] text-[#2ea043] rounded p-1 outline-none resize-none min-h-[20px] font-mono mt-0.5"
                                     value={note.resolutionText || ''}
                                     placeholder="Resolution log..."
                                     onChange={(e) => {
                                        setNodes(nodes.map(n => n.id === node.id ? { ...n, notes: n.notes.map(nn => nn.id === note.id ? { ...nn, resolutionText: e.target.value } : nn) } : n));
                                     }}
                                      onMouseDown={e => e.stopPropagation()}
                                   />
                                 )}
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </div>
             </div>
           )})}

           {/* Context Menu */}
           {menuPos && (
             <div 
               className="absolute z-50 bg-[#161b22] border border-[#30363d] rounded-md shadow-2xl py-1 w-56 text-xs text-[#c9d1d9]"
               style={{ left: menuPos.x, top: menuPos.y }}
             >
                {selectedNodes.length > 1 && (
                  <>
                     <div className="px-3 py-1 text-[10px] font-bold uppercase text-[#8b949e] border-b border-[#30363d] mb-1">Group Actions</div>
                     <button className="w-full text-left px-3 py-1.5 hover:bg-[#21262d] transition-colors flex items-center gap-2 text-[#e3b341]" onClick={groupSelectedNodes}>
                        <Network size={12} className="text-[#e3b341]"/> Group {selectedNodes.length} Selected Nodes
                     </button>
                     <div className="my-1 border-b border-[#30363d]" />
                  </>
                )}
                
                <div className="px-3 py-1 text-[10px] font-bold uppercase text-[#8b949e] border-b border-[#30363d] mb-1">Add Workflow Task</div>
                <button className="w-full text-left px-3 py-1.5 hover:bg-[#21262d] transition-colors flex items-center gap-2" onClick={() => addNode('design', 'Design Prompt', 'LoreMaster', '#f85149', <FileText size={12}/>)}>
                   <FileText size={12} className="text-[#f85149]"/> Design Prompt
                </button>
                <button className="w-full text-left px-3 py-1.5 hover:bg-[#21262d] transition-colors flex items-center gap-2" onClick={() => addNode('code', 'Code Generation', 'CodeGenius', '#58a6ff', <Database size={12}/>)}>
                   <Database size={12} className="text-[#58a6ff]"/> Code Generation
                </button>
                <button className="w-full text-left px-3 py-1.5 hover:bg-[#21262d] transition-colors flex items-center gap-2" onClick={() => addNode('model', '3D Asset Blockout', 'MeshWeaver-AI', '#3fb950', <Box size={12}/>)}>
                   <Box size={12} className="text-[#3fb950]"/> 3D Asset Blockout
                </button>
                <button className="w-full text-left px-3 py-1.5 hover:bg-[#21262d] transition-colors flex items-center gap-2" onClick={() => addNode('texture', 'Texture Baking', 'Materializer', '#bc8cff', <Flame size={12}/>)}>
                   <Flame size={12} className="text-[#bc8cff]"/> Texture Baking
                </button>
             </div>
           )}
        </div>

        {/* Execution Log Right Panel */}
        <div className="w-80 border-l border-[#30363d] bg-[#0d1117] flex flex-col shrink-0">
           <div className="h-10 border-b border-[#30363d] flex items-center px-4 bg-[#161b22]">
              <span className="text-xs font-bold text-[#c9d1d9] flex items-center gap-2"><TerminalSquare size={14} className="text-[#e3b341]" /> Execution Log</span>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-mono text-[10px]">
              {logs.length === 0 && !isExecuting && (
                 <div className="text-[#8b949e] flex flex-col items-center justify-center h-full text-center px-4 gap-2">
                    <History size={24} className="opacity-50" />
                    <p>No execution history.</p>
                    <p className="text-[9px]">Click "Execute Pipeline" to run the DAG.</p>
                 </div>
              )}
              
              {logs.map(log => (
                 <div key={log.id} className="flex flex-col border border-[#30363d] rounded bg-[#161b22] px-2 py-2">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-[#8b949e] flex items-center gap-1.5"><Clock size={10} /> {log.timestamp}</span>
                       <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold
                          ${log.status === 'started' ? 'bg-[#58a6ff]/20 text-[#58a6ff]' :
                            log.status === 'success' ? 'bg-[#3fb950]/20 text-[#3fb950]' :
                            'bg-[#f85149]/20 text-[#f85149]'}`}
                       >
                          {log.status === 'started' ? <span className="flex items-center gap-1"><PlayCircle size={10}/> RUNNING</span> : 
                           log.status === 'success' ? <span className="flex items-center gap-1"><CheckCircle2 size={10}/> SUCCESS</span> : 
                           <span className="flex items-center gap-1"><AlertCircle size={10}/> FAILED</span>}
                       </span>
                    </div>
                    <div className="text-[#c9d1d9] font-sans font-bold text-xs truncate mb-1">{log.taskTitle}</div>
                    <div className="flex justify-between text-[#8b949e]">
                       <span className="truncate max-w-[120px]">@{log.agent}</span>
                       {log.elapsedTimeMs !== undefined && (
                          <span className="text-[#e3b341]">{log.elapsedTimeMs.toLocaleString()}ms</span>
                       )}
                    </div>
                 </div>
              ))}
              
              {isExecuting && (
                 <div className="flex items-center justify-center py-2 text-[#58a6ff] gap-2 animate-pulse">
                    <Settings size={12} className="animate-spin" /> <span>Executing pipeline tasks...</span>
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
