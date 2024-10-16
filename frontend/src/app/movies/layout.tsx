import AuthProvider from '@/components/auth/AuthProvider';
import React from 'react'
import { Inter } from 'next/font/google';
import { auth } from '@/lib/auth/authConfig';


const inter = Inter({ subsets: ['latin'] });

async function layout({children}: Readonly<{children: React.ReactNode;}>) {
  const session = await auth()
  
  return (
    <AuthProvider session={session}>
        {children}
    </AuthProvider>
  )
}

export default layout