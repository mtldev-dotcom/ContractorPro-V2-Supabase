"use client"

import { useState } from "react"
import { Search, Plus, Filter, Phone, Mail, MapPin, Star, Building, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AddClientModal } from "@/components/add-client-modal"
import { AddSupplierModal } from "@/components/add-supplier-modal"

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false)

  const clients = [
    {
      id: 1,
      type: "individual",
      firstName: "Sarah",
      lastName: "Johnson",
      companyName: null,
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      secondaryPhone: null,
      addressLine1: "123 Maple Street",
      addressLine2: null,
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      preferredContactMethod: "email",
      notes: "Prefers morning appointments. Has two dogs.",
      rating: 5,
      isActive: true,
      projectsCount: 2,
      totalSpent: 70000,
      lastProject: "Kitchen Renovation",
    },
    {
      id: 2,
      type: "individual",
      firstName: "Mike",
      lastName: "Chen",
      companyName: null,
      email: "mike.chen@email.com",
      phone: "(555) 234-5678",
      secondaryPhone: "(555) 234-5679",
      addressLine1: "456 Oak Avenue",
      addressLine2: "Apt 2B",
      city: "Springfield",
      state: "IL",
      zipCode: "62702",
      preferredContactMethod: "phone",
      notes: "Works from home, flexible scheduling.",
      rating: 4,
      isActive: true,
      projectsCount: 1,
      totalSpent: 25000,
      lastProject: "Bathroom Remodel",
    },
    {
      id: 3,
      type: "business",
      firstName: null,
      lastName: null,
      companyName: "Rodriguez Property Management",
      email: "lisa@rodriguezpm.com",
      phone: "(555) 345-6789",
      secondaryPhone: null,
      addressLine1: "789 Pine Street",
      addressLine2: "Suite 100",
      city: "Springfield",
      state: "IL",
      zipCode: "62703",
      preferredContactMethod: "email",
      notes: "Manages multiple rental properties. Bulk discount applied.",
      rating: 5,
      isActive: true,
      projectsCount: 5,
      totalSpent: 150000,
      lastProject: "Multi-Unit Renovation",
    },
    {
      id: 4,
      type: "individual",
      firstName: "Tom",
      lastName: "Wilson",
      companyName: null,
      email: "tom.wilson@email.com",
      phone: "(555) 456-7890",
      secondaryPhone: null,
      addressLine1: "321 Elm Drive",
      addressLine2: null,
      city: "Springfield",
      state: "IL",
      zipCode: "62704",
      preferredContactMethod: "text",
      notes: "Prefers text communication. Weekend availability.",
      rating: 4,
      isActive: true,
      projectsCount: 1,
      totalSpent: 15000,
      lastProject: "Deck Construction",
    },
    {
      id: 5,
      type: "individual",
      firstName: "Jennifer",
      lastName: "Davis",
      companyName: null,
      email: "jennifer.davis@email.com",
      phone: "(555) 567-8901",
      secondaryPhone: null,
      addressLine1: "654 Cedar Lane",
      addressLine2: null,
      city: "Springfield",
      state: "IL",
      zipCode: "62705",
      preferredContactMethod: "phone",
      notes: "Emergency contact available 24/7.",
      rating: 3,
      isActive: true,
      projectsCount: 1,
      totalSpent: 35000,
      lastProject: "Roof Replacement",
    },
  ]

  const suppliers = [
    {
      id: 1,
      name: "Home Depot Pro",
      contactPerson: "Mark Stevens",
      email: "mark.stevens@homedepot.com",
      phone: "(555) 111-2222",
      addressLine1: "1000 Industrial Blvd",
      addressLine2: null,
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      category: "materials",
      paymentTerms: "Net 30",
      accountNumber: "HD-12345",
      rating: 4,
      notes: "Bulk pricing available. Delivery service included.",
      isActive: true,
      totalOrders: 45,
      totalSpent: 125000,
      lastOrder: "2024-02-10",
    },
    {
      id: 2,
      name: "Johnson Electric Supply",
      contactPerson: "Robert Johnson",
      email: "rob@johnsonelectric.com",
      phone: "(555) 222-3333",
      addressLine1: "500 Electric Avenue",
      addressLine2: null,
      city: "Springfield",
      state: "IL",
      zipCode: "62702",
      category: "materials",
      paymentTerms: "Net 15",
      accountNumber: "JE-67890",
      rating: 5,
      notes: "Specialized in electrical supplies. Same-day delivery available.",
      isActive: true,
      totalOrders: 28,
      totalSpent: 85000,
      lastOrder: "2024-02-12",
    },
    {
      id: 3,
      name: "United Rentals",
      contactPerson: "Amanda Foster",
      email: "amanda@unitedrentals.com",
      phone: "(555) 333-4444",
      addressLine1: "750 Equipment Way",
      addressLine2: null,
      city: "Springfield",
      state: "IL",
      zipCode: "62703",
      category: "equipment",
      paymentTerms: "Due on Return",
      accountNumber: "UR-11111",
      rating: 4,
      notes: "Wide selection of construction equipment. Weekly rates available.",
      isActive: true,
      totalOrders: 67,
      totalSpent: 45000,
      lastOrder: "2024-02-14",
    },
    {
      id: 4,
      name: "Ferguson Plumbing",
      contactPerson: "David Martinez",
      email: "david@ferguson.com",
      phone: "(555) 444-5555",
      addressLine1: "200 Plumbing Plaza",
      addressLine2: null,
      city: "Springfield",
      state: "IL",
      zipCode: "62704",
      category: "materials",
      paymentTerms: "Net 30",
      accountNumber: "FP-22222",
      rating: 5,
      notes: "Premium plumbing fixtures and supplies. Trade discount applied.",
      isActive: true,
      totalOrders: 32,
      totalSpent: 65000,
      lastOrder: "2024-02-08",
    },
    {
      id: 5,
      name: "ABC Concrete Services",
      contactPerson: "Lisa Thompson",
      email: "lisa@abcconcrete.com",
      phone: "(555) 555-6666",
      addressLine1: "300 Concrete Court",
      addressLine2: null,
      city: "Springfield",
      state: "IL",
      zipCode: "62705",
      category: "services",
      paymentTerms: "COD",
      accountNumber: "ABC-33333",
      rating: 4,
      notes: "Concrete delivery and pumping services. Minimum order requirements.",
      isActive: true,
      totalOrders: 15,
      totalSpent: 35000,
      lastOrder: "2024-02-05",
    },
  ]

  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case "email":
        return Mail
      case "phone":
        return Phone
      case "text":
        return Phone
      default:
        return Mail
    }
  }

  const getContactMethodColor = (method: string) => {
    switch (method) {
      case "email":
        return "default"
      case "phone":
        return "secondary"
      case "text":
        return "outline"
      default:
        return "default"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "materials":
        return "default"
      case "equipment":
        return "secondary"
      case "services":
        return "outline"
      default:
        return "default"
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      (client.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase())) ??
      false,
  )

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Clients & Contacts</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search clients & suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4">
        <Tabs defaultValue="clients" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button onClick={() => setShowAddClientModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
              <Button variant="outline" onClick={() => setShowAddSupplierModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </div>
          </div>

          <TabsContent value="clients" className="space-y-6">
            {/* Client Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{clients.length}</div>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{clients.filter((c) => c.type === "individual").length}</div>
                  <p className="text-sm text-muted-foreground">Individual</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{clients.filter((c) => c.type === "business").length}</div>
                  <p className="text-sm text-muted-foreground">Business</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    ${clients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </CardContent>
              </Card>
            </div>

            {/* Client Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => {
                const ContactMethodIcon = getContactMethodIcon(client.preferredContactMethod)
                const displayName =
                  client.type === "business" ? client.companyName : `${client.firstName} ${client.lastName}`

                return (
                  <Card key={client.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {client.type === "business" ? (
                                <Building className="h-4 w-4" />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{displayName}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              {client.type === "business" ? (
                                <Building className="h-3 w-3" />
                              ) : (
                                <User className="h-3 w-3" />
                              )}
                              {client.type === "business" ? "Business" : "Individual"}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">{renderStars(client.rating)}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {client.city}, {client.state} {client.zipCode}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getContactMethodColor(client.preferredContactMethod)}
                          className="flex items-center gap-1"
                        >
                          <ContactMethodIcon className="h-3 w-3" />
                          {client.preferredContactMethod}
                        </Badge>
                        <Badge variant="outline">{client.projectsCount} projects</Badge>
                      </div>

                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span>Total Spent</span>
                          <span className="font-medium">${client.totalSpent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Last Project</span>
                          <span>{client.lastProject}</span>
                        </div>
                      </div>

                      {client.notes && (
                        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">{client.notes}</div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            {/* Supplier Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{suppliers.length}</div>
                  <p className="text-sm text-muted-foreground">Total Suppliers</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{suppliers.filter((s) => s.category === "materials").length}</div>
                  <p className="text-sm text-muted-foreground">Materials</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{suppliers.filter((s) => s.category === "equipment").length}</div>
                  <p className="text-sm text-muted-foreground">Equipment</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    ${suppliers.reduce((sum, s) => sum + s.totalSpent, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </CardContent>
              </Card>
            </div>

            {/* Supplier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            <Building className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{supplier.name}</CardTitle>
                          <CardDescription>{supplier.contactPerson}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">{renderStars(supplier.rating)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {supplier.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {supplier.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {supplier.city}, {supplier.state} {supplier.zipCode}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={getCategoryColor(supplier.category)}>{supplier.category}</Badge>
                      <Badge variant="outline">{supplier.totalOrders} orders</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Account #</span>
                        <span className="font-medium">{supplier.accountNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Payment Terms</span>
                        <span className="font-medium">{supplier.paymentTerms}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Total Spent</span>
                        <span className="font-medium">${supplier.totalSpent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Last Order</span>
                        <span>{new Date(supplier.lastOrder).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {supplier.notes && (
                      <div className="text-sm text-muted-foreground bg-muted p-2 rounded">{supplier.notes}</div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddClientModal open={showAddClientModal} onOpenChange={setShowAddClientModal} />
      <AddSupplierModal open={showAddSupplierModal} onOpenChange={setShowAddSupplierModal} />
    </div>
  )
}
