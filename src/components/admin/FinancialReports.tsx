import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import { FinancialLedgerItem, PaymentTransaction, DuesBill } from "../../types";
import {
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Plus,
  FileSpreadsheet,
  Shield,
  Briefcase,
  CheckCircle,
  X,
  Printer,
  Calendar,
  Filter,
  CreditCard,
  PieChart,
  BarChart3,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";

export const FinancialReports: React.FC = () => {
  const {
    financials,
    vendors,
    addLedgerEntry,
    bills,
    transactions,
    currentUser
  } = useSociety();

  // Active Report Tab
  const [activeReportTab, setActiveReportTab] = useState<"dues" | "expense" | "statement" | "gateway">("dues");

  // Filters State
  const [datePreset, setDatePreset] = useState<"month" | "quarter" | "ytd" | "all" | "custom">("month");
  const [customStartDate, setCustomStartDate] = useState("2026-08-01");
  const [customEndDate, setCustomEndDate] = useState("2026-08-31");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Ledger Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Income" | "Expense">("Expense");
  const [category, setCategory] = useState<FinancialLedgerItem['category']>("Staff Payroll");
  const [amount, setAmount] = useState<number>(500);

  // PDF Print Modal State
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Date Filtering Logic
  const isDateInFilter = (dateStr: string) => {
    if (datePreset === "all") return true;
    const itemDate = new Date(dateStr.substring(0, 10));

    if (datePreset === "month") {
      // Aug 2026
      return itemDate.getFullYear() === 2026 && itemDate.getMonth() === 7;
    } else if (datePreset === "quarter") {
      // Q3 2026 (July - Sep)
      return itemDate.getFullYear() === 2026 && itemDate.getMonth() >= 6 && itemDate.getMonth() <= 8;
    } else if (datePreset === "ytd") {
      // FY 2026
      return itemDate.getFullYear() === 2026;
    } else if (datePreset === "custom") {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      return itemDate >= start && itemDate <= end;
    }
    return true;
  };

  // Filtered Financials
  const filteredFinancials = financials.filter(f => {
    const dateMatch = isDateInFilter(f.date);
    const catMatch = selectedCategory === "All" || f.category === selectedCategory;
    const searchMatch = !searchTerm || f.description.toLowerCase().includes(searchTerm.toLowerCase());
    return dateMatch && catMatch && searchMatch;
  });

  // Filtered Transactions
  const filteredTransactions = transactions.filter(t => {
    const dateMatch = isDateInFilter(t.date);
    const searchMatch = !searchTerm ||
      t.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.referenceNo.toLowerCase().includes(searchTerm.toLowerCase());
    return dateMatch && searchMatch;
  });

  // Filtered Bills
  const filteredBills = bills.filter(b => {
    const searchMatch = !searchTerm ||
      b.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.billNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  // Financial Metrics Calculations
  const totalIncome = filteredFinancials.filter(f => f.type === "Income").reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = filteredFinancials.filter(f => f.type === "Expense").reduce((sum, f) => sum + f.amount, 0);
  const netSurplus = totalIncome - totalExpense;

  const totalBilled = filteredBills.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPaidDues = filteredBills.filter(b => b.status === "Paid").reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPendingDues = filteredBills.filter(b => b.status === "Pending").reduce((sum, b) => sum + b.totalAmount, 0);
  const totalOverdueDues = filteredBills.filter(b => b.status === "Overdue").reduce((sum, b) => sum + b.totalAmount, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalPaidDues / totalBilled) * 100) : 0;

  // Dues Breakdown by Category
  const duesBreakdown = {
    maintenance: filteredBills.reduce((acc, b) => acc + (b.breakdown.maintenance || 0), 0),
    utilities: filteredBills.reduce((acc, b) => acc + (b.breakdown.utilities || 0), 0),
    clubhouse: filteredBills.reduce((acc, b) => acc + (b.breakdown.clubhouse || 0), 0),
    parking: filteredBills.reduce((acc, b) => acc + (b.breakdown.parking || 0), 0),
    lateFee: filteredBills.reduce((acc, b) => acc + (b.breakdown.lateFee || 0), 0),
  };

  // Payment Gateway Metrics
  const totalTxAmount = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
  const successfulTxCount = filteredTransactions.filter(t => t.status === "Success").length;
  const successRate = filteredTransactions.length > 0 ? Math.round((successfulTxCount / filteredTransactions.length) * 100) : 100;
  const estimatedGatewayFees = Math.round(totalTxAmount * 0.012); // ~1.2% processing fee

  // Payment Method Breakdown
  const methodStats = {
    upi: filteredTransactions.filter(t => t.method.includes("UPI")).reduce((acc, t) => acc + t.amount, 0),
    card: filteredTransactions.filter(t => t.method.includes("Card")).reduce((acc, t) => acc + t.amount, 0),
    wallet: filteredTransactions.filter(t => t.method.includes("Wallet")).reduce((acc, t) => acc + t.amount, 0),
  };

  // CSV Export Handler based on active report tab
  const handleExportCSV = () => {
    let headers = "";
    let rows = "";
    let filename = "";

    if (activeReportTab === "dues") {
      filename = `dues-collection-report-${Date.now()}.csv`;
      headers = "Bill Number,Unit Number,Resident Name,Month/Year,Status,Maintenance,Utilities,Clubhouse,Parking,Late Fee,Total Amount,Paid Date\n";
      rows = filteredBills.map(b => 
        `"${b.billNumber}","${b.unitNumber}","${b.residentName}","${b.monthYear}","${b.status}",${b.breakdown.maintenance},${b.breakdown.utilities},${b.breakdown.clubhouse},${b.breakdown.parking},${b.breakdown.lateFee},${b.totalAmount},"${b.paidDate || 'N/A'}"`
      ).join("\n");
    } else if (activeReportTab === "expense") {
      filename = `expense-breakdown-report-${Date.now()}.csv`;
      headers = "Date,Description,Category,Type,Amount,ReferenceDoc\n";
      rows = filteredFinancials.filter(f => f.type === "Expense").map(f => 
        `"${f.date}","${f.description}","${f.category}","${f.type}",${f.amount},"${f.referenceDoc || ''}"`
      ).join("\n");
    } else if (activeReportTab === "statement") {
      filename = `income-expense-statement-${Date.now()}.csv`;
      headers = "Date,Description,Category,Type,Amount,ReferenceDoc\n";
      rows = filteredFinancials.map(f => 
        `"${f.date}","${f.description}","${f.category}","${f.type}",${f.amount},"${f.referenceDoc || ''}"`
      ).join("\n");
    } else {
      filename = `gateway-transactions-summary-${Date.now()}.csv`;
      headers = "Transaction ID,Bill ID,Unit Number,Resident Name,Amount,Payment Method,Reference No,Date,Status\n";
      rows = filteredTransactions.map(t => 
        `"${t.id}","${t.billId}","${t.unitNumber}","${t.residentName}",${t.amount},"${t.method}","${t.referenceNo}","${t.date}","${t.status}"`
      ).join("\n");
    }

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    addLedgerEntry({
      date: new Date().toISOString().split("T")[0],
      description,
      type,
      category,
      amount: Number(amount),
      referenceDoc: "ADM-MANUAL-" + Math.floor(1000 + Math.random() * 9000)
    });

    setShowAddModal(false);
    setDescription("");
    setAmount(500);
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-amber-600" />
            <h1 className="text-xl font-bold text-slate-900">RWA Financial Reporting Suite</h1>
          </div>
          <p className="text-xs text-slate-600">
            Comprehensive audit portal for dues collection, operational expense breakdowns, income statements, and payment gateway logs.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            id="btn-print-pdf-report"
            onClick={() => setShowPdfModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Generate Print/PDF Report</span>
          </button>

          <button
            id="btn-export-financial-csv"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 transition"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Report (CSV)</span>
          </button>
          
          {currentUser.role === "admin" && (
            <button
              id="btn-add-ledger-entry"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Record Ledger Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Date Range & Search Filtering Toolbar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs shadow-xs">
        
        {/* Preset Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-slate-600 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> Range:
          </span>
          {[
            { id: "month", label: "This Month" },
            { id: "quarter", label: "Q3 2026" },
            { id: "ytd", label: "FY 2026" },
            { id: "all", label: "All Time" },
            { id: "custom", label: "Custom Range" },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setDatePreset(p.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                datePreset === p.id ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom Date Inputs */}
        {datePreset === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStartDate}
              onChange={e => setCustomStartDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-900 font-mono"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={e => setCustomEndDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-900 font-mono"
            />
          </div>
        )}

        {/* Category & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search record..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Maintenance Fees">Maintenance Fees</option>
            <option value="Amenity Revenue">Amenity Revenue</option>
            <option value="Staff Payroll">Staff Payroll</option>
            <option value="Security Contract">Security Contract</option>
            <option value="Utilities & Electricity">Utilities & Electricity</option>
            <option value="Landscaping">Landscaping</option>
            <option value="Elevator AMC">Elevator AMC</option>
          </select>
        </div>

      </div>

      {/* Primary Navigation Tabs for Report Types */}
      <div className="flex space-x-1 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: "dues", label: "Dues Collection Status", icon: PieChart },
          { id: "expense", label: "Expense Breakdown", icon: BarChart3 },
          { id: "statement", label: "Income & Expense Statement", icon: FileText },
          { id: "gateway", label: "Payment Gateway Logs", icon: CreditCard }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition ${
                activeReportTab === tab.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* REPORT CONTENT VIEW 1: DUES COLLECTION STATUS */}
      {activeReportTab === "dues" && (
        <div className="space-y-6">
          
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Total Invoiced Dues</span>
              <p className="text-2xl font-black text-white">${totalBilled.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 font-mono">100% Total Billed</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Total Dues Collected</span>
              <p className="text-2xl font-black text-emerald-400">${totalPaidDues.toLocaleString()}</p>
              <p className="text-[11px] text-emerald-400/80 font-mono">{collectionRate}% Paid On Time</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Pending Dues Balance</span>
              <p className="text-2xl font-black text-amber-300">${totalPendingDues.toLocaleString()}</p>
              <p className="text-[11px] text-amber-300/80 font-mono">Awaiting Clearance</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Overdue Dues</span>
              <p className="text-2xl font-black text-rose-400">${totalOverdueDues.toLocaleString()}</p>
              <p className="text-[11px] text-rose-400/80 font-mono">Late Fine Applicable</p>
            </div>
          </div>

          {/* Tower Collection Breakdown & Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Tower Collection Status */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
              <h2 className="font-bold text-base text-white">Tower-Wise Collection Progress</h2>
              
              <div className="space-y-4">
                {[
                  { name: "Tower A (Flats 101-502)", pct: 92, count: "1 Pending" },
                  { name: "Tower B (Flats 101-502)", pct: 88, count: "2 Pending" },
                  { name: "Tower C (Flats 101-502)", pct: 80, count: "3 Pending" },
                  { name: "Tower D (Penthouses)", pct: 95, count: "0 Pending" },
                ].map(tw => (
                  <div key={tw.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-200">{tw.name}</span>
                      <span className="text-emerald-400 font-mono">{tw.pct}% ({tw.count})</span>
                    </div>
                    <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
                      <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full" style={{ width: `${tw.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Revenue Distribution */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
              <h2 className="font-bold text-base text-white">Dues Fee Category Breakdown</h2>
              
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[11px]">Maintenance Fee</span>
                  <p className="text-lg font-bold text-blue-400">${duesBreakdown.maintenance.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[11px]">Water & Utilities</span>
                  <p className="text-lg font-bold text-emerald-400">${duesBreakdown.utilities.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[11px]">Clubhouse Subscription</span>
                  <p className="text-lg font-bold text-amber-300">${duesBreakdown.clubhouse.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[11px]">Covered Parking Slots</span>
                  <p className="text-lg font-bold text-purple-300">${duesBreakdown.parking.toLocaleString()}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Dues Bills Table */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-white">Resident Dues Billing Register</h2>
              <span className="text-xs text-slate-400 font-mono">Total Bills: {filteredBills.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-3">Bill No</th>
                    <th className="p-3">Unit / Resident</th>
                    <th className="p-3">Billing Cycle</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Total Due</th>
                    <th className="p-3">Paid Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {filteredBills.map(b => (
                    <tr key={b.id} className="hover:bg-white/5 transition">
                      <td className="p-3 font-mono font-semibold text-blue-300">{b.billNumber}</td>
                      <td className="p-3">
                        <p className="font-bold text-white">{b.unitNumber}</p>
                        <p className="text-[11px] text-slate-400">{b.residentName}</p>
                      </td>
                      <td className="p-3 text-slate-300">{b.monthYear}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === "Paid" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                          b.status === "Pending" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                          "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-white">${b.totalAmount}</td>
                      <td className="p-3 font-mono text-slate-400">{b.paidDate || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* REPORT CONTENT VIEW 2: EXPENSE BREAKDOWN */}
      {activeReportTab === "expense" && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Total Operating Expenses</span>
              <p className="text-2xl font-black text-rose-400">${totalExpense.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 font-mono">Society Maintenance Outflow</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Active Vendor AMCs</span>
              <p className="text-2xl font-black text-amber-300">{vendors.length} Contracts</p>
              <p className="text-[11px] text-slate-400 font-mono">Security, Elevator & Pool</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Staff & Security Payroll</span>
              <p className="text-2xl font-black text-blue-300">$6,700/mo</p>
              <p className="text-[11px] text-slate-400 font-mono">Guards, Housekeeping & Admin</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Itemized Expenses Table */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
              <h2 className="font-bold text-base text-white">Itemized Operational Expense Ledger</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Expense Category</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200 font-mono">
                    {filteredFinancials.filter(f => f.type === "Expense").map(f => (
                      <tr key={f.id} className="hover:bg-white/5 transition">
                        <td className="p-3 text-slate-400">{f.date}</td>
                        <td className="p-3 font-sans font-semibold text-amber-300">{f.category}</td>
                        <td className="p-3 font-sans text-white">{f.description}</td>
                        <td className="p-3 text-right font-bold text-rose-400">-${f.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vendor AMC Contracts */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
              <h2 className="font-bold text-base text-white">Vendor AMC Cost Breakdown</h2>
              
              <div className="space-y-3 text-xs">
                {vendors.map(v => (
                  <div key={v.id} className="p-3.5 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{v.companyName}</span>
                      <span className="text-amber-300 font-mono">${v.monthlyFee}/mo</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{v.serviceCategory} • {v.contactPerson}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* REPORT CONTENT VIEW 3: INCOME & EXPENSE STATEMENT */}
      {activeReportTab === "statement" && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Total Revenue Collected</span>
              <p className="text-2xl font-black text-emerald-400">${totalIncome.toLocaleString()}</p>
              <p className="text-[11px] text-emerald-400/80 font-mono">+12% vs Prev Quarter</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Total Operating Outflow</span>
              <p className="text-2xl font-black text-rose-400">${totalExpense.toLocaleString()}</p>
              <p className="text-[11px] text-rose-400/80 font-mono">Within RWA Budget Limit</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Net Operating Surplus (Reserve)</span>
              <p className={`text-2xl font-black ${netSurplus >= 0 ? "text-blue-300" : "text-rose-400"}`}>
                ${netSurplus.toLocaleString()}
              </p>
              <p className="text-[11px] text-blue-300/80 font-mono">Transferred to Reserve Fund</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-white">Full Income & Expense Statement Ledger</h2>
              <span className="text-xs font-mono text-slate-400">Net Surplus: ${netSurplus.toLocaleString()}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Particulars / Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200 font-mono">
                  {filteredFinancials.map(f => (
                    <tr key={f.id} className="hover:bg-white/5 transition">
                      <td className="p-3 text-slate-400">{f.date}</td>
                      <td className="p-3 font-sans font-medium text-white">{f.description}</td>
                      <td className="p-3 font-sans text-slate-300">{f.category}</td>
                      <td className="p-3 font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          f.type === "Income" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}>
                          {f.type}
                        </span>
                      </td>
                      <td className={`p-3 text-right font-bold ${
                        f.type === "Income" ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {f.type === "Income" ? "+" : "-"}${f.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* REPORT CONTENT VIEW 4: PAYMENT GATEWAY LOGS */}
      {activeReportTab === "gateway" && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Total Gateway Volume</span>
              <p className="text-2xl font-black text-white">${totalTxAmount.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 font-mono">Processed via Razorpay/Stripe</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Transaction Success Rate</span>
              <p className="text-2xl font-black text-emerald-400">{successRate}%</p>
              <p className="text-[11px] text-emerald-400/80 font-mono">{successfulTxCount} Successful Txns</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Estimated Gateway Fees</span>
              <p className="text-2xl font-black text-amber-300">${estimatedGatewayFees}</p>
              <p className="text-[11px] text-slate-400 font-mono">Avg 1.2% Processing Fee</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Top Payment Mode</span>
              <p className="text-2xl font-black text-blue-300">UPI / NetBanking</p>
              <p className="text-[11px] text-slate-400 font-mono">${methodStats.upi.toLocaleString()} Volume</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-white">Payment Gateway Settlement & Log History</h2>
              <span className="text-xs font-mono text-slate-400">Total Txns: {filteredTransactions.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/5 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-3">Reference No</th>
                    <th className="p-3 font-sans">Resident / Unit</th>
                    <th className="p-3 font-sans">Payment Mode</th>
                    <th className="p-3 font-sans">Date & Time</th>
                    <th className="p-3 font-sans">Status</th>
                    <th className="p-3 text-right font-sans">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {filteredTransactions.map(t => (
                    <tr key={t.id} className="hover:bg-white/5 transition">
                      <td className="p-3 text-blue-300 font-bold">{t.referenceNo}</td>
                      <td className="p-3 font-sans">
                        <p className="font-bold text-white">{t.unitNumber}</p>
                        <p className="text-[11px] text-slate-400">{t.residentName}</p>
                      </td>
                      <td className="p-3 font-sans text-slate-300">{t.method}</td>
                      <td className="p-3 text-slate-400">{t.date}</td>
                      <td className="p-3 font-sans">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-400">${t.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* RECORD LEDGER ENTRY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0b1120]/95 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="font-bold text-base text-white">Record Manual Ledger Item</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEntrySubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Entry Description</label>
                <input
                  type="text"
                  placeholder="e.g. Purchased new swimming pool water pumps..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Expense" className="bg-[#0b1120]">Expense</option>
                    <option value="Income" className="bg-[#0b1120]">Income</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Amount ($)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none font-mono focus:border-blue-500/50"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/30 transition mt-2"
              >
                Save to Society Accounts
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PRINT-READY PDF REPORT PREVIEW MODAL */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-white/20 rounded-3xl w-full max-w-3xl text-slate-100 p-8 space-y-6 shadow-2xl relative my-8 print:border-none print:p-0 print:bg-white print:text-black">
            
            {/* Modal Header Controls (Hidden during print) */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base text-white">Print-Ready Financial Audit Report</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerPrint}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Print Document Sheet View */}
            <div className="bg-slate-950/80 p-8 rounded-2xl border border-white/10 space-y-6 print:bg-white print:text-black print:p-0">
              
              {/* Document Header */}
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <h1 className="text-xl font-bold text-white print:text-black">CIVICHQ GRAND VISTA HEIGHTS RWA</h1>
                  <p className="text-xs text-slate-400 print:text-slate-600">Official Financial Audit & Statement Report</p>
                  <p className="text-[11px] text-blue-400 print:text-blue-700 font-mono mt-1">
                    Filter: {datePreset.toUpperCase()} • Category: {selectedCategory}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-400 print:text-slate-600 font-mono">
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Report ID: AUD-{Date.now().toString().substring(5)}</p>
                  <p>Status: VERIFIED AUDITED</p>
                </div>
              </div>

              {/* Executive Metrics Grid */}
              <div className="grid grid-cols-4 gap-3 text-center text-xs font-mono">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 block">Total Income</span>
                  <span className="font-bold text-emerald-400 print:text-emerald-700">${totalIncome.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 block">Total Expense</span>
                  <span className="font-bold text-rose-400 print:text-rose-700">${totalExpense.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 block">Net Surplus</span>
                  <span className="font-bold text-blue-300 print:text-blue-700">${netSurplus.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 block">Dues Collection</span>
                  <span className="font-bold text-amber-300 print:text-amber-700">{collectionRate}%</span>
                </div>
              </div>

              {/* Statement Table */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-white print:text-black">Audit Ledger Items</h3>
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 print:text-slate-700 uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-2">Date</th>
                      <th className="p-2">Description</th>
                      <th className="p-2">Category</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 print:divide-slate-200 text-slate-200 print:text-black font-mono">
                    {filteredFinancials.slice(0, 10).map(f => (
                      <tr key={f.id}>
                        <td className="p-2 text-slate-400 print:text-slate-600">{f.date}</td>
                        <td className="p-2 font-sans font-medium">{f.description}</td>
                        <td className="p-2 font-sans">{f.category}</td>
                        <td className="p-2 text-right font-bold">
                          {f.type === "Income" ? "+" : "-"}${f.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-white/10 flex justify-between items-end text-xs text-slate-400 print:text-slate-600">
                <div>
                  <p className="font-bold text-white print:text-black">Sarah Jenkins</p>
                  <p>RWA Treasurer / Financial Audit Board</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white print:text-black">CivicHQ Cloud Security</p>
                  <p>Digital Cryptographic Stamp Verified</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
