"use client"

import { useState } from "react"
import { Search, Plus, Filter, TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { AddTransactionModal } from "@/components/add-transaction-modal"
import { useTransactions } from "@/hooks/use-transactions"

export default function Finances() {
  const {
    transactions,
    isLoading,
    error,
    monthlyStats,
    categories,
    setSearch,
    refresh
  } = useTransactions({ pageSize: 50 })
  
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSearch(value)
  }

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
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const filteredTransactions = transactions

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Finances</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
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
                +${(monthlyStats.totalIncome - monthlyStats.previousMonth.totalIncome).toLocaleString()} from last month
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
                -${(monthlyStats.previousMonth.totalExpenses - monthlyStats.totalExpenses).toLocaleString()} from last
                month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${monthlyStats.netProfit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +${(monthlyStats.netProfit - monthlyStats.previousMonth.netProfit).toLocaleString()} from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Breakdown */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>This month's spending by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span
                      className={`text-sm font-medium ${category.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {category.type === "income" ? "+" : ""}${Math.abs(category.amount).toLocaleString()}
                    </span>
                  </div>
                  {category.type === "expense" && (
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${category.percentage}%` }}></div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.slice(0, 8).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-sm">{new Date(transaction.transaction_date).toLocaleDateString()}</TableCell>
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
                        className={`text-right font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"
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
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-6">
              <CreditCard className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <h3 className="font-medium">Record Payment</h3>
                <p className="text-sm text-muted-foreground">Add project payment received</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
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
              <DollarSign className="h-8 w-8 text-purple-500 mr-4" />
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
