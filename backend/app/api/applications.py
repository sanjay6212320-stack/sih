import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User, UserRole
from app.models.citizen import CitizenProfile
from app.models.service import GovernmentService
from app.models.department import Department
from app.models.application import Application
from app.models.application_status_history import ApplicationStatusHistory
from app.models.notification import Notification
from app.schemas.application import ApplicationCreate, ApplicationOut, ApplicationUpdateStatus
from app.integration.api_gateway import api_gateway

router = APIRouter(prefix="/applications", tags=["Applications Engine"])

def format_application_response(app: Application, db: Session) -> dict:
    serv = db.query(GovernmentService).filter(GovernmentService.id == app.service_id).first()
    dept = db.query(Department).filter(Department.id == app.department_id).first()
    history = db.query(ApplicationStatusHistory).filter(ApplicationStatusHistory.application_id == app.id).order_by(ApplicationStatusHistory.timestamp.asc()).all()
    
    return {
        "id": app.id,
        "application_no": app.application_no,
        "citizen_id": app.citizen_id,
        "service_id": app.service_id,
        "service_title": serv.title if serv else "Government Scheme",
        "department_id": app.department_id,
        "department_name": dept.name if dept else "Government Dept",
        "department_code": dept.code if dept else "GOV",
        "external_ref": app.external_ref,
        "status": app.status,
        "current_step": app.current_step,
        "remarks": app.remarks,
        "form_data": app.form_data,
        "created_at": app.created_at,
        "updated_at": app.updated_at,
        "status_history": [
            {
                "id": h.id,
                "status": h.status,
                "step_name": h.step_name,
                "remarks": h.remarks,
                "actor_role": h.actor_role,
                "timestamp": h.timestamp
            } for h in history
        ]
    }

@router.post("", response_model=ApplicationOut)
def create_and_submit_application(
    app_in: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    citizen = db.query(CitizenProfile).filter(CitizenProfile.user_id == current_user.id).first()
    if not citizen:
        raise HTTPException(status_code=400, detail="Citizen profile incomplete. Please complete profile.")

    service = db.query(GovernmentService).filter(GovernmentService.id == app_in.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Selected government service not found.")

    dept = db.query(Department).filter(Department.id == service.department_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Associated department not found.")

    # Generate unique GovConnect application number
    application_no = f"GC-2026-{uuid.uuid4().hex[:6].upper()}"

    new_app = Application(
        application_no=application_no,
        citizen_id=citizen.id,
        service_id=service.id,
        department_id=dept.id,
        status="ROUTED_TO_DEPT",
        current_step="Department API Integration",
        form_data=app_in.form_data,
        remarks="Submitted via GovConnect Interoperability Layer"
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    # Initial history step
    step1 = ApplicationStatusHistory(
        application_id=new_app.id,
        status="SUBMITTED",
        step_name="Application Submitted",
        remarks="Citizen submitted application on GovConnect unified platform",
        actor_role="CITIZEN"
    )
    step2 = ApplicationStatusHistory(
        application_id=new_app.id,
        status="ROUTED_TO_DEPT",
        step_name="Routed via API Gateway",
        remarks=f"Payload translated & dispatched to {dept.name} Adapter",
        actor_role="GATEWAY"
    )
    db.add_all([step1, step2])
    db.commit()

    # Interoperability Gateway Dispatch
    citizen_dict = {
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "annual_income": citizen.annual_income,
        "occupation": citizen.occupation,
        "category": citizen.category,
        "district": citizen.district
    }

    success, norm_resp, external_ref = api_gateway.dispatch_application(
        db=db,
        application_id=new_app.id,
        application_no=new_app.application_no,
        dept_code=dept.code,
        citizen_data=citizen_dict,
        form_data=app_in.form_data
    )

    new_app.external_ref = external_ref
    new_app.status = norm_resp.get("status", "UNDER_VERIFICATION")
    new_app.current_step = "Document & Cross-Department Verification"
    db.commit()

    # Step 3 status history
    step3 = ApplicationStatusHistory(
        application_id=new_app.id,
        status=new_app.status,
        step_name=f"{dept.name} Received Application",
        remarks=f"External Ref: {external_ref}. {norm_resp.get('message')}",
        actor_role="SYSTEM"
    )
    db.add(step3)

    # Notify Citizen
    notif = Notification(
        user_id=current_user.id,
        title=f"Application Submitted: {service.title}",
        message=f"Your application #{application_no} has been routed to {dept.name} with reference {external_ref}.",
        type="SUCCESS"
    )
    db.add(notif)
    db.commit()
    db.refresh(new_app)

    return format_application_response(new_app, db)

@router.get("", response_model=List[ApplicationOut])
def get_user_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == UserRole.CITIZEN.value:
        citizen = db.query(CitizenProfile).filter(CitizenProfile.user_id == current_user.id).first()
        if not citizen:
            return []
        apps = db.query(Application).filter(Application.citizen_id == citizen.id).order_by(Application.created_at.desc()).all()
    elif current_user.role == UserRole.OFFICER.value:
        # Officer sees applications assigned to their department
        dept_code = current_user.department_code or "EDU"
        dept = db.query(Department).filter(Department.code == dept_code).first()
        if not dept:
            apps = db.query(Application).all()
        else:
            apps = db.query(Application).filter(Application.department_id == dept.id).order_by(Application.created_at.desc()).all()
    else:
        # Admin sees all applications
        apps = db.query(Application).order_by(Application.created_at.desc()).all()

    return [format_application_response(app, db) for app in apps]

@router.get("/{app_id}", response_model=ApplicationOut)
def get_application_details(app_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return format_application_response(app, db)

@router.put("/{app_id}/status", response_model=ApplicationOut)
def update_application_status(
    app_id: int,
    status_in: ApplicationUpdateStatus,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in [UserRole.OFFICER.value, UserRole.ADMIN.value]:
        raise HTTPException(status_code=403, detail="Only Department Officers or Admins can update application status")

    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = status_in.status
    if status_in.current_step:
        app.current_step = status_in.current_step
    elif status_in.status == "APPROVED":
        app.current_step = "Service Granted & Closed"
    elif status_in.status == "REJECTED":
        app.current_step = "Application Rejected"
    elif status_in.status == "ACTION_REQUIRED":
        app.current_step = "Citizen Input Required"

    app.remarks = status_in.remarks
    db.commit()

    # Log step history
    hist = ApplicationStatusHistory(
        application_id=app.id,
        status=status_in.status,
        step_name=app.current_step,
        remarks=status_in.remarks,
        actor_role=current_user.role
    )
    db.add(hist)

    # Notify Citizen
    citizen = db.query(CitizenProfile).filter(CitizenProfile.id == app.citizen_id).first()
    if citizen:
        notif = Notification(
            user_id=citizen.user_id,
            title=f"Application Update #{app.application_no}",
            message=f"Status updated to '{status_in.status}'. Remarks: {status_in.remarks}",
            type="SUCCESS" if status_in.status == "APPROVED" else ("WARNING" if status_in.status == "REJECTED" else "INFO")
        )
        db.add(notif)
    db.commit()
    db.refresh(app)

    return format_application_response(app, db)
