import React, { useState, useEffect } from "react";
import { citizenApi } from "../services/citizenApi";
import { DataConsent } from "../types";
import { ShieldAlert, CheckCircle2, XCircle, Trash2, Building2 } from "lucide-react";

export const ConsentsPage: React.FC = () => {
  const [consents, setConsents] = useState<DataConsent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsents();
  }, []);

  const fetchConsents = async () => {
    try {
      const data = await citizenApi.getConsents();
      setConsents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id: number) => {
    if (confirm("Revoke data sharing consent for this department?")) {
      await citizenApi.revokeConsent(id);
      fetchConsents();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Inter-Department Data Consents</h1>
        <p className="text-xs text-slate-500">
          Manage explicit permissions granted to government departments to pull your verified data.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" /> Active Consent Records ({consents.length})
        </h3>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading consents...</div>
        ) : consents.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">No active consent records.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {consents.map((c) => (
              <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      {c.requesting_dept} ← {c.source_dept}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                        c.status === "GRANTED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Purpose: {c.purpose}</p>
                  <p className="text-[11px] text-slate-400">
                    Fields: {Array.isArray(c.fields_requested) ? c.fields_requested.join(", ") : String(c.fields_requested)}
                  </p>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Granted: {new Date(c.granted_at).toLocaleString()}
                  </span>
                </div>

                {c.status === "GRANTED" && (
                  <button
                    onClick={() => handleRevoke(c.id)}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs rounded-xl transition self-end sm:self-center"
                  >
                    Revoke Consent
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
