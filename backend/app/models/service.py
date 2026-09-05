from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class GovernmentService(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # Education, Agriculture, Welfare, Health, Revenue, Transport
    description = Column(Text, nullable=False)
    eligibility_criteria = Column(JSON, nullable=False) # JSON rules (max_income, target_occupations, min_age, etc.)
    required_documents = Column(JSON, nullable=False) # List of required doc types
    processing_days = Column(Integer, default=7)
    fee = Column(Float, default=0.0)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    department = relationship("Department", back_populates="services")
    applications = relationship("Application", back_populates="service")
