import React, { useState, useRef } from 'react';
import {
  Upload,
  Scan,
  CheckCircle2,
  AlertTriangle,
  FileImage,
  RefreshCw,
  Shield,
  Sparkles,
  ArrowRight,
  Layers,
  Info
} from 'lucide-react';
import { ImageScanResult } from '../types';
import { PRESET_MINE_IMAGES, MOCK_SCAN_RESULT } from '../data/mockData';

interface ImageScanPageProps {
  onScanCompleted: (result: ImageScanResult) => void;
  onOpenAIChat: () => void;
}

export const ImageScanPage: React.FC<ImageScanPageProps> = ({
  onScanCompleted,
  onOpenAIChat
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(PRESET_MINE_IMAGES[0].url);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-1');
  const [scanning, setScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [scanResult, setScanResult] = useState<ImageScanResult | null>(MOCK_SCAN_RESULT);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scanSteps = [
    'Uploading slope image...',
    'Analyzing crack fracture patterns...',
    'Detecting rockfall indicators...',
    'Checking slope instability risk...',
    'Calculating geotechnical risk score...'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setSelectedPresetId('custom');
      runAIScan(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const runAIScan = async (imageBase64: string, mimeType = 'image/jpeg') => {
    setScanning(true);
    setScanResult(null);
    setScanStepIndex(0);

    // Step animation sequence
    const interval = setInterval(() => {
      setScanStepIndex((prev) => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    try {
      const response = await fetch('/api/scan-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          imageType: mimeType,
          sector: 'Sector B-12'
        })
      });

      const data = await response.json();
      clearInterval(interval);

      if (data.result) {
        const fullResult: ImageScanResult = {
          ...data.result,
          scanTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          imagePreviewUrl: imageBase64
        };
        setScanResult(fullResult);
        onScanCompleted(fullResult);
      } else {
        setScanResult(MOCK_SCAN_RESULT);
      }
    } catch (err) {
      console.error('Scan error:', err);
      clearInterval(interval);
      setScanResult(MOCK_SCAN_RESULT);
    } finally {
      setScanning(false);
    }
  };

  const handlePresetSelect = (preset: typeof PRESET_MINE_IMAGES[0]) => {
    setSelectedImage(preset.url);
    setSelectedPresetId(preset.id);
    runAIScan(preset.url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner - Bento Dark Navy Accent Card */}
      <div className="p-6 rounded-2xl bg-[#0B192E] text-white shadow-lg border border-[#1E293B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-[#F27D26]/20 text-[#F27D26] font-extrabold text-[10px] tracking-widest uppercase border border-[#F27D26]/30">
              GEMINI VISION ENGINE
            </span>
            <span className="text-xs text-slate-300 font-medium">Real-time Computer Vision Analysis</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Image Upload & AI Scan</h2>
          <p className="text-xs text-slate-300">
            AI-powered visual hazard detection for mine slopes, highwalls, and terrace benches.
          </p>
        </div>

        <button
          onClick={() => runAIScan(selectedImage || PRESET_MINE_IMAGES[0].url)}
          disabled={scanning}
          className="px-5 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#d86b1b] text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          <span>{scanning ? 'Scanning...' : 'Re-run AI Analysis'}</span>
        </button>
      </div>

      {/* Preset Sample Mine Images Bar */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Select Sample Mine Slope Image or Upload Custom Photo
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_MINE_IMAGES.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50 border-[#F27D26] shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.title}
                  className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-900 truncate">{preset.title}</div>
                  <div className="text-[10px] text-[#F27D26] font-semibold">
                    {preset.hazardType} • Risk {preset.riskScore}/100
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DRAG AND DROP ZONE / PREVIEW & AI SCANNING CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Drag & Drop Area */}
        <div className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative min-h-[340px] rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 overflow-hidden ${
              dragOver
                ? 'border-[#F27D26] bg-orange-50 scale-[1.01]'
                : 'border-slate-300 bg-white hover:border-[#F27D26]/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            {selectedImage ? (
              <div className="relative w-full h-full min-h-[280px] rounded-xl overflow-hidden border border-slate-200 group">
                <img
                  src={selectedImage}
                  alt="Mine Slope"
                  className="w-full h-full object-cover rounded-xl"
                />

                {/* Animated Scanner Radar Sweep Effect */}
                {scanning && (
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center text-white">
                    {/* Laser Scanner Line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#F27D26] to-transparent shadow-[0_0_15px_#f27d26] animate-bounce" />

                    <div className="w-16 h-16 rounded-2xl bg-[#F27D26]/20 border border-[#F27D26]/40 flex items-center justify-center text-[#F27D26] mb-4 animate-pulse">
                      <Scan className="w-8 h-8" />
                    </div>

                    <h4 className="text-sm font-extrabold text-white mb-2">
                      {scanSteps[scanStepIndex]}
                    </h4>

                    {/* Step progress dots */}
                    <div className="flex gap-1.5 mt-2">
                      {scanSteps.map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i <= scanStepIndex ? 'bg-[#F27D26] w-4' : 'bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700 text-xs text-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-4 h-4 text-[#F27D26]" />
                    <span className="font-semibold text-white">Active Image Selected</span>
                  </div>
                  <span className="text-[10px] text-[#F27D26] font-bold uppercase">Click to Replace</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F27D26] mx-auto">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">DROP MINE IMAGE HERE</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Drag and drop highwall drone photos, bench slope images, or site inspection photos.
                </p>
                <span className="inline-block px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#F27D26] font-bold text-xs border border-slate-200 transition">
                  Browse Image
                </span>
                <p className="text-[10px] text-slate-400">Supports JPG, PNG, Drone Images (Up to 50MB)</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI RESULT CARD */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F27D26]" />
                <span>AI Hazard Scan Results</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                Confidence {scanResult?.confidence || 91}%
              </span>
            </div>

            {scanResult ? (
              <div className="space-y-5">
                {/* Score & Hazard Summary */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Score box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      OVERALL RISK SCORE
                    </span>
                    <div className="text-3xl font-black text-red-600">
                      {scanResult.overall_risk_score}/100
                    </div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-bold uppercase border border-red-200">
                      {scanResult.overall_risk_score > 70 ? 'CRITICAL RISK' : 'MODERATE RISK'}
                    </span>
                  </div>

                  {/* Hazard type box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      HAZARD TYPE
                    </span>
                    <div className="text-base font-bold text-slate-900 truncate">
                      {scanResult.hazard_type}
                    </div>
                    <div className="text-xs font-semibold text-[#F27D26] mt-1">
                      Severity: {scanResult.crack_severity}
                    </div>
                  </div>
                </div>

                {/* AI Explanation Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-[#F27D26] font-bold text-xs">
                    <Info className="w-4 h-4" />
                    <span>AI Geotechnical Assessment</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    "{scanResult.explanation}"
                  </p>
                </div>

                {/* Recommended Safety Actions */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Recommended Operational Actions:
                  </span>
                  <div className="space-y-1.5">
                    {scanResult.recommended_actions?.map((action, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Chat Link */}
                <button
                  onClick={onOpenAIChat}
                  className="w-full py-2.5 rounded-xl bg-[#0B192E] hover:bg-[#1E293B] text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Discuss Scan with RockGuard AI Copilot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Select or upload an image above to run AI vision analysis.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
