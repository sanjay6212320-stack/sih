from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, oauth2_scheme, decode_token
from app.models.user import User, UserRole
from app.models.citizen import CitizenProfile
from app.schemas.auth import UserRegister, UserLogin, Token, UserOut

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed_pw = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=hashed_pw,
        full_name=user_in.full_name,
        role=user_in.role.upper(),
        department_code=user_in.department_code.upper() if user_in.department_code else None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create associated Citizen Profile if role is CITIZEN
    if new_user.role == UserRole.CITIZEN.value:
        profile = CitizenProfile(
            user_id=new_user.id,
            aadhaar_last4="9821",
            annual_income=120000,
            occupation="Student",
            category="General"
        )
        db.add(profile)
        db.commit()

    token = create_access_token(subject=new_user.id, role=new_user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": new_user.role,
        "email": new_user.email,
        "full_name": new_user.full_name,
        "user_id": new_user.id,
        "department_code": new_user.department_code
    }

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token(subject=user.id, role=user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "email": user.email,
        "full_name": user.full_name,
        "user_id": user.id,
        "department_code": user.department_code
    }

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
