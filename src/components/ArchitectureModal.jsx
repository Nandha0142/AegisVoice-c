import React from 'react';
import { FileText, Cpu, ShieldCheck, X, Activity, Server, Zap } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl p-6 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.2)] space-y-5 max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-sans">AegisVoice Architectural Blueprint</h3>
            <p className="text-xs text-slate-400 font-mono">Ultra-Low Latency (&lt;150ms) Multi-Layer AI Defense Pipeline</p>
          </div>
        </div>

        {/* Pipeline Diagram Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Server className="w-4 h-4" /> 1. Ingestion
            </div>
            <p className="text-[11px] text-slate-300">WebRTC (SRTP/Opus), SIP/RTP Telephony PBX, 16kHz PCM WebSockets</p>
            <span className="inline-block text-[10px] bg-slate-900 px-2 py-0.5 rounded text-cyan-300">20ms Frame Window</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Cpu className="w-4 h-4" /> 2. AI Inference
            </div>
            <p className="text-[11px] text-slate-300">LFCC/CQT Spectral + AASIST RawNet3 + WavLM Large + ECAPA-TDNN</p>
            <span className="inline-block text-[10px] bg-slate-900 px-2 py-0.5 rounded text-cyan-300">45ms ONNX TensorRT</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Zap className="w-4 h-4" /> 3. Threat Fusion
            </div>
            <p className="text-[11px] text-slate-300">Weighted Spoof Probability Score Matrix ($$0.0 - 1.0$$)</p>
            <span className="inline-block text-[10px] bg-slate-900 px-2 py-0.5 rounded text-amber-300">Dynamic Risk Score</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> 4. Mitigation
            </div>
            <p className="text-[11px] text-slate-300">Auto Stream Mute, OTP Challenge Phrase, Out-of-band Push 2FA</p>
            <span className="inline-block text-[10px] bg-rose-950 px-2 py-0.5 rounded text-rose-300 border border-rose-800">Auto Mute {'>'} 70%</span>
          </div>

        </div>

        {/* Technical Specs Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-200 font-sans">System SLA & Latency Budget</h4>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2 text-slate-300">
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span>Audio Ingestion & Resampling:</span>
              <strong className="text-cyan-400">12ms</strong>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span>Feature Extraction (LFCC/CQT):</span>
              <strong className="text-cyan-400">15ms</strong>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span>Neural Net Inference (AASIST + WavLM):</span>
              <strong className="text-cyan-400">42ms</strong>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span>Biometric Enrollment Match (ECAPA-TDNN):</span>
              <strong className="text-cyan-400">22ms</strong>
            </div>
            <div className="flex justify-between pt-1">
              <span className="font-bold text-white">Total End-to-End Decision Latency:</span>
              <strong className="text-emerald-400 font-extrabold">91ms (Target &lt; 150ms)</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
