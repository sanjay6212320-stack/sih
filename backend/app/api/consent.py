from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.citizen import CitizenProfile
from app.models.consent import DataConsent
from app.schemas.consent import ConsentCreate, ConsentOut

router = APIRouter(prefix="/consent", tags=["Consent Management"])

@router.get("", response_model=List[ConsentOut])
def get_consents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    citizen = db.query(CitizenProfile).filter(CitizenProfile.user_id == current_user.id).first()
    if not citizen:
        return []
    consents = db.query(DataConsent).filter(DataConsent.citizen_id == citizen.id).order_by(DataConsent.granted_at.desc()).all()
    return consents

@router.post("", response_model=ConsentOut)
def grant_consent(consent_in: ConsentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    citizen = db.query(CitizenProfile).filter(CitizenProfile.user_id == current_user.id).first()
    if not citizen:
        raise HTTPException(status_code=400, detail="Citizen profile not found")

    consent = DataConsent(
        citizen_id=citizen.id,
        requesting_dept=consent_in.requesting_dept,
        source_dept=consent_in.source_dept,
        fields_requested=consent_in.fields_requested,
        purpose=consent_in.purpose,
        status="GRANTED"
    )
    db.add(consent)
    db.commit()
    db.refresh(consent)
    return consent

@router.delete("/{consent_id}")
def revoke_consent(consent_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    citizen = db.query(CitizenProfile).filter(CitizenProfile.user_id == current_user.id).first()
    if not citizen:
        raise HTTPException(status_code=404, detail="Citizen profile not found")

    consent = db.query(DataConsent).filter(DataConsent.id == consent_id, DataConsent.citizen_id == citizen.id).first()
    if not consent:
        raise HTTPException(status_code=404, detail="Consent record not found")

    consent.status = "REVOKED"
    db.commit()
    return {"message": "Consent revoked successfully"}
