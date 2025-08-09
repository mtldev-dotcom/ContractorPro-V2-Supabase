// Centralized project constants, types, and helpers for reuse across the app

export const PROJECT_STATUSES = [
  'planning',
  'in_progress',
  'on_hold',
  'completed',
  'cancelled',
] as const

export type ProjectStatus = typeof PROJECT_STATUSES[number]

export const PROJECT_PRIORITIES = [
  'low',
  'medium',
  'high',
  'urgent',
] as const

export type ProjectPriority = typeof PROJECT_PRIORITIES[number]

// Type representing the shape returned by the projects listing query
export interface Project {
  id: string
  project_number: string
  name: string
  description: string
  project_type: string
  status: ProjectStatus
  priority: ProjectPriority
  start_date: string
  estimated_end_date: string
  actual_end_date: string | null
  budget: number
  contract_amount: number
  site_address_line1: string
  site_address_line2: string
  site_city: string
  site_state: string
  site_zip_code: string
  client_id: string
  project_manager_id: string
  notes: string
  // Joined data
  client?: {
    first_name: string
    last_name: string
    company_name: string
  }
  project_manager?: {
    id: string
    user_id: string
    users: {
      first_name: string
      last_name: string
    }
  }
}

// Human-friendly label for a status value
export function formatStatusLabel(status: ProjectStatus): string {
  return status.replace('_', ' ')
}

// Map a status to a Badge variant to keep visuals consistent across the app
export function getStatusBadgeVariant(status: ProjectStatus): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'in_progress':
      return 'default'
    case 'completed':
      return 'secondary'
    case 'planning':
      return 'outline'
    case 'on_hold':
    case 'cancelled':
      return 'destructive'
    default:
      return 'default'
  }
}


