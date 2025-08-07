"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Projects page error:", error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">Error Loading Projects</CardTitle>
          <CardDescription>
            We encountered a problem while trying to load your projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-32">
            <p className="font-mono">{error.message || "Unknown error occurred"}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/dashboard"} className="w-full">
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
