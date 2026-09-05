import time
import uuid
from typing import Dict, Any, Tuple

class BaseDepartmentAdapter:
    department_code: str
    department_name: str

    def format_request(self, application_no: str, citizen_data: Dict[str, Any], form_data: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError

    def normalize_response(self, raw_response: Dict[str, Any], application_no: str) -> Dict[str, Any]:
        raise NotImplementedError

class EducationDepartmentAdapter(BaseDepartmentAdapter):
    department_code = "EDU"
    department_name = "Education Department"

    def format_request(self, application_no: str, citizen_data: Dict[str, Any], form_data: Dict[str, Any]) -> Dict[str, Any]:
        # Heterogeneous payload structure for legacy Education system
        return {
            "edu_application_id": f"EDU-{uuid.uuid4().hex[:6].upper()}",
            "govconnect_ref": application_no,
            "student_details": {
                "name": citizen_data.get("full_name"),
                "inst_name": form_data.get("institution", "Anna University"),
                "roll_no": form_data.get("roll_number", "2026-ENG-982")
            },
            "income_claimed": citizen_data.get("annual_income", 120000),
            "timestamp": time.time()
        }

    def normalize_response(self, raw_response: Dict[str, Any], application_no: str) -> Dict[str, Any]:
        return {
            "success": raw_response.get("status") == "SUCCESS",
            "source_department": self.department_name,
            "application_id": application_no,
            "external_reference": raw_response.get("edu_application_id") or raw_response.get("application_no"),
            "status": "PROCESSING",
            "message": raw_response.get("msg", "Education Department received and logged application."),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }

class RevenueDepartmentAdapter(BaseDepartmentAdapter):
    department_code = "REV"
    department_name = "Revenue Department"

    def format_request(self, application_no: str, citizen_data: Dict[str, Any], form_data: Dict[str, Any]) -> Dict[str, Any]:
        # Legacy format for Revenue System
        return {
            "rev_ack_no": f"REV-{uuid.uuid4().hex[:6].upper()}",
            "gc_tracking_id": application_no,
            "applicant_name": citizen_data.get("full_name"),
            "income_slab": citizen_data.get("annual_income"),
            "district": citizen_data.get("district", "Chennai")
        }

    def normalize_response(self, raw_response: Dict[str, Any], application_no: str) -> Dict[str, Any]:
        return {
            "success": raw_response.get("ack_status") == "ACCEPTED",
            "source_department": self.department_name,
            "application_id": application_no,
            "external_reference": raw_response.get("rev_ack_no"),
            "status": "UNDER_VERIFICATION",
            "message": raw_response.get("message", "Revenue department income certificate verified."),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }

class HealthDepartmentAdapter(BaseDepartmentAdapter):
    department_code = "HLT"
    department_name = "Health Department"

    def format_request(self, application_no: str, citizen_data: Dict[str, Any], form_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "health_card_token": f"HLT-{uuid.uuid4().hex[:6].upper()}",
            "gc_ref": application_no,
            "patient_name": citizen_data.get("full_name")
        }

    def normalize_response(self, raw_response: Dict[str, Any], application_no: str) -> Dict[str, Any]:
        return {
            "success": True,
            "source_department": self.department_name,
            "application_id": application_no,
            "external_reference": raw_response.get("health_card_token"),
            "status": "APPROVED",
            "message": "Health insurance scheme auto-approved.",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }

class AgricultureDepartmentAdapter(BaseDepartmentAdapter):
    department_code = "AGR"
    department_name = "Agriculture Department"

    def format_request(self, application_no: str, citizen_data: Dict[str, Any], form_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "kisan_reg_no": f"AGR-{uuid.uuid4().hex[:6].upper()}",
            "gc_id": application_no,
            "farmer_name": citizen_data.get("full_name")
        }

    def normalize_response(self, raw_response: Dict[str, Any], application_no: str) -> Dict[str, Any]:
        return {
            "success": True,
            "source_department": self.department_name,
            "application_id": application_no,
            "external_reference": raw_response.get("kisan_reg_no"),
            "status": "PROCESSING",
            "message": "Agriculture subsidy application submitted to district officer.",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }

class SocialWelfareAdapter(BaseDepartmentAdapter):
    department_code = "SOC"
    department_name = "Social Welfare Department"

    def format_request(self, application_no: str, citizen_data: Dict[str, Any], form_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "welfare_docket": f"SOC-{uuid.uuid4().hex[:6].upper()}",
            "gc_ref": application_no,
            "beneficiary": citizen_data.get("full_name")
        }

    def normalize_response(self, raw_response: Dict[str, Any], application_no: str) -> Dict[str, Any]:
        return {
            "success": True,
            "source_department": self.department_name,
            "application_id": application_no,
            "external_reference": raw_response.get("welfare_docket"),
            "status": "UNDER_VERIFICATION",
            "message": "Social welfare application queued for verification.",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }

class DepartmentAdapterManager:
    def __init__(self):
        self.adapters: Dict[str, BaseDepartmentAdapter] = {
            "EDU": EducationDepartmentAdapter(),
            "REV": RevenueDepartmentAdapter(),
            "HLT": HealthDepartmentAdapter(),
            "AGR": AgricultureDepartmentAdapter(),
            "SOC": SocialWelfareAdapter()
        }

    def get_adapter(self, dept_code: str) -> BaseDepartmentAdapter:
        return self.adapters.get(dept_code.upper(), EducationDepartmentAdapter())

adapter_manager = DepartmentAdapterManager()
