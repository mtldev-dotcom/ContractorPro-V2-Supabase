"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Project, ProjectStatus } from '@/lib/projects'

export interface UseProjectsOptions {
  search?: string
  status?: ProjectStatus | 'all'
  page?: number
  pageSize?: number
}

export interface UseProjectsResult {
  projects: Project[]
  isLoading: boolean
  error: string | null
  total: number
  page: number
  pageSize: number
  setSearch: (q: string) => void
  setStatus: (s: UseProjectsOptions['status']) => void
  setPage: (p: number) => void
  refresh: (showLoader?: boolean) => Promise<void>
}

// Debounce helper to prevent excessive queries while typing
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])
  return debounced
}

export function useProjects(initial?: UseProjectsOptions): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)

  const [search, setSearch] = useState(initial?.search ?? '')
  const [status, setStatus] = useState<UseProjectsOptions['status']>(initial?.status ?? 'all')
  const [page, setPage] = useState<number>(initial?.page ?? 1)
  const [pageSize] = useState<number>(initial?.pageSize ?? 12)

  const debouncedSearch = useDebouncedValue(search, 300)

  const refresh = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setIsLoading(true)
      setError(null)
      const supabase = createClient()

      // Ensure user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Authentication required to view projects')
      }

      // Build base query with joins
      let query = supabase
        .from('projects_new')
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
        `, { count: 'exact' })
        .order('created_at', { ascending: false })

      // Optional status filter
      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      // Optional search filter (client or project fields)
      if (debouncedSearch) {
        // Search name or project_number
        query = query.or(
          `name.ilike.%${debouncedSearch}%,project_number.ilike.%${debouncedSearch}%`
        )
      }

      // Pagination: convert to from/to (1-based page)
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      const valid = (data as Project[] | null) ?? []
      setProjects(valid)
      setTotal(count ?? valid.length)
    } catch (err: any) {
      setError(err.message || 'Failed to load projects')
    } finally {
      if (showLoader) setIsLoading(false)
    }
  }, [debouncedSearch, page, pageSize, status])

  // Initial load
  useEffect(() => {
    refresh(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-fetch on filter/search/page changes (no blocking loader)
  useEffect(() => {
    refresh(false)
  }, [refresh])

  return useMemo(() => ({
    projects,
    isLoading,
    error,
    total,
    page,
    pageSize,
    setSearch,
    setStatus,
    setPage,
    refresh,
  }), [projects, isLoading, error, total, page, pageSize, refresh])
}


