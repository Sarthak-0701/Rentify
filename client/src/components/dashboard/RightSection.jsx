// import React from 'react'
// import Navbar from './Navbar'
// import RentManagement from './RentManagement'
// import RentCalculator from './RentCalculator'


// const RightSection = () => {
//   return (
//     <div className='h-full w-5/6 bg-gray-900 rounded flex flex-col text-left border-l-2'>
      
//       <div className='flex h-full w-full gap-5 pt-5'>
//         <RentManagement />
//         <RentCalculator />
//       </div>
//       <div>
        
//       </div>
//     </div>
//   )
// }

// export default RightSection


import React from 'react';
import Navbar from './Navbar';
import RentManagement from './RentManagement';
import RentCalculator from './RentCalculator';

const RightSection = () => {
  return (
    <div className='h-full w-5/6 flex flex-col text-left pl-5'>
      <div className='flex h-full w-full gap-5 pt-5 overflow-hidden pb-2'>
        <RentManagement />
        <RentCalculator />
      </div>
    </div>
  );
};

export default RightSection;