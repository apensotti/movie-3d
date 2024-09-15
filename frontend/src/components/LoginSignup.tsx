import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

function LoginSignup() {
  return (
    <div className='flex gap-2'>
        <Button className='menu-button rounded-full bg-neutral-700 hover:bg-neutral-800 w-20 h-7'>
            <Link href={'/login'}>Login</Link>
        </Button>
        <Button className='menu-button rounded-full bg-violet-900 hover:bg-neutral-800 w-20 h-7'>
            <Link href={'/signup'} className='font-semibold'>Signup</Link>
        </Button>
    </div>
  )
}

export default LoginSignup