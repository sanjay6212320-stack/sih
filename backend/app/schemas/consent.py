from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ConsentCreate(BaseModel):
    requesting_dept: str
    source_dept: str
    fields_requested: List[str]
    purpose: str

class ConsentOut(BaseModel):
    id: int
    citizen_id: int
    requesting_dept: str
    source_dept: str
    fields_requested: List[str]
    purpose: str
    status: str
    granted_at: datetime

    class Config:
        from_attributes = True
