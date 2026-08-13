import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import { FamilyMember, PetProfile, NotificationChannelPreferences, Vehicle } from "../../types";
import {
  User,
  Phone,
  Mail,
  ShieldAlert,
  Home,
  Users,
  Dog,
  Bell,
  Car,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Save,
  Clock,
  Sparkles,
  ShieldCheck,
  Moon,
  Smartphone,
  MessageSquare,
  AlertCircle,
  X,
  Check,
  Calendar,
  Building,
  Key,
  HeartHandshake
} from "lucide-react";

export const ResidentProfileManagement: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    addPet,
    updatePet,
    deletePet,
    updateNotificationPreferences,
    addVehicle,
    deleteVehicle
  } = useSociety();

  const [activeTab, setActiveTab] = useState<"contact" | "family" | "pets" | "notifications">("contact");

  // Contact Details Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [ownerType, setOwnerType] = useState(currentUser.ownerType);
  const [moveInDate, setMoveInDate] = useState(currentUser.moveInDate || "2023-04-15");
  const [emergencyContact, setEmergencyContact] = useState(currentUser.emergencyContact || "");
  const [emergencyContactName, setEmergencyContactName] = useState(currentUser.emergencyContactName || "");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState(currentUser.emergencyContactRelation || "Relative");
  const [contactSaveMessage, setContactSaveMessage] = useState<string | null>(null);

  // Vehicle Form State
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehType, setVehType] = useState<"Car" | "Bike">("Car");
  const [vehRegNo, setVehRegNo] = useState("");
  const [vehSlotNo, setVehSlotNo] = useState("");

  // Family Member Modal State
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState<FamilyMember | null>(null);
  const [fmName, setFmName] = useState("");
  const [fmRelation, setFmRelation] = useState<FamilyMember["relation"]>("Spouse");
  const [fmAge, setFmAge] = useState<string>("");
  const [fmPhone, setFmPhone] = useState("");
  const [fmEmail, setFmEmail] = useState("");
  const [fmGateAccess, setFmGateAccess] = useState(true);

  // Pet Modal State
  const [showPetModal, setShowPetModal] = useState(false);
  const [editingPet, setEditingPet] = useState<PetProfile | null>(null);
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState<PetProfile["species"]>("Dog");
  const [petBreed, setPetBreed] = useState("");
  const [petVaccinated, setPetVaccinated] = useState(true);
  const [petVaccDueDate, setPetVaccDueDate] = useState("");
  const [petRabiesTag, setPetRabiesTag] = useState("");

  // Notification Preferences Form State
  const defaultNotifPrefs: NotificationChannelPreferences = currentUser.notificationPreferences || {
    email: true,
    sms: true,
    push: true,
    whatsapp: true,
    categories: {
      duesAndPayments: true,
      gateAndVisitors: true,
      noticesAndAnnouncements: true,
      maintenanceAndHelpdesk: true,
      societyEvents: true
    },
    quietHours: {
      enabled: true,
      startTime: "22:00",
      endTime: "07:00"
    }
  };

  const [notifChannels, setNotifChannels] = useState({
    email: defaultNotifPrefs.email,
    sms: defaultNotifPrefs.sms,
    push: defaultNotifPrefs.push,
    whatsapp: defaultNotifPrefs.whatsapp
  });

  const [notifCategories, setNotifCategories] = useState({
    duesAndPayments: defaultNotifPrefs.categories.duesAndPayments,
    gateAndVisitors: defaultNotifPrefs.categories.gateAndVisitors,
    noticesAndAnnouncements: defaultNotifPrefs.categories.noticesAndAnnouncements,
    maintenanceAndHelpdesk: defaultNotifPrefs.categories.maintenanceAndHelpdesk,
    societyEvents: defaultNotifPrefs.categories.societyEvents
  });

  const [quietHours, setQuietHours] = useState({
    enabled: defaultNotifPrefs.quietHours.enabled,
    startTime: defaultNotifPrefs.quietHours.startTime,
    endTime: defaultNotifPrefs.quietHours.endTime
  });

  const [notifSaveMessage, setNotifSaveMessage] = useState<string | null>(null);

  // Handle Contact Save
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      ownerType,
      moveInDate,
      emergencyContact: emergencyContact.trim(),
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactRelation
    });

    setContactSaveMessage("Contact details & emergency information saved successfully!");
    setTimeout(() => setContactSaveMessage(null), 3000);
  };

  // Handle Add/Edit Family Member
  const handleSaveFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fmName.trim()) return;

    if (editingFamilyMember) {
      updateFamilyMember(editingFamilyMember.id, {
        name: fmName.trim(),
        relation: fmRelation,
        age: fmAge ? parseInt(fmAge) : undefined,
        phone: fmPhone.trim() || undefined,
        email: fmEmail.trim() || undefined,
        gateAccessAllowed: fmGateAccess
      });
    } else {
      addFamilyMember({
        name: fmName.trim(),
        relation: fmRelation,
        age: fmAge ? parseInt(fmAge) : undefined,
        phone: fmPhone.trim() || undefined,
        email: fmEmail.trim() || undefined,
        gateAccessAllowed: fmGateAccess
      });
    }

    closeFamilyModal();
  };

  const openAddFamilyModal = () => {
    setEditingFamilyMember(null);
    setFmName("");
    setFmRelation("Spouse");
    setFmAge("");
    setFmPhone("");
    setFmEmail("");
    setFmGateAccess(true);
    setShowFamilyModal(true);
  };

  const openEditFamilyModal = (member: FamilyMember) => {
    setEditingFamilyMember(member);
    setFmName(member.name);
    setFmRelation(member.relation);
    setFmAge(member.age ? member.age.toString() : "");
    setFmPhone(member.phone || "");
    setFmEmail(member.email || "");
    setFmGateAccess(member.gateAccessAllowed);
    setShowFamilyModal(true);
  };

  const closeFamilyModal = () => {
    setShowFamilyModal(false);
    setEditingFamilyMember(null);
  };

  // Handle Add/Edit Pet
  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim()) return;

    if (editingPet) {
      updatePet(editingPet.id, {
        name: petName.trim(),
        species: petSpecies,
        breed: petBreed.trim() || undefined,
        vaccinated: petVaccinated,
        vaccinationDueDate: petVaccDueDate || undefined,
        rabiesTagNumber: petRabiesTag.trim() || undefined
      });
    } else {
      addPet({
        name: petName.trim(),
        species: petSpecies,
        breed: petBreed.trim() || undefined,
        vaccinated: petVaccinated,
        vaccinationDueDate: petVaccDueDate || undefined,
        rabiesTagNumber: petRabiesTag.trim() || undefined
      });
    }

    closePetModal();
  };

  const openAddPetModal = () => {
    setEditingPet(null);
    setPetName("");
    setPetSpecies("Dog");
    setPetBreed("");
    setPetVaccinated(true);
    setPetVaccDueDate("2027-02-15");
    setPetRabiesTag("");
    setShowPetModal(true);
  };

  const openEditPetModal = (pet: PetProfile) => {
    setEditingPet(pet);
    setPetName(pet.name);
    setPetSpecies(pet.species);
    setPetBreed(pet.breed || "");
    setPetVaccinated(pet.vaccinated);
    setPetVaccDueDate(pet.vaccinationDueDate || "");
    setPetRabiesTag(pet.rabiesTagNumber || "");
    setShowPetModal(true);
  };

  const closePetModal = () => {
    setShowPetModal(false);
    setEditingPet(null);
  };

  // Handle Add Vehicle
  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehRegNo.trim() || !vehSlotNo.trim()) return;

    addVehicle({
      type: vehType,
      regNo: vehRegNo.trim().toUpperCase(),
      slotNo: vehSlotNo.trim().toUpperCase()
    });

    setShowVehicleModal(false);
    setVehRegNo("");
    setVehSlotNo("");
  };

  // Handle Save Notifications
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationPreferences({
      email: notifChannels.email,
      sms: notifChannels.sms,
      push: notifChannels.push,
      whatsapp: notifChannels.whatsapp,
      categories: notifCategories,
      quietHours
    });

    setNotifSaveMessage("Notification delivery channels & quiet hours updated!");
    setTimeout(() => setNotifSaveMessage(null), 3000);
  };

  // Species Icon Helper
  const getPetSpeciesEmoji = (species: PetProfile["species"]) => {
    switch (species) {
      case "Dog":
        return "🐶";
      case "Cat":
        return "🐱";
      case "Bird":
        return "🦜";
      case "Fish":
        return "🐠";
      default:
        return "🐾";
    }
  };

  const familyMembers = currentUser.familyMembers || [];
  const pets = currentUser.pets || [];
  const vehicles = currentUser.vehicles || [];

  return (
    <div className="space-y-6">
      {/* Profile Overview Header Card */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* User Details Avatar & Unit Badge */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              {currentUser.name.split(" ").map(n => n[0]).join("")}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
                <span className="bg-indigo-50 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase font-mono">
                  {currentUser.role}
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Key className="w-3 h-3 text-emerald-600" />
                  <span>{currentUser.ownerType}</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Unit <strong className="text-slate-900 font-mono">{currentUser.unitNumber}</strong> ({currentUser.tower})</span>
                <span className="text-slate-300">•</span>
                <span>{currentUser.flatType}</span>
              </p>

              <p className="text-[11px] text-slate-500 flex items-center gap-3 pt-0.5 font-medium">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {currentUser.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {currentUser.phone}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Unit Summary Pills */}
          <div className="flex items-center gap-3 shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-center px-3 border-r border-slate-200">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Family</span>
              <span className="text-base font-bold text-slate-900 font-mono">{familyMembers.length}</span>
            </div>
            <div className="text-center px-3 border-r border-slate-200">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Pets</span>
              <span className="text-base font-bold text-slate-900 font-mono">{pets.length}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Vehicles</span>
              <span className="text-base font-bold text-slate-900 font-mono">{vehicles.length}</span>
            </div>
          </div>

        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pt-2 overflow-x-auto scrollbar-none">
          <button
            id="tab-contact-details"
            onClick={() => setActiveTab("contact")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "contact"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Contact & Unit Info</span>
          </button>

          <button
            id="tab-family-members"
            onClick={() => setActiveTab("family")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "family"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Family Members ({familyMembers.length})</span>
          </button>

          <button
            id="tab-pets-directory"
            onClick={() => setActiveTab("pets")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "pets"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Dog className="w-4 h-4" />
            <span>Unit Pets ({pets.length})</span>
          </button>

          <button
            id="tab-notification-channels"
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "notifications"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notification Channels</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CONTACT DETAILS & VEHICLES */}
      {activeTab === "contact" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  <span>Update Contact Details & Emergency Contacts</span>
                </h2>
                <p className="text-xs text-slate-500">Manage your primary contact info, occupancy status, and gate emergency contacts.</p>
              </div>
            </div>

            {contactSaveMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{contactSaveMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Resident Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Primary Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Primary Mobile Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Occupancy Status</label>
                  <select
                    value={ownerType}
                    onChange={e => setOwnerType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none"
                  >
                    <option value="Owner">Owner Resident</option>
                    <option value="Tenant">Tenant / Lessee</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Move-In Date</label>
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={e => setMoveInDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Tower & Flat Unit</label>
                  <input
                    type="text"
                    value={`${currentUser.tower} — Unit ${currentUser.unitNumber}`}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Emergency Contact Sub-card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Gate Security Emergency Contact</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Contact Person Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Elena Rivera"
                      value={emergencyContactName}
                      onChange={e => setEmergencyContactName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Relationship</label>
                    <select
                      value={emergencyContactRelation}
                      onChange={e => setEmergencyContactRelation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Friend">Friend / Relative</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Emergency Phone #</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={emergencyContact}
                      onChange={e => setEmergencyContact(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Contact Details</span>
                </button>
              </div>
            </form>
          </div>

          {/* Vehicles Card */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Car className="w-4 h-4 text-indigo-600" />
                <span>Registered Vehicles</span>
              </h2>

              <button
                onClick={() => setShowVehicleModal(true)}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Vehicle</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">Vehicles registered for gate boom barrier RFID tag access.</p>

            <div className="space-y-2.5">
              {vehicles.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No vehicles registered under this unit.</p>
              ) : (
                vehicles.map((v, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-200 text-slate-700 rounded-lg">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs font-mono">{v.regNo}</span>
                          <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {v.type}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block">Slot: <strong className="text-slate-700 font-mono">{v.slotNo}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteVehicle(v.regNo)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Deregister Vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: FAMILY MEMBERS & GATE ACCESS */}
      {activeTab === "family" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Family Members & Resident Co-Occupants</span>
              </h2>
              <p className="text-xs text-slate-500">
                Manage family members living in unit {currentUser.unitNumber}. Enable gate security entry permissions and emergency alerts.
              </p>
            </div>

            <button
              onClick={openAddFamilyModal}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Family Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {familyMembers.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 space-y-2">
                <Users className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">No family members registered yet.</p>
                <p className="text-xs text-slate-500">Click "Add Family Member" above to list co-residents.</p>
              </div>
            ) : (
              familyMembers.map(member => (
                <div key={member.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 relative group flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                          {member.relation}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm mt-1">{member.name}</h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditFamilyModal(member)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFamilyMember(member.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      {member.age && (
                        <p className="flex items-center gap-1.5 font-medium">
                          <span>Age: <strong className="text-slate-800 font-mono">{member.age} yrs</strong></span>
                        </p>
                      )}

                      {member.phone && (
                        <p className="flex items-center gap-1.5 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{member.phone}</span>
                        </p>
                      )}

                      {member.email && (
                        <p className="flex items-center gap-1.5 font-medium">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{member.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80">
                    {member.gateAccessAllowed ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Gate Security Access Allowed</span>
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Visitor Pass Required at Gate</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PETS DIRECTORY */}
      {activeTab === "pets" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Dog className="w-5 h-5 text-indigo-600" />
                <span>Unit Pets Directory & Vaccination Records</span>
              </h2>
              <p className="text-xs text-slate-500">
                Register household pets for RWA compliance, rabies vaccination tracking, and community lost & found logs.
              </p>
            </div>

            <button
              onClick={openAddPetModal}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Pet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 space-y-2">
                <Dog className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">No pets registered for unit {currentUser.unitNumber}.</p>
                <p className="text-xs text-slate-500">Click "Register New Pet" above to add dog, cat, or pet details.</p>
              </div>
            ) : (
              pets.map(pet => (
                <div key={pet.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 relative flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getPetSpeciesEmoji(pet.species)}</span>
                        <div>
                          <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                            {pet.species}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm mt-0.5">{pet.name}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditPetModal(pet)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePet(pet.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      {pet.breed && (
                        <p className="font-medium">
                          Breed: <strong className="text-slate-800">{pet.breed}</strong>
                        </p>
                      )}

                      {pet.rabiesTagNumber && (
                        <p className="font-medium">
                          Rabies Tag #: <strong className="text-slate-900 font-mono">{pet.rabiesTagNumber}</strong>
                        </p>
                      )}

                      {pet.vaccinationDueDate && (
                        <p className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Vaccine Due: <strong className="text-slate-900 font-mono">{pet.vaccinationDueDate}</strong></span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80">
                    {pet.vaccinated ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Vaccination Up to Date</span>
                      </span>
                    ) : (
                      <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Vaccination Overdue</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATION CHANNELS & PREFERENCES */}
      {activeTab === "notifications" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              <span>Notification Channels & Quiet Hours Delivery Settings</span>
            </h2>
            <p className="text-xs text-slate-500">Configure how and when society management sends alerts, visitor notifications, and bill reminders.</p>
          </div>

          {notifSaveMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notifSaveMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveNotifications} className="space-y-6 text-xs">
            
            {/* Delivery Channels */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">1. Preferred Delivery Channels</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                
                <label className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  notifChannels.email ? "bg-indigo-50/60 border-indigo-300 text-indigo-950" : "bg-slate-50 border-slate-200 text-slate-600"
                }`}>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <div>
                      <span className="font-bold text-xs block">Email Alerts</span>
                      <span className="text-[10px] text-slate-500">Official PDFs & receipts</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifChannels.email}
                    onChange={e => setNotifChannels(prev => ({ ...prev, email: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>

                <label className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  notifChannels.sms ? "bg-indigo-50/60 border-indigo-300 text-indigo-950" : "bg-slate-50 border-slate-200 text-slate-600"
                }`}>
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-amber-600" />
                    <div>
                      <span className="font-bold text-xs block">SMS Text</span>
                      <span className="text-[10px] text-slate-500">Gate OTPs & emergencies</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifChannels.sms}
                    onChange={e => setNotifChannels(prev => ({ ...prev, sms: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>

                <label className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  notifChannels.push ? "bg-indigo-50/60 border-indigo-300 text-indigo-950" : "bg-slate-50 border-slate-200 text-slate-600"
                }`}>
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-xs block">In-App Push</span>
                      <span className="text-[10px] text-slate-500">Instant visitor approvals</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifChannels.push}
                    onChange={e => setNotifChannels(prev => ({ ...prev, push: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>

                <label className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  notifChannels.whatsapp ? "bg-indigo-50/60 border-indigo-300 text-indigo-950" : "bg-slate-50 border-slate-200 text-slate-600"
                }`}>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-teal-600" />
                    <div>
                      <span className="font-bold text-xs block">WhatsApp</span>
                      <span className="text-[10px] text-slate-500">Society notices & events</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifChannels.whatsapp}
                    onChange={e => setNotifChannels(prev => ({ ...prev, whatsapp: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>

              </div>
            </div>

            {/* Category Preferences */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">2. Category Notification Toggles</h3>
              
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                
                <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Maintenance Dues & Monthly Bills</span>
                    <span className="text-[11px] text-slate-500">Reminders for upcoming dues, late fees, and payment receipts.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifCategories.duesAndPayments}
                    onChange={e => setNotifCategories(prev => ({ ...prev, duesAndPayments: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Gate Entry & Visitor Clearances</span>
                    <span className="text-[11px] text-slate-500">Real-time alerts when guests, delivery, or cab drivers arrive at Gate 1.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifCategories.gateAndVisitors}
                    onChange={e => setNotifCategories(prev => ({ ...prev, gateAndVisitors: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Society Notices & Rule Changes</span>
                    <span className="text-[11px] text-slate-500">RWA circulars, water shutdown advisories, and emergency drills.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifCategories.noticesAndAnnouncements}
                    onChange={e => setNotifCategories(prev => ({ ...prev, noticesAndAnnouncements: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Helpdesk Ticket Progress Updates</span>
                    <span className="text-[11px] text-slate-500">Status changes when a plumber or technician is assigned to your ticket.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifCategories.maintenanceAndHelpdesk}
                    onChange={e => setNotifCategories(prev => ({ ...prev, maintenanceAndHelpdesk: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Community & Cultural Events</span>
                    <span className="text-[11px] text-slate-500">Announcements regarding festival celebrations, sports meets, and meetings.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifCategories.societyEvents}
                    onChange={e => setNotifCategories(prev => ({ ...prev, societyEvents: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </div>

              </div>
            </div>

            {/* Quiet Hours */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>3. Quiet Hours / Do Not Disturb Mode</span>
              </h3>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Enable Quiet Hours</span>
                    <span className="text-[11px] text-slate-500">Suppress non-emergency promotional & notice notifications during night hours.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={quietHours.enabled}
                    onChange={e => setQuietHours(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </div>

                {quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/80">
                    <div>
                      <label className="text-slate-600 block mb-1 font-semibold">Quiet Hours Start</label>
                      <input
                        type="time"
                        value={quietHours.startTime}
                        onChange={e => setQuietHours(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-600 block mb-1 font-semibold">Quiet Hours End</label>
                      <input
                        type="time"
                        value={quietHours.endTime}
                        onChange={e => setQuietHours(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Delivery Preferences</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* FAMILY MEMBER MODAL */}
      {showFamilyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 text-slate-900 shadow-xl relative">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingFamilyMember ? "Edit Family Member Details" : "Add Family Member"}
              </h3>
              <button onClick={closeFamilyModal} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFamilyMember} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-bold">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sophia Rivera"
                  value={fmName}
                  onChange={e => setFmName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Relationship</label>
                  <select
                    value={fmRelation}
                    onChange={e => setFmRelation(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Relative">Relative</option>
                    <option value="Co-Resident">Co-Resident</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Age (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 32"
                    value={fmAge}
                    onChange={e => setFmAge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={fmPhone}
                    onChange={e => setFmPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="sophia@example.com"
                    value={fmEmail}
                    onChange={e => setFmEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 block text-xs">Allow Gate Security Clearance</span>
                  <span className="text-[10px] text-emerald-700">Pre-approved entry at society gates without visitor pass.</span>
                </div>
                <input
                  type="checkbox"
                  checked={fmGateAccess}
                  onChange={e => setFmGateAccess(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeFamilyModal}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
                >
                  Save Member
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* PET MODAL */}
      {showPetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 text-slate-900 shadow-xl relative">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingPet ? "Edit Pet Details" : "Register Household Pet"}
              </h3>
              <button onClick={closePetModal} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePet} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-bold">Pet Name</label>
                <input
                  type="text"
                  placeholder="e.g. Milo"
                  value={petName}
                  onChange={e => setPetName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Species</label>
                  <select
                    value={petSpecies}
                    onChange={e => setPetSpecies(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  >
                    <option value="Dog">Dog 🐶</option>
                    <option value="Cat">Cat 🐱</option>
                    <option value="Bird">Bird 🦜</option>
                    <option value="Fish">Fish 🐠</option>
                    <option value="Other">Other 🐾</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Breed</label>
                  <input
                    type="text"
                    placeholder="e.g. Golden Retriever"
                    value={petBreed}
                    onChange={e => setPetBreed(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Next Vaccination Due</label>
                  <input
                    type="date"
                    value={petVaccDueDate}
                    onChange={e => setPetVaccDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Rabies Tag / License #</label>
                  <input
                    type="text"
                    placeholder="e.g. RAB-2026-904"
                    value={petRabiesTag}
                    onChange={e => setPetRabiesTag(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-900 block text-xs">Vaccinations Up to Date</span>
                  <span className="text-[10px] text-indigo-700">Pet rabies and core vaccines verified.</span>
                </div>
                <input
                  type="checkbox"
                  checked={petVaccinated}
                  onChange={e => setPetVaccinated(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={closePetModal}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
                >
                  Save Pet
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* VEHICLE MODAL */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 space-y-4 text-slate-900 shadow-xl relative">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Register Vehicle</h3>
              <button onClick={() => setShowVehicleModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-bold">Vehicle Type</label>
                <select
                  value={vehType}
                  onChange={e => setVehType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
                >
                  <option value="Car">Car (4-Wheeler)</option>
                  <option value="Bike">Bike / Two-Wheeler</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-bold">Registration / Plate Number</label>
                <input
                  type="text"
                  placeholder="e.g. GV-402-C"
                  value={vehRegNo}
                  onChange={e => setVehRegNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-bold">Assigned Parking Slot No.</label>
                <input
                  type="text"
                  placeholder="e.g. B1-44"
                  value={vehSlotNo}
                  onChange={e => setVehSlotNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none font-mono"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVehicleModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
                >
                  Register Vehicle
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
