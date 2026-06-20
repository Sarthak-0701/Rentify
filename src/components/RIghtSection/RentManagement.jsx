// import React from 'react'

// const RentManagement = () => {
//   return (
//     <div className='h-3/5 w-1/2 flex flex-col items-start gap-3 pl-5 rounded'>
//       <h1 className='h-1/8 text-2xl text-white font-bold'>Rent Management</h1>
//       <div className='h-2/8 flex gap-3 w-full'>

//         <div className='w-1/3 h-full bg-gray-700  rounded-lg p-3'>
//             <h3 className='text-[1rem] text-gray-300'>Active Properties</h3>
//             <h1 className='text-[1.5rem] font-bold text-white'>10</h1>
//         </div>
        
//         <div className='w-1/3 h-full bg-gray-700 text-white rounded-lg p-3'>
//             <h3 className='text-[1rem] text-gray-300'>Occupancy Rate</h3>
//             <h1 className='text-[1.5rem] font-bold text-white'>85%</h1>
//         </div>

//         <div className='w-1/3 h-full bg-gray-700 text-white rounded-lg p-3'>
//             <h3 className='text-[1rem] '>Total Tenant</h3>
//             <h1 className='text-[1.5rem] font-bold text-white'>10</h1>
//         </div>

//       </div>

//       <div className='h-5/8 flex gap-3 w-full'>
//         <div className='w-1/3 h-full bg-gray-700 rounded-lg'></div>
//         <div className='w-1/3 h-full bg-gray-700 rounded-lg'></div>
//         <div className='w-1/3 h-full bg-gray-700 rounded-lg'></div>
//       </div>

//     </div>
//   )
// }

// export default RentManagement




import React from 'react';

const RentManagement = () => {
  const cards = [
    { title: "Active Properties", value: "10" },
    { title: "Occupancy Rate", value: "85%" },
    { title: "Total Tenants", value: "10" }
  ];

  return (
    <div className='h-full w-1/2 flex flex-col items-start gap-4 rounded-2xl'>
      <h2 className='text-xl font-bold text-white tracking-tight'>Rent Management</h2>
      
      {/* Analytics Row */}
      <div className='grid grid-cols-3 gap-3 w-full'>
        {cards.map((card, idx) => (
          <div key={idx} className='bg-linear-to-b from-slate-950 to-black border border-slate-900 rounded-xl p-4 shadow-md relative group hover:border-blue-900/40 transition-colors'>
            <h3 className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1'>{card.title}</h3>
            <h1 className='text-2xl font-extrabold text-white tracking-tight'>{card.value}</h1>
          </div>
        ))}
      </div>

      <div className='grow grid grid-cols-3 gap-3 w-full min-h-45'>
        <div className='bg-linear-to-b from-slate-950 to-black border border-slate-900 rounded-xl hover:border-slate-800 transition-colors'></div>
        <div className='bg-linear-to-b from-slate-950 to-black border border-slate-900 rounded-xl hover:border-slate-800 transition-colors'></div>
        <div className='bg-linear-to-b from-slate-950 to-black border border-slate-900 rounded-xl hover:border-slate-800 transition-colors'></div>
      </div>
    </div>
  );
};

export default RentManagement;