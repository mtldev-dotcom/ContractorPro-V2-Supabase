"use client"

import { useState } from "react"
import { Search, Filter, FileText, Download, Eye, Upload, ImageIcon, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("")

  const documents = [
    {
      id: 1,
      name: "Kitchen Renovation Contract",
      description: "Signed contract for Maple Street kitchen renovation project",
      fileType: "pdf",
      fileSize: 2048576, // 2MB
      category: "contract",
      projectName: "Kitchen Renovation",
      clientName: "Sarah Johnson",
      uploadedBy: "John Martinez",
      uploadedDate: "2024-02-10",
      isPublic: false,
      tags: ["contract", "signed", "kitchen"],
    },
    {
      id: 2,
      name: "Building Permit - Pine Street",
      description: "Building permit for Pine Street addition project",
      fileType: "pdf",
      fileSize: 1536000, // 1.5MB
      category: "permit",
      projectName: "Pine Street Addition",
      clientName: "Lisa Rodriguez",
      uploadedBy: "Admin User",
      uploadedDate: "2024-02-08",
      isPublic: false,
      tags: ["permit", "building", "addition"],
    },
    {
      id: 3,
      name: "Before Photos - Bathroom",
      description: "Before photos of Oak Avenue bathroom renovation",
      fileType: "image",
      fileSize: 5242880, // 5MB
      category: "photo",
      projectName: "Bathroom Remodel",
      clientName: "Mike Chen",
      uploadedBy: "Sarah Thompson",
      uploadedDate: "2024-02-05",
      isPublic: true,
      tags: ["photos", "before", "bathroom"],
    },
    {
      id: 4,
      name: "Material Receipt - Home Depot",
      description: "Receipt for lumber and hardware purchases",
      fileType: "pdf",
      fileSize: 512000, // 512KB
      category: "receipt",
      projectName: "Deck Construction",
      clientName: "Tom Wilson",
      uploadedBy: "Mike Rodriguez",
      uploadedDate: "2024-02-12",
      isPublic: false,
      tags: ["receipt", "materials", "lumber"],
    },
    {
      id: 5,
      name: "Safety Inspection Report",
      description: "Monthly safety inspection report for all job sites",
      fileType: "pdf",
      fileSize: 1024000, // 1MB
      category: "safety",
      projectName: null,
      clientName: null,
      uploadedBy: "Admin User",
      uploadedDate: "2024-02-01",
      isPublic: false,
      tags: ["safety", "inspection", "monthly"],
    },
    {
      id: 6,
      name: "Progress Photos - Kitchen",
      description: "Weekly progress photos of kitchen renovation",
      fileType: "image",
      fileSize: 8388608, // 8MB
      category: "photo",
      projectName: "Kitchen Renovation",
      clientName: "Sarah Johnson",
      uploadedBy: "John Martinez",
      uploadedDate: "2024-02-14",
      isPublic: true,
      tags: ["photos", "progress", "kitchen"],
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "contract":
        return "default"
      case "permit":
        return "secondary"
      case "photo":
        return "outline"
      case "receipt":
        return "destructive"
      case "safety":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return FileText
      case "image":
        return ImageIcon
      default:
        return File
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const documentsByCategory = {
    contracts: documents.filter((doc) => doc.category === "contract"),
    permits: documents.filter((doc) => doc.category === "permit"),
    photos: documents.filter((doc) => doc.category === "photo"),
    receipts: documents.filter((doc) => doc.category === "receipt"),
    safety: documents.filter((doc) => doc.category === "safety"),
  }

  const totalDocuments = documents.length
  const totalSize = documents.reduce((sum, doc) => sum + doc.fileSize, 0)
  const publicDocuments = documents.filter((doc) => doc.isPublic).length
  const recentDocuments = documents.filter(
    (doc) => new Date(doc.uploadedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  ).length

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Document Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search documents..."
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
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4">
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="permits">Permits</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="receipts">Receipts</TabsTrigger>
            </TabsList>
          </div>

          {/* Document Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{totalDocuments}</div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
                <p className="text-sm text-muted-foreground">Total Storage</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{publicDocuments}</div>
                <p className="text-sm text-muted-foreground">Public Documents</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{recentDocuments}</div>
                <p className="text-sm text-muted-foreground">Added This Week</p>
              </CardContent>
            </Card>
          </div>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((document) => {
                const FileIcon = getFileIcon(document.fileType)

                return (
                  <Card key={document.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <FileIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2">{document.name}</CardTitle>
                            <CardDescription className="line-clamp-2">{document.description}</CardDescription>
                          </div>
                        </div>
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
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={getCategoryColor(document.category)}>{document.category}</Badge>
                        {document.isPublic && <Badge variant="outline">Public</Badge>}
                      </div>

                      <div className="space-y-2 text-sm">
                        {document.projectName && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Project:</span>
                            <span className="font-medium">{document.projectName}</span>
                          </div>
                        )}
                        {document.clientName && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Client:</span>
                            <span className="font-medium">{document.clientName}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Size:</span>
                          <span className="font-medium">{formatFileSize(document.fileSize)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Uploaded:</span>
                          <span className="font-medium">{new Date(document.uploadedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">By:</span>
                          <span className="font-medium">{document.uploadedBy}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Tags:</div>
                        <div className="flex flex-wrap gap-1">
                          {document.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Category-specific tabs */}
          {Object.entries(documentsByCategory).map(([category, docs]) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {docs.map((document) => {
                  const FileIcon = getFileIcon(document.fileType)

                  return (
                    <Card key={document.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <FileIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{document.name}</CardTitle>
                            <CardDescription>{formatFileSize(document.fileSize)}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{document.description}</p>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
