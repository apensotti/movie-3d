"use client"

import { useEffect, useState } from 'react'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import { RiAccountCircleLine } from "react-icons/ri";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Session } from "next-auth"

import defaultAvatar from '@/assets/default-avatar.png';
import { MdOutlineExitToApp } from "react-icons/md"

import { signOut } from "next-auth/react"
import Link from "next/link";
import { getProfileImage } from '@/lib/utils';
import { useProfileData } from '@/hooks/useProfileData';

export interface ProfileData {
  username?: string;
  name?: string;
  favoriteMovie?: string;
  bio?: string;
  tagline?: string;
  links?: string;
  image?: string;
  email?: string;
  userId?: string;
}

export function NavUser({ user }: { user: Session | undefined }) {
  const profileData = useProfileData() as ProfileData | null
  const { isMobile } = useSidebar()
  
  const displayName = (profileData?.username || user?.user?.email?.split('@')[0]) ?? ''
  const email = user?.user?.email ?? ''
  const profileImage = profileData?.image || user?.user?.image || '/defaultprofile2.png'

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/", // The URL to redirect to after logout
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={profileImage || '/defaultprofile2.png'} alt={email} />
                <AvatarFallback className="rounded-lg">
                  {displayName[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="truncate text-xs">{profileData?.tagline || email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-neutral-800"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={14}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={profileImage || '/defaultprofile2.png'} alt={displayName} />
                  <AvatarFallback className="rounded-lg">
                    {displayName[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-xs">{profileData?.tagline || email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              <Link href="/profile">
              <DropdownMenuItem>
                <div className='flex items-center gap-2'>
                  <RiAccountCircleLine className='text-lg'/>
                  Account
              </div>
              </DropdownMenuItem>
              </Link>
              {/* <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <div className='flex items-center gap-2'>
                <MdOutlineExitToApp className='text-lg rotate-180'/>
                Log out
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

