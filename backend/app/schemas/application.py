from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ApplicationCreate(BaseModel):
    service_id: int
    form_data: Dict[str, Any]
    granted_consent_dept: Optional[str] = None

class StatusHistoryOut(BaseModel):
    id: int
    status: str
    step_name: str
    remarks: Optional[str] = None
    actor_role: str
    timestamp: datetime

    class Config:
        from_attributes = True

class ApplicationOut(BaseModel):
    id: int
    application_no: str
    citizen_id: int
    service_id: int
    service_title: str
    department_id: int
    department_name: str
    department_code: str
    external_ref: Optional[str] = None
    status: str
    current_step: str
    remarks: Optional[str] = None
    form_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    status_history: List[StatusHistoryOut] = []

    class Config:
        from_attributes = True

class ApplicationUpdateStatus(BaseModel):
    status: str # ACTION_REQUIRED, UNDER_VERIFICATION, APPROVED, REJECTED
    remarks: str
    current_step: Optional[str] = None
