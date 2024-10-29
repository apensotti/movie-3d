import { Inter } from 'next/font/google';
import AuthProvider from '@/components/auth/AuthProvider';
import LoginSignupAvatar from '@/components/auth/LoginSignupAvatar';
import { AI } from '@/components/ai/ai';
import { auth } from '@/lib/auth/authConfig';
import { SidebarProvider, SidebarTrigger  } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import '../../globals.css'
import { ThemeProvider } from 'next-themes';
import { getMessages, getUserSessions } from '@/app/(chat)/actions';

export const maxDuration = 30;
export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] });


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  const sessions = session?.user?.email ? await getUserSessions(session.user.email) : null;

  return (
    <html lang="en" suppressHydrationWarning={true}>
        <body className={`${inter.className} h-screen flex flex-col`} >
          <ThemeProvider attribute="class" defaultTheme="dark">
            <AuthProvider session={session}>
              <AI>
                <SidebarProvider defaultOpen={false}>
                <div className="flex flex-grow overflow-hidden">
                  
                  <AppSidebar sessions={sessions || []}/>
                  <div className="flex-grow flex flex-col overflow-hidden" >
                    <LoginSignupAvatar session={session}/>
                    {children}
                  </div>
                </div>
                </SidebarProvider>
              </AI>
            </AuthProvider>
          </ThemeProvider>
        </body>
    </html>
  );
}
