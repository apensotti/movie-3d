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

export function NavProjects({
  projects,
  sessions,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
  sessions: any[]
}) {
  const { isMobile } = useSidebar()

  return (
        // Start of Selection
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="whitespace-nowrap">
            <RiHistoryLine className="mr-2" />
            Chat History
          </SidebarGroupLabel>
          <SidebarMenu>
            {sessions.map((session) => (
              <SidebarMenuItem key={session.session_id}>
                <SidebarMenuButton asChild>
                  <a href={`/chat/${session.session_id}`}>
                    <div className="bg-neutral-800 w-full p-2 rounded-lg hover:bg-neutral-850">
                      <span className="font-extralight">{session.messages[0].content}...</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70 whitespace-nowrap">
                <span>View All</span>
                <ChevronRight className="ml-auto" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
  )
}
