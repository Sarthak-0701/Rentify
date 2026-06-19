import React from 'react'
import Navbar from './Navbar'
import RentManagement from './RentManagement'
import RentCalculator from './RentCalculator'

const RightSection = () => {
  return (
    <div className='h-full w-5/6 bg-gray-900 rounded flex flex-col text-left border-l-2'>
      <Navbar />
      <div className='flex h-full w-full gap-5 pt-5'>
        <RentManagement />
        <RentCalculator />
      </div>
      <div>
        
      </div>
    </div>
  )
}

export default RightSection
