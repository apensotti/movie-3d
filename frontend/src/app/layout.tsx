'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { AccountAvatar } from '@/components/AccountAvatar';
import ButtonNav from '@/components/ButtonNav';
import LoginSignup from '@/components/LoginSignup';

import AuthProvider from '@/components/auth/AuthProvider';
import LoginSignupAvatar from '@/components/auth/LoginSignupAvatar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider >
        <div className="absolute top-0 left-4 z-50 flex flex-row items-center w-96 h-24 space-x-3">
          <ButtonNav />
        </div>

        <LoginSignupAvatar />
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
