import { dbState } from "../mock/dbState";
import { mockDelay, getCurrentUserFromStorage } from "./api";

export const citizenApi = {
  getProfile: async () => {
    await mockDelay(100);
    const currentUser = getCurrentUserFromStorage();
    if (!currentUser) throw new Error("Unauthorized");

    let profile = dbState.getProfileByUserId(currentUser.id);
    if (!profile) {
      profile = dbState.createOrUpdateProfile(currentUser.id, {});
    }
    return profile;
  },

  updateProfile: async (data: any) => {
    await mockDelay(200);
    const currentUser = getCurrentUserFromStorage();
    if (!currentUser) throw new Error("Unauthorized");

    const updated = dbState.createOrUpdateProfile(currentUser.id, data);
    return updated;
  },

  getDocuments: async () => {
    await mockDelay(100);
    return dbState.getDocuments();
  },

  uploadDocument: async (formData: FormData) => {
    await mockDelay(350);
    const currentUser = getCurrentUserFromStorage();
    if (!currentUser) throw new Error("Unauthorized");

    const docType = (formData.get("doc_type") as string) || "General Document";
    const title = (formData.get("title") as string) || `${docType} Upload`;
    const file = formData.get("file") as File;
    const fileName = file ? file.name : "uploaded_doc.pdf";

    const extracted_data = `OCR Extracted: Verified Document ${docType} for ${currentUser.full_name}, Upload Ref #${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    const newDoc = dbState.addDocument({
      doc_type: docType,
      title: title,
      file_path: fileName,
      status: "VERIFIED",
      extracted_data,
    });

    return newDoc;
  },

  deleteDocument: async (id: number) => {
    await mockDelay(150);
    return dbState.deleteDocument(id);
  },

  getConsents: async () => {
    await mockDelay(100);
    return dbState.getConsents();
  },

  grantConsent: async (data: any) => {
    await mockDelay(200);
    const currentUser = getCurrentUserFromStorage();
    if (!currentUser) throw new Error("Unauthorized");

    const profile = dbState.getProfileByUserId(currentUser.id);
    const citizenId = profile ? profile.id : 1;

    const newConsent = dbState.grantConsent({
      citizen_id: citizenId,
      requesting_dept: data.requesting_dept || "Department",
      source_dept: data.source_dept || "Revenue Department",
      fields_requested: data.fields_requested || ["Income Proof", "Identity Details"],
      purpose: data.purpose || "Verification for government service eligibility",
      status: "GRANTED",
    });

    return newConsent;
  },

  revokeConsent: async (id: number) => {
    await mockDelay(150);
    return dbState.revokeConsent(id);
  },

  getNotifications: async () => {
    await mockDelay(100);
    return dbState.getNotifications();
  },

  markNotificationRead: async (id: number) => {
    await mockDelay(100);
    return dbState.markNotificationRead(id);
  },
};
