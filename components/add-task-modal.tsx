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

interface AddTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * AddTaskModal
 *
 * - Loads projects and employees from Supabase (browser client)
 * - Submits to app/api/tasks/create
 * - Shows toast on success/error
 *
 * Notes:
 * - This component deliberately keeps the API surface small to avoid
 *   changing existing callers. It emits a CustomEvent 'task:created'
 *   on successful creation so pages/hooks can listen and refresh if needed.
 */
export function AddTaskModal({ open, onOpenChange }: AddTaskModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignee: "",
    priority: "medium",
    dueDate: "",
    estimatedHours: "",
  })

  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([])
  const [employees, setEmployees] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    if (!open) return

    const supabase = createClient()

    // load projects and employees concurrently
    ;(async () => {
      try {
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
      } catch (err: any) {
        toast({
          title: "Failed to load data",
          description: err?.message ?? "Could not load projects or employees",
          variant: "destructive",
        })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const resetForm = () =>
    setFormData({
      title: "",
      description: "",
      project: "",
      assignee: "",
      priority: "medium",
      dueDate: "",
      estimatedHours: "",
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || formData.title.trim() === "") {
      toast({ title: "Validation", description: "Title is required", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: formData.title,
        description: formData.description || null,
        project_id: formData.project === "none" ? null : formData.project || null,
        assigned_to: formData.assignee === "none" ? null : formData.assignee || null,
        priority: formData.priority || "medium",
        estimated_hours: formData.estimatedHours ? Number(formData.estimatedHours) : null,
        due_date: formData.dueDate || null,
      }

      const res = await fetch("/api/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.error || "Failed to create task")
      }

      toast({
        title: "Task Created",
        description: `${formData.title} has been created.`,
      })

      // emit a lightweight event so other parts of the app can refresh
      try {
        window.dispatchEvent(new CustomEvent("task:created", { detail: json.task }))
      } catch {}

      resetForm()
      onOpenChange(false)
    } catch (err: any) {
      toast({
        title: "Create failed",
        description: err?.message ?? "Failed to create task",
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
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>Create a new task and assign it to a team member.</DialogDescription>
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
                    <SelectItem value="none">{/* empty to allow clearing */}None</SelectItem>
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
                    <SelectItem value="none">{/* empty to allow clearing */}Unassigned</SelectItem>
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
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
