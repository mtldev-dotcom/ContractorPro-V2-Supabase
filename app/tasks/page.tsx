"use client"

import { useState } from "react"
import { Search, Plus, Filter, Calendar, User, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Checkbox } from "@/components/ui/checkbox"
import { AddTaskModal } from "@/components/add-task-modal"

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const tasks = [
    {
      id: 1,
      title: "Install kitchen cabinets",
      description: "Mount upper and lower cabinets in kitchen renovation",
      project: "Maple Street Kitchen",
      assignee: "Sarah Thompson",
      priority: "High",
      status: "In Progress",
      dueDate: "2024-02-20",
      completed: false,
      estimatedHours: 8,
    },
    {
      id: 2,
      title: "Electrical rough-in inspection",
      description: "Schedule and coordinate electrical inspection",
      project: "Pine Street Addition",
      assignee: "Mike Rodriguez",
      priority: "High",
      status: "Pending",
      dueDate: "2024-02-18",
      completed: false,
      estimatedHours: 2,
    },
    {
      id: 3,
      title: "Tile bathroom floor",
      description: "Install ceramic tile flooring in master bathroom",
      project: "Oak Avenue Bathroom",
      assignee: "Robert Kim",
      priority: "Medium",
      status: "In Progress",
      dueDate: "2024-02-22",
      completed: false,
      estimatedHours: 12,
    },
    {
      id: 4,
      title: "Paint interior walls",
      description: "Prime and paint all interior walls with agreed colors",
      project: "Maple Street Kitchen",
      assignee: "Jennifer Adams",
      priority: "Low",
      status: "Not Started",
      dueDate: "2024-02-25",
      completed: false,
      estimatedHours: 16,
    },
    {
      id: 5,
      title: "Install deck railing",
      description: "Install composite railing system around deck perimeter",
      project: "Elm Drive Deck",
      assignee: "David Wilson",
      priority: "Medium",
      status: "In Progress",
      dueDate: "2024-02-21",
      completed: false,
      estimatedHours: 6,
    },
    {
      id: 6,
      title: "Plumbing final connections",
      description: "Connect all fixtures and test water pressure",
      project: "Oak Avenue Bathroom",
      assignee: "Lisa Chen",
      priority: "High",
      status: "Completed",
      dueDate: "2024-02-15",
      completed: true,
      estimatedHours: 4,
    },
    {
      id: 7,
      title: "HVAC ductwork installation",
      description: "Install ductwork for new addition heating/cooling",
      project: "Pine Street Addition",
      assignee: "Amanda Foster",
      priority: "High",
      status: "In Progress",
      dueDate: "2024-02-19",
      completed: false,
      estimatedHours: 10,
    },
    {
      id: 8,
      title: "Final cleanup and walkthrough",
      description: "Complete final cleanup and client walkthrough",
      project: "Oak Avenue Bathroom",
      assignee: "John Martinez",
      priority: "Medium",
      status: "Scheduled",
      dueDate: "2024-02-28",
      completed: false,
      estimatedHours: 3,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "secondary"
      case "In Progress":
        return "default"
      case "Pending":
        return "outline"
      case "Not Started":
        return "outline"
      case "Scheduled":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return CheckCircle2
      case "In Progress":
        return Clock
      case "Pending":
        return AlertCircle
      case "Not Started":
        return AlertCircle
      case "Scheduled":
        return Calendar
      default:
        return Clock
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const completedTasks = tasks.filter((task) => task.completed).length
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length
  const overdueTasks = tasks.filter((task) => new Date(task.dueDate) < new Date() && !task.completed).length

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Tasks</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
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
            New Task
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{inProgressTasks}</div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>Manage and track project tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const StatusIcon = getStatusIcon(task.status)
                const isOverdue = new Date(task.dueDate) < new Date() && !task.completed

                return (
                  <div
                    key={task.id}
                    className={`p-4 border rounded-lg hover:shadow-sm transition-shadow ${
                      task.completed ? "bg-muted/50" : ""
                    } ${isOverdue ? "border-red-200 bg-red-50/50" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox checked={task.completed} className="mt-1" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                            <Badge variant={getStatusColor(task.status)} className="flex items-center gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {task.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {task.assignee}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                            {isOverdue && <span className="text-red-600 font-medium ml-1">(Overdue)</span>}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimatedHours}h estimated
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Project: <span className="font-medium">{task.project}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddTaskModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  )
}
