import { api } from "./api";

export const serviceApi = {
  getServices: async (category?: string, department_id?: number) => {
    const params: any = {};
    if (category) params.category = category;
    if (department_id) params.department_id = department_id;
    const res = await api.get("/services", { params });
    return res.data;
  },
  searchServices: async (q: string) => {
    const res = await api.get("/services/search", { params: { q } });
    return res.data;
  },
  getServiceDetails: async (id: number) => {
    const res = await api.get(`/services/${id}`);
    return res.data;
  },
  checkEligibility: async (id: number, profileData: any) => {
    const res = await api.post(`/services/${id}/eligibility`, profileData);
    return res.data;
  },
};
