import React from 'react'
import Leftsection from './components/LeftSection/Leftsection'
import RightSection from './components/RIghtSection/RightSection'

const App = () => {
  return (
    <div className='h-screen w-full p-5 flex justify-center items-center bg-black'>
      <Leftsection />
      <RightSection />
    </div>
  )
}

export default App
