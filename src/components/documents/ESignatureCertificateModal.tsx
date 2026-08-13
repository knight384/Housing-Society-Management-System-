import React, { useState } from "react";
import { DocumentItem } from "../../types";
import { useSociety } from "../../context/SocietyContext";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Download,
  Calendar,
  User,
  Hash,
  Globe,
  FileText,
  Building,
  Award,
  Check,
  Ban,
  Clock,
  Sparkles,
  QrCode,
  Lock
} from "lucide-react";

interface ESignatureCertificateModalProps {
  document: DocumentItem;
  onClose: () => void;
}

export const ESignatureCertificateModal: React.FC<ESignatureCertificateModalProps> = ({ document, onClose }) => {
  const { currentUser, updateDocumentSignatureStatus, incrementDocumentDownload } = useSociety();
  const esig = document.eSignatureData;

  const [reviewNotesInput, setReviewNotesInput] = useState("");
  const [showAdminAction, setShowAdminAction] = useState(false);

  if (!esig) return null;

  // Handle Download of E-Signed Certificate
  const handleDownloadCertificate = () => {
    incrementDocumentDownload(document.id);

    const certificateContent = `=================================================================\nGRAND VISTA HEIGHTS RESIDENTIAL COMMUNITY\nOFFICIAL E-SIGNED DOCUMENT CERTIFICATE OF VALIDITY\n=================================================================\n
Document Title: ${document.title}
Form Type: ${document.eFormType || "Society Application"}
Verification Code: ${esig.verificationCode}
SHA-256 Audit Fingerprint: ${esig.sha256Hash}
Status: ${esig.status}
Certificate Issued Date: ${esig.signedAt}

-----------------------------------------------------------------
1. SIGNER IDENTIFICATION & AUTHENTICATION
-----------------------------------------------------------------
Signer Name: ${esig.signerName}
Unit / Flat Number: ${esig.signerUnit}
Email Address: ${esig.signerEmail}
Contact Phone: ${esig.signerPhone}
Signing IP Address: ${esig.ipAddress}
Bylaws Undertaking Accepted: YES (Legally Binding Under IT Act)

-----------------------------------------------------------------
2. SUBMITTED FORM PARTICULARS
-----------------------------------------------------------------
${Object.entries(esig.formFieldsSummary)
  .map(([k, v]) => `• ${k}: ${v}`)
  .join("\n")}

-----------------------------------------------------------------
3. ESTATE MANAGEMENT VERIFICATION & AUDIT SEAL
-----------------------------------------------------------------
Official RWA Stamp Status: ${document.certifiedSeal ? "VERIFIED & CERTIFIED SEAL ATTACHED" : "PENDING COMMITTEE AUDIT"}
Reviewed By: ${esig.reviewedBy || "Automated System Check"}
Review Date: ${esig.reviewedAt || esig.signedAt}
Management Remark: ${esig.reviewNotes || "Form validated according to society bylaws."}

=================================================================\nConfidential Document - Grand Vista Heights Digital Locker Vault\n=================================================================\n`;

    const blob = new Blob([certificateContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${document.title.replace(/[^a-zA-Z0-9]/g, "_")}_CERTIFICATE.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAdminApprove = () => {
    updateDocumentSignatureStatus(document.id, "Approved & Sealed", reviewNotesInput || "Approved by RWA Management.");
    setShowAdminAction(false);
  };

  const handleAdminReject = () => {
    updateDocumentSignatureStatus(document.id, "Rejected", reviewNotesInput || "Incomplete details provided.");
    setShowAdminAction(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 space-y-5 text-slate-900 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                esig.status === "Approved & Sealed"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : esig.status === "Rejected"
                  ? "bg-rose-100 text-rose-800 border border-rose-300"
                  : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}>
                {esig.status === "Approved & Sealed" ? "✓ Verified & Sealed" : esig.status === "Rejected" ? "✕ Rejected" : "⏳ Pending Approval"}
              </span>
              <span className="text-xs text-slate-500 font-mono">{esig.verificationCode}</span>
            </div>
            <h3 className="font-bold text-lg text-slate-900 mt-1">{document.title}</h3>
            <p className="text-xs text-slate-500">{document.eFormType || "Society E-Signed Document"}</p>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formal Certificate Header Shield */}
        <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 relative overflow-hidden">
          <div className="absolute top-3 right-3 opacity-15">
            <ShieldCheck className="w-24 h-24 text-indigo-400" />
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="font-bold text-sm tracking-wide">GRAND VISTA HEIGHTS RWA</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Digital E-Signature Certification</p>
              </div>
            </div>

            {document.certifiedSeal && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>RWA Official Seal</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Signer</span>
              <span className="font-bold text-white">{esig.signerName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Flat Unit</span>
              <span className="font-bold text-white">Unit {esig.signerUnit}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Signed Date</span>
              <span className="font-bold text-white">{esig.signedAt.split(" ")[0]}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Signer IP</span>
              <span className="font-bold text-white">{esig.ipAddress}</span>
            </div>
          </div>
        </div>

        {/* Form Fields Summary */}
        <div className="space-y-2">
          <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Form Particulars & Declarations</span>
          </h4>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {Object.entries(esig.formFieldsSummary).map(([k, v]) => (
              <div key={k} className="p-2 bg-white border border-slate-200/80 rounded-lg">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{k}</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Signature Rendering Box */}
        <div className="p-4 bg-indigo-50/40 border border-indigo-200/80 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-indigo-900 font-bold border-b border-indigo-100 pb-2">
            <span>EXECUTED DIGITAL SIGNATURE</span>
            <span className="text-[10px] font-mono font-normal text-indigo-700">Type: {esig.signatureType.toUpperCase()}</span>
          </div>

          <div className="flex items-center justify-center p-4 bg-white border border-slate-200 rounded-xl min-h-[90px]">
            {esig.signatureType === "draw" || esig.signatureContent.startsWith("data:image") ? (
              <img src={esig.signatureContent} alt="Drawn Signature" className="max-h-20 max-w-full object-contain" />
            ) : esig.signatureType === "type" ? (
              <p className="text-3xl font-serif italic text-indigo-950 font-bold tracking-wide">
                {esig.signatureContent}
              </p>
            ) : (
              <div className="flex items-center gap-2 text-indigo-900 font-mono font-bold text-sm">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
                <span>[DIGITAL RESIDENT STAMP: {esig.signerName}]</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Verification Hash: {esig.sha256Hash.substring(0, 24)}...</span>
            <span>IT Act Compliant</span>
          </div>
        </div>

        {/* Committee Review Remark (If reviewed) */}
        {esig.reviewedBy && (
          <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-700 font-bold">
              <span>Management Review Remark:</span>
              <span className="text-[10px] text-slate-500 font-mono">{esig.reviewedAt}</span>
            </div>
            <p className="text-slate-800 text-xs">{esig.reviewNotes}</p>
            <p className="text-[10px] text-slate-500 italic">By: {esig.reviewedBy}</p>
          </div>
        )}

        {/* Committee Admin Action Panel (For Admin User) */}
        {currentUser.role === "admin" && (
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Society Committee Admin Controls</span>
              </span>
              <button
                onClick={() => setShowAdminAction(!showAdminAction)}
                className="text-xs text-amber-800 font-bold underline hover:text-amber-950"
              >
                {showAdminAction ? "Hide Controls" : "Review & Update Seal"}
              </button>
            </div>

            {showAdminAction && (
              <div className="space-y-3 pt-2 border-t border-amber-200/60">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Approval Remark</label>
                  <input
                    type="text"
                    placeholder="e.g. Tenant ID verified, RWA seal applied, elevator padding scheduled..."
                    value={reviewNotesInput}
                    onChange={e => setReviewNotesInput(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAdminApprove}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Attach Official RWA Seal</span>
                  </button>

                  <button
                    onClick={handleAdminReject}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleDownloadCertificate}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4 text-indigo-200" />
            <span>Download Official Certificate (.txt)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
