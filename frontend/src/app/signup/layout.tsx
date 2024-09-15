import AuthProvider from '@/components/auth/AuthProvider';
import React from 'react'
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

function layout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <AuthProvider>
        {children}
    </AuthProvider>
  )
}

export default layout