export type UserRole = 'resident' | 'admin' | 'security';

export interface Vehicle {
  type: 'Car' | 'Bike';
  regNo: string;
  slotNo: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Spouse' | 'Child' | 'Parent' | 'Sibling' | 'Relative' | 'Co-Resident';
  phone?: string;
  email?: string;
  age?: number;
  gateAccessAllowed: boolean;
}

export interface PetProfile {
  id: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Other';
  breed?: string;
  vaccinated: boolean;
  vaccinationDueDate?: string;
  rabiesTagNumber?: string;
}

export interface NotificationChannelPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  whatsapp: boolean;
  categories: {
    duesAndPayments: boolean;
    gateAndVisitors: boolean;
    noticesAndAnnouncements: boolean;
    maintenanceAndHelpdesk: boolean;
    societyEvents: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
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
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  vehicles: Vehicle[];
  familyMembers?: FamilyMember[];
  pets?: PetProfile[];
  notificationPreferences?: NotificationChannelPreferences;
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

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Society Bylaws & Rules' | 'Meeting Minutes & AGM' | 'Tax & Audit Statements' | 'NOC & Safety Certificates' | 'Maintenance Guides' | 'Personal Unit Locker';
  description: string;
  fileType: 'PDF' | 'DOCX' | 'JPG' | 'ZIP';
  fileSize: string;
  uploadedBy: string;
  uploadedByRole: 'admin' | 'resident' | 'RWA Executive';
  uploadDate: string;
  isPrivate: boolean; // if true, only accessible by unitNumber or admin
  unitNumber?: string; // unit number if personal/unit document
  downloadCount: number;
  tags: string[];
  certifiedSeal?: boolean;
  fileUrl?: string;
}

export interface VerifiedServiceReview {
  id: string;
  residentName: string;
  unitNumber: string;
  rating: number;
  comment: string;
  date: string;
}

export interface VerifiedService {
  id: string;
  name: string;
  category: 'Plumbing' | 'Electrical' | 'Grocery & Delivery' | 'Housekeeping & Pest Control' | 'Carpentry & Handyman' | 'HVAC & Appliance';
  contactPerson: string;
  phone: string;
  alternatePhone?: string;
  whatsapp?: string;
  email?: string;
  address: string;
  rating: number;
  reviewCount: number;
  is24x7Emergency: boolean;
  isRwaVerified: boolean;
  verificationDate: string;
  operatingHours: string;
  estimatedResponseTime: string;
  pricingInfo: string;
  servicesOffered: string[];
  description: string;
  reviews: VerifiedServiceReview[];
}

export interface SocietyEvent {
  id: string;
  title: string;
  category: 'Society Meeting' | 'Maintenance Drive' | 'Cultural Event' | 'Emergency Drill' | 'Community Workshop';
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:00 AM"
  endTime: string; // e.g. "12:00 PM"
  location: string;
  organizer: string;
  description: string;
  rsvpCount: number;
  rsvpedBy: string[]; // unit numbers
  isMandatory?: boolean;
}

export interface HourlyConsumption {
  hour: string;
  electricityKWh: number;
  waterLiters: number;
  isPeakHour: boolean;
  cost: number;
}

export interface DailyConsumption {
  date: string;
  electricityKWh: number;
  waterLiters: number;
  electricityCost: number;
  waterCost: number;
}

export interface ApplianceUsageBreakdown {
  name: string;
  category: 'Electricity' | 'Water';
  percentage: number;
  currentPowerWatts?: number;
  dailyCost: number;
  iconName: string;
}

export interface UtilityAnomalyAlert {
  id: string;
  type: 'Surge' | 'Leak' | 'High Power' | 'Low Pressure' | 'Vacation Warning';
  utility: 'Electricity' | 'Water';
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  timestamp: string;
  unitNumber: string;
  resolved: boolean;
}

export interface UnitUtilityMeter {
  unitNumber: string;
  tower: string;
  meterIdElectricity: string;
  meterIdWater: string;
  status: 'Online' | 'Warning' | 'Offline';
  liveVoltageVolts: number;
  liveCurrentLoadKw: number;
  liveWaterFlowLpm: number;
  liveWaterPressureBar: number;
  todayElectricityKWh: number;
  todayWaterLiters: number;
  monthElectricityKWh: number;
  monthWaterLiters: number;
  monthElectricityBill: number;
  monthWaterBill: number;
  budgetElectricityKWh: number;
  budgetWaterLiters: number;
  mainWaterValveOpen: boolean;
  solarContributionKWh: number;
  co2SavedKg: number;
}

export interface LostFoundItem {
  id: string;
  title: string;
  type: 'Lost' | 'Found';
  category: 'Keys & Cards' | 'Electronics & Gadgets' | 'Pets' | 'Toys & Kids' | 'Clothing & Accessories' | 'Documents & Wallet' | 'Other';
  description: string;
  location: string;
  date: string;
  photoUrl?: string;
  postedBy: string;
  unitNumber: string;
  contactPhone: string;
  status: 'Open' | 'Claimed' | 'Returned';
  storageLocationNote?: string;
}

export interface GalleryPhotoComment {
  id: string;
  user: string;
  unitNumber: string;
  text: string;
  date: string;
}

export interface GalleryPhoto {
  id: string;
  albumId: string;
  title: string;
  caption?: string;
  imageUrl: string;
  dateUploaded: string;
  uploadedBy: string;
  isManagementUpload: boolean;
  category: 'Festival' | 'Meeting & AGM' | 'Sports & Youth' | 'Cultural Night' | 'Environment & Green' | 'Community Social';
  likesCount: number;
  likedByCurrentUser?: boolean;
  comments: GalleryPhotoComment[];
  tags: string[];
}

export interface EventAlbum {
  id: string;
  title: string;
  category: 'Festival' | 'Meeting & AGM' | 'Sports & Youth' | 'Cultural Night' | 'Environment & Green' | 'Community Social';
  date: string;
  location: string;
  coverPhotoUrl: string;
  description: string;
  photoCount: number;
  uploadedBy: string;
  tags: string[];
}



