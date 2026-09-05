import React from "react";
import { ShieldCheck, AlertTriangle, Building2, Check, X } from "lucide-react";

interface ConsentModalProps {
  isOpen: boolean;
  requestingDept: string;
  sourceDept: string;
  fields: string[];
  purpose: string;
  onAllow: () => void;
  onDeny: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  requestingDept,
  sourceDept,
  fields,
  purpose,
  onAllow,
  onDeny,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Inter-Department Data Sharing Request</h3>
            <p className="text-xs text-slate-400">Explicit Citizen Consent Mandatory (National Interoperability Protocol)</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-900 leading-relaxed">
              <strong>{requestingDept}</strong> is requesting verified demographic data from{" "}
              <strong>{sourceDept}</strong> to automatically process your application without manual office visits.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px]">
              Requested Data Fields:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {fields.map((field, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-50 border border-indigo-100 text-indigo-800 font-semibold px-2.5 py-1 rounded-md text-[11px]"
                >
                  ✓ {field}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block text-[11px]">Purpose of Request:</span>
            <p className="text-slate-600 italic">"{purpose}"</p>
          </div>

          <p className="text-[11px] text-slate-500">
            By clicking <strong>Allow & Grant Access</strong>, your consent will be digitally signed and recorded in the audit trail. You can revoke access anytime in <em>Data Consents</em>.
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onDeny}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            <X className="w-4 h-4 text-rose-500" /> Deny Sharing
          </button>
          <button
            onClick={onAllow}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md transition flex items-center gap-1.5"
          >
            <Check className="w-4.5 h-4.5 text-slate-950" /> Allow & Grant Access
          </button>
        </div>
      </div>
    </div>
  );
};
