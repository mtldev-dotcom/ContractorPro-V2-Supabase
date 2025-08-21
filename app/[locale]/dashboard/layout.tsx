"use client"

import React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { useOnboarding } from '@/hooks/use-onboarding'
import { Loader2 } from 'lucide-react'
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { isCompleted, isLoading, error } = useOnboarding()

  // Show loading state while checking onboarding status
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // If onboarding is not completed, the middleware should redirect to /onboarding
  // But we'll add a fallback here just in case
  if (!isCompleted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Setup Required</h2>
          <p className="text-muted-foreground mb-4">
            Please complete your company setup to access the dashboard.
          </p>
          <a
            href="/onboarding"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md inline-block"
          >
            Complete Setup
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
