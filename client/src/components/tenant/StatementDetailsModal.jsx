import React from 'react';
import { 
  X, 
  DollarSign, 
  Share2, 
  Download, 
  CreditCard, 
  Loader2, 
  CheckCircle2, 
  Banknote, 
  Zap, 
  Droplets, 
  Trash2, 
  Wallet,
  Info
} from 'lucide-react';

const StatementDetailsModal = ({
  selectedReceipt,
  rooms,
  owners,
  profile,
  isCheckoutMode,
  setIsCheckoutMode,
  paymentMethod,
  setPaymentMethod,
  paymentLoading,
  paymentSuccess,
  cardDetails,
  setCardDetails,
  handleProcessPayment,
  closeDetailsModal,
  triggerExport
}) => {
  const room = rooms.find((r) => r.id === selectedReceipt.room_id);
  const ownerName = owners[room?.properties?.owner_id] || 'Owner';
  const electricityUnits = Math.max(0, selectedReceipt.new_reading - selectedReceipt.old_reading);
  const electricityTotal = electricityUnits * selectedReceipt.electricity_rate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-linear-to-b from-app-card-from to-app-card-to border border-app-card-border p-6 rounded-3xl shadow-2xl flex flex-col my-8 transition-colors">
        
        {/* Top Close */}
        <button
          id="btn-close-pay-modal"
          onClick={closeDetailsModal}
          disabled={paymentLoading}
          className="absolute top-4 right-4 p-1.5 hover:bg-app-card-hover/20 text-app-text-muted hover:text-app-text-primary rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isCheckoutMode ? (
          /* ================= VIEW 1: STATEMENT DETAILS ================= */
          <>
            <h2 className="text-lg font-black text-app-text-primary tracking-tight flex items-center gap-2 mb-1">
              <DollarSign className="w-5 h-5 text-app-tenant-accent" /> Rent Statement details
            </h2>
            <p className="text-xs text-app-text-muted mb-6">
              Full billing breakdown for the selected rent statement period.
            </p>

            {/* Rental Room Info */}
            <div className="grid grid-cols-2 gap-4 bg-app-card-from/30 border border-app-card-border rounded-2xl p-4 mb-6 text-xs text-app-text-secondary transition-colors">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-app-text-muted">Property / Room</div>
                <div className="font-bold text-app-text-primary mt-1">
                  {room?.properties?.name || 'Property'}
                </div>
                <div className="text-[10px] text-app-text-muted mt-0.5">
                  Room {room?.room_number}
                </div>
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-app-text-muted">Billing Date</div>
                <div className="font-bold text-app-text-primary mt-1">{selectedReceipt.billing_date}</div>
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-app-text-muted">Tenant</div>
                <div className="font-bold text-app-text-primary mt-1 capitalize">{profile?.full_name || 'Tenant'}</div>
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-app-text-muted">Landlord</div>
                <div className="font-bold text-app-text-primary mt-1">{ownerName}</div>
              </div>
            </div>

            {/* Charges Breakdown */}
            <div className="border-t border-b border-app-card-border py-4 mb-6 space-y-3">
              <div className="text-[9px] font-bold uppercase tracking-wider text-app-text-muted">Breakdown of Charges</div>
              
              <div className="flex justify-between text-xs">
                <span className="text-app-text-secondary">Monthly Base Rent</span>
                <span className="font-semibold text-app-text-primary font-mono">₹{selectedReceipt.base_rent?.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-app-text-secondary flex flex-col sm:flex-row sm:items-center gap-1">
                  <span>Electricity Charges</span>
                  <span className="text-[9px] text-app-text-muted">
                    ({electricityUnits} units @ ₹{selectedReceipt.electricity_rate}/unit)
                  </span>
                </span>
                <span className="font-semibold text-app-text-primary font-mono">
                  ₹{electricityTotal?.toLocaleString('en-IN')}
                </span>
              </div>

              {selectedReceipt.water_charges > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-app-text-secondary">Water Charges</span>
                  <span className="font-semibold text-app-text-primary font-mono">₹{selectedReceipt.water_charges?.toLocaleString('en-IN')}</span>
                </div>
              )}

              {selectedReceipt.trash_charges > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-app-text-secondary">Trash Charges</span>
                  <span className="font-semibold text-app-text-primary font-mono">₹{selectedReceipt.trash_charges?.toLocaleString('en-IN')}</span>
                </div>
              )}

              {selectedReceipt.previous_balance > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-app-text-secondary">Previous Balance</span>
                  <span className="font-semibold text-app-text-primary font-mono">₹{selectedReceipt.previous_balance?.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Total amount & Action Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-app-text-muted">Total Outstanding</span>
                <div className="text-2xl font-black text-app-tenant-accent font-mono mt-0.5">
                  ₹{selectedReceipt.total_bill?.toLocaleString('en-IN')}
                </div>
              </div>
              <span className="text-[10px] px-3 py-1 rounded-full font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Pending Settle
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-app-card-border">
              <button
                id={`btn-share-receipt-${selectedReceipt.id}`}
                onClick={() => triggerExport(selectedReceipt, 'share')}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-app-card-to hover:bg-app-card-hover/20 border border-app-card-border rounded-xl transition-all cursor-pointer text-xs font-semibold text-app-text-secondary hover:text-app-text-primary"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              <button
                id={`btn-download-receipt-${selectedReceipt.id}`}
                onClick={() => triggerExport(selectedReceipt, 'download')}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-app-card-to hover:bg-app-card-hover/20 border border-app-card-border rounded-xl transition-all cursor-pointer text-xs font-semibold text-app-text-secondary hover:text-app-text-primary"
              >
                <Download className="w-4 h-4" />
                Download
              </button>

              <button
                id={`btn-pay-receipt-${selectedReceipt.id}`}
                onClick={() => setIsCheckoutMode(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-app-tenant-accent hover:bg-app-tenant-accent-hover text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-md shadow-emerald-500/10"
              >
                <CreditCard className="w-4 h-4" />
                Pay Rent
              </button>
            </div>
          </>
        ) : (
          /* ================= VIEW 2: MOCK PAYMENT GATEWAY ================= */
          <>
            {!paymentSuccess ? (
              <>
                <h3 className="text-lg font-black text-app-text-primary flex items-center gap-2 mb-1">
                  <CreditCard className="w-5 h-5 text-app-tenant-accent" /> Settle Statement Bill
                </h3>
                <p className="text-xs text-app-text-muted mb-6">
                  Select a mock payment method to proceed with settling the rent balance.
                </p>

                {/* Bill details */}
                <div className="p-4 bg-app-card-from border border-app-card-border rounded-2xl flex items-center justify-between mb-6 transition-colors">
                  <div>
                    <span className="text-[10px] text-app-text-muted font-bold uppercase">Statement Balance</span>
                    <div className="text-2xl font-black text-app-tenant-accent font-mono mt-0.5">
                      ₹{selectedReceipt.total_bill?.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-right text-xs text-app-text-secondary">
                    <div>Room {room?.room_number}</div>
                    <div className="text-[10px] text-app-text-muted mt-0.5">{selectedReceipt.billing_date}</div>
                  </div>
                </div>

                {/* Method selector */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {['UPI', 'Card', 'NetBanking'].map((method) => (
                    <button
                      key={method}
                      id={`payment-method-${method.toLowerCase()}`}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                        paymentMethod === method
                          ? 'bg-app-tenant-accent-glow text-app-tenant-accent border-app-tenant-accent-border'
                          : 'bg-app-card-to text-app-text-secondary border-app-card-border hover:border-app-card-hover'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleProcessPayment} className="space-y-4">
                  {/* UPI Gateway */}
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-3.5 p-4 bg-app-card-from border border-app-card-border rounded-2xl text-center transition-colors">
                      <div className="w-24 h-24 bg-white border border-slate-200 rounded-xl mx-auto flex items-center justify-center p-2">
                        <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center">
                          <span className="text-[8px] font-bold text-slate-750">UPI QR CODE</span>
                          <span className="text-[6px] text-slate-500 mt-1 font-mono">Scan & Pay</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-app-text-muted leading-relaxed">
                        Scan the mock QR code or enter your VPA below to process transaction simulation.
                      </p>
                      <input
                        type="text"
                        placeholder="tenant@upi"
                        required
                        className="w-full bg-app-card-from border border-app-card-border focus:border-app-tenant-accent rounded-xl px-4 py-2.5 text-xs text-app-text-primary text-center outline-none"
                      />
                    </div>
                  )}

                  {/* Card Gateway */}
                  {paymentMethod === 'Card' && (
                    <div className="space-y-3 p-4 bg-app-card-from border border-app-card-border rounded-2xl transition-colors">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-app-text-secondary mb-1.5">Card Number</label>
                        <input
                          id="input-card-number"
                          type="text"
                          maxLength="19"
                          required
                          placeholder="4111 2222 3333 4444"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/[^0-9 ]/g, '') })}
                          className="w-full bg-app-card-from border border-app-card-border focus:border-app-tenant-accent rounded-xl px-3 py-2 text-xs text-app-text-primary outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-app-text-secondary mb-1.5">Expiry Date</label>
                          <input
                            id="input-card-expiry"
                            type="text"
                            maxLength="5"
                            required
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value.replace(/[^0-9/]/g, '') })}
                            className="w-full bg-app-card-from border border-app-card-border focus:border-app-tenant-accent rounded-xl px-3 py-2 text-xs text-app-text-primary text-center outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-app-text-secondary mb-1.5">CVV</label>
                          <input
                            id="input-card-cvv"
                            type="password"
                            maxLength="3"
                            required
                            placeholder="***"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/[^0-9]/g, '') })}
                            className="w-full bg-app-card-from border border-app-card-border focus:border-app-tenant-accent rounded-xl px-3 py-2 text-xs text-app-text-primary text-center outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NetBanking Gateway */}
                  {paymentMethod === 'NetBanking' && (
                    <div className="p-4 bg-app-card-from border border-app-card-border rounded-2xl space-y-2 transition-colors">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-app-text-secondary mb-1.5">Select Bank</label>
                      <select
                        required
                        className="w-full bg-app-card-from border border-app-card-border focus:border-app-tenant-accent rounded-xl px-3 py-2.5 text-xs text-app-text-primary outline-none appearance-none cursor-pointer"
                      >
                        <option value="SBI" className="bg-app-card-from">State Bank of India</option>
                        <option value="HDFC" className="bg-app-card-from">HDFC Bank</option>
                        <option value="ICICI" className="bg-app-card-from">ICICI Bank</option>
                        <option value="AXIS" className="bg-app-card-from">Axis Bank</option>
                      </select>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsCheckoutMode(false)}
                      disabled={paymentLoading}
                      className="px-4 py-2.5 text-xs font-bold bg-app-card-to hover:bg-app-card-hover/20 text-app-text-secondary rounded-xl cursor-pointer border border-app-card-border transition-colors"
                    >
                      Back to Statement
                    </button>
                    <button
                      id="btn-confirm-payment"
                      type="submit"
                      disabled={paymentLoading}
                      className="grow bg-app-tenant-accent hover:bg-app-tenant-accent-hover disabled:bg-app-tenant-accent/40 text-white py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                    >
                      {paymentLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing Settle...</span>
                        </>
                      ) : (
                        <span>Pay ₹{selectedReceipt.total_bill?.toLocaleString('en-IN')}</span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-6 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-app-tenant-accent mx-auto animate-bounce" />
                <h3 className="text-lg font-black text-app-text-primary">Payment Succeeded!</h3>
                <p className="text-xs text-app-text-muted leading-relaxed max-w-xs mx-auto">
                  Statement bill worth <span className="text-app-tenant-accent font-bold font-mono">₹{selectedReceipt.total_bill?.toLocaleString('en-IN')}</span> has been marked as **Paid**.
                </p>

                <div className="pt-4">
                  <button
                    id="btn-close-pay-success"
                    onClick={closeDetailsModal}
                    className="px-6 py-2.5 bg-app-card-to hover:bg-app-card-hover/20 text-app-text-secondary rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StatementDetailsModal;
