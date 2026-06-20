import React from 'react'
import Leftsection from './components/LeftSection/Leftsection'
import RightSection from './components/RightSection/RightSection'
import Header from './components/Header'

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
