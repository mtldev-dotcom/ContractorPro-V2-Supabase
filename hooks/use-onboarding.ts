import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface OnboardingStatus {
  isCompleted: boolean
  isLoading: boolean
  error: string | null
}

export function useOnboarding() {
  const [status, setStatus] = useState<OnboardingStatus>({
    isCompleted: false,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }))
      
      const supabase = createClient()
      
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        setStatus({
          isCompleted: false,
          isLoading: false,
          error: 'User not authenticated'
        })
        return
      }

      // Check if user has company associations
      const { data: companyAssociations, error: companyError } = await supabase
        .from('user_companies')
        .select('*')
        .eq('user_id', user.id)

      if (companyError) {
        setStatus({
          isCompleted: false,
          isLoading: false,
          error: companyError.message
        })
        return
      }

      // User has completed onboarding if they have company associations
      const isCompleted = companyAssociations && companyAssociations.length > 0
      
      setStatus({
        isCompleted,
        isLoading: false,
        error: null
      })

    } catch (error: any) {
      setStatus({
        isCompleted: false,
        isLoading: false,
        error: error.message || 'Failed to check onboarding status'
      })
    }
  }

  const refreshStatus = () => {
    checkOnboardingStatus()
  }

  return {
    ...status,
    refreshStatus
  }
} 