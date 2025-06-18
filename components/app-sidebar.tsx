"use client"

import {
  Building2,
  Calculator,
  CheckSquare,
  DollarSign,
  Home,
  Settings,
  Users,
  FileText,
  Wrench,
  Package,
  Clock,
  FolderOpen,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Dashboard", url: "/dashboard/", icon: Home },
  { title: "Projects", url: "/dashboard/projects", icon: Building2 },
  { title: "Clients", url: "/dashboard/clients", icon: Users },
  { title: "Invoices", url: "/dashboard/invoices", icon: FileText },
  { title: "Finances", url: "/dashboard/finances", icon: DollarSign },
  { title: "Employees", url: "/dashboard/employees", icon: Users },
  { title: "Time Tracking", url: "/dashboard/time-tracking", icon: Clock },
  { title: "Tasks", url: "/dashboard/tasks", icon: CheckSquare },
  { title: "Equipment", url: "/dashboard/equipment", icon: Wrench },
  { title: "Materials", url: "/dashboard/materials", icon: Package },
  { title: "Documents", url: "/dashboard/documents", icon: FolderOpen },
  { title: "Reports", url: "/dashboard/reports", icon: Calculator },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">ContractorPro</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
