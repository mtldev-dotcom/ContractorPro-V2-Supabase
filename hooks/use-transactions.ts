"use client"

// React hooks for state management and side effects
import { useCallback, useEffect, useMemo, useState } from 'react'
// Supabase client for database operations
import { createClient } from '@/utils/supabase/client'

/**
 * Transaction interface - represents a financial transaction record
 * This matches the structure of the financial_transactions table in Supabase
 */
export interface Transaction {
  id: string // Unique identifier for the transaction
  company_id: string // ID of the company this transaction belongs to
  project_id: string | null // Optional project association
  user_id: string // ID of the user who created the transaction
  transaction_date: string // Date when the transaction occurred (ISO string)
  description: string // Human-readable description of the transaction
  category: string // Category classification (e.g., "Materials", "Labor", etc.)
  amount: number // Transaction amount (positive for income, negative for expenses)
  type: 'income' | 'expense' // Type of transaction
  attachment_file: string | null // Optional file attachment URL
  created_at: string // Timestamp when record was created
  updated_at: string // Timestamp when record was last updated
  project?: { // Optional joined project data
    name: string // Project name
  }
}

/**
 * Options interface for configuring the useTransactions hook
 * All properties are optional to allow flexible usage
 */
export interface UseTransactionsOptions {
  search?: string // Search query to filter transactions by description
  category?: string // Filter by specific category
  type?: 'income' | 'expense' | 'all' // Filter by transaction type
  page?: number // Current page for pagination
  pageSize?: number // Number of transactions per page
  startDate?: string // Start date for date range filtering (ISO string)
  endDate?: string // End date for date range filtering (ISO string)
}

/**
 * Return type interface for the useTransactions hook
 * Provides all data and functions needed for transaction management
 */
export interface UseTransactionsResult {
  // Data properties
  transactions: Transaction[] // Array of transaction records
  isLoading: boolean // Loading state indicator
  error: string | null // Error message if something goes wrong
  total: number // Total number of transactions (for pagination)
  page: number // Current page number
  pageSize: number // Number of items per page
  
  // Calculated statistics
  monthlyStats: {
    totalIncome: number // Total income for current month
    totalExpenses: number // Total expenses for current month
    netProfit: number // Net profit (income - expenses) for current month
    previousMonth: {
      totalIncome: number // Previous month's income for comparison
      totalExpenses: number // Previous month's expenses for comparison
      netProfit: number // Previous month's net profit for comparison
    }
  }
  
  // Category breakdown data
  categories: Array<{
    name: string // Category name
    amount: number // Total amount for this category
    type: 'income' | 'expense' // Category type
    percentage: number // Percentage of total expenses (for expense categories)
  }>
  
  // Filter and control functions
  setSearch: (q: string) => void // Update search filter
  setCategory: (c: string) => void // Update category filter
  setType: (t: UseTransactionsOptions['type']) => void // Update transaction type filter
  setPage: (p: number) => void // Update current page
  setDateRange: (start?: string, end?: string) => void // Update date range filter
  refresh: (showLoader?: boolean) => Promise<void> // Manually refresh data
}

/**
 * Custom hook for debouncing values to prevent excessive API calls
 * Delays updating the returned value until the input stops changing for a specified time
 * 
 * @param value - The value to debounce
 * @param delayMs - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)
  
  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const id = setTimeout(() => setDebounced(value), delayMs)
    
    // Clean up the timer if the value changes before the delay completes
    return () => clearTimeout(id)
  }, [value, delayMs])
  
  return debounced
}

/**
 * Main useTransactions hook - manages transaction data fetching and state
 * 
 * This hook provides a complete solution for transaction management including:
 * - Data fetching with filtering and pagination
 * - Loading and error states
 * - Monthly statistics calculation
 * - Category breakdown analysis
 * - Search functionality with debouncing
 * 
 * @param initial - Optional initial configuration for filters and pagination
 * @returns Object containing transaction data, statistics, and control functions
 */
export function useTransactions(initial?: UseTransactionsOptions): UseTransactionsResult {
  // ===== CORE DATA STATE =====
  
  const [transactions, setTransactions] = useState<Transaction[]>([]) // Main transaction data array
  const [isLoading, setIsLoading] = useState<boolean>(true) // Loading state for UI feedback
  const [error, setError] = useState<string | null>(null) // Error message for error handling
  const [total, setTotal] = useState<number>(0) // Total count of transactions (for pagination)
  
  // Monthly statistics state - tracks current and previous month financial data
  const [monthlyStats, setMonthlyStats] = useState({
    totalIncome: 0, // Current month total income
    totalExpenses: 0, // Current month total expenses
    netProfit: 0, // Current month net profit (income - expenses)
    previousMonth: {
      totalIncome: 0, // Previous month income for comparison
      totalExpenses: 0, // Previous month expenses for comparison
      netProfit: 0, // Previous month net profit for comparison
    },
  })
  
  // Category breakdown state - provides spending analysis by category
  const [categories, setCategories] = useState<Array<{
    name: string // Category name
    amount: number // Total amount for this category
    type: 'income' | 'expense' // Whether this is an income or expense category
    percentage: number // Percentage of total expenses (for expense categories)
  }>>([])

  // ===== FILTER STATE =====
  
  // Initialize filter state from initial options or defaults
  const [search, setSearch] = useState(initial?.search ?? '') // Search query filter
  const [category, setCategory] = useState(initial?.category ?? '') // Category filter
  const [type, setType] = useState<UseTransactionsOptions['type']>(initial?.type ?? 'all') // Transaction type filter
  const [page, setPage] = useState<number>(initial?.page ?? 1) // Current page for pagination
  const [pageSize] = useState<number>(initial?.pageSize ?? 50) // Items per page (constant)
  const [startDate, setStartDate] = useState<string | undefined>(initial?.startDate) // Date range start
  const [endDate, setEndDate] = useState<string | undefined>(initial?.endDate) // Date range end

  // ===== DEBOUNCED VALUES =====
  
  // Debounce search input to prevent excessive API calls while user is typing
  const debouncedSearch = useDebouncedValue(search, 300)

  // ===== CALLBACK FUNCTIONS =====
  
  /**
   * Update date range filter and reset pagination
   * useCallback ensures function reference stability for dependency arrays
   */
  const setDateRange = useCallback((start?: string, end?: string) => {
    setStartDate(start) // Update start date
    setEndDate(end) // Update end date
    setPage(1) // Reset to first page when date range changes
  }, [])

  /**
   * Calculate monthly statistics and category breakdown
   * This function analyzes transaction data to provide financial insights
   * 
   * @param supabase - Supabase client instance for database queries
   */
  const calculateStats = useCallback(async (supabase: ReturnType<typeof createClient>) => {
    try {
      // ===== CURRENT MONTH DATA =====
      
      // Calculate date boundaries for current month
      const currentMonth = new Date()
      const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1) // First day of current month
      const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0) // Last day of current month

      // Fetch current month transactions for statistics calculation
      const { data: currentMonthData } = await supabase
        .from('financial_transactions')
        .select('amount, type, category') // Only select fields needed for calculations
        .gte('transaction_date', currentMonthStart.toISOString().split('T')[0]) // Greater than or equal to month start
        .lte('transaction_date', currentMonthEnd.toISOString().split('T')[0]) // Less than or equal to month end

      // ===== PREVIOUS MONTH DATA =====
      
      // Calculate date boundaries for previous month (for comparison)
      const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1) // First day of previous month
      const previousMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0) // Last day of previous month

      // Fetch previous month transactions for comparison statistics
      const { data: previousMonthData } = await supabase
        .from('financial_transactions')
        .select('amount, type, category') // Only select fields needed for calculations
        .gte('transaction_date', previousMonth.toISOString().split('T')[0]) // Greater than or equal to previous month start
        .lte('transaction_date', previousMonthEnd.toISOString().split('T')[0]) // Less than or equal to previous month end

      // ===== CURRENT MONTH CALCULATIONS =====
      
      // Calculate total income for current month (sum all positive amounts)
      const currentIncome = currentMonthData?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0
      
      // Calculate total expenses for current month (sum absolute values of negative amounts)
      const currentExpenses = Math.abs(currentMonthData?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0)
      
      // Calculate net profit (income minus expenses)
      const currentProfit = currentIncome - currentExpenses

      // ===== PREVIOUS MONTH CALCULATIONS =====
      
      // Calculate previous month totals for comparison
      const prevIncome = previousMonthData?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0
      const prevExpenses = Math.abs(previousMonthData?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0)
      const prevProfit = prevIncome - prevExpenses

      // Update monthly statistics state
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

      // ===== CATEGORY BREAKDOWN CALCULATION =====
      
      // Create a map to aggregate amounts by category
      const categoryMap = new Map<string, { income: number, expense: number }>()
      
      // Process each transaction to build category totals
      currentMonthData?.forEach(t => {
        const existing = categoryMap.get(t.category) || { income: 0, expense: 0 } // Get existing totals or initialize
        
        if (t.type === 'income') {
          existing.income += Number(t.amount) // Add to income total for this category
        } else {
          existing.expense += Math.abs(Number(t.amount)) // Add to expense total (use absolute value)
        }
        
        categoryMap.set(t.category, existing) // Update the map
      })

      // Convert category map to array format with percentages
      const totalExpenseAmount = currentExpenses // Total expenses for percentage calculation
      const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, amounts]) => {
        if (amounts.income > 0) {
          // Income category - no percentage calculation needed
          return {
            name,
            amount: amounts.income,
            type: 'income' as const,
            percentage: 100, // Income categories get 100% (not used in UI)
          }
        } else {
          // Expense category - calculate percentage of total expenses
          return {
            name,
            amount: -amounts.expense, // Negative amount to indicate expense
            type: 'expense' as const,
            percentage: totalExpenseAmount > 0 ? Math.round((amounts.expense / totalExpenseAmount) * 100) : 0,
          }
        }
      }).filter(cat => cat.amount !== 0) // Only include categories with non-zero amounts

      // Update categories state
      setCategories(categoryBreakdown)
    } catch (err) {
      console.error('Error calculating stats:', err) // Log errors but don't throw to avoid breaking the UI
    }
  }, [])

  /**
   * Main data fetching function - retrieves transactions from database with applied filters
   * This function builds a dynamic query based on current filter state and executes it
   * 
   * @param showLoader - Whether to show loading state during fetch (default: false)
   */
  const refresh = useCallback(async (showLoader = false) => {
    try {
      // Show loading indicator if requested (typically for initial load)
      if (showLoader) setIsLoading(true)
      setError(null) // Clear any previous errors
      const supabase = createClient() // Create Supabase client instance

      // ===== AUTHENTICATION CHECK =====
      
      // Verify user is authenticated before proceeding
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Authentication required to view transactions')
      }

      // ===== QUERY BUILDING =====
      
      // Build base query with project data joined
      let query = supabase
        .from('financial_transactions') // Main table
        .select(`
          *,
          project:projects_new(name)
        `, { count: 'exact' }) // Include total count for pagination, join project data
        .order('transaction_date', { ascending: false }) // Default sort by date (newest first)

      // ===== APPLY FILTERS =====
      
      // Apply transaction type filter (income/expense/all)
      if (type && type !== 'all') {
        query = query.eq('type', type) // Filter by transaction type
      }

      // Apply category filter if specified
      if (category) {
        query = query.eq('category', category) // Filter by specific category
      }

      // Apply search filter using debounced search term
      if (debouncedSearch) {
        query = query.or(
          `description.ilike.%${debouncedSearch}%` // Case-insensitive search in description
        )
      }

      // Apply date range filters if specified
      if (startDate) {
        query = query.gte('transaction_date', startDate) // Greater than or equal to start date
      }
      if (endDate) {
        query = query.lte('transaction_date', endDate) // Less than or equal to end date
      }

      // ===== PAGINATION =====
      
      // Calculate pagination range
      const from = (page - 1) * pageSize // Starting index for current page
      const to = from + pageSize - 1 // Ending index for current page
      query = query.range(from, to) // Apply pagination to query

      // ===== EXECUTE QUERY =====
      
      // Execute the built query
      const { data, error, count } = await query

      if (error) throw error // Throw error if query failed

      // ===== UPDATE STATE =====
      
      // Process and store results
      const valid = (data as Transaction[] | null) ?? [] // Ensure we have a valid array
      setTransactions(valid) // Update transactions state
      setTotal(count ?? valid.length) // Update total count for pagination

      // Calculate and update monthly statistics and category breakdown
      await calculateStats(supabase)
    } catch (err: any) {
      // Handle errors by setting error state
      setError(err.message || 'Failed to load transactions')
    } finally {
      // Always hide loading indicator when done (if it was shown)
      if (showLoader) setIsLoading(false)
    }
  }, [debouncedSearch, page, pageSize, type, category, startDate, endDate, calculateStats])

  // ===== EFFECT HOOKS =====
  
  /**
   * Initial data load effect - runs once when hook is first used
   * Shows loading indicator during initial fetch
   */
  useEffect(() => {
    refresh(true) // Load data with loading indicator
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run once

  /**
   * Re-fetch effect - runs whenever filters or pagination change
   * Does not show loading indicator for better UX during filtering
   */
  useEffect(() => {
    refresh(false) // Refresh data without loading indicator
  }, [refresh]) // Dependency on refresh function

  // ===== RETURN MEMOIZED RESULT =====
  
  /**
   * Return memoized result object to prevent unnecessary re-renders
   * Only recalculates when dependencies change
   */
  return useMemo(() => ({
    // Data properties
    transactions, // Current transaction data
    isLoading, // Loading state
    error, // Error message
    total, // Total transaction count
    page, // Current page number
    pageSize, // Items per page
    monthlyStats, // Monthly financial statistics
    categories, // Category breakdown data
    
    // Control functions
    setSearch, // Update search filter
    setCategory, // Update category filter
    setType, // Update transaction type filter
    setPage, // Update current page
    setDateRange, // Update date range filter
    refresh, // Manual refresh function
  }), [transactions, isLoading, error, total, page, pageSize, monthlyStats, categories, refresh])
}
