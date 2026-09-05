from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    application_no = Column(String, unique=True, index=True, nullable=False) # e.g. GC-2026-0001
    citizen_id = Column(Integer, ForeignKey("citizens.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    external_ref = Column(String, nullable=True) # ID returned by Department system e.g. EDU-9921
    
    # Statuses: SUBMITTED, DATA_VALIDATED, ROUTED_TO_DEPT, UNDER_VERIFICATION, ACTION_REQUIRED, APPROVED, REJECTED
    status = Column(String, default="SUBMITTED", nullable=False)
    current_step = Column(String, default="Department Received")
    form_data = Column(JSON, nullable=True)
    remarks = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    citizen = relationship("CitizenProfile", back_populates="applications")
    service = relationship("GovernmentService", back_populates="applications")
    department = relationship("Department", back_populates="applications")
    status_history = relationship("ApplicationStatusHistory", back_populates="application", cascade="all, delete-orphan")
    integration_logs = relationship("IntegrationLog", back_populates="application", cascade="all, delete-orphan")
