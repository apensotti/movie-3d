import { Inter } from 'next/font/google';
import '../../globals.css';
import HomeButton from '@/components/component/HomeButton';
import AuthProvider from '@/components/auth/AuthProvider';
import LoginSignupAvatar from '@/components/auth/LoginSignupAvatar';
import { useSession } from 'next-auth/react';
import { AI } from '@/components/ai/ai';
import { auth } from '@/lib/auth/authConfig';
import { AppSidebar } from '@/components/component/LibrarySidebar/app-sidebar';
import { ThemeProvider } from 'next-themes';
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
              <div className="flex flex-grow h-full w-full">                  
                <AppSidebar user_session={session || undefined}/>
                <div className="flex-grow h-screen">
                  {session?.user?.email && (
                    <ProfileDataProvider email={session.user.email} />
                  )}
                  {children}
                </div>
              </div>
            </AI>
          </AuthProvider>
          </ThemeProvider>
        </body>
    </html>
  );
}
