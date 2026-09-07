import React, { useState } from 'react';
import { Lock, Fingerprint, ShieldCheck, UserCheck, X, Search, CheckCircle2, Plus, Mic } from 'lucide-react';

export default function VoiceVaultModal({ isOpen, onClose }) {
  const [profiles, setProfiles] = useState([
    {
      id: 'CEO_JOHN_DOE',
      name: 'John Doe (Chief Executive Officer)',
      enrolledDate: '2026-04-12',
      voiceVector: '[0.042, -0.198, 0.841, 0.312, -0.654, 0.119, ...]',
      status: 'VERIFIED ENROLLED',
      samplesCount: 14
    },
    {
      id: 'CFO_JANE_SMITH',
      name: 'Jane Smith (Chief Financial Officer)',
      enrolledDate: '2026-05-19',
      voiceVector: '[-0.231, 0.412, -0.098, 0.771, 0.455, -0.892, ...]',
      status: 'VERIFIED ENROLLED',
      samplesCount: 18
    }
  ]);
  const [activeProfile, setActiveProfile] = useState('CEO_JOHN_DOE');
  const [newProfileName, setNewProfileName] = useState('');
  const [isEnrollingNew, setIsEnrollingNew] = useState(false);

  if (!isOpen) return null;

  const handleEnrollNew = (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    const id = `USER_${Date.now()}`;
    const newProf = {
      id,
      name: newProfileName,
      enrolledDate: new Date().toISOString().split('T')[0],
      voiceVector: `[${(Math.random() - 0.5).toFixed(3)}, ${(Math.random() - 0.5).toFixed(3)}, ${(Math.random() - 0.5).toFixed(3)}, 0.841, -0.312, ...]`,
      status: 'VERIFIED ENROLLED',
      samplesCount: 10
    };

    setProfiles(prev => [...prev, newProf]);
    setActiveProfile(id);
    setNewProfileName('');
    setIsEnrollingNew(false);
  };

  const selectedProfile = profiles.find(p => p.id === activeProfile) || profiles[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl p-6 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] space-y-5">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-sans">Zero-Trust Voice Enrollment Vault</h3>
            <p className="text-xs text-slate-400 font-mono">192-Dimensional Non-Reconstructible Biometric Templates (GDPR & BIPA Compliant)</p>
          </div>
        </div>

        {/* Profile Tabs + Add New */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {profiles.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveProfile(p.id)}
                className={`px-3 py-2 rounded-lg text-xs font-mono border flex items-center gap-2 transition ${
                  activeProfile === p.id 
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{p.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsEnrollingNew(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enroll New Voice</span>
          </button>
        </div>

        {/* New Enrollment Input Box */}
        {isEnrollingNew && (
          <form onSubmit={handleEnrollNew} className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3 font-mono text-xs">
            <h4 className="font-bold text-cyan-300 flex items-center gap-2">
              <Mic className="w-4 h-4 text-cyan-400" /> Record & Extract ECAPA-TDNN Template
            </h4>
            <input
              type="text"
              placeholder="Enter User Name & Title (e.g., Alex Mercer - VP Security)"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEnrollingNew(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition"
              >
                Save Biometric Template
              </button>
            </div>
          </form>
        )}

        {/* Profile Card Info */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Identity:</span>
            <span className="text-slate-100 font-bold">{selectedProfile.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Enrollment Date:</span>
            <span className="text-cyan-400">{selectedProfile.enrolledDate}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">ECAPA-TDNN Template Samples:</span>
            <span className="text-emerald-400">{selectedProfile.samplesCount} High-Fidelity Formant Captures</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Vector Embedding Representation (x-vector 192d):</span>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto tracking-wide">
              <code>{selectedProfile.voiceVector}</code>
            </div>
          </div>
        </div>

        {/* Verification Rules Info */}
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Biometric Vault Protection Active</strong>
            Non-reconstructible mathematical vector hashes prevent audio reconstruction while allowing microsecond cosine distance matching against live streams.
          </div>
        </div>

      </div>
    </div>
  );
}
