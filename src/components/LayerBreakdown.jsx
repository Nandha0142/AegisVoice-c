import React from 'react';
import { Layers, Activity, Cpu, Fingerprint, ShieldAlert } from 'lucide-react';

export default function LayerBreakdown({ layerScores }) {
  const layers = [
    {
      id: 1,
      name: 'Layer 1: Spectral & Vocoder Artifacts',
      subtitle: 'LFCC + CQT Spectral Analysis',
      icon: Activity,
      score: layerScores.layer1,
      metricText: layerScores.layer1 > 60 ? 'Vocoder Phase Inconsistency' : 'Natural Formant Phase',
      tech: 'Phase & Jitter FFT'
    },
    {
      id: 2,
      name: 'Layer 2: Raw Waveform Deep Neural Net',
      subtitle: 'AASIST / RawNet3 + WavLM Large',
      icon: Cpu,
      score: layerScores.layer2,
      metricText: layerScores.layer2 > 60 ? 'ElevenLabs/XTTS Fingerprint' : 'Human Voice Dynamics',
      tech: 'Graph Neural Net'
    },
    {
      id: 3,
      name: 'Layer 3: Liveness &provenance',
      subtitle: 'Respiration & SynthID/C2PA Reader',
      icon: ShieldAlert,
      score: layerScores.layer3,
      metricText: layerScores.layer3 > 60 ? 'Unnatural Breath Pauses' : 'Organic Respiratory Micro-Gasp',
      tech: 'Temporal Bio-Check'
    },
    {
      id: 4,
      name: 'Layer 4: Voice Enrollment Biometric',
      subtitle: 'ECAPA-TDNN Speaker Embedding Match',
      icon: Fingerprint,
      score: layerScores.layer4,
      metricText: layerScores.layer4 > 60 ? 'Impersonation Mis-Match (0.21 Sim)' : 'Verified Enrolled User (0.94 Sim)',
      tech: 'Cosine Distance'
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-rose-500 text-rose-400 border-rose-500/30';
    if (score >= 40) return 'bg-amber-500 text-amber-400 border-amber-500/30';
    return 'bg-emerald-500 text-emerald-400 border-emerald-500/30';
  };

  const getBarColor = (score) => {
    if (score >= 70) return 'bg-gradient-to-r from-rose-600 to-rose-400';
    if (score >= 40) return 'bg-gradient-to-r from-amber-600 to-amber-400';
    return 'bg-gradient-to-r from-emerald-600 to-emerald-400';
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 flex flex-col justify-between h-full">
      
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 font-sans tracking-wide">Multi-Layer AI Neural Detection Stack</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">4 Micro-Engines</span>
      </div>

      <div className="space-y-4">
        {layers.map((layer) => {
          const Icon = layer.icon;
          return (
            <div key={layer.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition">
              
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 font-sans">{layer.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{layer.subtitle}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold font-mono text-slate-100">{layer.score.toFixed(0)}%</span>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Risk</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-1.5 border border-slate-800">
                <div 
                  className={`h-full ${getBarColor(layer.score)} transition-all duration-500 ease-out`}
                  style={{ width: `${Math.max(4, layer.score)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-slate-300 font-medium">{layer.metricText}</span>
                <span className="text-[10px] text-cyan-400/80 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/50">{layer.tech}</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
