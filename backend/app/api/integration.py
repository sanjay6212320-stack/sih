from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.department import Department
from app.models.integration_log import IntegrationLog
from app.schemas.integration import IntegrationLogOut, DepartmentStatusOut
from app.integration.api_gateway import api_gateway

router = APIRouter(prefix="/integration", tags=["Interoperability & Integration Gateway"])

@router.get("/departments", response_model=List[DepartmentStatusOut])
def get_departments(db: Session = Depends(get_db)):
    depts = db.query(Department).all()
    return depts

@router.get("/health")
def get_gateway_health(db: Session = Depends(get_db)):
    total_logs = db.query(IntegrationLog).count()
    failed_logs = db.query(IntegrationLog).filter(IntegrationLog.status == "FAILED").count()
    success_logs = db.query(IntegrationLog).filter(IntegrationLog.status == "SUCCESS").count()
    
    avg_latency = 52.4
    if total_logs > 0:
        latencies = [l.latency_ms for l in db.query(IntegrationLog.latency_ms).all()]
        if latencies:
            avg_latency = round(sum(latencies) / len(latencies), 2)

    departments = db.query(Department).all()

    return {
        "status": "OPERATIONAL",
        "gateway_version": "2.4.0-STABLE",
        "total_requests": total_logs,
        "successful_requests": success_logs,
        "failed_requests": failed_logs,
        "avg_latency_ms": avg_latency,
        "failure_simulation_active": api_gateway.is_failure_simulation_enabled(),
        "connected_departments_count": len(departments)
    }

@router.get("/logs", response_model=List[IntegrationLogOut])
def get_integration_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(IntegrationLog).order_by(IntegrationLog.timestamp.desc()).limit(limit).all()
    return logs

@router.post("/simulate-failure")
def toggle_failure_simulation(enabled: bool):
    api_gateway.set_failure_simulation(enabled)
    return {
        "failure_simulation_active": enabled,
        "message": f"API Gateway failure simulation {'ENABLED' if enabled else 'DISABLED'} (Target: Revenue Dept API 504 Timeout & Retry)."
    }
