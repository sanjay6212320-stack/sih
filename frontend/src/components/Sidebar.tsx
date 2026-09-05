import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Search,
  Bot,
  FileCheck,
  FolderOpen,
  ShieldAlert,
  UserCheck,
  Building2,
  Sliders,
  Activity,
  BarChart3,
  Lock,
  LogOut,
  Layers,
  Inbox
} from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: any;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  const citizenLinks: NavItem[] = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/services", label: "Find Services", icon: Search },
    { to: "/ai-assistant", label: "AI Service Assistant", icon: Bot, badge: "AI" },
    { to: "/applications", label: "My Applications", icon: FileCheck },
    { to: "/documents", label: "Documents Vault", icon: FolderOpen },
    { to: "/consents", label: "Data Consents", icon: ShieldAlert },
    { to: "/profile", label: "Citizen Profile", icon: UserCheck },
  ];

  const officerLinks: NavItem[] = [
    { to: "/officer/dashboard", label: "Department Workdesk", icon: Inbox },
    { to: "/applications", label: "Verify Applications", icon: FileCheck },
    { to: "/admin/integration-monitoring", label: "Department Integration Log", icon: Activity },
  ];

  const adminLinks: NavItem[] = [
    { to: "/admin/dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
    { to: "/admin/departments", label: "Government Depts", icon: Building2 },
    { to: "/admin/services", label: "Services Registry", icon: Sliders },
    { to: "/admin/integration-monitoring", label: "Gateway Monitor", icon: Activity, badge: "LIVE" },
    { to: "/admin/analytics", label: "Analytics & Trends", icon: BarChart3 },
    { to: "/admin/audit-logs", label: "Audit Trails", icon: Lock },
  ];

  const links: NavItem[] = role === "ADMIN" ? adminLinks : role === "OFFICER" ? officerLinks : citizenLinks;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
      <div className="space-y-6">
        <div>
          <h2 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            {role === "ADMIN" ? "ADMINISTRATION PORTAL" : role === "OFFICER" ? "DEPARTMENT WORKDESK" : "CITIZEN SERVICES"}
          </h2>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-amber-500/20 text-amber-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-amber-500/30">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Integration Layer Banner */}
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Layers className="w-4 h-4 text-emerald-400" /> API Gateway Integration
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Connected to 6 Government Systems via Interoperability Adapters.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Synchronized
          </div>
        </div>
      </div>
    </aside>
  );
};
