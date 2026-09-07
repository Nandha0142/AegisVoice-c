import React from 'react';
import { ShieldCheck, ShieldAlert, AlertOctagon, Zap, ArrowUpRight } from 'lucide-react';

export default function RiskGauge({ riskScore, threatStatus, activeMitigation }) {
  // Calculate SVG arc parameters
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Semi-circle arc (50% of circumference)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (riskScore / 100) * arcLength;

  const getGaugeColor = () => {
    if (riskScore >= 70) return '#ff0055'; // High risk deepfake red
    if (riskScore >= 35) return '#ffb700'; // Suspicious yellow
    return '#00ff88'; // Safe green
  };

  const getStatusBadge = () => {
    if (threatStatus === 'CRITICAL') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-xs font-mono font-bold animate-pulse">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>CONFIRMED DEEPFAKE IMPERSONATION</span>
        </div>
      );
    }
    if (threatStatus === 'WARNING') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-xs font-mono font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>SUSPICIOUS SYNTHETIC ARTIFACTS</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-xs font-mono font-bold">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>AUTHENTIC HUMAN VOICE</span>
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 font-sans tracking-wide">Threat Risk Score</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Fusion Engine v2</span>
      </div>

      {/* Main Gauge Graphic */}
      <div className="flex flex-col items-center justify-center my-4 relative">
        <div className="relative w-[180px] h-[140px] flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-135" viewBox={`0 0 ${size} ${size}`}>
            {/* Background Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round"
            />
            {/* Value Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={getGaugeColor()}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
              style={{
                filter: `drop-shadow(0 0 10px ${getGaugeColor()})`
              }}
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
            <span className="text-4xl font-extrabold font-mono tracking-tight text-white">
              {riskScore.toFixed(1)}<span className="text-sm font-sans text-slate-400">%</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-0.5">SPOOF INDEX</span>
          </div>
        </div>

        {/* Dynamic Status Badge */}
        <div className="mt-2">
          {getStatusBadge()}
        </div>
      </div>

      {/* Mitigation Action Pill */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Active Defense State:</span>
          <span className={`font-semibold px-2 py-0.5 rounded border ${
            activeMitigation === 'Mute Audio Stream' 
              ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
              : activeMitigation === 'Step-Up MFA Challenge'
                ? 'bg-amber-950 text-amber-300 border-amber-700'
                : 'bg-slate-900 text-slate-300 border-slate-700'
          }`}>
            {activeMitigation}
          </span>
        </div>
      </div>

    </div>
  );
}
