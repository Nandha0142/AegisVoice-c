import React, { useState } from 'react';
import { AlertOctagon, VolumeX, ShieldCheck, KeyRound, Bell, X, Check } from 'lucide-react';

export default function ActivePreventionModal({ isOpen, onClose, modalType, riskScore, challengePhrase, onVerifyChallenge }) {
  const [userInput, setUserInput] = useState('');
  const [verified, setVerified] = useState(false);

  if (!isOpen) return null;

  const handleSubmitChallenge = (e) => {
    e.preventDefault();
    if (userInput.trim().toLowerCase() === challengePhrase.toLowerCase()) {
      setVerified(true);
      setTimeout(() => {
        onVerifyChallenge(true);
        setVerified(false);
        setUserInput('');
        onClose();
      }, 1200);
    } else {
      alert('Challenge word mismatch! Step-up verification failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-md glass-panel-danger rounded-2xl p-6 border border-rose-500/40 shadow-[0_0_50px_rgba(255,0,85,0.3)]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {modalType === 'MUTE' && (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 animate-pulse">
              <VolumeX className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-sans">AUTOMATED MITIGATION ENGAGED</h3>
              <p className="text-xs text-rose-300 font-mono mt-1">High-Risk Voice Clone Impersonation Detected ({riskScore.toFixed(1)}% Spoof Probability)</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-left text-xs font-mono space-y-1 text-slate-300">
              <div className="flex justify-between"><span>Action Taken:</span> <strong className="text-rose-400">Stream Muted (0.00kbps)</strong></div>
              <div className="flex justify-between"><span>Trigger Threshold:</span> <span>70.0% Spoof Score</span></div>
              <div className="flex justify-between"><span>Incident Code:</span> <span className="text-cyan-400">EV-789-IMP</span></div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition shadow-[0_0_15px_rgba(255,0,85,0.4)]"
            >
              Acknowledge & Keep Stream Muted
            </button>
          </div>
        )}

        {modalType === 'CHALLENGE' && (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-sans">STEP-UP ACTIVE LIVENESS CHALLENGE</h3>
              <p className="text-xs text-amber-300 font-mono mt-1">Prompting caller to speak acoustic verification phrase</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 text-center">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Spoken Challenge Prompt</span>
              <span className="text-xl font-mono font-extrabold text-amber-300 tracking-wider my-1 block">
                "{challengePhrase}"
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Verifying vocal tract resonances & acoustic room echo</span>
            </div>

            {verified ? (
              <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Liveness Authenticated! Resetting Threat Level.
              </div>
            ) : (
              <form onSubmit={handleSubmitChallenge} className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter spoken response to verify..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition"
                >
                  Simulate Caller Spoken Response Match
                </button>
              </form>
            )}
          </div>
        )}

        {modalType === 'ALERT' && (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Bell className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-sans">OUT-OF-BAND 2FA ALERT SENT</h3>
              <p className="text-xs text-cyan-300 font-mono mt-1">Emergency Push & SMS Notification Dispatched</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-left text-xs font-mono space-y-1.5 text-slate-300">
              <div className="flex justify-between"><span>Recipient Mobile:</span> <strong className="text-slate-100">+1 (555) ***-8942</strong></div>
              <div className="flex justify-between"><span>Push Status:</span> <span className="text-emerald-400">Delivered (Apple APNs)</span></div>
              <div className="flex justify-between"><span>Action Required:</span> <span>Confirm if call is authorized</span></div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition"
            >
              Close Notification Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
