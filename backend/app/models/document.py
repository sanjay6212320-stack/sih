from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class CitizenDocument(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    citizen_id = Column(Integer, ForeignKey("citizens.id"), nullable=False)
    doc_type = Column(String, nullable=False) # Income Certificate, Aadhaar, Student ID, Ration Card, Land Record
    title = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    status = Column(String, default="VERIFIED") # VERIFIED, PENDING, REJECTED
    extracted_data = Column(Text, nullable=True) # OCR summary string
    created_at = Column(DateTime, default=datetime.utcnow)

    citizen = relationship("CitizenProfile", back_populates="documents")
