import AuthProvider from '@/components/auth/AuthProvider';
import React from 'react'
import { Inter } from 'next/font/google';
import { auth } from '@/lib/auth/authConfig';
import { ThemeProvider } from '@/components/ui/theme-provider';

import "../../globals.css"
import { AppSidebar } from '@/components/component/LibrarySidebar/app-sidebar';
import { ProfileDataProvider } from '@/components/component/ProfileDataProvider';

const inter = Inter({ subsets: ['latin'] });

async function layout({children}: Readonly<{children: React.ReactNode;}>) {
  const session = await auth()
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider session={session}>
            <div className="flex flex-grow h-full w-full">                  
                <AppSidebar user_session={session || undefined}/>
                <div className="flex-grow h-screen">
                  {session?.user?.email && (
                    <ProfileDataProvider email={session.user.email} />
                  )}
                  {children}
                </div>
              </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
    
  )
}

export default layout