from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.citizen import CitizenProfile
from app.schemas.citizen import CitizenProfileOut, CitizenProfileUpdate

router = APIRouter(prefix="/citizen", tags=["Citizen Profile"])

@router.get("/profile", response_model=CitizenProfileOut)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(CitizenProfile).filter(CitizenProfile.user_id == current_user.id).first()
    if not profile:
        profile = CitizenProfile(
            user_id=current_user.id,
            aadhaar_last4="9821",
            annual_income=120000,
            occupation="Student",
            category="General"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/profile", response_model=CitizenProfileOut)
def update_profile(
    profile_in: CitizenProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(CitizenProfile).filter(CitizenProfile.user_id == current_user.id).first()
    if not profile:
        profile = CitizenProfile(user_id=current_user.id)
        db.add(profile)

    update_data = profile_in.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile
