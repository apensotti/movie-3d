import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarProvider,
    SidebarTrigger,
  } from "@/components/ui/sidebar"
import { IoMenu } from "react-icons/io5"

export function AppSidebar() {
  return (
    <SidebarProvider className="">
        <div className="m-3">
            <SidebarTrigger className="absolute z-50 p-1 flex flex-row items-center"/>
        </div>
      <Sidebar className="bg-neutral-800 border-none shadow-lg">
        <SidebarHeader className="bg-neutral-800 border-neutral-700"/>
        <SidebarContent className="bg-neutral-800 border-neutral-700">
          <SidebarGroup />
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter className="bg-neutral-800"/>
      </Sidebar>
    </SidebarProvider>
  )
}