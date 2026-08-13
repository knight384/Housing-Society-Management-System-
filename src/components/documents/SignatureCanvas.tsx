import React, { useRef, useState, useEffect } from "react";
import { RotateCcw, PenTool, CheckCircle2 } from "lucide-react";

interface SignatureCanvasProps {
  onSignatureChange: (dataUrl: string | null) => void;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSignatureChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [penColor, setPenColor] = useState("#1e3a8a"); // Navy Blue
  const [penWidth, setPenWidth] = useState(3.5);

  const colors = [
    { label: "Navy Blue", value: "#1e3a8a" },
    { label: "Deep Black", value: "#0f172a" },
    { label: "Royal Blue", value: "#2563eb" },
    { label: "Emerald Green", value: "#047857" }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high resolution / crisp lines
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
  }, [penColor, penWidth]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();

    if (isEmpty) {
      setIsEmpty(false);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && !isEmpty) {
      onSignatureChange(canvas.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onSignatureChange(null);
  };

  return (
    <div className="space-y-2">
      {/* Canvas Controls Top Bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <PenTool className="w-3.5 h-3.5 text-indigo-600" /> Ink Color:
          </span>
          <div className="flex items-center gap-1">
            {colors.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setPenColor(c.value)}
                style={{ backgroundColor: c.value }}
                title={c.label}
                className={`w-5 h-5 rounded-full border-2 transition ${
                  penColor === c.value ? "border-indigo-600 scale-110 shadow-xs" : "border-white"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500">Thickness:</span>
            {[2, 3.5, 5].map(w => (
              <button
                key={w}
                type="button"
                onClick={() => setPenWidth(w)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                  penWidth === w ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {w === 2 ? "Thin" : w === 3.5 ? "Medium" : "Bold"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={clearCanvas}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Canvas Box */}
      <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:border-indigo-300 transition overflow-hidden">
        <canvas
          ref={canvasRef}
          width={500}
          height={160}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-40 touch-none cursor-crosshair bg-white"
        />

        {/* Guideline baseline */}
        <div className="absolute bottom-8 left-6 right-6 border-b border-slate-200/80 pointer-events-none flex justify-between items-center text-[10px] text-slate-300 font-mono">
          <span>Sign above line</span>
          <span>X___________________________</span>
        </div>

        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
            <span>Draw your signature using mouse or finger touch</span>
          </div>
        )}

        {!isEmpty && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Captured</span>
          </div>
        )}
      </div>
    </div>
  );
};
