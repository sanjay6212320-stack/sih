import React from "react";
import { StatusHistory } from "../types";
import { CheckCircle2, Clock, AlertCircle, ArrowDown } from "lucide-react";

interface ApplicationTimelineProps {
  history: StatusHistory[];
  currentStatus: string;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ history, currentStatus }) => {
  const steps = [
    { key: "SUBMITTED", title: "1. Unified Application Submitted", desc: "Logged on GovConnect citizen portal" },
    { key: "ROUTED_TO_DEPT", title: "2. API Gateway Payload Dispatched", desc: "Heterogeneous format normalized and routed via Adapter" },
    { key: "UNDER_VERIFICATION", title: "3. Department Verification", desc: "Cross-department verification and officer review" },
    { key: "APPROVED", title: "4. Final Decision & Benefit Granted", desc: "Service approved by competent department authority" },
  ];

  const getStepState = (stepKey: string) => {
    const sorted = [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const existing = sorted.find((h) => h.status === stepKey);

    if (existing) {
      return { status: "completed", data: existing };
    }

    if (currentStatus === "APPROVED" && stepKey === "APPROVED") {
      return { status: "completed", data: sorted[sorted.length - 1] };
    }

    if (currentStatus === "REJECTED" && stepKey === "APPROVED") {
      return { status: "failed", data: null };
    }

    return { status: "pending", data: null };
  };

  return (
    <div className="space-y-4">
      {steps.map((step, idx) => {
        const { status, data } = getStepState(step.key);
        return (
          <div key={step.key} className="flex items-start gap-4 relative group">
            {idx < steps.length - 1 && (
              <div
                className={`absolute left-4 top-8 w-0.5 h-10 -ml-px ${
                  status === "completed" ? "bg-emerald-500" : "bg-slate-200"
                }`}
              />
            )}

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                status === "completed"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                  : status === "failed"
                  ? "bg-rose-50 border-rose-500 text-rose-600"
                  : "bg-slate-50 border-slate-300 text-slate-400"
              }`}
            >
              {status === "completed" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : status === "failed" ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                {data && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(data.timestamp).toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1">{step.desc}</p>
              {data?.remarks && (
                <p className="text-[11px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 p-2 rounded-md mt-2">
                  ℹ️ {data.remarks}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
