import React, { useState } from "react";
import { useSociety } from "../context/SocietyContext";
import { X, Bell, Check, Trash2, Send, AlertTriangle, CreditCard, DoorOpen, Megaphone, Calendar, Wrench } from "lucide-react";
import { PushNotification } from "../types";

interface NotificationDrawerProps {
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ onClose }) => {
  const {
    notifications,
    markNotificationRead,
    clearNotifications,
    triggerPushNotification
  } = useSociety();

  const [filter, setFilter] = useState<string>("All");
  const [customTitle, setCustomTitle] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [customType, setCustomType] = useState<PushNotification['type']>("Urgent");

  const filteredNotifs = notifications.filter(n => {
    if (filter === "All") return true;
    return n.type === filter;
  });

  const getIcon = (type: PushNotification['type']) => {
    switch (type) {
      case "Urgent": return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case "Billing": return <CreditCard className="w-4 h-4 text-amber-500" />;
      case "Visitor": return <DoorOpen className="w-4 h-4 text-emerald-500" />;
      case "Notice": return <Megaphone className="w-4 h-4 text-blue-500" />;
      case "Booking": return <Calendar className="w-4 h-4 text-purple-500" />;
      case "Ticket": return <Wrench className="w-4 h-4 text-indigo-500" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleSendTestPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;
    triggerPushNotification(customTitle, customBody || "Push alert dispatched across society mobile devices.", customType);
    setCustomTitle("");
    setCustomBody("");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0b1120]/95 backdrop-blur-2xl border-l border-white/10 text-slate-100 h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base text-white">Mobile Push Center</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          {["All", "Urgent", "Billing", "Visitor", "Notice", "Booking", "Ticket"].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full font-medium transition whitespace-nowrap ${
                filter === type
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "bg-white/5 text-slate-400 border border-white/5 hover:text-slate-200 hover:bg-white/10"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No push notifications matching "{filter}".</p>
            </div>
          ) : (
            filteredNotifs.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer relative ${
                  n.isRead
                    ? "bg-white/5 border-white/5 text-slate-400"
                    : "bg-white/10 border-white/15 text-slate-100 shadow-lg backdrop-blur-md"
                }`}
              >
                {!n.isRead && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                )}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-xs text-white leading-tight">{n.title}</h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">{n.body}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-mono">{n.timestamp}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dispatch Test Push Alert Form */}
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
          <form onSubmit={handleSendTestPush} className="space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Simulate Instant Push Alert</p>
            <div className="flex gap-2">
              <select
                value={customType}
                onChange={e => setCustomType(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 px-2 py-1.5 focus:outline-none focus:border-blue-500/50"
              >
                <option value="Urgent" className="bg-[#0b1120]">Urgent</option>
                <option value="Billing" className="bg-[#0b1120]">Billing</option>
                <option value="Visitor" className="bg-[#0b1120]">Visitor</option>
                <option value="Notice" className="bg-[#0b1120]">Notice</option>
                <option value="Booking" className="bg-[#0b1120]">Booking</option>
                <option value="Ticket" className="bg-[#0b1120]">Ticket</option>
              </select>
              <input
                type="text"
                placeholder="Alert Title..."
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 px-3 py-1.5 focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Alert details body..."
                value={customBody}
                onChange={e => setCustomBody(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 px-3 py-1.5 focus:outline-none focus:border-blue-500/50"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-medium flex items-center gap-1 transition shrink-0 shadow-md shadow-blue-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={clearNotifications}
              className="flex items-center gap-1 hover:text-rose-400 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
            <button
              onClick={onClose}
              className="text-blue-400 font-medium hover:underline"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
