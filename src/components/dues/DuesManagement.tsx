import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import { DuesBill } from "../../types";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Printer,
  Send,
  FileText,
  DollarSign,
  Filter,
  ShieldAlert
} from "lucide-react";

interface DuesManagementProps {
  onOpenPaymentModal: (bill: DuesBill) => void;
}

export const DuesManagement: React.FC<DuesManagementProps> = ({ onOpenPaymentModal }) => {
  const {
    currentUser,
    bills,
    transactions,
    sendLateFeeReminder
  } = useSociety();

  const [activeTab, setActiveTab] = useState<"bills" | "transactions">("bills");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const visibleBills = bills.filter(b => {
    // If resident, filter for their unit or show all if admin
    if (currentUser.role === "resident" && b.unitNumber !== currentUser.unitNumber) {
      return false;
    }
    if (filterStatus === "All") return true;
    return b.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">Maintenance Dues & Payment Gateway</h1>
          </div>
          <p className="text-xs text-slate-600">
            Track monthly maintenance invoices, utility breakdown, automated late fee reminders, and digital receipts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 text-xs">
          <button
            onClick={() => setActiveTab("bills")}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === "bills" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Invoices & Dues
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === "transactions" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Payment Receipts ({transactions.length})
          </button>
        </div>
      </div>

      {activeTab === "bills" ? (
        <div className="space-y-4">
          
          {/* Status Filters */}
          <div className="flex items-center justify-between gap-3 flex-wrap bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600 font-semibold">Filter:</span>
              {["All", "Pending", "Overdue", "Paid"].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    filterStatus === status
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Admin Banner Info */}
            {currentUser.role === "admin" && (
              <span className="text-xs bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-xl font-medium">
                Admin Mode: You can send automated late fee reminders to residents.
              </span>
            )}
          </div>

          {/* Bills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleBills.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-white border border-slate-200/80 rounded-2xl">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No invoices found matching status "{filterStatus}".</p>
              </div>
            ) : (
              visibleBills.map(bill => (
                <div
                  key={bill.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition hover:shadow-md ${
                    bill.status === "Overdue" ? "border-rose-300 bg-rose-50/20" :
                    bill.status === "Paid" ? "border-emerald-200 bg-emerald-50/10" :
                    "border-slate-200/80"
                  }`}
                >
                  {/* Bill Top Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-semibold text-slate-500">{bill.billNumber}</span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        bill.status === "Paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        bill.status === "Overdue" ? "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse" :
                        "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {bill.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{bill.monthYear} Maintenance</h3>
                    <p className="text-xs text-slate-600 font-medium">Flat {bill.unitNumber} • {bill.residentName}</p>
                  </div>

                  {/* Itemized Breakdown */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Maintenance</span>
                      <span className="text-slate-900 font-medium">${bill.breakdown.maintenance}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Water & Power Utilities</span>
                      <span className="text-slate-900 font-medium">${bill.breakdown.utilities}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Clubhouse Facility</span>
                      <span className="text-slate-900 font-medium">${bill.breakdown.clubhouse}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Covered Parking</span>
                      <span className="text-slate-900 font-medium">${bill.breakdown.parking}</span>
                    </div>

                    {bill.breakdown.lateFee > 0 && (
                      <div className="flex justify-between text-rose-700 font-bold pt-1 border-t border-slate-200">
                        <span>Late Fee Charge</span>
                        <span>+${bill.breakdown.lateFee}</span>
                      </div>
                    )}

                    <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total Invoice</span>
                      <span className="text-emerald-700">${bill.totalAmount}</span>
                    </div>
                  </div>

                  {/* Due Date & Action */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Due Date: <strong className="text-slate-800">{bill.dueDate}</strong></span>
                      {bill.paidDate && <span className="text-emerald-700 font-mono font-semibold">Paid {bill.paidDate}</span>}
                    </div>

                    {bill.status !== "Paid" ? (
                      <div className="flex gap-2">
                        <button
                          id={`btn-pay-bill-${bill.id}`}
                          onClick={() => onOpenPaymentModal(bill)}
                          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay Now (${bill.totalAmount})</span>
                        </button>

                        {currentUser.role === "admin" && (
                          <button
                            id={`btn-remind-bill-${bill.id}`}
                            onClick={() => sendLateFeeReminder(bill.id)}
                            title="Send Automated Late Fee Reminder Alert"
                            className="p-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl border border-amber-200 text-xs transition"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-semibold flex items-center justify-center gap-1.5">
                        <Receipt className="w-4 h-4 text-emerald-600" />
                        <span>Paid • Receipt {bill.receiptId}</span>
                      </div>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Transactions Ledger Tab */
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Payment Transactions & Receipts</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Tx Ref No</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Resident</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-semibold text-blue-700">{tx.referenceNo}</td>
                    <td className="p-3 font-bold text-slate-900">{tx.unitNumber}</td>
                    <td className="p-3 font-sans font-medium text-slate-900">{tx.residentName}</td>
                    <td className="p-3 text-slate-500">{tx.date}</td>
                    <td className="p-3 font-sans">{tx.method}</td>
                    <td className="p-3 font-bold text-emerald-700">${tx.amount}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-sans font-bold">
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition"
                        title="Print Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
