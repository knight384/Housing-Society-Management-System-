import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  UserRole,
  DuesBill,
  PaymentTransaction,
  Amenity,
  AmenityBooking,
  NoticePost,
  CommunityPoll,
  VisitorPass,
  MaintenanceTicket,
  FinancialLedgerItem,
  ServiceVendor,
  PushNotification,
  AuditLog,
  GdprConsent,
  DocumentItem,
  SocietyEvent,
  VerifiedService,
  VerifiedServiceReview,
  FamilyMember,
  PetProfile,
  NotificationChannelPreferences,
  Vehicle
} from "../types";
import {
  initialProfiles,
  initialBills,
  initialTransactions,
  initialAmenities,
  initialBookings,
  initialNotices,
  initialPolls,
  initialVisitors,
  initialTickets,
  initialFinancialLedger,
  initialVendors,
  initialNotifications,
  initialAuditLogs,
  initialGdprConsent,
  initialDocuments,
  initialSocietyEvents,
  initialVerifiedServices
} from "../data/initialData";

interface SocietyContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  isMobileView: boolean;
  setIsMobileView: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Data State
  profiles: UserProfile[];
  bills: DuesBill[];
  transactions: PaymentTransaction[];
  amenities: Amenity[];
  bookings: AmenityBooking[];
  notices: NoticePost[];
  polls: CommunityPoll[];
  visitors: VisitorPass[];
  tickets: MaintenanceTicket[];
  financials: FinancialLedgerItem[];
  vendors: ServiceVendor[];
  notifications: PushNotification[];
  auditLogs: AuditLog[];
  gdprConsent: GdprConsent;
  documents: DocumentItem[];
  societyEvents: SocietyEvent[];
  verifiedServices: VerifiedService[];

  // Actions
  payBill: (billId: string, method: PaymentTransaction['method']) => Promise<{ success: boolean; receiptId: string }>;
  sendLateFeeReminder: (billId: string) => void;
  createBooking: (amenityId: string, date: string, timeSlot: string) => { success: boolean; message: string; bookingId?: string };
  cancelBooking: (bookingId: string) => void;
  addNotice: (title: string, content: string, summary: string, category: NoticePost['category'], isPinned: boolean) => void;
  likeNotice: (noticeId: string) => void;
  votePoll: (pollId: string, optionId: string) => void;
  createVisitorPass: (data: Omit<VisitorPass, 'id' | 'passCode' | 'qrCodeData' | 'status' | 'hostResidentName'>) => VisitorPass;
  checkInVisitor: (passIdOrCode: string) => { success: boolean; message: string };
  checkOutVisitor: (passIdOrCode: string) => { success: boolean; message: string };
  denyVisitor: (passIdOrCode: string) => { success: boolean; message: string };
  createTicket: (data: Omit<MaintenanceTicket, 'id' | 'ticketNo' | 'residentName' | 'status' | 'createdAt'>) => MaintenanceTicket;
  updateTicketStatus: (ticketId: string, status: MaintenanceTicket['status'], assignedStaff?: string, notes?: string) => void;
  scheduleTicketVisit: (ticketId: string, scheduledDate: string, scheduledTime: string, serviceType?: MaintenanceTicket['serviceType']) => void;
  rateTicket: (
    ticketId: string,
    rating: number,
    feedback: string,
    qualityRating?: number,
    speedRating?: number,
    staffRating?: number,
    feedbackTags?: string[],
    isReopenRequested?: boolean
  ) => void;
  addManagementResponse: (ticketId: string, responseText: string) => void;
  addLedgerEntry: (item: Omit<FinancialLedgerItem, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  triggerPushNotification: (title: string, body: string, type: PushNotification['type']) => void;
  updateGdprConsent: (newConsent: Partial<GdprConsent>) => void;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate' | 'downloadCount' | 'uploadedBy' | 'uploadedByRole'>) => DocumentItem;
  deleteDocument: (id: string) => void;
  incrementDocumentDownload: (id: string) => void;
  updateDocumentSignatureStatus: (docId: string, status: 'Approved & Sealed' | 'Rejected', reviewNotes?: string) => void;
  addSocietyEvent: (event: Omit<SocietyEvent, 'id' | 'rsvpCount' | 'rsvpedBy'>) => SocietyEvent;
  toggleEventRsvp: (eventId: string) => void;
  deleteSocietyEvent: (id: string) => void;

  addVerifiedService: (service: Omit<VerifiedService, 'id' | 'rating' | 'reviewCount' | 'reviews' | 'verificationDate'>) => VerifiedService;
  addServiceReview: (serviceId: string, rating: number, comment: string) => void;
  toggleServiceVerification: (serviceId: string) => void;
  deleteVerifiedService: (id: string) => void;
  
  // Resident Profile Management
  updateUserProfile: (updatedData: Partial<UserProfile>) => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => FamilyMember;
  updateFamilyMember: (id: string, updatedData: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;
  addPet: (pet: Omit<PetProfile, 'id'>) => PetProfile;
  updatePet: (id: string, updatedData: Partial<PetProfile>) => void;
  deletePet: (id: string) => void;
  updateNotificationPreferences: (preferences: NotificationChannelPreferences) => void;
  addVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (regNo: string) => void;

  // Backup & Storage
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
  resetToInitialData: () => void;
  logAuditAction: (category: AuditLog['actionCategory'], details: string) => void;
}

const SocietyContext = createContext<SocietyContextType | undefined>(undefined);

export const SocietyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage
  const loadStoredData = <T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(`societyhub_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [profiles, setProfiles] = useState<UserProfile[]>(() => loadStoredData("profiles", initialProfiles));
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedRole = localStorage.getItem("societyhub_activeRole");
    const loadedProfiles = loadStoredData("profiles", initialProfiles);
    if (savedRole === "admin") return loadedProfiles.find(p => p.role === "admin") || loadedProfiles[1];
    if (savedRole === "security") return loadedProfiles.find(p => p.role === "security") || loadedProfiles[2];
    return loadedProfiles.find(p => p.role === "resident") || loadedProfiles[0];
  });

  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  const [bills, setBills] = useState<DuesBill[]>(() => loadStoredData("bills", initialBills));
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => loadStoredData("transactions", initialTransactions));
  const [amenities] = useState<Amenity[]>(initialAmenities);
  const [bookings, setBookings] = useState<AmenityBooking[]>(() => loadStoredData("bookings", initialBookings));
  const [notices, setNotices] = useState<NoticePost[]>(() => loadStoredData("notices", initialNotices));
  const [polls, setPolls] = useState<CommunityPoll[]>(() => loadStoredData("polls", initialPolls));
  const [visitors, setVisitors] = useState<VisitorPass[]>(() => loadStoredData("visitors", initialVisitors));
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => loadStoredData("tickets", initialTickets));
  const [financials, setFinancials] = useState<FinancialLedgerItem[]>(() => loadStoredData("financials", initialFinancialLedger));
  const [vendors] = useState<ServiceVendor[]>(initialVendors);
  const [notifications, setNotifications] = useState<PushNotification[]>(() => loadStoredData("notifications", initialNotifications));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStoredData("auditLogs", initialAuditLogs));
  const [gdprConsent, setGdprConsent] = useState<GdprConsent>(() => loadStoredData("gdprConsent", initialGdprConsent));
  const [documents, setDocuments] = useState<DocumentItem[]>(() => loadStoredData("documents", initialDocuments));
  const [societyEvents, setSocietyEvents] = useState<SocietyEvent[]>(() => loadStoredData("societyEvents", initialSocietyEvents));
  const [verifiedServices, setVerifiedServices] = useState<VerifiedService[]>(() => loadStoredData("verifiedServices", initialVerifiedServices));

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("societyhub_bills", JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem("societyhub_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("societyhub_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("societyhub_notices", JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem("societyhub_polls", JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem("societyhub_visitors", JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem("societyhub_tickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem("societyhub_financials", JSON.stringify(financials));
  }, [financials]);

  useEffect(() => {
    localStorage.setItem("societyhub_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("societyhub_auditLogs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem("societyhub_gdprConsent", JSON.stringify(gdprConsent));
  }, [gdprConsent]);

  useEffect(() => {
    localStorage.setItem("societyhub_documents", JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem("societyhub_societyEvents", JSON.stringify(societyEvents));
  }, [societyEvents]);

  useEffect(() => {
    localStorage.setItem("societyhub_verifiedServices", JSON.stringify(verifiedServices));
  }, [verifiedServices]);

  useEffect(() => {
    localStorage.setItem("societyhub_profiles", JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem("societyhub_currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (role: UserRole) => {
    const targetUser = profiles.find(p => p.role === role) || profiles[0];
    setCurrentUser(targetUser);
    localStorage.setItem("societyhub_activeRole", role);
    logAuditAction("Security", `Switched active user profile to ${targetUser.name} (${role})`);
  };

  const logAuditAction = (category: AuditLog['actionCategory'], details: string) => {
    const newLog: AuditLog = {
      id: "audit-" + Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actionCategory: category,
      details,
      ipAddress: "127.0.0.1 (Local App Session)"
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const triggerPushNotification = (title: string, body: string, type: PushNotification['type']) => {
    const newNotif: PushNotification = {
      id: "notif-" + Date.now(),
      title,
      body,
      type,
      timestamp: "Just now",
      isRead: false,
      unitNumber: currentUser.unitNumber
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 1. Pay Bill Function
  const payBill = async (billId: string, method: PaymentTransaction['method']) => {
    const receiptId = "REC-" + Math.floor(100000 + Math.random() * 900000);
    const targetBill = bills.find(b => b.id === billId);

    if (!targetBill) {
      return { success: false, receiptId: "" };
    }

    // Simulate gateway delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const updatedBills = bills.map(b => {
      if (b.id === billId) {
        return {
          ...b,
          status: "Paid" as const,
          paidDate: new Date().toISOString().split("T")[0],
          paymentMethod: method,
          receiptId
        };
      }
      return b;
    });

    const newTx: PaymentTransaction = {
      id: "tx-" + Date.now(),
      billId,
      unitNumber: targetBill.unitNumber,
      residentName: targetBill.residentName,
      amount: targetBill.totalAmount,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      method,
      referenceNo: `PAY-${method.substring(0, 3).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: "Success"
    };

    // Add to financial ledger
    const newLedger: FinancialLedgerItem = {
      id: "led-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      description: `Dues Payment by ${targetBill.residentName} (${targetBill.unitNumber}) - ${targetBill.monthYear}`,
      type: "Income",
      category: "Maintenance Fees",
      amount: targetBill.totalAmount,
      referenceDoc: receiptId
    };

    setBills(updatedBills);
    setTransactions(prev => [newTx, ...prev]);
    setFinancials(prev => [newLedger, ...prev]);

    triggerPushNotification(
      "✅ Maintenance Bill Paid Successfully",
      `Payment of $${targetBill.totalAmount} for ${targetBill.monthYear} processed via ${method}. Receipt ID: ${receiptId}.`,
      "Billing"
    );

    logAuditAction("Financial", `Processed bill payment $${targetBill.totalAmount} for ${targetBill.unitNumber} (${method})`);

    return { success: true, receiptId };
  };

  // 2. Late Fee Reminder
  const sendLateFeeReminder = (billId: string) => {
    const targetBill = bills.find(b => b.id === billId);
    if (!targetBill) return;

    triggerPushNotification(
      "⚠️ Urgent: Overdue Maintenance Dues Notice",
      `Automated Reminder for Flat ${targetBill.unitNumber}: Bill ${targetBill.billNumber} of $${targetBill.totalAmount} is overdue with $${targetBill.breakdown.lateFee} late charges. Please settle immediately.`,
      "Urgent"
    );

    logAuditAction("Admin Rule Change", `Dispatched automated late fee reminder to Flat ${targetBill.unitNumber}`);
  };

  // 3. Create Amenity Booking
  const createBooking = (amenityId: string, date: string, timeSlot: string) => {
    const amenity = amenities.find(a => a.id === amenityId);
    if (!amenity) return { success: false, message: "Amenity not found" };

    // Conflict check
    const existing = bookings.find(b => b.amenityId === amenityId && b.date === date && b.timeSlot === timeSlot && b.status !== "Cancelled");
    if (existing) {
      return { success: false, message: "Selected time slot is already reserved by another resident." };
    }

    const totalPaid = amenity.pricePerHour * 2 + (amenity.requiresDeposit ? amenity.depositAmount : 0);
    const passCode = `${amenity.name.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}-${currentUser.unitNumber}`;

    const newBooking: AmenityBooking = {
      id: "bk-" + Date.now(),
      amenityId,
      amenityName: amenity.name,
      unitNumber: currentUser.unitNumber,
      residentName: currentUser.name,
      date,
      timeSlot,
      totalPaid,
      status: "Confirmed",
      qrPassCode: passCode,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    setBookings(prev => [newBooking, ...prev]);

    triggerPushNotification(
      "🎟️ Amenity Booking Confirmed",
      `Your reservation for ${amenity.name} on ${date} (${timeSlot}) is confirmed. Pass Code: ${passCode}.`,
      "Booking"
    );

    logAuditAction("Security", `Booked amenity ${amenity.name} for ${date} (${timeSlot})`);

    return { success: true, message: "Booking confirmed successfully!", bookingId: newBooking.id };
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "Cancelled" as const } : b));
    triggerPushNotification("Booking Cancelled", "Your amenity booking has been cancelled and refunded.", "Booking");
  };

  // 4. Notice Board
  const addNotice = (title: string, content: string, summary: string, category: NoticePost['category'], isPinned: boolean) => {
    const newNotice: NoticePost = {
      id: "notice-" + Date.now(),
      title,
      content,
      summary,
      category,
      author: currentUser.role === "admin" ? "RWA Executive Board" : currentUser.name,
      date: new Date().toISOString().split("T")[0],
      isPinned,
      likesCount: 0,
      likedBy: [],
      commentsCount: 0
    };

    setNotices(prev => [newNotice, ...prev]);

    triggerPushNotification(
      `📢 New Society Notice: ${title}`,
      summary || content.substring(0, 80) + "...",
      "Notice"
    );

    logAuditAction("Admin Rule Change", `Published new notice: "${title}"`);
  };

  const likeNotice = (noticeId: string) => {
    setNotices(prev => prev.map(n => {
      if (n.id === noticeId) {
        const hasLiked = n.likedBy.includes(currentUser.unitNumber);
        return {
          ...n,
          likesCount: hasLiked ? n.likesCount - 1 : n.likesCount + 1,
          likedBy: hasLiked ? n.likedBy.filter(u => u !== currentUser.unitNumber) : [...n.likedBy, currentUser.unitNumber]
        };
      }
      return n;
    }));
  };

  // 5. Poll Voting
  const votePoll = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(p => {
      if (p.id === pollId) {
        // Remove previous vote if any
        const updatedOptions = p.options.map(opt => {
          const wasVoted = opt.votedBy.includes(currentUser.unitNumber);
          const isTarget = opt.id === optionId;
          
          if (isTarget && !wasVoted) {
            return { ...opt, votesCount: opt.votesCount + 1, votedBy: [...opt.votedBy, currentUser.unitNumber] };
          } else if (!isTarget && wasVoted) {
            return { ...opt, votesCount: opt.votesCount - 1, votedBy: opt.votedBy.filter(u => u !== currentUser.unitNumber) };
          }
          return opt;
        });

        const newTotal = updatedOptions.reduce((acc, curr) => acc + curr.votesCount, 0);

        return {
          ...p,
          options: updatedOptions,
          totalVotes: newTotal
        };
      }
      return p;
    }));

    logAuditAction("Security", `Cast vote on community poll ${pollId}`);
  };

  // 6. Visitor Management
  const createVisitorPass = (data: Omit<VisitorPass, 'id' | 'passCode' | 'qrCodeData' | 'status' | 'hostResidentName'>) => {
    const codePrefix = data.visitorType === "Delivery" ? "DEL" : data.visitorType === "Cab" ? "CAB" : "GST";
    const passCode = `${codePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPass: VisitorPass = {
      ...data,
      id: "vis-" + Date.now(),
      hostResidentName: currentUser.name,
      unitNumber: currentUser.unitNumber,
      passCode,
      qrCodeData: `QR-${passCode}-${data.unitNumber}`,
      status: "Pre-Approved"
    };

    setVisitors(prev => [newPass, ...prev]);

    triggerPushNotification(
      "🎫 Gate Entry Pass Created",
      `Digital Pass ${passCode} generated for ${data.visitorName}. Share code with your visitor.`,
      "Visitor"
    );

    logAuditAction("Visitor Gate", `Created pre-approved gate pass ${passCode} for ${data.visitorName}`);

    return newPass;
  };

  const checkInVisitor = (passIdOrCode: string) => {
    const target = visitors.find(v => v.id === passIdOrCode || v.passCode === passIdOrCode);
    if (!target) return { success: false, message: "Invalid pass code or ID." };

    const timeStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    setVisitors(prev => prev.map(v => v.id === target.id ? {
      ...v,
      status: "Checked-In" as const,
      checkInTime: timeStr,
      gateGuardName: currentUser.role === "security" ? currentUser.name : "Main Gate Security"
    } : v));

    triggerPushNotification(
      "🚪 Visitor Checked-In at Main Gate",
      `${target.visitorName} (${target.visitorType}) has been verified and granted entry to Flat ${target.unitNumber}.`,
      "Visitor"
    );

    logAuditAction("Visitor Gate", `Checked in visitor ${target.visitorName} for Flat ${target.unitNumber}`);

    return { success: true, message: `Checked in ${target.visitorName} successfully!` };
  };

  const checkOutVisitor = (passIdOrCode: string) => {
    const target = visitors.find(v => v.id === passIdOrCode || v.passCode === passIdOrCode);
    if (!target) return { success: false, message: "Visitor pass not found." };

    const timeStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    setVisitors(prev => prev.map(v => v.id === target.id ? {
      ...v,
      status: "Checked-Out" as const,
      checkOutTime: timeStr
    } : v));

    triggerPushNotification(
      "👋 Visitor Departed",
      `${target.visitorName} has checked out through Gate 1.`,
      "Visitor"
    );

    logAuditAction("Visitor Gate", `Checked out visitor ${target.visitorName} from Flat ${target.unitNumber}`);

    return { success: true, message: `Checked out ${target.visitorName} successfully!` };
  };

  const denyVisitor = (passIdOrCode: string) => {
    const target = visitors.find(v => v.id === passIdOrCode || v.passCode === passIdOrCode);
    if (!target) return { success: false, message: "Visitor pass not found." };

    setVisitors(prev => prev.map(v => v.id === target.id ? { ...v, status: "Denied" as const } : v));

    triggerPushNotification(
      "🚨 Entry Denied at Gate",
      `Security denied entry for ${target.visitorName} at Gate 1.`,
      "Visitor"
    );

    logAuditAction("Visitor Gate", `Denied entry for visitor ${target.visitorName} at Main Gate`);

    return { success: true, message: `Entry denied for ${target.visitorName}.` };
  };

  // 7. Maintenance Tickets
  const createTicket = (data: Omit<MaintenanceTicket, 'id' | 'ticketNo' | 'residentName' | 'status' | 'createdAt'>) => {
    const ticketNo = "TKT-" + new Date().getFullYear() + "-" + Math.floor(100 + Math.random() * 900);

    const newTicket: MaintenanceTicket = {
      ...data,
      id: "tkt-" + Date.now(),
      ticketNo,
      unitNumber: currentUser.unitNumber,
      residentName: currentUser.name,
      status: "Open",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    setTickets(prev => [newTicket, ...prev]);

    triggerPushNotification(
      "🛠️ Maintenance Request Raised",
      `Ticket ${ticketNo}: "${data.title}" raised. RWA Helpdesk will assign technician shortly.`,
      "Ticket"
    );

    logAuditAction("Security", `Raised maintenance ticket ${ticketNo} (${data.category})`);

    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: MaintenanceTicket['status'], assignedStaff?: string, notes?: string) => {
    const resolvedAtStr = status === "Resolved" ? new Date().toISOString().replace("T", " ").substring(0, 16) : undefined;
    
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status,
          assignedStaff: assignedStaff !== undefined ? assignedStaff : t.assignedStaff,
          resolutionNotes: notes !== undefined ? notes : t.resolutionNotes,
          resolvedAt: status === "Resolved" ? (t.resolvedAt || resolvedAtStr) : t.resolvedAt
        };
      }
      return t;
    }));

    triggerPushNotification(
      `🔧 Ticket Status Updated: ${status}`,
      `Your maintenance complaint status has been updated to "${status}".`,
      "Ticket"
    );

    logAuditAction("Admin Rule Change", `Updated ticket ${ticketId} status to ${status}`);
  };

  const scheduleTicketVisit = (ticketId: string, scheduledDate: string, scheduledTime: string, serviceType?: MaintenanceTicket['serviceType']) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          scheduledDate,
          scheduledTime,
          serviceType: serviceType || t.serviceType || "Repair Visit"
        };
      }
      return t;
    }));

    triggerPushNotification(
      "📅 Maintenance Visit Scheduled",
      `Service visit scheduled for ${scheduledDate} at ${scheduledTime}.`,
      "Ticket"
    );

    logAuditAction("Admin Rule Change", `Scheduled maintenance visit for ticket ${ticketId} on ${scheduledDate} at ${scheduledTime}`);
  };

  const rateTicket = (
    ticketId: string,
    rating: number,
    feedback: string,
    qualityRating?: number,
    speedRating?: number,
    staffRating?: number,
    feedbackTags?: string[],
    isReopenRequested?: boolean
  ) => {
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const nextStatus = isReopenRequested ? "In Progress" : t.status;
        return {
          ...t,
          rating,
          feedbackComment: feedback,
          qualityRating: qualityRating !== undefined ? qualityRating : rating,
          speedRating: speedRating !== undefined ? speedRating : rating,
          staffRating: staffRating !== undefined ? staffRating : rating,
          feedbackTags: feedbackTags || t.feedbackTags || [],
          feedbackDate: nowStr,
          isReopenRequested: Boolean(isReopenRequested),
          status: nextStatus
        };
      }
      return t;
    }));

    if (isReopenRequested) {
      triggerPushNotification(
        "⚠️ Maintenance Ticket Reopened",
        `Resident reported unsatisfactory service on ticket. Ticket reopened for inspection.`,
        "Ticket"
      );
    }

    logAuditAction("Security", `Submitted ${rating}-star review for ticket ${ticketId}`);
  };

  const addManagementResponse = (ticketId: string, responseText: string) => {
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          managementResponse: responseText,
          managementResponseDate: nowStr
        };
      }
      return t;
    }));

    triggerPushNotification(
      "💬 Facility Management Response",
      `Facility Manager responded to your service feedback.`,
      "Ticket"
    );

    logAuditAction("Admin Rule Change", `Posted facility management response on ticket ${ticketId}`);
  };

  // 8. Financial Ledger
  const addLedgerEntry = (item: Omit<FinancialLedgerItem, 'id'>) => {
    const newItem: FinancialLedgerItem = {
      ...item,
      id: "led-" + Date.now()
    };
    setFinancials(prev => [newItem, ...prev]);
    logAuditAction("Financial", `Added ${item.type} ledger entry: ${item.description} ($${item.amount})`);
  };

  // 9. Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // 10. GDPR Consent
  const updateGdprConsent = (newConsent: Partial<GdprConsent>) => {
    setGdprConsent(prev => ({
      ...prev,
      ...newConsent,
      lastUpdated: new Date().toISOString().split("T")[0]
    }));
    logAuditAction("GDPR Data Export", "Updated user GDPR data privacy consent preferences");
  };

  // 11. Document Locker Actions
  const addDocument = (docData: Omit<DocumentItem, 'id' | 'uploadDate' | 'downloadCount' | 'uploadedBy' | 'uploadedByRole'>): DocumentItem => {
    const newDoc: DocumentItem = {
      ...docData,
      id: "doc-" + Date.now(),
      uploadDate: new Date().toISOString().split("T")[0],
      downloadCount: 0,
      uploadedBy: currentUser.name,
      uploadedByRole: currentUser.role === 'admin' ? 'admin' : 'resident'
    };
    setDocuments(prev => [newDoc, ...prev]);
    logAuditAction("Admin Rule Change", `Uploaded new document to Document Locker: "${newDoc.title}" (${newDoc.category})`);
    triggerPushNotification(
      `📁 Document Uploaded: ${newDoc.title}`,
      `${currentUser.name} uploaded a document under ${newDoc.category}.`,
      "Notice"
    );
    return newDoc;
  };

  const deleteDocument = (id: string) => {
    const target = documents.find(d => d.id === id);
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (target) {
      logAuditAction("Admin Rule Change", `Deleted document from Locker: "${target.title}"`);
    }
  };

  const incrementDocumentDownload = (id: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, downloadCount: d.downloadCount + 1 };
      }
      return d;
    }));
    const doc = documents.find(d => d.id === id);
    if (doc) {
      logAuditAction("GDPR Data Export", `Downloaded document "${doc.title}" from Document Locker`);
    }
  };

  const updateDocumentSignatureStatus = (
    docId: string,
    status: 'Approved & Sealed' | 'Rejected',
    reviewNotes?: string
  ) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId && d.eSignatureData) {
        return {
          ...d,
          certifiedSeal: status === 'Approved & Sealed' ? true : d.certifiedSeal,
          eSignatureData: {
            ...d.eSignatureData,
            status,
            reviewedBy: currentUser.name,
            reviewedAt: new Date().toISOString().split("T")[0],
            reviewNotes: reviewNotes || (status === 'Approved & Sealed' ? "Approved by Society Administration" : "Requires revision")
          }
        };
      }
      return d;
    }));

    const targetDoc = documents.find(d => d.id === docId);
    if (targetDoc) {
      triggerPushNotification(
        `✍️ E-Sign Application ${status}`,
        `Your submission "${targetDoc.title}" status is now "${status}".`,
        "Notice"
      );
      logAuditAction("Admin Rule Change", `Updated e-signature status for "${targetDoc.title}" to ${status}`);
    }
  };

  // 12. Society Calendar Actions
  const addSocietyEvent = (eventData: Omit<SocietyEvent, 'id' | 'rsvpCount' | 'rsvpedBy'>): SocietyEvent => {
    const newEvent: SocietyEvent = {
      ...eventData,
      id: "evt-" + Date.now(),
      rsvpCount: 1,
      rsvpedBy: [currentUser.unitNumber]
    };
    setSocietyEvents(prev => [newEvent, ...prev]);
    logAuditAction("Admin Rule Change", `Scheduled society event: "${newEvent.title}" on ${newEvent.date}`);
    triggerPushNotification(
      `📅 New Event Scheduled: ${newEvent.title}`,
      `Scheduled for ${newEvent.date} (${newEvent.startTime} - ${newEvent.endTime}) at ${newEvent.location}.`,
      "Notice"
    );
    return newEvent;
  };

  const toggleEventRsvp = (eventId: string) => {
    setSocietyEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const hasRsvped = e.rsvpedBy.includes(currentUser.unitNumber);
        const newRsvpedBy = hasRsvped
          ? e.rsvpedBy.filter(u => u !== currentUser.unitNumber)
          : [...e.rsvpedBy, currentUser.unitNumber];
        return {
          ...e,
          rsvpCount: newRsvpedBy.length,
          rsvpedBy: newRsvpedBy
        };
      }
      return e;
    }));
  };

  const deleteSocietyEvent = (id: string) => {
    const target = societyEvents.find(e => e.id === id);
    setSocietyEvents(prev => prev.filter(e => e.id !== id));
    if (target) {
      logAuditAction("Admin Rule Change", `Cancelled society event: "${target.title}"`);
    }
  };

  // 13. Verified Services Directory Handlers
  const addVerifiedService = (serviceData: Omit<VerifiedService, 'id' | 'rating' | 'reviewCount' | 'reviews' | 'verificationDate'>): VerifiedService => {
    const newService: VerifiedService = {
      ...serviceData,
      id: `vs-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      verificationDate: new Date().toISOString().split("T")[0],
      reviews: [
        {
          id: `rev-${Date.now()}`,
          residentName: currentUser.name,
          unitNumber: currentUser.unitNumber,
          rating: 5,
          comment: "Newly submitted local service provider recommendation.",
          date: new Date().toISOString().split("T")[0]
        }
      ]
    };

    setVerifiedServices(prev => [newService, ...prev]);
    logAuditAction("Admin Rule Change", `Added verified service provider: "${newService.name}" (${newService.category})`);
    triggerPushNotification("New Local Service Added", `"${newService.name}" is now listed in the Verified Services directory.`, "Notice");
    return newService;
  };

  const addServiceReview = (serviceId: string, rating: number, comment: string) => {
    setVerifiedServices(prev =>
      prev.map(s => {
        if (s.id === serviceId) {
          const newReview: VerifiedServiceReview = {
            id: `rev-${Date.now()}`,
            residentName: currentUser.name,
            unitNumber: currentUser.unitNumber,
            rating,
            comment,
            date: new Date().toISOString().split("T")[0]
          };

          const updatedReviews = [newReview, ...s.reviews];
          const avgRating = Number(
            (updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1)
          );

          return {
            ...s,
            rating: avgRating,
            reviewCount: updatedReviews.length,
            reviews: updatedReviews
          };
        }
        return s;
      })
    );
    triggerPushNotification("Service Review Posted", `Your review for service #${serviceId} has been posted.`, "Notice");
  };

  const toggleServiceVerification = (serviceId: string) => {
    setVerifiedServices(prev =>
      prev.map(s => (s.id === serviceId ? { ...s, isRwaVerified: !s.isRwaVerified } : s))
    );
    logAuditAction("Admin Rule Change", `Toggled RWA verification badge for service ID: ${serviceId}`);
  };

  const deleteVerifiedService = (id: string) => {
    const target = verifiedServices.find(s => s.id === id);
    setVerifiedServices(prev => prev.filter(s => s.id !== id));
    if (target) {
      logAuditAction("Admin Rule Change", `Removed service listing: "${target.name}"`);
    }
  };

  // 14. Resident Profile Management Handlers
  const updateUserProfile = (updatedData: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updatedData };
      setProfiles(pList => pList.map(p => (p.id === updated.id ? updated : p)));
      return updated;
    });
    logAuditAction("Security", `Updated profile contact details for unit ${currentUser.unitNumber}`);
  };

  const addFamilyMember = (memberData: Omit<FamilyMember, 'id'>): FamilyMember => {
    const newMember: FamilyMember = {
      ...memberData,
      id: `fm-${Date.now()}`
    };
    const currentMembers = currentUser.familyMembers || [];
    const updatedMembers = [...currentMembers, newMember];
    updateUserProfile({ familyMembers: updatedMembers });
    logAuditAction("Security", `Added family member ${newMember.name} (${newMember.relation}) to unit ${currentUser.unitNumber}`);
    triggerPushNotification("Family Member Added", `${newMember.name} has been added to unit ${currentUser.unitNumber} gate access list.`, "Notice");
    return newMember;
  };

  const updateFamilyMember = (id: string, updatedData: Partial<FamilyMember>) => {
    const currentMembers = currentUser.familyMembers || [];
    const updatedMembers = currentMembers.map(m => (m.id === id ? { ...m, ...updatedData } : m));
    updateUserProfile({ familyMembers: updatedMembers });
  };

  const deleteFamilyMember = (id: string) => {
    const currentMembers = currentUser.familyMembers || [];
    const target = currentMembers.find(m => m.id === id);
    const updatedMembers = currentMembers.filter(m => m.id !== id);
    updateUserProfile({ familyMembers: updatedMembers });
    if (target) {
      logAuditAction("Security", `Removed family member ${target.name} from unit ${currentUser.unitNumber}`);
      triggerPushNotification("Family Member Removed", `${target.name} was removed from unit ${currentUser.unitNumber}.`, "Notice");
    }
  };

  const addPet = (petData: Omit<PetProfile, 'id'>): PetProfile => {
    const newPet: PetProfile = {
      ...petData,
      id: `pet-${Date.now()}`
    };
    const currentPets = currentUser.pets || [];
    const updatedPets = [...currentPets, newPet];
    updateUserProfile({ pets: updatedPets });
    logAuditAction("Security", `Registered pet ${newPet.name} (${newPet.species}) under unit ${currentUser.unitNumber}`);
    triggerPushNotification("Pet Registered", `${newPet.name} (${newPet.species}) registered under unit ${currentUser.unitNumber}.`, "Notice");
    return newPet;
  };

  const updatePet = (id: string, updatedData: Partial<PetProfile>) => {
    const currentPets = currentUser.pets || [];
    const updatedPets = currentPets.map(p => (p.id === id ? { ...p, ...updatedData } : p));
    updateUserProfile({ pets: updatedPets });
  };

  const deletePet = (id: string) => {
    const currentPets = currentUser.pets || [];
    const target = currentPets.find(p => p.id === id);
    const updatedPets = currentPets.filter(p => p.id !== id);
    updateUserProfile({ pets: updatedPets });
    if (target) {
      logAuditAction("Security", `Removed pet record ${target.name} from unit ${currentUser.unitNumber}`);
    }
  };

  const updateNotificationPreferences = (preferences: NotificationChannelPreferences) => {
    updateUserProfile({ notificationPreferences: preferences });
    triggerPushNotification("Notification Delivery Preferences Saved", "Your notification channels and quiet hours settings have been saved.", "Notice");
  };

  const addVehicle = (vehicle: Vehicle) => {
    const currentVehicles = currentUser.vehicles || [];
    const updatedVehicles = [...currentVehicles, vehicle];
    updateUserProfile({ vehicles: updatedVehicles });
    logAuditAction("Security", `Registered vehicle ${vehicle.regNo} (${vehicle.type}) for unit ${currentUser.unitNumber}`);
    triggerPushNotification("Vehicle Registered", `Vehicle ${vehicle.regNo} registered for unit ${currentUser.unitNumber}.`, "Notice");
  };

  const deleteVehicle = (regNo: string) => {
    const currentVehicles = currentUser.vehicles || [];
    const updatedVehicles = currentVehicles.filter(v => v.regNo !== regNo);
    updateUserProfile({ vehicles: updatedVehicles });
    logAuditAction("Security", `Deregistered vehicle ${regNo} from unit ${currentUser.unitNumber}`);
  };

  // 14. Backup State functions
  const exportDataJSON = () => {
    const backupObj = {
      version: "1.0",
      app: "SocietyHub",
      exportedAt: new Date().toISOString(),
      currentUser,
      bills,
      transactions,
      bookings,
      notices,
      polls,
      visitors,
      tickets,
      financials,
      notifications,
      auditLogs,
      gdprConsent,
      documents,
      societyEvents,
      verifiedServices
    };
    logAuditAction("GDPR Data Export", "Exported complete cloud backup JSON archive");
    return JSON.stringify(backupObj, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.bills) setBills(parsed.bills);
      if (parsed.transactions) setTransactions(parsed.transactions);
      if (parsed.bookings) setBookings(parsed.bookings);
      if (parsed.notices) setNotices(parsed.notices);
      if (parsed.polls) setPolls(parsed.polls);
      if (parsed.visitors) setVisitors(parsed.visitors);
      if (parsed.tickets) setTickets(parsed.tickets);
      if (parsed.financials) setFinancials(parsed.financials);
      if (parsed.notifications) setNotifications(parsed.notifications);
      if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      if (parsed.gdprConsent) setGdprConsent(parsed.gdprConsent);
      if (parsed.documents) setDocuments(parsed.documents);
      if (parsed.societyEvents) setSocietyEvents(parsed.societyEvents);
      if (parsed.verifiedServices) setVerifiedServices(parsed.verifiedServices);
      
      logAuditAction("GDPR Data Export", "Successfully restored society state from JSON backup");
      triggerPushNotification("Cloud Backup Restored", "Data state restored successfully from backup file.", "Notice");
      return true;
    } catch {
      return false;
    }
  };

  const resetToInitialData = () => {
    setBills(initialBills);
    setTransactions(initialTransactions);
    setBookings(initialBookings);
    setNotices(initialNotices);
    setPolls(initialPolls);
    setVisitors(initialVisitors);
    setTickets(initialTickets);
    setFinancials(initialFinancialLedger);
    setNotifications(initialNotifications);
    setAuditLogs(initialAuditLogs);
    setGdprConsent(initialGdprConsent);
    setDocuments(initialDocuments);
    setSocietyEvents(initialSocietyEvents);
    setVerifiedServices(initialVerifiedServices);
    localStorage.clear();
    logAuditAction("GDPR Data Export", "Reset application database state to initial seed data");
    triggerPushNotification("System Reset", "Society database reset to initial state.", "Notice");
  };

  return (
    <SocietyContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        isMobileView,
        setIsMobileView,
        profiles,
        bills,
        transactions,
        amenities,
        bookings,
        notices,
        polls,
        visitors,
        tickets,
        financials,
        vendors,
        notifications,
        auditLogs,
        gdprConsent,
        documents,
        societyEvents,
        verifiedServices,

        payBill,
        sendLateFeeReminder,
        createBooking,
        cancelBooking,
        addNotice,
        likeNotice,
        votePoll,
        createVisitorPass,
        checkInVisitor,
        checkOutVisitor,
        denyVisitor,
        createTicket,
        updateTicketStatus,
        scheduleTicketVisit,
        rateTicket,
        addManagementResponse,
        addLedgerEntry,
        markNotificationRead,
        clearNotifications,
        triggerPushNotification,
        updateGdprConsent,
        addDocument,
        deleteDocument,
        incrementDocumentDownload,
        updateDocumentSignatureStatus,
        addSocietyEvent,
        toggleEventRsvp,
        deleteSocietyEvent,
        addVerifiedService,
        addServiceReview,
        toggleServiceVerification,
        deleteVerifiedService,

        updateUserProfile,
        addFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,
        addPet,
        updatePet,
        deletePet,
        updateNotificationPreferences,
        addVehicle,
        deleteVehicle,

        exportDataJSON,
        importDataJSON,
        resetToInitialData,
        logAuditAction
      }}
    >
      {children}
    </SocietyContext.Provider>
  );
};

export const useSociety = () => {
  const context = useContext(SocietyContext);
  if (!context) {
    throw new Error("useSociety must be used within a SocietyProvider");
  }
  return context;
};
