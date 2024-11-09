"use client"

import {
  ChevronRight,
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { RiHistoryLine } from "react-icons/ri";
import React, { useState } from "react";
import router from "next/router";
import Link from "next/link";

export function NavProjects({
  sessions,
}: {
  sessions: any[]
}) {
  const { isMobile } = useSidebar()
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleViewAll = () => {
    setIsExpanded(!isExpanded);
  };

  const displayedSessions = isExpanded ? [...sessions].reverse() : [...sessions].reverse().slice(0, 5);

  return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="whitespace-nowrap flex justify-between gap-16">
            <div className="flex items-center gap-1">
              <RiHistoryLine/>
              Chat History
            </div>
            <Link href="/chat">
              <SidebarMenuButton className="flex justify-end hover:bg-neutral-850 rounded-full">
                <span className="text-3xs">+ New Chat</span>
              </SidebarMenuButton>
            </Link>
          </SidebarGroupLabel>
          <SidebarMenu>
            {displayedSessions.map((session) => (
              <SidebarMenuItem key={session.session_id}>
                <SidebarMenuButton asChild>
                  <a href={`/chat/${session.session_id}`}>
                    <div className="bg-neutral-800 w-full p-2 rounded-lg hover:bg-neutral-850">
                      <span className="font-extralight">
                        {session.messages[0].content.substring(0, 24)}...
                      </span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton 
                className="text-sidebar-foreground/70 whitespace-nowrap"
                onClick={toggleViewAll}
              >
                <span>{isExpanded ? "View Less" : "View All"}</span>
                <ChevronRight className={`ml-auto transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
  )
}
