"use client"

import React, { useState } from "react"
import { Search, Plus, Filter, MoreHorizontal, MapPin, Calendar, User, Grid3X3, List, SortAsc, SortDesc, TrendingUp, AlertTriangle, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import { AddProjectModal } from "@/components/add-project-modal"
import { EditProjectModal } from '@/components/edit-project-modal';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getStatusBadgeVariant, formatStatusLabel, PROJECT_STATUSES, type Project, type ProjectStatus } from '@/lib/projects'
import { useProjects } from '@/hooks/use-projects'
import { useProjectStats } from '@/hooks/use-project-stats'
import { useTranslations } from 'next-intl'

type SortOption = 'name' | 'created_at' | 'estimated_end_date' | 'budget' | 'status'
type ViewMode = 'grid' | 'list'

export default function Projects() {
  const { toast } = useToast();
  const t = useTranslations("projects");
  
  // Project stats hook
  const { stats, isLoading: statsLoading } = useProjectStats()
  
  // Search, status filter, pagination are managed by useProjects
  const { projects, isLoading, error, total, page, pageSize, setSearch, setStatus, setPage, refresh } = useProjects({
    pageSize: 12,
    status: 'all',
  })
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Bind local search input to shared hook's search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSearch(value)
  }

  // Handle sorting
  const handleSort = (field: SortOption) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDirection('desc')
    }
  }

  // Sort projects
  const sortedProjects = [...projects].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Project]
    let bValue: any = b[sortBy as keyof Project]
    
    if (sortBy === 'name') {
      aValue = a.name?.toLowerCase() || ''
      bValue = b.name?.toLowerCase() || ''
    } else if (sortBy === 'budget') {
      aValue = a.budget || 0
      bValue = b.budget || 0
    } else if (sortBy === 'created_at' || sortBy === 'estimated_end_date') {
      aValue = aValue ? new Date(aValue).getTime() : 0
      bValue = bValue ? new Date(bValue).getTime() : 0
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <div className="flex-1 p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 flex-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">{t("title")}</h1>
          </div>
        </header>
        <div className="flex-1 p-4">
          <Alert variant="destructive" className="max-w-md mx-auto mt-8">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{t("errorLoading")}</p>
                <p className="text-sm">{error}</p>
                <Button
                  onClick={() => refresh()}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  {t("tryAgain")}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }


  const getStatusColor = (status: Project['status']) => getStatusBadgeVariant(status)

  const filteredProjects = sortedProjects // Use sorted projects

  const handleEditClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowEditModal(true);
  };

  const handleArchiveClick = async (projectId: string, projectName: string) => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : ''
      const res = await fetch(`${base}/api/projects/archive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data?.error || 'Failed to archive project')
      }

      toast({
        title: t('projectArchived'),
        description: t('projectArchivedDesc', { projectName }),
      })

      refresh()
    } catch (err: any) {
      toast({
        title: t('error'),
        description: err.message || t('failedToArchive'),
        variant: 'destructive',
      })
    }
  }

  // Open the delete confirmation dialog for the selected project
  const handleDeleteClick = (projectId: string, projectName: string) => {
    setDeleteTarget({ id: projectId, name: projectName })
    setDeleteDialogOpen(true)
  }

  // Permanently delete a project and its dependent data
  const confirmDeleteProject = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true)
      const base = typeof window !== 'undefined' ? window.location.origin : ''
      const res = await fetch(`${base}/api/projects/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: deleteTarget.id }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data?.error || 'Failed to delete project')
      }

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
      {/* Enhanced Header */}
      <header className="flex flex-col gap-4 p-6 border-b bg-gradient-to-r from-background via-background to-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t("title")}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {t("subtitle", { count: total })}
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddModal(true)} size="lg" className="shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            {t("newProject")}
          </Button>
        </div>
        
        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select
              value={statusFilter}
              onValueChange={(value: ProjectStatus | 'all') => { 
                setStatusFilter(value); 
                setStatus(value); 
                setPage(1); 
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t("allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                {PROJECT_STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{formatStatusLabel(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                {t("sort")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleSort('name')}>
                <span className="flex-1">{t("sortByName")}</span>
                {sortBy === 'name' && (sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('created_at')}>
                <span className="flex-1">{t("sortByDate")}</span>
                {sortBy === 'created_at' && (sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('estimated_end_date')}>
                <span className="flex-1">{t("sortByDueDate")}</span>
                {sortBy === 'estimated_end_date' && (sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('budget')}>
                <span className="flex-1">{t("sortByBudget")}</span>
                {sortBy === 'budget' && (sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('status')}>
                <span className="flex-1">{t("sortByStatus")}</span>
                {sortBy === 'status' && (sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex rounded-lg border">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4">
        {/* Enhanced Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {statsLoading ? <Skeleton className="h-8 w-8" /> : stats.activeProjects}
                  </div>
                  <p className="text-sm text-muted-foreground">{t("activeProjects")}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-blue-600">
                <span>{t("total")}: {statsLoading ? "..." : stats.totalProjects}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : `$${Math.round(stats.totalBudget / 1000)}K`}
                  </div>
                  <p className="text-sm text-muted-foreground">{t("totalBudget")}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
                <span>{t("spent")}: {statsLoading ? "..." : `$${Math.round(stats.totalSpent / 1000)}K`}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {statsLoading ? <Skeleton className="h-8 w-8" /> : stats.overdueProjects}
                  </div>
                  <p className="text-sm text-muted-foreground">{t("overdueProjects")}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-orange-600">
                <span>{t("needAttention")}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {statsLoading ? <Skeleton className="h-8 w-12" /> : `${stats.avgProgress}%`}
                  </div>
                  <p className="text-sm text-muted-foreground">{t("avgProgress")}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={statsLoading ? 0 : stats.avgProgress} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Display */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("noProjectsFound")}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery ? t("noMatchingProjects") : t("noProjectsCreated")}
            </p>
            <Button onClick={() => setShowAddModal(true)} size="lg" className="shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              {t("createFirstProject")}
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
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
                        {/* <DropdownMenuItem className="text-red-600" onClick={() => handleArchiveClick(project.id, project.name)}>{t("archive")}</DropdownMenuItem> */}
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(project.id, project.name)}>{t("delete")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Badge variant={getStatusColor(project.status)} className="w-fit capitalize">
                    {t("status")}: {formatStatusLabel(project.status)}
                  </Badge>
                  {project.priority && (
                    <Badge variant="outline" className="w-fit capitalize ml-2">
                      {t("priority")}: {project.priority}
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
        ) : (
          // List View
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg truncate">{project.name}</h3>
                          <Badge variant={getStatusColor(project.status)} className="capitalize">
                            {formatStatusLabel(project.status)}
                          </Badge>
                          {project.priority && (
                            <Badge variant="outline" className="capitalize">
                              {project.priority}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {project.client && project.client.first_name && project.client.last_name ?
                              `${project.client.first_name} ${project.client.last_name}`
                              : t("noClientAssigned")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {project.estimated_end_date ? new Date(project.estimated_end_date).toLocaleDateString() : t("notSet")}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${(project.budget || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(project.id)}
                      >
                        {t("edit")}
                      </Button>
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleDeleteClick(project.id, project.name)}
                          >
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
        <div className="flex justify-center py-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* Show page numbers */}
              {Array.from({ length: Math.min(5, Math.ceil(total / pageSize)) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(page - 2 + i, Math.ceil(total / pageSize) - 4 + i));
                if (pageNum > Math.ceil(total / pageSize)) return null;
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={pageNum === page}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(page + 1)}
                  className={page >= Math.ceil(total / pageSize) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
