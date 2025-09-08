"use client"

import { useState } from "react"
import { Bell, Search, Plus, TrendingUp, TrendingDown, DollarSign, Building2, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTranslations } from 'next-intl'

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const t = useTranslations('auth')

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <h1>{t('notSignedIn')}</h1>
    </div>
  )
}
