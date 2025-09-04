"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface Transaction {
  id: string
  company_id: string
  project_id: string | null
  user_id: string
  transaction_date: string
  description: string
  category: string
  amount: number
  type: 'income' | 'expense'
  attachment_file: string | null
  created_at: string
  updated_at: string
  project?: {
    name: string
  }
}

export interface UseTransactionsOptions {
  search?: string
  category?: string
  type?: 'income' | 'expense' | 'all'
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
}

export interface UseTransactionsResult {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  total: number
  page: number
  pageSize: number
  monthlyStats: {
    totalIncome: number
    totalExpenses: number
    netProfit: number
    previousMonth: {
      totalIncome: number
      totalExpenses: number
      netProfit: number
    }
  }
  categories: Array<{
    name: string
    amount: number
    type: 'income' | 'expense'
    percentage: number
  }>
  setSearch: (q: string) => void
  setCategory: (c: string) => void
  setType: (t: UseTransactionsOptions['type']) => void
  setPage: (p: number) => void
  setDateRange: (start?: string, end?: string) => void
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

export function useTransactions(initial?: UseTransactionsOptions): UseTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [monthlyStats, setMonthlyStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    previousMonth: {
      totalIncome: 0,
      totalExpenses: 0,
      netProfit: 0,
    },
  })
  const [categories, setCategories] = useState<Array<{
    name: string
    amount: number
    type: 'income' | 'expense'
    percentage: number
  }>>([])

  const [search, setSearch] = useState(initial?.search ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [type, setType] = useState<UseTransactionsOptions['type']>(initial?.type ?? 'all')
  const [page, setPage] = useState<number>(initial?.page ?? 1)
  const [pageSize] = useState<number>(initial?.pageSize ?? 50)
  const [startDate, setStartDate] = useState<string | undefined>(initial?.startDate)
  const [endDate, setEndDate] = useState<string | undefined>(initial?.endDate)

  const debouncedSearch = useDebouncedValue(search, 300)

  const setDateRange = useCallback((start?: string, end?: string) => {
    setStartDate(start)
    setEndDate(end)
    setPage(1)
  }, [])

  const calculateStats = useCallback(async (supabase: ReturnType<typeof createClient>) => {
    try {
      // Get current month transactions
      const currentMonth = new Date()
      const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

      const { data: currentMonthData } = await supabase
        .from('financial_transactions')
        .select('amount, type, category')
        .gte('transaction_date', currentMonthStart.toISOString().split('T')[0])
        .lte('transaction_date', currentMonthEnd.toISOString().split('T')[0])

      // Get previous month transactions
      const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
      const previousMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)

      const { data: previousMonthData } = await supabase
        .from('financial_transactions')
        .select('amount, type, category')
        .gte('transaction_date', previousMonth.toISOString().split('T')[0])
        .lte('transaction_date', previousMonthEnd.toISOString().split('T')[0])

      // Calculate current month stats
      const currentIncome = currentMonthData?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0
      const currentExpenses = Math.abs(currentMonthData?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0)
      const currentProfit = currentIncome - currentExpenses

      // Calculate previous month stats
      const prevIncome = previousMonthData?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0
      const prevExpenses = Math.abs(previousMonthData?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0)
      const prevProfit = prevIncome - prevExpenses

      setMonthlyStats({
        totalIncome: currentIncome,
        totalExpenses: currentExpenses,
        netProfit: currentProfit,
        previousMonth: {
          totalIncome: prevIncome,
          totalExpenses: prevExpenses,
          netProfit: prevProfit,
        },
      })

      // Calculate category breakdown
      const categoryMap = new Map<string, { income: number, expense: number }>()
      currentMonthData?.forEach(t => {
        const existing = categoryMap.get(t.category) || { income: 0, expense: 0 }
        if (t.type === 'income') {
          existing.income += Number(t.amount)
        } else {
          existing.expense += Math.abs(Number(t.amount))
        }
        categoryMap.set(t.category, existing)
      })

      const totalExpenseAmount = currentExpenses
      const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, amounts]) => {
        if (amounts.income > 0) {
          return {
            name,
            amount: amounts.income,
            type: 'income' as const,
            percentage: 100,
          }
        } else {
          return {
            name,
            amount: -amounts.expense,
            type: 'expense' as const,
            percentage: totalExpenseAmount > 0 ? Math.round((amounts.expense / totalExpenseAmount) * 100) : 0,
          }
        }
      }).filter(cat => cat.amount !== 0)

      setCategories(categoryBreakdown)
    } catch (err) {
      console.error('Error calculating stats:', err)
    }
  }, [])

  const refresh = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setIsLoading(true)
      setError(null)
      const supabase = createClient()

      // Ensure user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Authentication required to view transactions')
      }

      // Build base query with joins
      let query = supabase
        .from('financial_transactions')
        .select(`
          *,
          project:projects_new(name)
        `, { count: 'exact' })
        .order('transaction_date', { ascending: false })

      // Optional type filter
      if (type && type !== 'all') {
        query = query.eq('type', type)
      }

      // Optional category filter
      if (category) {
        query = query.eq('category', category)
      }

      // Optional search filter
      if (debouncedSearch) {
        query = query.or(
          `description.ilike.%${debouncedSearch}%`
        )
      }

      // Optional date range filter
      if (startDate) {
        query = query.gte('transaction_date', startDate)
      }
      if (endDate) {
        query = query.lte('transaction_date', endDate)
      }

      // Pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      const valid = (data as Transaction[] | null) ?? []
      setTransactions(valid)
      setTotal(count ?? valid.length)

      // Calculate monthly stats and categories
      await calculateStats(supabase)
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions')
    } finally {
      if (showLoader) setIsLoading(false)
    }
  }, [debouncedSearch, page, pageSize, type, category, startDate, endDate, calculateStats])

  // Initial load
  useEffect(() => {
    refresh(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-fetch on filter/search/page changes
  useEffect(() => {
    refresh(false)
  }, [refresh])

  return useMemo(() => ({
    transactions,
    isLoading,
    error,
    total,
    page,
    pageSize,
    monthlyStats,
    categories,
    setSearch,
    setCategory,
    setType,
    setPage,
    setDateRange,
    refresh,
  }), [transactions, isLoading, error, total, page, pageSize, monthlyStats, categories, refresh])
}