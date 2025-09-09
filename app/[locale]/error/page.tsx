import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

function ErrorContent({ searchParams }: { searchParams: { message?: string } }) {
  const message = searchParams?.message || "An unexpected error occurred"

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-700">Authentication Error</CardTitle>
            <CardDescription className="text-base">
              {decodeURIComponent(message)}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm text-red-800">
                <p className="font-medium mb-2">Common solutions:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Make sure your email and password are correct</li>
                  <li>• Check that your account has been confirmed</li>
                  <li>• Try refreshing the page and signing in again</li>
                  <li>• Clear your browser cache and cookies</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link href="/auth/login">
                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full h-11" 
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-600">
              Still having trouble? Contact our support team for help.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage({ 
  searchParams 
}: { 
  searchParams: { message?: string } 
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <ErrorContent searchParams={searchParams} />
    </Suspense>
  )
}
