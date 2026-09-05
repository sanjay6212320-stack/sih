import {
  User,
  CitizenProfile,
  Department,
  GovernmentService,
  Application,
  CitizenDocument,
  DataConsent,
  NotificationItem,
  IntegrationLog,
} from "../types";

export interface UserWithPassword extends User {
  password?: string;
}

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 1, code: "EDU", name: "Education Department", description: "State Department of Higher & Secondary Education", api_endpoint: "/mock/education/submit", status: "CONNECTED", icon: "GraduationCap" },
  { id: 2, code: "REV", name: "Revenue Department", description: "Land & Revenue Administration Services", api_endpoint: "/mock/revenue/verify", status: "CONNECTED", icon: "Landmark" },
  { id: 3, code: "HLT", name: "Health & Family Welfare", description: "Public Health, Hospitals & Insurance Schemes", api_endpoint: "/mock/health/apply", status: "CONNECTED", icon: "HeartPulse" },
  { id: 4, code: "AGR", name: "Agriculture & Farmer Welfare", description: "Agricultural Subsidies & Kisan Support", api_endpoint: "/mock/agriculture/submit", status: "CONNECTED", icon: "Sprout" },
  { id: 5, code: "SOC", name: "Social Welfare Department", description: "Social Empowerment & Pension Schemes", api_endpoint: "/mock/social_welfare/submit", status: "CONNECTED", icon: "HandHeart" },
  { id: 6, code: "TRN", name: "Transport Department", description: "Driving License, Vehicle Registration & Mobility", api_endpoint: "/mock/transport/submit", status: "CONNECTED", icon: "Car" },
];

export const INITIAL_USERS: UserWithPassword[] = [
  { id: 1, email: "admin@govconnect.in", phone: "9876543210", full_name: "National Platform Administrator", role: "ADMIN", is_active: true, password: "Admin@123" },
  { id: 2, email: "officer.edu@govconnect.in", phone: "9876543211", full_name: "Dr. S. Ramanathan", role: "OFFICER", department_code: "EDU", is_active: true, password: "Officer@123" },
  { id: 3, email: "officer.rev@govconnect.in", phone: "9876543212", full_name: "K. Meenakshi (VAO)", role: "OFFICER", department_code: "REV", is_active: true, password: "Officer@123" },
  { id: 4, email: "citizen@govconnect.in", phone: "9876543213", full_name: "Ramesh Kumar", role: "CITIZEN", is_active: true, password: "Citizen@123" },
  { id: 5, email: "farmer@govconnect.in", phone: "9876543214", full_name: "Murugan P", role: "CITIZEN", is_active: true, password: "Farmer@123" },
];

export const INITIAL_PROFILES: CitizenProfile[] = [
  { id: 1, user_id: 4, aadhaar_last4: "9821", dob: "2003-05-14", gender: "Male", address: "12, Gandhi Street, Guindy, Chennai", state: "Tamil Nadu", district: "Chennai", annual_income: 120000, occupation: "Student", category: "General", is_differently_abled: "No" },
  { id: 2, user_id: 5, aadhaar_last4: "4412", dob: "1982-11-20", gender: "Male", address: "Farm Road 4, Madurai", state: "Tamil Nadu", district: "Madurai", annual_income: 95000, occupation: "Farmer", category: "OBC", is_differently_abled: "No" },
];

export const INITIAL_SERVICES: GovernmentService[] = [
  {
    id: 1,
    code: "SCH-2026",
    department_id: 1,
    department_name: "Education Department",
    department_code: "EDU",
    title: "Post-Matric Merit Scholarship Scheme",
    category: "Education",
    description: "Financial grant up to ₹25,000 per annum for higher secondary and undergraduate students from low-income families.",
    eligibility_criteria: { max_income: 250000, occupations: ["Student"], min_age: 16, max_age: 28 },
    required_documents: ["Income Certificate", "Student ID", "Aadhaar Card", "Bank Passbook"],
    processing_days: 7,
    fee: 0.0,
  },
  {
    id: 2,
    code: "REV-INC",
    department_id: 2,
    department_name: "Revenue Department",
    department_code: "REV",
    title: "Income Certificate Issuance",
    category: "Revenue",
    description: "Official income verification document valid for all state and central government scholarship and subsidy schemes.",
    eligibility_criteria: { occupations: ["All"] },
    required_documents: ["Address Proof", "Self Declaration", "Aadhaar Card"],
    processing_days: 5,
    fee: 60.0,
  },
  {
    id: 3,
    code: "HLT-INS",
    department_id: 3,
    department_name: "Health & Family Welfare",
    department_code: "HLT",
    title: "Chief Minister Universal Health Insurance",
    category: "Health",
    description: "Cashless medical treatment up to ₹5 Lakhs per family per year at empaneled government and private hospitals.",
    eligibility_criteria: { max_income: 500000, occupations: ["All"] },
    required_documents: ["Ration Card", "Aadhaar Card", "Income Certificate"],
    processing_days: 3,
    fee: 0.0,
  },
  {
    id: 4,
    code: "AGR-SUB",
    department_id: 4,
    department_name: "Agriculture & Farmer Welfare",
    department_code: "AGR",
    title: "PM-Kisan Farmer Crop Subsidy Support",
    category: "Agriculture",
    description: "Annual direct benefit transfer of ₹6,000 in three instalments to small and marginal farming families.",
    eligibility_criteria: { occupations: ["Farmer"], max_income: 300000 },
    required_documents: ["Land Pattadar Passbook", "Aadhaar Card", "Bank Account Details"],
    processing_days: 10,
    fee: 0.0,
  },
  {
    id: 5,
    code: "SOC-PEN",
    department_id: 5,
    department_name: "Social Welfare Department",
    department_code: "SOC",
    title: "Social Security Senior Citizen Pension",
    category: "Welfare",
    description: "Monthly pension support of ₹1,500 for senior citizens above 60 years of age.",
    eligibility_criteria: { min_age: 60, max_income: 150000, occupations: ["Retired", "Unemployed", "All"] },
    required_documents: ["Age Proof", "Income Certificate", "Aadhaar Card"],
    processing_days: 14,
    fee: 0.0,
  },
];

export const INITIAL_DOCUMENTS: CitizenDocument[] = [
  {
    id: 1,
    doc_type: "Income Certificate",
    title: "Revenue Dept Annual Income Proof (₹1.2L)",
    file_path: "sample_income.pdf",
    status: "VERIFIED",
    extracted_data: "OCR Extracted: Verified Name=Ramesh Kumar, Annual Income=1,20,000 INR, Certificate #REV-INC-99120",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    doc_type: "Student ID",
    title: "Anna University College ID 2024-28",
    file_path: "sample_student_id.pdf",
    status: "VERIFIED",
    extracted_data: "OCR Extracted: Anna University Roll #2024-CS-041, Valid until 2028",
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 1,
    application_no: "GC-2026-000101",
    citizen_id: 1,
    service_id: 1,
    service_title: "Post-Matric Merit Scholarship Scheme",
    department_id: 1,
    department_name: "Education Department",
    department_code: "EDU",
    external_ref: "EDU-88372",
    status: "UNDER_VERIFICATION",
    current_step: "Document & Cross-Department Verification",
    form_data: {
      institution: "Anna University Chennai",
      course: "B.Tech Computer Science",
      year: "3rd Year",
      roll_number: "2024-CS-041",
    },
    remarks: "Application successfully dispatched to Education Dept adapter",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status_history: [
      { id: 1, status: "SUBMITTED", step_name: "Submitted on GovConnect", remarks: "Application logged on unified citizen portal", actor_role: "CITIZEN", timestamp: new Date().toISOString() },
      { id: 2, status: "ROUTED_TO_DEPT", step_name: "Dispatched to Education API", remarks: "API Gateway routed payload to Education Dept Adapter", actor_role: "GATEWAY", timestamp: new Date().toISOString() },
      { id: 3, status: "UNDER_VERIFICATION", step_name: "Education Dept Received Application", remarks: "External Ref EDU-88372 generated", actor_role: "SYSTEM", timestamp: new Date().toISOString() },
    ],
  },
];

export const INITIAL_CONSENTS: DataConsent[] = [
  {
    id: 1,
    citizen_id: 1,
    requesting_dept: "Education Department",
    source_dept: "Revenue Department",
    fields_requested: ["Income Certificate", "Annual Income", "District"],
    purpose: "Scholarship income eligibility verification",
    status: "GRANTED",
    granted_at: new Date().toISOString(),
  },
];

export const INITIAL_LOGS: IntegrationLog[] = [
  {
    id: 1,
    application_no: "GC-2026-000101",
    source_system: "GovConnect API Gateway",
    target_department: "Education Department",
    endpoint: "/mock/education/submit",
    method: "POST",
    status_code: 200,
    latency_ms: 48.5,
    retry_count: 0,
    status: "SUCCESS",
    timestamp: new Date().toISOString(),
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, title: "Welcome to GovConnect", message: "Your citizen profile is active. You can now discover 25+ government schemes.", type: "INFO", is_read: false, created_at: new Date().toISOString() },
  { id: 2, title: "Application Dispatched", message: "Scholarship Application #GC-2026-000101 routed to Education Department.", type: "SUCCESS", is_read: false, created_at: new Date().toISOString() },
];
