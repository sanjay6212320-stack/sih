import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serviceApi } from "../services/serviceApi";
import { applicationApi } from "../services/applicationApi";
import { citizenApi } from "../services/citizenApi";
import { GovernmentService, CitizenDocument, CitizenProfile } from "../types";
import { ConsentModal } from "../components/ConsentModal";
import {
  FileCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Layers,
  Sparkles,
  Loader2,
  FileText
} from "lucide-react";

export const ApplicationPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<GovernmentService | null>(null);
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [documents, setDocuments] = useState<CitizenDocument[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Record<string, any>>({
    institution: "Anna University Chennai",
    course: "B.Tech Computer Science",
    year: "3rd Year",
    roll_number: "2024-CS-041",
    bank_account: "992810029102",
    bank_ifsc: "SBIN0001827",
  });

  // Consent Modal State
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!serviceId) return;
      try {
        const [srvData, profData, docsData] = await Promise.all([
          serviceApi.getServiceDetails(Number(serviceId)),
          citizenApi.getProfile(),
          citizenApi.getDocuments(),
        ]);
        setService(srvData);
        setProfile(profData);
        setDocuments(docsData);
      } catch (err) {
        console.error("Error loading application page:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [serviceId]);

  const handleStep4Consent = () => {
    setShowConsentModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!service) return;
    setSubmitting(true);
    try {
      // Grant explicit consent in DB
      if (consentGranted) {
        await citizenApi.grantConsent({
          requesting_dept: service.department_name || "Education Department",
          source_dept: "Revenue Department",
          fields_requested: ["Income Certificate", "Annual Income"],
          purpose: `Income eligibility verification for ${service.title}`,
        });
      }

      // Submit Application via Gateway
      const app = await applicationApi.createApplication({
        service_id: service.id,
        form_data: formData,
        granted_consent_dept: consentGranted ? "Revenue Department" : undefined,
      });

      navigate(`/applications/${app.id}`);
    } catch (err: any) {
      alert("Failed to submit application: " + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !service) {
    return <div className="text-center py-12 text-xs text-slate-400">Loading scheme application wizard...</div>;
  }

  const stepsList = ["1. Personal Info", "2. Scheme Details", "3. Documents", "4. Data Sharing Consent", "5. Review & Submit"];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <Building2 className="w-4 h-4" /> {service.department_name}
        </div>
        <h1 className="text-2xl font-black">{service.title}</h1>
        <p className="text-xs text-slate-300">
          GovConnect Interoperability Layer dispatches directly to {service.department_name} API backend.
        </p>

        {/* Wizard Stepper Bar */}
        <div className="grid grid-cols-5 gap-2 pt-4 border-t border-slate-800">
          {stepsList.map((st, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl text-[11px] font-bold text-center border transition ${
                currentStep === idx + 1
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md"
                  : currentStep > idx + 1
                  ? "bg-slate-800 text-emerald-400 border-slate-700"
                  : "bg-slate-950 text-slate-500 border-slate-900"
              }`}
            >
              {st}
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Form Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 1: Verified Citizen Demographics (Auto-Filled)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">State & District</span>
                <p className="font-semibold text-slate-900">{profile?.district}, {profile?.state}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Occupation</span>
                <p className="font-semibold text-slate-900">{profile?.occupation}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Annual Income</span>
                <p className="font-semibold text-emerald-700 font-mono">₹{profile?.annual_income?.toLocaleString()} INR</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Aadhaar (Last 4)</span>
                <p className="font-semibold text-slate-900 font-mono">XXXX-XXXX-{profile?.aadhaar_last4}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Scheme Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 2: Service-Specific Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Institution / Org Name</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Details</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Roll / Ref Number</label>
                <input
                  type="text"
                  value={formData.roll_number}
                  onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Account Number (DBT Benefit)</label>
                <input
                  type="text"
                  value={formData.bank_account}
                  onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 3: Document Vault Verification
            </h3>
            <p className="text-xs text-slate-600">Required proofs for this scheme:</p>
            <div className="space-y-2">
              {service.required_documents.map((doc, idx) => {
                const found = documents.find((d) => d.doc_type === doc || d.title.includes(doc));
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                      found
                        ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold">{doc}</span>
                    </div>
                    {found ? (
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        ✓ Verified in Vault ({found.title})
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Pending Upload (Auto-verifiable via Data Sharing)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Inter-Department Data Sharing Consent */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 4: Explicit Inter-Department Data Sharing Consent
            </h3>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 text-xs text-amber-950">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                <ShieldCheck className="w-5 h-5 text-amber-600" /> Interoperability Consent Protocol
              </div>
              <p className="leading-relaxed">
                To eliminate manual physical visits, <strong>{service.department_name}</strong> requests permission to verify your income proof directly from <strong>Revenue Department</strong> servers.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-amber-200">
                <span className="font-semibold text-amber-900">Consent Status:</span>
                {consentGranted ? (
                  <span className="font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Consent Granted
                  </span>
                ) : (
                  <button
                    onClick={handleStep4Consent}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow transition"
                  >
                    Grant Consent Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 5: Review & Submit to API Gateway
            </h3>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-900 font-bold">
                <span>Scheme: {service.title}</span>
                <span className="text-indigo-600 font-mono">{service.code}</span>
              </div>
              <p className="text-slate-600">Target Department: {service.department_name}</p>
              <p className="text-slate-600">Interoperability Consent: {consentGranted ? "GRANTED (Revenue Dept)" : "NOT REQUIRED"}</p>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 font-mono text-[11px]">
              ℹ️ Upon submission, the GovConnect API Gateway will translate payload, execute department adapter, and return normalized tracking reference.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 transition flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Previous Step
            </button>
          ) : <div />}

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Routing Payload via Gateway...
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4 text-slate-950" /> Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Consent Request Modal */}
      <ConsentModal
        isOpen={showConsentModal}
        requestingDept={service.department_name || "Education Department"}
        sourceDept="Revenue Department"
        fields={["Income Certificate", "Annual Income", "District"]}
        purpose={`Income eligibility verification for ${service.title}`}
        onAllow={() => {
          setConsentGranted(true);
          setShowConsentModal(false);
        }}
        onDeny={() => {
          setConsentGranted(false);
          setShowConsentModal(false);
        }}
      />
    </div>
  );
};
