from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.service import GovernmentService
from app.models.department import Department
from app.schemas.service import ServiceOut, ServiceEligibilityCheck, ServiceEligibilityResponse
from app.ai.eligibility_engine import eligibility_engine

router = APIRouter(prefix="/services", tags=["Services Catalog"])

@router.get("", response_model=List[ServiceOut])
def get_services(
    category: Optional[str] = None,
    department_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(GovernmentService)
    if category and category != "All":
        query = query.filter(GovernmentService.category == category)
    if department_id:
        query = query.filter(GovernmentService.department_id == department_id)
    
    services = query.all()
    dept_map = {d.id: d for d in db.query(Department).all()}
    
    result = []
    for s in services:
        dept = dept_map.get(s.department_id)
        result.append({
            "id": s.id,
            "code": s.code,
            "department_id": s.department_id,
            "department_name": dept.name if dept else "Government Dept",
            "department_code": dept.code if dept else "GOV",
            "title": s.title,
            "category": s.category,
            "description": s.description,
            "eligibility_criteria": s.eligibility_criteria,
            "required_documents": s.required_documents,
            "processing_days": s.processing_days,
            "fee": s.fee
        })
    return result

@router.get("/search", response_model=List[ServiceOut])
def search_services(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    q_lower = f"%{q.lower()}%"
    services = db.query(GovernmentService).filter(
        (GovernmentService.title.ilike(q_lower)) |
        (GovernmentService.description.ilike(q_lower)) |
        (GovernmentService.category.ilike(q_lower))
    ).all()
    
    dept_map = {d.id: d for d in db.query(Department).all()}
    result = []
    for s in services:
        dept = dept_map.get(s.department_id)
        result.append({
            "id": s.id,
            "code": s.code,
            "department_id": s.department_id,
            "department_name": dept.name if dept else "Government Dept",
            "department_code": dept.code if dept else "GOV",
            "title": s.title,
            "category": s.category,
            "description": s.description,
            "eligibility_criteria": s.eligibility_criteria,
            "required_documents": s.required_documents,
            "processing_days": s.processing_days,
            "fee": s.fee
        })
    return result

@router.get("/{service_id}", response_model=ServiceOut)
def get_service_details(service_id: int, db: Session = Depends(get_db)):
    s = db.query(GovernmentService).filter(GovernmentService.id == service_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Government service not found")
    dept = db.query(Department).filter(Department.id == s.department_id).first()
    return {
        "id": s.id,
        "code": s.code,
        "department_id": s.department_id,
        "department_name": dept.name if dept else "Government Dept",
        "department_code": dept.code if dept else "GOV",
        "title": s.title,
        "category": s.category,
        "description": s.description,
        "eligibility_criteria": s.eligibility_criteria,
        "required_documents": s.required_documents,
        "processing_days": s.processing_days,
        "fee": s.fee
    }

@router.post("/{service_id}/eligibility", response_model=ServiceEligibilityResponse)
def check_service_eligibility(
    service_id: int,
    check_in: ServiceEligibilityCheck,
    db: Session = Depends(get_db)
):
    s = db.query(GovernmentService).filter(GovernmentService.id == service_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Service not found")

    citizen_data = {
        "annual_income": check_in.annual_income,
        "age": check_in.age,
        "occupation": check_in.occupation,
        "category": check_in.category,
        "is_differently_abled": check_in.is_differently_abled
    }

    is_eligible, status_text, rules = eligibility_engine.evaluate(citizen_data, {
        "eligibility_criteria": s.eligibility_criteria
    })

    reason = ""
    if is_eligible:
        reason = f"Your profile (Income ₹{check_in.annual_income:,}, Age {check_in.age}, {check_in.occupation}) satisfies all preliminary conditions for {s.title}."
    else:
        reason = f"Your profile does not satisfy all criteria. Issues: {'; '.join(rules)}"

    return {
        "eligible": is_eligible,
        "status": status_text,
        "reason": reason,
        "matching_rules": rules,
        "required_documents": s.required_documents,
        "disclaimer": "Eligibility shown is preliminary and subject to official department verification."
    }
