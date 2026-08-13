import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import { SocietyEvent, AmenityBooking, MaintenanceTicket, NoticePost } from "../../types";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Download,
  Share2,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertTriangle,
  Building,
  Wrench,
  PartyPopper,
  ShieldCheck,
  ExternalLink,
  Users,
  X,
  Info,
  CalendarDays,
  Sparkles,
  Bookmark
} from "lucide-react";

export interface UnifiedCalendarEvent {
  id: string;
  sourceId: string;
  sourceType: "societyEvent" | "booking" | "maintenance" | "notice";
  title: string;
  category: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  description: string;
  status?: string;
  unitNumber?: string;
  isMandatory?: boolean;
  rsvpCount?: number;
  hasRsvped?: boolean;
  colorClass: string;
  badgeBg: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SocietyCalendar: React.FC = () => {
  const {
    currentUser,
    bookings,
    tickets,
    notices,
    societyEvents,
    addSocietyEvent,
    toggleEventRsvp,
    deleteSocietyEvent
  } = useSociety();

  // Calendar Navigation State (Default to August 2026 as current context)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed: 7 = August

  // View mode
  const [viewMode, setViewMode] = useState<"month" | "week" | "agenda">("month");

  // Filters
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [myFlatOnly, setMyFlatOnly] = useState<boolean>(false);

  // Modals
  const [selectedEvent, setSelectedEvent] = useState<UnifiedCalendarEvent | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState<boolean>(false);
  const [selectedDayForAdd, setSelectedDayForAdd] = useState<string | null>(null);

  // Add Event Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<SocietyEvent["category"]>("Society Meeting");
  const [newDate, setNewDate] = useState("2026-08-16");
  const [newStartTime, setNewStartTime] = useState("10:00 AM");
  const [newEndTime, setNewEndTime] = useState("12:00 PM");
  const [newLocation, setNewLocation] = useState("Clubhouse Conference Room");
  const [newOrganizer, setNewOrganizer] = useState("RWA Committee");
  const [newDescription, setNewDescription] = useState("");
  const [newIsMandatory, setNewIsMandatory] = useState(false);

  // Month Names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Map and consolidate all sources into Unified Calendar Events
  const unifiedEvents: UnifiedCalendarEvent[] = [];

  // 1. Add Society Events
  societyEvents.forEach(evt => {
    unifiedEvents.push({
      id: `evt-${evt.id}`,
      sourceId: evt.id,
      sourceType: "societyEvent",
      title: evt.title,
      category: evt.category,
      date: evt.date,
      startTime: evt.startTime,
      endTime: evt.endTime,
      location: evt.location,
      organizer: evt.organizer,
      description: evt.description,
      isMandatory: evt.isMandatory,
      rsvpCount: evt.rsvpCount,
      hasRsvped: evt.rsvpedBy.includes(currentUser.unitNumber),
      colorClass: evt.category === "Emergency Drill"
        ? "bg-rose-500 text-white border-rose-600"
        : evt.category === "Society Meeting"
        ? "bg-indigo-600 text-white border-indigo-700"
        : evt.category === "Cultural Event"
        ? "bg-amber-500 text-white border-amber-600"
        : "bg-emerald-600 text-white border-emerald-700",
      badgeBg: evt.category === "Emergency Drill"
        ? "bg-rose-50 text-rose-700 border-rose-200"
        : evt.category === "Society Meeting"
        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
        : evt.category === "Cultural Event"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: evt.category === "Cultural Event"
        ? PartyPopper
        : evt.category === "Emergency Drill"
        ? AlertTriangle
        : Users
    });
  });

  // 2. Add Amenity Bookings
  bookings.forEach(b => {
    if (b.status !== "Cancelled") {
      const timeParts = b.timeSlot.split(" - ");
      unifiedEvents.push({
        id: `bk-${b.id}`,
        sourceId: b.id,
        sourceType: "booking",
        title: `🏛️ Booking: ${b.amenityName}`,
        category: "Amenity Booking",
        date: b.date,
        startTime: timeParts[0] || "10:00 AM",
        endTime: timeParts[1] || "01:00 PM",
        location: b.amenityName,
        organizer: `${b.residentName} (${b.unitNumber})`,
        description: `Amenity reservation pass #${b.qrPassCode}. Paid: $${b.totalPaid}. Reserved by Flat ${b.unitNumber}.`,
        status: b.status,
        unitNumber: b.unitNumber,
        colorClass: "bg-blue-600 text-white border-blue-700",
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Building
      });
    }
  });

  // 3. Add Scheduled Maintenance Tickets
  tickets.forEach(t => {
    if (t.scheduledDate && t.status !== "Resolved") {
      unifiedEvents.push({
        id: `tkt-${t.id}`,
        sourceId: t.id,
        sourceType: "maintenance",
        title: `🔧 Maintenance: ${t.title}`,
        category: "Maintenance Schedule",
        date: t.scheduledDate,
        startTime: t.scheduledTime || "10:00 AM",
        endTime: "12:00 PM",
        location: t.unitNumber === "Gate 1" ? "Common Areas" : `Flat ${t.unitNumber}`,
        organizer: t.assignedStaff || "Estate Maintenance Team",
        description: `Ticket #${t.ticketNo} (${t.priority} Priority). ${t.description}`,
        status: t.status,
        unitNumber: t.unitNumber,
        colorClass: "bg-purple-600 text-white border-purple-700",
        badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
        icon: Wrench
      });
    }
  });

  // 4. Add Notice Events (e.g., Notice posts with scheduled notice events)
  notices.filter(n => n.category === "Event" || n.category === "Maintenance" || n.category === "Emergency").forEach(n => {
    // avoid duplicates if already covered by society event
    const exists = unifiedEvents.some(e => e.title.includes(n.title.substring(0, 10)));
    if (!exists) {
      unifiedEvents.push({
        id: `notice-${n.id}`,
        sourceId: n.id,
        sourceType: "notice",
        title: `📢 Notice: ${n.title}`,
        category: `${n.category} Notice`,
        date: n.date,
        startTime: "09:00 AM",
        endTime: "05:00 PM",
        location: "Grand Vista Premises",
        organizer: n.author,
        description: n.content,
        colorClass: "bg-slate-700 text-white border-slate-800",
        badgeBg: "bg-slate-100 text-slate-800 border-slate-200",
        icon: Info
      });
    }
  });

  // Filter events logic
  const filteredEvents = unifiedEvents.filter(evt => {
    // My flat filter
    if (myFlatOnly) {
      const isMyUnit = evt.unitNumber === currentUser.unitNumber || (evt.hasRsvped);
      if (!isMyUnit) return false;
    }

    // Category filter
    if (selectedCategoryFilter !== "All") {
      if (selectedCategoryFilter === "Amenity Bookings" && evt.sourceType !== "booking") return false;
      if (selectedCategoryFilter === "Maintenance Schedules" && evt.sourceType !== "maintenance") return false;
      if (selectedCategoryFilter === "Society Meetings" && evt.category !== "Society Meeting") return false;
      if (selectedCategoryFilter === "Cultural & Community" && evt.category !== "Cultural Event" && evt.category !== "Community Workshop") return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchDesc = evt.description.toLowerCase().includes(q);
      const matchLoc = evt.location.toLowerCase().includes(q);
      const matchOrg = evt.organizer.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchOrg) return false;
    }

    return true;
  });

  // Month grid calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Next / Previous month controls
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Helper to format date string YYYY-MM-DD
  const formatDateString = (year: number, monthZeroIndexed: number, day: number) => {
    const m = (monthZeroIndexed + 1).toString().padStart(2, "0");
    const d = day.toString().padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  // Calendar ICS Generator Function
  const generateICSContent = (eventList: UnifiedCalendarEvent[]) => {
    let ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//CivicHQ//Grand Vista Society Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH"
    ];

    eventList.forEach(evt => {
      // Parse date and time to ISO format YYYYMMDDTHHMMSS
      const cleanDate = evt.date.replace(/-/g, "");
      // Default time 090000 if parsing fails
      const dtStart = `${cleanDate}T100000Z`;
      const dtEnd = `${cleanDate}T120000Z`;

      ics.push(
        "BEGIN:VEVENT",
        `UID:${evt.id}@civichq.grandvista.org`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${evt.title.replace(/[,\n]/g, " ")}`,
        `DESCRIPTION:${evt.description.replace(/[,\n]/g, " ")} (Organizer: ${evt.organizer})`,
        `LOCATION:${evt.location.replace(/[,\n]/g, " ")}`,
        "STATUS:CONFIRMED",
        "END:VEVENT"
      );
    });

    ics.push("END:VCALENDAR");
    return ics.join("\r\n");
  };

  // Download ICS File
  const handleDownloadICS = (eventList: UnifiedCalendarEvent[], filename: string) => {
    const content = generateICSContent(eventList);
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (evt: UnifiedCalendarEvent) => {
    const cleanDate = evt.date.replace(/-/g, "");
    const dates = `${cleanDate}T100000Z/${cleanDate}T120000Z`;
    const title = encodeURIComponent(evt.title);
    const details = encodeURIComponent(`${evt.description}\n\nOrganizer: ${evt.organizer}\nCategory: ${evt.category}`);
    const location = encodeURIComponent(evt.location);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // Handle Add Event Submit
  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate || !newDescription.trim()) return;

    addSocietyEvent({
      title: newTitle,
      category: newCategory,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      location: newLocation,
      organizer: newOrganizer || currentUser.name,
      description: newDescription,
      isMandatory: newIsMandatory
    });

    setShowAddEventModal(false);
    // Reset form
    setNewTitle("");
    setNewDescription("");
  };

  return (
    <div className="space-y-6">
      {/* Header & Master Controls */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              <h1 className="text-xl font-bold text-slate-900">Shared Society Calendar & Schedule Sync</h1>
            </div>
            <p className="text-xs text-slate-600">
              Auto-syncing master calendar combining amenity bookings, maintenance downtime, RWA townhalls, and cultural events.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Sync All / Export ICS Button */}
            <button
              id="btn-export-ics-master"
              onClick={() => handleDownloadICS(filteredEvents, `Grand_Vista_Society_Calendar_${monthNames[currentMonth]}_${currentYear}.ics`)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Export Calendar (.ics)</span>
            </button>

            {/* Add Society Event Button */}
            <button
              id="btn-schedule-society-event"
              onClick={() => { setSelectedDayForAdd(null); setShowAddEventModal(true); }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Event</span>
            </button>
          </div>
        </div>

        {/* View Mode & Month Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          
          {/* Month Selector Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm text-slate-900 px-3 font-mono min-w-[140px] text-center">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => { setCurrentYear(2026); setCurrentMonth(7); }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition"
            >
              Today
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            {(["month", "agenda"] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`py-1.5 px-3.5 rounded-lg transition capitalize ${
                  viewMode === mode
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {mode === "month" ? "Month Grid" : "Agenda List"}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search event title, venue, organizer, or flat..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full md:w-auto">
            {[
              "All",
              "Amenity Bookings",
              "Maintenance Schedules",
              "Society Meetings",
              "Cultural & Community"
            ].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
                  selectedCategoryFilter === cat
                    ? "bg-slate-900 text-white border-slate-900 font-bold"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* My Flat Events Toggle */}
          <button
            onClick={() => setMyFlatOnly(!myFlatOnly)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
              myFlatOnly
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>My Flat ({currentUser.unitNumber})</span>
          </button>

        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-600">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Legend:</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Society Meetings</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Amenity Bookings</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Maintenance Downtime</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Cultural Events</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Mandatory Drills</span>
        </div>
      </div>

      {/* MONTH GRID VIEW */}
      {viewMode === "month" && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center font-bold text-xs text-slate-600 py-2.5">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
            {/* Previous month padding cells */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => {
              const dayNum = daysInPrevMonth - firstDayOfMonth + idx + 1;
              return (
                <div key={`prev-${idx}`} className="p-2 min-h-[110px] bg-slate-50/50 text-slate-300 font-mono text-xs">
                  {dayNum}
                </div>
              );
            })}

            {/* Current month day cells */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = formatDateString(currentYear, currentMonth, dayNum);
              const dayEvents = filteredEvents.filter(e => e.date === dateStr);
              const isToday = dateStr === "2026-08-13"; // current mock date

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`p-2 min-h-[110px] space-y-1.5 transition flex flex-col justify-between hover:bg-slate-50/80 group relative ${
                    isToday ? "bg-indigo-50/40" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday ? "bg-indigo-600 text-white" : "text-slate-700"
                      }`}
                    >
                      {dayNum}
                    </span>

                    <button
                      onClick={() => {
                        setNewDate(dateStr);
                        setSelectedDayForAdd(dateStr);
                        setShowAddEventModal(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 p-0.5 rounded transition"
                      title="Add event to this date"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Day Events Container */}
                  <div className="space-y-1 flex-1 overflow-y-auto max-h-[100px] scrollbar-none">
                    {dayEvents.map(evt => {
                      const IconComp = evt.icon;
                      return (
                        <button
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          className={`w-full text-left p-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs border transition truncate ${evt.colorClass}`}
                          title={`${evt.title} (${evt.startTime})`}
                        >
                          <IconComp className="w-3 h-3 shrink-0" />
                          <span className="truncate">{evt.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AGENDA LIST VIEW */}
      {viewMode === "agenda" && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              <span>Agenda Schedule ({filteredEvents.length} Events)</span>
            </h2>

            <button
              onClick={() => handleDownloadICS(filteredEvents, "Society_Agenda.ics")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Agenda .ics</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <CalendarIcon className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-medium">No society events found for this filter.</p>
              </div>
            ) : (
              filteredEvents
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(evt => {
                  const IconComp = evt.icon;
                  return (
                    <div
                      key={evt.id}
                      className="p-4 border border-slate-200 rounded-xl hover:border-indigo-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono ${evt.badgeBg}`}>
                            {evt.category}
                          </span>
                          <span className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md">
                            📅 {evt.date}
                          </span>
                          {evt.isMandatory && (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                              Mandatory Attendance
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <IconComp className="w-4 h-4 text-indigo-600" />
                          <span>{evt.title}</span>
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {evt.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{evt.startTime} - {evt.endTime}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{evt.location}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>By: {evt.organizer}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                        {evt.sourceType === "societyEvent" && (
                          <button
                            onClick={() => toggleEventRsvp(evt.sourceId)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                              evt.hasRsvped
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                            }`}
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${evt.hasRsvped ? "text-emerald-600" : "text-slate-400"}`} />
                            <span>{evt.hasRsvped ? "Attending" : "RSVP"}</span>
                          </button>
                        )}

                        <a
                          href={getGoogleCalendarUrl(evt)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-indigo-200"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Google Cal</span>
                        </a>

                        <button
                          onClick={() => handleDownloadICS([evt], `${evt.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                          title="Download .ics file"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* EVENT INSPECT MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-5 text-slate-900 shadow-xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${selectedEvent.badgeBg}`}>
                  {selectedEvent.category}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1.5">{selectedEvent.title}</h3>
              </div>

              <button onClick={() => setSelectedEvent(null)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Meta Details Grid */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block font-medium mb-0.5">Date & Time</span>
                  <p className="font-bold text-slate-900 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{selectedEvent.date}</span>
                  </p>
                  <p className="text-slate-600 font-mono">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium mb-0.5">Location</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{selectedEvent.location}</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200/60 pt-2.5 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block font-medium mb-0.5">Organizer</span>
                  <p className="font-bold text-slate-800">{selectedEvent.organizer}</p>
                </div>

                {selectedEvent.rsvpCount !== undefined && (
                  <div>
                    <span className="text-slate-400 block font-medium mb-0.5">Community RSVPs</span>
                    <p className="font-bold text-indigo-600 font-mono">{selectedEvent.rsvpCount} Residents Confirmed</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700">Event Description & Notes</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                {selectedEvent.description}
              </p>
            </div>

            {/* Action Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <a
                  href={getGoogleCalendarUrl(selectedEvent)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Sync to Google Calendar</span>
                </a>

                <button
                  onClick={() => handleDownloadICS([selectedEvent], `${selectedEvent.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>Download .ics File</span>
                </button>
              </div>

              {selectedEvent.sourceType === "societyEvent" && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => { toggleEventRsvp(selectedEvent.sourceId); setSelectedEvent(null); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      selectedEvent.hasRsvped
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{selectedEvent.hasRsvped ? "RSVP Confirmed (Click to Change)" : "Mark as Attending (RSVP)"}</span>
                  </button>

                  {(currentUser.role === "admin" || selectedEvent.organizer === currentUser.name) && (
                    <button
                      onClick={() => { deleteSocietyEvent(selectedEvent.sourceId); setSelectedEvent(null); }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800"
                    >
                      Cancel Event
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SCHEDULE NEW SOCIETY EVENT MODAL */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 text-slate-900 shadow-xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
                <CalendarIcon className="w-5 h-5" />
                <h3>Schedule Society Event</h3>
              </div>
              <button onClick={() => setShowAddEventModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEventSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-bold">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Annual General Body Meeting, Independence Day Gala..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  >
                    <option value="Society Meeting">Society Meeting</option>
                    <option value="Maintenance Drive">Maintenance Drive</option>
                    <option value="Cultural Event">Cultural Event</option>
                    <option value="Emergency Drill">Emergency Drill</option>
                    <option value="Community Workshop">Community Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Start Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={newStartTime}
                    onChange={e => setNewStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">End Time</label>
                  <input
                    type="text"
                    placeholder="12:00 PM"
                    value={newEndTime}
                    onChange={e => setNewEndTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Location / Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Clubhouse Party Hall"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Organizer / Host</label>
                  <input
                    type="text"
                    placeholder="RWA Committee"
                    value={newOrganizer}
                    onChange={e => setNewOrganizer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-bold">Description & Agenda</label>
                <textarea
                  rows={3}
                  placeholder="Outline event agenda, speaker details, rules, or instructions for residents..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  required
                />
              </div>

              {/* Mandatory Toggle */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Mandatory Resident Attendance</span>
                </span>
                <input
                  type="checkbox"
                  checked={newIsMandatory}
                  onChange={e => setNewIsMandatory(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Add Event to Shared Calendar
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
