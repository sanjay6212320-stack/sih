from pydantic import BaseModel
from typing import Optional

class CitizenProfileUpdate(BaseModel):
    aadhaar_last4: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    annual_income: Optional[int] = None
    occupation: Optional[str] = None
    category: Optional[str] = None
    is_differently_abled: Optional[str] = None

class CitizenProfileOut(BaseModel):
    id: int
    user_id: int
    aadhaar_last4: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    state: str
    district: str
    annual_income: int
    occupation: str
    category: str
    is_differently_abled: str

    class Config:
        from_attributes = True
