import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { applicationApi } from "../services/applicationApi";
import { Application } from "../types";
import {
  Inbox,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  FileCheck,
  ShieldCheck,
  MessageSquare
} from "lucide-react";

export const OfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusInput, setStatusInput] = useState<Application["status"]>("APPROVED");
  const [remarksInput, setRemarksInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfficerApps();
  }, []);

  const fetchOfficerApps = async () => {
    try {
      const data = await applicationApi.getApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    setUpdating(true);
    try {
      await applicationApi.updateStatus(selectedApp.id, {
        status: statusInput,
        remarks: remarksInput || `Application status updated to ${statusInput} by ${user?.full_name}`,
      });
      setSelectedApp(null);
      setRemarksInput("");
      fetchOfficerApps();
    } catch (err) {
      alert("Failed to update application status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Officer Workdesk Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" /> Department Workdesk ({user?.department_code || "EDU"})
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Officer Application Verification Desk</h1>
          <p className="text-xs text-slate-300">
            Welcome, <strong>{user?.full_name}</strong>. Review and process incoming multi-department citizen applications.
          </p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Inbox className="w-5 h-5 text-indigo-600" /> Incoming Applications ({applications.length})
        </h3>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading department queue...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">No applications assigned to workdesk.</div>
        ) : (
          <div className="overflow-x-auto divide-y divide-slate-100">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                  <th className="p-3">GovConnect ID</th>
                  <th className="p-3">Scheme Title</th>
                  <th className="p-3">External Ref</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{app.application_no}</td>
                    <td className="p-3 font-semibold text-slate-800">{app.service_title}</td>
                    <td className="p-3 font-mono text-indigo-600 font-bold">{app.external_ref || "N/A"}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          app.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : app.status === "REJECTED"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition"
                      >
                        Verify & Process
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Officer Action Modal Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  Officer Verification Desk
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Process Application #{selectedApp.application_no}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p><strong>Service:</strong> {selectedApp.service_title}</p>
              <p><strong>External Reference:</strong> <span className="font-mono text-indigo-600">{selectedApp.external_ref}</span></p>
              <p><strong>Current Step:</strong> {selectedApp.current_step}</p>
              {selectedApp.form_data && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold block mb-1">Submitted Form Payload:</span>
                  <pre className="text-[10px] font-mono bg-white p-2 rounded border border-slate-200 overflow-x-auto">
                    {JSON.stringify(selectedApp.form_data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Update Status Decision</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as Application["status"])}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="APPROVED">APPROVED — Grant Scheme Benefit</option>
                  <option value="UNDER_VERIFICATION">UNDER VERIFICATION — Queue for Field Inspection</option>
                  <option value="ACTION_REQUIRED">ACTION REQUIRED — Request Missing Document</option>
                  <option value="REJECTED">REJECTED — Application Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Remarks & Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter official verification remarks..."
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition"
              >
                {updating ? "Recording Officer Decision..." : "Submit Status Update"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
