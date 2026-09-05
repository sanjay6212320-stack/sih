from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class DataConsent(Base):
    __tablename__ = "consents"

    id = Column(Integer, primary_key=True, index=True)
    citizen_id = Column(Integer, ForeignKey("citizens.id"), nullable=False)
    requesting_dept = Column(String, nullable=False) # e.g. Education Department
    source_dept = Column(String, nullable=False)     # e.g. Revenue Department
    fields_requested = Column(JSON, nullable=False)  # ['income_certificate', 'annual_income', 'address']
    purpose = Column(String, nullable=False)         # e.g. Scholarship eligibility verification
    status = Column(String, default="GRANTED")       # GRANTED, REVOKED, PENDING
    granted_at = Column(DateTime, default=datetime.utcnow)

    citizen = relationship("CitizenProfile", back_populates="consents")
