import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import { LostFoundItem } from "../../types";
import { EventGallery } from "./EventGallery";
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
  HeartHandshake,
  PackageSearch,
  Camera,
  FileQuestion,
  Image as ImageIcon,
  Eye,
  Check,
  RotateCcw,
  Upload,
  Filter,
  CheckCircle,
  BellRing
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

  const [activeTab, setActiveTab] = useState<"directory" | "vehicles" | "marketplace" | "events" | "lost-found" | "gallery">("directory");

  // SOS Emergency Modal State
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosCategory, setSosCategory] = useState<"Medical Emergency" | "Fire Alarm" | "Lift Trapped" | "Security Intruder">("Medical Emergency");
  const [sosNotes, setSosNotes] = useState("");
  const [sosSentSuccess, setSosSentSuccess] = useState(false);

  // Search States
  const [searchDirectory, setSearchDirectory] = useState("");
  const [searchVehicle, setSearchVehicle] = useState("");

  // Lost & Found State
  const [lostFoundList, setLostFoundList] = useState<LostFoundItem[]>([
    {
      id: "lf-1",
      title: "AirPods Pro Charging Case in Blue Silicone Sleeve",
      type: "Lost",
      category: "Electronics & Gadgets",
      description: "Lost my wireless charging case somewhere near the Tower A elevator lobby or walkway to clubhouse. Has a small metallic carabiner attached.",
      location: "Tower A Elevator Lobby / Walkway",
      date: "2026-08-11",
      photoUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=60",
      postedBy: "Alex Rivera",
      unitNumber: "A-402",
      contactPhone: "+1 (555) 234-5678",
      status: "Open",
      storageLocationNote: "Please contact Alex or drop at Gate 1 Desk if found."
    },
    {
      id: "lf-2",
      title: "Found: Silver Seiko Men's Wristwatch",
      type: "Found",
      category: "Electronics & Gadgets",
      description: "Found a silver metallic wristwatch lying on a sun lounger chair near the adult swimming pool deck. Handed over to Gate 1 Desk for safekeeping.",
      location: "Clubhouse Swimming Pool Deck",
      date: "2026-08-12",
      photoUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60",
      postedBy: "Sarah Jenkins",
      unitNumber: "B-101",
      contactPhone: "+1 (555) 345-6789",
      status: "Open",
      storageLocationNote: "Stored securely in Gate 1 Main Security Safe."
    },
    {
      id: "lf-3",
      title: "Found: Golden Retriever Puppy (Red Collar)",
      type: "Found",
      category: "Pets",
      description: "Friendly puppy with red leather collar (no phone tag) wandered into Tower C Basement B2 parking bay. Currently with Gate 1 Security Guard house.",
      location: "Tower C Basement B2 Parking",
      date: "2026-08-12",
      photoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=60",
      postedBy: "Security Guard Desk",
      unitNumber: "Gate 1 Guard",
      contactPhone: "+1 (555) 999-0000",
      status: "Open",
      storageLocationNote: "Kept safely in Gate 1 Guard House with water bowl."
    },
    {
      id: "lf-4",
      title: "Lost: Toddler Wooden Toy Car & Blue Sun Hat",
      type: "Lost",
      category: "Toys & Kids",
      description: "Left behind on the bench near sandbox around 5 PM yesterday. Sentimental value to my 3-year-old.",
      location: "Central Park Sandbox Bench",
      date: "2026-08-10",
      photoUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=60",
      postedBy: "David Miller",
      unitNumber: "C-202",
      contactPhone: "+1 (555) 456-7890",
      status: "Returned",
      storageLocationNote: "Returned safely to David on Aug 11!"
    }
  ]);

  const [showLostFoundModal, setShowLostFoundModal] = useState(false);
  const [lfType, setLfType] = useState<"Lost" | "Found">("Lost");
  const [lfTitle, setLfTitle] = useState("");
  const [lfCategory, setLfCategory] = useState<LostFoundItem["category"]>("Keys & Cards");
  const [lfLocation, setLfLocation] = useState("");
  const [lfDate, setLfDate] = useState(new Date().toISOString().split("T")[0]);
  const [lfDescription, setLfDescription] = useState("");
  const [lfPhotoUrl, setLfPhotoUrl] = useState("");
  const [lfStorageNote, setLfStorageNote] = useState("");

  // Search & Filters for Lost & Found
  const [searchLostFound, setSearchLostFound] = useState("");
  const [lfTypeFilter, setLfTypeFilter] = useState<"All" | "Lost" | "Found" | "Open" | "Claimed">("All");
  const [lfCategoryFilter, setLfCategoryFilter] = useState<string>("All");

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

  // Handle Lost & Found Creation
  const handleCreateLostFound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lfTitle || !lfLocation) return;

    const newItem: LostFoundItem = {
      id: "lf-" + Date.now(),
      title: lfTitle,
      type: lfType,
      category: lfCategory,
      description: lfDescription,
      location: lfLocation,
      date: lfDate || new Date().toISOString().split("T")[0],
      photoUrl: lfPhotoUrl || undefined,
      postedBy: currentUser.name,
      unitNumber: currentUser.unitNumber,
      contactPhone: currentUser.phone,
      status: "Open",
      storageLocationNote: lfStorageNote || (lfType === "Found" ? "Handed over to Gate 1 Security Desk" : "Contact poster directly")
    };

    setLostFoundList(prev => [newItem, ...prev]);
    setShowLostFoundModal(false);

    setLfTitle("");
    setLfDescription("");
    setLfLocation("");
    setLfPhotoUrl("");
    setLfStorageNote("");

    triggerPushNotification(
      `🔍 Lost & Found Alert: ${lfType.toUpperCase()} - ${lfTitle}`,
      `${currentUser.name} (${currentUser.unitNumber}) posted a ${lfType} item notice in ${lfLocation}.`,
      lfType === "Lost" ? "Urgent" : "Notice"
    );
  };

  // Handle Lost & Found Status Change (Claimed / Returned)
  const handleMarkLostFoundStatus = (id: string, newStatus: "Claimed" | "Returned" | "Open") => {
    setLostFoundList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));

    const targetItem = lostFoundList.find(i => i.id === id);
    if (targetItem) {
      triggerPushNotification(
        `🎉 Recovered Item Notice: ${targetItem.title}`,
        `The ${targetItem.type.toLowerCase()} item notice from Flat ${targetItem.unitNumber} has been marked as ${newStatus}.`,
        "Notice"
      );
    }
  };

  // Handle Image File Upload for Lost & Found
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLfPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  const filteredLostFoundList = lostFoundList.filter(item => {
    if (lfTypeFilter === "Lost" && item.type !== "Lost") return false;
    if (lfTypeFilter === "Found" && item.type !== "Found") return false;
    if (lfTypeFilter === "Open" && item.status !== "Open") return false;
    if (lfTypeFilter === "Claimed" && item.status === "Open") return false;

    if (lfCategoryFilter !== "All" && item.category !== lfCategoryFilter) return false;

    const query = searchLostFound.toLowerCase();
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.postedBy.toLowerCase().includes(query) ||
      item.unitNumber.toLowerCase().includes(query)
    );
  });

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
            Resident lookup, vehicle finder, SOS panic broadcast, peer marketplace, community events, and Lost & Found portal.
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

        <button
          id="tab-lost-found"
          onClick={() => setActiveTab("lost-found")}
          className={`flex-1 py-2 px-3 rounded-lg transition whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "lost-found" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <PackageSearch className="w-3.5 h-3.5 text-rose-600" />
          <span>Lost & Found ({lostFoundList.filter(i => i.status === "Open").length})</span>
        </button>

        <button
          id="tab-event-gallery"
          onClick={() => setActiveTab("gallery")}
          className={`flex-1 py-2 px-3 rounded-lg transition whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "gallery" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-amber-500" />
          <span>Event Gallery</span>
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
          {/* Gallery Banner Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 border border-amber-200/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold shrink-0 shadow-xs">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Looking for Past Event & Festival Photos?</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Browse official RWA photos from past Diwali galas, AGMs, Holi color fests, and sports championships in the Event Gallery.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("gallery")}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Event Gallery</span>
            </button>
          </div>

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

      {/* TAB 5: LOST & FOUND */}
      {activeTab === "lost-found" && (
        <div className="space-y-4">
          {/* Header Bar & Post Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <PackageSearch className="w-5 h-5 text-rose-600" />
                <h2 className="font-bold text-slate-900 text-sm">Community Lost & Found Hub</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Report misplaced items, post items found in common areas, or claim items stored at Gate 1 Security.
              </p>
            </div>
            
            <button
              id="btn-post-lost-found"
              onClick={() => setShowLostFoundModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Report Lost / Found Item</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-rose-50/70 border border-rose-200/80 p-3 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Lost Items</p>
                <p className="text-lg font-extrabold text-rose-900 font-mono">
                  {lostFoundList.filter(i => i.type === "Lost" && i.status === "Open").length}
                </p>
              </div>
              <FileQuestion className="w-5 h-5 text-rose-500" />
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/80 p-3 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Found Items</p>
                <p className="text-lg font-extrabold text-emerald-900 font-mono">
                  {lostFoundList.filter(i => i.type === "Found" && i.status === "Open").length}
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="bg-blue-50/70 border border-blue-200/80 p-3 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Gate 1 Safe</p>
                <p className="text-lg font-extrabold text-blue-900 font-mono">
                  {lostFoundList.filter(i => i.storageLocationNote?.toLowerCase().includes("gate 1") && i.status === "Open").length}
                </p>
              </div>
              <ShieldAlert className="w-5 h-5 text-blue-500" />
            </div>

            <div className="bg-slate-100/80 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Recovered</p>
                <p className="text-lg font-extrabold text-slate-800 font-mono">
                  {lostFoundList.filter(i => i.status !== "Open").length}
                </p>
              </div>
              <Check className="w-5 h-5 text-slate-500" />
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search lost or found items, locations, flat number..."
                  value={searchLostFound}
                  onChange={e => setSearchLostFound(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              {/* Category Filter */}
              <div className="w-full sm:w-48 shrink-0">
                <select
                  value={lfCategoryFilter}
                  onChange={e => setLfCategoryFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
                >
                  <option value="All">All Categories</option>
                  <option value="Keys & Cards">Keys & Cards</option>
                  <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                  <option value="Pets">Pets</option>
                  <option value="Toys & Kids">Toys & Kids</option>
                  <option value="Clothing & Accessories">Clothing & Accessories</option>
                  <option value="Documents & Wallet">Documents & Wallet</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Type Pills */}
            <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-bold pt-1">
              <span className="text-slate-400 text-[10px] uppercase font-mono mr-1">Status:</span>
              {[
                { id: "All", label: "All Notices" },
                { id: "Lost", label: "Lost Items Only" },
                { id: "Found", label: "Found Items Only" },
                { id: "Open", label: "Active / Open" },
                { id: "Claimed", label: "Recovered / Claimed" }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setLfTypeFilter(f.id as any)}
                  className={`px-3 py-1 rounded-full transition whitespace-nowrap border ${
                    lfTypeFilter === f.id
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredLostFoundList.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
              <PackageSearch className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Lost or Found Notices Match</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or filters to view all active community items.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLostFoundList.map(item => {
                const isLost = item.type === "Lost";
                const isOpen = item.status === "Open";

                return (
                  <div
                    key={item.id}
                    className={`bg-white border rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition relative ${
                      !isOpen ? "opacity-75 bg-slate-50/80 border-slate-200" : isLost ? "border-rose-200/80" : "border-emerald-200/80"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Bar Badges */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                            isLost ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}>
                            {item.type}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {item.category}
                          </span>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isOpen ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-slate-200 text-slate-700"
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      {/* Photo Preview if available */}
                      {item.photoUrl ? (
                        <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 relative border border-slate-200/60 group">
                          <img
                            src={item.photoUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-24 rounded-xl bg-slate-100 border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1">
                          <ImageIcon className="w-6 h-6 text-slate-300" />
                          <span className="text-[10px] font-medium">No Photo Attached</span>
                        </div>
                      )}

                      {/* Item Info */}
                      <div>
                        <h3 className="font-bold text-base text-slate-900 leading-snug">{item.title}</h3>
                        
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{item.location}</span>
                          <span className="text-slate-300">•</span>
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.date}</span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed mt-2">{item.description}</p>
                      </div>

                      {/* Location / Safekeeping Note */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs text-slate-700 space-y-1">
                        <p className="font-semibold text-slate-900 flex items-center gap-1 text-[11px]">
                          <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                          <span>Safekeeping & Storage Location:</span>
                        </p>
                        <p className="text-[11px] text-slate-600 italic">
                          {item.storageLocationNote || (isLost ? "Contact poster directly if found." : "Stored at Gate 1 Main Desk.")}
                        </p>
                      </div>
                    </div>

                    {/* Footer Contact & Status Actions */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Posted by: <strong className="text-slate-900">{item.postedBy} ({item.unitNumber})</strong></span>
                        <a
                          href={`tel:${item.contactPhone}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center gap-1 text-[11px]"
                        >
                          <PhoneCall className="w-3 h-3 text-blue-600" />
                          <span>Call</span>
                        </a>
                      </div>

                      {isOpen ? (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleMarkLostFoundStatus(item.id, isLost ? "Returned" : "Claimed")}
                            className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mark as {isLost ? "Returned" : "Claimed"}</span>
                          </button>

                          <button
                            onClick={() => {
                              triggerPushNotification(
                                `🔔 Lost & Found Alert Inquiry`,
                                `Inquiry sent to Gate 1 Security Desk regarding item "${item.title}" for Flat ${item.unitNumber}.`,
                                "Notice"
                              );
                            }}
                            className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1"
                            title="Notify Security Desk"
                          >
                            <BellRing className="w-3.5 h-3.5 text-blue-600" />
                            <span>Notify Guard</span>
                          </button>
                        </div>
                      ) : (
                        <div className="bg-slate-100 p-2 rounded-xl text-center text-xs text-slate-500 font-semibold flex items-center justify-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Resolved ({item.status})</span>
                          <button
                            onClick={() => handleMarkLostFoundStatus(item.id, "Open")}
                            className="ml-2 text-[10px] text-blue-600 hover:underline font-bold"
                          >
                            Reopen
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: EVENT GALLERY */}
      {activeTab === "gallery" && (
        <EventGallery />
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

      {/* POST LOST & FOUND ITEM MODAL */}
      {showLostFoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 text-slate-900 shadow-xl relative my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                <PackageSearch className="w-5 h-5 text-rose-600" />
                <h3>Post Lost or Found Item Notice</h3>
              </div>
              <button onClick={() => setShowLostFoundModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLostFound} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="text-slate-700 block mb-1 font-bold">Report Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLfType("Lost")}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                      lfType === "Lost"
                        ? "bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-500/20"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    <FileQuestion className="w-4 h-4 text-rose-600" />
                    <span>I LOST an Item</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLfType("Found")}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                      lfType === "Found"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>I FOUND an Item</span>
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Item Name / Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Leather Wallet / AirPods Case"
                    value={lfTitle}
                    onChange={e => setLfTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Category *</label>
                  <select
                    value={lfCategory}
                    onChange={e => setLfCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-rose-500"
                  >
                    <option value="Keys & Cards">Keys & Cards</option>
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Pets">Pets</option>
                    <option value="Toys & Kids">Toys & Kids</option>
                    <option value="Clothing & Accessories">Clothing & Accessories</option>
                    <option value="Documents & Wallet">Documents & Wallet</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Location & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Location (Where lost/found) *</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Swimming Pool / Tower B Lobby"
                    value={lfLocation}
                    onChange={e => setLfLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    value={lfDate}
                    onChange={e => setLfDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Item Description & Identifying Details</label>
                <textarea
                  rows={3}
                  placeholder="Describe color, brand, condition, unique markings, or key fob details..."
                  value={lfDescription}
                  onChange={e => setLfDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Storage / Safekeeping note */}
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Safekeeping / Retrieval Instructions</label>
                <input
                  type="text"
                  placeholder={lfType === "Found" ? "e.g. Handed over to Gate 1 Security Desk" : "e.g. Contact Flat A-402 directly"}
                  value={lfStorageNote}
                  onChange={e => setLfStorageNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Photo Upload or Preset */}
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Item Photo</label>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl cursor-pointer text-slate-800 font-bold text-xs flex items-center gap-1.5 transition">
                      <Camera className="w-4 h-4 text-blue-600" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="Or paste image URL (https://...)"
                      value={lfPhotoUrl}
                      onChange={e => setLfPhotoUrl(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none text-xs"
                    />
                  </div>

                  {/* Sample Photo Presets for Quick Testing */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] text-slate-500 pt-1">
                    <span className="shrink-0 font-medium">Quick sample photos:</span>
                    {[
                      { label: "Keys", url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop&q=60" },
                      { label: "Earbuds", url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=60" },
                      { label: "Watch", url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60" },
                      { label: "Pet", url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=60" },
                      { label: "Wallet", url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60" }
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLfPhotoUrl(p.url)}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 shrink-0 font-medium"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Photo Preview */}
                  {lfPhotoUrl && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mt-2">
                      <img src={lfPhotoUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => setLfPhotoUrl("")}
                        className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-white hover:bg-slate-900"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 text-white font-bold text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-2 ${
                  lfType === "Lost" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                <PackageSearch className="w-4 h-4" />
                <span>Publish {lfType} Notice to Community</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
