from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User, UserRole
from app.models.citizen import CitizenProfile
from app.models.department import Department
from app.models.service import GovernmentService
from app.models.application import Application
from app.models.integration_log import IntegrationLog
from app.models.audit_log import AuditLog

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

def check_admin(user: User):
    if user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Admin role required for this action")

@router.get("/dashboard")
def get_admin_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_admin(current_user)

    total_citizens = db.query(CitizenProfile).count()
    total_apps = db.query(Application).count()
    active_apps = db.query(Application).filter(Application.status.in_(["SUBMITTED", "ROUTED_TO_DEPT", "UNDER_VERIFICATION", "ACTION_REQUIRED"])).count()
    approved_apps = db.query(Application).filter(Application.status == "APPROVED").count()
    rejected_apps = db.query(Application).filter(Application.status == "REJECTED").count()
    
    total_depts = db.query(Department).count()
    total_services = db.query(GovernmentService).count()
    
    total_api_requests = db.query(IntegrationLog).count()
    failed_api_requests = db.query(IntegrationLog).filter(IntegrationLog.status == "FAILED").count()

    return {
        "total_citizens": total_citizens,
        "total_applications": total_apps,
        "active_applications": active_apps,
        "approved_applications": approved_apps,
        "rejected_applications": rejected_apps,
        "connected_departments": total_depts,
        "total_services": total_services,
        "total_api_requests": total_api_requests,
        "failed_api_requests": failed_api_requests,
        "avg_processing_days": 4.2
    }

@router.get("/analytics")
def get_admin_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_admin(current_user)

    # Apps by Department
    depts = db.query(Department).all()
    dept_analytics = []
    for d in depts:
        count = db.query(Application).filter(Application.department_id == d.id).count()
        dept_analytics.append({
            "name": d.name,
            "code": d.code,
            "applications": count
        })

    # Status distribution
    status_counts = db.query(Application.status, func.count(Application.id)).group_by(Application.status).all()
    status_analytics = [{"name": s[0], "value": s[1]} for s in status_counts]

    # Daily Volume Mock Data
    daily_volume = [
        {"day": "Mon", "volume": 12, "success": 11, "failed": 1},
        {"day": "Tue", "volume": 19, "success": 18, "failed": 1},
        {"day": "Wed", "volume": 25, "success": 24, "failed": 1},
        {"day": "Thu", "volume": 32, "success": 30, "failed": 2},
        {"day": "Fri", "volume": 28, "success": 27, "failed": 1},
        {"day": "Sat", "volume": 15, "success": 15, "failed": 0},
        {"day": "Sun", "volume": 8, "success": 8, "failed": 0}
    ]

    return {
        "by_department": dept_analytics,
        "by_status": status_analytics,
        "daily_volume": daily_volume
    }

@router.get("/users")
def get_users_list(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_admin(current_user)
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "phone": u.phone,
            "role": u.role,
            "department_code": u.department_code,
            "is_active": u.is_active,
            "created_at": u.created_at
        } for u in users
    ]

@router.get("/audit-logs")
def get_audit_logs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_admin(current_user)
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
    return logs
