import React, { useState, useEffect } from "react";
import { citizenApi } from "../services/citizenApi";
import { CitizenDocument } from "../types";
import { DocumentUploader } from "../components/DocumentUploader";
import { FolderOpen, FileText, CheckCircle2, Trash2, ShieldCheck, Sparkles } from "lucide-react";

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<CitizenDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const data = await citizenApi.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete document from vault?")) {
      await citizenApi.deleteDocument(id);
      fetchDocs();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Citizen Documents Vault</h1>
        <p className="text-xs text-slate-500">
          Upload and manage verified government proofs for 1-click scheme eligibility applications.
        </p>
      </div>

      <DocumentUploader onUploadSuccess={fetchDocs} />

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-indigo-600" /> Stored Proofs & AI OCR Status ({documents.length})
        </h3>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">No documents stored in vault yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <div key={doc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900">{doc.title}</h4>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ {doc.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Type: {doc.doc_type}</p>
                    {doc.extracted_data && (
                      <p className="text-[11px] font-mono text-slate-600 mt-1 bg-slate-50 p-1.5 rounded border border-slate-200">
                        {doc.extracted_data}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition self-end sm:self-center"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
