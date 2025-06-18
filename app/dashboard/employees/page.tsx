"use client"

import { useState } from "react"
import { Search, Plus, Filter, Phone, Mail, MapPin, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AddEmployeeModal } from "@/components/add-employee-modal"

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const employees = [
    {
      id: 1,
      name: "John Martinez",
      role: "Project Manager",
      email: "john.martinez@contractorpro.com",
      phone: "(555) 123-4567",
      hourlyRate: 35,
      hoursThisWeek: 42,
      status: "On Site",
      currentProject: "Maple Street Kitchen",
      skills: ["Project Management", "Electrical", "Plumbing"],
      startDate: "2022-03-15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sarah Thompson",
      role: "Lead Carpenter",
      email: "sarah.thompson@contractorpro.com",
      phone: "(555) 234-5678",
      hourlyRate: 28,
      hoursThisWeek: 40,
      status: "On Site",
      currentProject: "Pine Street Addition",
      skills: ["Carpentry", "Framing", "Finish Work"],
      startDate: "2021-08-22",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      role: "Electrician",
      email: "mike.rodriguez@contractorpro.com",
      phone: "(555) 345-6789",
      hourlyRate: 32,
      hoursThisWeek: 38,
      status: "Available",
      currentProject: null,
      skills: ["Electrical", "Wiring", "Panel Installation"],
      startDate: "2023-01-10",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Lisa Chen",
      role: "Plumber",
      email: "lisa.chen@contractorpro.com",
      phone: "(555) 456-7890",
      hourlyRate: 30,
      hoursThisWeek: 44,
      status: "On Site",
      currentProject: "Oak Avenue Bathroom",
      skills: ["Plumbing", "Pipe Installation", "Fixture Installation"],
      startDate: "2022-11-05",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "David Wilson",
      role: "General Laborer",
      email: "david.wilson@contractorpro.com",
      phone: "(555) 567-8901",
      hourlyRate: 22,
      hoursThisWeek: 40,
      status: "On Site",
      currentProject: "Elm Drive Deck",
      skills: ["General Labor", "Demolition", "Site Cleanup"],
      startDate: "2023-06-12",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Jennifer Adams",
      role: "Painter",
      email: "jennifer.adams@contractorpro.com",
      phone: "(555) 678-9012",
      hourlyRate: 25,
      hoursThisWeek: 36,
      status: "Off Today",
      currentProject: "Maple Street Kitchen",
      skills: ["Interior Painting", "Exterior Painting", "Drywall"],
      startDate: "2022-09-18",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      name: "Robert Kim",
      role: "Tile Installer",
      email: "robert.kim@contractorpro.com",
      phone: "(555) 789-0123",
      hourlyRate: 27,
      hoursThisWeek: 32,
      status: "Available",
      currentProject: null,
      skills: ["Tile Installation", "Flooring", "Backsplash"],
      startDate: "2023-02-28",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 8,
      name: "Amanda Foster",
      role: "HVAC Technician",
      email: "amanda.foster@contractorpro.com",
      phone: "(555) 890-1234",
      hourlyRate: 33,
      hoursThisWeek: 41,
      status: "On Site",
      currentProject: "Pine Street Addition",
      skills: ["HVAC", "Ductwork", "System Installation"],
      startDate: "2021-12-03",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Site":
        return "default"
      case "Available":
        return "secondary"
      case "Off Today":
        return "outline"
      default:
        return "default"
    }
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPayroll = employees.reduce((sum, emp) => sum + emp.hourlyRate * emp.hoursThisWeek, 0)
  const onSiteCount = employees.filter((emp) => emp.status === "On Site").length
  const availableCount = employees.filter((emp) => emp.status === "Available").length

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Employees</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search employees..."
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
            Add Employee
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Employee Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{employees.length}</div>
              <p className="text-sm text-muted-foreground">Total Employees</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{onSiteCount}</div>
              <p className="text-sm text-muted-foreground">On Site Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{availableCount}</div>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">${totalPayroll.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Weekly Payroll</p>
            </CardContent>
          </Card>
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                      <AvatarFallback>
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <CardDescription>{employee.role}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(employee.status)}>{employee.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {employee.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {employee.phone}
                  </div>
                  {employee.currentProject && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {employee.currentProject}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      Hourly Rate
                    </div>
                    <div className="font-medium">${employee.hourlyRate}/hr</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      This Week
                    </div>
                    <div className="font-medium">{employee.hoursThisWeek}h</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {employee.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Weekly Pay</span>
                    <span className="font-medium">
                      ${(employee.hourlyRate * employee.hoursThisWeek).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Started</span>
                    <span>{new Date(employee.startDate).toLocaleDateString()}</span>
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
          ))}
        </div>
      </div>

      <AddEmployeeModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  )
}
