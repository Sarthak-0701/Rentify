import React from 'react'
import RentCalculator from '../../components/dashboard/RentCalculator'

const Calculator = () => {
  return (
    <div className='w-full py-4 sm:py-7 min-h-[80vh] flex flex-col justify-start md:justify-center items-center'>
      <RentCalculator />
    </div>
  )
}

export default Calculator
