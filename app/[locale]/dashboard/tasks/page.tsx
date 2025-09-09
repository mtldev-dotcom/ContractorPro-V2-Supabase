"use client"

import { useEffect, useState } from "react"
import { Search, Plus, Filter, Calendar, User, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Checkbox } from "@/components/ui/checkbox"
import { AddTaskModal } from "@/components/add-task-modal"
import { EditTaskModal } from "@/components/edit-task-modal"
import { useTasks } from "@/hooks/use-tasks"
import { TASK_STATUSES, formatStatusLabel, getPriorityBadgeVariant, getStatusBadgeVariant, formatAssigneeName, type TaskStatus } from "@/lib/tasks"
import { useTranslations } from "next-intl"
import { useToast } from "@/hooks/use-toast"

export default function Tasks() {
  const t = useTranslations("tasks")
  const { toast } = useToast()

  // Hook-driven data (search/status/pagination handled inside)
  const { tasks, isLoading, error, total, page, pageSize, setSearch, setStatus, setPage, refresh } = useTasks({
    pageSize: 12,
    status: "all",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
  const [isDeleting, setIsDeleting] = useState(false)

  // Bind local search input to shared hook's search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSearch(value)
  }

  // Listen for create / update events emitted by modals and refresh the list
  useEffect(() => {
    const onCreated = () => refresh()
    const onUpdated = () => refresh()
    window.addEventListener("task:created", onCreated as EventListener)
    window.addEventListener("task:updated", onUpdated as EventListener)
    return () => {
      window.removeEventListener("task:created", onCreated as EventListener)
      window.removeEventListener("task:updated", onUpdated as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Derived counts (client-side)
  const completedTasks = tasks.filter((t) => t.completed).length
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length
  const overdueTasks = tasks.filter((t) => t.due_date && new Date(t.due_date) < new Date() && !t.completed).length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle2
      case "in_progress":
        return Clock
      case "pending":
      case "not_started":
        return AlertCircle
      case "scheduled":
        return Calendar
      default:
        return Clock
    }
  }

  const handleEditClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setShowEditModal(true)
  }

  const handleDeleteClick = (taskId: string, taskTitle: string) => {
    // simple confirmation
    if (!confirm(t("confirmDelete", { title: taskTitle }))) return
    deleteTask(taskId, taskTitle)
  }

  const deleteTask = async (taskId: string, taskTitle: string) => {
    try {
      setIsDeleting(true)
      const base = typeof window !== "undefined" ? window.location.origin : ""
      const res = await fetch(`${base}/api/tasks/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data?.error || "Failed to delete task")
      }
      toast({
        title: t("taskDeleted"),
        description: t("taskDeletedDesc", { title: taskTitle }),
      })
      refresh()
    } catch (err: any) {
      toast({
        title: t("error"),
        description: err.message || t("failedToDelete"),
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">{t("title")}</h1>
          </div>
        </header>
        <div className="flex-1 p-4">
          <div className="space-y-4">
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="h-24 bg-muted rounded animate-pulse" />
              <div className="h-24 bg-muted rounded animate-pulse" />
              <div className="h-24 bg-muted rounded animate-pulse" />
              <div className="h-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
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
          <div className="max-w-md mx-auto mt-8">
            <p className="font-medium text-destructive">{t("errorLoading")}</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="mt-4">
              <Button onClick={() => refresh()} variant="outline" size="sm">
                {t("tryAgain")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
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

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => {
                const v = (e.target.value as TaskStatus | "all") || "all"
                setStatusFilter(v)
                setStatus(v)
                setPage(1)
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">{t("allStatuses")}</option>
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {formatStatusLabel(s)}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("newTask")}
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{total}</div>
              <p className="text-sm text-muted-foreground">{t("totalTasks")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{inProgressTasks}</div>
              <p className="text-sm text-muted-foreground">{t("inProgress")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-sm text-muted-foreground">{t("completed")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
              <p className="text-sm text-muted-foreground">{t("overdue")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle>{t("allTasks")}</CardTitle>
            <CardDescription>{t("manageAndTrack")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => {
                const StatusIcon = getStatusIcon(task.status)
                const isOverdue = task.due_date ? new Date(task.due_date) < new Date() && !task.completed : false

                return (
                  <div
                    key={task.id}
                    className={`p-4 border rounded-lg hover:shadow-sm transition-shadow ${task.completed ? "bg-muted/50" : ""
                      } ${isOverdue ? "border-red-200 bg-red-50/50" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox checked={task.completed} className="mt-1" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge>
                            <Badge variant={getStatusBadgeVariant(task.status)} className="flex items-center gap-1 capitalize">
                              <StatusIcon className="h-3 w-3" />
                              {formatStatusLabel(task.status)}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {formatAssigneeName(task.assignee)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : t("notSet")}
                            {isOverdue && <span className="text-red-600 font-medium ml-1">({t("overdue")})</span>}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimated_hours ?? 0}h {t("estimated")}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            {t("project")}: <span className="font-medium">{task.project?.name ?? t("noProject")}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditClick(task.id)}>
                              {t("edit")}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteClick(task.id, task.title)}>
                              {t("delete")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddTaskModal open={showAddModal} onOpenChange={setShowAddModal} />
      <EditTaskModal open={showEditModal} onOpenChange={setShowEditModal} taskId={selectedTaskId} />

      {/* Pagination (simple) */}
      {total > pageSize && (
        <div className="flex justify-center py-6">
          <div className="flex items-center gap-2">
            <Button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
              {t("prev")}
            </Button>
            <div className="px-4">{t("pageX", { page })}</div>
            <Button onClick={() => setPage(page + 1)} disabled={page * pageSize >= total}>
              {t("next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
