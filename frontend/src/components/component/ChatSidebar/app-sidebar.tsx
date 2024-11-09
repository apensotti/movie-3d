"use client"

import React, { useEffect, useState } from "react"
import { PiGraphLight } from "react-icons/pi";
import { BsStars } from 'react-icons/bs';
import { IoLibrary } from "react-icons/io5";
import { MdReviews } from "react-icons/md";
import { PiJoystickFill } from "react-icons/pi";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import { MdSettings } from "react-icons/md";

import { NavMain } from "@/components/component/ChatSidebar/nav-main"
import { NavProjects } from "@/components/component/ChatSidebar/nav-projects"
import { NavUser } from "@/components/component/ChatSidebar/nav-user"
import { TeamSwitcher } from "@/components/component/ChatSidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Session } from "next-auth";
import HomeButton from "../HomeButton";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Chat",
      url: "/chat",
      icon: BsStars,
      iconColor: "/icons/Stars.svg",
      isActive: true
    },
    {
      title: "Library",
      url: "/library",
      icon: IoLibrary,
      iconColor: "/icons/Library.svg",
      isActive: true
    },
    {
      title: "Nodes",
      url: "/",
      icon: PiGraphLight,
      iconColor: "/icons/Nodes.svg",
    },
    {
      title: "Games",
      url: "#",
      icon: PiJoystickFill,
      iconColor: "/icons/Games.svg",
    },
    {
      title: "Reviews",
      url: "#",
      icon: MdReviews,
      iconColor: "/icons/Reviews.svg",
    },
    {
      title: "Polls",
      url: "#",
      icon: PiChartBarHorizontalFill,
      iconColor: "/icons/Polls.svg",
    },
    {
      title: "Settings",
      url: "#",
      icon: MdSettings,
      iconColor: "/icons/Settings.svg",
    },
  ]
}

export function AppSidebar({ sessions, user_session, ...props }: React.ComponentProps<typeof Sidebar> & { sessions: string[], user_session: Session | undefined }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-state');
    setIsOpen(savedState === 'true');
  }, []);
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    localStorage.setItem('sidebar-state', open.toString());
  };

  return (
    <SidebarProvider defaultOpen={isOpen} open={isOpen} onOpenChange={handleOpenChange}>
      <Sidebar collapsible="icon" {...props} className="">
        <SidebarHeader className="mb-2">
          {isOpen && <HomeButton h={10} />}
          <SidebarTrigger size="icon" className="absolute top-2 right-2 z-50" />
        </SidebarHeader>      
        <SidebarContent className="no-scrollbar">
          <NavMain items={data.navMain} />
          <NavProjects sessions={sessions}/>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user_session || undefined} />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
