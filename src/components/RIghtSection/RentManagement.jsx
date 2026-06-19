import React from 'react'

const RentManagement = () => {
  return (
    <div className='h-3/5 w-1/2 flex flex-col items-start gap-3 pl-5 rounded'>
      <h1 className='h-1/8 text-2xl text-white font-bold'>Rent Management</h1>
      <div className='h-2/8 flex gap-3 w-full'>

        <div className='w-1/3 h-full bg-gray-700  rounded-lg p-3'>
            <h3 className='text-[1rem] text-gray-300'>Active Properties</h3>
            <h1 className='text-[1.5rem] font-bold text-white'>10</h1>
        </div>
        
        <div className='w-1/3 h-full bg-gray-700 text-white rounded-lg p-3'>
            <h3 className='text-[1rem] text-gray-300'>Occupancy Rate</h3>
            <h1 className='text-[1.5rem] font-bold text-white'>85%</h1>
        </div>

        <div className='w-1/3 h-full bg-gray-700 text-white rounded-lg p-3'>
            <h3 className='text-[1rem] '>Total Tenant</h3>
            <h1 className='text-[1.5rem] font-bold text-white'>10</h1>
        </div>

      </div>

      <div className='h-5/8 flex gap-3 w-full'>
        <div className='w-1/3 h-full bg-gray-700 rounded-lg'></div>
        <div className='w-1/3 h-full bg-gray-700 rounded-lg'></div>
        <div className='w-1/3 h-full bg-gray-700 rounded-lg'></div>
      </div>

    </div>
  )
}

export default RentManagement
