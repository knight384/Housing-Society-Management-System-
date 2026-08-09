import React, { useState } from "react";
import { SocietyProvider, useSociety } from "./context/SocietyContext";
import { Navbar } from "./components/Navbar";
import { MobileFrame } from "./components/MobileFrame";
import { OverviewDashboard } from "./components/dashboard/OverviewDashboard";
import { DuesManagement } from "./components/dues/DuesManagement";
import { AmenityBooking } from "./components/amenities/AmenityBooking";
import { NoticeBoard } from "./components/notices/NoticeBoard";
import { VisitorManagement } from "./components/visitors/VisitorManagement";
import { MaintenanceHelpdesk } from "./components/tickets/MaintenanceHelpdesk";
import { CommunityHub } from "./components/community/CommunityHub";
import { FinancialReports } from "./components/admin/FinancialReports";
import { GDPRBackupCenter } from "./components/gdpr/GDPRBackupCenter";
import { RealtimeAnalytics } from "./components/analytics/RealtimeAnalytics";
import { PaymentGatewayModal } from "./components/PaymentGatewayModal";
import { DuesBill } from "./types";

function MainContent() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<DuesBill | null>(null);

  const handleOpenPaymentForBill = (bill: DuesBill) => {
    setSelectedBillForPayment(bill);
  };

  const { bills } = useSociety();

  const handleOpenPaymentById = (billId: string) => {
    const target = bills.find(b => b.id === billId);
    if (target) setSelectedBillForPayment(target);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      <div className="relative z-10">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <MobileFrame>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === "dashboard" && (
              <OverviewDashboard
                setActiveTab={setActiveTab}
                onOpenPaymentModal={handleOpenPaymentById}
              />
            )}

            {activeTab === "dues" && (
              <DuesManagement
                onOpenPaymentModal={handleOpenPaymentForBill}
              />
            )}

            {activeTab === "amenities" && <AmenityBooking />}

            {activeTab === "notices" && <NoticeBoard />}

            {activeTab === "visitors" && <VisitorManagement />}

            {activeTab === "tickets" && <MaintenanceHelpdesk />}

            {activeTab === "community" && <CommunityHub />}

            {activeTab === "analytics" && <RealtimeAnalytics />}

            {activeTab === "financials" && <FinancialReports />}

            {activeTab === "gdpr" && <GDPRBackupCenter />}
          </main>
        </MobileFrame>

        {/* Payment Gateway Modal */}
        {selectedBillForPayment && (
          <PaymentGatewayModal
            bill={selectedBillForPayment}
            onClose={() => setSelectedBillForPayment(null)}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SocietyProvider>
      <MainContent />
    </SocietyProvider>
  );
}
