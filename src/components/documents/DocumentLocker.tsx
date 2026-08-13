import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import { DocumentItem } from "../../types";
import { ESignatureWizardModal } from "./ESignatureWizardModal";
import { ESignatureCertificateModal } from "./ESignatureCertificateModal";
import {
  FileText,
  Search,
  Upload,
  Download,
  Eye,
  Trash2,
  Lock,
  ShieldCheck,
  CheckCircle2,
  X,
  Tag,
  Filter,
  FileCheck,
  Award,
  Clock,
  User,
  Building,
  HardDrive,
  Share2,
  FileCode,
  Info,
  Sparkles,
  PenTool,
  Check,
  AlertCircle,
  QrCode
} from "lucide-react";

export const DocumentLocker: React.FC = () => {
  const {
    currentUser,
    documents,
    addDocument,
    deleteDocument,
    incrementDocumentDownload,
    logAuditAction,
    triggerPushNotification
  } = useSociety();

  // Top Level View Mode: "vault" | "esign"
  const [activeTab, setActiveTab] = useState<"vault" | "esign">("vault");

  // Vault Category & Tag Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // E-Sign Specific Filter State
  const [eSignStatusFilter, setESignStatusFilter] = useState<"All" | "Pending Review" | "Approved & Sealed" | "My Submissions">("All");

  // Modals
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showESignWizard, setShowESignWizard] = useState(false);
  const [selectedESignCertDoc, setSelectedESignCertDoc] = useState<DocumentItem | null>(null);

  // Standard Upload Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentItem["category"]>("Society Bylaws & Rules");
  const [description, setDescription] = useState("");
  const [fileType, setFileType] = useState<DocumentItem["fileType"]>("PDF");
  const [fileSize, setFileSize] = useState("1.8 MB");
  const [isPrivate, setIsPrivate] = useState(false);
  const [unitNumber, setUnitNumber] = useState(currentUser.unitNumber);
  const [tagsInput, setTagsInput] = useState("");
  const [certifiedSeal, setCertifiedSeal] = useState(currentUser.role === "admin");

  // E-Signed Documents List
  const eSignedDocs = documents.filter(d => d.isESigned);

  // Filter logic for Vault Documents
  const filteredVaultDocuments = documents.filter(doc => {
    // Privacy check: If private, must belong to currentUser's unit or user is admin
    if (doc.isPrivate && doc.unitNumber !== currentUser.unitNumber && currentUser.role !== "admin") {
      return false;
    }

    // Category filter
    if (selectedCategory !== "All") {
      if (selectedCategory === "Personal Unit Locker") {
        if (!doc.isPrivate && doc.category !== "Personal Unit Locker") return false;
      } else if (doc.category !== selectedCategory) {
        return false;
      }
    }

    // Tag filter
    if (selectedTag && !doc.tags.includes(selectedTag)) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchDesc = doc.description.toLowerCase().includes(q);
      const matchTags = doc.tags.some(t => t.toLowerCase().includes(q));
      const matchCategory = doc.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTags && !matchCategory) {
        return false;
      }
    }

    return true;
  });

  // Filter logic for E-Signed Hub Documents
  const filteredESignedDocs = eSignedDocs.filter(doc => {
    // Privacy check
    if (doc.isPrivate && doc.unitNumber !== currentUser.unitNumber && currentUser.role !== "admin") {
      return false;
    }

    if (eSignStatusFilter === "My Submissions") {
      if (doc.unitNumber !== currentUser.unitNumber && doc.uploadedBy !== currentUser.name) {
        return false;
      }
    } else if (eSignStatusFilter === "Pending Review") {
      if (doc.eSignatureData?.status !== "Pending Review") return false;
    } else if (eSignStatusFilter === "Approved & Sealed") {
      if (doc.eSignatureData?.status !== "Approved & Sealed") return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchDesc = doc.description.toLowerCase().includes(q);
      const matchCode = doc.eSignatureData?.verificationCode.toLowerCase().includes(q);
      const matchSigner = doc.eSignatureData?.signerName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCode && !matchSigner) {
        return false;
      }
    }

    return true;
  });

  // Extract all unique tags
  const allTags = Array.from(new Set(documents.flatMap(d => d.tags)));

  // Download Handler
  const handleDownload = (doc: DocumentItem) => {
    incrementDocumentDownload(doc.id);

    const mockContent = `=================================================================\nGRAND VISTA HEIGHTS RESIDENTIAL COMMUNITY DOCUMENT LOCKER\n=================================================================\nDocument Title: ${doc.title}\nCategory: ${doc.category}\nUploaded By: ${doc.uploadedBy} (${doc.uploadedByRole})\nUpload Date: ${doc.uploadDate}\nDocument ID: ${doc.id}\nVerification Seal: ${doc.certifiedSeal ? "RWA Certified Official Digital Seal Verified" : "Standard Community Asset"}\n\nDESCRIPTION / EXTRACT:\n${doc.description}\n\n=================================================================\nConfidentiality Notice: This document is stored in the secure CivicHQ Document Vault. Unauthorized redistribution is prohibited.\n=================================================================\n`;

    const blob = new Blob([mockContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, "_")}.${doc.fileType.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Upload Submit Handler
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const parsedTags = tagsInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    addDocument({
      title,
      category,
      description,
      fileType,
      fileSize: fileSize || "1.5 MB",
      isPrivate,
      unitNumber: isPrivate ? unitNumber : undefined,
      tags: parsedTags.length > 0 ? parsedTags : [category, fileType],
      certifiedSeal: currentUser.role === "admin" ? certifiedSeal : false
    });

    setShowUploadModal(false);
    setTitle("");
    setDescription("");
    setTagsInput("");
  };

  const getFileTypeStyle = (type: DocumentItem["fileType"]) => {
    switch (type) {
      case "PDF":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "DOCX":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "JPG":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "ZIP":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Secure Document Locker & Vault</h1>
          </div>
          <p className="text-xs text-slate-600">
            Certified storage repository for society bylaws, AGM minutes, property tax vouchers, NOC certificates, and personal e-signed forms.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-open-esign-wizard"
            onClick={() => setShowESignWizard(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
          >
            <PenTool className="w-4 h-4 text-indigo-200" />
            <span>E-Sign Society Form</span>
          </button>

          <button
            id="btn-upload-document-locker"
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
          >
            <Upload className="w-4 h-4 text-slate-300" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Primary View Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab("vault")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === "vault"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Document Vault & Locker</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
            {documents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("esign")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === "esign"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>Digital E-Sign Hub</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono font-bold">
            {eSignedDocs.length} Forms
          </span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total Vault Files</span>
            <HardDrive className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 font-mono">{documents.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Society & Unit Repository</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">E-Signed Submissions</span>
            <PenTool className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 font-mono">{eSignedDocs.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Rental, NOC, Move-In Forms</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">RWA Certified Seals</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 font-mono">
            {documents.filter(d => d.certifiedSeal).length}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Verified Official Papers</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 font-mono">
            {documents.filter(d => d.eSignatureData?.status === "Pending Review").length}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Awaiting RWA Stamp</p>
        </div>
      </div>

      {/* ==================== VIEW 1: DOCUMENT VAULT & LOCKER ==================== */}
      {activeTab === "vault" && (
        <div className="space-y-4">
          {/* Category Pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold overflow-x-auto scrollbar-none">
            {[
              { id: "All", label: "All Repository Documents" },
              { id: "Society Bylaws & Rules", label: "Bylaws & Rules" },
              { id: "Meeting Minutes & AGM", label: "AGM Minutes" },
              { id: "Tax & Audit Statements", label: "Tax & Audits" },
              { id: "NOC & Safety Certificates", label: "NOC & Safety" },
              { id: "Maintenance Guides", label: "SOP Guides" },
              { id: "Personal Unit Locker", label: `My Flat Vault (${currentUser.unitNumber})` }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-3.5 rounded-lg transition whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search & Tag Filter Bar */}
          <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search document title, tags, description (e.g. Bylaws, Property Tax, Fire NOC)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                <span>Tag: {selectedTag}</span>
                <X className="w-3 h-3 text-indigo-500 hover:text-indigo-900" />
              </button>
            )}

            <span className="text-xs text-slate-500 font-mono font-medium shrink-0">
              Showing <strong className="text-slate-900 font-bold">{filteredVaultDocuments.length}</strong> Files
            </span>
          </div>

          {/* Quick Tags Cloud */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Tag className="w-3 h-3" /> Quick Tags:
            </span>
            {allTags.slice(0, 8).map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border transition whitespace-nowrap ${
                  selectedTag === tag
                    ? "bg-slate-900 text-white border-slate-900 font-bold"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVaultDocuments.map(doc => {
              const fileStyle = getFileTypeStyle(doc.fileType);
              return (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition group"
                >
                  <div className="space-y-3">
                    {/* Header Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border font-mono ${fileStyle}`}>
                          {doc.fileType}
                        </span>
                        {doc.isESigned && (
                          <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                            <PenTool className="w-3 h-3 text-indigo-600" /> E-Signed
                          </span>
                        )}
                      </div>

                      {doc.certifiedSeal ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Certified Seal</span>
                        </span>
                      ) : doc.isPrivate ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                          <Lock className="w-3 h-3 text-indigo-600" />
                          <span>Unit {doc.unitNumber} Vault</span>
                        </span>
                      ) : null}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-indigo-600 transition">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                        {doc.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {doc.tags.map(t => (
                        <span key={t} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Meta & Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>By: <strong className="text-slate-800">{doc.uploadedBy}</strong></span>
                      <span>{doc.uploadDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => doc.isESigned ? setSelectedESignCertDoc(doc) : setPreviewDoc(doc)}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{doc.isESigned ? "Certificate" : "Inspect"}</span>
                      </button>

                      <button
                        onClick={() => handleDownload(doc)}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-200" />
                        <span>Download</span>
                      </button>

                      {(currentUser.role === "admin" || doc.uploadedBy === currentUser.name) && (
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredVaultDocuments.length === 0 && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">No Documents Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No matching files found under the selected category or tag. Upload a document or reset search filters.
              </p>
              <button
                onClick={() => { setSelectedCategory("All"); setSearchQuery(""); setSelectedTag(null); }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== VIEW 2: DIGITAL E-SIGN HUB ==================== */}
      {activeTab === "esign" && (
        <div className="space-y-4">
          
          {/* E-Sign Hub Hero Action Bar */}
          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-indigo-200">
                  IT Act & Society Bylaws Compliant
                </span>
                <h2 className="text-lg font-bold mt-2">Society Digital Forms & Agreement Signing</h2>
                <p className="text-xs text-indigo-200 mt-1 max-w-xl leading-relaxed">
                  Digitally execute rental agreements, move-in/move-out elevator authorizations, flat renovation NOC undertakings, and pet registrations with verifiable cryptographic audit logs.
                </p>
              </div>

              <button
                onClick={() => setShowESignWizard(true)}
                className="px-5 py-3 bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
              >
                <PenTool className="w-4 h-4 text-indigo-700" />
                <span>Launch E-Sign Wizard</span>
              </button>
            </div>

            {/* Status Filter Sub-Bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-indigo-800/80 text-xs font-semibold overflow-x-auto scrollbar-none">
              <span className="text-indigo-300 text-[11px]">Filter Submissions:</span>
              {[
                { id: "All", label: "All Signed Forms" },
                { id: "Pending Review", label: "Pending Approval" },
                { id: "Approved & Sealed", label: "Verified & RWA Sealed" },
                { id: "My Submissions", label: `My Unit ${currentUser.unitNumber}` }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setESignStatusFilter(st.id as any)}
                  className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
                    eSignStatusFilter === st.id
                      ? "bg-white text-indigo-900 font-bold"
                      : "bg-indigo-800/60 text-indigo-200 hover:bg-indigo-800"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input for E-Sign Hub */}
          <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-xs flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search signed form, resident name, verification code (e.g. ESIGN-2026-RENT)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
            <span className="text-xs text-slate-500 font-mono font-medium">
              Showing <strong>{filteredESignedDocs.length}</strong> E-Signed Papers
            </span>
          </div>

          {/* E-Signed Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredESignedDocs.map(doc => {
              const esig = doc.eSignatureData;
              if (!esig) return null;

              return (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header Status Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        esig.status === "Approved & Sealed"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : esig.status === "Rejected"
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {esig.status === "Approved & Sealed" ? "✓ Approved & RWA Sealed" : esig.status === "Rejected" ? "✕ Rejected" : "⏳ Pending Approval"}
                      </span>

                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {esig.verificationCode}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Form Type: <strong className="text-slate-800">{doc.eFormType || "Society Form"}</strong>
                      </p>
                    </div>

                    {/* Quick Fields Summary */}
                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 text-xs font-mono text-slate-700">
                      {Object.entries(esig.formFieldsSummary).slice(0, 3).map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-2 text-[11px]">
                          <span className="text-slate-500 truncate">{k}:</span>
                          <span className="font-bold text-slate-900 truncate">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Signer Footer & Certificate Button */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Signer: <strong className="text-slate-800">{esig.signerName}</strong> (Unit {esig.signerUnit})</span>
                      <span>{esig.signedAt.split(" ")[0]}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedESignCertDoc(doc)}
                        className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-200" />
                        <span>Inspect E-Sign Certificate</span>
                      </button>

                      {(currentUser.role === "admin" || doc.uploadedBy === currentUser.name) && (
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-2.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
                          title="Delete signature submission"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredESignedDocs.length === 0 && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-3">
              <PenTool className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">No E-Signed Submissions Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No matching forms found under the selected filter. Click below to execute a new digital agreement or request form.
              </p>
              <button
                onClick={() => setShowESignWizard(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                Sign New Society Form
              </button>
            </div>
          )}

        </div>
      )}

      {/* ==================== MODALS ==================== */}

      {/* STANDARD VAULT INSPECT / PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl p-6 space-y-5 text-slate-900 shadow-xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getFileTypeStyle(previewDoc.fileType)}`}>
                  {previewDoc.fileType} Document
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">{previewDoc.title}</h3>
                <p className="text-xs text-slate-500">{previewDoc.category}</p>
              </div>

              <button onClick={() => setPreviewDoc(null)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification Banner */}
            {previewDoc.certifiedSeal ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">RWA Official Seal Verified</p>
                  <p className="text-[11px] text-emerald-700">
                    This document carries an official digital stamp from the Grand Vista Heights Managing Committee.
                  </p>
                </div>
              </div>
            ) : previewDoc.isPrivate ? (
              <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-3 text-xs text-indigo-900">
                <Lock className="w-6 h-6 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-bold">Confidential Unit Vault (Flat {previewDoc.unitNumber})</p>
                  <p className="text-[11px] text-indigo-700">
                    Restricted access. Only visible to residents of Flat {previewDoc.unitNumber} and estate admins.
                  </p>
                </div>
              </div>
            ) : null}

            {/* Document Details Grid */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono text-slate-700">
              <p><strong>Description:</strong> <span className="font-sans font-normal text-slate-900 block mt-1">{previewDoc.description}</span></p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <p><strong>File Size:</strong> {previewDoc.fileSize}</p>
                <p><strong>Upload Date:</strong> {previewDoc.uploadDate}</p>
                <p><strong>Uploaded By:</strong> {previewDoc.uploadedBy}</p>
                <p><strong>Downloads:</strong> {previewDoc.downloadCount} times</p>
              </div>
            </div>

            {/* Mock Reader Box */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-900 text-slate-100 font-mono text-[11px] space-y-2">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span>DIGITAL VAULT READ-ONLY PREVIEW</span>
                <FileCode className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-slate-300 leading-relaxed">
                [SECURE READ-ONLY STREAM] Grand Vista Heights Document Repository Engine v2.4. Document SHA256 checksum: 0x8a92f14c... Clean security scan verified.
              </p>
              <p className="text-slate-400 italic">
                "{previewDoc.description}"
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => { handleDownload(previewDoc); setPreviewDoc(null); }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4 text-indigo-200" />
                <span>Download Official File ({previewDoc.fileType})</span>
              </button>

              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 text-slate-900 shadow-xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
                <Upload className="w-5 h-5" />
                <h3>Upload Document to Locker</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-bold">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Society Bylaws 2026, Flat Deed, Property Tax Voucher..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  >
                    <option value="Society Bylaws & Rules">Society Bylaws & Rules</option>
                    <option value="Meeting Minutes & AGM">Meeting Minutes & AGM</option>
                    <option value="Tax & Audit Statements">Tax & Audit Statements</option>
                    <option value="NOC & Safety Certificates">NOC & Safety Certificates</option>
                    <option value="Maintenance Guides">Maintenance Guides</option>
                    <option value="Personal Unit Locker">Personal Unit Locker</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">File Format</label>
                  <select
                    value={fileType}
                    onChange={e => setFileType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  >
                    <option value="PDF">PDF (.pdf)</option>
                    <option value="DOCX">Word (.docx)</option>
                    <option value="JPG">Image (.jpg/.png)</option>
                    <option value="ZIP">Archive (.zip)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-bold">Description & Summary</label>
                <textarea
                  rows={3}
                  placeholder="Provide details about this document, issuing authority, coverage period..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-bold">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Property Tax, Flat Deed, Bylaws"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                />
              </div>

              {/* Privacy Toggle */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    <span>Private Unit Document</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={e => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {isPrivate
                    ? `Restricted file. Only accessible by Flat ${unitNumber} residents and estate management.`
                    : "Public file. Accessible by all residents in the society document repository."}
                </p>
              </div>

              {/* Admin Seal Toggle */}
              {currentUser.role === "admin" && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Attach Official RWA Certified Seal</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={certifiedSeal}
                    onChange={e => setCertifiedSeal(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Upload to Document Locker
              </button>
            </form>

          </div>
        </div>
      )}

      {/* E-SIGNATURE WIZARD MODAL */}
      {showESignWizard && (
        <ESignatureWizardModal
          onClose={() => setShowESignWizard(false)}
          onSuccess={newDoc => {
            setShowESignWizard(false);
            setActiveTab("esign");
            setSelectedESignCertDoc(newDoc);
          }}
        />
      )}

      {/* E-SIGNATURE CERTIFICATE INSPECT MODAL */}
      {selectedESignCertDoc && (
        <ESignatureCertificateModal
          document={selectedESignCertDoc}
          onClose={() => setSelectedESignCertDoc(null)}
        />
      )}

    </div>
  );
};
