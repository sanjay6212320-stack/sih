from pydantic import BaseModel
from typing import List, Optional

class AIChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en" # en, hi, ta

class RecommendedServiceItem(BaseModel):
    service_id: int
    title: str
    department_name: str
    category: str
    match_percentage: int
    eligibility_status: str
    explanation: str
    required_documents: List[str]

class AIChatResponse(BaseModel):
    reply: str
    intent: str
    detected_language: str
    recommendations: List[RecommendedServiceItem] = []
