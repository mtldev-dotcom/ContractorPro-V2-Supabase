"use client"

import { useState } from "react"
import { Search, Plus, Filter, TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddTransactionModal } from "@/components/add-transaction-modal"

export default function Finances() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const transactions = [
    {
      id: 1,
      date: "2024-02-15",
      description: "Kitchen Renovation - Progress Payment",
      project: "Maple Street Kitchen",
      category: "Project Payment",
      amount: 15000,
      type: "income",
    },
    {
      id: 2,
      description: "Lumber Supply - Home Depot",
      project: "Oak Avenue Bathroom",
      category: "Materials",
      amount: -2500,
      type: "expense",
      date: "2024-02-14",
    },
    {
      id: 3,
      description: "Electrical Work - Johnson Electric",
      project: "Pine Street Addition",
      category: "Subcontractor",
      amount: -3200,
      type: "expense",
      date: "2024-02-13",
    },
    {
      id: 4,
      description: "Bathroom Remodel - Final Payment",
      project: "Oak Avenue Bathroom",
      category: "Project Payment",
      amount: 8500,
      type: "income",
      date: "2024-02-12",
    },
    {
      id: 5,
      description: "Tool Rental - United Rentals",
      project: "Pine Street Addition",
      category: "Equipment",
      amount: -450,
      type: "expense",
      date: "2024-02-11",
    },
    {
      id: 6,
      description: "Plumbing Supplies - Ferguson",
      project: "Maple Street Kitchen",
      category: "Materials",
      amount: -1200,
      type: "expense",
      date: "2024-02-10",
    },
    {
      id: 7,
      description: "Deck Construction - Initial Payment",
      project: "Elm Drive Deck",
      category: "Project Payment",
      amount: 5000,
      type: "income",
      date: "2024-02-09",
    },
    {
      id: 8,
      description: "Insurance Premium - General Liability",
      project: "General",
      category: "Insurance",
      amount: -850,
      type: "expense",
      date: "2024-02-08",
    },
  ]

  const monthlyStats = {
    totalIncome: 28500,
    totalExpenses: 8200,
    netProfit: 20300,
    previousMonth: {
      totalIncome: 24000,
      totalExpenses: 9500,
      netProfit: 14500,
    },
  }

  const categories = [
    { name: "Project Payments", amount: 28500, type: "income", percentage: 100 },
    { name: "Materials", amount: -3700, type: "expense", percentage: 45 },
    { name: "Subcontractors", amount: -3200, type: "expense", percentage: 39 },
    { name: "Equipment", amount: -450, type: "expense", percentage: 5 },
    { name: "Insurance", amount: -850, type: "expense", percentage: 10 },
  ]

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.project.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Finances</h1>
          <p className="text-sm text-red-500 font-bold italic">A Reminder to developers: this page is a work in progress. The data is not yet connected to the projects table.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                      <TableCell className="text-sm">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{transaction.project}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"
                          }`}
                      >
                        {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
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

      <AddTransactionModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  )
}
