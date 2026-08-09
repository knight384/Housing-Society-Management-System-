export type UserRole = 'resident' | 'admin' | 'security';

export interface Vehicle {
  type: 'Car' | 'Bike';
  regNo: string;
  slotNo: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  unitNumber: string; // e.g. "A-402"
  tower: string; // e.g. "Tower A"
  flatType: '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'Penthouse';
  ownerType: 'Owner' | 'Tenant';
  moveInDate: string;
  emergencyContact: string;
  vehicles: Vehicle[];
}

export interface DuesBreakdown {
  maintenance: number;
  utilities: number;
  clubhouse: number;
  parking: number;
  lateFee: number;
}

export interface DuesBill {
  id: string;
  billNumber: string;
  unitNumber: string;
  residentName: string;
  monthYear: string;
  dueDate: string;
  issuedDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  breakdown: DuesBreakdown;
  totalAmount: number;
  paidDate?: string;
  paymentMethod?: string;
  receiptId?: string;
}

export interface PaymentTransaction {
  id: string;
  billId: string;
  unitNumber: string;
  residentName: string;
  amount: number;
  date: string;
  method: 'Credit Card' | 'UPI / NetBanking' | 'Debit Card' | 'Digital Wallet';
  referenceNo: string;
  status: 'Success' | 'Processing' | 'Failed';
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  category: 'Clubhouse' | 'Sports' | 'Recreation' | 'Events';
  location: string;
  capacity: number;
  pricePerHour: number;
  requiresDeposit: boolean;
  depositAmount: number;
  imageUrl: string;
  slotsAvailable: string[];
  rules: string[];
}

export interface AmenityBooking {
  id: string;
  amenityId: string;
  amenityName: string;
  unitNumber: string;
  residentName: string;
  date: string;
  timeSlot: string;
  totalPaid: number;
  status: 'Confirmed' | 'Pending Approval' | 'Cancelled' | 'Completed';
  qrPassCode: string;
  createdAt: string;
}

export interface NoticePost {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: 'Emergency' | 'Maintenance' | 'Event' | 'General' | 'Rules';
  author: string;
  date: string;
  isPinned: boolean;
  likesCount: number;
  likedBy: string[];
  commentsCount: number;
}

export interface PollOption {
  id: string;
  text: string;
  votesCount: number;
  votedBy: string[];
}

export interface CommunityPoll {
  id: string;
  question: string;
  category: string;
  options: PollOption[];
  expiresAt: string;
  totalVotes: number;
  author: string;
}

export interface VisitorPass {
  id: string;
  visitorName: string;
  visitorPhone: string;
  visitorType: 'Guest' | 'Delivery' | 'Cab' | 'Daily Help' | 'Contractor';
  unitNumber: string;
  hostResidentName: string;
  expectedDate: string;
  expectedTime: string;
  passCode: string; // e.g. "G-8821"
  qrCodeData: string;
  status: 'Pre-Approved' | 'Checked-In' | 'Checked-Out' | 'Denied';
  vehicleNo?: string;
  photoUrl?: string;
  checkInTime?: string;
  checkOutTime?: string;
  gateGuardName?: string;
  notes?: string;
}

export interface MaintenanceTicket {
  id: string;
  ticketNo: string;
  unitNumber: string;
  residentName: string;
  title: string;
  description: string;
  category: 'Plumbing' | 'Electrical' | 'Elevator' | 'Security' | 'Civil/Pest' | 'General Maintenance';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved';
  createdAt: string;
  assignedStaff?: string;
  estimatedHours?: number;
  resolutionNotes?: string;
  rating?: number;
  feedbackComment?: string;
  attachmentUrl?: string;
  scheduledDate?: string; // YYYY-MM-DD format e.g. "2026-08-12"
  scheduledTime?: string; // e.g. "10:30 AM"
  serviceType?: 'Repair Visit' | 'Routine Maintenance' | 'Inspection' | 'Vendor AMC' | 'Emergency Callout';
}

export interface FinancialLedgerItem {
  id: string;
  date: string;
  description: string;
  type: 'Income' | 'Expense';
  category: 'Maintenance Fees' | 'Amenity Revenue' | 'Staff Payroll' | 'Security Contract' | 'Utilities & Electricity' | 'Landscaping' | 'Elevator AMC' | 'Miscellaneous';
  amount: number;
  referenceDoc?: string;
}

export interface ServiceVendor {
  id: string;
  companyName: string;
  serviceCategory: string;
  contactPerson: string;
  phone: string;
  email: string;
  contractStartDate: string;
  contractEndDate: string;
  monthlyFee: number;
  status: 'Active' | 'Under Review' | 'Expired';
  rating: number;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: 'Urgent' | 'Billing' | 'Visitor' | 'Notice' | 'Booking' | 'Ticket';
  timestamp: string;
  isRead: boolean;
  unitNumber?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  actionCategory: 'Security' | 'Financial' | 'GDPR Data Export' | 'Visitor Gate' | 'Admin Rule Change';
  details: string;
  ipAddress: string;
}

export interface GdprConsent {
  marketingEmail: boolean;
  phoneVisibleToNeighbors: boolean;
  allowVisitorNotifications: boolean;
  dataRetentionAcknowledged: boolean;
  lastUpdated: string;
}
