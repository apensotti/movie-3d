import React from 'react'
import {Popover,PopoverContent,PopoverTrigger} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '../components/ui/button';
import { RiAccountCircleLine } from "react-icons/ri";
import { MdOutlinePayments } from "react-icons/md";
import { PiGearSixBold } from "react-icons/pi";
import { MdOutlineExitToApp } from "react-icons/md";


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

export function AccountAvatar() {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className="menu-button rounded-full w-7 h-7 bg-violet-900">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 translate-y-3 dark bg-neutral-900 -translate-x-4">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className='gap-2'>
                <RiAccountCircleLine className='text-xl'/>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className='gap-2'>
                <MdOutlinePayments className='text-xl'/>
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className='gap-2'>
                <PiGearSixBold className='text-xl'/>
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2'>
                <MdOutlineExitToApp className='text-xl rotate-180'/>
                Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
