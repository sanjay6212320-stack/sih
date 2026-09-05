import { api } from "./api";

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  },
  register: async (userData: any) => {
    const res = await api.post("/auth/register", userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};
