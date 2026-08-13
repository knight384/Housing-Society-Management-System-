import React, { useState, useEffect } from "react";
import { useSociety } from "../../context/SocietyContext";
import {
  mockUnitMeters,
  mockHourlyFeeds,
  mockDailyTrends,
  mockApplianceBreakdown,
  mockAnomalyAlerts,
  mockSocietyBenchmark
} from "../../data/utilityMockData";
import {
  UnitUtilityMeter,
  HourlyConsumption,
  DailyConsumption,
  ApplianceUsageBreakdown,
  UtilityAnomalyAlert
} from "../../types";
import {
  Zap,
  Droplets,
  Activity,
  AlertTriangle,
  Gauge,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Power,
  RefreshCw,
  Sun,
  Leaf,
  BarChart3,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
  Wind,
  Tv,
  Refrigerator,
  ShowerHead,
  UtensilsCrossed,
  WashingMachine,
  Building,
  Target,
  Info,
  ChevronRight,
  Filter,
  Download,
  Check
} from "lucide-react";

export const SmartUtilitiesDashboard: React.FC = () => {
  const { currentUser, addMaintenanceTicket, triggerPushNotification } = useSociety();

  // Selected Unit Meter State
  const [selectedUnit, setSelectedUnit] = useState<string>(currentUser.unitNumber || "A-402");
  const [meters, setMeters] = useState<UnitUtilityMeter[]>(mockUnitMeters);
  
  // Find current unit meter data
  const currentMeter = meters.find(m => m.unitNumber === selectedUnit) || meters[0];

  // Live Feed Simulation State
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [liveLoadKw, setLiveLoadKw] = useState<number>(currentMeter.liveCurrentLoadKw);
  const [liveFlowLpm, setLiveFlowLpm] = useState<number>(currentMeter.liveWaterFlowLpm);
  const [liveVoltage, setLiveVoltage] = useState<number>(currentMeter.liveVoltageVolts);
  const [livePressure, setLivePressure] = useState<number>(currentMeter.liveWaterPressureBar);

  // Tabs
  const [activeTab, setActiveTab] = useState<"realtime" | "trends" | "appliances" | "controls" | "benchmark">("realtime");
  
  // Utility View Filter: "all" | "electricity" | "water"
  const [utilityFilter, setUtilityFilter] = useState<"all" | "electricity" | "water">("all");

  // Anomaly Alerts State
  const [alerts, setAlerts] = useState<UtilityAnomalyAlert[]>(mockAnomalyAlerts);

  // Safety Modal for Water Main Cutoff Toggle
  const [showValveConfirmModal, setShowValveConfirmModal] = useState<boolean>(false);
  const [valvePendingAction, setValvePendingAction] = useState<boolean>(false);

  // Budget Goal Modal
  const [showBudgetModal, setShowBudgetModal] = useState<boolean>(false);
  const [elecBudgetInput, setElecBudgetInput] = useState<number>(currentMeter.budgetElectricityKWh);
  const [waterBudgetInput, setWaterBudgetInput] = useState<number>(currentMeter.budgetWaterLiters);

  // Ticket creation feedback
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState<string | null>(null);

  // Simulate real-time ticking meter feed every 3 seconds
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      // Slight fluctuation simulation
      const loadDelta = (Math.random() - 0.5) * 0.2;
      const flowDelta = Math.random() > 0.4 ? (Math.random() - 0.5) * 0.4 : 0;
      const voltDelta = (Math.random() - 0.5) * 0.8;

      setLiveLoadKw(prev => Math.max(0.4, Number((prev + loadDelta).toFixed(2))));
      setLiveFlowLpm(prev => Math.max(0, Number((prev + flowDelta).toFixed(1))));
      setLiveVoltage(prev => Number((230 + voltDelta).toFixed(1)));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Sync state when selected unit changes
  useEffect(() => {
    setLiveLoadKw(currentMeter.liveCurrentLoadKw);
    setLiveFlowLpm(currentMeter.liveWaterFlowLpm);
    setLiveVoltage(currentMeter.liveVoltageVolts);
    setLivePressure(currentMeter.liveWaterPressureBar);
    setElecBudgetInput(currentMeter.budgetElectricityKWh);
    setWaterBudgetInput(currentMeter.budgetWaterLiters);
  }, [selectedUnit]);

  // Toggle Main Water Valve
  const handleToggleWaterValve = () => {
    const newStatus = !currentMeter.mainWaterValveOpen;
    setMeters(prev =>
      prev.map(m =>
        m.unitNumber === selectedUnit
          ? { ...m, mainWaterValveOpen: newStatus }
          : m
      )
    );
    setShowValveConfirmModal(false);

    const actionText = newStatus ? "OPENED" : "SHUT OFF (Vacation Mode)";
    triggerPushNotification(
      "Smart Water Valve Alert",
      `Main Water Supply Valve for unit ${selectedUnit} has been ${actionText}.`,
      "Urgent"
    );
  };

  // Resolve Anomaly Alert
  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, resolved: true } : a)));
  };

  // Create Helpdesk Ticket from Anomaly Alert
  const handleCreateTicketFromAlert = (alert: UtilityAnomalyAlert) => {
    addMaintenanceTicket({
      unitNumber: selectedUnit,
      residentName: currentUser.name,
      title: `Smart Utility Anomaly: ${alert.type} (${alert.utility})`,
      description: `${alert.message} Detected at ${alert.timestamp}. Automated alert from Smart Meter system.`,
      category: alert.utility === "Electricity" ? "Electrical" : "Plumbing",
      priority: alert.severity === "Critical" ? "High" : "Medium",
      status: "Open"
    });

    setTicketSuccessMsg(`Maintenance Helpdesk Ticket logged for ${alert.type}!`);
    setTimeout(() => setTicketSuccessMsg(null), 3500);
  };

  // Save Budget Goals
  const handleSaveBudgets = (e: React.FormEvent) => {
    e.preventDefault();
    setMeters(prev =>
      prev.map(m =>
        m.unitNumber === selectedUnit
          ? { ...m, budgetElectricityKWh: elecBudgetInput, budgetWaterLiters: waterBudgetInput }
          : m
      )
    );
    setShowBudgetModal(false);
    triggerPushNotification(
      "Utility Budget Goals Updated",
      `Target budgets updated for Unit ${selectedUnit}: ${elecBudgetInput} kWh electricity & ${waterBudgetInput.toLocaleString()} L water.`,
      "Notice"
    );
  };

  // Helper icon for appliance category
  const renderApplianceIcon = (iconName: string) => {
    switch (iconName) {
      case "Wind":
        return <Wind className="w-4 h-4 text-sky-600" />;
      case "Flame":
        return <Flame className="w-4 h-4 text-orange-600" />;
      case "Zap":
        return <Zap className="w-4 h-4 text-amber-600" />;
      case "Refrigerator":
        return <Refrigerator className="w-4 h-4 text-indigo-600" />;
      case "Tv":
        return <Tv className="w-4 h-4 text-purple-600" />;
      case "ShowerHead":
        return <ShowerHead className="w-4 h-4 text-blue-600" />;
      case "WashingMachine":
        return <WashingMachine className="w-4 h-4 text-teal-600" />;
      case "UtensilsCrossed":
        return <UtensilsCrossed className="w-4 h-4 text-emerald-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  // Export CSV Data Report
  const handleExportCSV = () => {
    const csvRows = [
      ["Hour", "Electricity (kWh)", "Water (Liters)", "Peak Hour", "Cost ($)"],
      ...mockHourlyFeeds.map(h => [
        h.hour,
        h.electricityKWh,
        h.waterLiters,
        h.isPeakHour ? "YES" : "NO",
        h.cost
      ])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Utility_Consumption_${selectedUnit}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Max values for chart scaling
  const maxKWh = Math.max(...mockHourlyFeeds.map(h => h.electricityKWh));
  const maxWater = Math.max(...mockHourlyFeeds.map(h => h.waterLiters));

  return (
    <div className="space-y-6">
      
      {/* Top Smart Utility Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 space-y-6 relative overflow-hidden">
        
        {/* Glow ambient circle */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-400" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white">Smart Utilities & Energy Analytics</h1>
              
              {/* Live Ticker Indicator Badge */}
              <button
                onClick={() => setIsLiveActive(!isLiveActive)}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border transition ${
                  isLiveActive
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                    : "bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700"
                }`}
                title="Toggle Real-time Meter Stream Simulation"
              >
                <span className={`w-2 h-2 rounded-full ${isLiveActive ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`}></span>
                <span>{isLiveActive ? "LIVE FEED TICKER" : "FEED PAUSED"}</span>
                <RefreshCw className={`w-3 h-3 ml-1 ${isLiveActive ? "animate-spin" : ""}`} />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Sub-metered electricity & water flow telemetry for unit <strong className="text-white font-mono">{selectedUnit}</strong> ({currentMeter.tower}).
            </p>
          </div>

          {/* Unit Selector & Actions */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
              <Building className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-400">Unit:</span>
              <select
                id="utility-unit-selector"
                value={selectedUnit}
                onChange={e => setSelectedUnit(e.target.value)}
                className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
              >
                {meters.map(m => (
                  <option key={m.unitNumber} value={m.unitNumber} className="bg-slate-900 text-white">
                    {m.unitNumber} ({m.tower})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowBudgetModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border border-indigo-400/30 shadow-xs transition"
            >
              <Target className="w-4 h-4" />
              <span>Budget Goals</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-700 transition"
              title="Download CSV Utility Log"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

        </div>

        {/* Real-Time Telemetry Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-2 relative z-10">
          
          {/* Live Electricity Load */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Power Load</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{liveVoltage}V</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-white font-mono">{liveLoadKw}</span>
              <span className="text-xs text-slate-400 font-bold">kW</span>
            </div>
            <div className="text-[10px] text-amber-300/80 flex items-center gap-1 font-medium">
              <Activity className="w-3 h-3" />
              <span>{liveLoadKw > 3.5 ? "High Load Demand" : "Normal Grid Load"}</span>
            </div>
          </div>

          {/* Live Water Flow */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Water Flow Rate</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{livePressure} Bar</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-white font-mono">{liveFlowLpm}</span>
              <span className="text-xs text-slate-400 font-bold">L/min</span>
            </div>
            <div className="text-[10px] text-sky-300/80 flex items-center gap-1 font-medium">
              <Gauge className="w-3 h-3" />
              <span>{liveFlowLpm > 0 ? "Fixture Running" : "Zero Flow (No Leak)"}</span>
            </div>
          </div>

          {/* Monthly Electricity Usage */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
              <span>Month Electricity</span>
              <span className="text-[10px] text-emerald-400 font-bold">${currentMeter.monthElectricityBill.toFixed(2)}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-white font-mono">{currentMeter.monthElectricityKWh}</span>
              <span className="text-xs text-slate-400 font-bold">kWh</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Goal: <strong className="text-slate-200 font-mono">{currentMeter.budgetElectricityKWh} kWh</strong>
            </div>
          </div>

          {/* Monthly Water Volume */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
              <span>Month Water</span>
              <span className="text-[10px] text-sky-400 font-bold">${currentMeter.monthWaterBill.toFixed(2)}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-white font-mono">{currentMeter.monthWaterLiters.toLocaleString()}</span>
              <span className="text-xs text-slate-400 font-bold">L</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Goal: <strong className="text-slate-200 font-mono">{currentMeter.budgetWaterLiters.toLocaleString()} L</strong>
            </div>
          </div>

          {/* Solar & Sustainability */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
              <span className="flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>Solar Offset</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                <Leaf className="w-3 h-3" />
                <span>{currentMeter.co2SavedKg}kg CO2</span>
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-white font-mono">{currentMeter.solarContributionKWh}</span>
              <span className="text-xs text-slate-400 font-bold">kWh</span>
            </div>
            <div className="text-[10px] text-emerald-300/80 font-medium">
              20% Rooftop Solar Grid Savings
            </div>
          </div>

        </div>

      </div>

      {/* Ticket Feedback Toast */}
      {ticketSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{ticketSuccessMsg}</span>
          </div>
        </div>
      )}

      {/* Main Tab Controls & Filter Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          
          {/* Dashboard Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <button
              id="tab-realtime-feed"
              onClick={() => setActiveTab("realtime")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "realtime"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>24-Hour Hourly Feed</span>
            </button>

            <button
              id="tab-daily-trends"
              onClick={() => setActiveTab("trends")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "trends"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>7-Day Trends & Budgets</span>
            </button>

            <button
              id="tab-appliance-breakdown"
              onClick={() => setActiveTab("appliances")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "appliances"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Appliance Breakdown</span>
            </button>

            <button
              id="tab-controls-valves"
              onClick={() => setActiveTab("controls")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "controls"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>Remote Water Valve & Safety</span>
            </button>

            <button
              id="tab-eco-benchmark"
              onClick={() => setActiveTab("benchmark")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "benchmark"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Society Benchmarks</span>
            </button>
          </div>

          {/* Filter By Utility Type Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setUtilityFilter("all")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                utilityFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setUtilityFilter("electricity")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1 ${
                utilityFilter === "electricity" ? "bg-amber-500 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Electricity</span>
            </button>

            <button
              onClick={() => setUtilityFilter("water")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1 ${
                utilityFilter === "water" ? "bg-sky-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Droplets className="w-3 h-3" />
              <span>Water</span>
            </button>
          </div>

        </div>

        {/* TAB 1: 24-HOUR HOURLY FEED & INTERACTIVE CHART */}
        {activeTab === "realtime" && (
          <div className="space-y-6 pt-2">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span>24-Hour Telemetry Stream — Hourly Power & Water Curves</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Peak demand hours (18:00–21:00) highlighted in amber. Track real-time load spikes and morning water usage.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium text-slate-600 shrink-0">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-amber-500 rounded-sm inline-block"></span>
                  <span>Electricity (kWh)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-sky-500 rounded-sm inline-block"></span>
                  <span>Water (Liters)</span>
                </span>
              </div>
            </div>

            {/* Interactive SVG Bar Chart */}
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-3">
              <div className="h-56 w-full flex items-end gap-1.5 pt-6 pb-2 px-2 overflow-x-auto scrollbar-none">
                {mockHourlyFeeds.map((feed, idx) => {
                  const elecHeight = Math.max(8, (feed.electricityKWh / maxKWh) * 160);
                  const waterHeight = Math.max(8, (feed.waterLiters / maxWater) * 160);

                  return (
                    <div key={idx} className="flex-1 min-w-[24px] flex flex-col items-center gap-1 group relative">
                      
                      {/* Hover Tooltip */}
                      <div className="absolute -top-16 hidden group-hover:flex flex-col items-center z-20 pointer-events-none bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-lg whitespace-nowrap">
                        <span className="font-bold text-amber-300 font-mono">{feed.hour} {feed.isPeakHour ? "(PEAK TARIFF)" : ""}</span>
                        <span>Electricity: {feed.electricityKWh} kWh</span>
                        <span>Water: {feed.waterLiters} Liters</span>
                        <span>Est. Cost: ${feed.cost}</span>
                      </div>

                      {/* Bars */}
                      <div className="w-full flex items-end justify-center gap-0.5 h-44">
                        {(utilityFilter === "all" || utilityFilter === "electricity") && (
                          <div
                            style={{ height: `${elecHeight}px` }}
                            className={`w-full rounded-t-xs transition-all ${
                              feed.isPeakHour
                                ? "bg-amber-500 group-hover:bg-amber-400"
                                : "bg-indigo-500 group-hover:bg-indigo-400"
                            }`}
                          ></div>
                        )}

                        {(utilityFilter === "all" || utilityFilter === "water") && (
                          <div
                            style={{ height: `${waterHeight}px` }}
                            className="w-full bg-sky-500 group-hover:bg-sky-400 rounded-t-xs transition-all"
                          ></div>
                        )}
                      </div>

                      {/* Hour Label */}
                      <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-900 group-hover:font-bold transition">
                        {feed.hour.slice(0, 2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Peak Hour Banner Advice */}
              <div className="p-3.5 bg-amber-50 border border-amber-200/80 text-amber-900 rounded-xl text-xs flex items-center gap-3">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <strong className="font-bold block text-amber-950">Peak Electricity Tariff Warning (18:00 – 21:00)</strong>
                  <span>Peak tariff is charged at 1.4x standard rate. Shift heavy appliances (Washing Machine, EV Charging) to off-peak hours (22:00 – 06:00) to save up to 18% monthly.</span>
                </div>
              </div>
            </div>

            {/* Anomaly Alerts Cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Smart Meter Anomaly & Leak Detection Log</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border transition space-y-2.5 ${
                      alert.resolved
                        ? "bg-slate-50 border-slate-200 text-slate-500"
                        : alert.severity === "Critical"
                        ? "bg-rose-50/80 border-rose-200 text-rose-950"
                        : alert.severity === "Warning"
                        ? "bg-amber-50/80 border-amber-200 text-amber-950"
                        : "bg-blue-50/80 border-blue-200 text-blue-950"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {alert.utility === "Electricity" ? (
                          <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <Droplets className="w-4 h-4 text-sky-600 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-xs block">{alert.type} Alert ({alert.utility})</span>
                          <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
                        </div>
                      </div>

                      {alert.resolved ? (
                        <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Check className="w-3 h-3 text-slate-600" />
                          <span>Resolved</span>
                        </span>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                          alert.severity === "Critical" ? "bg-rose-200 text-rose-800" : "bg-amber-200 text-amber-800"
                        }`}>
                          {alert.severity}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium">{alert.message}</p>

                    {!alert.resolved && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleResolveAlert(alert.id)}
                          className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-[11px] font-bold transition shadow-2xs"
                        >
                          Mark Resolved
                        </button>

                        <button
                          onClick={() => handleCreateTicketFromAlert(alert)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition shadow-2xs flex items-center gap-1"
                        >
                          <span>Log Helpdesk Ticket</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: 7-DAY TRENDS & BUDGET PROGRESS */}
        {activeTab === "trends" && (
          <div className="space-y-6 pt-2">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Electricity Budget Card */}
              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Monthly Electricity Target</h4>
                      <p className="text-xs text-slate-500">Usage vs Budget Limit ({selectedUnit})</p>
                    </div>
                  </div>

                  <span className="font-mono text-sm font-extrabold text-amber-600">
                    {currentMeter.monthElectricityKWh} / {currentMeter.budgetElectricityKWh} kWh
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">
                      {((currentMeter.monthElectricityKWh / currentMeter.budgetElectricityKWh) * 100).toFixed(0)}% Utilized
                    </span>
                    <span className="text-slate-500">
                      Remaining: {(currentMeter.budgetElectricityKWh - currentMeter.monthElectricityKWh)} kWh
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (currentMeter.monthElectricityKWh / currentMeter.budgetElectricityKWh) * 100)}%` }}
                      className="bg-amber-500 h-full rounded-full transition-all"
                    ></div>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Est. Bill Forecast Month End:</span>
                  <span className="font-bold text-slate-900 font-mono">${currentMeter.monthElectricityBill.toFixed(2)}</span>
                </div>
              </div>

              {/* Water Budget Card */}
              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-sky-100 text-sky-800 rounded-xl">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Monthly Water Target</h4>
                      <p className="text-xs text-slate-500">Usage vs Budget Limit ({selectedUnit})</p>
                    </div>
                  </div>

                  <span className="font-mono text-sm font-extrabold text-sky-600">
                    {currentMeter.monthWaterLiters.toLocaleString()} / {currentMeter.budgetWaterLiters.toLocaleString()} L
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">
                      {((currentMeter.monthWaterLiters / currentMeter.budgetWaterLiters) * 100).toFixed(0)}% Utilized
                    </span>
                    <span className="text-slate-500">
                      Remaining: {(currentMeter.budgetWaterLiters - currentMeter.monthWaterLiters).toLocaleString()} L
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (currentMeter.monthWaterLiters / currentMeter.budgetWaterLiters) * 100)}%` }}
                      className="bg-sky-500 h-full rounded-full transition-all"
                    ></div>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Est. Bill Forecast Month End:</span>
                  <span className="font-bold text-slate-900 font-mono">${currentMeter.monthWaterBill.toFixed(2)}</span>
                </div>
              </div>

            </div>

            {/* 7-Day Past Trend Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                Past 7 Days Utility Log Breakdown
              </h4>

              <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Electricity (kWh)</th>
                      <th className="p-3">Water (Liters)</th>
                      <th className="p-3">Power Cost ($)</th>
                      <th className="p-3">Water Cost ($)</th>
                      <th className="p-3 text-right">Total Day Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {mockDailyTrends.map((d, idx) => {
                      const total = Number(d.electricityCost) + Number(d.waterCost);
                      return (
                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 font-bold text-slate-900">{d.date}</td>
                          <td className="p-3 font-mono">{d.electricityKWh} kWh</td>
                          <td className="p-3 font-mono">{d.waterLiters} L</td>
                          <td className="p-3 font-mono text-amber-700">${Number(d.electricityCost).toFixed(2)}</td>
                          <td className="p-3 font-mono text-sky-700">${Number(d.waterCost).toFixed(2)}</td>
                          <td className="p-3 text-right font-extrabold font-mono text-slate-900">${total.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: APPLIANCE & FIXTURE BREAKDOWN */}
        {activeTab === "appliances" && (
          <div className="space-y-6 pt-2">
            
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Estimated Device & Fixture Consumption Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500">
                Sub-metered circuit modeling for unit {selectedUnit}. Identify high-drain appliances and water usage fixtures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockApplianceBreakdown.map((app, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                        {renderApplianceIcon(app.iconName)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{app.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          app.category === "Electricity" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"
                        }`}>
                          {app.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 font-mono">{app.percentage}%</span>
                      <span className="text-[10px] text-slate-500 block">of unit usage</span>
                    </div>
                  </div>

                  {/* Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${app.percentage}%` }}
                      className={`h-full rounded-full ${app.category === "Electricity" ? "bg-amber-500" : "bg-sky-500"}`}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 font-medium">
                    {app.currentPowerWatts !== undefined ? (
                      <span className="text-slate-600">
                        Current Load: <strong className="text-slate-900 font-mono">{app.currentPowerWatts} W</strong>
                      </span>
                    ) : (
                      <span className="text-slate-600">Flow Sensor Active</span>
                    )}

                    <span className="text-slate-600">
                      Est. Daily Cost: <strong className="text-slate-900 font-mono">${app.dailyCost.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: REMOTE WATER VALVE & SAFETY CONTROLS */}
        {activeTab === "controls" && (
          <div className="space-y-6 pt-2">
            
            <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Power className="w-5 h-5 text-indigo-400" />
                    <span>Remote Main Water Supply Valve Control</span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Inlet solenoid smart valve for Unit <strong className="text-white font-mono">{selectedUnit}</strong>. Shut off main supply during long trips or vacation mode.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                    currentMeter.mainWaterValveOpen
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${currentMeter.mainWaterValveOpen ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                    <span>VALVE STATUS: {currentMeter.mainWaterValveOpen ? "OPEN & ACTIVE" : "SHUT OFF (VACATION MODE)"}</span>
                  </span>

                  <button
                    onClick={() => {
                      setValvePendingAction(!currentMeter.mainWaterValveOpen);
                      setShowValveConfirmModal(true);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition ${
                      currentMeter.mainWaterValveOpen
                        ? "bg-rose-600 hover:bg-rose-500 text-white"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    <span>{currentMeter.mainWaterValveOpen ? "Shut Off Main Valve" : "Open Main Valve"}</span>
                  </button>
                </div>
              </div>

              {/* Safety Sensor Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-sky-400" />
                      <span>Leakage Detection</span>
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-slate-400">Micro-turbine flow sensors monitor zero-flow hours at night to flag pipe pinholes.</p>
                  <span className="text-emerald-300 font-bold block pt-1">
                    Status: Normal (Zero Micro-Leaks)
                  </span>
                </div>

                <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-indigo-400" />
                      <span>Line Pressure Sensor</span>
                    </span>
                    <span className="font-mono text-white font-bold">{livePressure} Bar</span>
                  </div>
                  <p className="text-slate-400">Main line pressure regulated by society booster pump system.</p>
                  <span className="text-indigo-300 font-bold block pt-1">
                    Optimal Operating Range (3.0 – 4.5 Bar)
                  </span>
                </div>

                <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Voltage Surge Guard</span>
                    </span>
                    <span className="font-mono text-white font-bold">{liveVoltage} V</span>
                  </div>
                  <p className="text-slate-400">Automatic high/low voltage surge isolator relay for household electronics.</p>
                  <span className="text-amber-300 font-bold block pt-1">
                    Line Voltage Steady
                  </span>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 5: SOCIETY BENCHMARKS & ECO RANKING */}
        {activeTab === "benchmark" && (
          <div className="space-y-6 pt-2">
            
            <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-2xl">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-400/30 uppercase font-mono">
                      RWA Eco-Resident Ranking
                    </span>
                    <h3 className="text-lg font-bold">Top 18% Eco-Performer ({selectedUnit})</h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-300 font-mono">82nd</span>
                  <span className="text-xs text-slate-300 block">Percentile Efficiency</span>
                </div>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Your household consumes <strong>13% LESS electricity</strong> and <strong>12% LESS water</strong> than the Tower A average. You qualify for the <strong>RWA Green Rebate Discount</strong> on next month's maintenance bill!
              </p>
            </div>

            {/* Benchmarking Progress Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Electricity Benchmarks */}
              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Monthly Power Consumption Benchmark (kWh)</span>
                </h4>

                <div className="space-y-3 text-xs font-medium">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-indigo-700">Your Unit ({selectedUnit})</span>
                      <span className="font-bold font-mono">{mockSocietyBenchmark.unitKWhPerMonth} kWh</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-slate-600">
                      <span>Tower A Average</span>
                      <span className="font-mono">{mockSocietyBenchmark.towerAvgKWhPerMonth} kWh</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-slate-400 h-full rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-slate-600">
                      <span>Society Overall Average</span>
                      <span className="font-mono">{mockSocietyBenchmark.societyAvgKWhPerMonth} kWh</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-slate-300 h-full rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-emerald-700">
                      <span className="font-bold">Top 10% Eco-Goal</span>
                      <span className="font-bold font-mono">{mockSocietyBenchmark.top10PercentEcoKWhPerMonth} kWh</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '55%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Water Benchmarks */}
              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>Monthly Water Consumption Benchmark (Liters)</span>
                </h4>

                <div className="space-y-3 text-xs font-medium">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-indigo-700">Your Unit ({selectedUnit})</span>
                      <span className="font-bold font-mono">{mockSocietyBenchmark.unitWaterLitersPerMonth.toLocaleString()} L</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-slate-600">
                      <span>Tower A Average</span>
                      <span className="font-mono">{mockSocietyBenchmark.towerAvgWaterLitersPerMonth.toLocaleString()} L</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-slate-400 h-full rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-slate-600">
                      <span>Society Overall Average</span>
                      <span className="font-mono">{mockSocietyBenchmark.societyAvgWaterLitersPerMonth.toLocaleString()} L</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-slate-300 h-full rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-emerald-700">
                      <span className="font-bold">Top 10% Eco-Goal</span>
                      <span className="font-bold font-mono">{mockSocietyBenchmark.top10PercentEcoWaterLiters.toLocaleString()} L</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* SAFETY MODAL: WATER VALVE TOGGLE CONFIRMATION */}
      {showValveConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 text-slate-900 shadow-xl relative">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${valvePendingAction ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                <Power className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {valvePendingAction ? "Open Main Water Valve?" : "Shut Off Main Water Valve?"}
                </h3>
                <p className="text-xs text-slate-500">Unit {selectedUnit} Solenoid Smart Meter</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {valvePendingAction
                ? "This will restore main water line supply to all bathrooms, kitchen fixtures, and appliances in unit " + selectedUnit + "."
                : "This will isolate and stop main inlet water flow for unit " + selectedUnit + ". Recommended when leaving for vacations to prevent accidental flooding."}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowValveConfirmModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleToggleWaterValve}
                className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition shadow-2xs ${
                  valvePendingAction ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Confirm {valvePendingAction ? "Open Valve" : "Shut Off Valve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BUDGET GOALS MODAL */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 text-slate-900 shadow-xl relative">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Set Monthly Utility Budget Goals</h3>
              </div>

              <button
                onClick={() => setShowBudgetModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudgets} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-bold">Electricity Monthly Goal (kWh)</label>
                <input
                  type="number"
                  value={elecBudgetInput}
                  onChange={e => setElecBudgetInput(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none"
                  required
                  min={50}
                  max={2000}
                />
                <span className="text-[10px] text-slate-500">Current Month-to-Date: {currentMeter.monthElectricityKWh} kWh</span>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-bold">Water Monthly Goal (Liters)</label>
                <input
                  type="number"
                  value={waterBudgetInput}
                  onChange={e => setWaterBudgetInput(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none"
                  required
                  min={1000}
                  max={50000}
                />
                <span className="text-[10px] text-slate-500">Current Month-to-Date: {currentMeter.monthWaterLiters.toLocaleString()} L</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                >
                  Save Budget Goals
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
