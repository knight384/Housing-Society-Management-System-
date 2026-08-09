import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import {
  AlertTriangle,
  Search,
  PhoneCall,
  Car,
  ShoppingBag,
  Calendar,
  Plus,
  Users,
  ShieldAlert,
  Send,
  MapPin,
  Tag,
  CheckCircle2,
  X,
  HelpCircle,
  Share2,
  Building,
  Siren,
  Clock,
  HeartHandshake
} from "lucide-react";

interface ClassifiedItem {
  id: string;
  title: string;
  category: "For Sale" | "For Rent" | "Tool Share / Borrow" | "Services";
  price: string;
  sellerName: string;
  unitNumber: string;
  description: string;
  date: string;
  contactPhone: string;
  status: "Active" | "Sold" | "Reserved";
}

interface SocietyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  category: "Festival" | "Social" | "Meeting" | "Sports";
  attendingCount: number;
  rsvpedBy: string[];
}

export const CommunityHub: React.FC = () => {
  const { currentUser, profiles, triggerPushNotification, logAuditAction } = useSociety();

  const [activeTab, setActiveTab] = useState<"directory" | "vehicles" | "marketplace" | "events">("directory");

  // SOS Emergency Modal State
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosCategory, setSosCategory] = useState<"Medical Emergency" | "Fire Alarm" | "Lift Trapped" | "Security Intruder">("Medical Emergency");
  const [sosNotes, setSosNotes] = useState("");
  const [sosSentSuccess, setSosSentSuccess] = useState(false);

  // Search States
  const [searchDirectory, setSearchDirectory] = useState("");
  const [searchVehicle, setSearchVehicle] = useState("");

  // Vehicle Ping Modal
  const [pingedVehicle, setPingedVehicle] = useState<{ ownerName: string; unitNumber: string; regNo: string } | null>(null);

  // Marketplace State
  const [classifieds, setClassifieds] = useState<ClassifiedItem[]>([
    {
      id: "cl-1",
      title: "Bosch Professional Power Drill & Tool Kit",
      category: "Tool Share / Borrow",
      price: "Free to Borrow",
      sellerName: "Alex Rivera",
      unitNumber: "A-402",
      description: "Includes hammer drill, drill bits, and measuring tape. Available for neighbors anytime.",
      date: "2026-08-05",
      contactPhone: "+1 (555) 234-5678",
      status: "Active"
    },
    {
      id: "cl-2",
      title: "Trek Mountain Bike (Age 8-12 Yrs)",
      category: "For Sale",
      price: "$85",
      sellerName: "Sarah Jenkins",
      unitNumber: "B-101",
      description: "Gently used kids bike in mint condition. 7-speed Shimano gear shift.",
      date: "2026-08-06",
      contactPhone: "+1 (555) 345-6789",
      status: "Active"
    },
    {
      id: "cl-3",
      title: "Covered Basement Parking Slot B1-14",
      category: "For Rent",
      price: "$50/month",
      sellerName: "David Miller",
      unitNumber: "C-202",
      description: "Extra parking bay near Tower B elevator lobby. Long-term lease preferred.",
      date: "2026-08-07",
      contactPhone: "+1 (555) 456-7890",
      status: "Active"
    }
  ]);

  const [showClassifiedModal, setShowClassifiedModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ClassifiedItem["category"]>("For Sale");
  const [newPrice, setNewPrice] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Events State
  const [events, setEvents] = useState<SocietyEvent[]>([
    {
      id: "ev-1",
      title: "Annual Grand Vista Cultural Fest & BBQ Night",
      date: "2026-08-20",
      time: "06:30 PM",
      location: "Clubhouse Lawn & Poolside",
      description: "Live musical performance, catering, children games, and community awards ceremony.",
      organizer: "RWA Executive Board",
      category: "Festival",
      attendingCount: 42,
      rsvpedBy: ["A-402", "B-101"]
    },
    {
      id: "ev-2",
      title: "Quarterly RWA Open Townhall & Budget Review",
      date: "2026-08-28",
      time: "10:00 AM",
      location: "Main Community Hall",
      description: "Discussion on solar panel installation, elevator modernization, and financial audit Q&A.",
      organizer: "Management Committee",
      category: "Meeting",
      attendingCount: 28,
      rsvpedBy: ["B-101"]
    }
  ]);

  // Handle Emergency Broadcast Dispatch
  const handleTriggerSos = (e: React.FormEvent) => {
    e.preventDefault();
    triggerPushNotification(
      `🚨 EMERGENCY SOS: ${sosCategory.toUpperCase()} ALERT`,
      `CRITICAL ALERT from Flat ${currentUser.unitNumber} (${currentUser.name}): ${sosNotes || sosCategory}. Gate Security & RWA dispatches immediately!`,
      "Urgent"
    );
    logAuditAction("Security", `Triggered SOS Panic Broadcast: ${sosCategory} for Flat ${currentUser.unitNumber}`);
    setSosSentSuccess(true);
  };

  // Handle Vehicle Ping
  const handlePingOwner = (ownerName: string, unitNumber: string, regNo: string) => {
    triggerPushNotification(
      `🚗 Vehicle Courtesy Alert (${regNo})`,
      `Courteous request regarding vehicle ${regNo} parked in Flat ${unitNumber}'s allocated area. Please check if lights are on or vehicle needs moving.`,
      "Notice"
    );
    setPingedVehicle({ ownerName, unitNumber, regNo });
    setTimeout(() => setPingedVehicle(null), 3000);
  };

  // Handle Classified Creation
  const handleCreateClassified = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const newItem: ClassifiedItem = {
      id: "cl-" + Date.now(),
      title: newTitle,
      category: newCategory,
      price: newPrice,
      sellerName: currentUser.name,
      unitNumber: currentUser.unitNumber,
      description: newDesc,
      date: new Date().toISOString().split("T")[0],
      contactPhone: currentUser.phone,
      status: "Active"
    };

    setClassifieds(prev => [newItem, ...prev]);
    setShowClassifiedModal(false);
    setNewTitle("");
    setNewPrice("");
    setNewDesc("");

    triggerPushNotification(
      `🛍️ New Society Listing: ${newTitle}`,
      `${currentUser.name} (${currentUser.unitNumber}) posted a new item under ${newCategory}.`,
      "Notice"
    );
  };

  // Handle Event RSVP
  const handleToggleRsvp = (eventId: string) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const hasRsvped = ev.rsvpedBy.includes(currentUser.unitNumber);
        return {
          ...ev,
          attendingCount: hasRsvped ? ev.attendingCount - 1 : ev.attendingCount + 1,
          rsvpedBy: hasRsvped ? ev.rsvpedBy.filter(u => u !== currentUser.unitNumber) : [...ev.rsvpedBy, currentUser.unitNumber]
        };
      }
      return ev;
    }));
  };

  // All vehicles flattened from user profiles
  const allVehicles = profiles.flatMap(p => 
    p.vehicles.map(v => ({
      ...v,
      ownerName: p.name,
      unitNumber: p.unitNumber,
      tower: p.tower,
      phone: p.phone
    }))
  );

  const filteredDirectory = profiles.filter(p =>
    p.name.toLowerCase().includes(searchDirectory.toLowerCase()) ||
    p.unitNumber.toLowerCase().includes(searchDirectory.toLowerCase()) ||
    p.tower.toLowerCase().includes(searchDirectory.toLowerCase())
  );

  const filteredVehicles = allVehicles.filter(v =>
    v.regNo.toLowerCase().includes(searchVehicle.toLowerCase()) ||
    v.slotNo.toLowerCase().includes(searchVehicle.toLowerCase()) ||
    v.unitNumber.toLowerCase().includes(searchVehicle.toLowerCase()) ||
    v.ownerName.toLowerCase().includes(searchVehicle.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Community Hub & Directory</h1>
          </div>
          <p className="text-xs text-slate-600">
            Resident lookup, vehicle finder, SOS panic broadcast, peer marketplace, and community events calendar.
          </p>
        </div>

        {/* SOS Emergency Trigger Button */}
        <button
          id="btn-trigger-sos-banner"
          onClick={() => { setSosSentSuccess(false); setShowSosModal(true); }}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition shrink-0 animate-pulse"
        >
          <Siren className="w-4 h-4 text-white" />
          <span>Emergency Panic SOS</span>
        </button>
      </div>

      {/* Speed Dial Emergency Hotlines */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Gate 1 Security Desk", number: "Ext. 101 / +1 (555) 999-0000", icon: ShieldAlert, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
          { label: "RWA Estate Manager", number: "+1 (555) 345-6789", icon: Building, color: "text-blue-600 bg-blue-50 border-blue-200" },
          { label: "Emergency Ambulance", number: "911 / City Central Hospital", icon: HeartHandshake, color: "text-rose-600 bg-rose-50 border-rose-200" },
          { label: "Lift & Electrical AMC", number: "+1 (555) 444-2211", icon: PhoneCall, color: "text-amber-600 bg-amber-50 border-amber-200" }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={`p-3.5 rounded-xl border flex items-center gap-3 ${item.color}`}>
              <div className="p-2 rounded-lg bg-white shadow-xs shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold truncate text-slate-900">{item.label}</p>
                <p className="text-[10px] font-mono font-medium text-slate-600 truncate">{item.number}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("directory")}
          className={`flex-1 py-2 px-3 rounded-lg transition whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "directory" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building className="w-3.5 h-3.5 text-blue-600" />
          <span>Resident Directory ({profiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("vehicles")}
          className={`flex-1 py-2 px-3 rounded-lg transition whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "vehicles" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Car className="w-3.5 h-3.5 text-indigo-600" />
          <span>Vehicle Finder ({allVehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("marketplace")}
          className={`flex-1 py-2 px-3 rounded-lg transition whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "marketplace" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
          <span>Marketplace ({classifieds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("events")}
          className={`flex-1 py-2 px-3 rounded-lg transition whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "events" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>Society Events ({events.length})</span>
        </button>
      </div>

      {/* TAB 1: RESIDENT DIRECTORY */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-xs flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search resident name, flat number (e.g. A-402), tower..."
              value={searchDirectory}
              onChange={e => setSearchDirectory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDirectory.map(res => (
              <div key={res.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {res.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{res.name}</h3>
                      <p className="text-xs text-slate-500 font-mono">Flat {res.unitNumber} • {res.tower}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {res.ownerType}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs space-y-1 font-mono text-slate-600">
                  <p><strong>Apt Type:</strong> {res.flatType}</p>
                  <p><strong>Emergency:</strong> {res.emergencyContact}</p>
                  <p><strong>Vehicles Registered:</strong> {res.vehicles.length}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VEHICLE FINDER */}
      {activeTab === "vehicles" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search vehicle reg no (e.g. GV-402-A), parking slot (e.g. B1-42), owner..."
                value={searchVehicle}
                onChange={e => setSearchVehicle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono font-medium"
              />
            </div>
            <span className="text-xs text-slate-500 shrink-0 font-medium">
              Registered Basement Bays: <strong className="text-slate-900 font-mono">{allVehicles.length} Slots</strong>
            </span>
          </div>

          {pingedVehicle && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center justify-between animate-fade-in">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Courtesy Alert Sent to {pingedVehicle.ownerName} (Flat {pingedVehicle.unitNumber}) for Vehicle {pingedVehicle.regNo}!</span>
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((veh, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-indigo-600" />
                    <span className="font-mono font-bold text-base text-slate-900">{veh.regNo}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-mono font-bold">
                    Slot {veh.slotNo}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs space-y-1 font-mono text-slate-600">
                  <p><strong>Owner:</strong> <span className="font-sans text-slate-900 font-bold">{veh.ownerName}</span></p>
                  <p><strong>Residence:</strong> Flat {veh.unitNumber} ({veh.tower})</p>
                  <p><strong>Vehicle Type:</strong> {veh.type}</p>
                </div>

                <button
                  onClick={() => handlePingOwner(veh.ownerName, veh.unitNumber, veh.regNo)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  <span>Send Courtesy Parking Ping</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MARKETPLACE / CLASSIFIEDS */}
      {activeTab === "marketplace" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Society Community Marketplace</h2>
              <p className="text-xs text-slate-500">Buy, sell, rent, or borrow items safely within Grand Vista Heights.</p>
            </div>
            <button
              onClick={() => setShowClassifiedModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Post Listing</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classifieds.map(item => (
              <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.category === "Tool Share / Borrow" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                      item.category === "For Rent" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                      "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {item.category}
                    </span>
                    <span className="font-mono font-bold text-sm text-emerald-700">{item.price}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Seller: <strong className="text-slate-900">{item.sellerName} ({item.unitNumber})</strong></span>
                  <a
                    href={`tel:${item.contactPhone}`}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center gap-1 text-[11px]"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                    <span>Contact</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EVENTS CALENDAR */}
      {activeTab === "events" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {events.map(ev => {
              const isAttending = ev.rsvpedBy.includes(currentUser.unitNumber);
              return (
                <div key={ev.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                        {ev.category} Event
                      </span>
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {ev.attendingCount} Confirmed Attendees
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900">{ev.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-xs space-y-1 font-mono text-slate-700">
                      <p><strong>Date & Time:</strong> {ev.date} at {ev.time}</p>
                      <p><strong>Venue:</strong> {ev.location}</p>
                      <p><strong>Organizer:</strong> {ev.organizer}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleRsvp(ev.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      isAttending
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold"
                        : "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isAttending ? "text-emerald-600" : "text-blue-400"}`} />
                    <span>{isAttending ? "Attending Event (RSVP Confirmed)" : "RSVP to Attend"}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EMERGENCY SOS PANIC MODAL */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-rose-200 rounded-2xl w-full max-w-md p-6 space-y-4 text-slate-900 shadow-xl relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                <Siren className="w-5 h-5 text-rose-600 animate-pulse" />
                <h3>Dispatch Emergency Panic Alert</h3>
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
                  Officer Rajan (Gate 1 Security) and RWA Emergency Staff have been notified for Flat {currentUser.unitNumber}.
                </p>
                <button
                  onClick={() => setShowSosModal(false)}
                  className="w-full py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  Close Confirmation
                </button>
              </div>
            ) : (
              <form onSubmit={handleTriggerSos} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Select Alert Category</label>
                  <select
                    value={sosCategory}
                    onChange={e => setSosCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-bold"
                  >
                    <option value="Medical Emergency">Medical Emergency (Ambulance Needed)</option>
                    <option value="Fire Alarm">Fire / Smoke Alarm in Flat</option>
                    <option value="Lift Trapped">Trapped Inside Tower Elevator</option>
                    <option value="Security Intruder">Security Intruder / Suspicious Gate Person</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Emergency Details (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Tower A elevator stopped between 4th & 5th floor..."
                    value={sosNotes}
                    onChange={e => setSosNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-[11px] text-rose-800 font-semibold space-y-1">
                  <p>• Instantly notifies Gate 1 Security Desk & Estate Management.</p>
                  <p>• Flat {currentUser.unitNumber} details will be broadcasted to guards.</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Siren className="w-4 h-4" />
                  <span>DISPATCH EMERGENCY ALERT NOW</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CREATE CLASSIFIED LISTING MODAL */}
      {showClassifiedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 text-slate-900 shadow-xl relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-base">
                <ShoppingBag className="w-5 h-5" />
                <h3>Post Marketplace Listing</h3>
              </div>
              <button onClick={() => setShowClassifiedModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClassified} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                >
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Tool Share / Borrow">Tool Share / Borrow</option>
                  <option value="Services">Local Services</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Lawn Mower / Mountain Bike"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Price / Term</label>
                <input
                  type="text"
                  placeholder="e.g. $50 or Free to Borrow"
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details, condition, availability..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Publish Society Listing
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
