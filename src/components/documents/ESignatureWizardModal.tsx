import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import { EFormType, DocumentItem } from "../../types";
import { SignatureCanvas } from "./SignatureCanvas";
import {
  X,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  PenTool,
  Upload,
  User,
  Home,
  Calendar,
  DollarSign,
  AlertCircle,
  Sparkles,
  Info
} from "lucide-react";

interface ESignatureWizardModalProps {
  onClose: () => void;
  onSuccess: (newDoc: DocumentItem) => void;
}

export const ESignatureWizardModal: React.FC<ESignatureWizardModalProps> = ({ onClose, onSuccess }) => {
  const { currentUser, addDocument, triggerPushNotification, logAuditAction } = useSociety();

  // Wizard Step State (1: Form Select, 2: Details, 3: Signature, 4: Review & Submit)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Selected Template
  const [eFormType, setEFormType] = useState<EFormType>("Rental Agreement & Tenant Registration");

  // Dynamic Form Field State
  const [formFields, setFormFields] = useState<Record<string, string>>({
    // Defaults for Rental Agreement
    landlordName: currentUser.name,
    tenantName: "David Vance",
    tenantPhone: "+1 (555) 234-5678",
    tenantEmail: "david.vance@example.com",
    leaseStartDate: "2026-09-01",
    leaseEndDate: "2027-08-31",
    monthlyRent: "2200",
    securityDeposit: "4400"
  });

  // Signature State
  const [sigMode, setSigMode] = useState<"draw" | "type" | "upload">("draw");
  const [drawnSigDataUrl, setDrawnSigDataUrl] = useState<string | null>(null);
  const [typedSigText, setTypedSigText] = useState(currentUser.name);
  const [typedSigStyle, setTypedSigStyle] = useState<"cursive" | "serif" | "calligraphy">("cursive");
  const [undertakingAgreed, setUndertakingAgreed] = useState(false);

  // Handle Form Type Change & Load Smart Default Fields
  const handleFormTypeChange = (type: EFormType) => {
    setEFormType(type);
    switch (type) {
      case "Rental Agreement & Tenant Registration":
        setFormFields({
          landlordName: currentUser.name,
          tenantName: "David Vance",
          tenantPhone: "+1 (555) 234-5678",
          tenantEmail: "david.vance@example.com",
          leaseStartDate: "2026-09-01",
          leaseEndDate: "2027-08-31",
          monthlyRent: "2200",
          securityDeposit: "4400",
          specialNotes: "No subletting. Tenant acknowledges quiet hours 10 PM - 7 AM."
        });
        break;
      case "Move-In / Move-Out Request":
        setFormFields({
          movementType: "Move-In (New Resident)",
          movementDate: "2026-08-20",
          elevatorSlot: "09:00 AM - 01:00 PM (Slot #1)",
          packersVendor: "SwiftMove Logistics",
          truckRegNumber: "NY-LOG-8821",
          elevatorCautionDeposit: "$150 Refundable"
        });
        break;
      case "Renovation & Interior NOC":
        setFormFields({
          workScope: "Modular Kitchen Fitting & Painting",
          contractorFirm: "UrbanSpace Renovations",
          contractorPhone: "+1 (555) 321-7788",
          startDate: "2026-08-25",
          estimatedDays: "5 Working Days",
          drillingHoursCommitment: "Strict 10:00 AM - 05:00 PM Weekdays Only"
        });
        break;
      case "Pet Registration & Undertaking":
        setFormFields({
          petName: "Milo",
          species: "Dog",
          breed: "Golden Retriever",
          rabiesVaccinationCertNo: "RAB-2026-992",
          emergencyVetPhone: "+1 (555) 444-1122",
          leashCommitment: "Agreed to leash in common areas & waste cleanup"
        });
        break;
      case "Vehicle Parking Slot Allocation":
        setFormFields({
          vehicleType: "Car",
          makeModel: "Tesla Model 3",
          regNo: "NY-502-E",
          slotPreference: "Basement Bay B1-42",
          evChargerRequired: "Yes"
        });
        break;
      case "Clubhouse Event Authorization":
        setFormFields({
          eventName: "Birthday Celebration",
          eventDate: "2026-08-28",
          guestCount: "35 Guests",
          cateringVendor: "Gourmet Flavors Catering",
          musicCutoffCommitment: "Music strictly off by 10:00 PM"
        });
        break;
    }
  };

  const updateFormField = (key: string, val: string) => {
    setFormFields(prev => ({ ...prev, [key]: val }));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!undertakingAgreed) {
      alert("Please check the Bylaws & E-Sign Undertaking acknowledgment box before submitting.");
      return;
    }

    // Determine final signature content
    let finalSigContent = "";
    if (sigMode === "draw") {
      if (!drawnSigDataUrl) {
        alert("Please draw your digital signature on the canvas.");
        return;
      }
      finalSigContent = drawnSigDataUrl;
    } else if (sigMode === "type") {
      if (!typedSigText.trim()) {
        alert("Please type your name for the digital signature.");
        return;
      }
      finalSigContent = typedSigText;
    } else {
      finalSigContent = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='50'><text x='10' y='35' font-family='monospace' font-size='16' fill='%231e3a8a'>[E-STAMP: ${currentUser.name.toUpperCase()}]</text></svg>`;
    }

    // Generate cryptographic verification codes
    const timestampStr = new Date().toISOString();
    const verifCode = `ESIGN-2026-${eFormType.split(" ")[0].toUpperCase()}-${currentUser.unitNumber}-${Math.floor(1000 + Math.random() * 9000)}`;
    const sha256Mock = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    // Build document metadata
    const docTitle = `[E-Signed] ${eFormType} - Flat ${currentUser.unitNumber}`;
    const docDesc = `Digitally signed ${eFormType} submitted by ${currentUser.name} (Unit ${currentUser.unitNumber}). Verification Ref: ${verifCode}.`;

    const newDoc = addDocument({
      title: docTitle,
      category: eFormType.includes("NOC") ? "NOC & Safety Certificates" : "Personal Unit Locker",
      description: docDesc,
      fileType: "PDF",
      fileSize: "1.4 MB",
      isPrivate: true,
      unitNumber: currentUser.unitNumber,
      tags: ["E-Signed", eFormType.split(" ")[0], currentUser.unitNumber],
      certifiedSeal: false, // Pending committee approval
      isESigned: true,
      eFormType,
      eSignatureData: {
        signatureType: sigMode,
        signatureContent: finalSigContent,
        signerName: currentUser.name,
        signerEmail: currentUser.email,
        signerPhone: currentUser.phone,
        signerUnit: currentUser.unitNumber,
        signedAt: `${timestampStr.replace("T", " ").substring(0, 19)} UTC`,
        verificationCode: verifCode,
        sha256Hash: sha256Mock,
        ipAddress: "172.56.21.90",
        status: "Pending Review",
        formFieldsSummary: formFields
      }
    });

    onSuccess(newDoc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 space-y-5 text-slate-900 shadow-xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Digital E-Signature Portal</h3>
              <p className="text-xs text-slate-500">Sign official society forms & agreements with legally binding verification</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Bar */}
        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs font-semibold">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${step === 1 ? "bg-indigo-600 text-white" : "text-slate-600"}`}>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
            <span>Choose Template</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${step === 2 ? "bg-indigo-600 text-white" : "text-slate-600"}`}>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
            <span>Fill Form Fields</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${step === 3 ? "bg-indigo-600 text-white" : "text-slate-600"}`}>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
            <span>Sign & Verify</span>
          </div>
        </div>

        {/* STEP 1: SELECT TEMPLATE */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 font-medium">
              Select the common society document or agreement form you wish to complete and sign:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  id: "Rental Agreement & Tenant Registration",
                  icon: Home,
                  desc: "Landlord-Tenant lease declaration & Society NOC for tenant registration.",
                  badge: "Popular"
                },
                {
                  id: "Move-In / Move-Out Request",
                  icon: Upload,
                  desc: "Elevator reservation, furniture moving clearance & deposit declaration.",
                  badge: "Required"
                },
                {
                  id: "Renovation & Interior NOC",
                  icon: ShieldCheck,
                  desc: "Architectural modification approval, noise hours compliance & debris removal.",
                  badge: "Approval Required"
                },
                {
                  id: "Pet Registration & Undertaking",
                  icon: Sparkles,
                  desc: "Pet profile, rabies vaccination proof & common area hygiene pledge.",
                  badge: "Standard"
                },
                {
                  id: "Vehicle Parking Slot Allocation",
                  icon: User,
                  desc: "Basement bay allotment, EV charger access & gate sticker request.",
                  badge: "Standard"
                },
                {
                  id: "Clubhouse Event Authorization",
                  icon: Calendar,
                  desc: "Party hall booking, guest count limits & 10 PM sound curfew undertaking.",
                  badge: "Approval Required"
                }
              ].map(tmpl => {
                const IconComponent = tmpl.icon;
                const isSelected = eFormType === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleFormTypeChange(tmpl.id as EFormType)}
                    className={`p-4 rounded-xl border text-left transition flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${isSelected ? "text-indigo-600" : "text-slate-500"}`} />
                        <span className="font-bold text-xs text-slate-900">{tmpl.id}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {tmpl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{tmpl.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <span>Continue to Form Details</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: FILL DYNAMIC FORM FIELDS */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Selected Form Template</span>
                <h4 className="font-bold text-sm text-slate-900">{eFormType}</h4>
              </div>
              <button onClick={() => setStep(1)} className="text-xs text-indigo-600 hover:underline font-semibold">
                Change Form
              </button>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {/* Common Resident Applicant Header */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs">
                <div>
                  <label className="text-slate-500 block text-[10px] font-bold uppercase">Applicant Name</label>
                  <span className="font-bold text-slate-900">{currentUser.name}</span>
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px] font-bold uppercase">Unit & Tower</label>
                  <span className="font-bold text-slate-900">Flat {currentUser.unitNumber} ({currentUser.tower})</span>
                </div>
              </div>

              {/* Dynamic Inputs Based on eFormType */}
              {Object.entries(formFields).map(([key, val]) => {
                const labelText = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key}>
                    <label className="text-slate-700 block text-xs font-bold mb-1">{labelText}</label>
                    <input
                      type="text"
                      value={val}
                      onChange={e => updateFormField(key, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <span>Proceed to E-Signature</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: E-SIGNATURE & LEGAL UNDERTAKING */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Signature Method Selection */}
            <div>
              <label className="text-slate-700 block text-xs font-bold mb-2">Select Digital Signature Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "draw", label: "✍️ Draw Signature", desc: "Mouse / Touch Canvas" },
                  { id: "type", label: "⌨️ Type Name", desc: "Handwriting Cursive" },
                  { id: "upload", label: "🛡️ Digital Stamp", desc: "Official Resident Badge" }
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSigMode(m.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      sigMode === m.id
                        ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="block text-xs">{m.label}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Signature Inputs */}
            {sigMode === "draw" && (
              <SignatureCanvas onSignatureChange={data => setDrawnSigDataUrl(data)} />
            )}

            {sigMode === "type" && (
              <div className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <div>
                  <label className="text-slate-700 block text-xs font-bold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={typedSigText}
                    onChange={e => setTypedSigText(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 block text-xs font-bold mb-1">Signature Style</label>
                  <div className="flex gap-2">
                    {[
                      { id: "cursive", label: "Cursive Script", styleClass: "font-serif italic" },
                      { id: "serif", label: "Formal Serif", styleClass: "font-serif tracking-widest uppercase" },
                      { id: "calligraphy", label: "Calligraphic", styleClass: "font-mono font-bold tracking-wider" }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setTypedSigStyle(st.id as any)}
                        className={`flex-1 p-2 rounded-lg border text-xs font-medium ${
                          typedSigStyle === st.id ? "border-indigo-600 bg-indigo-100/60 font-bold" : "border-slate-200 bg-white"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Typed Preview Box */}
                <div className="p-4 bg-white border border-slate-300 rounded-xl text-center">
                  <span className="text-xs text-slate-400 block mb-1">Signature Preview:</span>
                  <p className={`text-2xl text-indigo-900 ${
                    typedSigStyle === "cursive" ? "font-serif italic" : typedSigStyle === "serif" ? "font-serif tracking-widest uppercase" : "font-mono font-bold"
                  }`}>
                    {typedSigText || "Your Name"}
                  </p>
                </div>
              </div>
            )}

            {sigMode === "upload" && (
              <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl text-center space-y-2 text-xs text-indigo-900">
                <ShieldCheck className="w-8 h-8 text-indigo-600 mx-auto" />
                <p className="font-bold">Verified Resident Digital Authorization Seal</p>
                <p className="text-[11px] text-indigo-700 max-w-md mx-auto">
                  Attaches your authenticated resident account token ({currentUser.email}, Unit {currentUser.unitNumber}) as a cryptographically signed digital stamp.
                </p>
              </div>
            )}

            {/* Legal Undertaking Checkbox */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={undertakingAgreed}
                  onChange={e => setUndertakingAgreed(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded mt-0.5 focus:ring-indigo-500"
                />
                <span className="text-xs text-amber-950 font-medium leading-relaxed">
                  I, <strong>{currentUser.name}</strong>, resident of <strong>Flat {currentUser.unitNumber}</strong>, declare that the submitted form details are true and correct. I confirm my digital signature attached above carries full legal effect under the Information Technology Act & Society Bylaws.
                </span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                ← Back
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
              >
                <FileCheck className="w-4 h-4 text-indigo-200" />
                <span>Digitally Sign & Submit Form</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
