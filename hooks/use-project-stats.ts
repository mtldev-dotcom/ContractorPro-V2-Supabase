"use client"

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface ProjectStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalBudget: number
  totalSpent: number
  avgProgress: number
  overdueProjects: number
  thisMonthProjects: number
}

export function useProjectStats() {
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalBudget: 0,
    totalSpent: 0,
    avgProgress: 0,
    overdueProjects: 0,
    thisMonthProjects: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const supabase = createClient()
      
      // Ensure user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Authentication required')
      }

      // Fetch all projects for the user's companies
      const { data: projects, error: projectsError } = await supabase
        .from('projects_new')
        .select(`
          *,
          client:clients(first_name, last_name, company_name)
        `)

      if (projectsError) throw projectsError

      const projectList = projects || []
      
      // Calculate statistics
      const totalProjects = projectList.length
      const activeProjects = projectList.filter(p => 
        ['planning', 'in_progress'].includes(p.status)
      ).length
      const completedProjects = projectList.filter(p => 
        p.status === 'completed'
      ).length
      
      const totalBudget = projectList.reduce((sum, p) => sum + (p.budget || 0), 0)
      const totalSpent = projectList.reduce((sum, p) => sum + (p.actual_cost || 0), 0)
      
      // Calculate average progress (placeholder - would need progress tracking)
      const avgProgress = totalProjects > 0 
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0
      
      // Count overdue projects
      const now = new Date()
      const overdueProjects = projectList.filter(p => 
        p.estimated_end_date && 
        new Date(p.estimated_end_date) < now && 
        !['completed', 'cancelled'].includes(p.status)
      ).length
      
      // Count projects created this month
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)
      
      const thisMonthProjects = projectList.filter(p => 
        p.created_at && new Date(p.created_at) >= thisMonth
      ).length

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        totalBudget,
        totalSpent,
        avgProgress,
        overdueProjects,
        thisMonthProjects,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load project statistics')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { stats, isLoading, error, refresh }
}