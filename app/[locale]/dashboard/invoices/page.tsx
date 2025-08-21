"use client"

import { useState } from "react"
import { Search, Plus, Filter, Eye, Edit, Send, DollarSign, Calendar, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateInvoiceModal } from "@/components/create-invoice-modal"
import { InvoiceDetailsModal } from "@/components/invoice-details-modal"

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const invoices = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      clientName: "Sarah Johnson",
      projectName: "Kitchen Renovation",
      status: "sent",
      subtotal: 15000.0,
      taxRate: 0.0875,
      taxAmount: 1312.5,
      discountAmount: 0.0,
      totalAmount: 16312.5,
      paidAmount: 0.0,
      issueDate: "2024-02-15",
      dueDate: "2024-03-15",
      paidDate: null,
      paymentTerms: "Net 30",
      notes: "Progress payment for kitchen renovation project",
      lineItems: [
        {
          id: 1,
          description: "Kitchen cabinet installation",
          quantity: 1,
          unitPrice: 8000.0,
          lineTotal: 8000.0,
        },
        {
          id: 2,
          description: "Countertop installation - Granite",
          quantity: 25,
          unitPrice: 120.0,
          lineTotal: 3000.0,
        },
        {
          id: 3,
          description: "Plumbing rough-in work",
          quantity: 8,
          unitPrice: 125.0,
          lineTotal: 1000.0,
        },
        {
          id: 4,
          description: "Electrical work - outlets and lighting",
          quantity: 12,
          unitPrice: 250.0,
          lineTotal: 3000.0,
        },
      ],
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      clientName: "Mike Chen",
      projectName: "Bathroom Remodel",
      status: "paid",
      subtotal: 8500.0,
      taxRate: 0.0875,
      taxAmount: 743.75,
      discountAmount: 200.0,
      totalAmount: 9043.75,
      paidAmount: 9043.75,
      issueDate: "2024-02-10",
      dueDate: "2024-03-10",
      paidDate: "2024-02-28",
      paymentTerms: "Net 30",
      notes: "Final payment for bathroom renovation. Early payment discount applied.",
      lineItems: [
        {
          id: 1,
          description: "Bathroom tile installation",
          quantity: 1,
          unitPrice: 4500.0,
          lineTotal: 4500.0,
        },
        {
          id: 2,
          description: "Vanity and sink installation",
          quantity: 1,
          unitPrice: 2000.0,
          lineTotal: 2000.0,
        },
        {
          id: 3,
          description: "Shower fixture installation",
          quantity: 1,
          unitPrice: 2000.0,
          lineTotal: 2000.0,
        },
      ],
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      clientName: "Rodriguez Property Management",
      projectName: "Multi-Unit Renovation",
      status: "overdue",
      subtotal: 25000.0,
      taxRate: 0.0875,
      taxAmount: 2187.5,
      discountAmount: 1000.0,
      totalAmount: 26187.5,
      paidAmount: 0.0,
      issueDate: "2024-01-15",
      dueDate: "2024-02-14",
      paidDate: null,
      paymentTerms: "Net 30",
      notes: "Bulk renovation work for rental units. Volume discount applied.",
      lineItems: [
        {
          id: 1,
          description: "Flooring installation - 3 units",
          quantity: 3,
          unitPrice: 5000.0,
          lineTotal: 15000.0,
        },
        {
          id: 2,
          description: "Kitchen updates - 2 units",
          quantity: 2,
          unitPrice: 3000.0,
          lineTotal: 6000.0,
        },
        {
          id: 3,
          description: "Bathroom updates - 2 units",
          quantity: 2,
          unitPrice: 2000.0,
          lineTotal: 4000.0,
        },
      ],
    },
    {
      id: 4,
      invoiceNumber: "INV-2024-004",
      clientName: "Tom Wilson",
      projectName: "Deck Construction",
      status: "draft",
      subtotal: 5000.0,
      taxRate: 0.0875,
      taxAmount: 437.5,
      discountAmount: 0.0,
      totalAmount: 5437.5,
      paidAmount: 0.0,
      issueDate: "2024-02-20",
      dueDate: "2024-03-20",
      paidDate: null,
      paymentTerms: "Net 30",
      notes: "Initial payment for deck construction project",
      lineItems: [
        {
          id: 1,
          description: "Deck framing and foundation",
          quantity: 1,
          unitPrice: 2500.0,
          lineTotal: 2500.0,
        },
        {
          id: 2,
          description: "Composite decking materials",
          quantity: 500,
          unitPrice: 4.0,
          lineTotal: 2000.0,
        },
        {
          id: 3,
          description: "Railing installation",
          quantity: 1,
          unitPrice: 500.0,
          lineTotal: 500.0,
        },
      ],
    },
    {
      id: 5,
      invoiceNumber: "INV-2024-005",
      clientName: "Jennifer Davis",
      projectName: "Roof Replacement",
      status: "sent",
      subtotal: 12000.0,
      taxRate: 0.0875,
      taxAmount: 1050.0,
      discountAmount: 0.0,
      totalAmount: 13050.0,
      paidAmount: 6525.0,
      issueDate: "2024-02-12",
      dueDate: "2024-03-12",
      paidDate: null,
      paymentTerms: "Net 30",
      notes: "50% deposit received. Balance due upon completion.",
      lineItems: [
        {
          id: 1,
          description: "Roof tear-off and disposal",
          quantity: 1,
          unitPrice: 2000.0,
          lineTotal: 2000.0,
        },
        {
          id: 2,
          description: "Architectural shingles installation",
          quantity: 25,
          unitPrice: 300.0,
          lineTotal: 7500.0,
        },
        {
          id: 3,
          description: "Gutters and downspouts",
          quantity: 1,
          unitPrice: 2500.0,
          lineTotal: 2500.0,
        },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "sent":
        return "secondary"
      case "draft":
        return "outline"
      case "overdue":
        return "destructive"
      case "cancelled":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return DollarSign
      case "sent":
        return Send
      case "draft":
        return FileText
      case "overdue":
        return AlertCircle
      case "cancelled":
        return AlertCircle
      default:
        return FileText
    }
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.projectName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
  const totalOutstanding = totalInvoiced - totalPaid
  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue").length

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setShowDetailsModal(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-red-500 font-bold italic">A Reminder to developers: this page is a work in progress. The data is not yet connected to the projects table.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Invoice Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">${totalInvoiced.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Invoiced</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">${totalOutstanding.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Outstanding</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{overdueInvoices}</div>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>Manage and track your project invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => {
                  const StatusIcon = getStatusIcon(invoice.status)
                  const balance = invoice.totalAmount - invoice.paidAmount
                  const isOverdue = invoice.status === "overdue"

                  return (
                    <TableRow key={invoice.id} className={isOverdue ? "bg-red-50/50" : ""}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{invoice.projectName}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(invoice.status)} className="flex items-center gap-1 w-fit">
                          <StatusIcon className="h-3 w-3" />
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell className={isOverdue ? "text-red-600 font-medium" : ""}>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                        {isOverdue && <span className="ml-1">(Overdue)</span>}
                      </TableCell>
                      <TableCell className="text-right font-medium">${invoice.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">
                        ${invoice.paidAmount.toLocaleString()}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${balance > 0 ? "text-orange-600" : "text-green-600"}`}
                      >
                        ${balance.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <span className="sr-only">Open menu</span>
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Send Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <DollarSign className="h-4 w-4 mr-2" />
                              Record Payment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowCreateModal(true)}>
            <CardContent className="flex items-center p-6">
              <Plus className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <h3 className="font-medium">Create New Invoice</h3>
                <p className="text-sm text-muted-foreground">Generate invoice for project</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-6">
              <Send className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <h3 className="font-medium">Send Reminders</h3>
                <p className="text-sm text-muted-foreground">Send payment reminders</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-6">
              <Calendar className="h-8 w-8 text-purple-500 mr-4" />
              <div>
                <h3 className="font-medium">Payment Schedule</h3>
                <p className="text-sm text-muted-foreground">View upcoming payments</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateInvoiceModal open={showCreateModal} onOpenChange={setShowCreateModal} />
      <InvoiceDetailsModal open={showDetailsModal} onOpenChange={setShowDetailsModal} invoice={selectedInvoice} />
    </div>
  )
}
