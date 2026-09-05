import React from "react";
import { Link } from "react-router-dom";
import { GovernmentService } from "../types";
import { Building2, Clock, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

interface ServiceCardProps {
  service: GovernmentService;
  onCheckEligibility?: (service: GovernmentService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onCheckEligibility }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-indigo-300">
      <div>
        {/* Header badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
            <Building2 className="w-3 h-3 text-indigo-600" />
            {service.department_name || "Government Department"}
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded">
            {service.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1 mb-2">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {service.description}
        </p>

        {/* Metadata pills */}
        <div className="grid grid-cols-2 gap-2 py-3 px-3 bg-slate-50 rounded-xl mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{service.processing_days} Days SLA</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Fee: {service.fee === 0 ? "Free Scheme" : `₹${service.fee}`}</span>
          </div>
        </div>

        {/* Required Docs hint */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">Required Documents:</span>
          <div className="flex flex-wrap gap-1">
            {service.required_documents.slice(0, 3).map((doc, idx) => (
              <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                ✓ {doc}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        {onCheckEligibility && (
          <button
            onClick={() => onCheckEligibility(service)}
            className="flex-1 py-2 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition text-center"
          >
            Check Eligibility
          </button>
        )}
        <Link
          to={`/application/apply/${service.id}`}
          className="flex-1 py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition flex items-center justify-center gap-1 group-hover:bg-indigo-600"
        >
          Apply Now <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
