import time
import httpx
from typing import Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.integration.adapter_manager import adapter_manager
from app.models.integration_log import IntegrationLog

# Global failure simulation flag
FAIL_SIMULATION_ENABLED = False

class APIGateway:
    @staticmethod
    def set_failure_simulation(enabled: bool):
        global FAIL_SIMULATION_ENABLED
        FAIL_SIMULATION_ENABLED = enabled

    @staticmethod
    def is_failure_simulation_enabled() -> bool:
        return FAIL_SIMULATION_ENABLED

    @staticmethod
    def dispatch_application(
        db: Session,
        application_id: int,
        application_no: str,
        dept_code: str,
        citizen_data: Dict[str, Any],
        form_data: Dict[str, Any]
    ) -> Tuple[bool, Dict[str, Any], str]:
        """
        Dispatches request through API Gateway. Uses department adapter to convert
        standard GovConnect format -> Department Payload -> Execute Mock Dept -> Normalize Response.
        Includes retry mechanism & failure logging.
        """
        adapter = adapter_manager.get_adapter(dept_code)
        request_payload = adapter.format_request(application_no, citizen_data, form_data)
        
        start_time = time.time()
        retry_count = 0
        max_retries = 2
        success = False
        raw_response = {}
        error_msg = None
        status_code = 200

        # Check if failure simulation is triggered
        if FAIL_SIMULATION_ENABLED and dept_code == "REV":
            # Simulate initial failure then successful retry
            retry_count = 1
            error_msg = "Revenue Dept API Timeout (504 Gateway Timeout). Automatic retry triggered."
            status_code = 504
            latency = (time.time() - start_time) * 1000 + 120.0
            
            # Log failed transaction
            failed_log = IntegrationLog(
                application_id=application_id,
                application_no=application_no,
                source_system="GovConnect API Gateway",
                target_department=adapter.department_name,
                endpoint=f"/mock/{dept_code.lower()}/submit",
                method="POST",
                request_payload=request_payload,
                response_payload={"error": "504 Gateway Timeout"},
                status_code=504,
                latency_ms=latency,
                retry_count=0,
                status="FAILED",
                error_message="Department Gateway Timeout"
            )
            db.add(failed_log)
            db.commit()

            # Execute retry
            raw_response = {
                "ack_status": "ACCEPTED",
                "rev_ack_no": f"REV-RETRY-{application_no[-4:]}",
                "message": "Retry successful: Revenue department received application."
            }
            status_code = 200
            success = True
        else:
            # Normal smooth integration mock
            raw_response = {
                "status": "SUCCESS",
                "ack_status": "ACCEPTED",
                "edu_application_id": f"{dept_code}-{application_no[-6:]}",
                "rev_ack_no": f"REV-{application_no[-6:]}",
                "health_card_token": f"HLT-{application_no[-6:]}",
                "kisan_reg_no": f"AGR-{application_no[-6:]}",
                "welfare_docket": f"SOC-{application_no[-6:]}",
                "msg": f"Application received successfully by {adapter.department_name}"
            }
            success = True

        latency_ms = round((time.time() - start_time) * 1000 + 45.0, 2)
        normalized = adapter.normalize_response(raw_response, application_no)

        # Log final integration event
        log_entry = IntegrationLog(
            application_id=application_id,
            application_no=application_no,
            source_system="GovConnect API Gateway",
            target_department=adapter.department_name,
            endpoint=f"/mock/{dept_code.lower()}/submit",
            method="POST",
            request_payload=request_payload,
            response_payload=normalized,
            status_code=status_code,
            latency_ms=latency_ms,
            retry_count=retry_count,
            status="SUCCESS" if success else "FAILED",
            error_message=error_msg
        )
        db.add(log_entry)
        db.commit()

        external_ref = normalized.get("external_reference", f"{dept_code}-MOCK-REF")
        return success, normalized, external_ref

api_gateway = APIGateway()
