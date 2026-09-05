from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.citizen import CitizenProfile
from app.schemas.ai import AIChatRequest, AIChatResponse
from app.ai.assistant import ai_assistant

router = APIRouter(prefix="/ai", tags=["AI Government Assistant"])

@router.post("/chat", response_model=AIChatResponse)
def ai_chat(
    req: AIChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    citizen = db.query(CitizenProfile).filter(CitizenProfile.user_id == current_user.id).first()
    c_dict = {
        "annual_income": citizen.annual_income if citizen else 120000,
        "occupation": citizen.occupation if citizen else "Student",
        "category": citizen.category if citizen else "General",
        "age": 20
    }

    result = ai_assistant.process_query(db, req.message, c_dict)
    return result
