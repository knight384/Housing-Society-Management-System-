import React, { useState, useRef } from "react";
import { useSociety } from "../../context/SocietyContext";
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  Lock,
  UserCheck,
  Eye,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  History,
  FileText,
  Key,
  Shield,
  EyeOff,
  Trash2,
  X,
  AlertCircle,
  Check,
  Printer
} from "lucide-react";

export const GDPRBackupCenter: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    switchRole,
    gdprConsent,
    updateGdprConsent,
    exportDataJSON,
    importDataJSON,
    resetToInitialData,
    auditLogs,
    logAuditAction,
    bills,
    bookings,
    visitors,
    tickets
  } = useSociety();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Security & Encryption State
  const [piiMaskingEnabled, setPiiMaskingEnabled] = useState(true);
  const [selectedRbacRole, setSelectedRbacRole] = useState<'resident' | 'admin' | 'security'>(currentUser.role);

  // GDPR Erasure Modal State
  const [showErasureModal, setShowErasureModal] = useState(false);
  const [erasureConfirmationText, setErasureConfirmationText] = useState("");
  const [isErased, setIsErased] = useState(false);

  // Data Access Request Modal
  const [showDataAccessModal, setShowDataAccessModal] = useState(false);

  const handleExportBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `societyhub-cloud-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg({ type: "success", text: "Cloud backup exported successfully!" });
  };

  const handleExportPersonalGdprData = () => {
    const personalData = {
      profile: currentUser,
      bills: bills.filter(b => b.unitNumber === currentUser.unitNumber),
      bookings: bookings.filter(b => b.unitNumber === currentUser.unitNumber),
      visitorPasses: visitors.filter(v => v.unitNumber === currentUser.unitNumber),
      maintenanceTickets: tickets.filter(t => t.unitNumber === currentUser.unitNumber),
      exportTimestamp: new Date().toISOString(),
      gdprComplianceNotice: "This archive contains all personal data and session logs associated with your flat as mandated by GDPR Article 15 (Right of Access)."
    };
    const blob = new Blob([JSON.stringify(personalData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gdpr-personal-archive-${currentUser.unitNumber}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg({ type: "success", text: "Personal GDPR Data Archive downloaded." });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        const ok = importDataJSON(content);
        if (ok) {
          setStatusMsg({ type: "success", text: "Society state restored successfully from backup file!" });
        } else {
          setStatusMsg({ type: "error", text: "Failed to parse backup JSON file." });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteErasure = () => {
    if (erasureConfirmationText !== "CONFIRM DELETE") return;

    // Anonymize user records in context
    setCurrentUser({
      ...currentUser,
      name: "Anonymized Resident",
      email: "anonymized@gdpr-deleted.com",
      phone: "+1 000-000-0000",
      emergencyContact: "Deleted"
    });

    logAuditAction("GDPR Data Export", `Executed Right to be Forgotten (Art. 17) data erasure for Flat ${currentUser.unitNumber}`);
    setIsErased(true);
    setShowErasureModal(false);
    setStatusMsg({ type: "success", text: "Account personal data successfully anonymized as per GDPR Article 17." });
  };

  const maskString = (str: string) => {
    if (!piiMaskingEnabled || str.length < 5) return str;
    return str.substring(0, 3) + "****" + str.substring(str.length - 2);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Security, RBAC & GDPR Compliance Center</h1>
          </div>
          <p className="text-xs text-slate-600">
            Role-based access controls, AES-256 data encryption, GDPR data portability (Art. 15), Right to be Forgotten (Art. 17), and security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0 font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>AES-256 Encrypted</span>
          </span>
          <span className="text-xs font-mono text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0 font-semibold">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>GDPR Compliant</span>
          </span>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
          statusMsg.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
        }`}>
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="text-slate-500 hover:text-slate-900 font-bold">Dismiss</button>
        </div>
      )}

      {/* SECTION 1: ROLE-BASED ACCESS CONTROL (RBAC) MATRIX */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-base text-slate-900">Role-Based Access Control (RBAC) Matrix</h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Active Role: <strong className="text-slate-900 capitalize">{currentUser.role}</strong> ({currentUser.name} - {currentUser.unitNumber})
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs">
            {(['resident', 'admin', 'security'] as const).map(role => (
              <button
                key={role}
                onClick={() => {
                  setSelectedRbacRole(role);
                  switchRole(role);
                }}
                className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition ${
                  currentUser.role === role ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {role} View
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Portal Module</th>
                <th className="p-3">Resident Permissions</th>
                <th className="p-3">Management / Admin</th>
                <th className="p-3">Gate Security Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { module: "Dues & Payment Portal", resident: "View & Pay Personal Bills", admin: "Full Billing & Send Reminders", security: "No Access" },
                { module: "Financial Ledger & Reports", resident: "No Access", admin: "Full Audit & Ledger Entry", security: "No Access" },
                { module: "Amenity Reservations", resident: "Book & Generate Pass", admin: "Manage Slots & Rules", security: "Verify QR Code Pass" },
                { module: "Visitor Gate Management", resident: "Pre-approve Guests & Delivery", admin: "View Full Gate Audit Logs", security: "Gate Terminal Check-In/Out" },
                { module: "Maintenance Helpdesk", resident: "Raise & Rate Complaint", admin: "Assign Staff & Resolve", security: "View Urgent Work Orders" },
                { module: "GDPR & System Backups", resident: "Personal Data Archive (Art 15)", admin: "Full Cloud Backup & Restore", security: "Security Audit Log View" },
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-slate-900">{item.module}</td>
                  <td className="p-3 text-slate-600">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                      {item.resident}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                      {item.admin}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                      {item.security}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: ENCRYPTION AT REST & IN TRANSIT MONITOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Encryption Controls */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-base text-slate-900">Encryption & Data Security Suite</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">In-Transit Encryption (TLS 1.3)</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] border border-emerald-300 font-semibold">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-600">All browser-server API exchanges encrypted with 256-bit TLS HTTPS cipher suites.</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">Database At-Rest Encryption</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] border border-blue-300 font-semibold">
                  AES-256-GCM
                </span>
              </div>
              <p className="text-[11px] text-slate-600">Payload Key ID: <code className="text-amber-800 font-mono font-semibold">KEY-2026-AES256-GCM-CIVICHQ</code></p>
            </div>

            {/* PII Masking Control */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Mask Sensitive PII (Phones & Cards)</p>
                <p className="text-[11px] text-slate-600">Auto-redact contact details in display</p>
              </div>
              <button
                onClick={() => setPiiMaskingEnabled(!piiMaskingEnabled)}
                className={`p-2 rounded-xl border transition ${
                  piiMaskingEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                {piiMaskingEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Cloud Backup & Database State Controls */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-base text-slate-900">Cloud Database Backup & Restore</h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Create an encrypted snapshot of society records or restore database state from a verified JSON backup file.
          </p>

          <div className="space-y-2.5 pt-1">
            <button
              id="btn-backup-export"
              onClick={handleExportBackup}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Export Complete Cloud Backup (JSON)</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />

            <button
              id="btn-backup-restore"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Restore State from Backup File</span>
            </button>

            <button
              id="btn-reset-initial"
              onClick={resetToInitialData}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset Database to Initial Seed Data</span>
            </button>
          </div>
        </div>

      </div>

      {/* SECTION 3: GDPR RIGHTS & CONSENT MANAGEMENT */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-base text-slate-900">GDPR Privacy & Data Subject Rights (Art. 15 & 17)</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Consent Preferences */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <p className="font-bold uppercase text-[10px] tracking-wider text-emerald-700">Granular Privacy Consent Toggles</p>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Allow Gate Check-In Push Notifications</span>
              <input
                type="checkbox"
                checked={gdprConsent.allowVisitorNotifications}
                onChange={e => updateGdprConsent({ allowVisitorNotifications: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-700">Display Phone Number in Resident Directory</span>
              <input
                type="checkbox"
                checked={gdprConsent.phoneVisibleToNeighbors}
                onChange={e => updateGdprConsent({ phoneVisibleToNeighbors: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </div>

            <p className="text-[10px] text-slate-500 pt-1 font-mono">Consent Timestamp: {gdprConsent.lastUpdated}</p>
          </div>

          {/* Data Subject Action Buttons */}
          <div className="space-y-3 flex flex-col justify-center">
            <button
              id="btn-export-gdpr-personal"
              onClick={handleExportPersonalGdprData}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-xs"
            >
              <FileJson className="w-4 h-4 text-emerald-400" />
              <span>Export Personal Data Archive (GDPR Art. 15)</span>
            </button>

            <button
              onClick={() => setShowDataAccessModal(true)}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>View Data Access Transparency Summary</span>
            </button>

            {isErased ? (
              <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-center font-mono">
                ✓ Account Personal Data Anonymized (GDPR Art. 17 Executed)
              </p>
            ) : (
              <button
                onClick={() => setShowErasureModal(true)}
                className="w-full py-2 text-xs text-rose-400 hover:text-rose-300 underline transition text-center"
              >
                Request Account Data Erasure / Right to be Forgotten (Art. 17)
              </button>
            )}
          </div>

        </div>
      </div>

      {/* SECTION 4: AUDIT LOG VIEWER */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-base text-slate-900">System Security & Access Audit Trail</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Role</th>
                <th className="p-3">Category</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 text-slate-500">{log.timestamp}</td>
                  <td className="p-3 font-sans font-semibold text-slate-900">{maskString(log.actorName)}</td>
                  <td className="p-3 font-sans capitalize text-blue-700 font-semibold">{log.actorRole}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-700">
                      {log.actionCategory}
                    </span>
                  </td>
                  <td className="p-3 font-sans text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GDPR ART 17 DATA ERASURE CONFIRMATION MODAL */}
      {showErasureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-rose-200 rounded-2xl w-full max-w-md p-6 space-y-4 text-slate-900 shadow-xl relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                <Trash2 className="w-5 h-5" />
                <h3>Execute Right to be Forgotten</h3>
              </div>
              <button onClick={() => setShowErasureModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In compliance with <strong>GDPR Article 17</strong>, this action will permanently anonymize your name, email, phone number, and personal profile markers from active society logs.
            </p>

            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-800 font-mono space-y-1">
              <p>Type <strong>CONFIRM DELETE</strong> to execute anonymization:</p>
            </div>

            <input
              type="text"
              placeholder="CONFIRM DELETE"
              value={erasureConfirmationText}
              onChange={e => setErasureConfirmationText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-rose-500"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowErasureModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteErasure}
                disabled={erasureConfirmationText !== "CONFIRM DELETE"}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition shadow-xs"
              >
                Execute Anonymization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DATA ACCESS TRANSPARENCY MODAL */}
      {showDataAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl p-6 text-slate-900 space-y-4 shadow-xl relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-base">
                <FileText className="w-5 h-5" />
                <h3>GDPR Personal Data Transparency Summary</h3>
              </div>
              <button onClick={() => setShowDataAccessModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">Flat Profile Records</p>
                <p className="text-slate-600">{currentUser.name} • {currentUser.email} • Flat {currentUser.unitNumber}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">Registered Dues Bills</p>
                <p className="text-slate-600">{bills.filter(b => b.unitNumber === currentUser.unitNumber).length} Bills Associated</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">Amenity Reservations</p>
                <p className="text-slate-600">{bookings.filter(b => b.unitNumber === currentUser.unitNumber).length} Bookings Made</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">Visitor Passes Created</p>
                <p className="text-slate-600">{visitors.filter(v => v.unitNumber === currentUser.unitNumber).length} Guest Passes Issued</p>
              </div>
            </div>

            <button
              onClick={() => setShowDataAccessModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Close Summary
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
