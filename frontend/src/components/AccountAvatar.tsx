import React from 'react'
import {Popover,PopoverContent,PopoverTrigger} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '../components/ui/button';
import { RiAccountCircleLine } from "react-icons/ri";
import { MdOutlinePayments } from "react-icons/md";
import { PiGearSixBold } from "react-icons/pi";
import { MdOutlineExitToApp } from "react-icons/md";
import { RiExternalLinkLine } from "react-icons/ri";


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
            <Button className="menu-button rounded-full w-7 h-7 bg-violet-900">
                <Avatar>
                  {imageLink ? (
                    <AvatarImage src={imageLink} />
                  ) : (
                    <AvatarImage src="/defaultprofile2.png" />
                  )}
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 translate-y-3 dark bg-neutral-800 -translate-x-4">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className='gap-2'>
                <RiAccountCircleLine className='text-lg'/>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className='gap-2'>
                <MdOutlinePayments className='text-lg'/>
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className='gap-2'>
                <PiGearSixBold className='text-lg'/>
                Settings
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
