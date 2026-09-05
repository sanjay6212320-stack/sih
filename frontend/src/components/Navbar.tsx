import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { citizenApi } from "../services/citizenApi";
import { NotificationItem } from "../types";
import {
  Building2,
  Bell,
  User as UserIcon,
  LogOut,
  Globe,
  Shield,
  Search,
  CheckCircle,
} from "lucide-react";

interface NavbarProps {
  onLanguageChange?: (lang: string) => void;
  currentLang?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onLanguageChange, currentLang = "en" }) => {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  useEffect(() => {
    if (user) {
      citizenApi.getNotifications().then(setNotifications).catch(() => {});
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Banner */}
      <div className="bg-slate-950 px-4 py-1 text-xs text-slate-400 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1 font-medium text-slate-300">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            National Digital Service Interoperability Platform
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">National Digital Service Standard</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
            >
              <option value="en" className="bg-slate-900">English</option>
              <option value="hi" className="bg-slate-900">हिन्दी (Hindi)</option>
              <option value="ta" className="bg-slate-900">தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-emerald-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                GovConnect
              </span>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide font-medium">
              Unified Government Service Interoperability Platform
            </p>
          </div>
        </Link>

        {/* Navigation CTAs */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Role Indicator Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800/90 border border-slate-700/80 rounded-lg text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    role === "ADMIN"
                      ? "bg-rose-400 animate-pulse"
                      : role === "OFFICER"
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  }`}
                />
                <span className="font-semibold text-slate-200">
                  {role === "ADMIN"
                    ? "SYSTEM ADMIN"
                    : role === "OFFICER"
                    ? `DEPT OFFICER (${user.department_code || "EDU"})`
                    : "VERIFIED CITIZEN"}
                </span>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifPanel(!showNotifPanel)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Drawer Dropdown */}
                {showNotifPanel && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-200 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-400" /> Notifications & Status Alerts
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{notifications.length} Total</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 text-xs">No active notifications</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-3 hover:bg-slate-800/50 transition">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                                <span className="text-[10px] text-slate-500 mt-1 inline-block">
                                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 bg-slate-950 border-t border-slate-800 text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifPanel(false)}
                        className="text-xs font-medium text-amber-400 hover:underline"
                      >
                        View Notification Center
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Menu */}
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="text-right hidden md:block">
                  <div className="text-xs font-semibold text-slate-200">{user.full_name}</div>
                  <div className="text-[10px] text-slate-400">{user.email}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow transition"
              >
                Citizen Portal
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
