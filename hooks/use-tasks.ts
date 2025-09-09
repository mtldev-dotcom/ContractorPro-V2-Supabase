"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Task, TaskStatus } from "@/lib/tasks"

export interface UseTasksOptions {
  search?: string
  status?: TaskStatus | "all"
  assigneeId?: string | null
  projectId?: string | null
  page?: number
  pageSize?: number
  sortBy?: string
  sortDir?: "asc" | "desc"
}

export interface UseTasksResult {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  total: number
  page: number
  pageSize: number
  setSearch: (q: string) => void
  setStatus: (s: UseTasksOptions["status"]) => void
  setAssignee: (id: string | null) => void
  setProject: (id: string | null) => void
  setPage: (p: number) => void
  setSort: (sortBy: string, sortDir?: "asc" | "desc") => void
  refresh: (showLoader?: boolean) => Promise<void>
}

// Debounce helper (copied pattern from use-projects)
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])
  return debounced
}

export function useTasks(initial?: UseTasksOptions): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)

  const [search, setSearch] = useState(initial?.search ?? "")
  const [status, setStatus] = useState<UseTasksOptions["status"]>(initial?.status ?? "all")
  const [assigneeId, setAssigneeId] = useState<string | null>(initial?.assigneeId ?? null)
  const [projectId, setProjectId] = useState<string | null>(initial?.projectId ?? null)
  const [page, setPage] = useState<number>(initial?.page ?? 1)
  const [pageSize] = useState<number>(initial?.pageSize ?? 12)
  const [sortBy, setSortBy] = useState<string>(initial?.sortBy ?? "created_at")
  const [sortDir, setSortDir] = useState<"asc" | "desc">(initial?.sortDir ?? "desc")

  const debouncedSearch = useDebouncedValue(search, 300)

  const refresh = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setIsLoading(true)
      setError(null)
      const supabase = createClient()

      // Ensure user is authenticated (follow project pattern)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error("Authentication required to view tasks")
      }

      // Build base query for tasks only (we'll do manual joins)
      let query = supabase
        .from("tasks")
        .select("*", { count: "exact" })

      // Filters
      if (status && status !== "all") {
        query = query.eq("status", status)
      }
      if (assigneeId) {
        query = query.eq("assigned_to", assigneeId)
      }
      if (projectId) {
        query = query.eq("project_id", projectId)
      }

      // Search across task name and description
      if (debouncedSearch) {
        // escape minimal characters is skipped here; calling code should ensure safe input
        query = query.or(`name.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`)
      }

      // Sorting
      // Accept only certain columns to avoid SQL injection risk; fallback to created_at
      const allowedSorts = new Set(["created_at", "due_date", "priority", "status", "name"])
      const orderColumn = allowedSorts.has(sortBy) ? sortBy : "created_at"
      query = query.order(orderColumn, { ascending: sortDir === "asc" })

      // Pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      const rows = (data || []) as any[]

      // Manual joins: get projects, employees, and users
      const projectIds = [...new Set(rows.map(r => r.project_id).filter(Boolean))]
      const employeeIds = [...new Set(rows.map(r => r.assigned_to).filter(Boolean))]

      const [projectsRes, employeesRes] = await Promise.all([
        projectIds.length > 0 
          ? supabase.from("projects_new").select("id,name,project_number").in("id", projectIds)
          : Promise.resolve({ data: [], error: null }),
        employeeIds.length > 0
          ? supabase.from("employees").select("id,user_id,users(id,first_name,last_name)").in("id", employeeIds)
          : Promise.resolve({ data: [], error: null })
      ])

      if (projectsRes.error) throw projectsRes.error
      if (employeesRes.error) throw employeesRes.error

      // Create lookup maps
      const projectMap = new Map()
      ;(projectsRes.data || []).forEach((p: any) => {
        projectMap.set(p.id, p)
      })

      const employeeMap = new Map()
      ;(employeesRes.data || []).forEach((e: any) => {
        employeeMap.set(e.id, e)
      })

      // Map DB row shape to Task interface used by UI with manual joins
      const mapped: Task[] = rows.map((r) => {
        const project = r.project_id ? projectMap.get(r.project_id) : null
        const employee = r.assigned_to ? employeeMap.get(r.assigned_to) : null

        return {
          id: r.id,
          title: r.name ?? "",
          description: r.description ?? null,
          project_id: r.project_id ?? null,
          assignee_id: r.assigned_to ?? null,
          priority: (r.priority as any) ?? "medium",
          status: (r.status as any) ?? "not_started",
          due_date: r.due_date ?? null,
          completed: (typeof r.completion_percentage === "number" ? r.completion_percentage >= 100 : !!r.completion_date),
          estimated_hours: typeof r.estimated_hours === "number" ? r.estimated_hours : null,
          created_at: r.created_at ?? undefined,
          updated_at: r.updated_at ?? undefined,
          project: project ?? undefined,
          assignee: employee ? {
            id: employee.id,
            user_id: employee.user_id,
            users: employee.users
          } : undefined,
        }
      })

      setTasks(mapped)
      setTotal(count ?? mapped.length)
    } catch (err: any) {
      setError(err?.message ?? "Failed to load tasks")
    } finally {
      if (showLoader) setIsLoading(false)
    }
  }, [debouncedSearch, page, pageSize, status, assigneeId, projectId, sortBy, sortDir])

  // Initial load
  useEffect(() => {
    refresh(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-fetch on dependencies change
  useEffect(() => {
    refresh(false)
  }, [refresh])

  return useMemo(
    () => ({
      tasks,
      isLoading,
      error,
      total,
      page,
      pageSize,
      setSearch,
      setStatus,
      setAssignee: setAssigneeId,
      setProject: setProjectId,
      setPage,
      setSort: (s: string, dir: "asc" | "desc" = "desc") => {
        setSortBy(s)
        setSortDir(dir)
      },
      refresh,
    }),
    [tasks, isLoading, error, total, page, pageSize, refresh],
  )
}
