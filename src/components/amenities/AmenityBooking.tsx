import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import { Amenity, AmenityBooking as AmenityBookingType } from "../../types";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  X,
  QrCode,
  AlertCircle,
  Info,
  DollarSign,
  Search,
  Filter
} from "lucide-react";

export const AmenityBooking: React.FC = () => {
  const {
    currentUser,
    amenities,
    bookings,
    createBooking,
    cancelBooking
  } = useSociety();

  const [activeTab, setActiveTab] = useState<"catalog" | "my-bookings">("catalog");
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [bookingMessage, setBookingMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [qrModalPass, setQrModalPass] = useState<AmenityBookingType | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredAmenities = amenities.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const myBookings = bookings.filter(b => b.unitNumber === currentUser.unitNumber);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmenity || !selectedSlot) return;

    const res = createBooking(selectedAmenity.id, selectedDate, selectedSlot);
    if (res.success) {
      setBookingMessage({ type: "success", text: res.message });
      setTimeout(() => {
        setSelectedAmenity(null);
        setBookingMessage(null);
        setActiveTab("my-bookings");
      }, 1200);
    } else {
      setBookingMessage({ type: "error", text: res.message });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h1 className="text-xl font-bold text-slate-900">Amenity & Facility Booking System</h1>
          </div>
          <p className="text-xs text-slate-600">
            Reserve society clubhouse, sports courts, swimming pool, and sky lounge with instant time-slot allocation.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 text-xs">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === "catalog" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Explore Amenities
          </button>
          <button
            onClick={() => setActiveTab("my-bookings")}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === "my-bookings" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            My Bookings ({myBookings.length})
          </button>
        </div>
      </div>

      {activeTab === "catalog" ? (
        <div className="space-y-4">
          
          {/* Search & Categories */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-xs">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search amenities..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs overflow-x-auto scrollbar-none">
              {["All", "Clubhouse", "Sports", "Recreation", "Events"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full font-medium transition whitespace-nowrap ${
                    categoryFilter === cat ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAmenities.map(amenity => (
              <div
                key={amenity.id}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                {/* Image Banner */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={amenity.imageUrl}
                    alt={amenity.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-xs">
                    ${amenity.pricePerHour}/hr
                  </span>
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-slate-800 border border-slate-200 flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span>{amenity.location}</span>
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{amenity.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{amenity.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>Capacity: {amenity.capacity} People</span>
                    </div>
                    {amenity.requiresDeposit && (
                      <span className="text-amber-800 font-mono text-[11px] font-semibold">+${amenity.depositAmount} Deposit</span>
                    )}
                  </div>

                  <button
                    id={`btn-book-amenity-${amenity.id}`}
                    onClick={() => { setSelectedAmenity(amenity); setSelectedSlot(amenity.slotsAvailable[0]); }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Time Slot</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* My Active Bookings List */
        <div className="space-y-4">
          {myBookings.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs bg-white border border-slate-200/80 rounded-2xl space-y-2">
              <Calendar className="w-8 h-8 mx-auto opacity-30 text-blue-600" />
              <p>You have no active amenity reservations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myBookings.map(bk => (
                <div key={bk.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                        {bk.status}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-1">{bk.amenityName}</h3>
                    </div>
                    <button
                      onClick={() => setQrModalPass(bk)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition flex items-center gap-1 text-xs font-semibold"
                    >
                      <QrCode className="w-4 h-4 text-blue-600" />
                      <span>Pass QR</span>
                    </button>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1 font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Reserved Date:</span>
                      <span className="font-bold text-slate-900">{bk.date}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Time Slot:</span>
                      <span className="font-bold text-blue-700">{bk.timeSlot}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                      <span>Amount Paid:</span>
                      <span className="font-bold text-emerald-700">${bk.totalPaid}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-slate-500 font-mono">Pass Code: {bk.qrPassCode}</span>
                    {bk.status === "Confirmed" && (
                      <button
                        onClick={() => cancelBooking(bk.id)}
                        className="text-xs text-rose-600 font-semibold hover:underline"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Slot Modal */}
      {selectedAmenity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0b1120]/95 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-100 p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base text-white">Reserve {selectedAmenity.name}</h3>
              </div>
              <button onClick={() => setSelectedAmenity(null)} className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingMessage && (
              <div className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                bookingMessage.type === "success" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
              }`}>
                {bookingMessage.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{bookingMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              
              {/* Date Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Select Booking Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 font-mono"
                  required
                />
              </div>

              {/* Time Slot Picker */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">Select Available Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedAmenity.slotsAvailable.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl border text-xs font-mono font-medium transition ${
                        selectedSlot === slot
                          ? "bg-blue-500 border-blue-400 text-white shadow-md shadow-blue-500/20"
                          : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rules & Price Breakdown */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
                <p className="font-semibold text-blue-300 uppercase tracking-wider text-[10px]">Amenity Guidelines</p>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
                  {selectedAmenity.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-slate-200">
                  <span>Slot Rental Fee</span>
                  <span className="text-emerald-400">${selectedAmenity.pricePerHour * 2}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/30 transition flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Generate Gate Entry Pass</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* QR Pass Code Modal */}
      {qrModalPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0b1120]/95 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl text-slate-100 p-6 text-center space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="font-bold text-sm text-white">Amenity Access Pass</h3>
              <button onClick={() => setQrModalPass(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-40 h-40 bg-white p-3 rounded-2xl mx-auto border border-white/20 flex items-center justify-center shadow-lg">
              <QrCode className="w-36 h-36 text-slate-900" />
            </div>

            <div>
              <p className="font-bold text-base text-white">{qrModalPass.amenityName}</p>
              <p className="text-xs text-blue-300 font-mono mt-1">{qrModalPass.date} • {qrModalPass.timeSlot}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-xs font-mono font-bold text-blue-300">
                Code: {qrModalPass.qrPassCode}
              </span>
            </div>

            <p className="text-[11px] text-slate-400">Present this QR code or entry PIN code at the Clubhouse desk guard terminal.</p>
          </div>
        </div>
      )}

    </div>
  );
};
