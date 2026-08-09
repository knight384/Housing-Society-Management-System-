import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import { VisitorPass } from "../../types";
import {
  Users,
  QrCode,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Car,
  Truck,
  UserCheck,
  X,
  AlertCircle,
  Clock,
  DoorOpen,
  Share2,
  Mail,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Printer
} from "lucide-react";

export const VisitorManagement: React.FC = () => {
  const {
    currentUser,
    visitors,
    createVisitorPass,
    checkInVisitor,
    checkOutVisitor,
    denyVisitor
  } = useSociety();

  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Gate Scanner state
  const [verifyCode, setVerifyCode] = useState("");
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);

  // New Pass Form Modal State
  const [showPassModal, setShowPassModal] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorType, setVisitorType] = useState<VisitorPass['visitorType']>("Guest");
  const [expectedDate, setExpectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [expectedTime, setExpectedTime] = useState("02:00 PM");
  const [vehicleNo, setVehicleNo] = useState("");
  const [notes, setNotes] = useState("");
  const [createdPass, setCreatedPass] = useState<VisitorPass | null>(null);

  // Pass Share Modal State
  const [selectedSharePass, setSelectedSharePass] = useState<VisitorPass | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const generatePassMessage = (pass: VisitorPass) => {
    return `🏛️ CivicHQ Digital Gate Entry Pass\n\n` +
           `👤 Visitor Name: ${pass.visitorName} (${pass.visitorType})\n` +
           `🔑 Pass PIN Code: ${pass.passCode}\n` +
           `🏡 Host Residence: Flat ${pass.unitNumber} (${pass.hostResidentName})\n` +
           `📅 Scheduled: ${pass.expectedDate} at ${pass.expectedTime}\n` +
           (pass.vehicleNo ? `🚗 Vehicle Registration: ${pass.vehicleNo}\n` : '') +
           `\n📱 Present this PIN code or QR pass at Gate 1 Security Terminal for instant check-in.`;
  };

  const handleShareWhatsApp = (pass: VisitorPass) => {
    const text = encodeURIComponent(generatePassMessage(pass));
    const cleanPhone = pass.visitorPhone ? pass.visitorPhone.replace(/[^0-9]/g, "") : "";
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, "_blank");
  };

  const handleShareEmail = (pass: VisitorPass) => {
    const subject = encodeURIComponent(`Visitor Gate Pass: ${pass.visitorName} (Flat ${pass.unitNumber})`);
    const body = encodeURIComponent(generatePassMessage(pass));
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  };

  const handleCopyPassDetails = (pass: VisitorPass) => {
    const text = generatePassMessage(pass);
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = v.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) || v.passCode.toLowerCase().includes(searchQuery.toLowerCase()) || v.unitNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "All" || v.status === filterStatus;
    
    // If resident, filter for their unit unless security guard
    if (currentUser.role === "resident" && v.unitNumber !== currentUser.unitNumber) {
      return false;
    }
    return matchesSearch && matchesFilter;
  });

  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName) return;

    const newPass = createVisitorPass({
      visitorName,
      visitorPhone: visitorPhone || "+1 (555) 000-1111",
      visitorType,
      unitNumber: currentUser.unitNumber,
      expectedDate,
      expectedTime,
      vehicleNo,
      notes
    });

    setCreatedPass(newPass);
  };

  const handleVerifyCodeAtGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode) return;

    const res = checkInVisitor(verifyCode.trim().toUpperCase());
    setScanResult(res);
    setVerifyCode("");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DoorOpen className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">Digital Gate & Visitor Management System</h1>
          </div>
          <p className="text-xs text-slate-600">
            Generate pre-approved digital gate passes with QR code & PIN. Verify visitors instantly at security terminal.
          </p>
        </div>

        {/* Create Pass Button */}
        <button
          id="btn-create-visitor-pass"
          onClick={() => { setCreatedPass(null); setShowPassModal(true); }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Pre-Approve Visitor Pass</span>
        </button>
      </div>

      {/* Gate Security Fast Terminal */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-base text-slate-900">Gate 1 Security Verification Terminal</h2>
          </div>
          <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono font-bold">
            Active Guard: {currentUser.role === "security" ? currentUser.name : "Officer Rajan"}
          </span>
        </div>

        <form onSubmit={handleVerifyCodeAtGate} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Pass PIN Code (e.g. DEL-4021 or GST-8812)..."
            value={verifyCode}
            onChange={e => setVerifyCode(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 uppercase tracking-widest font-bold"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Verify & Check-In</span>
          </button>
        </form>

        {scanResult && (
          <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
            scanResult.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}>
            <span className="flex items-center gap-2">
              {scanResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{scanResult.message}</span>
            </span>
            <button onClick={() => setScanResult(null)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search visitor name or pass code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs overflow-x-auto scrollbar-none">
          {["All", "Pre-Approved", "Checked-In", "Checked-Out", "Denied"].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-full font-semibold transition whitespace-nowrap ${
                filterStatus === st ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Visitor Log Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVisitors.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-white border border-slate-200/80 rounded-2xl">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No visitor passes matching filter "{filterStatus}".</p>
          </div>
        ) : (
          filteredVisitors.map(vis => (
            <div
              key={vis.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 transition hover:shadow-md ${
                vis.status === "Checked-In" ? "border-emerald-300 bg-emerald-50/20" :
                vis.status === "Denied" ? "border-rose-300 bg-rose-50/20" :
                "border-slate-200/80"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    vis.status === "Checked-In" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    vis.status === "Pre-Approved" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                    vis.status === "Denied" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                    "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}>
                    {vis.status}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1.5">{vis.visitorName}</h3>
                  <p className="text-xs text-slate-600 font-medium">{vis.visitorType} • Host Flat {vis.unitNumber}</p>
                </div>

                <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                  {vis.passCode}
                </span>
              </div>

              {/* Log details */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-xs space-y-1 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Phone:</span>
                  <span className="text-slate-900 font-sans font-medium">{vis.visitorPhone}</span>
                </div>
                {vis.vehicleNo && (
                  <div className="flex justify-between text-slate-600">
                    <span>Vehicle Reg:</span>
                    <span className="text-slate-900 font-sans font-medium">{vis.vehicleNo}</span>
                  </div>
                )}
                {vis.checkInTime && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Check-In:</span>
                    <span>{vis.checkInTime}</span>
                  </div>
                )}
                {vis.checkOutTime && (
                  <div className="flex justify-between text-slate-500">
                    <span>Check-Out:</span>
                    <span>{vis.checkOutTime}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  id={`btn-share-pass-${vis.id}`}
                  onClick={() => setSelectedSharePass(vis)}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share QR</span>
                </button>

                {vis.status === "Pre-Approved" && (
                  <button
                    onClick={() => checkInVisitor(vis.passCode)}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Check In</span>
                  </button>
                )}

                {vis.status === "Checked-In" && (
                  <button
                    onClick={() => checkOutVisitor(vis.id)}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Check Out
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pre-Approve Visitor Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl text-slate-900 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">Generate Gate Entry Pass</h3>
              </div>
              <button onClick={() => setShowPassModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdPass ? (
              /* Generated Pass Preview with Direct Sharing Options */
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-4">
                <div className="w-36 h-36 bg-white p-2.5 rounded-2xl mx-auto border border-slate-200 shadow-md relative group">
                  <QrCode className="w-32 h-32 text-slate-900 mx-auto" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Pass Code PIN for Security Guard</p>
                  <p className="text-2xl font-black text-emerald-700 font-mono tracking-widest mt-1">{createdPass.passCode}</p>
                </div>
                <div className="text-xs text-slate-700 space-y-1 bg-white p-3 rounded-xl border border-slate-200/80 text-left">
                  <p><strong>Visitor:</strong> {createdPass.visitorName} ({createdPass.visitorType})</p>
                  <p><strong>Flat Host:</strong> {createdPass.hostResidentName} ({createdPass.unitNumber})</p>
                  <p><strong>Scheduled:</strong> {createdPass.expectedDate} at {createdPass.expectedTime}</p>
                </div>

                {/* Instant Sharing Buttons */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="btn-share-whatsapp-new"
                      onClick={() => handleShareWhatsApp(createdPass)}
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      id="btn-share-email-new"
                      onClick={() => handleShareEmail(createdPass)}
                      className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Email</span>
                    </button>
                  </div>

                  <button
                    id="btn-share-copy-new"
                    onClick={() => handleCopyPassDetails(createdPass)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    {copiedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
                    <span>{copiedSuccess ? "Copied to Clipboard!" : "Copy Pass Summary"}</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowPassModal(false)}
                  className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition mt-2"
                >
                  Close
                </button>
              </div>
            ) : (
              /* New Pass Form */
              <form onSubmit={handleCreatePass} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Visitor Category</label>
                  <select
                    value={visitorType}
                    onChange={e => setVisitorType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-medium"
                  >
                    <option value="Guest">Guest / Friend / Family</option>
                    <option value="Delivery">Delivery (Amazon, Food, Courier)</option>
                    <option value="Cab">Uber / Lyft Cab</option>
                    <option value="Daily Help">Daily Maid / Cook / Driver</option>
                    <option value="Contractor">Plumber / Electrician / Technician</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Visitor Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. David Miller"
                    value={visitorName}
                    onChange={e => setVisitorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Expected Date</label>
                    <input
                      type="date"
                      value={expectedDate}
                      onChange={e => setExpectedDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Vehicle Reg (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. NY-7712"
                      value={vehicleNo}
                      onChange={e => setVehicleNo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition mt-2"
                >
                  Generate Digital Gate Pass
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* SHARE TEMPORARY QR VISITOR PASS MODAL */}
      {selectedSharePass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 space-y-4 text-slate-900 shadow-xl relative text-center">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-base">
                <QrCode className="w-5 h-5" />
                <h3>Digital Gate Pass QR</h3>
              </div>
              <button onClick={() => setSelectedSharePass(null)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visual QR Code Display */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 shadow-inner max-w-[200px] mx-auto space-y-2">
              <QrCode className="w-40 h-40 text-slate-900 mx-auto" />
              <div className="border-t border-slate-200 pt-1 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">CivicHQ Gate 1 Pass</p>
                <p className="text-sm font-black text-slate-900 font-mono tracking-wider">{selectedSharePass.passCode}</p>
              </div>
            </div>

            {/* Visitor Details Summary */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-left space-y-1 text-slate-700 font-mono">
              <p><strong className="text-slate-900 font-sans">Visitor:</strong> {selectedSharePass.visitorName} ({selectedSharePass.visitorType})</p>
              <p><strong className="text-slate-900 font-sans">Host Flat:</strong> Unit {selectedSharePass.unitNumber}</p>
              <p><strong className="text-slate-900 font-sans">Scheduled:</strong> {selectedSharePass.expectedDate} at {selectedSharePass.expectedTime}</p>
              {selectedSharePass.vehicleNo && <p><strong className="text-slate-900 font-sans">Vehicle:</strong> {selectedSharePass.vehicleNo}</p>}
            </div>

            {/* Direct Social & Direct Sharing Options */}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] text-slate-500 text-center font-medium">Share pass directly with visitor:</p>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="btn-share-whatsapp"
                  onClick={() => handleShareWhatsApp(selectedSharePass)}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                <button
                  id="btn-share-email"
                  onClick={() => handleShareEmail(selectedSharePass)}
                  className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </button>
              </div>

              <button
                id="btn-share-copy"
                onClick={() => handleCopyPassDetails(selectedSharePass)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                {copiedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
                <span>{copiedSuccess ? "Copied to Clipboard!" : "Copy Pass Summary"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
