import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { applicationApi } from "../services/applicationApi";
import { Application } from "../types";
import { ApplicationTimeline } from "../components/ApplicationTimeline";
import {
  FileCheck,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  Layers,
  FileText
} from "lucide-react";

export const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await applicationApi.getApplicationById(Number(id));
      setApp(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !app) {
    return <div className="text-center py-12 text-xs text-slate-400">Fetching application status timeline...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <Link to="/applications" className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Applications
        </Link>
        <button
          onClick={fetchDetails}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync Latest Status
        </button>
      </div>

      {/* Main Details Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
              {app.department_name}
            </span>
            <h1 className="text-xl font-extrabold text-slate-900">{app.service_title}</h1>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>GovConnect ID: <strong>{app.application_no}</strong></span>
              {app.external_ref && <span>Dept Ref: <strong className="text-indigo-600">{app.external_ref}</strong></span>}
            </div>
          </div>

          <span
            className={`text-xs font-extrabold px-4 py-2 rounded-full border self-start ${
              app.status === "APPROVED"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : app.status === "REJECTED"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {app.status.replace(/_/g, " ")}
          </span>
        </div>

        {/* Interoperability Verification Trace */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <Layers className="w-4 h-4" /> Interoperability API Gateway Trace:
          </div>
          <p className="text-slate-300 leading-relaxed">
            GovConnect routed payload to <strong>{app.department_name}</strong>. Cross-department data verified automatically via Interoperability Consent Protocol.
          </p>
        </div>

        {/* Status Timeline */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900">Application Progression Timeline</h3>
          <ApplicationTimeline history={app.status_history} currentStatus={app.status} />
        </div>

        {/* Form Data Summary */}
        {app.form_data && (
          <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
            <h4 className="font-bold text-slate-900">Submitted Information Summary:</h4>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
              {Object.entries(app.form_data).map(([k, v]) => (
                <div key={k}>
                  <span className="text-[10px] text-slate-400 block uppercase">{k}:</span>
                  <span className="text-slate-900 font-semibold">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
