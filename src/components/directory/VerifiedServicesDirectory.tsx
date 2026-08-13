import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import { VerifiedService } from "../../types";
import {
  Wrench,
  Zap,
  ShoppingBag,
  ShieldCheck,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  Star,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building,
  MapPin,
  Flame,
  Truck,
  DollarSign,
  ChevronRight,
  ThumbsUp,
  X,
  Sparkles,
  PhoneCall,
  Lock,
  UserCheck
} from "lucide-react";

export const VerifiedServicesDirectory: React.FC = () => {
  const {
    currentUser,
    verifiedServices,
    addVerifiedService,
    addServiceReview,
    toggleServiceVerification,
    deleteVerifiedService
  } = useSociety();

  // Search & Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [emergencyOnly, setEmergencyOnly] = useState<boolean>(false);
  const [rwaVerifiedOnly, setRwaVerifiedOnly] = useState<boolean>(false);

  // Modal State
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<VerifiedService | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showReviewModalFor, setShowReviewModalFor] = useState<VerifiedService | null>(null);

  // Review Form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");

  // Recommend Provider Form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<VerifiedService["category"]>("Plumbing");
  const [formContactPerson, setFormContactPerson] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formWhatsapp, setFormWhatsapp] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formOperatingHours, setFormOperatingHours] = useState("08:00 AM - 08:00 PM");
  const [formResponseTime, setFormResponseTime] = useState("20 - 30 Mins");
  const [formPricingInfo, setFormPricingInfo] = useState("Standard Rate / Free Estimate");
  const [formServicesText, setFormServicesText] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIsEmergency, setFormIsEmergency] = useState(false);

  // Copy Phone feedback state
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Category Icon Resolver
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Plumbing":
        return Wrench;
      case "Electrical":
        return Zap;
      case "Grocery & Delivery":
        return ShoppingBag;
      case "Housekeeping & Pest Control":
        return UserCheck;
      case "Carpentry & Handyman":
        return Lock;
      case "HVAC & Appliance":
        return Sparkles;
      default:
        return Wrench;
    }
  };

  // Category Badge Style
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Plumbing":
        return "bg-cyan-50 text-cyan-800 border-cyan-200";
      case "Electrical":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Grocery & Delivery":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Housekeeping & Pest Control":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "Carpentry & Handyman":
        return "bg-orange-50 text-orange-800 border-orange-200";
      case "HVAC & Appliance":
        return "bg-blue-50 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  // Filter Services
  const filteredServices = verifiedServices.filter(svc => {
    // Category filter
    if (selectedCategory !== "All" && svc.category !== selectedCategory) {
      return false;
    }

    // Emergency filter
    if (emergencyOnly && !svc.is24x7Emergency) {
      return false;
    }

    // RWA Verified filter
    if (rwaVerifiedOnly && !svc.isRwaVerified) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = svc.name.toLowerCase().includes(q);
      const matchCat = svc.category.toLowerCase().includes(q);
      const matchPerson = svc.contactPerson.toLowerCase().includes(q);
      const matchDesc = svc.description.toLowerCase().includes(q);
      const matchSvc = svc.servicesOffered.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchCat && !matchPerson && !matchDesc && !matchSvc) {
        return false;
      }
    }

    return true;
  });

  // Copy Phone Helper
  const handleCopyPhone = (serviceId: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(serviceId);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  // Handle Review Submit
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReviewModalFor || !newComment.trim()) return;

    addServiceReview(showReviewModalFor.id, newRating, newComment.trim());
    setShowReviewModalFor(null);
    setNewComment("");
    setNewRating(5);
  };

  // Handle Add Service Submit
  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || !formContactPerson.trim()) return;

    const servicesList = formServicesText
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    addVerifiedService({
      name: formName.trim(),
      category: formCategory,
      contactPerson: formContactPerson.trim(),
      phone: formPhone.trim(),
      whatsapp: formWhatsapp.trim() || undefined,
      email: formEmail.trim() || undefined,
      address: formAddress.trim() || "Local Service Partner",
      is24x7Emergency: formIsEmergency,
      isRwaVerified: currentUser.role === "admin",
      operatingHours: formOperatingHours.trim(),
      estimatedResponseTime: formResponseTime.trim(),
      pricingInfo: formPricingInfo.trim(),
      servicesOffered: servicesList.length > 0 ? servicesList : ["General Local Repairs"],
      description: formDescription.trim() || "Resident-recommended local service provider."
    });

    setShowAddModal(false);
    // Reset Form
    setFormName("");
    setFormContactPerson("");
    setFormPhone("");
    setFormWhatsapp("");
    setFormEmail("");
    setFormAddress("");
    setFormServicesText("");
    setFormDescription("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-slate-900">Verified Local Services Directory</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                RWA Empaneled
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Trusted directory of plumbers, electricians, grocery delivery marts, HVAC technicians, and emergency handymen for Grand Vista residents.
            </p>
          </div>

          <button
            id="btn-recommend-service"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Recommend Local Provider</span>
          </button>
        </div>

        {/* Quick Emergency Hotline Ticker */}
        <div className="bg-slate-900 text-white p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span className="font-bold text-slate-100">24/7 Society Duty Desk & Emergency Contacts:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-medium">
            <a href="tel:+15552349001" className="hover:text-amber-300 flex items-center gap-1 transition">
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
              <span>Plumber: +1 (555) 234-9001</span>
            </a>
            <a href="tel:+15553458812" className="hover:text-amber-300 flex items-center gap-1 transition">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Electrician: +1 (555) 345-8812</span>
            </a>
            <a href="tel:+15557773344" className="hover:text-amber-300 flex items-center gap-1 transition">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Society Mart: +1 (555) 777-3344</span>
            </a>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Keyword Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by service name, plumber, electrician, grocery delivery, tap fix..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Quick Toggles */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setEmergencyOnly(!emergencyOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                emergencyOnly
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>24/7 Emergency Only</span>
            </button>

            <button
              onClick={() => setRwaVerifiedOnly(!rwaVerifiedOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                rwaVerifiedOnly
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RWA Verified Badge</span>
            </button>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          {[
            "All",
            "Plumbing",
            "Electrical",
            "Grocery & Delivery",
            "Housekeeping & Pest Control",
            "Carpentry & Handyman",
            "HVAC & Appliance"
          ].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <Wrench className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-700">No verified local service providers matched your criteria.</p>
            <p className="text-xs text-slate-500">Try adjusting your category filter or search query.</p>
          </div>
        ) : (
          filteredServices.map(svc => {
            const IconComp = getCategoryIcon(svc.category);
            const badgeClass = getCategoryBadgeClass(svc.category);

            return (
              <div
                key={svc.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between relative group"
              >
                {/* Card Top Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-100 text-indigo-600 shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono ${badgeClass}`}>
                          {svc.category}
                        </span>
                        <h2 className="font-bold text-slate-900 text-sm mt-0.5 leading-snug">
                          {svc.name}
                        </h2>
                      </div>
                    </div>

                    {currentUser.role === "admin" && (
                      <button
                        onClick={() => toggleServiceVerification(svc.id)}
                        className={`p-1.5 rounded-lg border transition ${
                          svc.isRwaVerified
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Toggle RWA Verification Badge (Admin)"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Verification Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {svc.isRwaVerified && (
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>RWA Verified</span>
                      </span>
                    )}

                    {svc.is24x7Emergency && (
                      <span className="bg-rose-50 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-rose-600" />
                        <span>24/7 Emergency</span>
                      </span>
                    )}

                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{svc.rating} ({svc.reviewCount} reviews)</span>
                    </span>
                  </div>

                  {/* Operational Details */}
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Contact: <strong className="text-slate-800">{svc.contactPerson}</strong></span>
                    </p>

                    <p className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{svc.operatingHours}</span>
                    </p>

                    <p className="flex items-center gap-1.5 font-medium">
                      <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Est. Response: <strong className="text-indigo-900 font-mono">{svc.estimatedResponseTime}</strong></span>
                    </p>

                    <p className="flex items-center gap-1.5 font-medium">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Rates: <span className="text-slate-800 font-semibold">{svc.pricingInfo}</span></span>
                    </p>
                  </div>

                  {/* Services Tag Pill List */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Services Offered:</span>
                    <div className="flex flex-wrap gap-1">
                      {svc.servicesOffered.map((s, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                {/* Contact Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${svc.phone}`}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>

                    {svc.whatsapp ? (
                      <a
                        href={`https://wa.me/${svc.whatsapp.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(svc.name)},%20I%20am%20a%20resident%20at%20Grand%20Vista%20Heights.`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => handleCopyPhone(svc.id, svc.phone)}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{copiedPhoneId === svc.id ? "Copied!" : "Copy Phone"}</span>
                      </button>
                    )}
                  </div>

                  {/* Reviews Trigger */}
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 pt-1">
                    <button
                      onClick={() => setSelectedServiceForDetail(svc)}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-bold"
                    >
                      <span>View Resident Reviews ({svc.reviews.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setShowReviewModalFor(svc)}
                      className="text-slate-600 hover:text-slate-900 flex items-center gap-1 text-[11px]"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <span>Write Review</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* SERVICE DETAILS & REVIEWS MODAL */}
      {selectedServiceForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-5 text-slate-900 shadow-xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono ${getCategoryBadgeClass(selectedServiceForDetail.category)}`}>
                  {selectedServiceForDetail.category}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">{selectedServiceForDetail.name}</h3>
              </div>

              <button onClick={() => setSelectedServiceForDetail(null)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Provider Meta Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <p className="flex items-center gap-2 font-medium">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Contact Person: <strong className="text-slate-900">{selectedServiceForDetail.contactPerson}</strong></span>
              </p>

              <p className="flex items-center gap-2 font-medium">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Primary Phone: <strong className="text-slate-900 font-mono">{selectedServiceForDetail.phone}</strong></span>
              </p>

              <p className="flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Address / Hub: <span className="text-slate-700">{selectedServiceForDetail.address}</span></span>
              </p>

              <p className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Hours: <span className="text-slate-700">{selectedServiceForDetail.operatingHours}</span></span>
              </p>
            </div>

            {/* Resident Reviews List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Resident Reviews & Feedback ({selectedServiceForDetail.reviews.length})</span>
                </h4>

                <button
                  onClick={() => {
                    const target = selectedServiceForDetail;
                    setSelectedServiceForDetail(null);
                    setShowReviewModalFor(target);
                  }}
                  className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition"
                >
                  + Add Review
                </button>
              </div>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {selectedServiceForDetail.reviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No resident reviews posted yet.</p>
                ) : (
                  selectedServiceForDetail.reviews.map(rev => (
                    <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          {rev.residentName} <span className="text-indigo-600 font-mono">({rev.unitNumber})</span>
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] text-slate-400 block text-right font-mono">{rev.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedServiceForDetail(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {showReviewModalFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 text-slate-900 shadow-xl relative">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Review {showReviewModalFor.name}</h3>
              <button onClick={() => setShowReviewModalFor(null)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-bold">Star Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating ? "text-amber-500 fill-amber-500" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-slate-800 text-sm ml-2 font-mono">{newRating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-bold">Your Review & Feedback</label>
                <textarea
                  rows={3}
                  placeholder="Share your experience with quality, punctuality, and pricing..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModalFor(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
                >
                  Post Review
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* RECOMMEND NEW PROVIDER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 text-slate-900 shadow-xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
                <Plus className="w-5 h-5" />
                <h3>Recommend Local Service Provider</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddServiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-bold">Business / Provider Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rapid Plumber John, QuickFix Electricians, Mart 24..."
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Grocery & Delivery">Grocery & Delivery</option>
                    <option value="Housekeeping & Pest Control">Housekeeping & Pest Control</option>
                    <option value="Carpentry & Handyman">Carpentry & Handyman</option>
                    <option value="HVAC & Appliance">HVAC & Appliance</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Contact Person Name</label>
                  <input
                    type="text"
                    placeholder="e.g. David Sparks"
                    value={formContactPerson}
                    onChange={e => setFormContactPerson(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Primary Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">WhatsApp Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formWhatsapp}
                    onChange={e => setFormWhatsapp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Operating Hours</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM - 08:00 PM"
                    value={formOperatingHours}
                    onChange={e => setFormOperatingHours(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Est. Response Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 - 30 Mins"
                    value={formResponseTime}
                    onChange={e => setFormResponseTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-bold">Pricing / Visit Fee Info</label>
                <input
                  type="text"
                  placeholder="e.g. $15 Standard Inspection / Free Quote"
                  value={formPricingInfo}
                  onChange={e => setFormPricingInfo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-bold">Services Offered (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Pipe burst repair, Tap replacement, Drain unblocking"
                  value={formServicesText}
                  onChange={e => setFormServicesText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-bold">Description & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Why do you recommend this provider? Any specific experience or notes..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                />
              </div>

              {/* Emergency Checkbox */}
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-rose-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <span>Provides 24/7 Emergency Service</span>
                </span>
                <input
                  type="checkbox"
                  checked={formIsEmergency}
                  onChange={e => setFormIsEmergency(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Submit Local Provider Listing
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
