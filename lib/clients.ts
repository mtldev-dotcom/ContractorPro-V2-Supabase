// Centralized client constants, types, and helpers used across the app

export const CLIENT_TYPES = [
  'individual',
  'business',
] as const

export type ClientType = typeof CLIENT_TYPES[number]

export const CONTACT_METHODS = [
  'email',
  'phone',
  'text',
] as const

export type ContactMethod = typeof CONTACT_METHODS[number]

export interface Client {
  id: string
  company_id: string | null
  type: ClientType
  first_name: string | null
  last_name: string | null
  company_name: string | null
  email: string | null
  phone: string | null
  secondary_phone: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  country: string | null
  preferred_contact_method: ContactMethod
  rating: number | null
  notes: string | null
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export function getClientDisplayName(client: Client): string {
  if (client.type === 'business') {
    return client.company_name || 'Business Client'
  }
  const parts = [client.first_name, client.last_name].filter(Boolean)
  return parts.length ? parts.join(' ') : 'Individual Client'
}

export function formatContactMethodLabel(method: ContactMethod): string {
  return method
}


