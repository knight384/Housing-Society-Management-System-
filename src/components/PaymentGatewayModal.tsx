import React, { useState } from "react";
import { DuesBill, PaymentTransaction } from "../types";
import { useSociety } from "../context/SocietyContext";
import {
  X,
  CreditCard,
  QrCode,
  Building,
  Wallet,
  ShieldCheck,
  CheckCircle,
  Printer,
  Download,
  Lock,
  Loader2
} from "lucide-react";

interface PaymentGatewayModalProps {
  bill: DuesBill;
  onClose: () => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({ bill, onClose }) => {
  const { payBill } = useSociety();

  const [method, setMethod] = useState<PaymentTransaction['method']>("Credit Card");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8812");
  const [cardHolder, setCardHolder] = useState(bill.residentName);
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("•••");
  const [upiId, setUpiId] = useState(`${bill.residentName.toLowerCase().replace(/\s+/g, "")}@okicici`);

  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<{ receiptId: string } | null>(null);

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const res = await payBill(bill.id, method);
    setIsProcessing(false);

    if (res.success) {
      setReceiptData({ receiptId: res.receiptId });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#0b1120]/95 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">CivicHQ Secure Gateway</h3>
              <p className="text-[11px] text-slate-400">256-Bit Encrypted Payment Processing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {receiptData ? (
          /* Receipt Screen */
          <div className="p-6 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-white">Payment Successful!</h4>
              <p className="text-xs text-slate-400 mt-1">Receipt ID: <span className="font-mono text-blue-300 font-semibold">{receiptData.receiptId}</span></p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Unit Number</span>
                <span className="font-semibold text-slate-200">{bill.unitNumber}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Resident Name</span>
                <span className="font-semibold text-slate-200">{bill.residentName}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Bill Period</span>
                <span className="font-semibold text-slate-200">{bill.monthYear}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Payment Mode</span>
                <span className="font-semibold text-blue-300">{method}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-300 font-bold">Total Amount Paid</span>
                <span className="font-extrabold text-emerald-400 text-sm">${bill.totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-500/30"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form Screen */
          <div className="p-6 space-y-5">
            
            {/* Bill Summary Banner */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">{bill.monthYear} Maintenance Invoice</p>
                <p className="text-base font-bold text-white">{bill.billNumber} • Flat {bill.unitNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Total Due</p>
                <p className="text-xl font-black text-emerald-400">${bill.totalAmount}</p>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2 uppercase tracking-wider">Select Payment Method</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "Credit Card", icon: CreditCard, label: "Card" },
                  { id: "UPI / NetBanking", icon: QrCode, label: "UPI / QR" },
                  { id: "Debit Card", icon: Building, label: "NetBanking" },
                  { id: "Digital Wallet", icon: Wallet, label: "Wallet" }
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id as any)}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 text-xs font-medium transition ${
                      method === m.id
                        ? "bg-blue-500/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    <m.icon className={`w-4 h-4 ${method === m.id ? "text-blue-400" : "text-slate-400"}`} />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Inputs based on Method */}
            <form onSubmit={handleProcessPayment} className="space-y-4">
              {method === "Credit Card" || method === "Debit Card" ? (
                <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 font-mono"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Card Holder</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={e => setCardHolder(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 text-center font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 text-center font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                  <div className="w-32 h-32 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center border border-white/20 shadow-inner">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <p className="text-xs text-slate-300">Scan QR or enter virtual payment address</p>
                  <div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 text-center focus:outline-none focus:border-blue-500/50 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Security Seal & Pay Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Verifying with Bank...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-blue-200" />
                      <span>Pay ${bill.totalAmount} Securely</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
