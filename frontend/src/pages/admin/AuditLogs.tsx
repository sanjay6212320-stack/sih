import React, { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import { Lock, Shield } from "lucide-react";

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAuditLogs().then(setLogs).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">System Security Audit Trails</h1>
        <p className="text-xs text-slate-500">Immutably logged system events and user actions.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading audit log stream...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">No audit log events recorded yet.</div>
        ) : (
          <div className="divide-y divide-slate-100 font-mono text-xs">
            {logs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-slate-500 ml-2">[{log.resource}]</span>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">{log.details || log.user_email}</p>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
