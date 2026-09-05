import { dbState } from "./dbState";

export interface DispatchResult {
  success: boolean;
  normalized_response: any;
  external_ref: string;
}

export class APIGateway {
  static dispatchApplication(
    applicationId: number,
    applicationNo: string,
    deptCode: string,
    citizenData: any,
    formData: any
  ): DispatchResult {
    const dept = dbState.getDepartmentByCode(deptCode);
    const deptName = dept ? dept.name : `${deptCode} Department`;
    const endpoint = `/mock/${deptCode.toLowerCase()}/submit`;

    const requestPayload = {
      govconnect_ref: applicationNo,
      citizen_name: citizenData.full_name || "Citizen",
      aadhaar_last4: citizenData.aadhaar_last4 || "0000",
      form_fields: formData,
      timestamp: new Date().toISOString(),
    };

    const isFailureSimulated = dbState.getFailureSimulation();
    let success = false;
    let externalRef = `${deptCode}-MOCK-REF`;

    if (isFailureSimulated && deptCode === "REV") {
      // 1. Log simulated 504 Timeout failure event
      const failedLatency = 120.5;
      dbState.addIntegrationLog({
        application_no: applicationNo,
        source_system: "GovConnect API Gateway",
        target_department: deptName,
        endpoint,
        method: "POST",
        status_code: 504,
        latency_ms: failedLatency,
        retry_count: 0,
        status: "FAILED",
        error_message: "Revenue Dept API Timeout (504 Gateway Timeout). Automatic retry triggered.",
      });

      // 2. Automatic retry succeeds
      const retryRef = `REV-RETRY-${applicationNo.slice(-4)}`;
      externalRef = retryRef;
      success = true;

      const normalizedRetryResp = {
        status: "SUCCESS",
        ack_status: "ACCEPTED",
        external_reference: retryRef,
        department: deptName,
        message: "Retry successful: Revenue department received application after 504 recovery.",
      };

      dbState.addIntegrationLog({
        application_no: applicationNo,
        source_system: "GovConnect API Gateway (Retry Engine)",
        target_department: deptName,
        endpoint,
        method: "POST",
        status_code: 200,
        latency_ms: 65.2,
        retry_count: 1,
        status: "SUCCESS",
        error_message: undefined,
      });

      return {
        success,
        normalized_response: normalizedRetryResp,
        external_ref: externalRef,
      };
    } else {
      // Normal smooth adapter execution
      externalRef = `${deptCode}-${applicationNo.slice(-6)}`;
      success = true;

      const normalizedResp = {
        status: "SUCCESS",
        ack_status: "ACCEPTED",
        external_reference: externalRef,
        department: deptName,
        message: `Application payload normalized and ingested by ${deptName} endpoint`,
      };

      dbState.addIntegrationLog({
        application_no: applicationNo,
        source_system: "GovConnect API Gateway",
        target_department: deptName,
        endpoint,
        method: "POST",
        status_code: 200,
        latency_ms: 45.8,
        retry_count: 0,
        status: "SUCCESS",
        error_message: undefined,
      });

      return {
        success,
        normalized_response: normalizedResp,
        external_ref: externalRef,
      };
    }
  }
}
