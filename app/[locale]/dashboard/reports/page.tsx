"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'

export default function Reports() {
  const t = useTranslations('reports')
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm text-red-500 font-bold italic">{t('devReminder')}</p>
        </div>
      </header>

      <div className="flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle>{t('comingSoon')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('content')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
