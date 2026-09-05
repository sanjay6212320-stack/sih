from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class IntegrationLog(Base):
    __tablename__ = "integration_logs"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=True)
    application_no = Column(String, nullable=True)
    source_system = Column(String, default="GovConnect API Gateway")
    target_department = Column(String, nullable=False)
    endpoint = Column(String, nullable=False)
    method = Column(String, default="POST")
    request_payload = Column(JSON, nullable=True)
    response_payload = Column(JSON, nullable=True)
    status_code = Column(Integer, nullable=False)
    latency_ms = Column(Float, nullable=False)
    retry_count = Column(Integer, default=0)
    status = Column(String, default="SUCCESS") # SUCCESS, FAILED, RETRIED
    error_message = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="integration_logs")
