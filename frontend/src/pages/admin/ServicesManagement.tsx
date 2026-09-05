import React, { useState, useEffect } from "react";
import { serviceApi } from "../../services/serviceApi";
import { GovernmentService } from "../../types";
import { Sliders, Building2, Clock, ShieldCheck } from "lucide-react";

export const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<GovernmentService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceApi.getServices().then(setServices).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Government Services Registry</h1>
        <p className="text-xs text-slate-500">Configured government schemes and eligibility rules.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading services catalog...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                <th className="p-3">Code</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Department</th>
                <th className="p-3">SLA</th>
                <th className="p-3">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono font-bold text-indigo-600">{s.code}</td>
                  <td className="p-3 font-bold text-slate-900">{s.title}</td>
                  <td className="p-3">{s.category}</td>
                  <td className="p-3 text-slate-600">{s.department_name}</td>
                  <td className="p-3">{s.processing_days} Days</td>
                  <td className="p-3 font-bold text-slate-900">{s.fee === 0 ? "Free" : `₹${s.fee}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
