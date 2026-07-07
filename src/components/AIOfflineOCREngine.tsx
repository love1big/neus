import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Image as ImageIcon, CheckCircle, AlertTriangle, Loader2, Globe, Copy, RefreshCw } from 'lucide-react';
import Tesseract from 'tesseract.js';

export default function AIOfflineOCREngine() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ status: string; progress: number }>({ status: 'idle', progress: 0 });
  const [language, setLanguage] = useState('eng+tha');
  const [confidence, setConfidence] = useState<number | null>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      loadImage(file);
    }
  };

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedImage(event.target.result);
        setExtractedText('');
        setConfidence(null);
        setProgress({ status: 'ready', progress: 0 });
      }
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    setExtractedText('');
    setConfidence(null);
    
    try {
      const result = await Tesseract.recognize(
        selectedImage,
        language,
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress({ status: 'Recognizing...', progress: Math.round(m.progress * 100) });
            } else {
              setProgress({ status: m.status, progress: Math.round(m.progress * 100) || 0 });
            }
          }
        }
      );
      
      setExtractedText(result.data.text);
      setConfidence(result.data.confidence);
      setProgress({ status: 'Completed', progress: 100 });
    } catch (err) {
      console.error(err);
      setProgress({ status: 'Error', progress: 0 });
      setExtractedText('An error occurred during text extraction. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-slate-200 font-sans">
      <div className="flex items-center p-4 border-b border-slate-800 bg-[#141525]">
        <FileText className="w-5 h-5 text-emerald-400 mr-2" />
        <h2 className="text-lg font-semibold text-white">Universal Offline AI OCR</h2>
        <span className="ml-4 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs">
          High Precision Neural Engine
        </span>
      </div>

      <div className="flex-1 p-6 overflow-y-auto flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="bg-[#1a1b2e] rounded-lg p-4 border border-slate-700 shadow-md">
            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Source Image
            </h3>
            
            <div 
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-slate-600 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 hover:bg-[#20223a] transition-colors relative min-h-[250px] overflow-hidden"
              onClick={() => document.getElementById('ocr-upload')?.click()}
            >
              {selectedImage ? (
                <img src={selectedImage} alt="Source" className="max-h-64 object-contain z-10 rounded shadow" />
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 text-slate-500 mb-3" />
                  <p className="text-sm text-slate-300 mb-1">Click or drag image to upload</p>
                  <p className="text-xs text-slate-500">Supports PNG, JPG, BMP</p>
                </>
              )}
              
              <input 
                id="ocr-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="bg-[#1a1b2e] rounded-lg p-4 border border-slate-700 shadow-md">
            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Language Configuration (All Supported)
            </h3>
            <div className="space-y-4">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-[#0a0a0f] border border-slate-700 rounded p-2 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="eng+tha">English + Thai (Auto-detect)</option>
                <option value="eng">English</option>
                <option value="tha">Thai (ภาษาไทย)</option>
                <option value="jpn">Japanese (日本語)</option>
                <option value="chi_sim">Chinese Simplified (简体中文)</option>
                <option value="chi_tra">Chinese Traditional (繁體中文)</option>
                <option value="kor">Korean (한국어)</option>
                <option value="rus">Russian (Русский)</option>
                <option value="deu">German (Deutsch)</option>
                <option value="fra">French (Français)</option>
                <option value="spa">Spanish (Español)</option>
              </select>
              
              <button 
                onClick={processImage}
                disabled={!selectedImage || isProcessing}
                className={`w-full py-2.5 rounded text-sm font-medium transition-colors flex items-center justify-center ${
                  !selectedImage 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : isProcessing 
                      ? 'bg-emerald-600/50 text-white cursor-wait' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Neural Extracting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Extract Text Offline (100% Privacy)
                  </>
                )}
              </button>
              
              {isProcessing && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span className="capitalize">{progress.status}</span>
                    <span>{progress.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col">
          <div className="bg-[#1a1b2e] rounded-lg border border-slate-700 shadow-md flex flex-col h-full overflow-hidden">
            <div className="p-3 border-b border-slate-700 flex justify-between items-center bg-[#141525]">
              <h3 className="text-sm font-medium text-slate-300 flex items-center">
                <FileText className="w-4 h-4 mr-2" /> 
                Extracted Data
              </h3>
              <div className="flex items-center space-x-3">
                {confidence !== null && (
                  <span className={`text-xs flex items-center ${confidence > 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Confidence: {confidence.toFixed(1)}%
                  </span>
                )}
                <button 
                  onClick={copyToClipboard}
                  disabled={!extractedText}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded transition-colors text-slate-300"
                  title="Copy to Clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 relative">
              {extractedText ? (
                <textarea 
                  className="w-full h-full bg-transparent text-slate-200 resize-none outline-none leading-relaxed"
                  value={extractedText}
                  readOnly
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                  <FileText className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm">Processed text will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
