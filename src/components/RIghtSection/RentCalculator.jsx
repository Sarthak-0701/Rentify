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

//   // Calculation Logic
//   const electricityUnits = Math.max(0, form.newRead - form.oldRead);
//   const electricityTotal = electricityUnits * (parseFloat(form.elecRate) || 0);
//   const totalBill = (parseFloat(form.baseRent) || 0) + electricityTotal + 
//                     (parseFloat(form.water) || 0) + (parseFloat(form.trash) || 0) + 
//                     (parseFloat(form.balance) || 0);

//   return (
//     <div className='h-3/5 w-full max-w-2xl bg-gray-900 p-3 rounded-xl shadow-2xl text-white flex flex-col overflow-hidden border border-gray-500'>
//       <h1 className='h-1/8 text-2xl text-white font-bold'>Rent Calculator</h1>
      
//       <div className='flex-1 space-y-2 overflow-y-auto pr-2'>
//         {/* Row 1: Room & Date */}
//         <div className='grid grid-cols-2 gap-3'>
//           <div className="relative">
//             <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
//             <input name="room" onChange={handleChange} type="text" placeholder="Room Num" className="w-full bg-gray-800 pl-9 pr-3 py-1.5 rounded text-sm outline-none focus:border-blue-500 border border-transparent" />
//           </div>
//           <div className="relative">
//             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
//             <input name="date" onChange={handleChange} type="date" className="w-full bg-gray-800 pl-9 pr-3 py-1.5 rounded text-sm outline-none focus:border-blue-500 border border-transparent" />
//           </div>
//         </div>

//         {/* Row 2: Tenant & Owner */}
//         <div className='grid grid-cols-2 gap-3'>
//           <div className="relative">
//             <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
//             <input name="tenant" onChange={handleChange} type="text" placeholder="Tenant Name" className="w-full bg-gray-800 pl-9 pr-3 py-1.5 rounded text-sm outline-none focus:border-blue-500 border border-transparent" />
//           </div>
//           <div className="relative">
//             <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
//             <input name="owner" onChange={handleChange} type="text" placeholder="Owner Name" className="w-full bg-gray-800 pl-9 pr-3 py-1.5 rounded text-sm outline-none focus:border-blue-500 border border-transparent" />
//           </div>
//         </div>

//         <div className='h-px bg-gray-700 my-2' />

//         {/* Row 3: Base Rent */}
//         <div className="relative">
//           <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
//           <input name="baseRent" onChange={handleChange} type="number" placeholder="Monthly Base Rent" className="w-full bg-gray-800 pl-10 pr-4 py-1 rounded-lg outline-none border border-gray-700 focus:border-green-500" />
//         </div>

//         {/* Row 4: Electricity Detailed */}
//         <div className='grid grid-cols-3 gap-2 bg-gray-900/70 p-2 rounded-lg border border-gray-700'>
//           <div className="flex flex-col gap-1">
//             <span className="text-[10px] text-gray-400 uppercase ml-1">Old Reading</span>
//             <input name="oldRead" onChange={handleChange} type="number" className="bg-gray-700 px-2 py-1 rounded text-sm outline-none" />
//           </div>
//           <div className="flex flex-col gap-1">
//             <span className="text-[10px] text-gray-400 uppercase ml-1">New Reading</span>
//             <input name="newRead" onChange={handleChange} type="number" className="bg-gray-700 px-2 py-1 rounded text-sm outline-none" />
//           </div>
//           <div className="flex flex-col gap-1">
//             <span className="text-[10px] text-gray-400 uppercase ml-1">Unit Charge</span>
//             <input name="elecRate" onChange={handleChange} type="number" placeholder="10" className="bg-gray-700 px-2 py-1 rounded text-sm outline-none" />
//           </div>
//         </div>

//         {/* Row 5: Other Charges */}
//         <div className='grid grid-cols-3 gap-3'>
//           <div className="relative">
//             <Droplets className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-400" />
//             <input name="water" onChange={handleChange} type="number" placeholder="Water" className="w-full bg-gray-800 pl-7 pr-2 py-1 rounded text-sm outline-none border border-gray-700" />
//           </div>
//           <div className="relative">
//             <Trash2 className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-orange-400" />
//             <input name="trash" onChange={handleChange} type="number" placeholder="Trash" className="w-full bg-gray-800 pl-7 pr-2 py-1 rounded text-sm outline-none border border-gray-700" />
//           </div>
//           <div className="relative">
//             <Wallet className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-purple-400" />
//             <input name="balance" onChange={handleChange} type="number" placeholder="Balance" className="w-full bg-gray-800 pl-7 pr-2 py-1 rounded text-sm outline-none border border-gray-700" />
//           </div>
//         </div>
//       </div>

//       {/* Footer Total */}
//       <div className='pt-2 border-t border-gray-700 flex justify-between items-center'>
//         <div className='text-gray-400 text-xs'>
//           Units: <span className='text-white font-bold'>{electricityUnits}</span> | 
//           Elec: <span className='text-white font-bold'>₹{electricityTotal}</span>
//         </div>
//         <div className='text-right'>
//           <p className='text-[10px] text-gray-400 uppercase leading-none'>Total Bill</p>
//           <p className='text-2xl font-black text-blue-400'>₹{totalBill.toLocaleString('en-IN')}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RentCalculator;


import React, { useState } from 'react';
import { User, Home, Calendar, Zap, Droplets, Trash2, Wallet, Banknote } from 'lucide-react';

const RentCalculator = () => {
  const [form, setForm] = useState({
    tenant: '', owner: '', room: '', date: '',
    baseRent: 0, oldRead: 0, newRead: 0, elecRate: 10,
    water: 0, trash: 0, balance: 0
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value) || e.target.value });
  };

  const electricityUnits = Math.max(0, form.newRead - form.oldRead);
  const electricityTotal = electricityUnits * (parseFloat(form.elecRate) || 0);
  const totalBill = (parseFloat(form.baseRent) || 0) + electricityTotal + 
                    (parseFloat(form.water) || 0) + (parseFloat(form.trash) || 0) + 
                    (parseFloat(form.balance) || 0);

  return (
    <div className='h-full w-1/2 bg-gradient-to-b from-slate-950 to-black border border-slate-900 p-5 rounded-2xl shadow-2xl text-white flex flex-col justify-between relative overflow-hidden'>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      
      <h2 className='text-xl font-bold text-white tracking-tight mb-4'>Rent Calculator</h2>
      
      <div className='flex-1 space-y-3.5 overflow-y-auto pr-1 select-custom-scroll'>
        {/* Row 1: Room & Date */}
        <div className='grid grid-cols-2 gap-3'>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input name="room" onChange={handleChange} type="text" placeholder="Room Num" className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-9 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors" />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input name="date" onChange={handleChange} type="date" className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-9 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors
            scheme-dark 
            [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer 
            [&::-webkit-calendar-picker-indicator]:invert-[0.3] 
            [&::-webkit-calendar-picker-indicator]:sepia 
            [&::-webkit-calendar-picker-indicator]:hue-rotate-190 
            [&::-webkit-calendar-picker-indicator]:saturate-[5]" />
          </div>
        </div>

        {/* Row 2: Tenant & Owner */}
        <div className='grid grid-cols-2 gap-3'>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input name="tenant" onChange={handleChange} type="text" placeholder="Tenant Name" className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-9 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors" />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input name="owner" onChange={handleChange} type="text" placeholder="Owner Name" className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-9 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors" />
          </div>
        </div>

        <div className='h-px bg-slate-900 my-1' />

        {/* Row 3: Base Rent */}
        <div className="relative">
          <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
          <input name="baseRent" onChange={handleChange} type="number" placeholder="Monthly Base Rent" className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500 pl-10 pr-4 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-colors" />
        </div>

        {/* Row 4: Electricity Detailed */}
        <div className='grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-900'>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Old Reading</span>
            <input name="oldRead" onChange={handleChange} type="number" className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 ml-1">New Reading</span>
            <input name="newRead" onChange={handleChange} type="number" className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Unit Charge</span>
            <input name="elecRate" onChange={handleChange} type="number" placeholder="10" className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs outline-none focus:border-blue-500 placeholder-gray-500" />
          </div>
        </div>

        {/* Row 5: Other Charges */}
        <div className='grid grid-cols-3 gap-3'>
          <div className="relative">
            <Droplets className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-400" />
            <input name="water" onChange={handleChange} type="number" placeholder="Water" className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 pl-8 pr-2 py-1.5 rounded-lg text-xs outline-none placeholder-gray-500" />
          </div>
          <div className="relative">
            <Trash2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-amber-400" />
            <input name="trash" onChange={handleChange} type="number" placeholder="Trash" className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 pl-8 pr-2 py-1.5 rounded-lg text-xs outline-none placeholder-gray-500" />
          </div>
          <div className="relative">
            <Wallet className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
            <input name="balance" onChange={handleChange} type="number" placeholder="Balance" className="w-full bg-slate-900/90 border border-slate-800 focus:border-indigo-500 pl-8 pr-2 py-1.5 rounded-lg text-xs outline-none placeholder-gray-500" />
          </div>
        </div>
      </div>

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
  );
};

export default RentCalculator;