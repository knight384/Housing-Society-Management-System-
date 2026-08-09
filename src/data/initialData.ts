import {
  UserProfile,
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

export const initialProfiles: UserProfile[] = [
  {
    id: "user-res-1",
    name: "Alex Rivera",
    email: "alex.rivera@grandvista.org",
    phone: "+1 (555) 234-5678",
    role: "resident",
    unitNumber: "A-402",
    tower: "Tower A",
    flatType: "3BHK",
    ownerType: "Owner",
    moveInDate: "2023-04-15",
    emergencyContact: "+1 (555) 987-6543 (Sibling)",
    vehicles: [
      { type: "Car", regNo: "GV-402-A", slotNo: "B1-42" },
      { type: "Bike", regNo: "GV-402-B", slotNo: "B1-43" }
    ]
  },
  {
    id: "user-admin-1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@grandvista.org",
    phone: "+1 (555) 345-6789",
    role: "admin",
    unitNumber: "B-101",
    tower: "Tower B",
    flatType: "4BHK",
    ownerType: "Owner",
    moveInDate: "2021-01-10",
    emergencyContact: "+1 (555) 888-1234 (Spouse)",
    vehicles: [
      { type: "Car", regNo: "GV-101-B", slotNo: "B1-02" }
    ]
  },
  {
    id: "user-sec-1",
    name: "Officer Rajan Kumar",
    email: "gate.security@grandvista.org",
    phone: "+1 (555) 999-0000",
    role: "security",
    unitNumber: "Gate 1",
    tower: "Main Gate Security Desk",
    flatType: "2BHK",
    ownerType: "Tenant",
    moveInDate: "2022-06-01",
    emergencyContact: "+1 (555) 777-2222",
    vehicles: []
  }
];

export const initialBills: DuesBill[] = [
  {
    id: "bill-aug-2026-a402",
    billNumber: "INV-2026-08-402",
    unitNumber: "A-402",
    residentName: "Alex Rivera",
    monthYear: "August 2026",
    issuedDate: "2026-08-01",
    dueDate: "2026-08-15",
    status: "Pending",
    breakdown: {
      maintenance: 150,
      utilities: 38,
      clubhouse: 22,
      parking: 15,
      lateFee: 0
    },
    totalAmount: 225
  },
  {
    id: "bill-jul-2026-a402",
    billNumber: "INV-2026-07-402",
    unitNumber: "A-402",
    residentName: "Alex Rivera",
    monthYear: "July 2026",
    issuedDate: "2026-07-01",
    dueDate: "2026-07-15",
    status: "Paid",
    breakdown: {
      maintenance: 150,
      utilities: 35,
      clubhouse: 22,
      parking: 15,
      lateFee: 0
    },
    totalAmount: 222,
    paidDate: "2026-07-10",
    paymentMethod: "Credit Card",
    receiptId: "REC-889412"
  },
  {
    id: "bill-aug-2026-c204",
    billNumber: "INV-2026-08-204",
    unitNumber: "C-204",
    residentName: "Michael Chang",
    monthYear: "August 2026",
    issuedDate: "2026-08-01",
    dueDate: "2026-08-05", // Passed due date
    status: "Overdue",
    breakdown: {
      maintenance: 150,
      utilities: 45,
      clubhouse: 22,
      parking: 15,
      lateFee: 25 // Auto late fee
    },
    totalAmount: 257
  },
  {
    id: "bill-aug-2026-b101",
    billNumber: "INV-2026-08-101",
    unitNumber: "B-101",
    residentName: "Sarah Jenkins",
    monthYear: "August 2026",
    issuedDate: "2026-08-01",
    dueDate: "2026-08-15",
    status: "Paid",
    breakdown: {
      maintenance: 180,
      utilities: 50,
      clubhouse: 22,
      parking: 30,
      lateFee: 0
    },
    totalAmount: 282,
    paidDate: "2026-08-02",
    paymentMethod: "UPI / NetBanking",
    receiptId: "REC-991044"
  },
  {
    id: "bill-aug-2026-d501",
    billNumber: "INV-2026-08-501",
    unitNumber: "D-501",
    residentName: "Evelyn Vance",
    monthYear: "August 2026",
    issuedDate: "2026-08-01",
    dueDate: "2026-08-15",
    status: "Pending",
    breakdown: {
      maintenance: 160,
      utilities: 42,
      clubhouse: 22,
      parking: 15,
      lateFee: 0
    },
    totalAmount: 239
  }
];

export const initialTransactions: PaymentTransaction[] = [
  {
    id: "tx-101",
    billId: "bill-jul-2026-a402",
    unitNumber: "A-402",
    residentName: "Alex Rivera",
    amount: 222,
    date: "2026-07-10 14:32",
    method: "Credit Card",
    referenceNo: "PAY-CC-99482710",
    status: "Success"
  },
  {
    id: "tx-102",
    billId: "bill-aug-2026-b101",
    unitNumber: "B-101",
    residentName: "Sarah Jenkins",
    amount: 282,
    date: "2026-08-02 09:15",
    method: "UPI / NetBanking",
    referenceNo: "PAY-UPI-11029384",
    status: "Success"
  }
];

export const initialAmenities: Amenity[] = [
  {
    id: "amenity-clubhouse",
    name: "Grand Royal Clubhouse & Party Hall",
    description: "Fully air-conditioned multipurpose hall with sound system, ambient lighting, and adjoining catering kitchen for private events.",
    category: "Clubhouse",
    location: "Central Clubhouse Complex - Level 1",
    capacity: 120,
    pricePerHour: 35,
    requiresDeposit: true,
    depositAmount: 100,
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    slotsAvailable: ["10:00 AM - 02:00 PM", "03:00 PM - 07:00 PM", "07:30 PM - 11:30 PM"],
    rules: ["No loud music beyond 11:00 PM", "Catering vendors must clear trash before midnight", "Security deposit refundable within 48 hours post-inspection"]
  },
  {
    id: "amenity-pool",
    name: "Olympic Swimming Pool & Sun Deck",
    description: "Temperature-controlled lap pool with separate kids splash pool, sun loungers, and poolside lounge area.",
    category: "Recreation",
    location: "Clubhouse Outdoor Deck",
    capacity: 40,
    pricePerHour: 12,
    requiresDeposit: false,
    depositAmount: 0,
    imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    slotsAvailable: ["06:00 AM - 08:00 AM", "08:00 AM - 10:00 AM", "04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM"],
    rules: ["Proper swimwear mandatory", "Shower before entering pool", "Children under 10 require adult supervision"]
  },
  {
    id: "amenity-tennis",
    name: "Pro-Surface Tennis Court",
    description: "Synthetic acrylic flooded surface with floodlights for evening matches, net provided.",
    category: "Sports",
    location: "Sports Enclosure North",
    capacity: 8,
    pricePerHour: 15,
    requiresDeposit: false,
    depositAmount: 0,
    imageUrl: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80",
    slotsAvailable: ["06:00 AM - 07:30 AM", "07:30 AM - 09:00 AM", "05:00 PM - 06:30 PM", "06:30 PM - 08:00 PM", "08:00 PM - 09:30 PM"],
    rules: ["Non-marking tennis shoes required", "Maximum 1.5 hours per slot booking", "Bring own racquets and balls"]
  },
  {
    id: "amenity-gym",
    name: "Fitness & High-Tech Gym Center",
    description: "Equipped with LifeFitness treadmills, ellipticals, free weights rack, and pilates mat area.",
    category: "Sports",
    location: "Tower B - Ground Level",
    capacity: 25,
    pricePerHour: 5,
    requiresDeposit: false,
    depositAmount: 0,
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    slotsAvailable: ["06:00 AM - 08:00 AM", "08:00 AM - 10:00 AM", "05:00 PM - 07:00 PM", "07:00 PM - 09:00 PM"],
    rules: ["Gym towel required at all times", "Rerack weights after use", "Indoor athletic footwear only"]
  },
  {
    id: "amenity-bbq",
    name: "Rooftop BBQ & Sky Lounge",
    description: "Panoramic rooftop garden space equipped with dual gas grills, dining tables, and ambient string lighting.",
    category: "Events",
    location: "Tower A Rooftop Deck",
    capacity: 30,
    pricePerHour: 25,
    requiresDeposit: true,
    depositAmount: 50,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    slotsAvailable: ["05:00 PM - 08:00 PM", "08:00 PM - 11:00 PM"],
    rules: ["Clean grill grates after use", "Ensure gas supply valve is shut off upon departure", "No open charcoal fires allowed"]
  }
];

export const initialBookings: AmenityBooking[] = [
  {
    id: "bk-801",
    amenityId: "amenity-tennis",
    amenityName: "Pro-Surface Tennis Court",
    unitNumber: "A-402",
    residentName: "Alex Rivera",
    date: "2026-08-10",
    timeSlot: "06:30 PM - 08:00 PM",
    totalPaid: 15,
    status: "Confirmed",
    qrPassCode: "TN-801-402",
    createdAt: "2026-08-06 11:20"
  },
  {
    id: "bk-802",
    amenityId: "amenity-clubhouse",
    amenityName: "Grand Royal Clubhouse & Party Hall",
    unitNumber: "B-101",
    residentName: "Sarah Jenkins",
    date: "2026-08-18",
    timeSlot: "03:00 PM - 07:00 PM",
    totalPaid: 240, // includes $100 deposit
    status: "Confirmed",
    qrPassCode: "CH-802-101",
    createdAt: "2026-08-04 09:10"
  }
];

export const initialNotices: NoticePost[] = [
  {
    id: "notice-1",
    title: "⚡ Mandatory Elevator Maintenance Drive - Tower A & B",
    content: "Please be advised that OTIS Elevator engineers will conduct quarterly routine load testing and brake calibration on Monday, Aug 12th between 10:00 AM and 02:00 PM. Tower A Lift #2 and Tower B Lift #1 will operate alternately. We request residents to plan transit accordingly.",
    summary: "Elevator maintenance on Aug 12th from 10 AM to 2 PM in Tower A & B.",
    category: "Maintenance",
    author: "RWA Maintenance Committee",
    date: "2026-08-07",
    isPinned: true,
    likesCount: 24,
    likedBy: ["A-402", "B-101", "C-204"],
    commentsCount: 5
  },
  {
    id: "notice-2",
    title: "🎉 Annual Monsoon Cultural Fest & Food Flea Market",
    content: "Grand Vista Society is excited to host the Annual Monsoon Cultural Fest on Saturday, Aug 22nd at the Clubhouse Lawn! Events include live music performance, kids talent hunt, food stalls, and games. Resident stalls registration is now open at the management office.",
    summary: "Monsoon Cultural Fest on Aug 22nd at Clubhouse Lawn. Stall bookings open!",
    category: "Event",
    author: "Cultural Committee",
    date: "2026-08-05",
    isPinned: true,
    likesCount: 48,
    likedBy: ["A-402", "B-101", "D-501"],
    commentsCount: 12
  },
  {
    id: "notice-3",
    title: "🚨 Emergency Fire Safety Audit & Alarm Test Notice",
    content: "A mandatory society-wide fire safety and hydrant test will occur on Friday at 03:00 PM. Fire alarms will ring in short test bursts. No cause for panic. Please keep balcony corridors clear of shoes and heavy pots as per municipal fire guidelines.",
    summary: "Fire alarm test & audit scheduled for Friday at 3:00 PM.",
    category: "Emergency",
    author: "Safety & Security Board",
    date: "2026-08-03",
    isPinned: false,
    likesCount: 19,
    likedBy: ["A-402"],
    commentsCount: 2
  }
];

export const initialPolls: CommunityPoll[] = [
  {
    id: "poll-101",
    question: "Should Grand Vista Society install 8 fast-charging EV stations in Basement B2?",
    category: "Infrastructure Upgrade",
    expiresAt: "2026-08-15",
    author: "RWA Managing Committee",
    totalVotes: 86,
    options: [
      { id: "opt-1", text: "Yes, fully support (Cost funded by user pay-per-charge)", votesCount: 62, votedBy: ["A-402", "B-101"] },
      { id: "opt-2", text: "No, prefer prioritizing solar panel rooftop first", votesCount: 18, votedBy: [] },
      { id: "opt-3", text: "Need more technical & budget details first", votesCount: 6, votedBy: [] }
    ]
  }
];

export const initialVisitors: VisitorPass[] = [
  {
    id: "vis-301",
    visitorName: "David Miller (Amazon Logistics)",
    visitorPhone: "+1 (555) 444-1234",
    visitorType: "Delivery",
    unitNumber: "A-402",
    hostResidentName: "Alex Rivera",
    expectedDate: "2026-08-08",
    expectedTime: "11:30 AM",
    passCode: "DEL-4021",
    qrCodeData: "QR-DEL-4021-AMZ",
    status: "Pre-Approved",
    vehicleNo: "VAN-7721",
    notes: "Package delivery - leave with guard if absent"
  },
  {
    id: "vis-302",
    visitorName: "Dr. Rebecca Vance",
    visitorPhone: "+1 (555) 333-8899",
    visitorType: "Guest",
    unitNumber: "A-402",
    hostResidentName: "Alex Rivera",
    expectedDate: "2026-08-08",
    expectedTime: "02:00 PM",
    passCode: "GST-8812",
    qrCodeData: "QR-GST-8812-A402",
    status: "Checked-In",
    checkInTime: "2026-08-08 09:10 AM",
    vehicleNo: "NY-6610-K",
    gateGuardName: "Officer Rajan Kumar"
  },
  {
    id: "vis-303",
    visitorName: "Uber Cab (Driver John)",
    visitorPhone: "+1 (555) 222-1100",
    visitorType: "Cab",
    unitNumber: "C-204",
    hostResidentName: "Michael Chang",
    expectedDate: "2026-08-08",
    expectedTime: "08:15 AM",
    passCode: "CAB-9920",
    qrCodeData: "QR-CAB-9920",
    status: "Checked-Out",
    checkInTime: "2026-08-08 08:12 AM",
    checkOutTime: "2026-08-08 08:25 AM",
    gateGuardName: "Officer Rajan Kumar"
  }
];

export const initialTickets: MaintenanceTicket[] = [
  {
    id: "tkt-501",
    ticketNo: "TKT-2026-089",
    unitNumber: "A-402",
    residentName: "Alex Rivera",
    title: "Slow water drainage in master bathroom sink",
    description: "The bathroom sink drain is taking over 5 minutes to clear after running water. Suspecting minor lime scale clog in pipe joint.",
    category: "Plumbing",
    priority: "Medium",
    status: "Assigned",
    createdAt: "2026-08-07 16:45",
    assignedStaff: "Mario PlumbWorks Co.",
    estimatedHours: 4,
    scheduledDate: "2026-08-09",
    scheduledTime: "10:30 AM",
    serviceType: "Repair Visit"
  },
  {
    id: "tkt-502",
    ticketNo: "TKT-2026-078",
    unitNumber: "A-402",
    residentName: "Alex Rivera",
    title: "Balcony door latch loose",
    description: "Sliding door lock mechanism is slipping.",
    category: "Civil/Pest",
    priority: "Low",
    status: "Resolved",
    createdAt: "2026-08-02 10:15",
    assignedStaff: "Staff Carpenter Sam",
    estimatedHours: 2,
    resolutionNotes: "Tightened latch screws and lubricated track.",
    rating: 5,
    feedbackComment: "Prompt service and courteous staff!",
    scheduledDate: "2026-08-04",
    scheduledTime: "02:00 PM",
    serviceType: "Repair Visit"
  },
  {
    id: "tkt-503",
    ticketNo: "TKT-2026-092",
    unitNumber: "C-204",
    residentName: "Michael Chang",
    title: "Corridor light fixture flickering near C-204",
    description: "LED panel in hallway outside flat C-204 is flashing intermittently.",
    category: "Electrical",
    priority: "Medium",
    status: "Open",
    createdAt: "2026-08-08 08:30",
    scheduledDate: "2026-08-10",
    scheduledTime: "03:15 PM",
    serviceType: "Inspection"
  },
  {
    id: "tkt-504",
    ticketNo: "TKT-2026-095",
    unitNumber: "B-101",
    residentName: "Sarah Jenkins",
    title: "Quarterly AC Compressor & Duct Servicing",
    description: "Scheduled preventive maintenance for split air conditioner units and filter replacement.",
    category: "General Maintenance",
    priority: "Medium",
    status: "Assigned",
    createdAt: "2026-08-06 14:20",
    assignedStaff: "CoolBreeze HVAC Techs",
    estimatedHours: 3,
    scheduledDate: "2026-08-12",
    scheduledTime: "11:00 AM",
    serviceType: "Routine Maintenance"
  },
  {
    id: "tkt-505",
    ticketNo: "TKT-2026-098",
    unitNumber: "D-501",
    residentName: "Evelyn Vance",
    title: "Pest Control Organic Spraying",
    description: "Pre-monsoon herbal pest control spraying in kitchen and balcony areas.",
    category: "Civil/Pest",
    priority: "Low",
    status: "Assigned",
    createdAt: "2026-08-05 09:10",
    assignedStaff: "GreenShield Pest Control",
    estimatedHours: 1.5,
    scheduledDate: "2026-08-14",
    scheduledTime: "04:00 PM",
    serviceType: "Vendor AMC"
  },
  {
    id: "tkt-506",
    ticketNo: "TKT-2026-101",
    unitNumber: "Tower A",
    residentName: "RWA Management",
    title: "OTIS Elevator Quarterly Safety Calibration",
    description: "Mandatory load test and door sensor alignment for Tower A Lifts #1 and #2.",
    category: "Elevator",
    priority: "High",
    status: "In Progress",
    createdAt: "2026-08-07 11:00",
    assignedStaff: "OTIS Elevator Services",
    estimatedHours: 4,
    scheduledDate: "2026-08-15",
    scheduledTime: "09:30 AM",
    serviceType: "Vendor AMC"
  },
  {
    id: "tkt-507",
    ticketNo: "TKT-2026-105",
    unitNumber: "A-402",
    residentName: "Alex Rivera",
    title: "Kitchen Sink Garbage Disposal Unit Jammed",
    description: "Disposal motor hums but blades do not spin. Needs unjamming key inspection.",
    category: "Plumbing",
    priority: "High",
    status: "Assigned",
    createdAt: "2026-08-08 09:45",
    assignedStaff: "Mario PlumbWorks Co.",
    estimatedHours: 1,
    scheduledDate: "2026-08-18",
    scheduledTime: "02:00 PM",
    serviceType: "Emergency Callout"
  },
  {
    id: "tkt-508",
    ticketNo: "TKT-2026-109",
    unitNumber: "C-204",
    residentName: "Michael Chang",
    title: "Main Circuit Breaker Tripping Diagnostic",
    description: "MCB trips whenever heavy appliance (washing machine) is turned on.",
    category: "Electrical",
    priority: "High",
    status: "Open",
    createdAt: "2026-08-08 10:00",
    scheduledDate: "2026-08-20",
    scheduledTime: "10:00 AM",
    serviceType: "Repair Visit"
  }
];

export const initialFinancialLedger: FinancialLedgerItem[] = [
  {
    id: "led-101",
    date: "2026-08-01",
    description: "August Monthly Maintenance Collections (Flats 1-120)",
    type: "Income",
    category: "Maintenance Fees",
    amount: 24600,
    referenceDoc: "REC-2026-08-BATCH"
  },
  {
    id: "led-102",
    date: "2026-08-02",
    description: "Clubhouse & Tennis Amenity Booking Fees",
    type: "Income",
    category: "Amenity Revenue",
    amount: 1450,
    referenceDoc: "AMN-BOOKING-08"
  },
  {
    id: "led-103",
    date: "2026-08-03",
    description: "ShieldGuard Security Agency Monthly Payroll (12 Officers)",
    type: "Expense",
    category: "Security Contract",
    amount: 8200,
    referenceDoc: "INV-SHIELD-0826"
  },
  {
    id: "led-104",
    date: "2026-08-04",
    description: "Common Area Electricity & Water Pump Utility Bill",
    type: "Expense",
    category: "Utilities & Electricity",
    amount: 4850,
    referenceDoc: "CITY-POWER-901"
  },
  {
    id: "led-105",
    date: "2026-08-05",
    description: "GreenThumb Landscaping & Swimming Pool Chlorination AMC",
    type: "Expense",
    category: "Landscaping",
    amount: 2400,
    referenceDoc: "GREEN-AMC-882"
  }
];

export const initialVendors: ServiceVendor[] = [
  {
    id: "ven-1",
    companyName: "ShieldGuard Security Solutions",
    serviceCategory: "24/7 Gate Security & Patrol",
    contactPerson: "Capt. Arthur Pendelton",
    phone: "+1 (555) 888-9900",
    email: "contracts@shieldguard.com",
    contractStartDate: "2026-01-01",
    contractEndDate: "2026-12-31",
    monthlyFee: 8200,
    status: "Active",
    rating: 4.8
  },
  {
    id: "ven-2",
    companyName: "OTIS Elevator Services",
    serviceCategory: "Elevator AMC & Emergency Rescue",
    contactPerson: "Engineers Desk",
    phone: "+1 (555) 444-8811",
    email: "support@otiselevators.com",
    contractStartDate: "2025-06-01",
    contractEndDate: "2027-05-31",
    monthlyFee: 1800,
    status: "Active",
    rating: 4.9
  },
  {
    id: "ven-3",
    companyName: "GreenThumb Eco Landscaping & Pool",
    serviceCategory: "Gardening, Trees & Pool Hygiene",
    contactPerson: "Elena Rostova",
    phone: "+1 (555) 333-2211",
    email: "elena@greenthumblandscapes.com",
    contractStartDate: "2026-03-01",
    contractEndDate: "2027-02-28",
    monthlyFee: 2400,
    status: "Active",
    rating: 4.6
  }
];

export const initialNotifications: PushNotification[] = [
  {
    id: "notif-1",
    title: "🚚 Visitor Arrived at Main Gate",
    body: "David Miller (Amazon Delivery) has presented entry code DEL-4021 for Flat A-402.",
    type: "Visitor",
    timestamp: "10 mins ago",
    isRead: false,
    unitNumber: "A-402"
  },
  {
    id: "notif-2",
    title: "💳 August Maintenance Dues Issued",
    body: "Invoice INV-2026-08-402 of $225 is due on Aug 15th. Pay via app to avoid late charges.",
    type: "Billing",
    timestamp: "1 day ago",
    isRead: false,
    unitNumber: "A-402"
  },
  {
    id: "notif-3",
    title: "🎾 Tennis Court Booking Confirmed",
    body: "Your slot on Aug 10th (06:30 PM - 08:00 PM) is confirmed. Code: TN-801-402.",
    type: "Booking",
    timestamp: "2 days ago",
    isRead: true,
    unitNumber: "A-402"
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "audit-1",
    timestamp: "2026-08-08 09:10:15",
    actorName: "Officer Rajan Kumar",
    actorRole: "security",
    actionCategory: "Visitor Gate",
    details: "Checked-in guest Dr. Rebecca Vance for Flat A-402 with code GST-8812",
    ipAddress: "192.168.1.102 (Gate Terminal)"
  },
  {
    id: "audit-2",
    timestamp: "2026-08-07 14:22:00",
    actorName: "Alex Rivera",
    actorRole: "resident",
    actionCategory: "GDPR Data Export",
    details: "Requested copy of personal data archive (JSON)",
    ipAddress: "172.56.21.90"
  },
  {
    id: "audit-3",
    timestamp: "2026-08-02 09:15:30",
    actorName: "Sarah Jenkins",
    actorRole: "admin",
    actionCategory: "Financial",
    details: "Processed monthly dues payment $282 for B-101 via NetBanking",
    ipAddress: "192.168.1.45"
  }
];

export const initialGdprConsent: GdprConsent = {
  marketingEmail: false,
  phoneVisibleToNeighbors: false,
  allowVisitorNotifications: true,
  dataRetentionAcknowledged: true,
  lastUpdated: "2026-08-01"
};
