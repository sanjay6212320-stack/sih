import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { applicationApi } from "../services/applicationApi";
import { Application } from "../types";
import { FileCheck, Building2, Clock, CheckCircle2, AlertCircle, ArrowRight, Search } from "lucide-react";

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const data = await applicationApi.getApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications.filter((app) => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "PROCESSING") return !["APPROVED", "REJECTED"].includes(app.status);
    if (statusFilter === "APPROVED") return app.status === "APPROVED";
    if (statusFilter === "ACTION_REQUIRED") return app.status === "ACTION_REQUIRED";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Application Tracking Portal</h1>
          <p className="text-xs text-slate-500">
            Real-time status synchronization across all connected government department backends.
          </p>
        </div>
        <Link
          to="/services"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition self-start"
        >
          + New Service Application
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {["ALL", "PROCESSING", "APPROVED", "ACTION_REQUIRED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              statusFilter === tab
                ? "bg-slate-900 text-amber-400 shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Synchronizing applications with department APIs...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
          No applications found in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-300 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900">{app.service_title}</span>
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200">
                      {app.application_no}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {app.department_name}
                    </span>
                    {app.external_ref && (
                      <span className="text-indigo-600 font-mono font-semibold">
                        Dept Ref: {app.external_ref}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-extrabold px-3 py-1.5 rounded-full border ${
                      app.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : app.status === "REJECTED"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {app.status.replace(/_/g, " ")}
                  </span>
                  <Link
                    to={`/applications/${app.id}`}
                    className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition flex items-center gap-1"
                  >
                    Track <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Current Step: <strong className="text-slate-800">{app.current_step}</strong></span>
                <span>Submitted: {new Date(app.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
