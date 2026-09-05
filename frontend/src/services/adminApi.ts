import { api } from "./api";

export const adminApi = {
  getDashboard: async () => {
    const res = await api.get("/admin/dashboard");
    return res.data;
  },
  getAnalytics: async () => {
    const res = await api.get("/admin/analytics");
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get("/admin/users");
    return res.data;
  },
  getAuditLogs: async () => {
    const res = await api.get("/admin/audit-logs");
    return res.data;
  },
  getIntegrationHealth: async () => {
    const res = await api.get("/integration/health");
    return res.data;
  },
  getIntegrationLogs: async (limit: number = 50) => {
    const res = await api.get("/integration/logs", { params: { limit } });
    return res.data;
  },
  getDepartments: async () => {
    const res = await api.get("/integration/departments");
    return res.data;
  },
  toggleFailureSimulation: async (enabled: boolean) => {
    const res = await api.post("/integration/simulate-failure", null, { params: { enabled } });
    return res.data;
  },
};
