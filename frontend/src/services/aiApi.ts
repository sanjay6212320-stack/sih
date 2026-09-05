import { AIAssistant } from "../mock/aiAssistant";
import { dbState } from "../mock/dbState";
import { mockDelay, getCurrentUserFromStorage } from "./api";

export const aiApi = {
  chat: async (message: string, language: string = "en") => {
    await mockDelay(250);
    const currentUser = getCurrentUserFromStorage();
    let profile = {};
    if (currentUser) {
      profile = dbState.getProfileByUserId(currentUser.id) || {};
    }
    const response = AIAssistant.processQuery(message, profile);
    return response;
  },
};
