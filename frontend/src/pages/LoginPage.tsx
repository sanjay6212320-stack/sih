import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building2, Lock, Mail, UserCheck, ShieldAlert, ArrowRight, KeyRound } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail: string, demoPw: string) => {
    setEmail(demoEmail);
    setPassword(demoPw);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Sign In to GovConnect</h2>
          <p className="text-xs text-slate-400">Unified Government Service Access Gateway</p>
        </div>

        {/* Quick Demo Switcher Card */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <KeyRound className="w-4 h-4" /> Quick Demo Role Switcher:
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => setDemoCredentials("citizen@govconnect.in", "Citizen@123")}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-left text-slate-200 transition"
            >
              <div className="font-bold text-emerald-400">👤 Citizen</div>
              <div className="text-[10px] text-slate-400 truncate">Ramesh Kumar (Student)</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("officer.edu@govconnect.in", "Officer@123")}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-left text-slate-200 transition"
            >
              <div className="font-bold text-amber-400">🏛️ Education Officer</div>
              <div className="text-[10px] text-slate-400 truncate">Dr. Ramanathan</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("officer.rev@govconnect.in", "Officer@123")}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-left text-slate-200 transition"
            >
              <div className="font-bold text-sky-400">📜 Revenue Officer</div>
              <div className="text-[10px] text-slate-400 truncate">Meenakshi (VAO)</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("admin@govconnect.in", "Admin@123")}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-left text-slate-200 transition"
            >
              <div className="font-bold text-rose-400">🛡️ System Admin</div>
              <div className="text-[10px] text-slate-400 truncate">Platform Admin</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email / Mobile Number</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@govconnect.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          New citizen user?{" "}
          <Link to="/register" className="text-amber-400 font-bold hover:underline">
            Register Citizen Account
          </Link>
        </p>
      </div>
    </div>
  );
};
