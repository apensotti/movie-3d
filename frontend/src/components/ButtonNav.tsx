"use client"; 

import React from 'react'
import Link from 'next/link';
import { BsStars } from "react-icons/bs";
import { Button } from '../components/ui/button';
import { useState } from 'react';

const ButtonNav = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <>
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

    {isMenuVisible && (
      <div className="flex flex-row space-x-2 transition-opacity duration-300 ease-in-out">
        <Link href={'/games'}>
          <Button className="menu-button rounded-full bg-neutral-800 hover:bg-neutral-875 w-20 h-7">
            Games
          </Button>
        </Link>
        <Link href={'/reviews'}>
          <Button className="menu-button rounded-full bg-neutral-800 hover:bg-neutral-875 w-20 h-7">
            Reviews
          </Button>
        </Link>
        <Link href={"/"}>
        <Button className="menu-button rounded-full w-7 h-7 bg-violet-800 hover:bg-orange-500">
            <p><BsStars className='text-white' /></p>
        </Button>
        </Link>
      </div>
    )}
    </>
  )
}

export default ButtonNav