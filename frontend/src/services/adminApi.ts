import { dbState } from "../mock/dbState";
import { mockDelay } from "./api";

export const adminApi = {
  getDashboard: async () => {
    await mockDelay(100);
    const users = dbState.getUsers();
    const apps = dbState.getApplications();
    const depts = dbState.getDepartments();
    const logs = dbState.getIntegrationLogs(100);

    const pending = apps.filter((a) => a.status === "UNDER_VERIFICATION" || a.status === "ROUTED_TO_DEPT").length;
    const approved = apps.filter((a) => a.status === "APPROVED").length;
    const rejected = apps.filter((a) => a.status === "REJECTED").length;

    const totalLogs = logs.length;
    const successLogs = logs.filter((l) => l.status === "SUCCESS").length;
    const successRate = totalLogs ? Math.round((successLogs / totalLogs) * 100) : 100;

    return {
      total_citizens: users.filter((u) => u.role === "CITIZEN").length,
      total_officers: users.filter((u) => u.role === "OFFICER").length,
      total_applications: apps.length,
      pending_applications: pending,
      approved_applications: approved,
      rejected_applications: rejected,
      total_departments: depts.length,
      gateway_success_rate: `${successRate}%`,
      failure_simulation_active: dbState.getFailureSimulation(),
    };
  },

  getAnalytics: async () => {
    await mockDelay(100);
    const apps = dbState.getApplications();
    const services = dbState.getServices();
    const serviceMap = new Map(services.map((s) => [s.id, s.title]));

    const appByServiceMap = new Map<string, number>();
    for (const app of apps) {
      const title = serviceMap.get(app.service_id) || "Other Scheme";
      appByServiceMap.set(title, (appByServiceMap.get(title) || 0) + 1);
    }

    const applications_by_service = Array.from(appByServiceMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));

    return {
      applications_by_service,
      status_breakdown: [
        { name: "Approved", value: apps.filter((a) => a.status === "APPROVED").length },
        { name: "Pending", value: apps.filter((a) => a.status === "UNDER_VERIFICATION" || a.status === "ROUTED_TO_DEPT").length },
        { name: "Rejected", value: apps.filter((a) => a.status === "REJECTED").length },
      ],
      monthly_trend: [
        { month: "Jan", applications: 12 },
        { month: "Feb", applications: 19 },
        { month: "Mar", applications: 28 },
        { month: "Apr", applications: 45 },
      ],
    };
  },

  getUsers: async () => {
    await mockDelay(100);
    const users = dbState.getUsers();
    return users.map((u) => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });
  },

  getAuditLogs: async () => {
    await mockDelay(100);
    const history = dbState.getStatusHistory();
    return history.map((h: any) => ({
      id: h.id,
      timestamp: h.timestamp || h.created_at || new Date().toISOString(),
      actor: h.actor_role,
      action: h.step_name,
      details: h.remarks,
      status: h.status,
    }));
  },

  getIntegrationHealth: async () => {
    await mockDelay(100);
    const logs = dbState.getIntegrationLogs(100);
    const depts = dbState.getDepartments();

    const totalRequests = logs.length;
    const successfulRequests = logs.filter((l) => l.status === "SUCCESS").length;
    const failedRequests = logs.filter((l) => l.status === "FAILED").length;
    const totalLatency = logs.reduce((acc, l) => acc + (l.latency_ms || 0), 0);
    const avgLatency = totalRequests ? Math.round((totalLatency / totalRequests) * 10) / 10 : 45.0;

    return {
      status: "OPERATIONAL",
      gateway_version: "2.4.0-STABLE",
      total_requests: totalRequests,
      successful_requests: successfulRequests,
      failed_requests: failedRequests,
      avg_latency_ms: avgLatency,
      failure_simulation_active: dbState.getFailureSimulation(),
      connected_departments_count: depts.length,
    };
  },

  getIntegrationLogs: async (limit: number = 50) => {
    await mockDelay(100);
    return dbState.getIntegrationLogs(limit);
  },

  getDepartments: async () => {
    await mockDelay(100);
    return dbState.getDepartments();
  },

  toggleFailureSimulation: async (enabled: boolean) => {
    await mockDelay(150);
    dbState.setFailureSimulation(enabled);
    return {
      success: true,
      failure_simulation_active: enabled,
      message: enabled
        ? "Failure simulation enabled: Revenue API will trigger 504 timeout on submission to test Gateway retries."
        : "Failure simulation disabled: All Gateway APIs operational.",
    };
  },
};
