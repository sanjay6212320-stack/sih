import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Bot,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  Activity,
  Globe,
  Lock,
  ChevronRight,
  Sparkles
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-amber-500/20 via-indigo-500/20 to-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8">
          {/* Platform Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-amber-400 shadow-xl">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Unified Digital Government Technology Platform</span>
            <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded text-[10px] font-extrabold">LIVE PLATFORM</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            One Platform. Multiple Government Services.{" "}
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-300 bg-clip-text text-transparent">
              One Seamless Experience.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Connect fragmented digital government services through secure interoperability, intelligent service discovery and unified application tracking.
          </p>

          {/* AI Search Quick Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex items-center">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="What government scheme or service do you need? (e.g. Scholarship, Pension, Income Certificate)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 text-white pl-12 pr-32 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/80 shadow-2xl placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
              >
                Search <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/services"
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl transition flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> Explore 25+ Services
            </Link>
            <Link
              to="/ai-assistant"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 shadow-xl transition flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-amber-400" /> Ask AI Service Assistant
            </Link>
          </div>

          {/* Key Platform Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12">
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
              <span className="text-3xl font-black text-amber-400">25+</span>
              <p className="text-xs text-slate-400 mt-1 font-medium">Government Services</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
              <span className="text-3xl font-black text-emerald-400">6</span>
              <p className="text-xs text-slate-400 mt-1 font-medium">Connected Departments</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
              <span className="text-3xl font-black text-indigo-400">1</span>
              <p className="text-xs text-slate-400 mt-1 font-medium">Unified Dashboard</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
              <span className="text-3xl font-black text-sky-400">24/7</span>
              <p className="text-xs text-slate-400 mt-1 font-medium">Live Interoperability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interoperability Architecture Demonstration Section */}
      <section className="py-20 bg-slate-950 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Core Interoperability Solution
            </span>
            <h2 className="text-3xl font-bold text-white">
              “We Are Not Replacing Existing Systems. We Are Connecting Them.”
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              GovConnect acts as a secure bridge that allows existing government digital platforms to communicate and exchange permitted information through standardized APIs.
            </p>
          </div>

          {/* Visual Diagram */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              {/* Citizen */}
              <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto font-bold text-xl">
                  👤
                </div>
                <h4 className="font-bold text-sm text-slate-100">Citizen</h4>
                <p className="text-[11px] text-slate-400">Single Login & Citizen Profile</p>
              </div>

              <div className="hidden md:flex justify-center text-slate-600">
                <ChevronRight className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>

              {/* GovConnect Gateway */}
              <div className="bg-gradient-to-b from-indigo-950 to-slate-900 border-2 border-indigo-500/60 p-6 rounded-2xl text-center space-y-3 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center mx-auto font-bold">
                  <Layers className="w-6 h-6 text-indigo-400" />
                </div>
                <h4 className="font-extrabold text-sm text-white">GovConnect Gateway</h4>
                <div className="space-y-1 text-[10px] font-mono text-slate-300">
                  <p className="bg-slate-950 py-1 px-2 rounded border border-slate-800">Adapter Normalization</p>
                  <p className="bg-slate-950 py-1 px-2 rounded border border-slate-800">Consent Engine</p>
                </div>
              </div>

              <div className="hidden md:flex justify-center text-slate-600">
                <ChevronRight className="w-8 h-8 text-indigo-400 animate-pulse" />
              </div>

              {/* Fragmented Department APIs */}
              <div className="space-y-3">
                <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Education Dept</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Revenue Dept</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Health Dept</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white">Everything You Need For Digital Service Access</h3>
          <p className="text-xs text-slate-400">Designed with National Public Service Standards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700/80 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="font-bold text-base text-slate-100">AI Scheme Recommender</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Describe your need in natural English, Hindi, or Tamil. AI extracts intent and matches exact scheme eligibility.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/80 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="font-bold text-base text-slate-100">Explicit Consent Manager</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No silent data transfers. Citizens explicitly approve field-by-field inter-department data sharing requests.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/80 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="font-bold text-base text-slate-100">Real-Time Status Synchronization</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track status across multiple department backends with unified application reference IDs (`GC-2026-XXXX`).
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-500">
        <p>GovConnect — Unified Government Service Interoperability Platform</p>
      </footer>
    </div>
  );
};
