import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../services/adminApi";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Building2,
  Activity,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ArrowUpRight
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="text-center py-12 text-xs text-slate-400">Loading admin dashboard analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-full text-xs font-bold">
            <LayoutDashboard className="w-3.5 h-3.5" /> National Interoperability Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">GovConnect Master Administration</h1>
          <p className="text-xs text-slate-300">
            Real-time telemetry monitoring API Gateway performance across 6 departmental backends.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Registered Citizens</span>
          <div className="text-3xl font-black text-slate-900">{data.total_citizens}</div>
          <p className="text-[11px] text-slate-500">Verified National Accounts</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Applications</span>
          <div className="text-3xl font-black text-indigo-600">{data.total_applications}</div>
          <p className="text-[11px] text-slate-500">{data.active_applications} Currently Active</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Connected Departments</span>
          <div className="text-3xl font-black text-emerald-600">{data.connected_departments}</div>
          <p className="text-[11px] text-slate-500">Adapters Operational</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gateway Transactions</span>
          <div className="text-3xl font-black text-amber-600">{data.total_api_requests}</div>
          <p className="text-[11px] text-slate-500">{data.failed_api_requests} Failed (Retried)</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/integration-monitoring"
          className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md hover:scale-[1.01] transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Live Gateway Monitor</span>
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xs text-slate-300">
            Inspect topology status map, test API failure simulations & view retry logs.
          </p>
        </Link>

        <Link
          to="/admin/analytics"
          className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:scale-[1.01] transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Analytics & Trends</span>
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-xs text-slate-600">
            Cross-department throughput charts, latency statistics & scheme demand analytics.
          </p>
        </Link>

        <Link
          to="/admin/departments"
          className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:scale-[1.01] transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Department Registry</span>
            <Building2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xs text-slate-600">
            Manage mock department endpoint configurations & adapter settings.
          </p>
        </Link>
      </div>
    </div>
  );
};
