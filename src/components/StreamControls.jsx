import React from 'react';
import { Play, Pause, Mic, ShieldAlert, KeyRound, Bell, VolumeX, RefreshCw, Radio, Sparkles } from 'lucide-react';

export default function StreamControls({ 
  isStreaming, 
  audioSource, 
  onSelectSource, 
  onToggleStream, 
  onTriggerMute, 
  isMuted,
  onTriggerChallenge,
  onTriggerAlert,
  onSimulateAttack
}) {
  const audioSources = [
    { id: 'Enrolled Authentic Voice', name: 'Authentic Voice (CEO Profile Enrolled)', type: 'safe', risk: 8 },
    { id: 'ElevenLabs Impersonation', name: 'ElevenLabs Zero-Shot Clone (Impersonation Attack)', type: 'danger', risk: 94 },
    { id: 'VALL-E / XTTS-v2 Synthesis', name: 'VALL-E / XTTS-v2 Neural Vocoder Attack', type: 'danger', risk: 87 },
    { id: 'Scam Telephony Stream', name: 'Wire Transfer Impersonation Telephony Feed', type: 'danger', risk: 96 },
    { id: 'Live Microphone Input', name: 'Live Microphone Feed (Web Audio Browser Capture)', type: 'mic', risk: 12 },
  ];

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
      
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 font-sans tracking-wide">Audio Stream Controller & Attack Simulator</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> 16kHz WebRTC Proxy
          </span>
        </div>
      </div>

      {/* Preset Stream Selectors */}
      <div>
        <label className="text-xs font-mono text-slate-400 block mb-2">Select Active Live Stream / Impersonation Attack Vector:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {audioSources.map((source) => {
            const isSelected = audioSource === source.id;
            return (
              <button
                key={source.id}
                onClick={() => onSelectSource(source.id)}
                className={`p-3 rounded-xl text-left border transition text-xs font-mono flex flex-col justify-between ${
                  isSelected
                    ? source.type === 'danger'
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-[0_0_18px_rgba(255,0,85,0.25)]'
                      : 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_18px_rgba(0,240,255,0.25)]'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold flex items-center gap-1.5">
                    {source.type === 'mic' && <Mic className="w-3.5 h-3.5 text-cyan-400" />}
                    {source.type === 'danger' && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                    {source.type === 'safe' && <Radio className="w-3.5 h-3.5 text-emerald-400" />}
                    {source.id.split(' ')[0]}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    source.type === 'danger' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {source.type === 'danger' ? `Spoof ~${source.risk}%` : 'Authentic'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 line-clamp-1">{source.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Playback & Attack Trigger Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleStream}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-xs font-bold transition ${
              isStreaming
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(255,0,85,0.4)]'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_20px_rgba(0,240,255,0.4)]'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-4 h-4" /> Stop Stream Feed
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Start Audio Feed
              </>
            )}
          </button>

          <button
            onClick={onSimulateAttack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Inject Voice Clone Attack
          </button>
        </div>

        {/* Real-time Prevention Manual Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onTriggerMute}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold border transition ${
              isMuted 
                ? 'bg-rose-950 text-rose-300 border-rose-500 shadow-[0_0_15px_rgba(255,0,85,0.3)]' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            <span>{isMuted ? 'Unmute Stream' : 'Force Mute Stream'}</span>
          </button>

          <button
            onClick={onTriggerChallenge}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-semibold transition"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>OTP Liveness Prompt</span>
          </button>

          <button
            onClick={onTriggerAlert}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-semibold transition"
          >
            <Bell className="w-3.5 h-3.5 text-cyan-400" />
            <span>Push 2FA Alert</span>
          </button>
        </div>

      </div>

    </div>
  );
}
