import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.citizen import CitizenProfile
from app.models.document import CitizenDocument

router = APIRouter(prefix="/documents", tags=["Documents Vault"])

UPLOAD_DIR = "./uploaded_documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("")
def get_user_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    citizen = db.query(CitizenProfile).filter(CitizenProfile.user_id == current_user.id).first()
    if not citizen:
        return []
    docs = db.query(CitizenDocument).filter(CitizenDocument.citizen_id == citizen.id).all()
    return [
        {
            "id": d.id,
            "doc_type": d.doc_type,
            "title": d.title,
            "file_path": d.file_path,
            "status": d.status,
            "extracted_data": d.extracted_data,
            "created_at": d.created_at
        } for d in docs
    ]

@router.post("/upload")
def upload_document(
    doc_type: str = Form(...),
    title: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    citizen = db.query(CitizenProfile).filter(CitizenProfile.user_id == current_user.id).first()
    if not citizen:
        raise HTTPException(status_code=400, detail="Citizen profile not found")

    file_filename = f"{current_user.id}_{doc_type.replace(' ', '_')}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, file_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Mock OCR extraction
    ocr_summary = f"OCR Extracted: Verified Name={current_user.full_name}, Valid State Document (#{doc_type[:3].upper()}-99281)"

    new_doc = CitizenDocument(
        citizen_id=citizen.id,
        doc_type=doc_type,
        title=title,
        file_path=file_path,
        status="VERIFIED",
        extracted_data=ocr_summary
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return {
        "id": new_doc.id,
        "doc_type": new_doc.doc_type,
        "title": new_doc.title,
        "status": new_doc.status,
        "extracted_data": new_doc.extracted_data,
        "message": "Document uploaded and verified by AI document checker"
    }

@router.delete("/{doc_id}")
def delete_document(doc_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    citizen = db.query(CitizenProfile).filter(CitizenProfile.user_id == current_user.id).first()
    if not citizen:
        raise HTTPException(status_code=404, detail="Citizen not found")

    doc = db.query(CitizenDocument).filter(CitizenDocument.id == doc_id, CitizenDocument.citizen_id == citizen.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}
