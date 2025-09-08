"use client"

import { useState } from "react"
import { useTranslations } from 'next-intl'
import { Search, Plus, Filter, Phone, Mail, MapPin, Star, Building, User, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AddClientModal } from "@/components/add-client-modal"
import { AddSupplierModal } from "@/components/add-supplier-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useClients } from "@/hooks/use-clients"
import { CLIENT_TYPES, type ClientType, getClientDisplayName } from "@/lib/clients"
import { createClient } from "@/utils/supabase/client"
import { EditClientModal } from "@/components/edit-client-modal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function Clients() {
  const { toast } = useToast()
  const t = useTranslations('clients')
  const tSuppliers = useTranslations('suppliers')
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false)
  const [showEditClientModal, setShowEditClientModal] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const { clients, isLoading, error, total, page, pageSize, setSearch, setType, setIsActive, setPage, refresh } = useClients({
    pageSize: 12,
    type: 'all',
    isActive: 'all',
  })

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEditClick = (clientId: string) => {
    setSelectedClientId(clientId)
    setShowEditClientModal(true)
  }

  const handleArchiveClick = async (clientId: string, displayName: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('clients').update({ is_active: false }).eq('id', clientId)
      if (error) throw error
      toast({ title: t('clientArchived'), description: t('clientArchivedDesc', { clientName: displayName }) })
      refresh()
    } catch (err: any) {
      toast({ title: t('error'), description: err.message || 'Failed to archive client.', variant: 'destructive' })
    }
  }

  const handleDeletePrompt = (clientId: string, displayName: string) => {
    setDeleteTarget({ id: clientId, name: displayName })
    setDeleteDialogOpen(true)
  }

  const confirmDeleteClient = async () => {
    if (!deleteTarget) return
    try {
      setIsDeleting(true)
      const res = await fetch('/api/clients/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: deleteTarget.id }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data?.error || 'Failed to delete client')
      }
      toast({ title: t('clientDeleted'), description: t('clientDeletedDesc', { clientName: deleteTarget.name }) })
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      refresh()
    } catch (err: any) {
      toast({ title: t('deleteFailed'), description: err.message || t('deleteFailedDesc'), variant: 'destructive' })
    } finally {
      setIsDeleting(false)
    }
  }

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

  const filteredClients = clients

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
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm text-red-500 font-bold italic">{t('devReminder')}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearch(e.target.value); setPage(1) }}
              className="pl-10 w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select onValueChange={(value) => { setType(value as any); setPage(1) }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t('allTypes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allTypes')}</SelectItem>
                {CLIENT_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{t(type)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => { const v = value; setIsActive(v === 'all' ? 'all' : v === 'true'); setPage(1) }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t('allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="true">{t('active')}</SelectItem>
                <SelectItem value="false">{t('archived')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4">
        <Tabs defaultValue="clients" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="clients">{t('clients')}</TabsTrigger>
              <TabsTrigger value="suppliers">{tSuppliers('title')}</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button onClick={() => setShowAddClientModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('addClient')}
              </Button>
              <Button variant="outline" onClick={() => setShowAddSupplierModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {tSuppliers('addSupplier')}
              </Button>
            </div>
          </div>

          <TabsContent value="clients" className="space-y-6">
            {/* Client Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{clients.length}</div>
                  <p className="text-sm text-muted-foreground">{t('totalClients')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{clients.filter((c) => c.type === "individual").length}</div>
                  <p className="text-sm text-muted-foreground">{t('individual')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{clients.filter((c) => c.type === "business").length}</div>
                  <p className="text-sm text-muted-foreground">{t('business')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">$0</div>
                  <p className="text-sm text-muted-foreground">{t('totalRevenue')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Client Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client: any) => {
                const ContactMethodIcon = getContactMethodIcon(client.preferred_contact_method || client.preferredContactMethod)
                const displayName = client.type === 'business' ? (client.company_name ?? client.companyName) : `${client.first_name ?? client.firstName ?? ''} ${client.last_name ?? client.lastName ?? ''}`.trim()

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
                              {client.type === "business" ? t('business') : t('individual')}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">{renderStars(Number(client.rating ?? 0))}</div>
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
                          {(client.city)}{client.state ? `, ${client.state}` : ''} {client.zip_code ?? client.zipCode}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getContactMethodColor(client.preferred_contact_method || client.preferredContactMethod)}
                          className="flex items-center gap-1"
                        >
                          <ContactMethodIcon className="h-3 w-3" />
                          {client.preferred_contact_method || client.preferredContactMethod}
                        </Badge>
                        <Badge variant="outline">{client.projectsCount} {t('projects')}</Badge>
                      </div>

                      {/* Aggregate values can be added via server joins later */}

                      {client.notes && (
                        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">{client.notes}</div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          {t('viewDetails')}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditClick(client.id)}>
                          {t('edit')}
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
                  <p className="text-sm text-muted-foreground">{tSuppliers('totalSuppliers')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{suppliers.filter((s) => s.category === "materials").length}</div>
                  <p className="text-sm text-muted-foreground">{tSuppliers('materials')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{suppliers.filter((s) => s.category === "equipment").length}</div>
                  <p className="text-sm text-muted-foreground">{tSuppliers('equipment')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    ${suppliers.reduce((sum, s) => sum + s.totalSpent, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">{tSuppliers('totalSpent')}</p>
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
                      <Badge variant="outline">{supplier.totalOrders} {tSuppliers('orders')}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{tSuppliers('accountNumber')}</span>
                        <span className="font-medium">{supplier.accountNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{tSuppliers('paymentTerms')}</span>
                        <span className="font-medium">{supplier.paymentTerms}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>{tSuppliers('totalSpent')}</span>
                        <span className="font-medium">${supplier.totalSpent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{tSuppliers('lastOrder')}</span>
                        <span>{new Date(supplier.lastOrder).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {supplier.notes && (
                      <div className="text-sm text-muted-foreground bg-muted p-2 rounded">{supplier.notes}</div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        {t('viewDetails')}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        {t('edit')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddClientModal open={showAddClientModal} onOpenChange={setShowAddClientModal} onSuccess={() => refresh()} />
      <AddSupplierModal open={showAddSupplierModal} onOpenChange={setShowAddSupplierModal} />
      {selectedClientId && (
        <EditClientModal open={showEditClientModal} onOpenChange={setShowEditClientModal} clientId={selectedClientId} onSuccess={() => refresh()} />
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteClientPermanently')}</DialogTitle>
            <DialogDescription>
              {t('deleteClientWarning1')}
              {deleteTarget ? ` "${deleteTarget.name}" ` : ' '}{t('deleteClientWarning2')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>{t('cancel')}</Button>
            <Button variant="destructive" onClick={confirmDeleteClient} disabled={isDeleting}>{isDeleting ? t('deleting') : t('deletePermanently')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
