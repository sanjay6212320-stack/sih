from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    status = Column(String, nullable=False)
    step_name = Column(String, nullable=False)
    remarks = Column(Text, nullable=True)
    actor_role = Column(String, default="SYSTEM") # SYSTEM, CITIZEN, OFFICER, GATEWAY
    timestamp = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="status_history")
