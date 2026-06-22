import React from 'react'
import SearchBar from './SearchBar'
import { Bell } from 'lucide-react'


const Navbar = () => {
  return (
    <div className='w-full flex justify-between border-b-2 items-center border-gray-700'>
      <div className='p-5 text-white text-xl font-bold'>
        DASHBOARD
      </div>

      <div className='flex items-center gap-5 px-5'>
        <div>
            <SearchBar />
        </div>
        <div>
            <Bell className='hover:cursor-pointer' size={27} color="#ffffff" strokeWidth={1.75} />
        </div>
        <div className='flex gap-2 items-center hover:cursor-pointer overflow-hidden'>
            <div className='h-12 w-12 rounded-full bg-gray-600'>
                <img src='https://avatars.githubusercontent.com/u/110792732?v=4' alt='profile' className='h-full w-full rounded-full object-cover' />
            </div>
            <h1 className='text-white text-lg font-bold'>Sarthak</h1>
        </div>
      </div>
    </div>
  )
}

export default Navbar
