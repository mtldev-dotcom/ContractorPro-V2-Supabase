"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/utils/supabase/client"

interface EditTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId: string | null
}

export function EditTaskModal({ open, onOpenChange, taskId }: EditTaskModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignee: "",
    priority: "medium",
    dueDate: "",
    estimatedHours: "",
    status: "not_started",
  })

  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([])
  const [employees, setEmployees] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    if (!open) return

    const supabase = createClient()

    ;(async () => {
      setLoadingData(true)
      try {
        // load projects and employees concurrently
const [pRes, eRes] = await Promise.all([
          supabase.from("projects_new").select("id,name").order("name", { ascending: true }),
          supabase.from("users").select("id,first_name,last_name").order("first_name", { ascending: true }),
        ])

        if (pRes.error) throw pRes.error
        if (eRes.error) throw eRes.error

        const pRows = (pRes.data || []) as any[]
        const eRows = (eRes.data || []) as any[]

        setProjects(pRows.map((r) => ({ id: r.id, name: r.name })))
setEmployees(
          eRes.data.map((r: any) => {
            const name = [r.first_name, r.last_name].filter(Boolean).join(" ").trim() || "Employee"
            return { id: r.id, name }
          })
        )

        // load task details
        if (taskId) {
        const tRes = await supabase
            .from("tasks")
            .select("*, project:projects_new(id,name)")
            .eq("id", taskId)
            .single()

          if (tRes.error) throw tRes.error

          const r = tRes.data as any
          setFormData({
            title: r.name ?? "",
            description: r.description ?? "",
            project: r.project_id ?? "",
            assignee: r.assigned_to ?? "",
            priority: r.priority ?? "medium",
            dueDate: r.due_date ? r.due_date.split("T")[0] : "",
            estimatedHours: r.estimated_hours != null ? String(r.estimated_hours) : "",
            status: r.status ?? "not_started",
          })
        }
      } catch (err: any) {
        toast({
          title: "Failed to load data",
          description: err?.message ?? "Could not load task data",
          variant: "destructive",
        })
      } finally {
        setLoadingData(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, taskId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskId) {
      toast({ title: "Validation", description: "Missing task id", variant: "destructive" })
      return
    }
    if (!formData.title || formData.title.trim() === "") {
      toast({ title: "Validation", description: "Title is required", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const updates: Record<string, any> = {
        name: formData.title,
        description: formData.description || null,
        project_id: formData.project === "none" ? null : formData.project || null,
        assigned_to: formData.assignee === "none" ? null : formData.assignee || null,
        priority: formData.priority || "medium",
        estimated_hours: formData.estimatedHours ? Number(formData.estimatedHours) : null,
        due_date: formData.dueDate || null,
        status: formData.status || "not_started",
      }

      const res = await fetch("/api/tasks/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, updates }),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.error || "Failed to update task")
      }

      toast({
        title: "Task Updated",
        description: `${formData.title} has been updated.`,
      })

      try {
        window.dispatchEvent(new CustomEvent("task:updated", { detail: json.task }))
      } catch {}

      onOpenChange(false)
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.message ?? "Failed to update task",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Edit task details and save changes.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Install kitchen cabinets"
                required
                disabled={loadingData}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the task..."
                rows={3}
                disabled={loadingData}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="project">Project</Label>
                <Select value={formData.project} onValueChange={(value) => setFormData({ ...formData, project: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignee">Assign To</Label>
                <Select value={formData.assignee} onValueChange={(value) => setFormData({ ...formData, assignee: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estimatedHours">Est. Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  placeholder="8"
                  disabled={loadingData}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                disabled={loadingData}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
