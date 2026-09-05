from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False) # EDU, REV, HLT, AGR, SOC, TRN
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    api_endpoint = Column(String, nullable=False)
    status = Column(String, default="CONNECTED") # CONNECTED, DEGRADED, OFFLINE
    icon = Column(String, default="Building2")
    created_at = Column(DateTime, default=datetime.utcnow)

    services = relationship("GovernmentService", back_populates="department")
    applications = relationship("Application", back_populates="department")
