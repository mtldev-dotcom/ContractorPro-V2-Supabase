"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function DevModeToast() {
  const { toast } = useToast()

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      toast({
        title: "Development Mode",
        description: "Current branch: copy-master",
        variant: "default",
      })
    }
  }, [toast])

  return null
}