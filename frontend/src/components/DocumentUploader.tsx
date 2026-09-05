import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { citizenApi } from "../services/citizenApi";

interface DocumentUploaderProps {
  onUploadSuccess: (doc: any) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUploadSuccess }) => {
  const [docType, setDocType] = useState("Income Certificate");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("doc_type", docType);
      formData.append("title", title || `${docType} Proof`);
      formData.append("file", file);

      const res = await citizenApi.uploadDocument(formData);
      setExtractedData(res.extracted_data);
      onUploadSuccess(res);
      setFile(null);
      setTitle("");
    } catch (err) {
      alert("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Upload className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-bold text-slate-900">Upload Verified Government Document</h3>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Income Certificate">Income Certificate (Revenue Dept)</option>
              <option value="Student ID">Student College/School ID</option>
              <option value="Aadhaar Card">Aadhaar Card (Identity Proof)</option>
              <option value="Ration Card">Ration Card (Family Proof)</option>
              <option value="Land Record">Land Pattadar Passbook</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Document Label</label>
            <input
              type="text"
              placeholder="e.g. Income Proof 2025-26"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select File (PDF / Image)</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={!file || isUploading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> AI Document Verification in Progress...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" /> Upload & Scan via AI OCR
            </>
          )}
        </button>
      </form>

      {extractedData && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-xs text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">OCR Scan Verified:</span>
            <p className="font-mono text-[11px] mt-0.5">{extractedData}</p>
          </div>
        </div>
      )}
    </div>
  );
};
