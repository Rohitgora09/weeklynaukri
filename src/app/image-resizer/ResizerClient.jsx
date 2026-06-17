'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  Image as ImageIcon,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';

export default function ResizerClient() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [preset, setPreset] = useState('ssc-photo');
  const [width, setWidth] = useState(350);
  const [height, setHeight] = useState(450);
  const [maxSizeKb, setMaxSizeKb] = useState(50);
  const [minSizeKb, setMinSizeKb] = useState(20);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizedDataUrl, setResizedDataUrl] = useState(null);
  const [resizedSizeKb, setResizedSizeKb] = useState(null);
  const [resizedWidth, setResizedWidth] = useState(null);
  const [resizedHeight, setResizedHeight] = useState(null);
  const [qualityUsed, setQualityUsed] = useState(0.8);
  const [statusText, setStatusText] = useState('');
  const [statusColor, setStatusColor] = useState('gray'); // gray, green, red

  // Embed copy code
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef(null);

  const presets = {
    'ssc-photo': { label: 'SSC Photo (3.5 x 4.5 cm)', w: 350, h: 450, maxKb: 50, minKb: 20 },
    'ssc-signature': { label: 'SSC Signature (4.0 x 2.0 cm)', w: 400, h: 200, maxKb: 20, minKb: 10 },
    'upsc-photo': { label: 'UPSC Photo (3.5 x 3.5 cm)', w: 350, h: 350, maxKb: 300, minKb: 20 },
    'custom': { label: 'Custom Dimensions', w: 300, h: 300, maxKb: 50, minKb: 10 }
  };

  useEffect(() => {
    if (preset !== 'custom') {
      const p = presets[preset];
      setWidth(p.w);
      setHeight(p.h);
      setMaxSizeKb(p.maxKb);
      setMinSizeKb(p.minKb);
    }
  }, [preset]);

  // Re-trigger resize when options change
  useEffect(() => {
    if (originalFile) {
      processImage();
    }
  }, [width, height, maxSizeKb, minSizeKb, originalFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      loadImage(file);
    }
  };

  const loadImage = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    
    const img = new Image();
    img.src = selectedImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = parseInt(width) || 300;
      canvas.height = parseInt(height) || 300;
      
      const ctx = canvas.getContext('2d');
      // Draw image filled
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Perform iterative quality adjustment to match target size
      let low = 0.01;
      let high = 0.99;
      let bestQuality = 0.8;
      let bestDataUrl = null;
      let bestSizeKb = 99999;
      
      // Binary search quality settings to hit target size (max 8 iterations)
      for (let i = 0; i < 8; i++) {
        const mid = (low + high) / 2;
        const dataUrl = canvas.toDataURL('image/jpeg', mid);
        const sizeBytes = Math.round((dataUrl.split(',')[1].length * 3) / 4);
        const sizeKb = sizeBytes / 1024;
        
        if (sizeKb <= maxSizeKb) {
          bestQuality = mid;
          bestDataUrl = dataUrl;
          bestSizeKb = sizeKb;
          // Try to get higher quality if possible
          low = mid;
        } else {
          // Exceeded limit, lower the quality bound
          high = mid;
        }
      }
      
      // Fallback if no quality is low enough (force quality 0.05)
      if (!bestDataUrl) {
        bestDataUrl = canvas.toDataURL('image/jpeg', 0.05);
        const sizeBytes = Math.round((bestDataUrl.split(',')[1].length * 3) / 4);
        bestSizeKb = sizeBytes / 1024;
        bestQuality = 0.05;
      }

      setResizedDataUrl(bestDataUrl);
      setResizedSizeKb(bestSizeKb);
      setResizedWidth(canvas.width);
      setResizedHeight(canvas.height);
      setQualityUsed(bestQuality);
      
      // Status text reporting
      if (bestSizeKb > maxSizeKb) {
        setStatusText(`Size is too large (${bestSizeKb.toFixed(1)} KB). Try reducing width/height.`);
        setStatusColor('red');
      } else if (bestSizeKb < minSizeKb) {
        setStatusText(`Perfect dimensions, but size is ${bestSizeKb.toFixed(1)} KB (Lower than standard ${minSizeKb}KB). Re-saved at maximum quality.`);
        setStatusColor('green');
      } else {
        setStatusText(`Success! File size is ${bestSizeKb.toFixed(1)} KB. Perfect for Sarkari applications.`);
        setStatusColor('green');
      }
      
      setIsProcessing(false);
    };
  };

  const handleDownload = () => {
    if (!resizedDataUrl) return;
    const link = document.createElement('a');
    
    // Create meaningful filename
    const presetName = preset === 'custom' ? 'resized' : preset;
    const originalName = originalFile ? originalFile.name.split('.')[0] : 'image';
    link.download = `${originalName}_${presetName}.jpg`;
    link.href = resizedDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCode = () => {
    const embedText = `<a href="https://weeklynaukri.com/image-resizer" target="_blank">Resize Photo & Signature for SSC (Free)</a>`;
    navigator.clipboard.writeText(embedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerReset = () => {
    setSelectedImage(null);
    setOriginalFile(null);
    setResizedDataUrl(null);
    setResizedSizeKb(null);
    setStatusText('');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Title Hero */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-rose-100">
          <Sparkles className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> Free Online Sarkari Resizer
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-blue-950 leading-tight mb-4 tracking-tight">
          SSC Photo &amp; Signature Resizer
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          Quickly crop, resize, and compress your passport photos and signatures to match strict application size requirements (e.g. 20KB–50KB) for SSC CGL, SSC GD, and UPSC forms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card padding="p-6" className="border-gray-200 shadow-sm bg-white rounded-2xl">
            <h2 className="font-extrabold text-blue-950 text-base mb-5 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-rose-600" /> Resizing Options
            </h2>

            {/* Presets */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Format Preset</label>
                <select 
                  value={preset} 
                  onChange={(e) => setPreset(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-600 bg-gray-50/50 text-sm font-semibold cursor-pointer"
                >
                  <option value="ssc-photo">SSC Photo (350x450px | 20-50KB)</option>
                  <option value="ssc-signature">SSC Signature (400x200px | 10-20KB)</option>
                  <option value="upsc-photo">UPSC Photo (350x350px | 20-300KB)</option>
                  <option value="custom">Custom Dimensions</option>
                </select>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Width (px)</label>
                  <input 
                    type="number"
                    value={width}
                    disabled={preset !== 'custom'}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-600 bg-white disabled:bg-gray-100 disabled:text-gray-400 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Height (px)</label>
                  <input 
                    type="number"
                    value={height}
                    disabled={preset !== 'custom'}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-600 bg-white disabled:bg-gray-100 disabled:text-gray-400 text-sm font-bold"
                  />
                </div>
              </div>

              {/* Target File Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Min Size (KB)</label>
                  <input 
                    type="number"
                    value={minSizeKb}
                    disabled={preset !== 'custom'}
                    onChange={(e) => setMinSizeKb(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-600 bg-white disabled:bg-gray-100 disabled:text-gray-400 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Max Size (KB)</label>
                  <input 
                    type="number"
                    value={maxSizeKb}
                    disabled={preset !== 'custom'}
                    onChange={(e) => setMaxSizeKb(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-600 bg-white disabled:bg-gray-100 disabled:text-gray-400 text-sm font-bold"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 leading-relaxed">
            🔒 <strong>100% Secure &amp; Private:</strong> All cropping, compression, and image processing happen entirely inside your local browser. Your photos are never uploaded to any server.
          </div>
        </div>

        {/* Right Work Area */}
        <div className="lg:col-span-7">
          {!selectedImage ? (
            /* Upload Dropzone */
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-3 border-dashed border-gray-300 hover:border-rose-500 rounded-2xl p-12 text-center bg-white cursor-pointer hover:bg-rose-50/20 transition-all group min-h-[350px] flex flex-col justify-center items-center gap-4 shadow-sm"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-blue-950 text-base mb-1">Upload Your Image</h3>
                <p className="text-xs text-gray-500">Supports JPG, JPEG, and PNG formats</p>
              </div>
              <button className="bg-gradient-to-r from-rose-550 to-orange-550 text-white font-bold text-xs px-6 py-2.5 rounded-full pointer-events-none">
                Select Photo or Signature
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/*" 
                className="hidden" 
              />
            </div>
          ) : (
            /* Live Output Work Bench */
            <Card padding="p-6 md:p-8" className="border-gray-200 shadow-sm bg-white rounded-2xl">
              <div className="flex items-center justify-between border-b border-gray-150 pb-4 mb-6">
                <div>
                  <h3 className="font-black text-blue-950 text-base">Image Editor Output</h3>
                  <p className="text-[10px] text-gray-550 mt-0.5">Original File: {originalFile?.name}</p>
                </div>
                <button 
                  onClick={triggerReset}
                  className="text-xs font-bold text-gray-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Upload Different File
                </button>
              </div>

              {/* View Splitter */}
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
                {/* Original Preview */}
                <div className="text-center w-full max-w-[200px]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Original Preview</p>
                  <div className="h-[200px] border border-gray-200 bg-gray-50/50 rounded-xl overflow-hidden flex items-center justify-center p-2">
                    <img 
                      src={selectedImage} 
                      alt="Original input" 
                      className="max-h-full max-w-full object-contain rounded-md" 
                    />
                  </div>
                  <p className="text-xs font-bold text-gray-600 mt-2">
                    Size: {originalFile ? (originalFile.size / 1024).toFixed(1) : 0} KB
                  </p>
                </div>

                <div className="text-gray-300 text-2xl font-black rotate-90 md:rotate-0">
                  ➔
                </div>

                {/* Resized Result */}
                <div className="text-center w-full max-w-[200px]">
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-2">Resized Result</p>
                  <div className="h-[200px] border border-rose-200 bg-rose-50/10 rounded-xl overflow-hidden flex items-center justify-center p-2 relative">
                    {isProcessing ? (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-bold text-gray-550 gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-rose-600" /> Resizing...
                      </div>
                    ) : null}
                    {resizedDataUrl ? (
                      <img 
                        src={resizedDataUrl} 
                        alt="Resized output" 
                        className="max-h-full max-w-full object-contain rounded-md shadow-sm border border-gray-100" 
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Loading output...</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-rose-650 mt-2">
                    Size: {resizedSizeKb ? `${resizedSizeKb.toFixed(1)} KB` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Status Alert Banner */}
              {statusText && (
                <div className={`flex gap-2.5 p-4 rounded-xl border text-xs leading-relaxed mb-8 ${
                  statusColor === 'green' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {statusColor === 'green' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                  <div>
                    <strong className="block font-bold mb-0.5">{statusColor === 'green' ? 'Success' : 'Check Requirements'}</strong>
                    {statusText}
                  </div>
                </div>
              )}

              {/* Action Download */}
              <button 
                onClick={handleDownload}
                disabled={isProcessing || !resizedDataUrl}
                className="w-full bg-gradient-to-r from-rose-550 to-orange-550 text-white font-extrabold text-sm py-4 rounded-2xl hover:from-rose-650 hover:to-orange-650 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Download className="w-5 h-5" /> Download Optimized Image
              </button>
            </Card>
          )}
        </div>
      </div>

      {/* Share Embed Code Section */}
      <div className="bg-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Sarkari Job Bloggers: Embed this Tool</h2>
          <p className="text-indigo-150 text-sm md:text-base leading-relaxed mb-6">
            Help your readers prepare their SSC CGL/GD forms by adding this resizing utility link to your site. Copy the HTML code block below and paste it into your article.
          </p>
          
          <div className="max-w-2xl bg-indigo-900/60 border border-indigo-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-indigo-300 tracking-wider">Embed Link Code</span>
              <button 
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-200 hover:text-white cursor-pointer bg-transparent border-none p-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Link Code
                  </>
                )}
              </button>
            </div>
            <textarea 
              readOnly
              value={`<a href="https://weeklynaukri.com/image-resizer" target="_blank">Resize Photo & Signature for SSC (Free)</a>`}
              className="w-full text-xs font-mono bg-indigo-950 border border-indigo-800 p-3 rounded-xl text-indigo-100 select-all focus:outline-none"
              rows={2}
            />
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <svg width="100%" height="100%" fill="currentColor">
            <defs>
              <pattern id="grid-embed" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-embed)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
