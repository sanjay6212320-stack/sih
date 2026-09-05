from fastapi import APIRouter, HTTPException, Body
import uuid
import time

router = APIRouter(prefix="/mock", tags=["Mock External Department APIs"])

@router.post("/education/submit")
def mock_education_api(payload: dict = Body(...)):
    """Simulates external legacy Education Department API endpoint."""
    return {
        "status": "SUCCESS",
        "edu_application_id": f"EDU-{uuid.uuid4().hex[:6].upper()}",
        "msg": "Education Department received scholarship request. Verification in progress.",
        "received_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }

@router.post("/revenue/verify")
def mock_revenue_api(payload: dict = Body(...)):
    """Simulates external legacy Revenue Department API endpoint."""
    return {
        "ack_status": "ACCEPTED",
        "rev_ack_no": f"REV-{uuid.uuid4().hex[:6].upper()}",
        "income_verified": True,
        "message": "Income certificate reference verified in e-District database."
    }

@router.post("/health/apply")
def mock_health_api(payload: dict = Body(...)):
    """Simulates external Health Department API endpoint."""
    return {
        "status": "APPROVED",
        "health_card_token": f"HLT-{uuid.uuid4().hex[:6].upper()}",
        "coverage_amount": 500000,
        "message": "Chief Minister Health Insurance token generated."
    }

@router.post("/agriculture/submit")
def mock_agriculture_api(payload: dict = Body(...)):
    """Simulates external Agriculture Department API endpoint."""
    return {
        "status": "QUEUED",
        "kisan_reg_no": f"AGR-{uuid.uuid4().hex[:6].upper()}",
        "message": "Kisan Farmer Subsidy application queued for Block Officer verification."
    }

@router.post("/social_welfare/submit")
def mock_social_welfare_api(payload: dict = Body(...)):
    """Simulates external Social Welfare Department API endpoint."""
    return {
        "status": "RECEIVED",
        "welfare_docket": f"SOC-{uuid.uuid4().hex[:6].upper()}",
        "message": "Social Welfare Support Docket logged successfully."
    }
