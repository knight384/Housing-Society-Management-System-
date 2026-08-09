import React, { useState } from "react";
import { useSociety } from "../context/SocietyContext";
import {
  Building2,
  Shield,
  UserCheck,
  Bell,
  Smartphone,
  Monitor,
  Key,
  ChevronDown,
  CheckCircle2,
  Database,
  LayoutDashboard,
  CreditCard,
  CalendarDays,
  Megaphone,
  DoorOpen,
  Wrench,
  BarChart3,
  ShieldCheck,
  Users
} from "lucide-react";
import { NotificationDrawer } from "./NotificationDrawer";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentUser,
    switchRole,
    isMobileView,
    setIsMobileView,
    notifications,
    exportDataJSON
  } = useSociety();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `societyhub-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const navTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "dues", label: "Dues & Payments", icon: CreditCard },
    { id: "amenities", label: "Amenity Booking", icon: CalendarDays },
    { id: "notices", label: "Notice Board", icon: Megaphone },
    { id: "visitors", label: "Visitor Passes", icon: DoorOpen },
    { id: "tickets", label: "Helpdesk", icon: Wrench },
    { id: "community", label: "Community Hub", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "financials", label: "Admin & Reports", icon: ShieldCheck },
    { id: "gdpr", label: "Backup & GDPR", icon: Database }
  ];

  return (
    <>
      <header id="main-header" className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        {/* Top Brand & Actions Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo & Society Name */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-xs text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-slate-900">
                    CivicHQ
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Grand Vista Heights
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  RWA Smart Community Management
                </p>
              </div>
            </div>

            {/* Right Side Control Toolbar */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Quick Cloud Backup Button */}
              <button
                id="btn-quick-backup"
                onClick={handleDownloadBackup}
                title="Export Cloud Backup JSON"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 font-semibold transition"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Backup JSON</span>
              </button>

              {/* Mobile View Toggle */}
              <button
                id="btn-toggle-mobile-view"
                onClick={() => setIsMobileView(!isMobileView)}
                title={isMobileView ? "Switch to Full Desktop View" : "Simulate Mobile App Frame"}
                className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${
                  isMobileView
                    ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {isMobileView ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4 text-blue-600" />}
                <span className="hidden md:inline">{isMobileView ? "Desktop View" : "Mobile Mode"}</span>
              </button>

              {/* Push Notifications Bell */}
              <button
                id="btn-notifications-bell"
                onClick={() => setShowNotifDrawer(true)}
                className="relative p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                title="Push Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Role Selector */}
              <div className="relative">
                <button
                  id="btn-role-switcher"
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentUser.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    currentUser.role === 'security' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold leading-tight text-slate-900">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{currentUser.role} • {currentUser.unitNumber}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Role Dropdown Menu */}
                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-slate-800">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Portal Role</p>
                    </div>
                    
                    <button
                      id="role-switch-resident"
                      onClick={() => { switchRole('resident'); setShowRoleMenu(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition ${
                        currentUser.role === 'resident' ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-900">Resident View</p>
                        <p className="text-[10px] text-slate-500">Alex Rivera (Apt A-402)</p>
                      </div>
                      {currentUser.role === 'resident' && <CheckCircle2 className="w-4 h-4 text-blue-600 ml-auto" />}
                    </button>

                    <button
                      id="role-switch-admin"
                      onClick={() => { switchRole('admin'); setShowRoleMenu(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition mt-1 ${
                        currentUser.role === 'admin' ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      <div>
                        <p className="font-semibold text-slate-900">Society Admin / RWA</p>
                        <p className="text-[10px] text-slate-500">Sarah Jenkins (President)</p>
                      </div>
                      {currentUser.role === 'admin' && <CheckCircle2 className="w-4 h-4 text-amber-600 ml-auto" />}
                    </button>

                    <button
                      id="role-switch-security"
                      onClick={() => { switchRole('security'); setShowRoleMenu(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition mt-1 ${
                        currentUser.role === 'security' ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Key className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-semibold text-slate-900">Gate Security Terminal</p>
                        <p className="text-[10px] text-slate-500">Officer Rajan (Gate 1)</p>
                      </div>
                      {currentUser.role === 'security' && <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto" />}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Dedicated Navigation Bar Strip */}
        <div className="bg-slate-50/70 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-1 py-1.5 overflow-x-auto scrollbar-none">
              {navTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Push Notification Drawer Overlay */}
      {showNotifDrawer && (
        <NotificationDrawer onClose={() => setShowNotifDrawer(false)} />
      )}
    </>
  );
};

