import sys
import os

# Add backend to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.citizen import CitizenProfile
from app.models.department import Department
from app.models.service import GovernmentService
from app.models.application import Application
from app.models.application_status_history import ApplicationStatusHistory
from app.models.document import CitizenDocument
from app.models.consent import DataConsent
from app.models.notification import Notification
from app.models.integration_log import IntegrationLog

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data if any
    db.query(IntegrationLog).delete()
    db.query(ApplicationStatusHistory).delete()
    db.query(Notification).delete()
    db.query(DataConsent).delete()
    db.query(CitizenDocument).delete()
    db.query(Application).delete()
    db.query(GovernmentService).delete()
    db.query(Department).delete()
    db.query(CitizenProfile).delete()
    db.query(User).delete()
    db.commit()

    print("Seeding GovConnect database...")

    # 1. Seed Departments
    dept_edu = Department(code="EDU", name="Education Department", description="State Department of Higher & Secondary Education", api_endpoint="/mock/education/submit", status="CONNECTED", icon="GraduationCap")
    dept_rev = Department(code="REV", name="Revenue Department", description="Land & Revenue Administration Services", api_endpoint="/mock/revenue/verify", status="CONNECTED", icon="Landmark")
    dept_hlt = Department(code="HLT", name="Health & Family Welfare", description="Public Health, Hospitals & Insurance Schemes", api_endpoint="/mock/health/apply", status="CONNECTED", icon="HeartPulse")
    dept_agr = Department(code="AGR", name="Agriculture & Farmer Welfare", description="Agricultural Subsidies & Kisan Support", api_endpoint="/mock/agriculture/submit", status="CONNECTED", icon="Sprout")
    dept_soc = Department(code="SOC", name="Social Welfare Department", description="Social Empowerment & Pension Schemes", api_endpoint="/mock/social_welfare/submit", status="CONNECTED", icon="HandHeart")
    dept_trn = Department(code="TRN", name="Transport Department", description="Driving License, Vehicle Registration & Mobility", api_endpoint="/mock/transport/submit", status="CONNECTED", icon="Car")

    db.add_all([dept_edu, dept_rev, dept_hlt, dept_agr, dept_soc, dept_trn])
    db.commit()

    # 2. Seed Users
    # Admin User
    user_admin = User(
        email="admin@govconnect.in",
        phone="9876543210",
        hashed_password=get_password_hash("Admin@123"),
        full_name="National Platform Administrator",
        role=UserRole.ADMIN.value
    )
    # Officers
    user_off_edu = User(
        email="officer.edu@govconnect.in",
        phone="9876543211",
        hashed_password=get_password_hash("Officer@123"),
        full_name="Dr. S. Ramanathan",
        role=UserRole.OFFICER.value,
        department_code="EDU"
    )
    user_off_rev = User(
        email="officer.rev@govconnect.in",
        phone="9876543212",
        hashed_password=get_password_hash("Officer@123"),
        full_name="K. Meenakshi (VAO)",
        role=UserRole.OFFICER.value,
        department_code="REV"
    )
    # Citizens
    user_cit1 = User(
        email="citizen@govconnect.in",
        phone="9876543213",
        hashed_password=get_password_hash("Citizen@123"),
        full_name="Ramesh Kumar",
        role=UserRole.CITIZEN.value
    )
    user_cit2 = User(
        email="farmer@govconnect.in",
        phone="9876543214",
        hashed_password=get_password_hash("Farmer@123"),
        full_name="Murugan P",
        role=UserRole.CITIZEN.value
    )

    db.add_all([user_admin, user_off_edu, user_off_rev, user_cit1, user_cit2])
    db.commit()

    # Profiles
    profile_cit1 = CitizenProfile(
        user_id=user_cit1.id,
        aadhaar_last4="9821",
        dob="2003-05-14",
        gender="Male",
        address="12, Gandhi Street, Guindy, Chennai",
        state="Tamil Nadu",
        district="Chennai",
        annual_income=120000,
        occupation="Student",
        category="General"
    )
    profile_cit2 = CitizenProfile(
        user_id=user_cit2.id,
        aadhaar_last4="4412",
        dob="1982-11-20",
        gender="Male",
        address="Farm Road 4, Madurai",
        state="Tamil Nadu",
        district="Madurai",
        annual_income=95000,
        occupation="Farmer",
        category="OBC"
    )

    db.add_all([profile_cit1, profile_cit2])
    db.commit()

    # 3. Seed Government Services
    srv1 = GovernmentService(
        code="SCH-2026",
        department_id=dept_edu.id,
        title="Post-Matric Merit Scholarship Scheme",
        category="Education",
        description="Financial grant up to ₹25,000 per annum for higher secondary and undergraduate students from low-income families.",
        eligibility_criteria={"max_income": 250000, "occupations": ["Student"], "min_age": 16, "max_age": 28},
        required_documents=["Income Certificate", "Student ID", "Aadhaar Card", "Bank Passbook"],
        processing_days=7,
        fee=0.0
    )
    srv2 = GovernmentService(
        code="REV-INC",
        department_id=dept_rev.id,
        title="Income Certificate Issuance",
        category="Revenue",
        description="Official income verification document valid for all state and central government scholarship and subsidy schemes.",
        eligibility_criteria={"occupations": ["All"]},
        required_documents=["Address Proof", "Self Declaration", "Aadhaar Card"],
        processing_days=5,
        fee=60.0
    )
    srv3 = GovernmentService(
        code="HLT-INS",
        department_id=dept_hlt.id,
        title="Chief Minister Universal Health Insurance",
        category="Health",
        description="Cashless medical treatment up to ₹5 Lakhs per family per year at empaneled government and private hospitals.",
        eligibility_criteria={"max_income": 500000, "occupations": ["All"]},
        required_documents=["Ration Card", "Aadhaar Card", "Income Certificate"],
        processing_days=3,
        fee=0.0
    )
    srv4 = GovernmentService(
        code="AGR-SUB",
        department_id=dept_agr.id,
        title="PM-Kisan Farmer Crop Subsidy Support",
        category="Agriculture",
        description="Annual direct benefit transfer of ₹6,000 in three instalments to small and marginal farming families.",
        eligibility_criteria={"occupations": ["Farmer"], "max_income": 300000},
        required_documents=["Land Pattadar Passbook", "Aadhaar Card", "Bank Account Details"],
        processing_days=10,
        fee=0.0
    )
    srv5 = GovernmentService(
        code="SOC-PEN",
        department_id=dept_soc.id,
        title="Social Security Senior Citizen Pension",
        category="Welfare",
        description="Monthly pension support of ₹1,500 for senior citizens above 60 years of age.",
        eligibility_criteria={"min_age": 60, "max_income": 150000, "occupations": ["Retired", "Unemployed", "All"]},
        required_documents=["Age Proof", "Income Certificate", "Aadhaar Card"],
        processing_days=14,
        fee=0.0
    )

    db.add_all([srv1, srv2, srv3, srv4, srv5])
    db.commit()

    # 4. Seed Documents
    doc1 = CitizenDocument(
        citizen_id=profile_cit1.id,
        doc_type="Income Certificate",
        title="Revenue Dept Annual Income Proof (₹1.2L)",
        file_path="./uploaded_documents/sample_income.pdf",
        status="VERIFIED",
        extracted_data="OCR Extracted: Verified Name=Ramesh Kumar, Annual Income=1,20,000 INR, Certificate #REV-INC-99120"
    )
    doc2 = CitizenDocument(
        citizen_id=profile_cit1.id,
        doc_type="Student ID",
        title="Anna University College ID 2024-28",
        file_path="./uploaded_documents/sample_student_id.pdf",
        status="VERIFIED",
        extracted_data="OCR Extracted: Anna University Roll #2024-CS-041, Valid until 2028"
    )

    db.add_all([doc1, doc2])
    db.commit()

    # 5. Seed Applications
    app1 = Application(
        application_no="GC-2026-000101",
        citizen_id=profile_cit1.id,
        service_id=srv1.id,
        department_id=dept_edu.id,
        external_ref="EDU-88372",
        status="UNDER_VERIFICATION",
        current_step="Document & Cross-Department Verification",
        form_data={
            "institution": "Anna University Chennai",
            "course": "B.Tech Computer Science",
            "year": "3rd Year",
            "roll_number": "2024-CS-041"
        },
        remarks="Application successfully dispatched to Education Dept adapter"
    )

    db.add(app1)
    db.commit()

    # Status History
    h1 = ApplicationStatusHistory(application_id=app1.id, status="SUBMITTED", step_name="Submitted on GovConnect", remarks="Application logged on unified citizen portal", actor_role="CITIZEN")
    h2 = ApplicationStatusHistory(application_id=app1.id, status="ROUTED_TO_DEPT", step_name="Dispatched to Education API", remarks="API Gateway routed payload to Education Dept Adapter", actor_role="GATEWAY")
    h3 = ApplicationStatusHistory(application_id=app1.id, status="UNDER_VERIFICATION", step_name="Education Dept Received Application", remarks="External Ref EDU-88372 generated", actor_role="SYSTEM")

    db.add_all([h1, h2, h3])
    db.commit()

    # 6. Seed Consent
    consent1 = DataConsent(
        citizen_id=profile_cit1.id,
        requesting_dept="Education Department",
        source_dept="Revenue Department",
        fields_requested=["Income Certificate", "Annual Income", "District"],
        purpose="Scholarship income eligibility verification",
        status="GRANTED"
    )
    db.add(consent1)

    # 7. Seed Integration Log
    log1 = IntegrationLog(
        application_id=app1.id,
        application_no=app1.application_no,
        source_system="GovConnect API Gateway",
        target_department="Education Department",
        endpoint="/mock/education/submit",
        method="POST",
        request_payload={"govconnect_ref": app1.application_no, "student": "Ramesh Kumar"},
        response_payload={"success": True, "external_reference": "EDU-88372", "status": "PROCESSING"},
        status_code=200,
        latency_ms=48.5,
        retry_count=0,
        status="SUCCESS"
    )
    db.add(log1)

    # Notifications
    n1 = Notification(user_id=user_cit1.id, title="Welcome to GovConnect", message="Your citizen profile is active. You can now discover 25+ government schemes.", type="INFO")
    n2 = Notification(user_id=user_cit1.id, title="Application Dispatched", message="Scholarship Application #GC-2026-000101 routed to Education Department.", type="SUCCESS")
    db.add_all([n1, n2])

    db.commit()
    print("Database successfully seeded with demo records!")

if __name__ == "__main__":
    seed_database()
