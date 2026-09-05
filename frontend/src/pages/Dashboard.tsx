import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { applicationApi } from "../services/applicationApi";
import { citizenApi } from "../services/citizenApi";
import { serviceApi } from "../services/serviceApi";
import { Application, CitizenDocument, GovernmentService, CitizenProfile } from "../types";
import {
  FileCheck,
  AlertCircle,
  CheckCircle2,
  FolderOpen,
  Bot,
  Search,
  ArrowRight,
  Shield,
  Building2,
  Clock,
  Plus
} from "lucide-react";
import { ServiceCard } from "../components/ServiceCard";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<CitizenDocument[]>([]);
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [services, setServices] = useState<GovernmentService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsData, docsData, profileData, servicesData] = await Promise.all([
          applicationApi.getApplications(),
          citizenApi.getDocuments(),
          citizenApi.getProfile(),
          serviceApi.getServices(),
        ]);
        setApplications(appsData);
        setDocuments(docsData);
        setProfile(profileData);
        setServices(servicesData);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeApps = applications.filter((a) => !["APPROVED", "REJECTED"].includes(a.status));
  const approvedApps = applications.filter((a) => a.status === "APPROVED");
  const pendingActions = applications.filter((a) => a.status === "ACTION_REQUIRED");

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-bold">
              <Shield className="w-3.5 h-3.5" /> Unified Citizen Profile Verified
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {user?.full_name || "Citizen"}!
            </h1>
            {profile && (
              <p className="text-xs text-slate-300 flex flex-wrap gap-4 pt-1">
                <span>Occupation: <strong className="text-white">{profile.occupation}</strong></span>
                <span>Annual Income: <strong className="text-emerald-400">₹{profile.annual_income?.toLocaleString()} INR</strong></span>
                <span>District: <strong className="text-white">{profile.district}, {profile.state}</strong></span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/ai-assistant"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-slate-950" /> Ask AI Scheme Assistant
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Applications</span>
            <FileCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{activeApps.length}</div>
          <p className="text-[11px] text-slate-500">In department processing</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Actions</span>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{pendingActions.length}</div>
          <p className="text-[11px] text-slate-500">Citizen input required</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Approved Schemes</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{approvedApps.length}</div>
          <p className="text-[11px] text-slate-500">Benefits granted</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Documents</span>
            <FolderOpen className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{documents.length}</div>
          <p className="text-[11px] text-slate-500">Stored in Document Vault</p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" /> Live Tracked Applications
              </h2>
              <Link to="/applications" className="text-xs font-semibold text-indigo-600 hover:underline">
                View All ({applications.length})
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-3">
                <FileCheck className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs">No active applications submitted yet.</p>
                <Link
                  to="/services"
                  className="inline-block px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow"
                >
                  Browse Government Services
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.slice(0, 4).map((app) => (
                  <div key={app.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{app.service_title}</span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                          {app.application_no}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" /> {app.department_name}
                        </span>
                        {app.external_ref && (
                          <span className="text-indigo-600 font-mono font-semibold">
                            Ref: {app.external_ref}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${
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
                        className="p-1.5 text-slate-400 hover:text-slate-900 transition"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/ai-assistant"
              className="p-5 bg-gradient-to-tr from-indigo-900 to-slate-900 text-white rounded-2xl border border-indigo-800 shadow-md hover:scale-[1.01] transition flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-white">AI Scheme Discovery</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Type your need in plain language. AI matches criteria & checks eligibility instantly.
                </p>
              </div>
            </Link>

            <Link
              to="/documents"
              className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:scale-[1.01] transition flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900">Document Vault</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload & store Income, Aadhaar, and Student proofs for 1-click scheme applications.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column: Recommended Services */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-500" /> Recommended For You
              </h2>
              <Link to="/services" className="text-xs font-semibold text-indigo-600 hover:underline">
                Catalog
              </Link>
            </div>

            <div className="space-y-3">
              {services.slice(0, 3).map((srv) => (
                <div
                  key={srv.id}
                  className="p-3.5 border border-slate-100 rounded-xl hover:border-indigo-200 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {srv.category}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {srv.processing_days} Days
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{srv.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{srv.description}</p>
                  <Link
                    to={`/application/apply/${srv.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-1"
                  >
                    Apply Scheme <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
