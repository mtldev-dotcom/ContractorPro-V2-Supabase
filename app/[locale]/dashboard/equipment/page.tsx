"use client"

import { useState } from "react"
import { Search, Plus, Filter, Wrench, Calendar, MapPin, User, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AddEquipmentModal } from "@/components/add-equipment-modal"

export default function Equipment() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const equipment = [
    {
      id: 1,
      name: "Dewalt Circular Saw",
      category: "tools",
      make: "Dewalt",
      model: "DWE575SB",
      serialNumber: "DW123456789",
      purchaseDate: "2023-01-15",
      purchasePrice: 199.99,
      currentValue: 150.0,
      lastMaintenanceDate: "2024-01-15",
      nextMaintenanceDate: "2024-04-15",
      assignedTo: "Sarah Thompson",
      currentProject: "Kitchen Renovation",
      status: "in_use",
      condition: "good",
      location: "Job Site - Maple Street",
    },
    {
      id: 2,
      name: "Ford F-150 Work Truck",
      category: "vehicles",
      make: "Ford",
      model: "F-150",
      serialNumber: "VIN123456789",
      purchaseDate: "2022-06-01",
      purchasePrice: 35000.0,
      currentValue: 28000.0,
      lastMaintenanceDate: "2024-02-01",
      nextMaintenanceDate: "2024-05-01",
      assignedTo: "John Martinez",
      currentProject: null,
      status: "available",
      condition: "excellent",
      location: "Main Office",
    },
    {
      id: 3,
      name: "Skid Steer Loader",
      category: "machinery",
      make: "Bobcat",
      model: "S650",
      serialNumber: "BOB987654321",
      purchaseDate: "2021-03-20",
      purchasePrice: 45000.0,
      currentValue: 35000.0,
      lastMaintenanceDate: "2024-01-10",
      nextMaintenanceDate: "2024-02-20",
      assignedTo: null,
      currentProject: null,
      status: "maintenance",
      condition: "good",
      location: "Equipment Yard",
    },
    {
      id: 4,
      name: "Makita Drill Set",
      category: "tools",
      make: "Makita",
      model: "XPH12Z",
      serialNumber: "MAK456789123",
      purchaseDate: "2023-06-10",
      purchasePrice: 299.99,
      currentValue: 220.0,
      lastMaintenanceDate: "2024-01-20",
      nextMaintenanceDate: "2024-07-20",
      assignedTo: "Mike Rodriguez",
      currentProject: "Bathroom Remodel",
      status: "in_use",
      condition: "excellent",
      location: "Job Site - Oak Avenue",
    },
    {
      id: 5,
      name: "Generator - 5000W",
      category: "machinery",
      make: "Honda",
      model: "EU5000iS",
      serialNumber: "HON789123456",
      purchaseDate: "2022-09-15",
      purchasePrice: 2800.0,
      currentValue: 2200.0,
      lastMaintenanceDate: "2023-12-15",
      nextMaintenanceDate: "2024-03-15",
      assignedTo: null,
      currentProject: null,
      status: "available",
      condition: "good",
      location: "Equipment Yard",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "secondary"
      case "in_use":
        return "default"
      case "maintenance":
        return "destructive"
      case "retired":
        return "outline"
      default:
        return "outline"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "default"
      case "good":
        return "secondary"
      case "fair":
        return "outline"
      case "poor":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tools":
        return Wrench
      case "vehicles":
        return "🚛"
      case "machinery":
        return "🏗️"
      default:
        return Wrench
    }
  }

  const filteredEquipment = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalValue = equipment.reduce((sum, item) => sum + item.currentValue, 0)
  const availableCount = equipment.filter((item) => item.status === "available").length
  const inUseCount = equipment.filter((item) => item.status === "in_use").length
  const maintenanceCount = equipment.filter((item) => item.status === "maintenance").length

  const isMaintenanceDue = (nextMaintenanceDate: string) => {
    const today = new Date()
    const maintenanceDate = new Date(nextMaintenanceDate)
    const daysUntilMaintenance = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilMaintenance <= 7
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Equipment Management</h1>
          <p className="text-sm text-red-500 font-bold italic">A Reminder to developers: this page is a work in progress. The data is not yet connected to the projects table.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search equipment..."
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
            Add Equipment
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Equipment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{availableCount}</div>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{inUseCount}</div>
              <p className="text-sm text-muted-foreground">In Use</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{maintenanceCount}</div>
              <p className="text-sm text-muted-foreground">Maintenance</p>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => {
            const CategoryIcon = getCategoryIcon(item.category)
            const needsMaintenance = isMaintenanceDue(item.nextMaintenanceDate)

            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        {typeof CategoryIcon === "string" ? (
                          <span className="text-2xl">{CategoryIcon}</span>
                        ) : (
                          <CategoryIcon className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>
                          {item.make} {item.model}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                      {needsMaintenance && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Maintenance Due
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Serial Number:</span>
                      <span className="font-medium">{item.serialNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Condition:</span>
                      <Badge variant={getConditionColor(item.condition)}>{item.condition}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Current Value:</span>
                      <span className="font-medium">${item.currentValue.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                    {item.assignedTo && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        Assigned to: {item.assignedTo}
                      </div>
                    )}
                    {item.currentProject && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Project: {item.currentProject}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Last Maintenance:</span>
                      <span>{new Date(item.lastMaintenanceDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Next Maintenance:</span>
                      <span className={needsMaintenance ? "text-red-600 font-medium" : ""}>
                        {new Date(item.nextMaintenanceDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

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
      </div>

      <AddEquipmentModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  )
}
