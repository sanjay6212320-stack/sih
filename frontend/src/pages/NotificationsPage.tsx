import React, { useState, useEffect } from "react";
import { citizenApi } from "../services/citizenApi";
import { NotificationItem } from "../types";
import { Bell, CheckCircle2, AlertTriangle, Info } from "lucide-react";

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    try {
      const data = await citizenApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: number) => {
    await citizenApi.markNotificationRead(id);
    fetchNotifs();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Notification Center</h1>
        <p className="text-xs text-slate-500">Real-time alerts, department updates, and status notifications.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-500" /> Notifications Feed ({notifications.length})
        </h3>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">No notifications.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && handleMarkRead(n.id)}
                className={`py-4 flex items-start gap-3.5 cursor-pointer p-3 rounded-xl transition ${
                  n.is_read ? "bg-white" : "bg-indigo-50/50"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {n.type === "SUCCESS" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : n.type === "WARNING" ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Info className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
