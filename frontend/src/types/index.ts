export type UserRole = "CITIZEN" | "OFFICER" | "ADMIN";

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  department_code?: string;
  is_active: boolean;
}

export interface CitizenProfile {
  id: number;
  user_id: number;
  aadhaar_last4?: string;
  dob?: string;
  gender?: string;
  address?: string;
  state: string;
  district: string;
  annual_income: number;
  occupation: string;
  category: string;
  is_differently_abled: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  api_endpoint: string;
  status: "CONNECTED" | "DEGRADED" | "OFFLINE";
  icon: string;
}

export interface GovernmentService {
  id: number;
  code: string;
  department_id: number;
  department_name?: string;
  department_code?: string;
  title: string;
  category: string;
  description: string;
  eligibility_criteria: Record<string, any>;
  required_documents: string[];
  processing_days: number;
  fee: number;
}

export interface StatusHistory {
  id: number;
  status: string;
  step_name: string;
  remarks?: string;
  actor_role: string;
  timestamp: string;
}

export interface Application {
  id: number;
  application_no: string;
  citizen_id: number;
  service_id: number;
  service_title: string;
  department_id: number;
  department_name: string;
  department_code: string;
  external_ref?: string;
  status: "SUBMITTED" | "ROUTED_TO_DEPT" | "UNDER_VERIFICATION" | "ACTION_REQUIRED" | "APPROVED" | "REJECTED";
  current_step: string;
  remarks?: string;
  form_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
  status_history: StatusHistory[];
}

export interface CitizenDocument {
  id: number;
  doc_type: string;
  title: string;
  file_path: string;
  status: "VERIFIED" | "PENDING" | "REJECTED";
  extracted_data?: string;
  created_at: string;
}

export interface DataConsent {
  id: number;
  citizen_id: number;
  requesting_dept: string;
  source_dept: string;
  fields_requested: string[];
  purpose: string;
  status: "GRANTED" | "REVOKED";
  granted_at: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ACTION_REQUIRED";
  is_read: boolean;
  created_at: string;
}

export interface RecommendedService {
  service_id: number;
  title: string;
  department_name: string;
  category: string;
  match_percentage: number;
  eligibility_status: string;
  explanation: string;
  required_documents: string[];
}

export interface AIChatResponse {
  reply: string;
  intent: string;
  detected_language: string;
  recommendations: RecommendedService[];
}

export interface IntegrationLog {
  id: number;
  application_no?: string;
  source_system: string;
  target_department: string;
  endpoint: string;
  method: string;
  status_code: number;
  latency_ms: number;
  retry_count: number;
  status: "SUCCESS" | "FAILED" | "RETRIED";
  error_message?: string;
  timestamp: string;
}
