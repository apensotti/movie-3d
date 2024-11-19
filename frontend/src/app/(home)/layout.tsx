import React from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
import HomeButton from '@/components/component/HomeButton';
import AuthProvider from '@/components/auth/AuthProvider';
import LoginSignupAvatar from '@/components/auth/LoginSignupAvatar';
import { useSession } from 'next-auth/react';
import { AI } from '@/components/ai/ai';
import { auth } from '@/lib/auth/authConfig';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AppSidebar } from '@/components/component/LibrarySidebar/app-sidebar';
import LoginSignup from '@/components/auth/LoginSignup';
import SearchBar from '@/components/component/SearchBar/SearchBar';
import { ProfileDataProvider } from '@/components/component/ProfileDataProvider';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
    <html lang="en">
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider session={session}>
            <AI>                
              <div className="flex flex-grow h-full w-full bg-neutral-900">
                {session ? (                  
                  <div className="flex flex-grow h-full w-full">                  
                    <AppSidebar user_session={session}/>
                    <div className="flex-grow h-screen">
                      <div className="relative w-fit left-1/2 -translate-x-1/2 pt-6">
                        <SearchBar />
                      </div>
                      <div className="flex-grow">
                      {session?.user?.email && (
                          <ProfileDataProvider email={session.user.email} />
                        )}
                        {children}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col min-h-screen w-full">
                    <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-center bg-neutral-900 z-10 no-scrollbar">
                      <div className="absolute top-6 left-1/2 -translate-x-1/2">
                        <SearchBar />
                      </div>
                      <div className="absolute left-4 top-4">
                        <HomeButton h={16}/>
                      </div>
                      <div className="absolute right-4 top-6">
                        <LoginSignup />
                      </div>
                    </div>
                    <div className="flex-grow pt-16">
                      {children}
                    </div>
                  </div>
                )}
              </div>
            </AI>
          </AuthProvider>
        </ThemeProvider>
        </body>
    </html>
  );
}
