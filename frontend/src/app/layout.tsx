"use client";

import { useState } from 'react';
import Link from 'next/link';
import { BsStars } from "react-icons/bs";
import { Button } from '../components/ui/button';
import { Inter } from 'next/font/google';
import "./globals.css";
import { AccountAvatar } from '@/components/AccountAvatar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Main container for logo and buttons */}
        <div className='absolute top-0 left-4 z-50 flex flex-row items-center w-96 h-24 space-x-3'>
          {/* Logo */}
          <div className="relative w-14 h-14">
            <img
              src="/wizardlogo2xwhite.png"
              alt="logo"
              className="absolute top-0 left-0 w-14 h-14 z-10 cursor-pointer fade-on-hover duration-200 ease-in-out"
              onClick={toggleMenu}
            />
            <img
              src="/wizardlogo2x.png"
              alt="logo"
              className="absolute top-0 left-0 w-14 h-14"
            />
          </div>

          {/* Buttons Menu */}
          {isMenuVisible && (
            <div className="flex flex-row space-x-2 transition-opacity duration-300 ease-in-out">
              <Button className="menu-button rounded-full bg-neutral-700 hover:bg-neutral-800 w-20 h-7">
                <Link href={'/games'}>Games</Link>
              </Button>
              <Button className="menu-button rounded-full bg-neutral-700 hover:bg-neutral-800 w-20 h-7">
                <Link href={'/reviews'}>Reviews</Link>
              </Button>
              <Button className="menu-button rounded-full w-7 h-7 bg-violet-900">
                <Link href={"/"}>
                  <BsStars className='text-white' />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Avatar in the top-right corner */}
        <div className="absolute top-6 right-6 z-50">
          <AccountAvatar />
        </div>

        {/* Content */}
        {children}
      </body>
    </html>
  );
}
