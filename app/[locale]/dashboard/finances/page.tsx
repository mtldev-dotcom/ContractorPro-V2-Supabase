"use client"

import { useState, useMemo, useEffect } from "react"
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
  BarChart3
} from "lucide-react"
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
import { AddTransactionModal } from "@/components/add-transaction-modal"
import { useTransactions } from "@/hooks/use-transactions"

type SortField = 'date' | 'amount' | 'description' | 'category'
type SortDirection = 'asc' | 'desc'
type ViewMode = 'table' | 'cards' | 'summary'

export default function Finances() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [transactionType, setTransactionType] = useState<'all' | 'income' | 'expense'>('all')
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'>('month')
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [showFilters, setShowFilters] = useState(false)

  // Calculate date range for filtering
  const getDateRange = () => {
    const now = new Date()
    let startDate: string | undefined
    let endDate: string | undefined

    switch (dateRange) {
      case 'today':
        startDate = endDate = now.toISOString().split('T')[0]
        break
      case 'week':
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        startDate = weekStart.toISOString().split('T')[0]
        endDate = now.toISOString().split('T')[0]
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        break
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        startDate = quarterStart.toISOString().split('T')[0]
        endDate = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0).toISOString().split('T')[0]
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
        endDate = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]
        break
      case 'custom':
        startDate = customStartDate || undefined
        endDate = customEndDate || undefined
        break
      default:
        startDate = endDate = undefined
    }

    return { startDate, endDate }
  }

  const { startDate, endDate } = getDateRange()

  const {
    transactions,
    isLoading,
    error,
    monthlyStats,
    categories,
    setSearch,
    setType,
    setDateRange: setHookDateRange,
    refresh
  } = useTransactions({ 
    pageSize: 100,
    type: transactionType,
    startDate,
    endDate
  })

  // Update hook when filters change
  useEffect(() => {
    setSearch(searchQuery)
    setType(transactionType)
    setHookDateRange(startDate, endDate)
  }, [searchQuery, transactionType, startDate, endDate, setSearch, setType, setHookDateRange])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSearch(value)
  }

  // Get unique categories and projects for filter options
  const availableCategories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category))
    return Array.from(cats).sort()
  }, [transactions])

  const availableProjects = useMemo(() => {
    const projects = new Set(
      transactions
        .filter(t => t.project?.name)
        .map(t => t.project!.name)
    )
    return Array.from(projects).sort()
  }, [transactions])

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(t => selectedCategories.includes(t.category))
    }

    // Apply project filter
    if (selectedProjects.length > 0) {
      filtered = filtered.filter(t => 
        t.project?.name && selectedProjects.includes(t.project.name)
      )
    }

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortField) {
        case 'date':
          aValue = new Date(a.transaction_date)
          bValue = new Date(b.transaction_date)
          break
        case 'amount':
          aValue = Math.abs(Number(a.amount))
          bValue = Math.abs(Number(b.amount))
          break
        case 'description':
          aValue = a.description.toLowerCase()
          bValue = b.description.toLowerCase()
          break
        case 'category':
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [transactions, selectedCategories, selectedProjects, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedProjects([])
    setTransactionType('all')
    setDateRange('month')
    setSearchQuery('')
    setSearch('')
  }

  const activeFiltersCount = selectedCategories.length + selectedProjects.length + 
    (transactionType !== 'all' ? 1 : 0) + (dateRange !== 'month' ? 1 : 0)

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Transactions...</h2>
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
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Transactions</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => refresh()} variant="outline">
            Try Again
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
          <h1 className="text-2xl font-bold">Finances</h1>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions..."
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
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="cards">Cards</SelectItem>
              <SelectItem value="summary">Summary</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced Filters */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-80">
              <SheetHeader>
                <SheetTitle>Filter Transactions</SheetTitle>
                <SheetDescription>
                  Customize your view with advanced filtering options
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* Date Range Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Date Range</Label>
                  <Select value={dateRange} onValueChange={(value: typeof dateRange) => setDateRange(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {dateRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">From</Label>
                        <Input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">To</Label>
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
                  <Label className="text-sm font-medium">Transaction Type</Label>
                  <Select value={transactionType} onValueChange={(value: typeof transactionType) => setTransactionType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="income">Income Only</SelectItem>
                      <SelectItem value="expense">Expenses Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Categories</Label>
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
                  <Label className="text-sm font-medium">Projects</Label>
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
                    Clear All
                  </Button>
                  <Button onClick={() => setShowFilters(false)} className="flex-1">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${monthlyStats.totalIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {monthlyStats.totalIncome >= monthlyStats.previousMonth.totalIncome ? '+' : ''}
                ${(monthlyStats.totalIncome - monthlyStats.previousMonth.totalIncome).toLocaleString()} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${monthlyStats.totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {monthlyStats.totalExpenses <= monthlyStats.previousMonth.totalExpenses ? '-' : '+'}
                ${Math.abs(monthlyStats.totalExpenses - monthlyStats.previousMonth.totalExpenses).toLocaleString()} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlyStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${monthlyStats.netProfit.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {monthlyStats.netProfit >= monthlyStats.previousMonth.netProfit ? '+' : ''}
                ${(monthlyStats.netProfit - monthlyStats.previousMonth.netProfit).toLocaleString()} from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="cards">Card View</TabsTrigger>
            <TabsTrigger value="summary">Summary View</TabsTrigger>
          </TabsList>

          {/* Table View */}
          <TabsContent value="table" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>
                    Showing {filteredAndSortedTransactions.length} of {transactions.length} transactions
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Sort by:</Label>
                  <Select value={sortField} onValueChange={(value: SortField) => handleSort(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="description">Description</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
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
                        Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('description')}>
                        Description {sortField === 'description' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                        Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="text-right cursor-pointer" onClick={() => handleSort('amount')}>
                        Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="text-sm">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {transaction.project ? transaction.project.name : 'General'}
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Card View */}
          <TabsContent value="cards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedTransactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1">{transaction.description}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div
                        className={`text-lg font-bold ${
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : ""}${Math.abs(Number(transaction.amount)).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {transaction.project ? transaction.project.name : 'General'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Summary View */}
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Financial activity by category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categories.map((category, index) => (
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
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Statistics</CardTitle>
                  <CardDescription>Overview of filtered transactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {filteredAndSortedTransactions.filter(t => t.type === 'income').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Income Transactions</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {filteredAndSortedTransactions.filter(t => t.type === 'expense').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Expense Transactions</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Transaction:</span>
                      <span className="text-sm font-medium">
                        ${filteredAndSortedTransactions.length > 0 
                          ? (filteredAndSortedTransactions.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) / filteredAndSortedTransactions.length).toLocaleString(undefined, { maximumFractionDigits: 2 })
                          : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Amount:</span>
                      <span className="text-sm font-medium">
                        ${filteredAndSortedTransactions.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0).toLocaleString()}
                      </span>
                    </div>
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
                <h3 className="font-medium">Record Payment</h3>
                <p className="text-sm text-muted-foreground">Add project payment received</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowAddModal(true)}>
            <CardContent className="flex items-center p-6">
              <PiggyBank className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <h3 className="font-medium">Add Expense</h3>
                <p className="text-sm text-muted-foreground">Record business expense</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-6">
              <BarChart3 className="h-8 w-8 text-purple-500 mr-4" />
              <div>
                <h3 className="font-medium">Generate Report</h3>
                <p className="text-sm text-muted-foreground">Create financial report</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddTransactionModal open={showAddModal} onOpenChange={setShowAddModal} onSuccess={() => refresh()} />
    </div>
  )
}
