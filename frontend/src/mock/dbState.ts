import {
  User,
  CitizenProfile,
  Department,
  GovernmentService,
  Application,
  StatusHistory,
  CitizenDocument,
  DataConsent,
  NotificationItem,
  IntegrationLog,
} from "../types";
import {
  UserWithPassword,
  INITIAL_USERS,
  INITIAL_PROFILES,
  INITIAL_DEPARTMENTS,
  INITIAL_SERVICES,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_CONSENTS,
  INITIAL_LOGS,
  INITIAL_NOTIFICATIONS,
} from "./seedData";

const STORAGE_KEYS = {
  USERS: "gc_users_v2",
  PROFILES: "gc_profiles_v2",
  DEPARTMENTS: "gc_departments_v2",
  SERVICES: "gc_services_v2",
  APPLICATIONS: "gc_applications_v2",
  DOCUMENTS: "gc_documents_v2",
  CONSENTS: "gc_consents_v2",
  LOGS: "gc_logs_v2",
  NOTIFICATIONS: "gc_notifications_v2",
  FAILURE_SIMULATION: "gc_failure_simulation_v2",
  INIT_FLAG: "gc_initialized_v2",
};

export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.INIT_FLAG)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    localStorage.setItem(STORAGE_KEYS.CONSENTS, JSON.stringify(INITIAL_CONSENTS));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.FAILURE_SIMULATION, "false");
    localStorage.setItem(STORAGE_KEYS.INIT_FLAG, "true");
  }
};

const getItem = <T>(key: string, fallback: T): T => {
  initializeStorage();
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const setItem = <T>(key: string, val: T): void => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const dbState = {
  // Users
  getUsers: (): UserWithPassword[] => getItem(STORAGE_KEYS.USERS, INITIAL_USERS),
  getUserByEmail: (email: string): UserWithPassword | undefined => {
    return dbState.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserById: (id: number): UserWithPassword | undefined => {
    return dbState.getUsers().find((u) => u.id === id);
  },
  createUser: (user: Omit<UserWithPassword, "id" | "is_active">): UserWithPassword => {
    const users = dbState.getUsers();
    const newUser: UserWithPassword = {
      ...user,
      id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      is_active: true,
    };
    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  // Profiles
  getProfiles: (): CitizenProfile[] => getItem(STORAGE_KEYS.PROFILES, INITIAL_PROFILES),
  getProfileByUserId: (userId: number): CitizenProfile | undefined => {
    return dbState.getProfiles().find((p) => p.user_id === userId);
  },
  createOrUpdateProfile: (userId: number, profileData: Partial<CitizenProfile>): CitizenProfile => {
    const profiles = dbState.getProfiles();
    const idx = profiles.findIndex((p) => p.user_id === userId);
    if (idx !== -1) {
      profiles[idx] = { ...profiles[idx], ...profileData };
      setItem(STORAGE_KEYS.PROFILES, profiles);
      return profiles[idx];
    } else {
      const newProfile: CitizenProfile = {
        id: profiles.length ? Math.max(...profiles.map((p) => p.id)) + 1 : 1,
        user_id: userId,
        aadhaar_last4: profileData.aadhaar_last4 || "0000",
        dob: profileData.dob || "2000-01-01",
        gender: profileData.gender || "Other",
        address: profileData.address || "",
        state: profileData.state || "Tamil Nadu",
        district: profileData.district || "Chennai",
        annual_income: profileData.annual_income ?? 100000,
        occupation: profileData.occupation || "Other",
        category: profileData.category || "General",
        is_differently_abled: profileData.is_differently_abled || "No",
      };
      profiles.push(newProfile);
      setItem(STORAGE_KEYS.PROFILES, profiles);
      return newProfile;
    }
  },

  // Departments & Services
  getDepartments: (): Department[] => getItem(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS),
  getDepartmentById: (id: number): Department | undefined => {
    return dbState.getDepartments().find((d) => d.id === id);
  },
  getDepartmentByCode: (code: string): Department | undefined => {
    return dbState.getDepartments().find((d) => d.code === code);
  },
  getServices: (): GovernmentService[] => getItem(STORAGE_KEYS.SERVICES, INITIAL_SERVICES),
  getServiceById: (id: number): GovernmentService | undefined => {
    return dbState.getServices().find((s) => s.id === id);
  },

  // Applications
  getApplications: (): Application[] => getItem(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS),
  getApplicationById: (id: number): Application | undefined => {
    return dbState.getApplications().find((a) => a.id === id);
  },
  createApplication: (appData: {
    citizen_id: number;
    service_id: number;
    service_title: string;
    department_id: number;
    department_name: string;
    department_code: string;
    external_ref?: string;
    status: Application["status"];
    current_step: string;
    remarks?: string;
    form_data?: any;
  }): Application => {
    const apps = dbState.getApplications();
    const newId = apps.length ? Math.max(...apps.map((a) => a.id)) + 1 : 1;
    const application_no = `GC-2026-${String(newId + 100).padStart(6, "0")}`;
    const now = new Date().toISOString();

    const initialHistory: StatusHistory[] = [
      {
        id: 1,
        status: "SUBMITTED",
        step_name: "Submitted on GovConnect",
        remarks: "Application logged on unified citizen portal",
        actor_role: "CITIZEN",
        timestamp: now,
      },
    ];

    const newApp: Application = {
      ...appData,
      id: newId,
      application_no,
      created_at: now,
      updated_at: now,
      status_history: initialHistory,
    };
    apps.push(newApp);
    setItem(STORAGE_KEYS.APPLICATIONS, apps);

    return newApp;
  },
  updateApplicationStatus: (
    id: number,
    status: Application["status"],
    remarks: string,
    stepName?: string,
    actorRole: string = "OFFICER"
  ): Application | undefined => {
    const apps = dbState.getApplications();
    const idx = apps.findIndex((a) => a.id === id);
    if (idx !== -1) {
      const now = new Date().toISOString();
      apps[idx].status = status;
      apps[idx].remarks = remarks;
      if (stepName) apps[idx].current_step = stepName;
      apps[idx].updated_at = now;

      const history = apps[idx].status_history || [];
      const newHistoryItem: StatusHistory = {
        id: history.length ? Math.max(...history.map((h) => h.id)) + 1 : 1,
        status,
        step_name: stepName || status,
        remarks,
        actor_role: actorRole,
        timestamp: now,
      };
      apps[idx].status_history = [...history, newHistoryItem];

      setItem(STORAGE_KEYS.APPLICATIONS, apps);
      return apps[idx];
    }
    return undefined;
  },

  getStatusHistory: (): StatusHistory[] => {
    const apps = dbState.getApplications();
    const historyList: StatusHistory[] = [];
    apps.forEach((a) => {
      if (a.status_history) {
        historyList.push(...a.status_history);
      }
    });
    return historyList;
  },

  // Citizen Documents
  getDocuments: (): CitizenDocument[] => getItem(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS),
  addDocument: (doc: Omit<CitizenDocument, "id" | "created_at">): CitizenDocument => {
    const docs = getItem<CitizenDocument[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    const newDoc: CitizenDocument = {
      ...doc,
      id: docs.length ? Math.max(...docs.map((d) => d.id)) + 1 : 1,
      created_at: new Date().toISOString(),
    };
    docs.push(newDoc);
    setItem(STORAGE_KEYS.DOCUMENTS, docs);
    return newDoc;
  },
  deleteDocument: (id: number): boolean => {
    let docs = getItem<CitizenDocument[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    const lenBefore = docs.length;
    docs = docs.filter((d) => d.id !== id);
    setItem(STORAGE_KEYS.DOCUMENTS, docs);
    return docs.length < lenBefore;
  },

  // Data Consents
  getConsents: (): DataConsent[] => getItem(STORAGE_KEYS.CONSENTS, INITIAL_CONSENTS),
  grantConsent: (consent: Omit<DataConsent, "id" | "granted_at">): DataConsent => {
    const list = getItem<DataConsent[]>(STORAGE_KEYS.CONSENTS, INITIAL_CONSENTS);
    const newConsent: DataConsent = {
      ...consent,
      id: list.length ? Math.max(...list.map((c) => c.id)) + 1 : 1,
      granted_at: new Date().toISOString(),
    };
    list.push(newConsent);
    setItem(STORAGE_KEYS.CONSENTS, list);
    return newConsent;
  },
  revokeConsent: (id: number): boolean => {
    const list = getItem<DataConsent[]>(STORAGE_KEYS.CONSENTS, INITIAL_CONSENTS);
    const idx = list.findIndex((c) => c.id === id);
    if (idx !== -1) {
      list[idx].status = "REVOKED";
      setItem(STORAGE_KEYS.CONSENTS, list);
      return true;
    }
    return false;
  },

  // Notifications
  getNotifications: (): NotificationItem[] => getItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  addNotification: (n: Omit<NotificationItem, "id" | "created_at" | "is_read">): NotificationItem => {
    const list = getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newN: NotificationItem = {
      ...n,
      id: list.length ? Math.max(...list.map((i) => i.id)) + 1 : 1,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    list.push(newN);
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    return newN;
  },
  markNotificationRead: (id: number): boolean => {
    const list = getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const idx = list.findIndex((n) => n.id === id);
    if (idx !== -1) {
      list[idx].is_read = true;
      setItem(STORAGE_KEYS.NOTIFICATIONS, list);
      return true;
    }
    return false;
  },

  // Integration Logs & Telemetry
  getIntegrationLogs: (limit: number = 50): IntegrationLog[] => {
    const list = getItem(STORAGE_KEYS.LOGS, INITIAL_LOGS);
    return list.slice(-limit).reverse();
  },
  addIntegrationLog: (log: Omit<IntegrationLog, "id" | "timestamp">): IntegrationLog => {
    const list = getItem<IntegrationLog[]>(STORAGE_KEYS.LOGS, INITIAL_LOGS);
    const newLog: IntegrationLog = {
      ...log,
      id: list.length ? Math.max(...list.map((l) => l.id)) + 1 : 1,
      timestamp: new Date().toISOString(),
    };
    list.push(newLog);
    setItem(STORAGE_KEYS.LOGS, list);
    return newLog;
  },

  // Failure Simulation Flag
  getFailureSimulation: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.FAILURE_SIMULATION) === "true";
  },
  setFailureSimulation: (enabled: boolean): void => {
    localStorage.setItem(STORAGE_KEYS.FAILURE_SIMULATION, enabled ? "true" : "false");
  },
};
