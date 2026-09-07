import React, { useState } from 'react';
import { Terminal, Download, Filter, ShieldAlert, ShieldCheck, AlertTriangle, Search, Trash2 } from 'lucide-react';

export default function ThreatLogTable({ logs, onExportLogs, onClearLogs }) {
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesFilter = 
      filter === 'HIGH' ? log.score >= 70 :
      filter === 'SAFE' ? log.score < 35 : true;

    const matchesSearch = 
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.streamId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
      
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 font-sans tracking-wide">SIEM Threat Audit Log & Stream Inspector</h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search stream ID or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-cyan-400 focus:outline-none w-48"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded ${filter === 'ALL' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ALL ({logs.length})
            </button>
            <button
              onClick={() => setFilter('HIGH')}
              className={`px-2.5 py-1 rounded ${filter === 'HIGH' ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              THREATS ({logs.filter(l => l.score >= 70).length})
            </button>
            <button
              onClick={() => setFilter('SAFE')}
              className={`px-2.5 py-1 rounded ${filter === 'SAFE' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              SAFE ({logs.filter(l => l.score < 35).length})
            </button>
          </div>

          {/* Actions */}
          <button
            onClick={onExportLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto max-h-[260px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead className="sticky top-0 bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-2.5 font-semibold">Timestamp</th>
              <th className="p-2.5 font-semibold">Stream ID</th>
              <th className="p-2.5 font-semibold">Audio Source</th>
              <th className="p-2.5 font-semibold text-center">Threat Score</th>
              <th className="p-2.5 font-semibold">Classification</th>
              <th className="p-2.5 font-semibold">Mitigation Action Taken</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-slate-500">
                  No matching log entries recorded.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const isHigh = log.score >= 70;
                const isMed = log.score >= 35 && log.score < 70;
                return (
                  <tr 
                    key={log.id} 
                    className={`hover:bg-slate-900/60 transition ${
                      isHigh ? 'bg-rose-950/20' : ''
                    }`}
                  >
                    <td className="p-2.5 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-2.5 text-cyan-400/90 font-bold">{log.streamId}</td>
                    <td className="p-2.5">{log.source}</td>
                    <td className="p-2.5 text-center font-extrabold">
                      <span className={`px-2 py-0.5 rounded border ${
                        isHigh 
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                          : isMed 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {log.score.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className="flex items-center gap-1.5">
                        {isHigh ? (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                            <strong className="text-rose-300">ElevenLabs Deepfake</strong>
                          </>
                        ) : isMed ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <strong className="text-amber-300">Synthesized Jitter</strong>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <strong className="text-emerald-300 font-medium">Authentic Human</strong>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        log.action.includes('MUTE') || log.action.includes('PREVENT')
                          ? 'bg-rose-900/80 text-rose-200 border-rose-700'
                          : log.action.includes('CHALLENGE')
                            ? 'bg-amber-900/80 text-amber-200 border-amber-700'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
