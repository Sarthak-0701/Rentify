import React from 'react'
import Leftsection from './components/sidebar/OwnerSidebar'
import RightSection from './components/dashboard/RightSection'
import Header from './components/header/Header'

const App = () => {
  return (
    <>
      <Header />
      <div className='w-full p-5 flex justify-center items-center bg-black'>
        <Leftsection />
        <RightSection />
      </div>
    </>
  )
}

export default App
