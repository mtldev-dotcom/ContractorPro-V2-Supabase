"use client"

import { useState } from "react"
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
import { getStatusBadgeVariant, formatStatusLabel, PROJECT_STATUSES, type Project, type ProjectStatus } from '@/lib/projects'
import { useProjects } from '@/hooks/use-projects'
import { useTranslations } from 'next-intl'

export default function Projects() {
  const { toast } = useToast();
  const t = useTranslations("projects");
  // Search, status filter, pagination are managed by useProjects
  const { projects, isLoading, error, total, page, pageSize, setSearch, setStatus, setPage, refresh } = useProjects({
    pageSize: 12,
    status: 'all',
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Bind local search input to shared hook's search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSearch(value)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t("loading")}</h2>
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
          <h2 className="text-2xl font-bold mb-4 text-red-600">{t("errorLoading")}</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            {t("tryAgain")}
          </Button>
        </div>
      </div>
    );
  }


  const getStatusColor = (status: Project['status']) => getStatusBadgeVariant(status)

  const filteredProjects = projects // server-side filter/search handled in hook (kept for compatibility)

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
        title: t('projectArchived'),
        description: t('projectArchivedDesc', { projectName }),
      });

      refresh();
    } catch (err: any) {
      toast({
        title: t('error'),
        description: err.message || t('failedToArchive'),
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
        title: t('projectDeleted'),
        description: t('projectDeletedDesc', { projectName: deleteTarget.name }),
      })

      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      refresh()
    } catch (err: any) {
      toast({
        title: t('deleteFailed'),
        description: err.message || t('deleteFailedDesc'),
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
          <h1 className="text-2xl font-bold">{t("title")}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <select
              className="border rounded px-2 py-1 text-sm bg-background"
              value={statusFilter}
              onChange={(e) => { const v = e.target.value as ProjectStatus | 'all'; setStatusFilter(v); setStatus(v); setPage(1); }}
            >
              <option value="all">{t("allStatuses")}</option>
              {PROJECT_STATUSES.map(s => (
                <option key={s} value={s}>{formatStatusLabel(s)}</option>
              ))}
            </select>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("newProject")}
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4">
        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">8</div>
              <p className="text-sm text-muted-foreground">{t("activeProjects")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">$233K</div>
              <p className="text-sm text-muted-foreground">{t("totalBudget")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">$107K</div>
              <p className="text-sm text-muted-foreground">{t("totalSpent")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">54%</div>
              <p className="text-sm text-muted-foreground">{t("avgProgress")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">{t("noProjectsFound")}</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? t("noMatchingProjects") : t("noProjectsCreated")}
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("createFirstProject")}
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
                          : t("noClientAssigned")}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{t("viewDetails")}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(project.id)}>{t("editProject")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("addPayment")}</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleArchiveClick(project.id, project.name)}>{t("archive")}</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(project.id, project.name)}>{t("delete")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Badge variant={getStatusColor(project.status)} className="w-fit capitalize">
                    {formatStatusLabel(project.status)}
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
                      {t("due")}: {project.estimated_end_date ? new Date(project.estimated_end_date).toLocaleDateString() : t("notSet")}
                    </div>
                  </div>

                  {project.project_manager && project.project_manager.users && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        {t("projectManager")}: {project.project_manager.users.first_name} {project.project_manager.users.last_name}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t("budget")}</span>
                      <span className="font-medium">${(project.budget || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t("contractAmount")}</span>
                      <span className="font-medium">${(project.contract_amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium border-t pt-2">
                      <span>{t("difference")}</span>
                      <span className={project.contract_amount >= project.budget ? "text-green-600" : "text-red-600"}>
                        ${(project.contract_amount - project.budget).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      {t("viewDetails")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditClick(project.id)}
                    >
                      {t("edit")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddProjectModal open={showAddModal} onOpenChange={setShowAddModal} onSuccess={() => refresh()} />
      <EditProjectModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        projectId={selectedProjectId!}
        onSuccess={() => refresh()}
      />

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex items-center justify-center gap-4 py-6">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>{t("prev")}</Button>
          <span className="text-sm">{t("page")} {page} {t("of")} {Math.ceil(total / pageSize)}</span>
          <Button variant="outline" disabled={page >= Math.ceil(total / pageSize)} onClick={() => setPage(page + 1)}>{t("next")}</Button>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteProjectPermanently")}</DialogTitle>
            <DialogDescription>
              {t("deleteProjectWarning", { projectName: deleteTarget?.name || '' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProject} disabled={isDeleting}>
              {isDeleting ? t("deleting") : t("deletePermanently")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
