from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=True)
    role = Column(String, nullable=True)
    action = Column(String, nullable=False) # LOGIN, CONSENT_GRANTED, APPLICATION_SUBMITTED, STATUS_UPDATED
    resource = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String, default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.utcnow)
