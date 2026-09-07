import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import AudioVisualizer from './components/AudioVisualizer';
import RiskGauge from './components/RiskGauge';
import LayerBreakdown from './components/LayerBreakdown';
import StreamControls from './components/StreamControls';
import ThreatLogTable from './components/ThreatLogTable';
import ActivePreventionModal from './components/ActivePreventionModal';
import VoiceVaultModal from './components/VoiceVaultModal';
import ArchitectureModal from './components/ArchitectureModal';
import { ShieldCheck, AlertOctagon, Activity, Radio, Lock, ShieldAlert, Cpu } from 'lucide-react';

export default function App() {
  // Main State
  const [isStreaming, setIsStreaming] = useState(false);
  const [audioSource, setAudioSource] = useState('ElevenLabs Impersonation');
  const [riskScore, setRiskScore] = useState(94.2);
  const [isMuted, setIsMuted] = useState(false);
  const [activeLatency, setActiveLatency] = useState(42);
  const [totalThreatsBlocked, setTotalThreatsBlocked] = useState(14);
  const [activeMitigation, setActiveMitigation] = useState('Mute Audio Stream');
  const [micStream, setMicStream] = useState(null);
  
  // Layer Scores
  const [layerScores, setLayerScores] = useState({
    layer1: 92.4, // Spectral & Vocoder
    layer2: 96.1, // AASIST WavLM Neural Net
    layer3: 89.0, // Liveness & Watermark
    layer4: 95.8  // Speaker Match (Mis-match)
  });

  // SIEM Threat Audit Logs
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: '19:04:12',
      streamId: 'STRM-8912',
      source: 'ElevenLabs Zero-Shot Clone',
      score: 94.2,
      classification: 'CRITICAL',
      action: 'AUTO-MUTED STREAM (0kbps)'
    },
    {
      id: 2,
      timestamp: '19:02:45',
      streamId: 'STRM-8911',
      source: 'Authentic CEO Profile',
      score: 8.5,
      classification: 'SAFE',
      action: 'PASS STREAM'
    },
    {
      id: 3,
      timestamp: '18:59:10',
      streamId: 'STRM-8910',
      source: 'XTTS-v2 Vocoder Attack',
      score: 87.6,
      classification: 'CRITICAL',
      action: 'STEP-UP CHALLENGE PROMPTED'
    }
  ]);

  // Modal States
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [preventionModal, setPreventionModal] = useState({
    isOpen: false,
    type: 'MUTE', // MUTE | CHALLENGE | ALERT
    challengePhrase: 'Echo 84 Delta'
  });

  // Audio Context & Speech Synthesis Ref
  const audioCtxRef = useRef(null);

  // Keyboard Shortcuts (Space = Toggle Stream, M = Mute)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleToggleStream();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleTriggerMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStreaming, isMuted, audioSource]);

  // Speech Synthesis helper for simulated synthetic attack streams
  const speakSimulatedPhrase = (phrase) => {
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 0.95;
      utterance.pitch = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const cancelSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Streaming Simulation Loop
  useEffect(() => {
    let interval;
    if (isStreaming) {
      interval = setInterval(() => {
        // Random slight fluctuation in latency
        setActiveLatency(Math.floor(38 + Math.random() * 12));

        // Adjust risk scores based on active source
        let targetRisk = 12;
        let l1 = 10, l2 = 8, l3 = 12, l4 = 15;

        if (audioSource.includes('ElevenLabs') || audioSource.includes('Impersonation')) {
          targetRisk = 92 + Math.random() * 6;
          l1 = 90 + Math.random() * 7;
          l2 = 94 + Math.random() * 5;
          l3 = 87 + Math.random() * 8;
          l4 = 95 + Math.random() * 4;
        } else if (audioSource.includes('VALL-E') || audioSource.includes('XTTS')) {
          targetRisk = 85 + Math.random() * 8;
          l1 = 92 + Math.random() * 6;
          l2 = 88 + Math.random() * 7;
          l3 = 82 + Math.random() * 8;
          l4 = 86 + Math.random() * 7;
        } else if (audioSource.includes('Scam Telephony')) {
          targetRisk = 95 + Math.random() * 4;
          l1 = 94 + Math.random() * 4;
          l2 = 97 + Math.random() * 2;
          l3 = 91 + Math.random() * 5;
          l4 = 98 + Math.random() * 2;
        } else {
          // Authentic Voice or Mic
          targetRisk = 6 + Math.random() * 10;
          l1 = 5 + Math.random() * 8;
          l2 = 4 + Math.random() * 6;
          l3 = 7 + Math.random() * 9;
          l4 = 8 + Math.random() * 7;
        }

        setRiskScore(targetRisk);
        setLayerScores({ layer1: l1, layer2: l2, layer3: l3, layer4: l4 });

        // Update mitigation label
        if (targetRisk >= 70) {
          setActiveMitigation('Mute Audio Stream');
        } else if (targetRisk >= 35) {
          setActiveMitigation('Step-Up MFA Challenge');
        } else {
          setActiveMitigation('Pass Audio Stream');
        }

      }, 1000);
    } else {
      cancelSpeech();
    }

    return () => clearInterval(interval);
  }, [isStreaming, audioSource, isMuted]);

  // Handle source change
  const handleSelectSource = async (sourceId) => {
    setAudioSource(sourceId);

    // Stop mic stream if switching away from mic
    if (micStream && !sourceId.includes('Microphone')) {
      micStream.getTracks().forEach(t => t.stop());
      setMicStream(null);
    }

    if (sourceId.includes('Microphone')) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicStream(stream);
      } catch (err) {
        console.warn('Microphone permission denied or unavailable:', err);
      }
    }

    if (sourceId.includes('ElevenLabs') || sourceId.includes('VALL-E') || sourceId.includes('Scam')) {
      const newScore = 93.5;
      setRiskScore(newScore);
      setLayerScores({ layer1: 91, layer2: 95, layer3: 88, layer4: 96 });
      setIsMuted(true);
      setActiveMitigation('Mute Audio Stream');

      // Add to log
      const timeStr = new Date().toLocaleTimeString();
      const newLog = {
        id: Date.now(),
        timestamp: timeStr,
        streamId: `STRM-${Math.floor(1000 + Math.random() * 9000)}`,
        source: sourceId,
        score: newScore,
        classification: 'CRITICAL',
        action: 'AUTO-MUTED STREAM (0kbps)'
      };
      setLogs(prev => [newLog, ...prev]);
      setTotalThreatsBlocked(prev => prev + 1);

      // Trigger prevention modal
      setPreventionModal({
        isOpen: true,
        type: 'MUTE',
        challengePhrase: 'Echo 84 Delta'
      });

      speakSimulatedPhrase('Warning, high risk neural voice clone stream detected.');
    } else {
      setRiskScore(9.2);
      setLayerScores({ layer1: 8, layer2: 7, layer3: 11, layer4: 10 });
      setIsMuted(false);
      setActiveMitigation('Pass Audio Stream');

      const timeStr = new Date().toLocaleTimeString();
      const newLog = {
        id: Date.now(),
        timestamp: timeStr,
        streamId: `STRM-${Math.floor(1000 + Math.random() * 9000)}`,
        source: sourceId,
        score: 9.2,
        classification: 'SAFE',
        action: 'PASS STREAM'
      };
      setLogs(prev => [newLog, ...prev]);
    }
  };

  // Toggle Stream
  const handleToggleStream = () => {
    const nextState = !isStreaming;
    setIsStreaming(nextState);
    if (!nextState) {
      setIsMuted(false);
      cancelSpeech();
    }
  };

  // Inject attack simulation
  const handleSimulateAttack = () => {
    handleSelectSource('ElevenLabs Impersonation');
    setIsStreaming(true);
  };

  // Manual Trigger Mute
  const handleTriggerMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (next) cancelSpeech();
      return next;
    });
    if (!isMuted) {
      setPreventionModal({
        isOpen: true,
        type: 'MUTE',
        challengePhrase: 'Echo 84 Delta'
      });
    }
  };

  // Trigger Step-up OTP challenge
  const handleTriggerChallenge = () => {
    const phrases = ['Sapphire 92', 'Nexus 41 Echo', 'Cyber Shield 77', 'Apex Alpha 18'];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setPreventionModal({
      isOpen: true,
      type: 'CHALLENGE',
      challengePhrase: randomPhrase
    });
  };

  // Trigger Out-of-band alert
  const handleTriggerAlert = () => {
    setPreventionModal({
      isOpen: true,
      type: 'ALERT',
      challengePhrase: 'Echo 84 Delta'
    });
  };

  // Verification callback from Challenge Modal
  const handleVerifyChallenge = (success) => {
    if (success) {
      setRiskScore(14.5);
      setIsMuted(false);
      setActiveMitigation('Pass Audio Stream');
      const timeStr = new Date().toLocaleTimeString();
      setLogs(prev => [{
        id: Date.now(),
        timestamp: timeStr,
        streamId: `STRM-${Math.floor(1000 + Math.random() * 9000)}`,
        source: audioSource,
        score: 14.5,
        classification: 'SAFE',
        action: 'CHALLENGE VERIFIED (AUTHENTICATED)'
      }, ...prev]);
    }
  };

  // Export Incident Logs
  const handleExportLogs = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(logs, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `aegis_voice_threat_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getSystemStatus = () => {
    if (riskScore >= 70) return 'CRITICAL';
    if (riskScore >= 35) return 'WARNING';
    return 'SECURE';
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Header Bar */}
      <Navbar 
        systemStatus={getSystemStatus()}
        activeLatency={activeLatency}
        totalThreatsBlocked={totalThreatsBlocked}
        onOpenArch={() => setIsArchOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        
        {/* Banner Alert when Critical Deepfake Detected */}
        {riskScore >= 70 && (
          <div className="glass-panel-danger rounded-xl p-4 border border-rose-500/50 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-sans uppercase tracking-wider">
                  ⚠️ ACTIVE VOICE CLONE IMPERSONATION THREAT INTERCEPTED
                </h2>
                <p className="text-xs text-rose-300 font-mono mt-0.5">
                  Deepfake score: <strong className="text-white font-extrabold">{riskScore.toFixed(1)}%</strong> | Source: {audioSource} | Action: {isMuted ? 'Muted Stream' : 'Intervention Pending'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerChallenge}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold transition"
              >
                Prompt Active Liveness Challenge
              </button>
              <button
                onClick={handleTriggerAlert}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition"
              >
                Trigger 2FA Push Alert
              </button>
            </div>
          </div>
        )}

        {/* Top Grid: Real-Time Audio Visualizer */}
        <AudioVisualizer 
          isStreaming={isStreaming}
          audioSource={audioSource}
          riskScore={riskScore}
          isMuted={isMuted}
          micStream={micStream}
        />

        {/* Middle Grid: Risk Gauge & Multi-Layer AI Neural Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-4 h-full">
            <RiskGauge 
              riskScore={riskScore}
              threatStatus={getSystemStatus()}
              activeMitigation={activeMitigation}
            />
          </div>

          <div className="lg:col-span-8 h-full">
            <LayerBreakdown 
              layerScores={layerScores}
            />
          </div>

        </div>

        {/* Stream Simulator & Control Console */}
        <StreamControls 
          isStreaming={isStreaming}
          audioSource={audioSource}
          onSelectSource={handleSelectSource}
          onToggleStream={handleToggleStream}
          onTriggerMute={handleTriggerMute}
          isMuted={isMuted}
          onTriggerChallenge={handleTriggerChallenge}
          onTriggerAlert={handleTriggerAlert}
          onSimulateAttack={handleSimulateAttack}
        />

        {/* SIEM Threat Audit Logs */}
        <ThreatLogTable 
          logs={logs}
          onExportLogs={handleExportLogs}
        />

      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 px-4 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>AegisVoice Enterprise Deepfake Prevention Platform</span>
          </div>
          <div>
            Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Space</kbd> Play/Pause • <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">M</kbd> Mute
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ActivePreventionModal 
        isOpen={preventionModal.isOpen}
        onClose={() => setPreventionModal(prev => ({ ...prev, isOpen: false }))}
        modalType={preventionModal.type}
        riskScore={riskScore}
        challengePhrase={preventionModal.challengePhrase}
        onVerifyChallenge={handleVerifyChallenge}
      />

      <VoiceVaultModal 
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
      />

      <ArchitectureModal 
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />

    </div>
  );
}
