import React from 'react'
import {Popover,PopoverContent,PopoverTrigger} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '../../components/ui/button';
import { RiAccountCircleLine } from "react-icons/ri";
import { MdOutlinePayments } from "react-icons/md";
import { PiGearSixBold } from "react-icons/pi";
import { MdOutlineExitToApp } from "react-icons/md";
import { RiExternalLinkLine } from "react-icons/ri";
import { BsStars } from 'react-icons/bs';
import { IoLibrary } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { PiJoystickFill } from "react-icons/pi";
import { PiChartBarHorizontalFill } from "react-icons/pi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { signOut } from "next-auth/react";

interface AccountAvatarProps {
  imageLink: string | undefined | null;
}

export function AccountAvatar({imageLink}: AccountAvatarProps) { 
  const handleSignOut = () => {
    signOut({
      callbackUrl: "/", // The URL to redirect to after logout
    });
  };

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className="menu-button rounded-full w-7 h-7 bg-violet-900 p-0">
                <Avatar>
                  {imageLink ? (
                    <AvatarImage src={imageLink} referrerPolicy="no-referrer" />
                  ) : (
                    <AvatarImage src="/defaultprofile2.png" />
                  )}
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 translate-y-3 dark bg-neutral-800 -translate-x-4">
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator /> */}
            <DropdownMenuGroup className='flex flex-row gap-3 p-2 justify-center'>
              <DropdownMenuItem className='gap-2 bg-none hover:bg-transparent focus:bg-transparent'>
                <Link href={'/'} className='hover:bg-transparent rounded-full'>
                  <Button className="rounded-full bg-violet-900 p-2 w-10 h-10 flex items-center justify-center hover:bg-orange-500">
                      <BsStars className='text-lg text-white'/>
                  </Button>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='gap-2 hover:bg-transparent focus:bg-transparent'>
                <Link href={'/library'} className='rounded-full'>
                  <Button className="rounded-full bg-violet-900 p-2 w-10 h-10 flex items-center justify-center hover:bg-orange-500">
                      <IoLibrary className='text-lg text-white'/>
                  </Button>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='gap-2 hover:bg-transparent focus:bg-transparent'>
                <Link href={'/'} className='rounded-full'>
                  <Button className="rounded-full bg-violet-900 p-2 w-10 h-10 flex items-center justify-center hover:bg-orange-500">
                    <FaStar className='text-lg text-white'/>
                </Button>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup className='flex flex-row gap-3 p-2 justify-center'>
              <DropdownMenuItem className='gap-2 hover:bg-transparent focus:bg-transparent'>
                <Link href={"/games"} className='hover:bg-transparent rounded-full'>
                  <Button className="rounded-full bg-violet-900 p-2 w-10 h-10 flex items-center justify-center hover:bg-orange-500">
                    <PiJoystickFill className='text-xl text-white'/>
                  </Button>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='gap-2 hover:bg-transparent focus:bg-transparent'>
                <Link href={"/chat"} className='hover:bg-transparent rounded-full'>
                  <Button className="rounded-full bg-violet-900 p-2 w-10 h-10 flex items-center justify-center hover:bg-orange-500">
                    <MdReviews className='text-lg text-white'/>
                </Button>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='gap-2 hover:bg-transparent focus:bg-transparent'>
                <Button className="rounded-full bg-violet-900 p-2 w-10 h-10 flex items-center justify-center hover:bg-orange-500">
                  <PiChartBarHorizontalFill className='text-2xl text-white'/>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup className='flex flex-row gap-3 p-2 justify-center'>
              <DropdownMenuItem className='gap-2 hover:bg-transparent focus:bg-transparent'>
                <Button className="rounded-full bg-violet-900 p-2 w-10 h-10 flex items-center justify-center hover:bg-orange-500">
                  <RiAccountCircleLine className='text-2xl text-white'/>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className='gap-2 hover:bg-transparent focus:bg-transparent'>
                <Button className="rounded-full bg-violet-900 p-2 w-10 h-10 flex items-center justify-center hover:bg-orange-500">
                  <MdOutlinePayments className='text-2xl text-white'/>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className='gap-2 hover:bg-transparent focus:bg-transparent'>
                <Button className="rounded-full bg-violet-900 p-2 w-10 h-10 flex items-center justify-center hover:bg-orange-500">
                  <PiGearSixBold className='text-2xl text-white'/>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-1'>Support <RiExternalLinkLine className='text-2xs'/></DropdownMenuItem>
            <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                  <div className='flex items-center gap-2'>
                    <MdOutlineExitToApp className='text-lg rotate-180'/>
                    Log out
                  </div>
              </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
