"use client"

import { useState } from "react"
import { Search, Plus, Filter, Package, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { AddMaterialModal } from "@/components/add-material-modal"

export default function Materials() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const materials = [
    {
      id: 1,
      name: "2x4 Lumber - 8ft",
      category: "lumber",
      unit: "each",
      currentStock: 150.0,
      minimumStock: 50.0,
      unitCost: 4.5,
      supplierName: "Home Depot Pro",
      sku: "LUM-2X4-8",
      location: "Lumber Yard",
      lastRestocked: "2024-02-10",
      isActive: true,
    },
    {
      id: 2,
      name: "Drywall Sheets 4x8",
      category: "drywall",
      unit: "each",
      currentStock: 25.0,
      minimumStock: 25.0,
      unitCost: 12.0,
      supplierName: "Ferguson Plumbing",
      sku: "DRY-4X8",
      location: "Material Storage",
      lastRestocked: "2024-02-05",
      isActive: true,
    },
    {
      id: 3,
      name: "Concrete Mix 80lb",
      category: "concrete",
      unit: "bags",
      currentStock: 200.0,
      minimumStock: 50.0,
      unitCost: 5.25,
      supplierName: "ABC Concrete Services",
      sku: "CON-80LB",
      location: "Material Storage",
      lastRestocked: "2024-02-12",
      isActive: true,
    },
    {
      id: 4,
      name: "Electrical Wire 12AWG",
      category: "electrical",
      unit: "feet",
      currentStock: 500.0,
      minimumStock: 100.0,
      unitCost: 0.85,
      supplierName: "Johnson Electric Supply",
      sku: "ELEC-12AWG",
      location: "Electrical Storage",
      lastRestocked: "2024-02-08",
      isActive: true,
    },
    {
      id: 5,
      name: "PVC Pipe 3/4 inch",
      category: "plumbing",
      unit: "feet",
      currentStock: 15.0,
      minimumStock: 50.0,
      unitCost: 1.25,
      supplierName: "Ferguson Plumbing",
      sku: "PVC-34",
      location: "Plumbing Storage",
      lastRestocked: "2024-01-28",
      isActive: true,
    },
    {
      id: 6,
      name: "Ceramic Tiles 12x12",
      category: "flooring",
      unit: "sq ft",
      currentStock: 300.0,
      minimumStock: 100.0,
      unitCost: 3.75,
      supplierName: "Tile World",
      sku: "TILE-12X12",
      location: "Tile Storage",
      lastRestocked: "2024-02-14",
      isActive: true,
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "lumber":
        return "default"
      case "electrical":
        return "secondary"
      case "plumbing":
        return "outline"
      case "concrete":
        return "destructive"
      case "drywall":
        return "secondary"
      case "flooring":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStockStatus = (current: number, minimum: number) => {
    const percentage = (current / minimum) * 100
    if (percentage <= 100) return "critical"
    if (percentage <= 150) return "low"
    return "good"
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive"
      case "low":
        return "outline"
      case "good":
        return "secondary"
      default:
        return "outline"
    }
  }

  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalValue = materials.reduce((sum, material) => sum + material.currentStock * material.unitCost, 0)
  const lowStockCount = materials.filter((m) => getStockStatus(m.currentStock, m.minimumStock) !== "good").length
  const totalItems = materials.length
  const activeItems = materials.filter((m) => m.isActive).length

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Materials & Inventory</h1>
          <p className="text-sm text-red-500 font-bold italic">A Reminder to developers: this page is a work in progress. The data is not yet connected to the projects table.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search materials..."
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
            Add Material
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Inventory Value</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{activeItems}</div>
              <p className="text-sm text-muted-foreground">Active Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
              <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Materials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => {
            const stockStatus = getStockStatus(material.currentStock, material.minimumStock)
            const stockPercentage = Math.min((material.currentStock / material.minimumStock) * 100, 200)

            return (
              <Card key={material.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{material.name}</CardTitle>
                        <CardDescription>SKU: {material.sku}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={getCategoryColor(material.category)}>{material.category}</Badge>
                      {stockStatus !== "good" && (
                        <Badge variant={getStockStatusColor(stockStatus)} className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {stockStatus === "critical" ? "Critical" : "Low Stock"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Stock:</span>
                      <span className="font-medium">
                        {material.currentStock} {material.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Minimum Stock:</span>
                      <span className="font-medium">
                        {material.minimumStock} {material.unit}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Stock Level</span>
                        <span>{Math.round(stockPercentage)}%</span>
                      </div>
                      <Progress
                        value={Math.min(stockPercentage, 100)}
                        className={`h-2 ${stockStatus === "critical"
                            ? "[&>div]:bg-red-500"
                            : stockStatus === "low"
                              ? "[&>div]:bg-yellow-500"
                              : "[&>div]:bg-green-500"
                          }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Unit Cost:</span>
                      <span className="font-medium">${material.unitCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Value:</span>
                      <span className="font-medium">
                        ${(material.currentStock * material.unitCost).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Supplier:</span>
                      <span className="font-medium">{material.supplierName}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Location:</span>
                      <span>{material.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Restocked:</span>
                      <span>{new Date(material.lastRestocked).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      Restock
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-6">
              <TrendingDown className="h-8 w-8 text-red-500 mr-4" />
              <div>
                <h3 className="font-medium">Low Stock Report</h3>
                <p className="text-sm text-muted-foreground">View items needing restock</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-6">
              <Package className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <h3 className="font-medium">Inventory Report</h3>
                <p className="text-sm text-muted-foreground">Generate inventory summary</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-6">
              <TrendingUp className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <h3 className="font-medium">Usage Analytics</h3>
                <p className="text-sm text-muted-foreground">View material usage trends</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddMaterialModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  )
}
