from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ServiceOut(BaseModel):
    id: int
    code: str
    department_id: int
    department_name: Optional[str] = None
    department_code: Optional[str] = None
    title: str
    category: str
    description: str
    eligibility_criteria: Dict[str, Any]
    required_documents: List[str]
    processing_days: int
    fee: float

    class Config:
        from_attributes = True

class ServiceEligibilityCheck(BaseModel):
    service_id: int
    annual_income: int
    age: int
    occupation: str
    category: str
    is_differently_abled: Optional[str] = "No"

class ServiceEligibilityResponse(BaseModel):
    eligible: bool
    status: str # Eligible, Partially Eligible, Not Eligible
    reason: str
    matching_rules: List[str]
    required_documents: List[str]
    disclaimer: str = "Eligibility shown is preliminary and subject to official department verification."
