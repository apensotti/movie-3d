import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

function LoginSignup() {
  return (
    <div className='flex gap-2'>
        <Link href={'/login'}>
          <Button className='menu-button rounded-full bg-neutral-800 hover:bg-neutral-850 w-20 h-7 font-semibold'>
             Login
          </Button>
        </Link>
        <Link href={'/signup'}>
          <Button className='menu-button rounded-full bg-violet-800 hover:bg-orange-500 w-20 h-7 font-semibold'>
              Signup
          </Button>
        </Link>
    </div>
  )
}

export default LoginSignup