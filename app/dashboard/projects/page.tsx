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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddProjectModal } from "@/components/add-project-modal"
import { EditProjectModal } from '@/components/edit-project-modal';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchProjects = async (showLoader: boolean = false) => {
    try {
      if (showLoader) setIsLoading(true)
      setError(null)
      const supabase = createClient();

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error("Authentication required to view projects");
      }

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
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Failed to fetch projects: ${error.message}`);
      }

      const validProjects = (data || []).filter(project => {
        if (!project.name || !project.id) {
          console.warn("Project missing required fields:", project);
          return false;
        }
        return true;
      });

      setProjects(validProjects);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(err.message || "An unknown error occurred");
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects(true);
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
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Projects</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
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
      (project.client && project.client.first_name && project.client.last_name && (
        `${project.client.first_name} ${project.client.last_name} ${project.client.company_name || ''}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )) ||
      project.project_number.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEditClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowEditModal(true);
  };

  const handleArchiveClick = async (projectId: string, projectName: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('projects_new')
        .update({ status: 'cancelled' })
        .eq('id', projectId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Project Archived',
        description: `${projectName} has been archived.`,
      });

      fetchProjects();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to archive project.',
        variant: 'destructive',
      });
    }
  }

  // Open the delete confirmation dialog for the selected project
  const handleDeleteClick = (projectId: string, projectName: string) => {
    setDeleteTarget({ id: projectId, name: projectName })
    setDeleteDialogOpen(true)
  }

  // Permanently delete a project and its dependent data
  const confirmDeleteProject = async () => {
    if (!deleteTarget) return
    try {
      setIsDeleting(true)
      const supabase = createClient()

      // 1) Clear FK references from equipment to avoid constraint errors
      const { error: equipmentError } = await supabase
        .from('equipment')
        .update({ current_project_id: null })
        .eq('current_project_id', deleteTarget.id)

      if (equipmentError) throw equipmentError

      // 2) Delete dependent records that reference the project
      const childTables = ['tasks', 'documents', 'communications', 'change_orders', 'material_usage']
      for (const table of childTables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('project_id', deleteTarget.id)
        if (error) throw error
      }

      // 3) Delete the project itself
      const { error: projectDeleteError } = await supabase
        .from('projects_new')
        .delete()
        .eq('id', deleteTarget.id)

      if (projectDeleteError) throw projectDeleteError

      toast({
        title: 'Project Deleted',
        description: `${deleteTarget.name} has been permanently deleted.`,
      })

      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      fetchProjects()
    } catch (err: any) {
      toast({
        title: 'Delete Failed',
        description: err.message || 'Unable to delete project. Ensure you have permission and try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

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
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No projects match your search criteria.' : 'No projects have been created yet.'}
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg leading-tight">{project.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {project.client && project.client.first_name && project.client.last_name ?
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
                        <DropdownMenuItem onClick={() => handleEditClick(project.id)}>Edit Project</DropdownMenuItem>
                        <DropdownMenuItem>Add Payment</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleArchiveClick(project.id, project.name)}>Archive</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(project.id, project.name)}>Delete</DropdownMenuItem>
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

                  {project.project_manager && project.project_manager.users && (
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditClick(project.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddProjectModal open={showAddModal} onOpenChange={setShowAddModal} onSuccess={() => fetchProjects()} />
      <EditProjectModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        projectId={selectedProjectId!}
        onSuccess={() => fetchProjects()}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project permanently?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The project
              {deleteTarget ? ` "${deleteTarget.name}" ` : ' '}and all of its related data
              (tasks, documents, communications, change orders, and material usage) will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProject} disabled={isDeleting}>
              {isDeleting ? 'Deleting…' : 'Delete Permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
