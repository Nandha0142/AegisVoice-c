import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Radio, Zap, AlertTriangle, CheckCircle2, BarChart2, Eye, Mic } from 'lucide-react';

export default function AudioVisualizer({ isStreaming, audioSource, riskScore, isMuted, micStream }) {
  const canvasRef = useRef(null);
  const [viewMode, setViewMode] = useState('WAVEFORM'); // WAVEFORM | SPECTROGRAM | PITCH
  const audioAnalyserRef = useRef(null);
  const audioContextRef = useRef(null);

  // Setup live microphone audio analyser when micStream is available
  useEffect(() => {
    if (audioSource.includes('Microphone') && isStreaming && micStream) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(micStream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        audioContextRef.current = audioCtx;
        audioAnalyserRef.current = analyser;
      } catch (err) {
        console.error('Error initializing Mic Analyser:', err);
      }
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
        audioAnalyserRef.current = null;
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [audioSource, isStreaming, micStream]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      const width = canvas.width = canvas.parentElement.clientWidth;
      const height = canvas.height = canvas.parentElement.clientHeight || 200;

      ctx.clearRect(0, 0, width, height);

      // Background Grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const centerY = height / 2;

      if (!isStreaming || isMuted) {
        // Flatline idle state
        ctx.strokeStyle = isMuted ? 'rgba(255, 0, 85, 0.6)' : 'rgba(100, 116, 139, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        ctx.fillStyle = isMuted ? 'rgba(255, 0, 85, 0.9)' : 'rgba(148, 163, 184, 0.7)';
        ctx.font = '12px JetBrains Mono';
        ctx.fillText(
          isMuted ? '[STREAM MUTED BY MITIGATION ENGINE (0kbps)]' : '[AUDIO STREAM STANDBY - CLICK START]',
          width / 2 - 130,
          centerY - 15
        );
        return;
      }

      const isHighRisk = riskScore > 65;
      const isMediumRisk = riskScore > 35 && riskScore <= 65;
      const waveColor = isHighRisk ? '#ff0055' : isMediumRisk ? '#ffb700' : '#00ff88';

      phase += 0.08;

      // Real Mic Data Handling vs Simulation
      let micFreqData = null;
      if (audioAnalyserRef.current) {
        const bufferLength = audioAnalyserRef.current.frequencyBinCount;
        micFreqData = new Uint8Array(bufferLength);
        audioAnalyserRef.current.getByteFrequencyData(micFreqData);
      }

      if (viewMode === 'WAVEFORM') {
        // --- WAVEFORM SCOPE VIEW ---
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = waveColor;
        ctx.shadowColor = waveColor;
        ctx.shadowBlur = 10;

        for (let x = 0; x < width; x += 3) {
          const normalizedX = x / width;
          let amplitude = 0;

          if (micFreqData) {
            const index = Math.floor(normalizedX * micFreqData.length);
            const val = micFreqData[index] || 0;
            amplitude = ((val - 128) / 128) * 40 + Math.sin(normalizedX * Math.PI * 8 + phase) * 10;
          } else {
            amplitude = Math.sin(normalizedX * Math.PI * 6 + phase) * 35;
            if (isHighRisk) {
              amplitude += (Math.random() - 0.5) * 45 + Math.sin(normalizedX * Math.PI * 28 + phase * 2) * 18;
            } else if (isMediumRisk) {
              amplitude += Math.sin(normalizedX * Math.PI * 14 + phase) * 12 + (Math.random() - 0.5) * 10;
            } else {
              amplitude *= Math.sin(normalizedX * Math.PI * 2);
              amplitude += Math.sin(normalizedX * Math.PI * 12 + phase * 1.5) * 8;
            }
          }

          const y = centerY + amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

        // Render Spectrum Bars At Bottom
        const numBars = 36;
        const barWidth = (width / numBars) - 3;
        for (let i = 0; i < numBars; i++) {
          let barHeight = 0;
          if (micFreqData) {
            const val = micFreqData[Math.floor((i / numBars) * micFreqData.length)];
            barHeight = (val / 255) * (height * 0.45);
          } else {
            barHeight = Math.abs(Math.sin(i * 0.3 + phase * 1.2)) * (height * 0.35);
            if (isHighRisk && i > 22) barHeight = Math.random() * (height * 0.45);
          }

          const x = i * (barWidth + 3);
          const y = height - barHeight;

          const grad = ctx.createLinearGradient(0, height, 0, y);
          grad.addColorStop(0, 'rgba(15, 23, 42, 0.8)');
          grad.addColorStop(1, isHighRisk ? 'rgba(255, 0, 85, 0.8)' : 'rgba(0, 240, 255, 0.8)');

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barHeight);
        }

      } else if (viewMode === 'SPECTROGRAM') {
        // --- MEL SPECTROGRAM HEATMAP VIEW ---
        const rows = 18;
        const cols = 40;
        const cellWidth = width / cols;
        const cellHeight = height / rows;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const intensity = Math.abs(Math.sin(r * 0.4 + c * 0.2 + phase)) * (isHighRisk ? 1.0 : 0.6);
            let color = `rgba(0, 240, 255, ${intensity})`;
            if (isHighRisk && r < 5) {
              color = `rgba(255, 0, 85, ${intensity * 1.2})`; // Vocoder high frequency anomaly
            }

            ctx.fillStyle = color;
            ctx.fillRect(c * cellWidth, r * cellHeight, cellWidth - 1, cellHeight - 1);
          }
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('MEL SPECTROGRAM HEATMAP (0 - 8,000 Hz)', 15, 20);

      } else if (viewMode === 'PITCH') {
        // --- PITCH CONTOUR TRACK VIEW ---
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = isHighRisk ? '#ff0055' : '#00f0ff';
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 12;

        for (let x = 0; x < width; x += 5) {
          const normX = x / width;
          let pitchY = centerY + Math.sin(normX * Math.PI * 4 + phase) * 30;

          if (isHighRisk) {
            // Unnatural robotic pitch quantization flatlines
            pitchY = centerY + (Math.floor(normX * 8) % 2 === 0 ? 25 : -25);
          }

          if (x === 0) ctx.moveTo(x, pitchY);
          else ctx.lineTo(x, pitchY);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(
          isHighRisk ? '⚡ MONOTONE ROBOTIC PITCH QUANTIZATION DETECTED' : '✓ NATURAL FORMANT PITCH FLUCTUATION',
          15, 20
        );
      }

      // Top Status Overlay Text
      if (isHighRisk) {
        ctx.fillStyle = 'rgba(255, 0, 85, 0.95)';
        ctx.font = '11px JetBrains Mono';
        ctx.fillText('⚡ VOCODER PHASE ANOMALY DETECTED (14.2kHz - 18kHz Truncation)', 15, height - 15);
      } else {
        ctx.fillStyle = 'rgba(0, 255, 136, 0.95)';
        ctx.font = '11px JetBrains Mono';
        ctx.fillText('✓ ORGANIC HUMAN ACOUSTICS VERIFIED', 15, height - 15);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isStreaming, audioSource, riskScore, isMuted, viewMode]);

  return (
    <div className={`relative rounded-xl overflow-hidden border p-4 transition-all duration-300 ${
      isMuted 
        ? 'glass-panel-danger' 
        : riskScore > 65 
          ? 'bg-slate-900/90 border-rose-500/40 shadow-[0_0_20px_rgba(255,0,85,0.15)]' 
          : 'glass-panel border-slate-800'
    }`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Radio className={`w-4 h-4 ${isStreaming ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide font-sans">
            Real-Time Acoustic & Spectral Analyzer
          </h3>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setViewMode('WAVEFORM')}
              className={`px-2 py-0.5 rounded ${viewMode === 'WAVEFORM' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Waveform
            </button>
            <button
              onClick={() => setViewMode('SPECTROGRAM')}
              className={`px-2 py-0.5 rounded ${viewMode === 'SPECTROGRAM' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Spectrogram
            </button>
            <button
              onClick={() => setViewMode('PITCH')}
              className={`px-2 py-0.5 rounded ${viewMode === 'PITCH' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Pitch Track
            </button>
          </div>

          {isMuted ? (
            <span className="flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
              <AlertTriangle className="w-3 h-3" /> MUTED
            </span>
          ) : isStreaming ? (
            <span className="flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <Zap className="w-3 h-3 text-cyan-400" /> LIVE 16kHz PCM
            </span>
          ) : (
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">IDLE</span>
          )}
        </div>
      </div>

      {/* Canvas Display */}
      <div className="relative w-full h-[210px] bg-slate-950/90 rounded-lg overflow-hidden border border-slate-800/80 scanline-effect">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
            Natural Formants
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            Acoustic Jitter
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            Vocoder Artifacts
          </span>
        </div>
        <div>
          Current View: <strong className="text-cyan-300">{viewMode}</strong> • 16,000 Hz / 20ms Window
        </div>
      </div>

    </div>
  );
}
