import { api } from "./api";

export const applicationApi = {
  createApplication: async (payload: { service_id: number; form_data: any; granted_consent_dept?: string }) => {
    const res = await api.post("/applications", payload);
    return res.data;
  },
  getApplications: async () => {
    const res = await api.get("/applications");
    return res.data;
  },
  getApplicationById: async (id: number) => {
    const res = await api.get(`/applications/${id}`);
    return res.data;
  },
  updateStatus: async (id: number, statusData: { status: string; remarks: string; current_step?: string }) => {
    const res = await api.put(`/applications/${id}/status`, statusData);
    return res.data;
  },
};
