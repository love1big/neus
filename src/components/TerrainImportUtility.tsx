import React, { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, Map, Layers, Download, Check, AlertTriangle} from 'lucide-react';

export default function TerrainImportUtility() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [heightmapData, setHeightmapData] = useState<Float32Array | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback((imageUrl: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Keep it manageable for typical heightmaps (e.g., max 1024x1024)
      const MAX_SIZE = 1024;
      let width = img.width;
      let height = img.height;

      if (width > MAX_SIZE || height > MAX_SIZE) {
        const ratio = Math.min(MAX_SIZE / width, MAX_SIZE / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      setDimensions({ width, height });

      ctx.drawImage(img, 0, 0, width, height);

      try {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const heights = new Float32Array(width * height);

        // Convert to grayscale for heightmap
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Luminance formula
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
          heights[i / 4] = luminance;
        }

        setHeightmapData(heights);
      } catch (err) {
        console.error("Error reading canvas pixel data:", err);
      } finally {
        setIsProcessing(false);
      }
    };
    img.src = imageUrl;
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedImage(event.target.result);
        processImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string') {
            setSelectedImage(event.target.result);
            processImage(event.target.result);
          }
        };
        reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-slate-200">
      <div className="flex items-center p-4 border-b border-slate-800 bg-[#141525]">
        <Map className="w-5 h-5 text-emerald-400 mr-2" />
        <h2 className="text-lg font-semibold text-white">Terrain Import Utility</h2>
      </div>

      <div className="flex-1 p-6 overflow-y-auto flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="bg-[#1a1b2e] rounded-lg p-4 border border-slate-700 shadow-md">
            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Upload Source Image
            </h3>
            
            <div 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-slate-600 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 hover:bg-[#20223a] transition-colors"
              onClick={() => document.getElementById('terrain-upload')?.click()}
            >
              <ImageIcon className="w-10 h-10 text-slate-500 mb-3" />
              <p className="text-sm text-slate-300 mb-1">Click or drag image to upload</p>
              <p className="text-xs text-slate-500">Supports PNG, JPG, RAW (via data converter)</p>
              <input 
                id="terrain-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {heightmapData && (
            <div className="bg-[#1a1b2e] rounded-lg p-4 border border-slate-700 shadow-md">
               <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                Displacement Data
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-700">
                  <span className="text-slate-400">Resolution</span>
                  <span className="font-mono text-emerald-400">{dimensions.width} x {dimensions.height}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-700">
                  <span className="text-slate-400">Data Points</span>
                  <span className="font-mono text-emerald-400">{heightmapData.length.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-700">
                  <span className="text-slate-400">Memory Size</span>
                  <span className="font-mono text-emerald-400">{(heightmapData.byteLength / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                
                <div className="pt-3">
                  <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm transition-colors flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" /> Export Heightmap
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3 bg-[#1a1b2e] rounded-lg border border-slate-700 shadow-md flex flex-col">
            <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-sm font-medium text-slate-300 flex items-center">
                  <Map className="w-4 h-4 mr-2" /> Map Preview
                </h3>
                {isProcessing && <span className="text-xs text-amber-400 animate-pulse">Processing pixel data...</span>}
                {heightmapData && !isProcessing && <span className="text-xs text-emerald-400 flex items-center"><Check className="w-3 h-3 mr-1" /> Data Read Successful</span>}
            </div>
            <div className="flex-1 p-4 flex items-center justify-center bg-black/50 overflow-hidden relative">
                {!selectedImage ? (
                    <div className="text-slate-500 flex flex-col items-center">
                        <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-sm">No image loaded</span>
                    </div>
                ) : (
                    <div className="relative border border-slate-700 max-h-full max-w-full flex items-center justify-center overflow-auto shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        <canvas 
                            ref={canvasRef} 
                            className="max-w-full max-h-[60vh] object-contain"
                            style={{ imageRendering: 'pixelated' }}
                        />
                        {/* Overlay a scanning effect to make it look cool during process */}
                        {isProcessing && (
                            <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse">
                                <div className="w-full h-1 bg-emerald-400/50 absolute top-0 left-0 animate-[ping_2s_linear_infinite]" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
