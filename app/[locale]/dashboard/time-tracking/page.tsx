"use client"

import { useState } from "react"
import { Search, Plus, Filter, Clock, Play, Pause, Square, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function TimeTracking() {
  const [searchQuery, setSearchQuery] = useState("")

  const activeTimeEntries = [
    {
      id: 1,
      employeeName: "John Martinez",
      projectName: "Kitchen Renovation",
      clockIn: "2024-02-15T08:00:00",
      currentHours: 6.5,
      hourlyRate: 35.0,
      location: "123 Maple Street",
      status: "active",
    },
    {
      id: 2,
      employeeName: "Sarah Thompson",
      projectName: "Bathroom Remodel",
      clockIn: "2024-02-15T07:30:00",
      currentHours: 7.0,
      hourlyRate: 28.0,
      location: "456 Oak Avenue",
      status: "active",
    },
  ]

  const recentTimeEntries = [
    {
      id: 3,
      employeeName: "Mike Rodriguez",
      projectName: "Pine Street Addition",
      clockIn: "2024-02-14T08:00:00",
      clockOut: "2024-02-14T17:00:00",
      totalHours: 8.0,
      overtimeHours: 0.0,
      hourlyRate: 32.0,
      status: "completed",
      location: "789 Pine Street",
    },
    {
      id: 4,
      employeeName: "Lisa Chen",
      projectName: "Oak Avenue Bathroom",
      clockIn: "2024-02-14T08:30:00",
      clockOut: "2024-02-14T17:30:00",
      totalHours: 8.0,
      overtimeHours: 0.0,
      hourlyRate: 30.0,
      status: "completed",
      location: "456 Oak Avenue",
    },
    {
      id: 5,
      employeeName: "David Wilson",
      projectName: "Elm Drive Deck",
      clockIn: "2024-02-14T07:00:00",
      clockOut: "2024-02-14T18:00:00",
      totalHours: 10.0,
      overtimeHours: 2.0,
      hourlyRate: 22.0,
      status: "completed",
      location: "321 Elm Drive",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "approved":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    return `${wholeHours}h ${minutes}m`
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const totalActiveHours = activeTimeEntries.reduce((sum, entry) => sum + entry.currentHours, 0)
  const totalActiveEmployees = activeTimeEntries.length
  const totalDailyHours = recentTimeEntries.reduce((sum, entry) => sum + entry.totalHours, 0)
  const totalOvertimeHours = recentTimeEntries.reduce((sum, entry) => sum + entry.overtimeHours, 0)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Time Tracking</h1>
          <p className="text-sm text-red-500 font-bold italic">A Reminder to developers: this page is a work in progress. The data is not yet connected to the projects table.</p>
          <div className="text-sm text-muted-foreground">Current Time: {getCurrentTime()}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search time entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Manual Entry
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Time Tracking Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalActiveEmployees}</div>
              <p className="text-sm text-muted-foreground">Active Employees</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{formatDuration(totalActiveHours)}</div>
              <p className="text-sm text-muted-foreground">Active Hours Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{formatDuration(totalDailyHours)}</div>
              <p className="text-sm text-muted-foreground">Total Hours Yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{formatDuration(totalOvertimeHours)}</div>
              <p className="text-sm text-muted-foreground">Overtime Yesterday</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Time Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Currently Active
            </CardTitle>
            <CardDescription>Employees currently clocked in</CardDescription>
          </CardHeader>
          <CardContent>
            {activeTimeEntries.length > 0 ? (
              <div className="space-y-4">
                {activeTimeEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {entry.employeeName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{entry.employeeName}</div>
                        <div className="text-sm text-muted-foreground">{entry.projectName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{formatDuration(entry.currentHours)}</div>
                        <div className="text-sm text-muted-foreground">
                          Since {new Date(entry.clockIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {entry.location}
                      </div>
                      <Badge variant={getStatusColor(entry.status)} className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Active
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Pause className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Square className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No employees currently clocked in</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Time Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Time Entries</CardTitle>
            <CardDescription>Completed time entries from the last few days</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Regular Hours</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="text-right">Total Pay</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTimeEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.employeeName}</TableCell>
                    <TableCell>{entry.projectName}</TableCell>
                    <TableCell>{new Date(entry.clockIn).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {new Date(entry.clockIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                    <TableCell>
                      {new Date(entry.clockOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                    <TableCell>{formatDuration(entry.totalHours - entry.overtimeHours)}</TableCell>
                    <TableCell className={entry.overtimeHours > 0 ? "text-orange-600 font-medium" : ""}>
                      {entry.overtimeHours > 0 ? formatDuration(entry.overtimeHours) : "-"}
                    </TableCell>
                    <TableCell>${entry.hourlyRate.toFixed(2)}/hr</TableCell>
                    <TableCell className="text-right font-medium">
                      $
                      {(
                        (entry.totalHours - entry.overtimeHours) * entry.hourlyRate +
                        entry.overtimeHours * entry.hourlyRate * 1.5
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(entry.status)}>{entry.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Clock In */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Quick Clock In
            </CardTitle>
            <CardDescription>Clock in employees to projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Play className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="font-medium">Clock In Employee</h3>
                  <p className="text-sm text-muted-foreground text-center">Start tracking time for an employee</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Clock className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-medium">Bulk Clock In</h3>
                  <p className="text-sm text-muted-foreground text-center">Clock in multiple employees at once</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Plus className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="font-medium">Manual Entry</h3>
                  <p className="text-sm text-muted-foreground text-center">Add time entry manually</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
