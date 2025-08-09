"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Client, ClientType, ContactMethod } from '@/lib/clients'

export interface UseClientsOptions {
  search?: string
  type?: ClientType | 'all'
  isActive?: boolean | 'all'
  page?: number
  pageSize?: number
}

export interface UseClientsResult {
  clients: Client[]
  isLoading: boolean
  error: string | null
  total: number
  page: number
  pageSize: number
  setSearch: (q: string) => void
  setType: (t: UseClientsOptions['type']) => void
  setIsActive: (a: UseClientsOptions['isActive']) => void
  setPage: (p: number) => void
  refresh: (showLoader?: boolean) => Promise<void>
}

function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])
  return debounced
}

export function useClients(initial?: UseClientsOptions): UseClientsResult {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)

  const [search, setSearch] = useState(initial?.search ?? '')
  const [type, setType] = useState<UseClientsOptions['type']>(initial?.type ?? 'all')
  const [isActive, setIsActive] = useState<UseClientsOptions['isActive']>(initial?.isActive ?? 'all')
  const [page, setPage] = useState<number>(initial?.page ?? 1)
  const [pageSize] = useState<number>(initial?.pageSize ?? 12)

  const debouncedSearch = useDebouncedValue(search, 300)

  const refresh = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setIsLoading(true)
      setError(null)
      const supabase = createClient()

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) throw new Error('Authentication required to view clients')

      let query = supabase
        .from('clients')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (type && type !== 'all') query = query.eq('type', type)
      if (isActive !== 'all') query = query.eq('is_active', isActive)
      if (debouncedSearch) {
        query = query.or(
          `first_name.ilike.%${debouncedSearch}%,last_name.ilike.%${debouncedSearch}%,company_name.ilike.%${debouncedSearch}%,email.ilike.%${debouncedSearch}%`
        )
      }

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query
      if (error) throw error

      setClients((data as Client[]) ?? [])
      setTotal(count ?? 0)
    } catch (err: any) {
      setError(err.message || 'Failed to load clients')
    } finally {
      if (showLoader) setIsLoading(false)
    }
  }, [debouncedSearch, page, pageSize, type, isActive])

  useEffect(() => { refresh(true) }, [])
  useEffect(() => { refresh(false) }, [refresh])

  return useMemo(() => ({
    clients,
    isLoading,
    error,
    total,
    page,
    pageSize,
    setSearch,
    setType,
    setIsActive,
    setPage,
    refresh,
  }), [clients, isLoading, error, total, page, pageSize, refresh])
}


