from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class CitizenProfile(Base):
    __tablename__ = "citizens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    aadhaar_last4 = Column(String(4), nullable=True)
    dob = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    state = Column(String, default="Tamil Nadu")
    district = Column(String, default="Chennai")
    annual_income = Column(Integer, default=120000)  # INR
    occupation = Column(String, default="Student")    # Student, Farmer, Small Business, Retired, Unemployed, Employee
    category = Column(String, default="General")     # General, OBC, SC, ST, EWS
    is_differently_abled = Column(String, default="No")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="citizen_profile")
    applications = relationship("Application", back_populates="citizen")
    documents = relationship("CitizenDocument", back_populates="citizen")
    consents = relationship("DataConsent", back_populates="citizen")
