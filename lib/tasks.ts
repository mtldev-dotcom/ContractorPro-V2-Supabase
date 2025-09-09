// Centralized task constants, types, and helpers for reuse across the app

export const TASK_STATUSES = [
  'not_started',
  'pending',
  'in_progress',
  'scheduled',
  'completed',
  'blocked',
  'cancelled',
] as const

export type TaskStatus = typeof TASK_STATUSES[number]

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const
export type TaskPriority = typeof TASK_PRIORITIES[number]

// Type representing the shape returned by the tasks listing query
export interface Task {
  id: string
  title: string
  description: string | null
  project_id: string | null
  assignee_id: string | null
  priority: TaskPriority
  status: TaskStatus
  due_date: string | null
  completed: boolean
  estimated_hours: number | null
  created_at?: string
  updated_at?: string

  // Joined data
  project?: {
    id: string
    name: string
    project_number?: string
  }

  assignee?: {
    id: string
    user_id?: string
    users?: {
      first_name: string
      last_name: string
    }
  }
}

// Human-friendly label for a status value
export function formatStatusLabel(status: TaskStatus): string {
  return status.replace('_', ' ')
}

// Human-friendly label for a priority
export function formatPriorityLabel(priority: TaskPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

// Map a status to a Badge variant to keep visuals consistent across the app
// Variants follow the same naming used by other libs/components: 'default' | 'secondary' | 'outline' | 'destructive'
export function getStatusBadgeVariant(status: TaskStatus): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'in_progress':
      return 'default'
    case 'completed':
      return 'secondary'
    case 'not_started':
    case 'pending':
    case 'scheduled':
      return 'outline'
    case 'blocked':
    case 'cancelled':
      return 'destructive'
    default:
      return 'default'
  }
}

// Map priority to a badge variant
export function getPriorityBadgeVariant(priority: TaskPriority): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (priority) {
    case 'urgent':
      return 'destructive'
    case 'high':
      return 'default'
    case 'medium':
      return 'secondary'
    case 'low':
      return 'outline'
    default:
      return 'default'
  }
}

// Format assignee name from the nested user data
export function formatAssigneeName(assignee?: Task['assignee']): string {
  if (!assignee?.users) return 'Unassigned'
  
  const { first_name, last_name } = assignee.users
  const name = [first_name, last_name].filter(Boolean).join(' ').trim()
  return name || 'Employee'
}
