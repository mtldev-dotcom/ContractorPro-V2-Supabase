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
import { useEffect, useState } from "react"
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

type Company = {
  id: string
  name: string
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Fetch user's name from users table
        const { data: userData } = await supabase
          .from('users')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single()
        
        if (userData) {
          setUserName(`${userData.first_name} ${userData.last_name}`)
        }

        // Fetch user's companies
        const { data, error } = await supabase
          .from('user_companies')
          .select('company:companies(id, name)')
          .eq('user_id', user.id)

        if (!error && data) {
          const companies = data.map(item => ({
            id: (item.company as any).id,
            name: (item.company as any).name
          }))
          setCompanies(companies)
        }
      }
    }

    fetchUserData()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex flex-col gap-2 px-4 py-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">{userName || "Welcome"}</span>
          </div>
          {companies.length > 0 && (
            <select className="w-full rounded-md text-sm border border-input bg-background px-3 py-1">
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          )}
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
