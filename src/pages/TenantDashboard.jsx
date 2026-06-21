import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../supabase/store/AuthStore';
import { rentalService } from '../supabase/services/rentalServices';
import LinkRentalRoom from '../components/tenant/LinkRentalRoom';
import ActiveRentalsList from '../components/tenant/ActiveRentalsList';
import OutstandingBillsList from '../components/tenant/OutstandingBillsList';
import StatementDetailsModal from '../components/tenant/StatementDetailsModal';
import { 
  Home, 
  User, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  Calendar, 
  Zap, 
  Droplets, 
  Wallet, 
  Banknote, 
  Share2, 
  Download, 
  AlertTriangle,
  X
} from 'lucide-react';
import html2canvas from 'html2canvas';

const TenantDashboard = () => {
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);

  // Export voucher refs
  const exportReceiptRef = useRef(null);
  const exportActionRef = useRef(null);

  // States
  const [tenantCodeInput, setTenantCodeInput] = useState('');
  const [linkedCodes, setLinkedCodes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [owners, setOwners] = useState({});
  const [loading, setLoading] = useState(true);
  const [linkLoading, setLinkLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal / Detail States
  const [activeModal, setActiveModal] = useState(null); // 'details' | null
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedReceiptForExport, setSelectedReceiptForExport] = useState(null);

  // Checkout Form States
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Card' | 'NetBanking'
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  // 1. Load tenant codes and data
  useEffect(() => {
    const initializeDashboard = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);

        // Fetch DB profile codes
        const dbCodesStr = profile?.tenant_code || '';
        const dbCodes = dbCodesStr
          ? dbCodesStr.split(',').map((c) => c.trim()).filter(Boolean)
          : [];

        // Fetch LocalStorage codes (fallback)
        const localStr = localStorage.getItem(`rentify_tenant_codes_${user.id}`);
        const localCodes = localStr ? JSON.parse(localStr) : [];

        // Merge and cap at 5
        const mergedCodes = Array.from(new Set([...dbCodes, ...localCodes])).slice(0, 5);
        setLinkedCodes(mergedCodes);

        await fetchTenantDetails(mergedCodes);
      } catch (err) {
        console.error('Error initializing dashboard:', err);
        setError('Failed to load portal configuration.');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [user, profile]);

  const fetchTenantDetails = async (codes) => {
    if (!codes || codes.length === 0) {
      setRooms([]);
      setReceipts([]);
      setOwners({});
      return;
    }
    try {
      const data = await rentalService.getTenantData(codes);
      setRooms(data.rooms || []);
      setReceipts(data.receipts || []);
      setOwners(data.owners || {});
    } catch (err) {
      console.error('Error fetching tenant data:', err);
      setError('Failed to sync rental details from database.');
    }
  };

  // 2. Link code
  const handleLinkRoom = async (e) => {
    e.preventDefault();
    setError(null);
    const cleanedCode = tenantCodeInput.trim();

    if (!cleanedCode || cleanedCode.length !== 6) {
      setError('Please enter a valid 6-digit Tenant Code.');
      return;
    }

    if (linkedCodes.includes(cleanedCode)) {
      setError('This rental is already linked.');
      return;
    }

    if (linkedCodes.length >= 5) {
      setError('Maximum limit of 5 active rentals reached.');
      return;
    }

    try {
      setLinkLoading(true);
      // Verify code
      const verified = await rentalService.getTenantData([cleanedCode]);
      if (!verified.rooms || verified.rooms.length === 0) {
        setError('No active room found with this Tenant Code. Please verify the code.');
        setLinkLoading(false);
        return;
      }

      const updatedCodes = [...linkedCodes, cleanedCode];
      setLinkedCodes(updatedCodes);
      localStorage.setItem(`rentify_tenant_codes_${user.id}`, JSON.stringify(updatedCodes));
      await rentalService.syncTenantCodes(user.id, updatedCodes);

      await fetchTenantDetails(updatedCodes);
      setTenantCodeInput('');
    } catch (err) {
      console.error('Error linking code:', err);
      setError('Could not verify room code.');
    } finally {
      setLinkLoading(false);
    }
  };

  // 3. Unlink code
  const handleUnlinkRoom = async (codeToUnlink) => {
    setError(null);
    try {
      setLoading(true);
      const updatedCodes = linkedCodes.filter((c) => c !== codeToUnlink);
      setLinkedCodes(updatedCodes);
      localStorage.setItem(`rentify_tenant_codes_${user.id}`, JSON.stringify(updatedCodes));
      await rentalService.syncTenantCodes(user.id, updatedCodes);

      await fetchTenantDetails(updatedCodes);
    } catch (err) {
      console.error('Error unlinking room:', err);
      setError('Failed to unlink property.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Download / Share statement
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
          alert("Sharing not supported. Downloading receipt instead.");
          executeDownload(receipt);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Error sharing:', err);
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

  // 5. Open statement details modal
  const openDetailsModal = (receipt) => {
    setSelectedReceipt(receipt);
    setIsCheckoutMode(false);
    setPaymentSuccess(false);
    setPaymentLoading(false);
    setActiveModal('details');
  };

  const closeDetailsModal = async () => {
    setActiveModal(null);
    setSelectedReceipt(null);
    if (paymentSuccess) {
      setLoading(true);
      await fetchTenantDetails(linkedCodes);
      setLoading(false);
    }
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!selectedReceipt) return;

    try {
      setPaymentLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1800)); // Latency simulation

      await rentalService.settleReceiptPayment(selectedReceipt.id);

      setPaymentLoading(false);
      setPaymentSuccess(true);
    } catch (err) {
      setPaymentLoading(false);
      alert('Payment processing failed: ' + err.message);
    }
  };

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
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* Top Banner Errors */}
      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/40 rounded-xl flex items-center justify-between">
          <p className="text-sm text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            {error}
          </p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Left (Linking + Rentals), Right (Outstanding Bills) */}
      <div className="grid gap-6 lg:grid-cols-5 items-start">
        {/* Left Column (Linking + Rentals list) */}
        <div className="lg:col-span-2 space-y-6">
          <LinkRentalRoom 
            tenantCodeInput={tenantCodeInput}
            setTenantCodeInput={setTenantCodeInput}
            handleLinkRoom={handleLinkRoom}
            linkLoading={linkLoading}
            linkedCodesCount={linkedCodes.length}
          />

          <ActiveRentalsList 
            rooms={rooms}
            owners={owners}
            handleUnlinkRoom={handleUnlinkRoom}
            loading={loading}
            linkedCodesCount={linkedCodes.length}
          />
        </div>

        {/* Right Column (Outstanding Bills) */}
        <div className="lg:col-span-3">
          <OutstandingBillsList 
            rooms={rooms}
            receipts={receipts}
            owners={owners}
            loading={loading}
            openDetailsModal={openDetailsModal}
          />
        </div>
      </div>

      {/* Detailed Modal Overlay */}
      {activeModal === 'details' && selectedReceipt && (
        <StatementDetailsModal 
          selectedReceipt={selectedReceipt}
          rooms={rooms}
          owners={owners}
          profile={profile}
          isCheckoutMode={isCheckoutMode}
          setIsCheckoutMode={setIsCheckoutMode}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          paymentLoading={paymentLoading}
          paymentSuccess={paymentSuccess}
          cardDetails={cardDetails}
          setCardDetails={setCardDetails}
          handleProcessPayment={handleProcessPayment}
          closeDetailsModal={closeDetailsModal}
          triggerExport={triggerExport}
        />
      )}

      {/* Hidden hex voucher for html2canvas statement capturing */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #1f2937', paddingBottom: '16px' }}>
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

export default TenantDashboard;