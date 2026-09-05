# GovConnect — Unified Government Service Interoperability Platform

> **Tagline**: *One Platform. Multiple Government Services. One Seamless Experience.*

**GovConnect** solves the problem of fragmented government digital services by creating a secure interoperability and integration bridge between multiple existing government department systems (Education, Revenue, Health, Agriculture, Social Welfare, Transport).

> **Core Philosophy**: *GovConnect acts as a secure bridge that allows existing government digital platforms to communicate and exchange permitted information through standardized APIs instead of replacing them.*

---

## 🌟 Key Features

1. **Unified Citizen Portal & Profile**: Single sign-on access across all government department services without duplicate data entry.
2. **AI Government Service Assistant**: Natural language intent recognition and service discovery engine (supporting English, Hindi, and Tamil) with deterministic eligibility rules to guarantee zero hallucination.
3. **Dynamic Eligibility Engine**: Pre-checks citizen income, age, occupation, and category against configured rules before application submission.
4. **Explicit Inter-Department Data Sharing Consent**: Citizens explicitly approve field-by-field data sharing between departments (e.g. Education Department verifying Revenue Department income proof).
5. **API Gateway & Interoperability Adapters**: Standardizes heterogeneous departmental schemas (`EDU-XXXX`, `REV-XXXX`) into unified GovConnect reference formats (`GC-2026-XXXX`).
6. **Live Gateway Monitor & Fault Injection Engine**: Real-time integration health map, transaction audit logs, and a 1-click **Revenue API 504 Timeout Simulation** button for testing system resilience and auto-retries.
7. **Role-Based Workdesks**:
   - **Citizen**: Service discovery, AI assistant, document vault, status timeline, data consent manager.
   - **Department Officer**: Department workdesk, cross-department data verification, official approval/rejection decisions.
   - **System Admin**: Integration telemetry, health map, fault injection testing, analytics, audit trails.

---

## 🏗️ System Architecture

```text
                               ┌──────────────────────────────────────────────┐
                               │       React + TypeScript + Tailwind UI       │
                               │          Citizen & Admin Web Portal          │
                               └──────────────────────┬───────────────────────┘
                                                      │ REST / JSON (JWT)
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │           FastAPI Python Backend             │
                               │  (Auth, Services, AI Engine, Applications)   │
                               └──────┬───────────────────────────────┬───────┘
                                      │                               │
                                      ▼                               ▼
                       ┌─────────────────────────────┐  ┌─────────────────────────────┐
                       │    API Gateway & Engine     │  │    PostgreSQL / SQLite DB    │
                       │ (Adapters, Normalization,   │  │   (Users, Apps, Consents,   │
                       │    Retry & Audit Logs)      │  │     Integration Logs)       │
                       └──────────────┬──────────────┘  └─────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
  ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
  │ Mock Education   │      │   Mock Revenue   │      │   Mock Health    │
  │ Department API   │      │ Department API   │      │ Department API   │
  └──────────────────┘      └──────────────────┘      └──────────────────┘
```

---

## 🚀 Deploying on Vercel

GovConnect is fully configured with an in-browser TypeScript engine for zero-dependency 1-click deployment on **Vercel**:

1. Push this repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new) -> Import Repository `sanjay6212320-stack/sih`.
3. Set **Root Directory** to `frontend`.
4. Click **Deploy**!

---

## ⚡ Quick Start Guide (Local Development)

### Prerequisites
- Node.js 18+

### Step-by-Step Setup

#### Setup & Run Frontend
```bash
cd frontend
npm install
npm run dev
```

- **Frontend Portal**: `http://localhost:5173`

---

## 🔑 Quick Demo Role Credentials

| Role | Email | Password | Details |
|------|-------|----------|---------|
| **Citizen** | `citizen@govconnect.in` | `Citizen@123` | Ramesh Kumar (Student, Income ₹1.2L) |
| **Education Officer** | `officer.edu@govconnect.in` | `Officer@123` | Dr. Ramanathan (Education Dept) |
| **Revenue Officer** | `officer.rev@govconnect.in` | `Officer@123` | Meenakshi (Revenue Dept / VAO) |
| **System Admin** | `admin@govconnect.in` | `Admin@123` | Platform Administrator |

---

## 🎬 End-to-End System Demonstration Flow

1. **Login as Citizen** (`citizen@govconnect.in`).
2. **Open AI Assistant**: Ask *"I am a student with low family income looking for scholarship support"*.
3. **AI Discovery**: AI detects Intent (`EDUCATION_SCHOLARSHIP`), ranks **Post-Matric Merit Scholarship**, explains match percentage (95%), and displays eligibility breakdown.
4. **Dynamic Eligibility Check**: Click *"Check Eligibility"* -> Evaluate income (₹1.2L) -> System returns *"Eligible"*.
5. **Apply & Grant Data Consent**: Click *"Apply Now"* -> Step 4 triggers **Inter-Department Data Sharing Request** -> Grant consent for Education Dept to query Revenue Dept servers.
6. **API Gateway Execution**: Click *"Submit"* -> Gateway converts request payload, calls **Education & Revenue Adapters**, normalizes heterogeneous response format (`EDU-88372`), and updates application status timeline.
7. **Officer Approval**: Login as Education Officer (`officer.edu@govconnect.in`) -> View incoming application -> Verify cross-department data -> Approve application.
8. **Real-time Citizen Notification**: Login back as Citizen -> Receive approval alert & timeline update!
9. **Admin Fault Resiliency Demo**: Login as Admin (`admin@govconnect.in`) -> Go to **Gateway Monitor** -> Click **"Simulate Revenue Timeout (504)"** -> Submit app -> Observe automatic retry execution and normalized failure audit log.

---

## 📑 Core API Endpoints

- `POST /api/auth/login`: Authenticate and issue JWT token.
- `GET  /api/services/search`: Natural language & keyword service discovery.
- `POST /api/ai/chat`: AI Assistant multilingual query processing.
- `POST /api/applications`: Create and dispatch application via API Gateway.
- `GET  /api/integration/health`: Topology status & transaction telemetry.
- `POST /api/integration/simulate-failure`: Toggle fault injection testing.
