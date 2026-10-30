import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2, 
  Edit, 
  Share2, 
  Download, 
  Calendar, 
  User, 
  Home, 
  Droplets, 
  Zap, 
  Wallet, 
  Banknote, 
  Loader2, 
  X, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { rentalService } from '../../supabase/services/rentalServices';

const ReceiptHistory = () => {
  const { propertyId, roomId } = useParams();
  const navigate = useNavigate();
  
  const exportReceiptRef = useRef(null);
  const exportActionRef = useRef(null);

  // Data states
  const [roomDetails, setRoomDetails] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal & Action states
  const [activeModal, setActiveModal] = useState(null); // 'edit' | 'delete'
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedReceiptForExport, setSelectedReceiptForExport] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    billing_date: '',
    base_rent: 0,
    old_reading: 0,
    new_reading: 0,
    electricity_rate: 10,
    water_charges: 0,
    trash_charges: 0,
    previous_balance: 0,
    status: 'Pending'
  });

  // Load room details and receipts
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const details = await rentalService.getRoomDetails(propertyId, roomId);
      if (details) {
        const activeTenancy = details.tenancies?.find(t => t.status?.toLowerCase() === 'active') || details.tenancies?.[0];
        setRoomDetails({
          ...details,
          roomNumber: details.room_number,
          propertyName: details.properties?.name,
          tenantCode: activeTenancy?.invite_code,
          tenantName: activeTenancy?.profiles?.full_name || activeTenancy?.offline_tenant_name,
        });

        const roomReceipts = (details.tenancies || [])
          .flatMap((t) => t.receipts || [])
          .sort((a, b) => new Date(b.billing_date) - new Date(a.billing_date));

        setReceipts(roomReceipts);
      } else {
        setRoomDetails(null);
        setReceipts([]);
      }
    } catch (err) {
      console.error('Error fetching receipts/details:', err);
      setError(err.message || 'Failed to fetch receipt history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [propertyId, roomId]);

  // Handle export state flow
  const triggerExport = (receipt, action) => {
    setSelectedReceiptForExport(receipt);
    exportActionRef.current = action;
  };

  const executeDownload = async (receipt) => {
    if (!exportReceiptRef.current) return;
    try {
      const canvas = await html2canvas(exportReceiptRef.current, {
        backgroundColor: '#030712',
        scale: 2,
        logging: false
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `receipt-room-${roomDetails?.roomNumber || 'unit'}-${receipt.billing_date || 'date'}.png`;
      link.click();
    } catch (err) {
      console.error('Error generating image export:', err);
      alert("Failed to export receipt image: " + err.message);
    }
  };

  const executeShare = async (receipt) => {
    if (!exportReceiptRef.current) return;
    try {
      const canvas = await html2canvas(exportReceiptRef.current, {
        backgroundColor: '#030712',
        scale: 2,
        logging: false
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert("Failed to generate receipt image for sharing.");
          return;
        }
        
        const file = new File([blob], `receipt-room-${roomDetails?.roomNumber || 'room'}.png`, { type: 'image/png' });
        const text = `Rent receipt for Room ${roomDetails?.roomNumber} (${roomDetails?.propertyName}) - Total: ₹${receipt.total_bill?.toLocaleString('en-IN')}`;
        
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
          alert("Sharing files is not supported on this device/browser. Downloading receipt image instead.");
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

  // Open Edit Modal
  const openEditModal = (receipt) => {
    setSelectedReceipt(receipt);
    const isPaid = receipt.status?.toLowerCase() === 'paid';
    setEditForm({
      billing_date: receipt.billing_date || '',
      base_rent: receipt.base_rent ?? roomDetails?.base_rent ?? 0,
      old_reading: receipt.old_reading || 0,
      new_reading: receipt.new_reading || 0,
      electricity_rate: receipt.electricity_rate || 10,
      water_charges: receipt.water_charges || 0,
      trash_charges: receipt.trash_charges || 0,
      previous_balance: receipt.previous_balance || 0,
      status: isPaid ? 'Paid' : 'Pending'
    });
    setActiveModal('edit');
  };

  // Open Delete Modal
  const openDeleteModal = (receipt) => {
    setSelectedReceipt(receipt);
    setActiveModal('delete');
  };

  // Close Modal
  const closeModal = () => {
    setActiveModal(null);
    setSelectedReceipt(null);
  };

  // Calculate bill total dynamically
  const calculateTotalBill = (form) => {
    const units = Math.max(0, Number(form.new_reading) - Number(form.old_reading));
    const elecTotal = units * Number(form.electricity_rate);
    return Number(form.base_rent) + elecTotal + Number(form.water_charges) + Number(form.trash_charges) + Number(form.previous_balance);
  };

  // Handle edit form field updates
  const handleEditChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? (parseFloat(value) || 0) : value;
    setEditForm(prev => ({
      ...prev,
      [name]: val
    }));
  };

  // Submit Update
  const handleUpdateReceipt = async (e) => {
    e.preventDefault();
    if (!selectedReceipt) return;

    try {
      setActionLoading(true);
      const computedTotal = calculateTotalBill(editForm);
      const updatedFields = {
        ...editForm,
        total_bill: computedTotal
      };
      
      await rentalService.updateReceipt(selectedReceipt.id, updatedFields);
      closeModal();
      await fetchData(); // Refresh receipts
    } catch (err) {
      alert("Failed to update receipt: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Delete
  const handleDeleteReceipt = async () => {
    if (!selectedReceipt) return;
    try {
      setActionLoading(true);
      await rentalService.deleteReceipt(selectedReceipt.id);
      closeModal();
      await fetchData(); // Refresh receipts
    } catch (err) {
      alert("Failed to delete receipt: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Helper values for selectedReceiptForExport calculation
  const getExportElectricityUnits = () => {
    if (!selectedReceiptForExport) return 0;
    return Math.max(0, Number(selectedReceiptForExport.new_reading) - Number(selectedReceiptForExport.old_reading));
  };

  const getExportElectricityTotal = () => {
    if (!selectedReceiptForExport) return 0;
    return getExportElectricityUnits() * Number(selectedReceiptForExport.electricity_rate);
  };

  return (
    <div className="w-full min-h-[85vh] py-6 px-4 md:px-8 bg-app-bg text-app-text-primary flex flex-col justify-start relative overflow-hidden font-sans transition-colors">
      {/* Background radial glow */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-5 border-b border-app-card-border">
        <div className="flex items-center gap-4">
          <button
            id="btn-back-to-properties"
            onClick={() => navigate('/owner-dashboard/properties')}
            className="p-2.5 bg-app-card-to border border-app-card-border hover:border-app-card-hover text-app-text-secondary hover:text-app-text-primary rounded-xl transition-all cursor-pointer shadow-md"
            title="Go back to Properties"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {roomDetails && (
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-app-text-primary tracking-tight flex items-center gap-1.5">
                  <Home className="w-5.5 h-5.5 text-app-accent/70" />
                  Room {roomDetails.roomNumber} Receipts
                </h1>
                {roomDetails.tenantCode && (
                  <span className="text-[10px] bg-app-card-from text-app-text-muted border border-app-card-border px-2 py-0.5 rounded font-mono">
                    ID: {roomDetails.tenantCode}
                  </span>
                )}
              </div>
              <p className="text-xs text-app-text-muted mt-0.5">
                Property: <span className="text-app-text-secondary font-medium">{roomDetails.propertyName}</span>
                {roomDetails.tenantName && (
                  <>
                    <span className="mx-2 text-app-card-border">|</span>
                    Tenant: <span className="text-app-text-secondary font-medium capitalize">{roomDetails.tenantName}</span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="text-app-text-muted text-[10px] md:text-right font-medium bg-app-card-from border border-app-card-border rounded-xl px-4 py-2.5 max-w-xs self-start md:self-auto">
          📄 All statement records for this room are permanently preserved in accounting history.
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-app-accent animate-spin" />
          <p className="text-xs text-app-text-muted font-medium">Loading statement history...</p>
        </div>
      ) : error ? (
        <div className="p-5 bg-app-danger-glow border border-app-danger-border rounded-2xl flex flex-col md:flex-row items-center gap-4 max-w-xl mx-auto my-12">
          <AlertTriangle className="w-8 h-8 text-app-danger shrink-0" />
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold text-app-danger">An error occurred</h3>
            <p className="text-xs text-app-danger/80 mt-1">{error}</p>
          </div>
          <button 
            onClick={fetchData} 
            className="px-4 py-1.5 text-xs font-semibold bg-app-danger hover:bg-app-danger/80 text-white border border-app-danger-border rounded-lg cursor-pointer transition-colors md:ml-auto"
          >
            Retry
          </button>
        </div>
      ) : receipts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-app-card-border rounded-3xl bg-app-card-from/40 max-w-2xl mx-auto w-full">
          <Calendar className="w-12 h-12 text-app-text-muted/65 mx-auto mb-4" />
          <h3 className="text-app-text-primary font-semibold text-base">No Receipts Found</h3>
          <p className="text-xs text-app-text-muted mt-1.5 max-w-sm mx-auto leading-relaxed">
            There are no rent receipts generated for this room yet. Generate a statement using the Rent Calculator to see it here.
          </p>
          <button
            id="btn-go-to-calculator"
            onClick={() => navigate('/owner-dashboard/calculator')}
            className="mt-5 px-5 py-2 text-xs font-semibold bg-app-accent hover:bg-app-accent-hover text-white rounded-xl cursor-pointer transition-colors shadow-lg shadow-blue-950/10"
          >
            Go to Rent Calculator
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl w-full mx-auto">
          {receipts.map((receipt) => {
            const electricityUnits = Math.max(0, Number(receipt.new_reading || 0) - Number(receipt.old_reading || 0));
            const electricityTotal = electricityUnits * Number(receipt.electricity_rate || 0);
            const isPaid = receipt.status?.toLowerCase() === 'paid';
            
            return (
              <div 
                key={receipt.id}
                className="group p-5 bg-linear-to-b from-app-card-from to-app-card-to border border-app-card-border rounded-2xl flex flex-col justify-between hover:border-app-card-hover transition-all relative overflow-hidden shadow-xl"
              >
                {/* Visual top border line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-app-card-border group-hover:bg-app-accent/50 transition-colors" />

                {/* Card Top Details */}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-app-text-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-app-text-muted" /> Billing Date
                      </span>
                      <h3 className="text-base font-bold text-app-text-primary mt-0.5">{receipt.billing_date}</h3>
                    </div>
                    <div>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                        isPaid 
                          ? 'bg-app-tenant-accent-glow text-app-tenant-accent border-app-tenant-accent-border' 
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>

                  {/* Charges Breakdown Panel */}
                  <div className="space-y-2 border-t border-b border-app-card-border py-3.5 my-3.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-app-text-muted flex items-center gap-1.5">
                        <Banknote className="w-3.5 h-3.5 text-app-tenant-accent/60" /> Base Rent
                      </span>
                      <span className="font-semibold text-app-text-secondary">₹{Number(receipt.base_rent || 0).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-app-text-muted flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500/60" /> Electricity
                        <span className="text-[9px] text-app-text-muted">({electricityUnits} units)</span>
                      </span>
                      <span className="font-semibold text-app-text-secondary">₹{Number(electricityTotal || 0).toLocaleString('en-IN')}</span>
                    </div>

                    {receipt.water_charges > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-app-text-muted flex items-center gap-1.5">
                          <Droplets className="w-3.5 h-3.5 text-app-accent/60" /> Water
                        </span>
                        <span className="font-semibold text-app-text-secondary">₹{receipt.water_charges?.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    {receipt.trash_charges > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-app-text-muted flex items-center gap-1.5">
                          <Trash2 className="w-3.5 h-3.5 text-app-danger/60" /> Trash
                        </span>
                        <span className="font-semibold text-app-text-secondary">₹{receipt.trash_charges?.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    {receipt.previous_balance > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-app-text-muted flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-indigo-500/60" /> Prev Balance
                        </span>
                        <span className="font-semibold text-app-text-secondary">₹{receipt.previous_balance?.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total & Action Toolbar */}
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-app-text-muted">Total Bill</span>
                    <span className="text-lg font-black text-app-accent">₹{receipt.total_bill?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-app-card-border">
                    <button
                      id={`btn-share-${receipt.id}`}
                      onClick={() => triggerExport(receipt, 'share')}
                      className="flex flex-col items-center justify-center py-2 bg-app-card-to border border-app-card-border hover:border-app-card-hover rounded-xl transition-all cursor-pointer group/btn"
                      title="Share Statement"
                    >
                      <Share2 className="w-4 h-4 text-app-text-secondary group-hover/btn:text-app-accent transition-colors" />
                      <span className="text-[8px] text-app-text-muted mt-1 font-semibold group-hover/btn:text-app-text-primary">Share</span>
                    </button>

                    <button
                      id={`btn-download-${receipt.id}`}
                      onClick={() => triggerExport(receipt, 'download')}
                      className="flex flex-col items-center justify-center py-2 bg-app-card-to border border-app-card-border hover:border-app-card-hover rounded-xl transition-all cursor-pointer group/btn"
                      title="Download PNG"
                    >
                      <Download className="w-4 h-4 text-app-text-secondary group-hover/btn:text-app-tenant-accent transition-colors" />
                      <span className="text-[8px] text-app-text-muted mt-1 font-semibold group-hover/btn:text-app-text-primary">Download</span>
                    </button>

                    <button
                      id={`btn-edit-${receipt.id}`}
                      onClick={() => openEditModal(receipt)}
                      className="flex flex-col items-center justify-center py-2 bg-app-card-to border border-app-card-border hover:border-app-card-hover rounded-xl transition-all cursor-pointer group/btn"
                      title="Edit Receipt"
                    >
                      <Edit className="w-4 h-4 text-app-text-secondary group-hover/btn:text-amber-500 transition-colors" />
                      <span className="text-[8px] text-app-text-muted mt-1 font-semibold group-hover/btn:text-app-text-primary">Edit</span>
                    </button>

                    <button
                      id={`btn-delete-${receipt.id}`}
                      onClick={() => openDeleteModal(receipt)}
                      className="flex flex-col items-center justify-center py-2 bg-app-card-to border border-app-card-border hover:border-app-card-hover rounded-xl transition-all cursor-pointer group/btn"
                      title="Delete Receipt"
                    >
                      <Trash2 className="w-4 h-4 text-app-text-secondary group-hover/btn:text-app-danger transition-colors" />
                      <span className="text-[8px] text-app-text-muted mt-1 font-semibold group-hover/btn:text-app-text-primary">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL TEMPLATES ================= */}

      {/* 1. Edit Receipt Modal */}
      {activeModal === 'edit' && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-app-bg/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-app-bg border border-app-card-border p-6 rounded-3xl shadow-2xl flex flex-col my-8">
            {/* Top Close */}
            <button
              id="btn-close-edit-modal"
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 hover:bg-app-card-from text-app-text-muted hover:text-app-text-primary rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-black text-app-text-primary tracking-tight flex items-center gap-2 mb-1">
              <Edit className="w-5 h-5 text-amber-500" /> Edit Rent Receipt
            </h2>
            <p className="text-xs text-app-text-muted mb-6">
              Modify billing details below. The total bill will be automatically recalculated.
            </p>

            <form onSubmit={handleUpdateReceipt} className="space-y-4">
              {/* Row 1: Billing Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-app-text-secondary">Billing Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-app-text-muted" />
                  <input
                    name="billing_date"
                    value={editForm.billing_date}
                    onChange={handleEditChange}
                    type="date"
                    required
                    className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent pl-9 pr-3 py-2.5 rounded-xl text-xs text-app-text-primary placeholder-app-text-muted outline-none transition-colors cursor-pointer"
                  />
                </div>
              </div>

              {/* Row 2: Base Rent */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-app-text-secondary">Monthly Base Rent (₹)</label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-tenant-accent" />
                  <input
                    name="base_rent"
                    value={editForm.base_rent}
                    onChange={handleEditChange}
                    type="number"
                    min="0"
                    required
                    className="w-full bg-app-card-from border border-app-card-border focus:border-app-tenant-accent pl-10 pr-4 py-2.5 rounded-xl text-xs text-app-text-primary outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Electricity Readings */}
              <div className="grid grid-cols-3 gap-3 bg-app-card-to/40 p-3.5 rounded-2xl border border-app-card-border">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-app-text-secondary ml-1">Old Reading</span>
                  <input
                    name="old_reading"
                    value={editForm.old_reading}
                    onChange={handleEditChange}
                    type="number"
                    min="0"
                    required
                    className="bg-app-card-from border border-app-card-border rounded-lg px-2.5 py-1.5 text-xs text-app-text-primary outline-none focus:border-app-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-app-text-secondary ml-1">New Reading</span>
                  <input
                    name="new_reading"
                    value={editForm.new_reading}
                    onChange={handleEditChange}
                    type="number"
                    min="0"
                    required
                    className="bg-app-card-from border border-app-card-border rounded-lg px-2.5 py-1.5 text-xs text-app-text-primary outline-none focus:border-app-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-app-text-secondary ml-1">Unit Rate (₹)</span>
                  <input
                    name="electricity_rate"
                    value={editForm.electricity_rate}
                    onChange={handleEditChange}
                    type="number"
                    min="0"
                    required
                    className="bg-app-card-from border border-app-card-border rounded-lg px-2.5 py-1.5 text-xs text-app-text-primary outline-none focus:border-app-accent"
                  />
                </div>
              </div>

              {/* Row 4: Other Charges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-app-text-secondary ml-1">Water (₹)</label>
                  <input
                    name="water_charges"
                    value={editForm.water_charges}
                    onChange={handleEditChange}
                    type="number"
                    min="0"
                    className="bg-app-card-from border border-app-card-border focus:border-app-accent rounded-xl px-3 py-2.5 text-xs text-app-text-primary outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-app-text-secondary ml-1">Trash (₹)</label>
                  <input
                    name="trash_charges"
                    value={editForm.trash_charges}
                    onChange={handleEditChange}
                    type="number"
                    min="0"
                    className="bg-app-card-from border border-app-card-border focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-app-text-primary outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-app-text-secondary ml-1">Balance (₹)</label>
                  <input
                    name="previous_balance"
                    value={editForm.previous_balance}
                    onChange={handleEditChange}
                    type="number"
                    className="bg-app-card-from border border-app-card-border focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-app-text-primary outline-none"
                  />
                </div>
              </div>

              {/* Row 5: Payment Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-app-text-secondary">Payment Status</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditForm(prev => ({ ...prev, status: 'Pending' }))}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      editForm.status === 'Pending' 
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-xs' 
                        : 'bg-app-card-from text-app-text-secondary border-app-card-border hover:border-app-card-hover'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm(prev => ({ ...prev, status: 'Paid' }))}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      editForm.status === 'Paid' 
                        ? 'bg-app-tenant-accent-glow text-app-tenant-accent border-app-tenant-accent-border shadow-xs' 
                        : 'bg-app-card-from text-app-text-secondary border-app-card-border hover:border-app-card-hover'
                    }`}
                  >
                    Paid
                  </button>
                </div>
              </div>

              {/* Recalculated Summary Section */}
              <div className="p-4 bg-app-card-to border border-app-card-border rounded-2xl flex justify-between items-center mt-6">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-app-text-muted">Recalculated Total</span>
                  <div className="text-xl font-black text-app-accent mt-0.5">
                    ₹{calculateTotalBill(editForm).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-xs font-bold bg-app-card-from hover:bg-app-card-hover text-app-text-secondary rounded-xl cursor-pointer border border-app-card-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-save-edit-receipt"
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 text-xs font-bold bg-app-accent hover:bg-app-accent-hover disabled:bg-app-accent/50 text-white rounded-xl cursor-pointer transition-colors shadow-lg flex items-center gap-1.5"
                  >
                    {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Delete Confirmation Modal */}
      {activeModal === 'delete' && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-app-bg/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-app-bg border border-app-card-border p-6 rounded-3xl shadow-2xl flex flex-col relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 hover:bg-app-card-from text-app-text-muted hover:text-app-text-primary rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <AlertTriangle className="w-12 h-12 text-app-danger mb-3" />
            <h2 className="text-base font-black text-app-text-primary tracking-tight">Delete Receipt</h2>
            <p className="text-xs text-app-text-muted mt-2 leading-relaxed">
              Are you sure you want to permanently delete the receipt dated <span className="text-app-text-primary font-semibold">{selectedReceipt.billing_date}</span>? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2.5 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-xs font-bold bg-app-card-from hover:bg-app-card-hover text-app-text-secondary rounded-xl cursor-pointer border border-app-card-border transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete-receipt"
                onClick={handleDeleteReceipt}
                disabled={actionLoading}
                className="px-5 py-2 text-xs font-bold bg-app-danger hover:bg-app-danger-hover disabled:bg-app-danger/50 text-white rounded-xl cursor-pointer transition-colors shadow-lg flex items-center gap-1.5"
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden premium receipt voucher for image export and sharing (styled with hex to avoid html2canvas oklch crash) */}
      {selectedReceiptForExport && roomDetails && (
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
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#60a5fa' }}>Rentify.</span>
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
                <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>{roomDetails.propertyName || 'N/A'}</div>
                <div style={{ color: '#9ca3af', marginTop: '1px' }}>Room {roomDetails.roomNumber || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase', marginBottom: '2px' }}>Billing Date</div>
                <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>{selectedReceiptForExport.billing_date || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase', marginBottom: '2px' }}>Tenant</div>
                <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>
                  {roomDetails.tenantName || 'Vacant'} 
                  {roomDetails.tenantCode ? ` (${roomDetails.tenantCode})` : ''}
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
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#60a5fa', marginTop: '2px' }}>
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

export default ReceiptHistory;
