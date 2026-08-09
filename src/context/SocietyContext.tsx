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
  GdprConsent
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
  initialGdprConsent
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
  rateTicket: (ticketId: string, rating: number, feedback: string) => void;
  addLedgerEntry: (item: Omit<FinancialLedgerItem, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  triggerPushNotification: (title: string, body: string, type: PushNotification['type']) => void;
  updateGdprConsent: (newConsent: Partial<GdprConsent>) => void;
  
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

  const [profiles] = useState<UserProfile[]>(initialProfiles);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedRole = localStorage.getItem("societyhub_activeRole");
    if (savedRole === "admin") return initialProfiles[1];
    if (savedRole === "security") return initialProfiles[2];
    return initialProfiles[0];
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
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status,
          assignedStaff: assignedStaff !== undefined ? assignedStaff : t.assignedStaff,
          resolutionNotes: notes !== undefined ? notes : t.resolutionNotes
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

  const rateTicket = (ticketId: string, rating: number, feedback: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, rating, feedbackComment: feedback } : t));
    logAuditAction("Security", `Submitted ${rating}-star review for ticket ${ticketId}`);
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

  // 11. Backup State functions
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
      gdprConsent
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
        addLedgerEntry,
        markNotificationRead,
        clearNotifications,
        triggerPushNotification,
        updateGdprConsent,

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
