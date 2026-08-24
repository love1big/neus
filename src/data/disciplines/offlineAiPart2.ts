import { MegaToolItem } from '../megaToolsDatabase300';

export const OFFLINE_AI_PART2_TOOLS: MegaToolItem[] = [
  // ==========================================
  // DISCIPLINE 11: Offline Neural Audio, TTS, STT & Acoustic AI (25 Tools)
  // ==========================================
  {
    id: 'd11_whisper_offline_stt',
    disciplineId: 'd11_offline_audio_ai',
    disciplineName: 'Offline Neural Audio, TTS, STT & Acoustic AI',
    name: 'Whisper Tiny/Base Quantized Offline STT',
    tag: 'Audio AI / Speech-to-Text',
    category: 'offline_ai',
    complexity: 'O(AudioLength * TransformerLayers)',
    memoryFootprint: '39 MB (Q5_1 Quantized Weights)',
    desc: 'แปลงเสียงพูดเป็นข้อความหลายภาษา (ไทย, อังกฤษ, ญี่ปุ่น, จีน ฯลฯ) พร้อม Timestamp ทุกคำ ออฟไลน์ 100% ในเครื่อง',
    formulaOrArchitecture: '80-channel Log-Mel Spectrogram -> 2D Conv Audio Encoder -> Autoregressive Text Decoder with Cross-Attention',
    inputs: ['Raw Audio Buffer: 16,000 Hz Mono Float32 (10 seconds speech)', 'Language: Multi-language auto-detect'],
    output: 'Transcription: "เปิดประตูห้องแล็บและเตรียมระบบเกราะป้องกัน" (Confidence: 98.4%) | RTF: 0.12x (8x faster than real-time)',
    codeSnippet: {
      lang: 'typescript',
      code: `async function transcribeOffline(audioBuffer: Float32Array): Promise<string> {\n    const melSpec = computeLogMelSpectrogram(audioBuffer, 80);\n    const tokens = await whisperEngine.decode(melSpec);\n    return whisperTokenizer.decode(tokens);\n}`
    },
    liveMetrics: { computeTimeMs: 120.0, throughput: '8.3x Real-time', efficiency: '98.7%' }
  },
  {
    id: 'd11_piper_neural_tts',
    disciplineId: 'd11_offline_audio_ai',
    disciplineName: 'Offline Neural Audio, TTS, STT & Acoustic AI',
    name: 'Piper VITS Neural Fast Voice Synthesizer',
    tag: 'Voice AI / Text-to-Speech',
    category: 'offline_ai',
    complexity: 'O(Text Length) VITS Architecture',
    memoryFootprint: '25 MB Onnx Runtime Voice Model',
    desc: 'สังเคราะห์เสียงพูดตัวละครเกม สมจริง มีอารมณ์สูง รันบนอุปกรณ์ฝังตัวหรือเว็บเบราว์เซอร์ได้ทันทีโดยไม่ต้องพึ่ง Cloud API',
    formulaOrArchitecture: 'Phoneme Grapheme-to-Phoneme -> Transformer Duration Predictor -> HiFi-GAN Neural Vocoder Waveform Generator',
    inputs: ['Text: "ระวังด้วย! มีศัตรูกำลังลอบเข้ามาทางด้านหลัง"', 'Speaker ID: #4 (Cyber Assassin, Pitch: -2st, Speed: 1.1x)'],
    output: 'Generated 24 kHz 16-bit Studio Audio: Duration 2.4s | Synthesis Time: 45ms (53x Real-time)',
    codeSnippet: {
      lang: 'typescript',
      code: `async function synthesizeVoice(text: string, voiceId: number): Promise<AudioBuffer> {\n    const phonemes = phonemize(text);\n    const audioSamples = await piperTTSModel.infer(phonemes, { speaker_id: voiceId });\n    return createAudioBufferFromFloat32(audioSamples);\n}`
    },
    liveMetrics: { computeTimeMs: 45.0, throughput: '53x Real-time', efficiency: '99.5%' }
  },
  {
    id: 'd11_viseme_lip_aligner',
    disciplineId: 'd11_offline_audio_ai',
    disciplineName: 'Offline Neural Audio, TTS, STT & Acoustic AI',
    name: 'Neural Acoustic-to-Viseme Lip Sync Aligner',
    tag: 'Animation AI / Lip Sync',
    category: 'offline_ai',
    complexity: 'O(Audio Frames)',
    memoryFootprint: '8 MB TCN Model',
    desc: 'สกัดค่า BlendShape รูปปาก 16 Visemes (เช่น AA, EE, OH, PP, FF, TH) จากเสียงพูดโดยอัตโนมัติ เพื่อขยับปากตัวละคร 3D',
    formulaOrArchitecture: 'Temporal Convolutional Network (TCN) predicting 16 FACS Facial BlendShape weights per 16ms audio window',
    inputs: ['Voice Track: "System online, initializing warp drive."', 'Frame Rate: 60 FPS BlendShape Curves'],
    output: 'Synchronized Animation Curves for Maya/Blender/Unreal 3D Rig | Lip Error: < 2.5%',
    codeSnippet: {
      lang: 'typescript',
      code: `function computeLipSyncCurves(audioBuffer: AudioBuffer): BlendShapeTrack[] {\n    const melFrames = extractMelWindows(audioBuffer, 16);\n    return visemeNet.predict(melFrames);\n}`
    },
    liveMetrics: { computeTimeMs: 18.0, throughput: '150 FPS Sync', efficiency: '99.2%' }
  },

  // ==========================================
  // DISCIPLINE 12: Vector RAG, Semantic Embeddings & Indexing (25 Tools)
  // ==========================================
  {
    id: 'd12_hnsw_vector_index',
    disciplineId: 'd12_rag_vector_embed',
    disciplineName: 'Vector RAG, Semantic Embeddings & Indexing',
    name: 'HNSW Hierarchical Navigable Small World Vector Index',
    tag: 'Vector Search / RAG',
    category: 'offline_ai',
    complexity: 'O(log N) Multi-layer Graph Traversal',
    memoryFootprint: '384 Floats (1.5 KB) per vector embedding',
    desc: 'ดัชนีกราฟค้นหาความคล้ายคลึงของเวกเตอร์ (Vector Search) ค้นหาข้อมูลที่ตรงใจที่สุดจาก 1,000,000 เอกสารในเวลาเพียง 0.8ms',
    formulaOrArchitecture: 'CosineSim(u, v) = (u . v) / (||u|| * ||v||); Layered Skip-list Proximity Graph with M=16, efConstruction=64',
    inputs: ['Query Embedding: 384-dimensional Vector', 'Database Size: 100,000 Knowledge Chunks', 'Top-K: 5'],
    output: 'Top 5 Semantic Matches Retrieved in 0.42ms | Recall@10: 99.4%',
    codeSnippet: {
      lang: 'cpp',
      code: `std::vector<SearchResult> HNSWIndex::searchKnn(const float* queryVector, int k, int efSearch) {\n    // Multi-layer greedy graph walk towards nearest neighbors\n    return results;\n}`
    },
    liveMetrics: { computeTimeMs: 0.42, throughput: '2,380 queries/sec', efficiency: '99.8%' }
  },
  {
    id: 'd12_all_minilm_embedder',
    disciplineId: 'd12_rag_vector_embed',
    disciplineName: 'Vector RAG, Semantic Embeddings & Indexing',
    name: 'All-MiniLM-L6-v2 On-Device Quantized Embedder',
    tag: 'NLP / Embeddings',
    category: 'offline_ai',
    complexity: 'O(SeqLen * ModelDim)',
    memoryFootprint: '22 MB Quantized ONNX Model',
    desc: 'แปลงประโยคและเนื้อหาเป็นเวกเตอร์ความหมาย 384 มิติ (Semantic Vector) ออฟไลน์ เพื่อค้นหาความรู้ ระบบถาม-ตอบ และ Lore ภายในเกม',
    formulaOrArchitecture: 'MiniLM 6-layer Transformer with Mean-Pooling across token embeddings and L2-Normalization',
    inputs: ['Text: "ประวัติศาสตร์การสร้างหอคอยเวทมนตร์โบราณแห่งอาณาจักรเอลฟ์"', 'Max Tokens: 256'],
    output: '384-dimensional Dense Vector: [-0.042, 0.128, 0.841, ...] (Normalized Length = 1.000)',
    codeSnippet: {
      lang: 'typescript',
      code: `async function generateEmbedding(text: string): Promise<Float32Array> {\n    const tokens = tokenizer.encode(text);\n    const { last_hidden_state } = await embeddingSession.run({ input_ids: tokens });\n    return meanPoolingAndNormalize(last_hidden_state);\n}`
    },
    liveMetrics: { computeTimeMs: 6.50, throughput: '153 sentences/sec', efficiency: '99.1%' }
  },
  {
    id: 'd12_bm25_lexical_ranker',
    disciplineId: 'd12_rag_vector_embed',
    disciplineName: 'Vector RAG, Semantic Embeddings & Indexing',
    name: 'Okapi BM25 Lexical Keyword Ranker Engine',
    tag: 'Search / Information Retrieval',
    category: 'offline_ai',
    complexity: 'O(QueryTerms * InvertedListLength)',
    memoryFootprint: 'Sparse Inverted Index (~8% of raw corpus)',
    desc: 'ระบบสืบค้นข้อมูลแบบคำต่อคำ (Keyword Search) ประสิทธิภาพสูง ผสานกับ Vector Search เพื่อทำ Hybrid Search ที่แม่นยำ 100%',
    formulaOrArchitecture: 'BM25 = sum( IDF(q_i) * (f(q_i, D)*(k1+1)) / (f(q_i, D) + k1*(1 - b + b*(|D|/avgdl))) )',
    inputs: ['Query: "คาถาไฟ บอสแมงมุม ชั้นที่ 4"', 'k1: 1.2 | b: 0.75 | Corpus: 50,000 Quests and Items'],
    output: 'Rank #1: [Item #1049: สมุดเวทเพลิงสุริยัน สำหรับดันเจี้ยนแมงมุม] Score: 18.42',
    codeSnippet: {
      lang: 'cpp',
      code: `float compute_bm25_score(const Document& doc, const std::vector<Term>& queryTerms, const CorpusStats& stats) {\n    // Calculate Okapi BM25 term weighting score\n    return totalScore;\n}`
    },
    liveMetrics: { computeTimeMs: 0.08, throughput: '12,500 queries/sec', efficiency: '99.9%' }
  }
];
