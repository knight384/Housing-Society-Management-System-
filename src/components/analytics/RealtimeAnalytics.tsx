import React from "react";
import { useSociety } from "../../context/SocietyContext";
import {
  BarChart2,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  Activity,
  Zap
} from "lucide-react";

export const RealtimeAnalytics: React.FC = () => {
  const { bills, visitors, tickets, bookings, amenities } = useSociety();

  const totalBilled = bills.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalPaid = bills.filter(b => b.status === "Paid").reduce((acc, b) => acc + b.totalAmount, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  const resolvedTickets = tickets.filter(t => t.status === "Resolved").length;
  const resolutionPct = tickets.length > 0 ? Math.round((resolvedTickets / tickets.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Real-Time Performance Analytics</h1>
          </div>
          <p className="text-xs text-slate-300">
            Live society metrics, maintenance collection trends, visitor traffic peak hours, and amenity utilization.
          </p>
        </div>

        <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0">
          <Zap className="w-4 h-4" />
          <span>Live Telemetry Stream</span>
        </span>
      </div>

      {/* Main Grid Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Metric 1: Maintenance Dues Collection Rate */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-base text-white">Maintenance Dues Collection</h2>
            <span className="text-xs font-mono font-bold text-emerald-400">{collectionRate}% Rate</span>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${collectionRate}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>Paid: ${totalPaid}</span>
              <span>Total Invoiced: ${totalBilled}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
            <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
              <span className="text-slate-400 text-[10px] block">Tower A</span>
              <span className="font-bold text-emerald-400">92%</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
              <span className="text-slate-400 text-[10px] block">Tower B</span>
              <span className="font-bold text-blue-300">88%</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
              <span className="text-slate-400 text-[10px] block">Tower C & D</span>
              <span className="font-bold text-amber-300">79%</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Helpdesk Resolution Performance */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-base text-white">Helpdesk Complaint Resolution</h2>
            <span className="text-xs font-mono font-bold text-blue-300">{resolutionPct}% Cleared</span>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-amber-500 to-blue-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${resolutionPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>Resolved: {resolvedTickets}</span>
              <span>Total Tickets: {tickets.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
            <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
              <span className="text-slate-400 text-[10px] block">Avg Response</span>
              <span className="font-bold text-emerald-400">1.2 hrs</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
              <span className="text-slate-400 text-[10px] block">Satisfaction</span>
              <span className="font-bold text-amber-300">4.8 / 5</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
              <span className="text-slate-400 text-[10px] block">Pending</span>
              <span className="font-bold text-rose-400">{tickets.length - resolvedTickets}</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Gate Visitor Peak Traffic Hours */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="font-bold text-base text-white">Gate 1 Visitor Peak Hours (Daily)</h2>
          
          <div className="flex items-end justify-between h-32 pt-4 px-2 border-b border-white/10">
            {[
              { time: "08 AM", val: 45 },
              { time: "11 AM", val: 80 },
              { time: "02 PM", val: 60 },
              { time: "05 PM", val: 95 },
              { time: "08 PM", val: 70 },
              { time: "10 PM", val: 20 }
            ].map(bar => (
              <div key={bar.time} className="flex flex-col items-center gap-1 group">
                <div
                  className="w-8 bg-blue-500 hover:bg-blue-400 rounded-t-lg transition-all duration-300 shadow-lg shadow-blue-500/20"
                  style={{ height: `${bar.val}%` }}
                />
                <span className="text-[10px] text-slate-400 font-mono">{bar.time}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 text-center">Peak traffic at 05:00 PM (E-commerce delivery & cab arrivals).</p>
        </div>

        {/* Metric 4: Amenity Booking Popularity */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="font-bold text-base text-white">Amenity Facility Popularity Index</h2>
          
          <div className="space-y-3 text-xs">
            {amenities.map(a => (
              <div key={a.id} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-200">{a.name}</span>
                  <span className="text-blue-300 font-mono">84% Booked</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "84%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
