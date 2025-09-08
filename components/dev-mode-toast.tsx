"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from 'next-intl'

export function DevModeToast() {
  const { toast } = useToast()
  const t = useTranslations('development')

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      toast({
        title: t('title'),
        description: t('description'),
        variant: "default",
      })
    }
  }, [toast, t])

  return null
}