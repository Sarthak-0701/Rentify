import React from 'react'
import LeftSection from '../components/LeftSection/Leftsection'
import RightSection from '../components/RightSection/RightSection'
import OwnerHeader from '../components/OwnerHeader'

const OwnerDashboard = () => {
  return (
    <div>
      <div className='flex relative h-[90vh] bg-gray-900'>
        <LeftSection />
        <RightSection />
      </div>
    </div>
  )
}

export default OwnerDashboard
