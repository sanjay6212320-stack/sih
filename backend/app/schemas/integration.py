from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class StandardizedApiResponse(BaseModel):
    success: bool
    source_department: str
    application_id: str
    external_reference: Optional[str] = None
    status: str
    message: str
    timestamp: str

class IntegrationLogOut(BaseModel):
    id: int
    application_no: Optional[str] = None
    source_system: str
    target_department: str
    endpoint: str
    method: str
    status_code: int
    latency_ms: float
    retry_count: int
    status: str
    error_message: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class DepartmentStatusOut(BaseModel):
    id: int
    code: str
    name: str
    api_endpoint: str
    status: str
    icon: str
