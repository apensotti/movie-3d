import { Inter } from 'next/font/google';
import './globals.css';
import ButtonNav from '@/components/ButtonNav';
import AuthProvider from '@/components/auth/AuthProvider';
import LoginSignupAvatar from '@/components/auth/LoginSignupAvatar';
import { useSession } from 'next-auth/react';
import { AI } from '@/components/ai/ai';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <AuthProvider >
        <body className={inter.className}>
          <div className="absolute top-0 left-4 z-50 flex flex-row items-center w-96 h-24 space-x-3">
            <ButtonNav />
          </div>
          <AI>
          {children}
          </AI>
        </body>
      </AuthProvider>
    </html>
  );
}
