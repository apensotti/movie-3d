import AuthProvider from '@/components/auth/AuthProvider';
import React from 'react'
import { Inter } from 'next/font/google';
import { auth } from '@/lib/auth/authConfig';
import { ThemeProvider } from 'next-themes';
import "../../globals.css"
import HomeButton from '@/components/component/HomeButton';

const inter = Inter({ subsets: ['latin'] });

async function layout({children}: Readonly<{children: React.ReactNode;}>) {
  const session = await auth()
  
  return (
    <html lang='en'>
      <body className={`${inter.className} h-screen flex flex-col`}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div className="absolute -top-0 left-4 z-50 flex flex-row items-center w-96 h-24 space-x-3">
          <HomeButton />
        </div>
        <AuthProvider session={session}>
            {children}
        </AuthProvider>
      </ThemeProvider>
      </body>
    </html>
  )
}

export default layout