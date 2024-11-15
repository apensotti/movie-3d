"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { IconType } from "react-icons/lib";
import { useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

type NavItem = {
  title: string
  url: string
  icon?: LucideIcon | IconType
  iconColor?: string
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const [hoveredItems, setHoveredItems] = useState<{ [key: string]: boolean }>({});

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <Link href={item.url}>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  onMouseEnter={() => setHoveredItems(prev => ({ ...prev, [item.title]: true }))}
                  onMouseLeave={() => setHoveredItems(prev => ({ ...prev, [item.title]: false }))}
                >
                  {item.icon && (
                    hoveredItems[item.title] && item.iconColor ? (
                      <img src={item.iconColor} alt={item.title} className="w-4 h-4" />
                    ) : (
                      <item.icon />
                    )
                  )}
                  <span>{item.title}</span>
                </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
