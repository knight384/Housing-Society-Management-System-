import React from "react";
import { useSociety } from "../context/SocietyContext";
import { Smartphone, Monitor, Wifi, Battery, Signal } from "lucide-react";

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { isMobileView, setIsMobileView } = useSociety();

  if (!isMobileView) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center p-2 sm:p-6 animate-fade-in">
      
      {/* Top Controls Indicator */}
      <div className="mb-4 flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-lg">
        <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-blue-400" />
          <span>Mobile App Preview Mode</span>
        </span>
        <button
          onClick={() => setIsMobileView(false)}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-full transition flex items-center gap-1 shadow-md shadow-blue-500/20"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Exit Mobile Frame</span>
        </button>
      </div>

      {/* iPhone Device Chassis Frame */}
      <div className="w-full max-w-[410px] h-[850px] bg-[#0b1120]/90 backdrop-blur-2xl border-[8px] border-white/10 rounded-[48px] shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-white/10">
        
        {/* Top Camera Notch / Dynamic Island */}
        <div className="h-7 bg-[#070b14] flex items-center justify-between px-6 shrink-0 relative z-50 text-[11px] font-mono text-slate-300">
          <span>09:41</span>
          <div className="w-20 h-4 bg-white/10 backdrop-blur-md rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-1" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3 h-3" />
          </div>
        </div>

        {/* Scrollable Mobile Viewport Content */}
        <div className="flex-1 overflow-y-auto bg-[#0b1120] text-slate-100 p-3 space-y-4 scrollbar-none">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="h-6 bg-[#070b14] flex items-center justify-center shrink-0">
          <div className="w-32 h-1 bg-white/20 rounded-full" />
        </div>

      </div>
    </div>
  );
};
