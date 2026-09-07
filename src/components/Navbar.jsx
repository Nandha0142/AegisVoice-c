import React from 'react';
import { ShieldCheck, ShieldAlert, Activity, Cpu, Lock, Terminal, FileText, Info } from 'lucide-react';

export default function Navbar({ systemStatus, activeLatency, onOpenArch, onOpenVault, totalThreatsBlocked }) {
  const getStatusColor = () => {
    if (systemStatus === 'CRITICAL') return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    if (systemStatus === 'WARNING') return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <ShieldCheck className="w-6 h-6 animate-pulse-slow" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">AegisVoice <span className="text-cyan-400 font-mono font-semibold text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">PRO v2.4</span></h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">Real-Time Deepfake Voice Impersonation Defense</p>
          </div>
        </div>

        {/* Live Metrics Header Pill */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium ${getStatusColor()}`}>
            <Activity className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            <span>SYSTEM: {systemStatus}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>LATENCY: <strong className="text-cyan-400">{activeLatency}ms</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>BLOCKED: <strong className="text-rose-400">{totalThreatsBlocked}</strong></span>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenVault}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Voice Vault</span>
          </button>

          <button 
            onClick={onOpenArch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Architecture Plan</span>
          </button>
        </div>

      </div>
    </header>
  );
}
