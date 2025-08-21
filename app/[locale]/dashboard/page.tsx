"use client"

import { useState } from "react"
import { Bell, Search, Plus, TrendingUp, TrendingDown, DollarSign, Building2, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  const t = useTranslations("Dashboard");
  
  const metrics = [
    {
      title: "Monthly Revenue",
      value: "$127,500",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Active Projects",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Building2,
    },
    {
      title: "Team Members",
      value: "24",
      change: "+3",
      trend: "up",
      icon: Users,
    },
    {
      title: "Weekly Payroll",
      value: "$18,750",
      change: "-5.2%",
      trend: "down",
      icon: Calendar,
    },
  ]

  const recentTransactions = [
    {
      id: 1,
      description: "Kitchen Renovation - Progress Payment",
      amount: 15000,
      type: "income",
      project: "Maple Street Kitchen",
    },
    {
      id: 2,
      description: "Lumber Supply - Home Depot",
      amount: -2500,
      type: "expense",
      project: "Oak Avenue Bathroom",
    },
    {
      id: 3,
      description: "Electrical Work - Johnson Electric",
      amount: -3200,
      type: "expense",
      project: "Pine Street Addition",
    },
    {
      id: 4,
      description: "Bathroom Remodel - Final Payment",
      amount: 8500,
      type: "income",
      project: "Oak Avenue Bathroom",
    },
  ]

  const activeProjects = [
    {
      id: 1,
      name: "Maple Street Kitchen",
      client: "Sarah Johnson",
      progress: 75,
      budget: 45000,
      spent: 33750,
      status: "On Track",
    },
    {
      id: 2,
      name: "Oak Avenue Bathroom",
      client: "Mike Chen",
      progress: 90,
      budget: 25000,
      spent: 22500,
      status: "Nearly Complete",
    },
    {
      id: 3,
      name: "Pine Street Addition",
      client: "Lisa Rodriguez",
      progress: 45,
      budget: 85000,
      spent: 38250,
      status: "In Progress",
    },
    {
      id: 4,
      name: "Elm Drive Deck",
      client: "Tom Wilson",
      progress: 20,
      budget: 15000,
      spent: 3000,
      status: "Just Started",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">hhh{t("title")}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects, clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>{metric.change}</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>Current project status and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                    <Badge
                      variant={
                        project.status === "On Track"
                          ? "default"
                          : project.status === "Nearly Complete"
                            ? "secondary"
                            : project.status === "In Progress"
                              ? "outline"
                              : "secondary"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress: {project.progress}%</span>
                      <span>
                        ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.project}</p>
                  </div>
                  <div className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Revenue</span>
                <span className="font-medium text-green-600">+$127,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Expenses</span>
                <span className="font-medium text-red-600">-$89,200</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Net Profit</span>
                <span className="font-bold text-green-600">$38,300</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Team Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">On Site</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Available</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Off Today</span>
                <span className="font-medium">2</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Due This Week</span>
                <span className="font-medium">3 Projects</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Inspections</span>
                <span className="font-medium">2 Scheduled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payments Due</span>
                <span className="font-medium">$45,000</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
