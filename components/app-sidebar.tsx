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
  Globe,
} from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'

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

const getMenuItems = (t: any) => [
  { title: t("dashboard"), url: "/dashboard", icon: Home, key: "dashboard" },
  { title: t("projects"), url: "/dashboard/projects", icon: Building2, key: "projects" },
  { title: t("clients"), url: "/dashboard/clients", icon: Users, key: "clients" },
  { title: t("invoices"), url: "/dashboard/invoices", icon: FileText, key: "invoices" },
  { title: t("finances"), url: "/dashboard/finances", icon: DollarSign, key: "finances" },
  { title: t("employees"), url: "/dashboard/employees", icon: Users, key: "employees" },
  { title: t("timeTracking"), url: "/dashboard/time-tracking", icon: Clock, key: "timeTracking" },
  { title: t("tasks"), url: "/dashboard/tasks", icon: CheckSquare, key: "tasks" },
  { title: t("equipment"), url: "/dashboard/equipment", icon: Wrench, key: "equipment" },
  { title: t("materials"), url: "/dashboard/materials", icon: Package, key: "materials" },
  { title: t("documents"), url: "/dashboard/documents", icon: FolderOpen, key: "documents" },
  { title: t("reports"), url: "/dashboard/reports", icon: Calculator, key: "reports" },
  { title: t("settings"), url: "/dashboard/settings", icon: Settings, key: "settings" },
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
  const t = useTranslations("sidebar")
  const locale = useLocale()
  const menuItems = getMenuItems(t)

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
            <span className="font-bold text-lg">{userName || t("welcome")}</span>
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
          <SidebarGroupLabel>{t("navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
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
          {/* Language Switcher */}
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1">
                <Link 
                  href={pathname}
                  locale="en"
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    locale === 'en' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  EN
                </Link>
                <Link 
                  href={pathname}
                  locale="fr"
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    locale === 'fr' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  FR
                </Link>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span>{t("signOut")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
