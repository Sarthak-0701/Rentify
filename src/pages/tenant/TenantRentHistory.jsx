import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../supabase/store/AuthStore';
import { rentalService } from '../../supabase/services/rentalServices';
import { 
  ArrowLeft,
  Calendar, 
  Zap, 
  Droplets, 
  Trash2, 
  Wallet, 
  Banknote, 
  Share2, 
  Download, 
  Loader2, 
  Home, 
  AlertTriangle,
  History,
  CheckCircle2
} from 'lucide-react';
import html2canvas from 'html2canvas';

const TenantRentHistory = () => {
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // Export voucher refs
  const exportReceiptRef = useRef(null);
  const exportActionRef = useRef(null);

  // Data states
  const [linkedCodes, setLinkedCodes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [owners, setOwners] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Export states
  const [selectedReceiptForExport, setSelectedReceiptForExport] = useState(null);

  // 1. Initial Load: Load tenant codes and details
  useEffect(() => {
    const initializeRentHistory = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);

        // Fetch DB profile codes
        const dbCodesStr = profile?.tenant_code || '';
        const dbCodes = dbCodesStr
          ? dbCodesStr.split(',').map((c) => c.trim()).filter(Boolean)
          : [];

        // Fetch LocalStorage codes (as a robust fallback)
        const localStr = localStorage.getItem(`rentify_tenant_codes_${user.id}`);
        const localCodes = localStr ? JSON.parse(localStr) : [];

        // Merge, filter unique, and cap at 5
        const mergedCodes = Array.from(new Set([...dbCodes, ...localCodes])).slice(0, 5);
        setLinkedCodes(mergedCodes);

        // Fetch properties/rooms/statements
        if (mergedCodes.length > 0) {
          const data = await rentalService.getTenantData(mergedCodes);
          setRooms(data.rooms || []);
          setReceipts(data.receipts || []);
          setOwners(data.owners || {});
        }
      } catch (err) {
        console.error('Error loading history:', err);
        setError('Failed to load transaction history.');
      } finally {
        setLoading(false);
      }
    };

    initializeRentHistory();
  }, [user, profile]);

  // 2. Download / Share functionality
  const triggerExport = (receipt, action) => {
    setSelectedReceiptForExport(receipt);
    exportActionRef.current = action;
  };

  const executeDownload = async (receipt) => {
    if (!exportReceiptRef.current) return;
    const room = rooms.find((r) => r.id === receipt.room_id);
    try {
      const canvas = await html2canvas(exportReceiptRef.current, {
        backgroundColor: '#030712',
        scale: 2,
        logging: false
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `receipt-room-${room?.room_number || 'unit'}-${receipt.billing_date}.png`;
      link.click();
    } catch (err) {
      console.error('Error exporting statement:', err);
      alert("Failed to export statement image: " + err.message);
    }
  };

  const executeShare = async (receipt) => {
    if (!exportReceiptRef.current) return;
    const room = rooms.find((r) => r.id === receipt.room_id);
    try {
      const canvas = await html2canvas(exportReceiptRef.current, {
        backgroundColor: '#030712',
        scale: 2,
        logging: false
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert("Failed to generate statement image for sharing.");
          return;
        }
        
        const file = new File([blob], `receipt-room-${room?.room_number || 'room'}.png`, { type: 'image/png' });
        const text = `Rent receipt for Room ${room?.room_number} (${room?.properties?.name}) - Total: ₹${receipt.total_bill?.toLocaleString('en-IN')}`;
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Rent Receipt',
              text: text
            });
          } catch (shareErr) {
            if (shareErr.name !== 'AbortError') {
              console.error('Error sharing:', shareErr);
              executeDownload(receipt);
            }
          }
        } else {
          alert("Sharing is not supported on this browser. Downloading statement instead.");
          executeDownload(receipt);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Error sharing receipt:', err);
      alert("Failed to share receipt: " + err.message);
    }
  };

  useEffect(() => {
    if (selectedReceiptForExport && exportActionRef.current) {
      const run = async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
        if (exportActionRef.current === 'download') {
          await executeDownload(selectedReceiptForExport);
        } else if (exportActionRef.current === 'share') {
          await executeShare(selectedReceiptForExport);
        }
        setSelectedReceiptForExport(null);
        exportActionRef.current = null;
      };
      run();
    }
  }, [selectedReceiptForExport]);

  // Helper values for export
  const getExportElectricityUnits = () => {
    if (!selectedReceiptForExport) return 0;
    return Math.max(0, Number(selectedReceiptForExport.new_reading) - Number(selectedReceiptForExport.old_reading));
  };

  const getExportElectricityTotal = () => {
    if (!selectedReceiptForExport) return 0;
    return getExportElectricityUnits() * Number(selectedReceiptForExport.electricity_rate);
  };

  const getExportRoom = () => {
    if (!selectedReceiptForExport) return null;
    return rooms.find((r) => r.id === selectedReceiptForExport.room_id);
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-slate-100">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-900/80">
        <div className="flex items-center gap-4">
          <button
            id="btn-back-to-dashboard"
            onClick={() => navigate('/tenant-dashboard')}
            className="p-2.5 bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-all cursor-pointer shadow-md"
            title="Go back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-200 tracking-tight flex items-center gap-2">
              <History className="w-6 h-6 text-emerald-500/70" />
              Rent Payment History
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and export your past billing receipts.
            </p>
          </div>
        </div>

        <div className="text-slate-500 text-[10px] md:text-right font-medium bg-slate-950/40 border border-slate-900/60 rounded-xl px-4 py-2.5 max-w-xs self-start md:self-auto">
          📅 Displaying up to the <span className="text-emerald-400 font-bold">latest 3 statements</span> for each linked rental property.
        </div>
      </div>

      {/* Main content display */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading history statement archive...</p>
        </div>
      ) : error ? (
        <div className="p-5 bg-red-950/20 border border-red-900/30 rounded-2xl flex flex-col md:flex-row items-center gap-4 max-w-xl mx-auto my-12">
          <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold text-red-400">An error occurred</h3>
            <p className="text-xs text-red-300/80 mt-1">{error}</p>
          </div>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-900 rounded-3xl bg-slate-950/20 max-w-2xl mx-auto w-full">
          <Home className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-slate-300 font-semibold text-base">No Linked Rentals</h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
            You don't have any linked properties yet. Enter a 6-digit tenant code on your dashboard overview page to link a room.
          </p>
          <button
            id="btn-go-to-dashboard"
            onClick={() => navigate('/tenant-dashboard')}
            className="mt-5 px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer transition-colors"
          >
            Go to Dashboard Overview
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {rooms.map((room) => {
            // Filter receipts for this specific room, and only show the latest 3
            const roomReceipts = receipts
              .filter((r) => r.room_id === room.id)
              .slice(0, 3);

            return (
              <div key={room.id} className="space-y-4">
                {/* Room Group Header */}
                <div className="p-4 bg-slate-950/50 border border-slate-900/80 rounded-2xl flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center">
                      <Home className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-200 capitalize">{room.properties?.name || 'Property'}</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Room {room.room_number} | Owner: <span className="text-slate-400 font-semibold">{owners[room.properties?.owner_id] || 'Owner'}</span> | Base Rent: ₹{room.base_rent?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-800">
                    CODE ID: {room.tenant_code}
                  </span>
                </div>

                {/* Receipts Grid */}
                {roomReceipts.length === 0 ? (
                  <div className="p-6 border border-dashed border-slate-900 rounded-2xl bg-slate-950/10 text-center">
                    <p className="text-xs text-slate-600 italic">No rent receipts generated for this room yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {roomReceipts.map((receipt) => {
                      const electricityUnits = Math.max(0, receipt.new_reading - receipt.old_reading);
                      const electricityTotal = electricityUnits * receipt.electricity_rate;

                      return (
                        <div 
                          key={receipt.id}
                          className="group p-5 bg-slate-950/30 border border-slate-900/70 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-all relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-900 group-hover:bg-emerald-500/40 transition-colors" />

                          {/* Card Content */}
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-650" /> Billing Date
                                </span>
                                <h4 className="text-sm font-bold text-slate-200 mt-0.5">{receipt.billing_date}</h4>
                              </div>
                              <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold border ${
                                receipt.status === 'Paid' 
                                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' 
                                  : 'bg-amber-950/40 text-amber-400 border-amber-900/30'
                              }`}>
                                {receipt.status || 'Pending'}
                              </span>
                            </div>

                            {/* Charges Breakdown Panel */}
                            <div className="space-y-2 border-t border-b border-slate-900/80 py-3.5 my-3.5">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500 flex items-center gap-1">
                                  <Banknote className="w-3.5 h-3.5 text-emerald-500/60" /> Base Rent
                                </span>
                                <span className="font-semibold text-slate-300">₹{receipt.base_rent?.toLocaleString('en-IN')}</span>
                              </div>

                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500 flex items-center gap-1.5">
                                  <Zap className="w-3.5 h-3.5 text-amber-500/60" /> Electricity
                                  <span className="text-[9px] text-slate-600">({electricityUnits} units)</span>
                                </span>
                                <span className="font-semibold text-slate-300">₹{electricityTotal?.toLocaleString('en-IN')}</span>
                              </div>

                              {receipt.water_charges > 0 && (
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-500 flex items-center gap-1">
                                    <Droplets className="w-3.5 h-3.5 text-blue-500/60" /> Water
                                  </span>
                                  <span className="font-semibold text-slate-300">₹{receipt.water_charges?.toLocaleString('en-IN')}</span>
                                </div>
                              )}

                              {receipt.trash_charges > 0 && (
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-500 flex items-center gap-1">
                                    <Trash2 className="w-3.5 h-3.5 text-orange-500/60" /> Trash
                                  </span>
                                  <span className="font-semibold text-slate-300">₹{receipt.trash_charges?.toLocaleString('en-IN')}</span>
                                </div>
                              )}

                              {receipt.previous_balance > 0 && (
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-500 flex items-center gap-1">
                                    <Wallet className="w-3.5 h-3.5 text-indigo-500/60" /> Prev Balance
                                  </span>
                                  <span className="font-semibold text-slate-300">₹{receipt.previous_balance?.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Grand Total & Export Actions */}
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Bill</span>
                              <span className="text-base font-black text-emerald-400">₹{receipt.total_bill?.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-900/60">
                              <button
                                id={`btn-share-receipt-${receipt.id}`}
                                onClick={() => triggerExport(receipt, 'share')}
                                className="flex items-center justify-center gap-1.5 py-2 bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-xl transition-all cursor-pointer text-xs font-semibold text-slate-400 hover:text-white"
                                title="Share Receipt"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Share</span>
                              </button>

                              <button
                                id={`btn-download-receipt-${receipt.id}`}
                                onClick={() => triggerExport(receipt, 'download')}
                                className="flex items-center justify-center gap-1.5 py-2 bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-xl transition-all cursor-pointer text-xs font-semibold text-slate-400 hover:text-white"
                                title="Download PNG"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Hidden hex-styled receipt voucher for html2canvas captures */}
      {selectedReceiptForExport && getExportRoom() && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div 
            ref={exportReceiptRef}
            style={{
              width: '400px',
              padding: '32px',
              background: '#030712',
              border: '1px solid #1f2937',
              borderRadius: '16px',
              color: '#ffffff',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              boxSizing: 'border-box'
            }}
          >
            {/* Logo / Header */}
            <div style={{ display: 'flex', justifycontent: 'space-between', alignitems: 'center', marginbottom: '24px', borderbottom: '1px solid #1f2937', paddingbottom: '16px' }}>
              <div>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>Rentify.</span>
                <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>RENTAL STATEMENT</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  fontSize: '10px', 
                  background: selectedReceiptForExport.status === 'Paid' ? '#064e3b' : '#78350f', 
                  color: selectedReceiptForExport.status === 'Paid' ? '#6ee7b7' : '#fcd34d', 
                  padding: '4px 10px', 
                  borderRadius: '9999px', 
                  fontWeight: 'bold', 
                  border: selectedReceiptForExport.status === 'Paid' ? '1px solid #047857' : '#b45309' 
                }}>
                  {selectedReceiptForExport.status || 'Pending'}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '12px' }}>
              <div>
                <div style={{ color: '#6b7280', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase', marginBottom: '2px' }}>Property / Room</div>
                <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>{getExportRoom()?.properties?.name || 'N/A'}</div>
                <div style={{ color: '#9ca3af', marginTop: '1px' }}>Room {getExportRoom()?.room_number || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase', marginBottom: '2px' }}>Billing Date</div>
                <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>{selectedReceiptForExport.billing_date || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase', marginBottom: '2px' }}>Tenant</div>
                <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>
                  {getExportRoom()?.tenant_name || 'Vacant'} 
                  {getExportRoom()?.tenant_code ? ` (${getExportRoom()?.tenant_code})` : ''}
                </div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase', marginBottom: '2px' }}>Voucher Ref</div>
                <div style={{ fontWeight: 'bold', color: '#e5e7eb', fontFamily: 'monospace' }}>#{selectedReceiptForExport.id?.slice(0, 8) || 'N/A'}</div>
              </div>
            </div>

            {/* Charges Breakdown */}
            <div style={{ borderTop: '1px solid #1f2937', borderBottom: '1px solid #1f2937', padding: '16px 0', marginBottom: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '12px' }}>Breakdown of Charges</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                <span style={{ color: '#9ca3af' }}>Monthly Base Rent</span>
                <span style={{ color: '#f3f4f6', fontWeight: 'bold' }}>₹{Number(selectedReceiptForExport.base_rent || 0).toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                <span style={{ color: '#9ca3af' }}>
                  Electricity 
                  <span style={{ fontSize: '10px', color: '#6b7280', marginLeft: '4px' }}>
                    ({getExportElectricityUnits()} units @ ₹{selectedReceiptForExport.electricity_rate}/unit)
                  </span>
                </span>
                <span style={{ color: '#f3f4f6', fontWeight: 'bold' }}>₹{getExportElectricityTotal().toLocaleString('en-IN')}</span>
              </div>

              {selectedReceiptForExport.water_charges > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                  <span style={{ color: '#9ca3af' }}>Water Charges</span>
                  <span style={{ color: '#f3f4f6', fontWeight: 'bold' }}>₹{Number(selectedReceiptForExport.water_charges).toLocaleString('en-IN')}</span>
                </div>
              )}

              {selectedReceiptForExport.trash_charges > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                  <span style={{ color: '#9ca3af' }}>Trash Charges</span>
                  <span style={{ color: '#f3f4f6', fontWeight: 'bold' }}>₹{Number(selectedReceiptForExport.trash_charges).toLocaleString('en-IN')}</span>
                </div>
              )}

              {selectedReceiptForExport.previous_balance > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                  <span style={{ color: '#9ca3af' }}>Previous Balance</span>
                  <span style={{ color: '#f3f4f6', fontWeight: 'bold' }}>₹{Number(selectedReceiptForExport.previous_balance).toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>Total Amount Due</div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#10b981', marginTop: '2px' }}>
                  ₹{selectedReceiptForExport.total_bill?.toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ fontSize: '10px', color: '#4b5563', fontStyle: 'italic', textAlign: 'right' }}>
                Thank you for renting!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantRentHistory;
