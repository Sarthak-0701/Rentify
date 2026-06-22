// import React, { useState } from 'react';
// import { User, Home, Calendar, Zap, Droplets, Trash2, Wallet, Banknote } from 'lucide-react';

// const RentCalculator = () => {
//   const [form, setForm] = useState({
//     tenant: '', owner: '', room: '', date: '',
//     baseRent: 0, oldRead: 0, newRead: 0, elecRate: 10,
//     water: 0, trash: 0, balance: 0
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: parseFloat(e.target.value) || e.target.value });
//   };

//   const electricityUnits = Math.max(0, form.newRead - form.oldRead);
//   const electricityTotal = electricityUnits * (parseFloat(form.elecRate) || 0);
//   const totalBill = (parseFloat(form.baseRent) || 0) + electricityTotal + 
//                     (parseFloat(form.water) || 0) + (parseFloat(form.trash) || 0) + 
//                     (parseFloat(form.balance) || 0);

//   return (
//     <div className='h-full w-1/2 bg-linear-to-b from-slate-950 to-black border border-slate-900 p-5 rounded-2xl shadow-2xl text-white flex flex-col justify-between relative overflow-hidden'>
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />
      
//       <h2 className='text-xl font-bold text-white tracking-tight mb-4'>Rent Calculator</h2>
      
//       <div className='flex-1 space-y-3.5 overflow-y-auto pr-1 select-custom-scroll'>
//         {/* Row 1: Room & Date */}
//         <div className='grid grid-cols-2 gap-3'>
//           <div className="relative">
//             <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
//             <input name="PropertyId" onChange={handleChange} type="text" placeholder="Property Id" className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-9 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors" />
//           </div>
//           <div className="relative">
//             <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
//             <input name="PropertyName" onChange={handleChange} type="text" placeholder="Property Name" className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-9 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors" />
//           </div>
//           <div className="relative">
//             <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
//             <input name="room" onChange={handleChange} type="text" placeholder="Room Num" className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-9 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors" />
//           </div>
//           <div className="relative">
//             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
//             <input name="date" onChange={handleChange} type="date" className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-9 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors
//             scheme-dark 
//             [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer 
//             [&::-webkit-calendar-picker-indicator]:invert-[0.3] 
//             [&::-webkit-calendar-picker-indicator]:sepia 
//             [&::-webkit-calendar-picker-indicator]:hue-rotate-190 
//             [&::-webkit-calendar-picker-indicator]:saturate-[5]" />
//           </div>
//         </div>

//         {/* Row 2: Tenant & Owner */}
//         <div className='grid grid-cols-2 gap-3'>
//           <div className="relative">
//             <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
//             <input name="tenant" onChange={handleChange} type="text" placeholder="Tenant Name" className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-9 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors" />
//           </div>
//           <div className="relative">
//             <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
//             <input name="owner" onChange={handleChange} type="text" placeholder="Owner Name" className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-9 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors" />
//           </div>
//         </div>

//         <div className='h-px bg-slate-900 my-1' />

//         {/* Row 3: Base Rent */}
//         <div className="relative">
//           <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
//           <input name="baseRent" onChange={handleChange} type="number" placeholder="Monthly Base Rent" className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500 pl-10 pr-4 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors" />
//         </div>

//         {/* Row 4: Electricity Detailed */}
//         <div className='grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-900'>
//           <div className="flex flex-col gap-1">
//             <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Old Reading</span>
//             <input name="oldRead" onChange={handleChange} type="number" className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" />
//           </div>
//           <div className="flex flex-col gap-1">
//             <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 ml-1">New Reading</span>
//             <input name="newRead" onChange={handleChange} type="number" className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" />
//           </div>
//           <div className="flex flex-col gap-1">
//             <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Unit Charge</span>
//             <input name="elecRate" onChange={handleChange} type="number" placeholder="10" className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs outline-none focus:border-blue-500 placeholder-gray-500" />
//           </div>
//         </div>

//         {/* Row 5: Other Charges */}
//         <div className='grid grid-cols-3 gap-3'>
//           <div className="relative">
//             <Droplets className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-400" />
//             <input name="water" onChange={handleChange} type="number" placeholder="Water" className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-8 pr-2 py-1.5 rounded-lg text-xs outline-none placeholder-gray-500" />
//           </div>
//           <div className="relative">
//             <Trash2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-amber-400" />
//             <input name="trash" onChange={handleChange} type="number" placeholder="Trash" className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 pl-8 pr-2 py-1.5 rounded-lg text-xs outline-none placeholder-gray-500" />
//           </div>
//           <div className="relative">
//             <Wallet className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
//             <input name="balance" onChange={handleChange} type="number" placeholder="Balance" className="w-full bg-slate-900/90 border border-slate-800 focus:border-indigo-500 pl-8 pr-2 py-1.5 rounded-lg text-xs outline-none placeholder-gray-500" />
//           </div>
//         </div>
//       </div>

//       {/* Footer Total Summary Panel */}
//       <div className='pt-3 mt-4 border-t border-slate-900 flex justify-between items-center'>
//         <div className='text-gray-500 text-[11px] tracking-wide'>
//           Units: <span className='text-slate-300 font-semibold'>{electricityUnits}</span> | 
//           Elec: <span className='text-slate-300 font-semibold'>₹{electricityTotal}</span>
//         </div>
//         <div className='text-right'>
//           <p className='text-[9px] font-semibold tracking-wider text-gray-500 uppercase leading-none mb-1'>Total Bill</p>
//           <p className='text-xl font-black text-blue-400 tracking-tight'>₹{totalBill.toLocaleString('en-IN')}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RentCalculator;



import React, { useState, useEffect, useRef } from 'react';
import { User, Home, Calendar, Zap, Droplets, Trash2, Wallet, Banknote, Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { supabase } from '../../supabase/client';
import { useAuthStore } from '../../supabase/store/AuthStore';

const RentCalculator = () => {
  const receiptRef = useRef(null);
  const exportReceiptRef = useRef(null);
  
  // Grab the logged-in owner's profile info from your Zustand store
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);

  // Database dropdown state collections
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');

  const [form, setForm] = useState({
    tenant: '', owner: '', roomNum: '', date: '',
    baseRent: 0, oldRead: 0, newRead: 0, elecRate: 10,
    water: 0, trash: 0, balance: 0
  });

  // Set the owner's name automatically as soon as the profile loads from the store
  useEffect(() => {
    if (profile?.full_name) {
      setForm(prev => ({ ...prev, owner: profile.full_name }));
    }
  }, [profile]);

  // 1. Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, name');
        if (error) throw error;
        setProperties(data || []);
      } catch (err) {
        console.error('Error fetching properties:', err.message);
      }
    };
    fetchProperties();
  }, []);

  // 2. Fetch rooms when property selection changes
  useEffect(() => {
    if (!selectedPropertyId) {
      setRooms([]);
      return;
    }
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('id, room_number, tenant_name, tenant_code, base_rent')
          .eq('property_id', selectedPropertyId);
        if (error) throw error;
        setRooms(data || []);
      } catch (err) {
        console.error('Error fetching rooms:', err.message);
      }
    };
    fetchRooms();
  }, [selectedPropertyId]);

  const handlePropertyChange = (e) => {
    const propId = e.target.value;
    setSelectedPropertyId(propId);
    setSelectedRoomId('');
    setForm(prev => ({ ...prev, tenant: '', roomNum: '', baseRent: 0 }));
  };

  const handleRoomChange = (e) => {
    const roomId = e.target.value;
    setSelectedRoomId(roomId);
    
    const targetRoom = rooms.find(r => r.id === roomId);
    if (targetRoom) {
      setForm(prev => ({
        ...prev,
        roomNum: targetRoom.room_number,
        tenant: targetRoom.tenant_name || 'Vacant',
        baseRent: targetRoom.base_rent || 0
      }));
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const electricityUnits = Math.max(0, form.newRead - form.oldRead);
  const electricityTotal = electricityUnits * (parseFloat(form.elecRate) || 0);
  const totalBill = (parseFloat(form.baseRent) || 0) + electricityTotal + 
                    (parseFloat(form.water) || 0) + (parseFloat(form.trash) || 0) + 
                    (parseFloat(form.balance) || 0);

  // 3. Save Calculated Receipt Parameters to Supabase
  const handleSaveReceipt = async () => {
    if (!selectedPropertyId || !selectedRoomId || !form.date) {
      alert("Please ensure property, room, and billing date are selected.");
      return;
    }

    const targetRoom = rooms.find(r => r.id === selectedRoomId);

    try {
      const { data, error } = await supabase
        .from('receipts')
        .insert([
          {
            property_id: selectedPropertyId,
            room_id: selectedRoomId,
            owner_id: user?.id || profile?.id,
            tenant_name: targetRoom?.tenant_name || null,
            tenant_code: targetRoom?.tenant_code || null,
            billing_date: form.date,
            base_rent: form.baseRent,
            old_reading: form.oldRead,
            new_reading: form.newRead,
            electricity_rate: form.elecRate,
            water_charges: form.water,
            trash_charges: form.trash,
            previous_balance: form.balance,
            total_bill: totalBill,
            status: 'Pending'
          }
        ]);

      if (error) throw error;
      alert("Receipt saved and synced to the database successfully!");
    } catch (err) {
      alert("Failed to save receipt: " + err.message);
    }
  };

  // 4. Export DOM card view to clean shared image element
  const downloadReceiptImage = async () => {
    if (!exportReceiptRef.current) return;
    try {
      const canvas = await html2canvas(exportReceiptRef.current, {
        backgroundColor: '#030712',
        scale: 2, // High resolution crisp scaling factor
        logging: false
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `receipt-${form.roomNum || 'unit'}-${form.date || 'date'}.png`;
      link.click();
    } catch (err) {
      console.error('Error generating image export:', err);
      alert("Failed to export receipt image: " + err.message);
    }
  };

  // 5. Share receipt using Web Share API
  const handleShare = async () => {
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
        
        const file = new File([blob], `receipt-${form.roomNum || 'room'}.png`, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Rent Receipt',
              text: `Rent receipt for Room ${form.roomNum} - Total: ₹${totalBill}`
            });
          } catch (shareErr) {
            if (shareErr.name !== 'AbortError') {
              console.error('Error sharing:', shareErr);
              downloadReceiptImage();
            }
          }
        } else {
          alert("Sharing files is not supported on this device/browser. Downloading receipt image instead.");
          downloadReceiptImage();
        }
      }, 'image/png');
    } catch (err) {
      console.error('Error sharing receipt:', err);
      alert("Failed to share receipt. " + err.message);
    }
  };

  return (
    <>
      <div 
        ref={receiptRef}
        className='h-full w-full max-w-md bg-linear-to-b from-slate-950 to-black border border-slate-900 p-5 rounded-2xl shadow-2xl text-white flex flex-col justify-between relative overflow-hidden'
      >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className='text-xl font-bold text-white tracking-tight'>Rent Calculator</h2>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleShare}
            className="p-1.5 hover:bg-slate-900 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Share Receipt"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button 
            onClick={downloadReceiptImage}
            className="p-1.5 hover:bg-slate-900 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Download Receipt PNG"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className='flex-1 space-y-3.5 overflow-y-auto pr-1 select-custom-scroll'>
        {/* Row 1: Property & Room Selection Dropdowns */}
        <div className='grid grid-cols-2 gap-3'>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <select 
              value={selectedPropertyId} 
              onChange={handlePropertyChange} 
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-9 pr-3 py-2 rounded-lg text-xs text-white outline-none appearance-none cursor-pointer"
            >
              <option value="">Choose Property</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <select 
              value={selectedRoomId} 
              onChange={handleRoomChange} 
              disabled={!selectedPropertyId}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-9 pr-3 py-2 rounded-lg text-xs text-white outline-none appearance-none cursor-pointer disabled:opacity-40"
            >
              <option value="">Select Room</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>{r.room_number}</option>
              ))}
            </select>
          </div>

          <div className="relative col-span-2">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input 
              name="date" 
              onChange={handleChange} 
              type="date" 
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-9 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors scheme-dark" 
            />
          </div>
        </div>

        {/* Row 2: RESTORED Tenant & Owner Layout Fields */}
        <div className='grid grid-cols-2 gap-3'>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input 
              name="tenant" 
              readOnly
              value={form.tenant} 
              type="text" 
              placeholder="Tenant Name" 
              className="w-full bg-slate-950 border border-slate-900 pl-9 pr-3 py-2 rounded-lg text-xs text-gray-400 outline-none capitalize" 
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input 
              name="owner" 
              readOnly
              value={form.owner} 
              type="text" 
              placeholder="Owner Name" 
              className="w-full bg-slate-950 border border-slate-900 pl-9 pr-3 py-2 rounded-lg text-xs text-gray-400 outline-none capitalize" 
            />
          </div>
        </div>

        <div className='h-px bg-slate-900 my-1' />

        {/* Row 3: Base Rent */}
        <div className="relative">
          <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
          <input 
            name="baseRent" 
            readOnly
            value={form.baseRent || ''} 
            type="number" 
            placeholder="Monthly Base Rent (Auto-filled)" 
            className="w-full bg-slate-950 border border-slate-900 pl-10 pr-4 py-2 rounded-lg text-xs text-gray-400 outline-none" 
          />
        </div>

        {/* Row 4: Electricity Detailed Components */}
        <div className='grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-900'>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Old Reading</span>
            <input name="oldRead" onChange={handleChange} type="number" className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 ml-1">New Reading</span>
            <input name="newRead" onChange={handleChange} type="number" className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Unit Charge</span>
            <input name="elecRate" value={form.elecRate} onChange={handleChange} type="number" className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* Row 5: Other Charges */}
        <div className='grid grid-cols-3 gap-3'>
          <div className="relative">
            <Droplets className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-400" />
            <input name="water" onChange={handleChange} type="number" placeholder="Water" className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-8 pr-2 py-1.5 rounded-lg text-xs text-white outline-none placeholder-gray-500" />
          </div>
          <div className="relative">
            <Trash2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-amber-400" />
            <input name="trash" onChange={handleChange} type="number" placeholder="Trash" className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 pl-8 pr-2 py-1.5 rounded-lg text-xs text-white outline-none placeholder-gray-500" />
          </div>
          <div className="relative">
            <Wallet className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
            <input name="balance" onChange={handleChange} type="number" placeholder="Balance" className="w-full bg-slate-900/90 border border-slate-800 focus:border-indigo-500 pl-8 pr-2 py-1.5 rounded-lg text-xs text-white outline-none placeholder-gray-500" />
          </div>
        </div>
      </div>

      {/* Save Action Sync Trigger */}
      <button 
        onClick={handleSaveReceipt}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-medium text-xs transition-colors cursor-pointer shadow-lg shadow-blue-900/20"
      >
        Generate & Save
      </button>

      {/* Footer Total Summary Panel */}
      <div className='pt-3 mt-4 border-t border-slate-900 flex justify-between items-center'>
        <div className='text-gray-500 text-[11px] tracking-wide'>
          Units: <span className='text-slate-300 font-semibold'>{electricityUnits}</span> | 
          Elec: <span className='text-slate-300 font-semibold'>₹{electricityTotal}</span>
        </div>
        <div className='text-right'>
          <p className='text-[9px] font-semibold tracking-wider text-gray-500 uppercase leading-none mb-1'>Total Bill</p>
          <p className='text-xl font-black text-blue-400 tracking-tight'>₹{totalBill.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>

      {/* Hidden premium receipt voucher for image export and sharing (styled with hex to avoid html2canvas oklch crash) */}
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
              <span style={{ display: 'flex', justifyContent:'center' , alignItems:'center' , fontSize: '10px', background: '#1e3a8a', color: '#93c5fd', padding: '4px 8px', borderRadius: '9999px', fontWeight: 'bold', border: '1px solid #1d4ed8' }}>
                Pending
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '12px' }}>
            <div>
              <div style={{ color: '#6b7280', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase', marginBottom: '2px' }}>Property / Room</div>
              <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>{properties.find(p => p.id === selectedPropertyId)?.name || 'N/A'}</div>
              <div style={{ color: '#9ca3af', marginTop: '1px' }}>Room {form.roomNum || 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: '#6b7280', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase', marginBottom: '2px' }}>Billing Date</div>
              <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>{form.date || 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: '#6b7280', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase', marginBottom: '2px' }}>Tenant</div>
              <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>{form.tenant || 'Vacant'}</div>
            </div>
            <div>
              <div style={{ color: '#6b7280', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase', marginBottom: '2px' }}>Owner</div>
              <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>{form.owner || 'N/A'}</div>
            </div>
          </div>

          {/* Charges Breakdown */}
          <div style={{ borderTop: '1px solid #111827', borderBottom: '1px solid #111827', padding: '16px 0', marginBottom: '24px' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '12px' }}>Breakdown of Charges</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
              <span style={{ color: '#9ca3af' }}>Monthly Base Rent</span>
              <span style={{ color: '#f3f4f6', fontWeight: 'bold' }}>₹{Number(form.baseRent || 0).toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
              <span style={{ color: '#9ca3af' }}>
                Electricity 
                <span style={{ fontSize: '10px', color: '#6b7280', marginLeft: '4px' }}>
                  ({electricityUnits} units @ ₹{form.elecRate}/unit)
                </span>
              </span>
              <span style={{ color: '#f3f4f6', fontWeight: 'bold' }}>₹{electricityTotal.toLocaleString('en-IN')}</span>
            </div>

            {form.water > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                <span style={{ color: '#9ca3af' }}>Water Charges</span>
                <span style={{ color: '#f3f4f6', fontWeight: 'bold' }}>₹{Number(form.water).toLocaleString('en-IN')}</span>
              </div>
            )}

            {form.trash > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                <span style={{ color: '#9ca3af' }}>Trash Charges</span>
                <span style={{ color: '#f3f4f6', fontWeight: 'bold' }}>₹{Number(form.trash).toLocaleString('en-IN')}</span>
              </div>
            )}

            {form.balance > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                <span style={{ color: '#9ca3af' }}>Previous Balance</span>
                <span style={{ color: '#f3f4f6', fontWeight: 'bold' }}>₹{Number(form.balance).toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>Total Amount Due</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#60a5fa', marginTop: '2px' }}>
                ₹{totalBill.toLocaleString('en-IN')}
              </div>
            </div>
            <div style={{ fontSize: '10px', color: '#4b5563', fontStyle: 'italic', textAlign: 'right' }}>
              Thank you for renting!
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RentCalculator;