import React, { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import { Department } from "../../types";
import { Building2, Server, CheckCircle2, AlertTriangle } from "lucide-react";

export const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDepartments().then(setDepartments).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Connected Government Departments</h1>
        <p className="text-xs text-slate-500">
          Registry of connected department APIs and interoperability adapter status.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading department registry...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((d) => (
            <div key={d.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200">
                  {d.code}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  ● {d.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{d.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{d.description}</p>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-600 truncate">
                Endpoint: {d.api_endpoint}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
