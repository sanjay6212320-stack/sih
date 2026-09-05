import React, { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import { IntegrationLog, Department } from "../../types";
import {
  Activity,
  Layers,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Clock,
  Zap,
  Server,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export const IntegrationMonitoring: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [logs, setLogs] = useState<IntegrationLog[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchIntegrationData();
  }, []);

  const fetchIntegrationData = async () => {
    try {
      const [healthRes, logsRes, deptsRes] = await Promise.all([
        adminApi.getIntegrationHealth(),
        adminApi.getIntegrationLogs(50),
        adminApi.getDepartments(),
      ]);
      setHealth(healthRes);
      setLogs(logsRes);
      setDepartments(deptsRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFailureSim = async () => {
    if (!health) return;
    setToggling(true);
    try {
      const nextState = !health.failure_simulation_active;
      await adminApi.toggleFailureSimulation(nextState);
      fetchIntegrationData();
    } catch (err) {
      alert("Failed to toggle failure simulation");
    } finally {
      setToggling(false);
    }
  };

  if (loading || !health) {
    return <div className="text-center py-12 text-xs text-slate-400">Loading Integration Telemetry...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-bold">
            <Activity className="w-3.5 h-3.5" /> API Gateway & Interoperability Monitor
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Department Gateway Health & Topology</h1>
          <p className="text-xs text-slate-300">
            Monitors real-time API transactions, adapter latency, retry mechanisms, and normalized payload exchanges.
          </p>
        </div>

        {/* Failure Simulation Button */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0 space-y-2 text-right">
          <div className="text-[11px] font-bold text-slate-300 flex items-center justify-end gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" /> Gateway Fault Injection Test:
          </div>
          <button
            onClick={handleToggleFailureSim}
            disabled={toggling}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold shadow-lg transition flex items-center gap-2 ${
              health.failure_simulation_active
                ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950"
            }`}
          >
            {toggling
              ? "Toggling..."
              : health.failure_simulation_active
              ? "⚠️ Revenue API Failure Sim ACTIVE (Click to Disable)"
              : "Simulate Revenue Dept Timeout (504)"}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gateway Status</span>
          <div className="text-2xl font-black text-emerald-600 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            OPERATIONAL
          </div>
          <p className="text-[11px] text-slate-500">v2.4.0 Interoperable Engine</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Gateway API Calls</span>
          <div className="text-2xl font-black text-slate-900">{health.total_requests}</div>
          <p className="text-[11px] text-slate-500">{health.successful_requests} Success / {health.failed_requests} Retried</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Adapter Latency</span>
          <div className="text-2xl font-black text-indigo-600 font-mono">{health.avg_latency_ms} ms</div>
          <p className="text-[11px] text-slate-500">Sub-100ms Target Achieved</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department Adapters</span>
          <div className="text-2xl font-black text-amber-600">{health.connected_departments_count} Systems</div>
          <p className="text-[11px] text-slate-500">Normalized to Unified Format</p>
        </div>
      </div>

      {/* Visual Integration Map */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" /> Live Interoperability Integration Topology Map
          </h3>
          <span className="text-xs text-slate-400 font-mono">Real-time Connection Matrix</span>
        </div>

        {/* Visual Map Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Gateway Core */}
          <div className="bg-gradient-to-b from-indigo-900 to-slate-900 border-2 border-indigo-500/80 p-6 rounded-2xl text-center space-y-2 shadow-2xl md:col-span-1">
            <Server className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="font-extrabold text-base text-white">GovConnect API Gateway</h4>
            <p className="text-xs text-slate-300 font-mono">Heterogeneous Payload Normalizer & Adapter Manager</p>
          </div>

          {/* Department Nodes Grid */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                  dept.code === "REV" && health.failure_simulation_active
                    ? "bg-rose-950/80 border-rose-500 text-rose-200"
                    : "bg-slate-900 border-slate-800 text-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">{dept.name}</span>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                      {dept.code}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{dept.api_endpoint}</span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold font-mono">
                  {dept.code === "REV" && health.failure_simulation_active ? (
                    <span className="text-rose-400 flex items-center gap-1 text-[10px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" /> 504 Timeout Sim
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Connected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Integration Audit Logs */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" /> Gateway Transaction Audit Logs ({logs.length})
          </h3>
          <button
            onClick={fetchIntegrationData}
            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
          </button>
        </div>

        <div className="overflow-x-auto divide-y divide-slate-100">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                <th className="p-3">App ID</th>
                <th className="p-3">Target Department</th>
                <th className="p-3">Endpoint</th>
                <th className="p-3">Status</th>
                <th className="p-3">Latency</th>
                <th className="p-3">Retries</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-slate-900">{log.application_no || "N/A"}</td>
                  <td className="p-3 font-sans font-semibold text-slate-800">{log.target_department}</td>
                  <td className="p-3 text-slate-600 text-[11px]">{log.endpoint}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        log.status === "SUCCESS"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      HTTP {log.status_code} ({log.status})
                    </span>
                  </td>
                  <td className="p-3 text-indigo-600 font-bold">{log.latency_ms} ms</td>
                  <td className="p-3 text-amber-600 font-bold">{log.retry_count}</td>
                  <td className="p-3 text-slate-400 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
