"use client"

// React hooks for state management and performance optimization
import { useState, useMemo, useEffect } from "react"
// Next-intl for internationalization
import { useTranslations } from 'next-intl'
// Lucide React icons for UI elements
import { 
  Search, 
  Plus, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PiggyBank,
  Calendar,
  ArrowUpDown,
  X,
  ChevronDown,
  FileText,
  BarChart3,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react"
// UI components from our component library
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// Custom components for transaction management
import { AddTransactionModal } from "@/components/add-transaction-modal"
import { EditTransactionModal } from "@/components/edit-transaction-modal"
import { useTransactions } from "@/hooks/use-transactions"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/utils/supabase/client"

// TypeScript type definitions for component state
type SortField = 'date' | 'amount' | 'description' | 'category' // Fields that can be sorted
type SortDirection = 'asc' | 'desc' // Sort direction options
type ViewMode = 'table' | 'cards' | 'summary' // Different view modes for displaying transactions

/**
 * Finances Component - Main financial management dashboard
 * 
 * This component provides a comprehensive interface for managing financial transactions
 * with advanced filtering, sorting, and multiple view modes. It includes:
 * - Financial overview cards showing income, expenses, and profit
 * - Advanced filtering by date, type, category, and project
 * - Multiple view modes (table, cards, summary)
 * - Sorting capabilities
 * - Transaction management (add, view, search)
 */
export default function Finances() {
  // ===== INTERNATIONALIZATION =====
  
  // Translation hook for finances namespace
  const t = useTranslations('finances')

  // ===== STATE MANAGEMENT =====
  
  // Search and UI state
  const [searchQuery, setSearchQuery] = useState("") // Current search query for filtering transactions
  const [showAddModal, setShowAddModal] = useState(false) // Controls visibility of add transaction modal
  const [showEditModal, setShowEditModal] = useState(false) // Controls visibility of edit transaction modal
  const [showFilters, setShowFilters] = useState(false) // Controls visibility of advanced filters panel
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null) // Currently selected transaction for editing
  const [userRole, setUserRole] = useState<string | null>(null) // Current user's role for permission checking
  const [isLoadingRole, setIsLoadingRole] = useState(true) // Loading state for user role fetch
  
  // Filter state - these control which transactions are displayed
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]) // Array of selected category filters
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]) // Array of selected project filters
  const [transactionType, setTransactionType] = useState<'all' | 'income' | 'expense'>('all') // Filter by transaction type
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'>('month') // Predefined date range filter
  const [customStartDate, setCustomStartDate] = useState("") // Custom date range start (when dateRange is 'custom')
  const [customEndDate, setCustomEndDate] = useState("") // Custom date range end (when dateRange is 'custom')
  
  // Sorting and display state
  const [sortField, setSortField] = useState<SortField>('date') // Current field to sort by
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc') // Current sort direction
  const [viewMode, setViewMode] = useState<ViewMode>('table') // Current view mode for displaying transactions

  // Toast hook for user notifications
  const { toast } = useToast()

  // ===== HELPER FUNCTIONS =====

  /**
   * Check if current user is an admin
   * Admins have permission to edit and delete transactions
   */
  const isAdmin = userRole === 'admin'

  /**
   * Fetch user role from database on component mount
   * This determines what actions the user can perform
   */
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          setUserRole(null)
          return
        }

        // Get user role from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (userError) {
          console.error('Error fetching user role:', userError)
          setUserRole(null)
          return
        }

        setUserRole(userData?.role || null)
      } catch (err) {
        console.error('Error in fetchUserRole:', err)
        setUserRole(null)
      } finally {
        setIsLoadingRole(false)
      }
    }

    fetchUserRole()
  }, [])

  /**
   * Handle editing a transaction (admin only)
   * Opens the edit modal with the selected transaction data
   */
  const handleEditTransaction = (transaction: any) => {
    if (!isAdmin) {
      toast({
        title: t('accessDenied'),
        description: t('adminOnlyEdit'),
        variant: "destructive",
      })
      return
    }
    
    setSelectedTransaction(transaction)
    setShowEditModal(true)
  }

  /**
   * Handle deleting a transaction (admin only)
   * Shows confirmation and deletes the transaction from database
   */
  const handleDeleteTransaction = async (transaction: any) => {
    if (!isAdmin) {
      toast({
        title: t('accessDenied'),
        description: t('adminOnlyDelete'),
        variant: "destructive",
      })
      return
    }

    // Show confirmation dialog
    if (!window.confirm(`${t('confirmDelete')}\n\n${t('description')}: ${transaction.description}\n${t('amount')}: $${Math.abs(Number(transaction.amount)).toLocaleString()}\n\n${t('deleteWarning')}`)) {
      return
    }

    try {
      const supabase = createClient()
      
      // Delete transaction from database
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', transaction.id)

      if (error) throw error

      // Show success message
      toast({
        title: t('transactionDeleted'),
        description: t('transactionDeletedDesc', { description: transaction.description }),
      })

      // Refresh the transaction list
      refresh()
    } catch (err: any) {
      toast({
        title: t('errorDeletingTransaction'),
        description: err.message || t('errorDeletingTransactionDesc'),
        variant: "destructive",
      })
    }
  }

  /**
   * Calculate date range for filtering based on selected dateRange option
   * Converts predefined date ranges (today, week, month, etc.) into actual start/end dates
   * Returns ISO date strings that can be used for database queries
   */
  const getDateRange = () => {
    const now = new Date()
    let startDate: string | undefined
    let endDate: string | undefined

    switch (dateRange) {
      case 'today':
        // Set both start and end to today's date
        startDate = endDate = now.toISOString().split('T')[0]
        break
      case 'week':
        // Calculate start of current week (Sunday) and set end to today
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay()) // Go back to Sunday
        startDate = weekStart.toISOString().split('T')[0]
        endDate = now.toISOString().split('T')[0]
        break
      case 'month':
        // Set to first day of current month and last day of current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        break
      case 'quarter':
        // Calculate current quarter (Q1: Jan-Mar, Q2: Apr-Jun, etc.)
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        startDate = quarterStart.toISOString().split('T')[0]
        endDate = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0).toISOString().split('T')[0]
        break
      case 'year':
        // Set to January 1st and December 31st of current year
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
        endDate = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]
        break
      case 'custom':
        // Use user-provided custom dates
        startDate = customStartDate || undefined
        endDate = customEndDate || undefined
        break
      default:
        // 'all' case - no date filtering
        startDate = endDate = undefined
    }

    return { startDate, endDate }
  }

  // Get calculated date range for current filter settings
  const { startDate, endDate } = getDateRange()

  // ===== DATA FETCHING =====
  
  /**
   * useTransactions hook - Fetches and manages transaction data
   * Provides transactions, loading states, statistics, and filter functions
   * Automatically refetches when parameters change
   */
  const {
    transactions, // Array of transaction objects
    isLoading, // Boolean indicating if data is being fetched
    error, // Error message if fetch fails
    monthlyStats, // Financial statistics for current and previous month
    categories, // Category breakdown with amounts and percentages
    setSearch, // Function to update search filter in the hook
    setType, // Function to update transaction type filter in the hook
    setDateRange: setHookDateRange, // Function to update date range filter in the hook
    refresh // Function to manually refresh data
  } = useTransactions({ 
    pageSize: 100, // Number of transactions to fetch per page
    type: transactionType, // Current transaction type filter
    startDate, // Calculated start date for filtering
    endDate // Calculated end date for filtering
  })

  // ===== EFFECT HOOKS =====
  
  /**
   * Update the useTransactions hook whenever local filter state changes
   * This ensures the hook's internal state stays in sync with component state
   */
  useEffect(() => {
    setSearch(searchQuery) // Update search filter in hook
    setType(transactionType) // Update transaction type filter in hook
    setHookDateRange(startDate, endDate) // Update date range filter in hook
  }, [searchQuery, transactionType, startDate, endDate, setSearch, setType, setHookDateRange])

  // ===== EVENT HANDLERS =====
  
  /**
   * Handle search input changes
   * Updates both local state and the hook's search filter
   */
  const handleSearchChange = (value: string) => {
    setSearchQuery(value) // Update local search state
    setSearch(value) // Update hook's search filter
  }

  // ===== COMPUTED VALUES =====
  
  /**
   * Extract unique categories from transactions for filter options
   * Uses useMemo for performance - only recalculates when transactions change
   */
  const availableCategories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category)) // Get unique categories
    return Array.from(cats).sort() // Convert to sorted array
  }, [transactions])

  /**
   * Extract unique project names from transactions for filter options
   * Only includes transactions that have an associated project
   */
  const availableProjects = useMemo(() => {
    const projects = new Set(
      transactions
        .filter(t => t.project?.name) // Only transactions with projects
        .map(t => t.project!.name) // Extract project names
    )
    return Array.from(projects).sort() // Convert to sorted array
  }, [transactions])

  /**
   * Apply client-side filtering and sorting to transactions
   * This handles filters that aren't handled by the database query
   */
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions

    // Apply category filter - only show transactions in selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(t => selectedCategories.includes(t.category))
    }

    // Apply project filter - only show transactions for selected projects
    if (selectedProjects.length > 0) {
      filtered = filtered.filter(t => 
        t.project?.name && selectedProjects.includes(t.project.name)
      )
    }

    // Sort transactions based on selected field and direction
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      // Determine values to compare based on sort field
      switch (sortField) {
        case 'date':
          aValue = new Date(a.transaction_date)
          bValue = new Date(b.transaction_date)
          break
        case 'amount':
          aValue = Math.abs(Number(a.amount)) // Use absolute value for sorting
          bValue = Math.abs(Number(b.amount))
          break
        case 'description':
          aValue = a.description.toLowerCase() // Case-insensitive sorting
          bValue = b.description.toLowerCase()
          break
        case 'category':
          aValue = a.category.toLowerCase() // Case-insensitive sorting
          bValue = b.category.toLowerCase()
          break
        default:
          return 0 // No sorting
      }

      // Apply sort direction
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0 // Values are equal
    })

    return filtered
  }, [transactions, selectedCategories, selectedProjects, sortField, sortDirection])

  /**
   * Handle sorting - either change direction if same field, or set new field
   */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Same field clicked - toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New field clicked - set field and default to descending
      setSortField(field)
      setSortDirection('desc')
    }
  }

  /**
   * Clear all active filters and reset to default state
   */
  const clearFilters = () => {
    setSelectedCategories([]) // Clear category filters
    setSelectedProjects([]) // Clear project filters
    setTransactionType('all') // Reset to show all transaction types
    setDateRange('month') // Reset to current month
    setSearchQuery('') // Clear search query
    setSearch('') // Clear search in hook
  }

  /**
   * Count active filters for display in UI
   * Helps users understand how many filters are currently applied
   */
  const activeFiltersCount = selectedCategories.length + selectedProjects.length + 
    (transactionType !== 'all' ? 1 : 0) + (dateRange !== 'month' ? 1 : 0)

  // Show loading state (including role loading)
  if (isLoading || isLoadingRole) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('loading')}</h2>
          <Progress className="w-64 h-2" />
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">{t('errorLoading')}</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => refresh()} variant="outline">
            {t('tryAgain')}
          </Button>
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
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {t('filtersActive', { count: activeFiltersCount })}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          {/* View Mode Toggle */}
          <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">{t('tableView')}</SelectItem>
              <SelectItem value="cards">{t('cardView')}</SelectItem>
              <SelectItem value="summary">{t('summaryView')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced Filters */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {t('filters')}
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-80">
              <SheetHeader>
                <SheetTitle>{t('filterTransactions')}</SheetTitle>
                <SheetDescription>
                  {t('customizeView')}
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* Date Range Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">{t('dateRange')}</Label>
                  <Select value={dateRange} onValueChange={(value: typeof dateRange) => setDateRange(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allTime')}</SelectItem>
                      <SelectItem value="today">{t('today')}</SelectItem>
                      <SelectItem value="week">{t('thisWeek')}</SelectItem>
                      <SelectItem value="month">{t('thisMonth')}</SelectItem>
                      <SelectItem value="quarter">{t('thisQuarter')}</SelectItem>
                      <SelectItem value="year">{t('thisYear')}</SelectItem>
                      <SelectItem value="custom">{t('customRange')}</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {dateRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">{t('from')}</Label>
                        <Input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">{t('to')}</Label>
                        <Input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Transaction Type Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">{t('transactionType')}</Label>
                  <Select value={transactionType} onValueChange={(value: typeof transactionType) => setTransactionType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allTypes')}</SelectItem>
                      <SelectItem value="income">{t('incomeOnly')}</SelectItem>
                      <SelectItem value="expense">{t('expensesOnly')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">{t('categories')}</Label>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {availableCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category])
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== category))
                            }
                          }}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">{t('projects')}</Label>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {availableProjects.map((project) => (
                      <div key={project} className="flex items-center space-x-2">
                        <Checkbox
                          id={`project-${project}`}
                          checked={selectedProjects.includes(project)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedProjects([...selectedProjects, project])
                            } else {
                              setSelectedProjects(selectedProjects.filter(p => p !== project))
                            }
                          }}
                        />
                        <Label htmlFor={`project-${project}`} className="text-sm">
                          {project}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearFilters} className="flex-1">
                    {t('clearAll')}
                  </Button>
                  <Button onClick={() => setShowFilters(false)} className="flex-1">
                    {t('applyFilters')}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('addTransaction')}
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('totalIncome')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${monthlyStats.totalIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {monthlyStats.totalIncome >= monthlyStats.previousMonth.totalIncome ? '+' : ''}
                ${(monthlyStats.totalIncome - monthlyStats.previousMonth.totalIncome).toLocaleString()} {t('fromLastMonth')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('totalExpenses')}</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${monthlyStats.totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {monthlyStats.totalExpenses <= monthlyStats.previousMonth.totalExpenses ? '-' : '+'}
                ${Math.abs(monthlyStats.totalExpenses - monthlyStats.previousMonth.totalExpenses).toLocaleString()} {t('fromLastMonth')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('netProfit')}</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlyStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${monthlyStats.netProfit.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {monthlyStats.netProfit >= monthlyStats.previousMonth.netProfit ? '+' : ''}
                ${(monthlyStats.netProfit - monthlyStats.previousMonth.netProfit).toLocaleString()} {t('fromLastMonth')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="table">{t('tableView')}</TabsTrigger>
            <TabsTrigger value="cards">{t('cardView')}</TabsTrigger>
            <TabsTrigger value="summary">{t('summaryView')}</TabsTrigger>
          </TabsList>

          {/* Table View */}
          <TabsContent value="table" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('transactions')}</CardTitle>
                  <CardDescription>
                    {t('showingTransactions', { filtered: filteredAndSortedTransactions.length, total: transactions.length })}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">{t('sortBy')}</Label>
                  <Select value={sortField} onValueChange={(value: SortField) => handleSort(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">{t('date')}</SelectItem>
                      <SelectItem value="amount">{t('amount')}</SelectItem>
                      <SelectItem value="description">{t('description')}</SelectItem>
                      <SelectItem value="category">{t('category')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                        {t('date')} {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('description')}>
                        {t('description')} {sortField === 'description' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead>{t('project')}</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                        {t('category')} {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="cursor-pointer text-right" onClick={() => handleSort('amount')}>
                        {t('amount')} {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      {isAdmin && <TableHead className="w-12">{t('actions')}</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-8 text-muted-foreground">
                          {t('noTransactions')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="text-sm">
                            {new Date(transaction.transaction_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">{transaction.description}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {transaction.project ? transaction.project.name : t('general')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {transaction.category}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              transaction.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : ""}${Math.abs(Number(transaction.amount)).toLocaleString()}
                          </TableCell>
                          {isAdmin && (
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    {t('edit')}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteTransaction(transaction)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t('delete')}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards View */}
          <TabsContent value="cards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedTransactions.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  {t('noTransactions')}
                </div>
              ) : (
                filteredAndSortedTransactions.map((transaction) => (
                  <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{transaction.description}</CardTitle>
                        {isAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTransaction(transaction)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      <CardDescription>
                        {new Date(transaction.transaction_date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t('project')}</span>
                          <span className="text-sm">
                            {transaction.project ? transaction.project.name : t('general')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t('category')}</span>
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm text-muted-foreground">{t('amount')}</span>
                          <span
                            className={`font-bold ${
                              transaction.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : ""}${Math.abs(Number(transaction.amount)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Summary View */}
          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('categoryBreakdown')}</CardTitle>
                  <CardDescription>{t('categoryBreakdownDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categories.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">{t('noCategories')}</p>
                  ) : (
                    categories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span
                            className={`text-sm font-medium ${
                              category.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {category.type === "income" ? "+" : ""}${Math.abs(category.amount).toLocaleString()}
                          </span>
                        </div>
                        {category.type === "expense" && (
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('recentActivity')}</CardTitle>
                  <CardDescription>{t('recentActivityDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredAndSortedTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.transaction_date).toLocaleDateString()} • {transaction.category}
                            </p>
                          </div>
                        </div>
                        <span className={`font-medium text-sm ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : ''}${Math.abs(Number(transaction.amount)).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {filteredAndSortedTransactions.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">{t('noRecentActivity')}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowAddModal(true)}>
            <CardContent className="flex items-center p-6">
              <CreditCard className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <h3 className="font-medium">{t('recordPayment')}</h3>
                <p className="text-sm text-muted-foreground">{t('recordPaymentDesc')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowAddModal(true)}>
            <CardContent className="flex items-center p-6">
              <PiggyBank className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <h3 className="font-medium">{t('addExpense')}</h3>
                <p className="text-sm text-muted-foreground">{t('addExpenseDesc')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-6">
              <BarChart3 className="h-8 w-8 text-purple-500 mr-4" />
              <div>
                <h3 className="font-medium">{t('generateReport')}</h3>
                <p className="text-sm text-muted-foreground">{t('generateReportDesc')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AddTransactionModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
        onSuccess={() => refresh()} 
      />
      
      {selectedTransaction && (
        <EditTransactionModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          transaction={selectedTransaction}
          onSuccess={() => {
            refresh()
            setSelectedTransaction(null)
          }}
        />
      )}
    </div>
  )
}
