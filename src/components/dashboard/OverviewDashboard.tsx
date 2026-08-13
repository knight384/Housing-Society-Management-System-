import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import {
  DollarSign,
  Users,
  Wrench,
  Calendar,
  Megaphone,
  CreditCard,
  QrCode,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Clock,
  Plus,
  Siren,
  X,
  PhoneCall,
  AlertTriangle,
  FolderLock,
  User,
  Zap
} from "lucide-react";

interface OverviewDashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenPaymentModal: (billId: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ setActiveTab, onOpenPaymentModal }) => {
  const {
    currentUser,
    bills,
    visitors,
    tickets,
    bookings,
    notices,
    triggerPushNotification,
    logAuditAction
  } = useSociety();

  // SOS Emergency Modal State
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosCategory, setSosCategory] = useState<"Medical Emergency" | "Fire Alarm" | "Lift Trapped" | "Security Intruder">("Medical Emergency");
  const [sosNotes, setSosNotes] = useState("");
  const [sosSentSuccess, setSosSentSuccess] = useState(false);

  // Handle Dispatch Emergency SOS
  const handleTriggerSos = (e: React.FormEvent) => {
    e.preventDefault();
    triggerPushNotification(
      `🚨 EMERGENCY SOS: ${sosCategory.toUpperCase()} ALERT`,
      `CRITICAL URGENT ALERT from Flat ${currentUser.unitNumber} (${currentUser.name}): ${sosNotes || sosCategory}. Gate Security Desk & Emergency Staff dispatched!`,
      "Urgent"
    );
    logAuditAction("Security", `Triggered Urgent SOS Emergency Panic: ${sosCategory} for Flat ${currentUser.unitNumber}`);
    setSosSentSuccess(true);
  };

  // Calculations
  const userBills = bills.filter(b => b.unitNumber === currentUser.unitNumber);
  const pendingBill = userBills.find(b => b.status !== "Paid");

  const todayVisitors = visitors.filter(v => v.unitNumber === currentUser.unitNumber || currentUser.role === "security");
  const activeVisitors = visitors.filter(v => v.status === "Checked-In");

  const myTickets = tickets.filter(t => t.unitNumber === currentUser.unitNumber || currentUser.role === "admin");
  const openTickets = myTickets.filter(t => t.status !== "Resolved");

  const myBookings = bookings.filter(b => b.unitNumber === currentUser.unitNumber && b.status === "Confirmed");
  const pinnedNotices = notices.filter(n => n.isPinned);

  return (
    <div className="space-y-6">
      
      {/* Welcome Hero Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                {currentUser.role} Portal
              </span>
              <span className="text-xs text-slate-500 font-medium">• {currentUser.unitNumber} ({currentUser.tower})</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
              CivicHQ RWA Community Dashboard. Track maintenance dues, generate gate passes, reserve amenities, and raise helpdesk complaints seamlessly.
            </p>
          </div>

          {/* Quick Call to Action */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Emergency SOS Button */}
            <button
              id="dash-btn-sos-panic"
              onClick={() => { setSosSentSuccess(false); setShowSosModal(true); }}
              className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs transition animate-pulse uppercase tracking-wider"
            >
              <Siren className="w-4 h-4 text-white" />
              <span>Emergency SOS</span>
            </button>

            {pendingBill ? (
              <button
                id="dash-btn-pay-dues"
                onClick={() => onOpenPaymentModal(pendingBill.id)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Dues (${pendingBill.totalAmount})</span>
              </button>
            ) : (
              <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All Dues Clear</span>
              </div>
            )}

            <button
              id="dash-btn-community-hub"
              onClick={() => setActiveTab("community")}
              className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Community Hub</span>
            </button>

            <button
              id="dash-btn-document-locker"
              onClick={() => setActiveTab("documents")}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <FolderLock className="w-4 h-4 text-slate-700" />
              <span>Document Locker</span>
            </button>

            <button
              id="dash-btn-my-profile"
              onClick={() => setActiveTab("profile")}
              className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <User className="w-4 h-4 text-indigo-600" />
              <span>My Profile</span>
            </button>

            <button
              id="dash-btn-smart-utilities"
              onClick={() => setActiveTab("utilities")}
              className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Smart Utilities</span>
            </button>

            <button
              id="dash-btn-verified-services"
              onClick={() => setActiveTab("directory")}
              className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>Verified Services</span>
            </button>

            <button
              id="dash-btn-society-calendar"
              onClick={() => setActiveTab("calendar")}
              className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Society Calendar</span>
            </button>

            <button
              id="dash-btn-quick-pass"
              onClick={() => setActiveTab("visitors")}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition"
            >
              <QrCode className="w-4 h-4" />
              <span>Gate Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Maintenance Status */}
        <div
          onClick={() => setActiveTab("dues")}
          className="bg-white border border-slate-200/80 hover:border-slate-300 p-5 rounded-2xl shadow-xs transition cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Maintenance Dues</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-xl font-bold text-slate-900">
              {pendingBill ? `$${pendingBill.totalAmount}` : "$0.00"}
            </p>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              pendingBill ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}>
              {pendingBill ? pendingBill.status : "Paid"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3 flex items-center gap-1 group-hover:text-blue-600 transition">
            <span>View billing history</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Stat 2: Active Visitors */}
        <div
          onClick={() => setActiveTab("visitors")}
          className="bg-white border border-slate-200/80 hover:border-slate-300 p-5 rounded-2xl shadow-xs transition cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Gate Visitors</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-xl font-bold text-slate-900">{activeVisitors.length}</p>
            <span className="text-[11px] font-medium text-slate-500">Inside Society</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3 flex items-center gap-1 group-hover:text-blue-600 transition">
            <span>Manage gate passes ({todayVisitors.length})</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Stat 3: Open Tickets */}
        <div
          onClick={() => setActiveTab("tickets")}
          className="bg-white border border-slate-200/80 hover:border-slate-300 p-5 rounded-2xl shadow-xs transition cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Helpdesk Tickets</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-xl font-bold text-slate-900">{openTickets.length}</p>
            <span className="text-[11px] font-medium text-slate-500">In Progress</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3 flex items-center gap-1 group-hover:text-blue-600 transition">
            <span>Track maintenance status</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Stat 4: Amenity Bookings */}
        <div
          onClick={() => setActiveTab("amenities")}
          className="bg-white border border-slate-200/80 hover:border-slate-300 p-5 rounded-2xl shadow-xs transition cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">My Amenity Passes</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-xl font-bold text-slate-900">{myBookings.length}</p>
            <span className="text-[11px] font-medium text-slate-500">Upcoming Slots</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3 flex items-center gap-1 group-hover:text-blue-600 transition">
            <span>Reserve clubhouse or tennis</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

      </div>

      {/* Main Grid: Notices & Quick Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Pinned Notices & Announcements */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-base text-slate-900">Digital Notice Board</h2>
            </div>
            <button
              onClick={() => setActiveTab("notices")}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All ({notices.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {pinnedNotices.map(notice => (
              <div
                key={notice.id}
                className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-2 relative overflow-hidden hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      notice.category === "Emergency" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                      notice.category === "Maintenance" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {notice.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{notice.date}</span>
                  </div>
                  <span className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 font-semibold px-2.5 py-0.5 rounded-full">Pinned Notice</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{notice.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{notice.content}</p>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Issued by: <strong className="text-slate-800">{notice.author}</strong></span>
                  <span>{notice.likesCount} Residents Liked</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 col): Quick Activity Feeds */}
        <div className="space-y-4">
          
          {/* Quick Helpdesk Ticket Tracker */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Active Helpdesk Requests</h3>
              <button onClick={() => setActiveTab("tickets")} className="text-[11px] text-blue-600 font-semibold hover:underline">
                New Ticket
              </button>
            </div>

            {myTickets.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">No active maintenance tickets.</p>
            ) : (
              myTickets.slice(0, 3).map(ticket => (
                <div key={ticket.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 truncate max-w-[150px]">{ticket.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      ticket.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      ticket.status === "In Progress" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">{ticket.category} • Ticket #{ticket.ticketNo}</p>
                </div>
              ))
            )}
          </div>

          {/* Quick Gate Visitors Tracker */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Today's Gate Visitors</h3>
              <button onClick={() => setActiveTab("visitors")} className="text-[11px] text-blue-600 font-semibold hover:underline">
                View Log
              </button>
            </div>

            {todayVisitors.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">No visitor passes generated today.</p>
            ) : (
              todayVisitors.slice(0, 3).map(vis => (
                <div key={vis.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{vis.visitorName}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{vis.visitorType} • Pass {vis.passCode}</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    vis.status === "Checked-In" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    vis.status === "Pre-Approved" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                    "bg-slate-200 text-slate-700 border border-slate-300"
                  }`}>
                    {vis.status}
                  </span>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* EMERGENCY SOS PANIC MODAL */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-rose-200 rounded-2xl w-full max-w-md p-6 space-y-4 text-slate-900 shadow-xl relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                <Siren className="w-5 h-5 text-rose-600 animate-pulse" />
                <h3>Dispatch Emergency Panic SOS</h3>
              </div>
              <button onClick={() => setShowSosModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {sosSentSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-base">Emergency SOS Dispatched!</h4>
                <p className="text-xs text-emerald-700">
                  Officer Rajan (Gate 1 Security Desk) & RWA Staff have been alerted with location parameters for Flat {currentUser.unitNumber} ({currentUser.tower}).
                </p>
                <div className="p-3 bg-white rounded-lg border border-emerald-200 text-left text-[11px] font-mono text-emerald-900 space-y-1">
                  <p>• Gate Security Hotline: Ext. 101 / +1 (555) 999-0000</p>
                  <p>• Estate Manager: +1 (555) 345-6789</p>
                  <p>• Emergency Services: 911</p>
                </div>
                <button
                  onClick={() => setShowSosModal(false)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Close Confirmation
                </button>
              </div>
            ) : (
              <form onSubmit={handleTriggerSos} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Emergency Category</label>
                  <select
                    value={sosCategory}
                    onChange={e => setSosCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-bold"
                  >
                    <option value="Medical Emergency">Medical Emergency (Ambulance Needed)</option>
                    <option value="Fire Alarm">Fire / Smoke Alarm in Flat</option>
                    <option value="Lift Trapped">Trapped Inside Tower Elevator</option>
                    <option value="Security Intruder">Security Intruder / Gate Alert</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Emergency Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Need immediate medical attention in Flat A-402..."
                    value={sosNotes}
                    onChange={e => setSosNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-[11px] text-rose-800 font-semibold space-y-1">
                  <p>• Instantly broadcasts priority alert to Gate 1 Desk & RWA management.</p>
                  <p>• Transmits Flat {currentUser.unitNumber} ({currentUser.tower}) contact details.</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Siren className="w-4 h-4" />
                  <span>DISPATCH SOS PANIC BROADCAST</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
