"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Settings() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-red-500 font-bold italic">A Reminder to developers: this page is a work in progress. The data is not yet connected to the projects table.</p>
        </div>
      </header>

      <div className="flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure your application preferences and business settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Settings panel will include company information, user preferences, and system configuration.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
