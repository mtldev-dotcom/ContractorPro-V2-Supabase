"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Filter, MoreHorizontal, MapPin, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddProjectModal } from "@/components/add-project-modal"
import { createClient } from '@/utils/supabase/client';

// Define the Project type
interface Project {
  id: string; // UUID in database
  project_number: string;
  name: string;
  description: string;
  project_type: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date: string;
  estimated_end_date: string;
  actual_end_date: string | null;
  budget: number;
  contract_amount: number;
  site_address_line1: string;
  site_address_line2: string;
  site_city: string;
  site_state: string;
  site_zip_code: string;
  client_id: string;
  project_manager_id: string;
  notes: string;
  // Join with clients table
  client?: {
    first_name: string;
    last_name: string;
    company_name: string;
  };
  // Join with employees and users tables for project manager
  project_manager?: {
    id: string;
    user_id: string;
    users: {
      first_name: string;
      last_name: string;
    };
  };
}
export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true)
        const supabase = createClient();
        const { data, error } = await supabase
          .from("projects_new")
          .select(`
            *,
            client:clients(first_name, last_name, company_name),
            project_manager:employees(
              id,
              user_id,
              users (
                first_name,
                last_name
              )
            )
          `);
        
        if (error) {
          throw error;
        }
        
        setProjects(data || []);
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Projects...</h2>
          <Progress className="w-64 h-2" />
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    throw new Error(`Failed to load projects: ${error}`);
  }


  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case "in_progress":
        return "default"
      case "completed":
        return "secondary"
      case "planning":
        return "outline"
      case "on_hold":
        return "destructive"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.client && (
        `${project.client.first_name} ${project.client.last_name} ${project.client.company_name || ''}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )) ||
      project.project_number.toLowerCase().includes(searchQuery.toLowerCase()),
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
                      {project.client ? 
                        `${project.client.first_name} ${project.client.last_name}${project.client.company_name ? ` (${project.client.company_name})` : ''}`
                        : 'No Client Assigned'}
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
                <Badge variant={getStatusColor(project.status)} className="w-fit capitalize">
                  {project.status.replace('_', ' ')}
                </Badge>
                {project.priority && (
                  <Badge variant="outline" className="w-fit capitalize ml-2">
                    {project.priority}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {[project.site_address_line1, project.site_address_line2, project.site_city, project.site_state, project.site_zip_code]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Due: {project.estimated_end_date ? new Date(project.estimated_end_date).toLocaleDateString() : 'Not set'}
                  </div>
                </div>

                {project.project_manager && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      Project Manager: {project.project_manager.users.first_name} {project.project_manager.users.last_name}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget</span>
                    <span className="font-medium">${(project.budget || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Contract Amount</span>
                    <span className="font-medium">${(project.contract_amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium border-t pt-2">
                    <span>Difference</span>
                    <span className={project.contract_amount >= project.budget ? "text-green-600" : "text-red-600"}>
                      ${(project.contract_amount - project.budget).toLocaleString()}
                    </span>
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
