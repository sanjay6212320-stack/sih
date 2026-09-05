import { api } from "./api";

export const citizenApi = {
  getProfile: async () => {
    const res = await api.get("/citizen/profile");
    return res.data;
  },
  updateProfile: async (data: any) => {
    const res = await api.put("/citizen/profile", data);
    return res.data;
  },
  getDocuments: async () => {
    const res = await api.get("/documents");
    return res.data;
  },
  uploadDocument: async (formData: FormData) => {
    const res = await api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  deleteDocument: async (id: number) => {
    const res = await api.delete(`/documents/${id}`);
    return res.data;
  },
  getConsents: async () => {
    const res = await api.get("/consent");
    return res.data;
  },
  grantConsent: async (data: any) => {
    const res = await api.post("/consent", data);
    return res.data;
  },
  revokeConsent: async (id: number) => {
    const res = await api.delete(`/consent/${id}`);
    return res.data;
  },
  getNotifications: async () => {
    const res = await api.get("/notifications");
    return res.data;
  },
  markNotificationRead: async (id: number) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },
};
