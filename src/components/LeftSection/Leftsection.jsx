import React from 'react'

const Leftsection = () => {
  return (
    <div className='h-full w-1/6 bg-gray-800 rounded flex flex-col text-left gap-10 py-5 pl-10'>
      <div>
        <h1 className='text-white text-3xl font-bold'>Rentify</h1>
      </div>
      <div className='flex flex-col  text-xl text-white text-left font-medium gap-5'>
        <div className='hover:cursor-pointer'>Dashboard</div>
        <div className='hover:cursor-pointer'>Properties</div>
        <div className='hover:cursor-pointer'>Tenants</div>
        <div className='hover:cursor-pointer'>Calculator</div>
        <div className='hover:cursor-pointer'>Payments</div>
        <div className='hover:cursor-pointer'>Settings</div>
      </div>
    </div>
  )
}

export default Leftsection
