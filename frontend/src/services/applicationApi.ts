import { dbState } from "../mock/dbState";
import { APIGateway } from "../mock/apiGateway";
import { mockDelay, getCurrentUserFromStorage } from "./api";
import { Application } from "../types";

export const applicationApi = {
  createApplication: async (payload: { service_id: number; form_data: any; granted_consent_dept?: string }): Promise<Application> => {
    await mockDelay(300);
    const currentUser = getCurrentUserFromStorage();
    if (!currentUser) throw new Error("Unauthorized");

    const profile = dbState.getProfileByUserId(currentUser.id);
    const citizenId = profile ? profile.id : 1;
    const service = dbState.getServiceById(payload.service_id);
    if (!service) throw new Error("Service not found");

    const dept = dbState.getDepartmentById(service.department_id);
    const deptCode = dept ? dept.code : "GEN";
    const deptName = dept ? dept.name : "Government Department";

    // 1. Create Application Record
    const app = dbState.createApplication({
      citizen_id: citizenId,
      service_id: service.id,
      service_title: service.title,
      department_id: service.department_id,
      department_name: deptName,
      department_code: deptCode,
      external_ref: "PENDING",
      status: "UNDER_VERIFICATION",
      current_step: "Department Adapter Dispatch & Verification",
      form_data: payload.form_data,
      remarks: "Application submitted via GovConnect Citizen Portal",
    });

    // 2. Dispatch via API Gateway
    const citizenData = {
      full_name: currentUser.full_name,
      aadhaar_last4: profile ? profile.aadhaar_last4 : "9821",
    };
    const dispatchRes = APIGateway.dispatchApplication(
      app.id,
      app.application_no,
      deptCode,
      citizenData,
      payload.form_data
    );

    // Update with external ref
    app.external_ref = dispatchRes.external_ref;
    dbState.updateApplicationStatus(
      app.id,
      "UNDER_VERIFICATION",
      `Dispatched to ${deptName} Adapter (Ref: ${dispatchRes.external_ref})`,
      "Document & Cross-Department Verification",
      "GATEWAY"
    );

    // 3. Optional Auto Consent Grant
    if (payload.granted_consent_dept) {
      dbState.grantConsent({
        citizen_id: citizenId,
        requesting_dept: deptName,
        source_dept: payload.granted_consent_dept,
        fields_requested: ["Income Certificate", "Annual Income", "Verification Proof"],
        purpose: `Inter-department data sharing for ${service.title}`,
        status: "GRANTED",
      });
    }

    // 4. Create Notification
    dbState.addNotification({
      title: "Application Dispatched",
      message: `Application #${app.application_no} routed to ${deptName}.`,
      type: "SUCCESS",
    });

    return app;
  },

  getApplications: async (): Promise<Application[]> => {
    await mockDelay(100);
    const currentUser = getCurrentUserFromStorage();
    if (!currentUser) return [];

    const allApps = dbState.getApplications();

    if (currentUser.role === "CITIZEN") {
      const profile = dbState.getProfileByUserId(currentUser.id);
      if (profile) {
        return allApps.filter((a) => a.citizen_id === profile.id);
      }
    } else if (currentUser.role === "OFFICER" && currentUser.department_code) {
      const dept = dbState.getDepartmentByCode(currentUser.department_code);
      if (dept) {
        return allApps.filter((a) => a.department_id === dept.id);
      }
    }

    return allApps;
  },

  getApplicationById: async (id: number): Promise<Application> => {
    await mockDelay(100);
    const app = dbState.getApplicationById(id);
    if (!app) throw new Error("Application not found");

    return app;
  },

  updateStatus: async (id: number, statusData: { status: Application["status"]; remarks: string; current_step?: string }): Promise<Application> => {
    await mockDelay(200);
    const currentUser = getCurrentUserFromStorage();
    const actorRole = currentUser ? currentUser.role : "OFFICER";

    const updated = dbState.updateApplicationStatus(
      id,
      statusData.status,
      statusData.remarks,
      statusData.current_step,
      actorRole
    );

    if (!updated) throw new Error("Application not found");

    // Notify citizen
    const profiles = dbState.getProfiles();
    const profile = profiles.find((p) => p.id === updated.citizen_id);
    if (profile) {
      dbState.addNotification({
        title: `Application Status: ${statusData.status}`,
        message: `Your application #${updated.application_no} status changed to ${statusData.status}. Remarks: ${statusData.remarks}`,
        type: statusData.status === "APPROVED" ? "SUCCESS" : statusData.status === "REJECTED" ? "ACTION_REQUIRED" : "INFO",
      });
    }

    return updated;
  },
};
