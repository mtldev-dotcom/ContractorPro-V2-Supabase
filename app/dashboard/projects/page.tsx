"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Filter, MoreHorizontal, MapPin, Calendar, User } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddProjectModal } from "@/components/add-project-modal"

interface Project {
  id: string
  name: string
  description: string
  project_number: string
  status: string
  priority: string
  start_date: string
  estimated_end_date: string
  budget: number
  contract_amount: number
  site_address_line1: string
  site_address_line2: string
  site_city: string
  site_state: string
  site_zip_code: string
  client: {
    first_name: string
    last_name: string
  }
}

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects_new')
          .select(`
            *,
            client:clients(first_name, last_name)
          `)
        
        if (error) {
          throw error
        }

        if (data) {
          setProjects(data)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [supabase])

  // Calculate stats
  const activeProjects = projects.filter(p => p.status === 'in_progress')
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  const totalSpent = projects.reduce((sum, p) => sum + (p.contract_amount || 0), 0)
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading projects...</div>
  }
    {
      id: 1,
      name: "Maple Street Kitchen Renovation",
      client: "Sarah Johnson",
      address: "123 Maple Street, Springfield",
      status: "In Progress",
      progress: 75,
      budget: 45000,
      spent: 33750,
      startDate: "2024-01-15",
      dueDate: "2024-03-15",
      description: "Complete kitchen renovation including cabinets, countertops, and appliances",
    },
    {
      id: 2,
      name: "Oak Avenue Bathroom Remodel",
      client: "Mike Chen",
      address: "456 Oak Avenue, Springfield",
      status: "Nearly Complete",
      progress: 90,
      budget: 25000,
      spent: 22500,
      startDate: "2024-02-01",
      dueDate: "2024-02-28",
      description: "Master bathroom renovation with walk-in shower and double vanity",
    },
    {
      id: 3,
      name: "Pine Street Home Addition",
      client: "Lisa Rodriguez",
      address: "789 Pine Street, Springfield",
      status: "In Progress",
      progress: 45,
      budget: 85000,
      spent: 38250,
      startDate: "2024-01-01",
      dueDate: "2024-04-30",
      description: "Two-story addition with family room and master suite",
    },
    {
      id: 4,
      name: "Elm Drive Deck Construction",
      client: "Tom Wilson",
      address: "321 Elm Drive, Springfield",
      status: "Just Started",
      progress: 20,
      budget: 15000,
      spent: 3000,
      startDate: "2024-02-15",
      dueDate: "2024-03-30",
      description: "Large composite deck with built-in seating and pergola",
    },
    {
      id: 5,
      name: "Cedar Lane Roof Replacement",
      client: "Jennifer Davis",
      address: "654 Cedar Lane, Springfield",
      status: "Planning",
      progress: 5,
      budget: 35000,
      spent: 1750,
      startDate: "2024-03-01",
      dueDate: "2024-03-20",
      description: "Complete roof replacement with architectural shingles",
    },
    {
      id: 6,
      name: "Birch Street Basement Finish",
      client: "Robert Kim",
      address: "987 Birch Street, Springfield",
      status: "On Hold",
      progress: 30,
      budget: 28000,
      spent: 8400,
      startDate: "2024-01-20",
      dueDate: "2024-04-15",
      description: "Basement finishing with rec room, bathroom, and storage",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "default"
      case "Nearly Complete":
        return "secondary"
      case "Just Started":
        return "outline"
      case "Planning":
        return "secondary"
      case "On Hold":
        return "destructive"
      default:
        return "default"
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Projects</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4">
        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">8</div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">$233K</div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">$107K</div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">54%</div>
              <p className="text-sm text-muted-foreground">Avg Progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg leading-tight">{project.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {project.client}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem>Add Payment</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Badge variant={getStatusColor(project.status)} className="w-fit">
                  {project.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {project.address}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Due: {new Date(project.dueDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget</span>
                    <span className="font-medium">${project.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Spent</span>
                    <span className="font-medium">${project.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium border-t pt-2">
                    <span>Remaining</span>
                    <span className="text-green-600">${(project.budget - project.spent).toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AddProjectModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  )
}
