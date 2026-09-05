import { api } from "./api";

export const aiApi = {
  chat: async (message: string, language: string = "en") => {
    const res = await api.post("/ai/chat", { message, language });
    return res.data;
  },
};
