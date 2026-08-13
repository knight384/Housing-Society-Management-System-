import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import { MaintenanceTicket } from "../../types";
import {
  Wrench,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Star,
  UserCheck,
  Search,
  Filter,
  X,
  Loader2,
  Calendar as CalendarIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Shield,
  Zap,
  Building2,
  List,
  Check,
  ArrowRight,
  Tag,
  ThumbsUp,
  MessageSquare,
  Award,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Send,
  HeartHandshake,
  AlertCircle
} from "lucide-react";

export const MaintenanceHelpdesk: React.FC = () => {
  const {
    currentUser,
    tickets,
    createTicket,
    updateTicketStatus,
    scheduleTicketVisit,
    rateTicket,
    addManagementResponse
  } = useSociety();

  // View state: Calendar vs List vs Service Ratings & CSAT
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "reviews">("calendar");

  // Filters & Search
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Review Feed Filters
  const [reviewFilterRating, setReviewFilterRating] = useState<"All" | "5" | "4" | "Critical" | "Reopened">("All");
  const [reviewSearch, setReviewSearch] = useState("");

  // Calendar Date State (default to August 2026 where mock visits are populated)
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date(2026, 7, 1));
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>("2026-08-12");

  // Ticket Modal state (Create Ticket)
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<MaintenanceTicket['category']>("Plumbing");
  const [priority, setPriority] = useState<MaintenanceTicket['priority']>("Medium");
  const [scheduledDate, setScheduledDate] = useState("2026-08-12");
  const [scheduledTime, setScheduledTime] = useState("10:00 AM");
  const [serviceType, setServiceType] = useState<MaintenanceTicket['serviceType']>("Repair Visit");
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);

  // Resolution / Staff Modal state (For Admin)
  const [activeTicketForStaff, setActiveTicketForStaff] = useState<MaintenanceTicket | null>(null);
  const [assignedStaff, setAssignedStaff] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");

  // Rating Modal state (For Resident)
  const [activeTicketForRating, setActiveTicketForRating] = useState<MaintenanceTicket | null>(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [qualityRatingVal, setQualityRatingVal] = useState(5);
  const [speedRatingVal, setSpeedRatingVal] = useState(5);
  const [staffRatingVal, setStaffRatingVal] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [reopenRequested, setReopenRequested] = useState(false);

  // Management Response Modal State (For Admin / Manager)
  const [activeTicketForResponse, setActiveTicketForResponse] = useState<MaintenanceTicket | null>(null);
  const [managementReplyText, setManagementReplyText] = useState("");

  // Schedule / Reschedule Visit Modal State
  const [activeTicketToSchedule, setActiveTicketToSchedule] = useState<MaintenanceTicket | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("11:00 AM");
  const [rescheduleType, setRescheduleType] = useState<MaintenanceTicket['serviceType']>("Repair Visit");

  // Filtered tickets based on search, category, status, and resident access
  const userTickets = tickets.filter(t => {
    if (currentUser.role === "resident" && t.unitNumber !== currentUser.unitNumber) {
      return false;
    }
    return true;
  });

  const filteredTickets = userTickets.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assignedStaff && t.assignedStaff.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === "All" || t.status === filterStatus;
    const matchesCategory = filterCategory === "All" || t.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Unrated resolved tickets specifically for current resident prompt
  const unratedResolvedTickets = tickets.filter(
    t => t.unitNumber === currentUser.unitNumber && t.status === "Resolved" && !t.rating
  );

  // Scheduled tickets specifically for Calendar visualization
  const scheduledTickets = filteredTickets.filter(t => Boolean(t.scheduledDate));

  // Statistics
  const totalScheduledCount = scheduledTickets.length;
  const pendingVisitsCount = scheduledTickets.filter(t => t.status === "Open" || t.status === "Assigned" || t.status === "In Progress").length;
  const completedVisitsCount = scheduledTickets.filter(t => t.status === "Resolved").length;
  const unscheduledTicketsCount = userTickets.filter(t => !t.scheduledDate && t.status !== "Resolved").length;

  // Rating & CSAT Aggregate Analytics (across society tickets)
  const allRatedTickets = tickets.filter(t => t.rating && t.rating > 0);
  const totalRatedCount = allRatedTickets.length;

  const avgOverallRating = totalRatedCount > 0
    ? (allRatedTickets.reduce((acc, t) => acc + (t.rating || 0), 0) / totalRatedCount).toFixed(1)
    : "5.0";

  const avgQualityRating = totalRatedCount > 0
    ? (allRatedTickets.reduce((acc, t) => acc + (t.qualityRating || t.rating || 0), 0) / totalRatedCount).toFixed(1)
    : "4.9";

  const avgSpeedRating = totalRatedCount > 0
    ? (allRatedTickets.reduce((acc, t) => acc + (t.speedRating || t.rating || 0), 0) / totalRatedCount).toFixed(1)
    : "4.8";

  const avgStaffRating = totalRatedCount > 0
    ? (allRatedTickets.reduce((acc, t) => acc + (t.staffRating || t.rating || 0), 0) / totalRatedCount).toFixed(1)
    : "4.9";

  const satisfiedCount = allRatedTickets.filter(t => (t.rating || 0) >= 4).length;
  const csatPercentage = totalRatedCount > 0 ? Math.round((satisfiedCount / totalRatedCount) * 100) : 96;

  // Vendor/Staff Leaderboard grouping
  const staffLeaderboardMap = new Map<string, {
    staffName: string;
    completedCount: number;
    totalRating: number;
    totalQuality: number;
    totalSpeed: number;
    tags: string[];
  }>();

  tickets.forEach(t => {
    if (t.assignedStaff && (t.status === "Resolved" || t.rating)) {
      const staff = t.assignedStaff;
      const existing = staffLeaderboardMap.get(staff) || {
        staffName: staff,
        completedCount: 0,
        totalRating: 0,
        totalQuality: 0,
        totalSpeed: 0,
        tags: []
      };
      existing.completedCount += 1;
      existing.totalRating += t.rating || 5;
      existing.totalQuality += t.qualityRating || t.rating || 5;
      existing.totalSpeed += t.speedRating || t.rating || 5;
      if (t.feedbackTags) {
        existing.tags.push(...t.feedbackTags);
      }
      staffLeaderboardMap.set(staff, existing);
    }
  });

  const staffLeaderboard = Array.from(staffLeaderboardMap.values()).map(s => ({
    ...s,
    avgOverall: (s.totalRating / s.completedCount).toFixed(1),
    avgQuality: (s.totalQuality / s.completedCount).toFixed(1),
    avgSpeed: (s.totalSpeed / s.completedCount).toFixed(1),
  })).sort((a, b) => Number(b.avgOverall) - Number(a.avgOverall));

  // Calendar Calculation Helpers
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun

  const monthYearLabel = currentMonthDate.toLocaleString("default", { month: "long", year: "numeric" });

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleTodayMonth = () => {
    setCurrentMonthDate(new Date(2026, 7, 1));
    setSelectedDateStr("2026-08-08");
  };

  const formatDateKey = (d: number) => {
    const mStr = String(month + 1).padStart(2, "0");
    const dStr = String(d).padStart(2, "0");
    return `${year}-${mStr}-${dStr}`;
  };

  // AI helper for ticket classification
  const handleAiAnalyzeTicket = async () => {
    if (!description) return;
    setIsAnalyzingAi(true);

    try {
      const res = await fetch("/api/ai/analyze-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      });
      const data = await res.json();
      if (data.priority) setPriority(data.priority);
      if (data.suggestedCategory) setCategory(data.suggestedCategory);
    } catch {
      if (description.toLowerCase().includes("leak") || description.toLowerCase().includes("fire") || description.toLowerCase().includes("urgent")) {
        setPriority("High");
      }
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    createTicket({
      unitNumber: currentUser.unitNumber,
      title,
      description,
      category,
      priority,
      scheduledDate,
      scheduledTime,
      serviceType
    });

    setShowModal(false);
    setTitle("");
    setDescription("");
  };

  const handleSaveStaffAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketForStaff) return;
    updateTicketStatus(activeTicketForStaff.id, "Assigned", assignedStaff || "Staff Technician Mario", resolutionNotes);
    setActiveTicketForStaff(null);
  };

  const handleOpenRatingModal = (tkt: MaintenanceTicket) => {
    setActiveTicketForRating(tkt);
    setRatingVal(tkt.rating || 5);
    setQualityRatingVal(tkt.qualityRating || tkt.rating || 5);
    setSpeedRatingVal(tkt.speedRating || tkt.rating || 5);
    setStaffRatingVal(tkt.staffRating || tkt.rating || 5);
    setSelectedTags(tkt.feedbackTags || ["Punctual", "Fixed First Try"]);
    setFeedback(tkt.feedbackComment || "");
    setReopenRequested(Boolean(tkt.isReopenRequested));
  };

  const handleSaveRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketForRating) return;

    rateTicket(
      activeTicketForRating.id,
      ratingVal,
      feedback,
      qualityRatingVal,
      speedRatingVal,
      staffRatingVal,
      selectedTags,
      reopenRequested
    );

    setActiveTicketForRating(null);
  };

  const handleOpenResponseModal = (tkt: MaintenanceTicket) => {
    setActiveTicketForResponse(tkt);
    setManagementReplyText(tkt.managementResponse || "");
  };

  const handleSaveManagementResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketForResponse) return;

    addManagementResponse(activeTicketForResponse.id, managementReplyText);
    setActiveTicketForResponse(null);
  };

  const handleSaveScheduleVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketToSchedule || !rescheduleDate) return;
    scheduleTicketVisit(activeTicketToSchedule.id, rescheduleDate, rescheduleTime, rescheduleType);
    setSelectedDateStr(rescheduleDate);
    setActiveTicketToSchedule(null);
  };

  const toggleTagSelection = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Preset feedback tag pills
  const availableTagOptions = [
    "⚡ Lightning Fast",
    "🛠️ Fixed First Try",
    "🧹 Clean Cleanup",
    "😊 Polite Staff",
    "⏰ Punctual Arrival",
    "📞 Great Communication",
    "⌛ Delayed Arrival",
    "⚠️ Re-work Required"
  ];

  // Helper for Category Colors & Icons
  const getCategoryBadgeStyle = (cat: MaintenanceTicket['category']) => {
    switch (cat) {
      case "Plumbing":
        return { bg: "bg-blue-50 text-blue-700 border-blue-200", icon: Wrench, dot: "bg-blue-600" };
      case "Electrical":
        return { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: Zap, dot: "bg-amber-600" };
      case "Elevator":
        return { bg: "bg-purple-50 text-purple-700 border-purple-200", icon: Building2, dot: "bg-purple-600" };
      case "Civil/Pest":
        return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Shield, dot: "bg-emerald-600" };
      case "Security":
        return { bg: "bg-rose-50 text-rose-700 border-rose-200", icon: Shield, dot: "bg-rose-600" };
      default:
        return { bg: "bg-cyan-50 text-cyan-700 border-cyan-200", icon: Wrench, dot: "bg-cyan-600" };
    }
  };

  // Selected Day's scheduled visits
  const selectedDayTickets = selectedDateStr
    ? filteredTickets.filter(t => t.scheduledDate === selectedDateStr)
    : [];

  // Filtered reviews for CSAT tab
  const filteredReviewsList = tickets.filter(t => {
    if (!t.rating) return false;

    const matchesSearch =
      t.title.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      t.ticketNo.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      t.unitNumber.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      t.residentName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      (t.assignedStaff && t.assignedStaff.toLowerCase().includes(reviewSearch.toLowerCase())) ||
      (t.feedbackComment && t.feedbackComment.toLowerCase().includes(reviewSearch.toLowerCase()));

    if (!matchesSearch) return false;

    if (reviewFilterRating === "5") return t.rating === 5;
    if (reviewFilterRating === "4") return t.rating === 4;
    if (reviewFilterRating === "Critical") return t.rating <= 3;
    if (reviewFilterRating === "Reopened") return Boolean(t.isReopenRequested);

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-600">
              <Wrench className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Maintenance Helpdesk & Service Feedback</h1>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl">
            Schedule repairs, track technician visits on the calendar, monitor resolution progress, and rate service quality and speed provided by facility management.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* View Mode Toggle Switch */}
          <div className="flex items-center bg-slate-100 border border-slate-200/80 p-1 rounded-xl">
            <button
              id="btn-view-calendar"
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === "calendar"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
            <button
              id="btn-view-list"
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === "list"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              id="btn-view-reviews"
              onClick={() => setViewMode("reviews")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === "reviews"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-amber-800 hover:text-amber-950 font-bold"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Ratings & CSAT ({totalRatedCount})</span>
            </button>
          </div>

          <button
            id="btn-raise-ticket"
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Repair / Ticket</span>
          </button>
        </div>
      </div>

      {/* PENDING RATING CALLOUT BANNER (For Resident) */}
      {unratedResolvedTickets.length > 0 && currentUser.role === "resident" && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 border border-amber-300/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold shrink-0 shadow-xs">
              <Star className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>Service Feedback Needed ({unratedResolvedTickets.length} Resolved Repair)</span>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full text-[10px] uppercase font-bold">Action Needed</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Please review quality & speed for Ticket <strong>#{unratedResolvedTickets[0].ticketNo}</strong>: &quot;{unratedResolvedTickets[0].title}&quot; handled by {unratedResolvedTickets[0].assignedStaff || "Facility Management"}.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenRatingModal(unratedResolvedTickets[0])}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>Rate Quality & Speed</span>
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Scheduled Visits</p>
            <p className="text-lg font-bold text-slate-900 font-mono">{totalScheduledCount}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Upcoming Visits</p>
            <p className="text-lg font-bold text-amber-700 font-mono">{pendingVisitsCount}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Completed Visits</p>
            <p className="text-lg font-bold text-emerald-700 font-mono">{completedVisitsCount}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 border border-purple-200 text-purple-600 rounded-xl">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Unscheduled</p>
            <p className="text-lg font-bold text-purple-700 font-mono">{unscheduledTicketsCount}</p>
          </div>
        </div>

        <div className="bg-white border border-amber-200/80 p-4 rounded-2xl shadow-xs flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold">
            <Star className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">CSAT Rating</p>
            <p className="text-lg font-bold text-slate-900 font-mono flex items-center gap-1">
              <span>{avgOverallRating}</span>
              <span className="text-xs text-slate-500 font-sans font-normal">/ 5.0</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar (Visible for Calendar & List views) */}
      {viewMode !== "reviews" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by issue title, #, unit, technician..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none font-medium"
            >
              <option value="All">All Service Categories</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Elevator">Elevator</option>
              <option value="Civil/Pest">Civil / Pest Control</option>
              <option value="Security">Security & Gate</option>
              <option value="General Maintenance">General Maintenance</option>
            </select>
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendar Grid Container */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            
            {/* Month Header Navigation */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  <span>{monthYearLabel}</span>
                </h2>
                <button
                  onClick={handleTodayMonth}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition"
                >
                  August 2026
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  id="btn-calendar-prev-month"
                  onClick={handlePrevMonth}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="btn-calendar-next-month"
                  onClick={handleNextMonth}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day Names Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 py-1 border-b border-slate-100">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 min-h-[380px]">
              {/* Empty leading padding cells */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-start-${idx}`} className="bg-slate-50/50 rounded-xl border border-slate-100 p-2 opacity-30 min-h-[85px]" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateKey = formatDateKey(dayNum);
                const isSelected = selectedDateStr === dateKey;
                const isToday = dateKey === "2026-08-08";

                // Visits on this day
                const visits = filteredTickets.filter(t => t.scheduledDate === dateKey);

                return (
                  <div
                    key={dateKey}
                    onClick={() => setSelectedDateStr(dateKey)}
                    className={`rounded-xl p-2 border transition cursor-pointer flex flex-col justify-between min-h-[85px] text-xs relative group ${
                      isSelected
                        ? "bg-blue-50 border-blue-600 ring-2 ring-blue-500/30"
                        : isToday
                        ? "bg-amber-50/50 border-amber-300"
                        : visits.length > 0
                        ? "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                        : "bg-white border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    {/* Day number header */}
                    <div className="flex justify-between items-center">
                      <span className={`font-mono text-xs font-bold ${
                        isSelected ? "text-blue-900" : isToday ? "text-amber-800 font-extrabold" : "text-slate-700"
                      }`}>
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-bold">TODAY</span>
                      )}
                      {visits.length > 0 && !isToday && (
                        <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded-full font-mono font-bold">
                          {visits.length} {visits.length === 1 ? 'visit' : 'visits'}
                        </span>
                      )}
                    </div>

                    {/* Day Visit Badges */}
                    <div className="space-y-1 mt-1 overflow-hidden">
                      {visits.slice(0, 2).map(v => {
                        const style = getCategoryBadgeStyle(v.category);
                        return (
                          <div
                            key={v.id}
                            className={`px-1.5 py-0.5 rounded-md border text-[10px] truncate font-semibold flex items-center gap-1 ${style.bg}`}
                            title={`${v.scheduledTime || 'TBD'} - ${v.title} (${v.unitNumber})`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />
                            <span className="truncate">{v.title}</span>
                          </div>
                        );
                      })}
                      {visits.length > 2 && (
                        <p className="text-[9px] text-slate-500 font-semibold pl-1">
                          +{visits.length - 2} more...
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend Footer */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2 font-medium">
              <span className="font-semibold text-slate-800">Service Categories:</span>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" /> Plumbing</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Electrical</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-600" /> Elevator AMC</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600" /> Civil / Pest</span>
              </div>
            </div>

          </div>

          {/* Selected Day Schedule Sidebar / Drawer */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Day Schedule</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedDateStr ? selectedDateStr : "Select a date on the calendar"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (selectedDateStr) {
                      setRescheduleDate(selectedDateStr);
                      setShowModal(true);
                      setScheduledDate(selectedDateStr);
                    }
                  }}
                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Visit</span>
                </button>
              </div>

              {/* List of Visits for Selected Date */}
              {selectedDayTickets.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs space-y-3 bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
                  <CalendarIcon className="w-8 h-8 mx-auto opacity-30 text-blue-600" />
                  <p>No service visits or repairs scheduled for <strong className="text-slate-900">{selectedDateStr}</strong>.</p>
                  <button
                    onClick={() => {
                      if (selectedDateStr) {
                        setScheduledDate(selectedDateStr);
                        setShowModal(true);
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition inline-flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule Repair on this Date</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {selectedDayTickets.map(tkt => {
                    const CategoryIcon = getCategoryBadgeStyle(tkt.category).icon;
                    return (
                      <div
                        key={tkt.id}
                        className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-3 hover:border-slate-300 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[11px] rounded-lg font-bold">
                            {tkt.scheduledTime || "10:00 AM"}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            tkt.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            tkt.status === "In Progress" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}>
                            {tkt.status}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                            <CategoryIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{tkt.title}</span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{tkt.description}</p>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 text-[11px] space-y-1 font-mono text-slate-600">
                          <p><strong className="text-slate-900 font-sans">Flat:</strong> {tkt.unitNumber} ({tkt.residentName})</p>
                          <p><strong className="text-slate-900 font-sans">Ticket:</strong> {tkt.ticketNo} ({tkt.priority} Priority)</p>
                          {tkt.assignedStaff && (
                            <p className="text-blue-700"><strong className="text-slate-900 font-sans">Technician:</strong> {tkt.assignedStaff}</p>
                          )}
                          {tkt.serviceType && (
                            <p className="text-purple-700"><strong className="text-slate-900 font-sans">Type:</strong> {tkt.serviceType}</p>
                          )}
                        </div>

                        {/* Rating Display if Resolved */}
                        {tkt.status === "Resolved" && (
                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                            {tkt.rating ? (
                              <div className="flex items-center gap-1 text-amber-600 font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                <span>{tkt.rating}/5 Rated</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleOpenRatingModal(tkt)}
                                className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1"
                              >
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                <span>Rate Resolution Quality</span>
                              </button>
                            )}
                          </div>
                        )}

                        {/* Action Buttons for this Ticket */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              setActiveTicketToSchedule(tkt);
                              setRescheduleDate(tkt.scheduledDate || selectedDateStr || "2026-08-12");
                              setRescheduleTime(tkt.scheduledTime || "11:00 AM");
                              setRescheduleType(tkt.serviceType || "Repair Visit");
                            }}
                            className="flex-1 py-1.5 bg-slate-200/80 hover:bg-slate-300/80 text-slate-800 rounded-xl text-xs font-semibold transition"
                          >
                            Reschedule
                          </button>

                          {currentUser.role === "admin" && tkt.status !== "Resolved" && (
                            <button
                              onClick={() => {
                                setActiveTicketForStaff(tkt);
                                setAssignedStaff(tkt.assignedStaff || "");
                              }}
                              className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold transition"
                            >
                              Assign / Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Unscheduled Tickets Warning Callout */}
            {unscheduledTicketsCount > 0 && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-center justify-between font-medium">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{unscheduledTicketsCount} unscheduled ticket(s) await visit dates.</span>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* LIST VIEW CARDS */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-white border border-slate-200/80 rounded-2xl">
              <Wrench className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No tickets found matching current search or filters.</p>
            </div>
          ) : (
            filteredTickets.map(tkt => (
              <div
                key={tkt.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 transition hover:shadow-md ${
                  tkt.status === "Resolved" ? "border-emerald-300" : "border-slate-200/80"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold text-slate-500">{tkt.ticketNo}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      tkt.priority === "High" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                      tkt.priority === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}>
                      {tkt.priority} Priority
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{tkt.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{tkt.description}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-xs space-y-1 font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Category:</span>
                    <span className="text-slate-900 font-sans font-medium">{tkt.category}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Flat Unit:</span>
                    <span className="text-slate-900">{tkt.unitNumber} ({tkt.residentName})</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Scheduled Visit:</span>
                    <span className="text-amber-800 font-bold">
                      {tkt.scheduledDate ? `${tkt.scheduledDate} at ${tkt.scheduledTime || 'TBD'}` : 'Not Scheduled'}
                    </span>
                  </div>
                  {tkt.assignedStaff && (
                    <div className="flex justify-between text-blue-700 pt-1 border-t border-slate-200/80">
                      <span>Assigned Staff:</span>
                      <span className="font-bold">{tkt.assignedStaff}</span>
                    </div>
                  )}
                </div>

                {/* Rating & Feedback Preview on Card if Resolved */}
                {tkt.status === "Resolved" && (
                  <div className="bg-amber-50/60 border border-amber-200/80 p-3 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-900 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{tkt.rating ? `${tkt.rating}/5 Service Rating` : "Unrated Resolution"}</span>
                      </div>
                      <button
                        onClick={() => handleOpenRatingModal(tkt)}
                        className="text-[11px] text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                      >
                        {tkt.rating ? "Edit Review" : "+ Rate Quality & Speed"}
                      </button>
                    </div>

                    {tkt.rating && (
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex items-center gap-3 text-slate-700 font-medium">
                          <span>Quality: <strong>{tkt.qualityRating || tkt.rating}/5</strong></span>
                          <span>Speed: <strong>{tkt.speedRating || tkt.rating}/5</strong></span>
                          <span>Courtesy: <strong>{tkt.staffRating || tkt.rating}/5</strong></span>
                        </div>

                        {tkt.feedbackComment && (
                          <p className="text-slate-600 italic bg-white/80 p-2 rounded-lg border border-amber-100">
                            &quot;{tkt.feedbackComment}&quot;
                          </p>
                        )}

                        {tkt.feedbackTags && tkt.feedbackTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {tkt.feedbackTags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md font-semibold text-[10px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {tkt.managementResponse && (
                          <div className="mt-1.5 p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 font-sans text-[11px] space-y-0.5">
                            <p className="font-bold flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-blue-600" />
                              <span>Facility Manager Response:</span>
                            </p>
                            <p className="text-slate-700">&quot;{tkt.managementResponse}&quot;</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Current Status</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full ${
                      tkt.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      tkt.status === "In Progress" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {tkt.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveTicketToSchedule(tkt);
                        setRescheduleDate(tkt.scheduledDate || "2026-08-12");
                        setRescheduleTime(tkt.scheduledTime || "11:00 AM");
                        setRescheduleType(tkt.serviceType || "Repair Visit");
                      }}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1"
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
                      <span>{tkt.scheduledDate ? 'Reschedule' : 'Set Date'}</span>
                    </button>

                    {currentUser.role === "admin" && (
                      <button
                        onClick={() => { setActiveTicketForStaff(tkt); setAssignedStaff(tkt.assignedStaff || ""); }}
                        className="flex-1 py-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-xl text-xs font-semibold transition"
                      >
                        Assign / Status
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* SERVICE RATINGS & CSAT DASHBOARD VIEW */}
      {viewMode === "reviews" && (
        <div className="space-y-6 animate-fade-in">

          {/* Detailed CSAT Scorecard Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Main CSAT Rating Gauge */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 p-6 rounded-2xl shadow-md space-y-3 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-4 -bottom-4 opacity-15">
                <Star className="w-32 h-32 fill-current" />
              </div>

              <div>
                <span className="px-2.5 py-1 bg-slate-950/20 text-slate-950 font-bold text-[10px] rounded-full uppercase tracking-wider">
                  Overall CSAT Score
                </span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-4xl font-extrabold font-mono">{avgOverallRating}</span>
                  <span className="text-sm font-semibold text-slate-900/80">/ 5.0</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-950/20">
                <div className="flex items-center gap-1 text-slate-950">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(Number(avgOverallRating)) ? "fill-slate-950 text-slate-950" : "text-amber-800/40"}`}
                    />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-950">
                  {csatPercentage}% Resident Satisfaction ({satisfiedCount}/{totalRatedCount} Positive Reviews)
                </p>
              </div>
            </div>

            {/* Sub-Metric 1: Speed & SLA Compliance */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Speed & SLA Score</span>
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold font-mono text-slate-900">{avgSpeedRating}</span>
                  <span className="text-xs text-slate-500">/ 5.0</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(Number(avgSpeedRating) / 5) * 100}%` }} />
                </div>
                <p className="text-[11px] text-slate-600 font-medium flex items-center justify-between">
                  <span>Target SLA: &lt; 24h</span>
                  <span className="text-blue-700 font-bold">Fast Turnaround</span>
                </p>
              </div>
            </div>

            {/* Sub-Metric 2: Workmanship Quality */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Workmanship Quality</span>
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold font-mono text-slate-900">{avgQualityRating}</span>
                  <span className="text-xs text-slate-500">/ 5.0</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(Number(avgQualityRating) / 5) * 100}%` }} />
                </div>
                <p className="text-[11px] text-slate-600 font-medium flex items-center justify-between">
                  <span>First-Fix Rate</span>
                  <span className="text-emerald-700 font-bold">94.2%</span>
                </p>
              </div>
            </div>

            {/* Sub-Metric 3: Staff Courtesy & Safety */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Staff Courtesy</span>
                  <UserCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold font-mono text-slate-900">{avgStaffRating}</span>
                  <span className="text-xs text-slate-500">/ 5.0</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${(Number(avgStaffRating) / 5) * 100}%` }} />
                </div>
                <p className="text-[11px] text-slate-600 font-medium flex items-center justify-between">
                  <span>Verified Badges</span>
                  <span className="text-purple-700 font-bold">100% ID Verified</span>
                </p>
              </div>
            </div>

          </div>

          {/* Technician & Vendor Performance Leaderboard */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Facility Staff & Service Vendor Ratings Leaderboard</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Track individual service partner scores across speed, quality of repair, and resident courtesy.
                </p>
              </div>
              <span className="text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-xl self-start">
                Updated Real-Time
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffLeaderboard.length === 0 ? (
                <div className="col-span-full py-8 text-center text-slate-500 text-xs">
                  No staff rating data available yet.
                </div>
              ) : (
                staffLeaderboard.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-3 hover:border-amber-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                          #{idx + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{item.staffName}</h4>
                          <p className="text-[11px] text-slate-500">{item.completedCount} ticket(s) completed</p>
                        </div>
                      </div>

                      <div className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-1 text-amber-900 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{item.avgOverall}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/60 font-mono">
                      <div>
                        <span className="text-slate-500 block">Speed Rating:</span>
                        <span className="font-bold text-blue-700">{item.avgSpeed} / 5.0</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Quality Rating:</span>
                        <span className="font-bold text-emerald-700">{item.avgQuality} / 5.0</span>
                      </div>
                    </div>

                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {Array.from(new Set(item.tags)).slice(0, 3).map((tag, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 bg-slate-200/80 text-slate-800 rounded-md text-[10px] font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Resident Feedback Feed & Reviews Search */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span>Resident Service Feedback & Reviews Feed</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Browse verified feedback submitted by residents after repair visits and management responses.
                </p>
              </div>

              {/* Review Category Filters */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
                {(["All", "5", "4", "Critical", "Reopened"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setReviewFilterRating(f)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                      reviewFilterRating === f
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {f === "All" && "All Reviews"}
                    {f === "5" && "5-Star Outstanding"}
                    {f === "4" && "4-Star Good"}
                    {f === "Critical" && "Critical (1-3 Stars)"}
                    {f === "Reopened" && "Reopened Requests"}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input for Reviews */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search reviews by flat, resident, technician, or keyword..."
                value={reviewSearch}
                onChange={e => setReviewSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>

            {/* Reviews Stream Cards */}
            <div className="space-y-4">
              {filteredReviewsList.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <Star className="w-8 h-8 mx-auto opacity-30 text-amber-500" />
                  <p>No feedback reviews found matching current filters.</p>
                </div>
              ) : (
                filteredReviewsList.map(reviewTkt => (
                  <div
                    key={reviewTkt.id}
                    className={`p-5 rounded-2xl border transition space-y-3 ${
                      reviewTkt.isReopenRequested
                        ? "bg-rose-50/50 border-rose-200"
                        : "bg-slate-50/60 border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                          {reviewTkt.unitNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{reviewTkt.residentName}</h4>
                            <span className="text-[11px] text-slate-500 font-mono">({reviewTkt.unitNumber})</span>
                          </div>
                          <p className="text-xs text-slate-600">
                            Ticket #{reviewTkt.ticketNo} • <strong>{reviewTkt.title}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {reviewTkt.isReopenRequested && (
                          <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Reopen Requested</span>
                          </span>
                        )}

                        <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                          <span>{reviewTkt.rating} / 5</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown Scores */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <span>Assigned Staff: <strong className="text-blue-700 font-sans">{reviewTkt.assignedStaff || "Facility Technician"}</strong></span>
                      <span>Quality: <strong className="text-slate-900">{reviewTkt.qualityRating || reviewTkt.rating}/5</strong></span>
                      <span>Speed: <strong className="text-slate-900">{reviewTkt.speedRating || reviewTkt.rating}/5</strong></span>
                      <span>Courtesy: <strong className="text-slate-900">{reviewTkt.staffRating || reviewTkt.rating}/5</strong></span>
                      {reviewTkt.feedbackDate && <span className="text-slate-400 font-normal">Date: {reviewTkt.feedbackDate}</span>}
                    </div>

                    {/* Comment text */}
                    {reviewTkt.feedbackComment && (
                      <p className="text-xs text-slate-800 leading-relaxed font-sans bg-white/90 p-3 rounded-xl border border-slate-200/60 italic">
                        &quot;{reviewTkt.feedbackComment}&quot;
                      </p>
                    )}

                    {/* Feedback Tags */}
                    {reviewTkt.feedbackTags && reviewTkt.feedbackTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {reviewTkt.feedbackTags.map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-amber-100/80 text-amber-900 rounded-lg text-xs font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Official Management Response */}
                    {reviewTkt.managementResponse ? (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1 mt-2">
                        <div className="flex items-center justify-between text-blue-900 font-bold">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            <span>Official Facility Management Response</span>
                          </span>
                          {reviewTkt.managementResponseDate && (
                            <span className="text-[10px] text-blue-700 font-mono font-normal">
                              {reviewTkt.managementResponseDate}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-800 leading-relaxed pl-5">&quot;{reviewTkt.managementResponse}&quot;</p>
                      </div>
                    ) : (
                      currentUser.role === "admin" && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleOpenResponseModal(reviewTkt)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Respond as Facility Manager</span>
                          </button>
                        </div>
                      )
                    )}

                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      )}

      {/* SCHEDULE / RESCHEDULE VISIT MODAL */}
      {activeTicketToSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 text-slate-900 shadow-xl relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-base">
                <CalendarDays className="w-5 h-5" />
                <h3>Schedule Repair Visit</h3>
              </div>
              <button onClick={() => setActiveTicketToSchedule(null)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1 font-mono">
              <p><strong className="text-slate-900 font-sans">Ticket #:</strong> {activeTicketToSchedule.ticketNo}</p>
              <p><strong className="text-slate-900 font-sans">Issue:</strong> {activeTicketToSchedule.title}</p>
              <p><strong className="text-slate-900 font-sans">Flat Unit:</strong> {activeTicketToSchedule.unitNumber} ({activeTicketToSchedule.residentName})</p>
            </div>

            <form onSubmit={handleSaveScheduleVisit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Scheduled Visit Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={e => setRescheduleDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Time Slot</label>
                  <select
                    value={rescheduleTime}
                    onChange={e => setRescheduleTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-medium"
                  >
                    <option value="09:00 AM">09:00 AM - 10:30 AM</option>
                    <option value="11:00 AM">11:00 AM - 12:30 PM</option>
                    <option value="02:00 PM">02:00 PM - 03:30 PM</option>
                    <option value="04:00 PM">04:00 PM - 05:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Service Visit Classification</label>
                <select
                  value={rescheduleType}
                  onChange={e => setRescheduleType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-medium"
                >
                  <option value="Repair Visit">Repair Visit</option>
                  <option value="Routine Maintenance">Routine Maintenance</option>
                  <option value="Inspection">Inspection & Diagnostics</option>
                  <option value="Vendor AMC">Vendor Annual Service (AMC)</option>
                  <option value="Emergency Callout">Emergency Callout</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition mt-2 cursor-pointer"
              >
                Confirm Visit Slot on Calendar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RAISE NEW TICKET & SCHEDULE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl text-slate-900 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Log & Schedule Maintenance Ticket</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Complaint Title</label>
                <input
                  type="text"
                  placeholder="e.g. Water leakage in balcony drain..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-600 font-semibold">Problem Description</label>
                  <button
                    type="button"
                    onClick={handleAiAnalyzeTicket}
                    disabled={isAnalyzingAi || !description}
                    className="text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    {isAnalyzingAi ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    <span>AI Priority Auto-Detect</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="Describe issue location and details..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-medium"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Elevator">Elevator</option>
                    <option value="Civil/Pest">Civil / Pest Control</option>
                    <option value="Security">Security & Gate</option>
                    <option value="General Maintenance">General Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Priority Level</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-medium"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority (Urgent)</option>
                  </select>
                </div>
              </div>

              {/* Preferred Visit Scheduling */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                <p className="font-semibold text-slate-800 text-[11px] flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
                  <span>Preferred Visit Date & Time Slot</span>
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-900 focus:outline-none text-xs font-medium"
                  />
                  <select
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    className="bg-white border border-slate-200 text-slate-900 rounded-xl px-2.5 py-1.5 focus:outline-none text-xs font-medium"
                  >
                    <option value="09:00 AM">09:00 AM - 10:30 AM</option>
                    <option value="11:00 AM">11:00 AM - 12:30 PM</option>
                    <option value="02:00 PM">02:00 PM - 03:30 PM</option>
                    <option value="04:00 PM">04:00 PM - 05:30 PM</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition mt-2 cursor-pointer"
              >
                Submit & Reserve Visit Slot
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Admin Assign Staff Modal */}
      {activeTicketForStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-xl text-slate-900 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Update Ticket #{activeTicketForStaff.ticketNo}</h3>
              <button onClick={() => setActiveTicketForStaff(null)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStaffAssignment} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Assign Technician / Service Vendor</label>
                <input
                  type="text"
                  placeholder="e.g. Mario PlumbWorks Co. or Staff John"
                  value={assignedStaff}
                  onChange={e => setAssignedStaff(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Resolution Notes / Status Update</label>
                <textarea
                  rows={2}
                  placeholder="Optional resolution details..."
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    updateTicketStatus(activeTicketForStaff.id, "Resolved", assignedStaff, resolutionNotes);
                    setActiveTicketForStaff(null);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition text-xs cursor-pointer"
                >
                  Mark as Resolved
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition text-xs cursor-pointer"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENHANCED RESIDENT RATING & FEEDBACK LOOP MODAL */}
      {activeTicketForRating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-900 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900">
                  Rate Service Quality & Speed
                </h3>
              </div>
              <button onClick={() => setActiveTicketForRating(null)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ticket Summary Header */}
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-xs space-y-1 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Ticket Number:</span>
                <span className="font-bold text-slate-900">{activeTicketForRating.ticketNo}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Complaint Title:</span>
                <span className="font-bold text-slate-900">{activeTicketForRating.title}</span>
              </div>
              {activeTicketForRating.assignedStaff && (
                <div className="flex justify-between text-blue-700">
                  <span>Assigned Technician / Vendor:</span>
                  <span className="font-bold">{activeTicketForRating.assignedStaff}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveRatingSubmit} className="space-y-4 text-xs">
              
              {/* 1. Overall Satisfaction Rating */}
              <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-xl text-center space-y-2">
                <label className="text-amber-950 font-bold block text-sm">
                  Overall Service Satisfaction
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingVal(star)}
                      className="p-1 hover:scale-125 transition cursor-pointer"
                    >
                      <Star className={`w-8 h-8 ${star <= ratingVal ? "fill-amber-500 text-amber-500" : "text-slate-300"}`} />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-semibold text-amber-900 font-mono">
                  {ratingVal === 5 && "⭐ Outstanding Service"}
                  {ratingVal === 4 && "👍 Good Quality"}
                  {ratingVal === 3 && "😐 Average Experience"}
                  {ratingVal === 2 && "👎 Below Expectation"}
                  {ratingVal === 1 && "⚠️ Unsatisfactory Repair"}
                </p>
              </div>

              {/* 2. Detailed Rating Criteria */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                
                {/* Quality */}
                <div className="space-y-1 text-center">
                  <span className="font-semibold text-slate-700 block">Workmanship Quality</span>
                  <div className="flex justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setQualityRatingVal(s)} className="p-0.5 cursor-pointer">
                        <Star className={`w-4 h-4 ${s <= qualityRatingVal ? "fill-emerald-500 text-emerald-500" : "text-slate-300"}`} />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{qualityRatingVal}/5 Stars</span>
                </div>

                {/* Speed */}
                <div className="space-y-1 text-center">
                  <span className="font-semibold text-slate-700 block">Speed & Punctuality</span>
                  <div className="flex justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setSpeedRatingVal(s)} className="p-0.5 cursor-pointer">
                        <Star className={`w-4 h-4 ${s <= speedRatingVal ? "fill-blue-500 text-blue-500" : "text-slate-300"}`} />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{speedRatingVal}/5 Stars</span>
                </div>

                {/* Staff Courtesy */}
                <div className="space-y-1 text-center">
                  <span className="font-semibold text-slate-700 block">Technician Courtesy</span>
                  <div className="flex justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setStaffRatingVal(s)} className="p-0.5 cursor-pointer">
                        <Star className={`w-4 h-4 ${s <= staffRatingVal ? "fill-purple-500 text-purple-500" : "text-slate-300"}`} />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{staffRatingVal}/5 Stars</span>
                </div>

              </div>

              {/* 3. Preset Feedback Badges / Tags */}
              <div>
                <label className="text-slate-700 block mb-1.5 font-semibold">
                  Quick Feedback Badges (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTagOptions.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTagSelection(tag)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Resident Comment Text */}
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">
                  Detailed Comments & Suggestions
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us more about technician behavior, punctuality, cleanliness after fix..."
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                />
              </div>

              {/* 5. Reopen Ticket Checkbox if unsatisfied */}
              <div className="bg-rose-50 border border-rose-200/80 p-3 rounded-xl flex items-start gap-2">
                <input
                  type="checkbox"
                  id="chk-reopen"
                  checked={reopenRequested}
                  onChange={e => setReopenRequested(e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="chk-reopen" className="text-xs text-rose-950 font-medium cursor-pointer">
                  <strong className="block text-rose-900">Issue Not Fully Resolved?</strong>
                  Check this box to flag the ticket for re-inspection by Facility Manager.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition mt-2 cursor-pointer flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Submit Service Review & Ratings</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* FACILITY MANAGER RESPONSE MODAL */}
      {activeTicketForResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-xl text-slate-900 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span>Facility Manager Response</span>
              </h3>
              <button onClick={() => setActiveTicketForResponse(null)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1 font-mono">
              <p><strong className="text-slate-900 font-sans">Resident:</strong> {activeTicketForResponse.residentName} ({activeTicketForResponse.unitNumber})</p>
              <p><strong className="text-slate-900 font-sans">Ticket:</strong> #{activeTicketForResponse.ticketNo} ({activeTicketForResponse.title})</p>
              <p><strong className="text-slate-900 font-sans">Resident Rating:</strong> {activeTicketForResponse.rating}/5 Stars</p>
            </div>

            <form onSubmit={handleSaveManagementResponseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Official Response Message</label>
                <textarea
                  rows={4}
                  placeholder="Acknowledge resident feedback, share resolution follow-up steps, or thank them..."
                  value={managementReplyText}
                  onChange={e => setManagementReplyText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition text-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Management Response</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
