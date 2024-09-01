import { Search } from 'lucide-react'
import React from 'react'

function Header() {
  return (
    <div className='p-5 shadow-sm border-b-2 bg-white flex justify-between items-center'>
        <div className='flex gap-2 items-center p-2 border rounded-md max-w-lg bg-white'>
            <Search/>
            <input type='text' placeholder='Search...' className='outline-none'/>
        </div>
        <div>
            <h2 className='text-sm px-2 rounded-full bg-primary p-1 text-white'>
                🔥Join Membership for $9.99/Month
            </h2>
        </div>
    </div>
  )
}

export default Header