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
        <AuthProvider session={session}>
          <div className='absolute top-4 left-4'>
            <HomeButton h={12}/>
          </div>
            {children}
        </AuthProvider>
      </ThemeProvider>
      </body>
    </html>
  )
}

export default layout