"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/utils/supabase/client"
import type { Transaction } from "@/hooks/use-transactions"

/**
 * Props interface for the EditTransactionModal component
 * Defines the required and optional properties for modal behavior
 */
interface EditTransactionModalProps {
  open: boolean                                    // Controls modal visibility state
  onOpenChange: (open: boolean) => void           // Callback to handle modal open/close state changes
  onSuccess?: () => void                          // Optional callback executed after successful transaction update
  transaction: Transaction | null                 // Transaction data to edit (null when modal is closed)
}

/**
 * Project interface defining the structure of project data
 * Used for populating the project selection dropdown
 */
interface Project {
  id: string                                      // Unique project identifier from database
  name: string                                    // Human-readable project name for display
}

/**
 * EditTransactionModal Component
 * 
 * A modal dialog for editing existing financial transactions.
 * Features include:
 * - Pre-populated form fields with existing transaction data
 * - Dynamic form fields based on transaction type
 * - Project selection with real-time data fetching
 * - Category selection with type-specific options
 * - Form validation and error handling
 * - Integration with Supabase for data persistence
 * - Toast notifications for user feedback
 */
export function EditTransactionModal({ open, onOpenChange, onSuccess, transaction }: EditTransactionModalProps) {
  // Hook for displaying toast notifications to user
  const { toast } = useToast()
  
  // Translation hook for finances namespace
  const t = useTranslations('finances')
  
  // Loading state for form submission to prevent double-submission and show feedback
  const [isLoading, setIsLoading] = useState(false)
  
  // Array of available projects fetched from database for dropdown selection
  const [projects, setProjects] = useState<Project[]>([])
  
  // Form data state object containing all transaction fields
  // Will be populated with existing transaction data when modal opens
  const [formData, setFormData] = useState({
    description: "",                                // Transaction description/memo
    amount: "",                                     // Transaction amount as string for input handling
    type: "expense",                               // Transaction type: 'income' or 'expense'
    category: "",                                  // Category classification for reporting
    project: "",                                   // Associated project ID (optional)
    date: new Date().toISOString().split("T")[0],  // Transaction date in YYYY-MM-DD format
  })

  /**
   * Effect hook to populate form data when transaction prop changes
   * This runs when a transaction is selected for editing
   */
  useEffect(() => {
    if (transaction && open) {
      // Populate form with existing transaction data
      setFormData({
        description: transaction.description,
        amount: Math.abs(Number(transaction.amount)).toString(), // Use absolute value for display
        type: transaction.type,
        category: transaction.category,
        project: transaction.project_id || "",
        date: transaction.transaction_date,
      })
    }
  }, [transaction, open])

  /**
   * Effect hook to fetch available projects when modal opens
   * 
   * This effect runs when the modal opens and fetches project data from Supabase.
   * It implements a fallback strategy:
   * 1. First attempts to fetch all projects with status information
   * 2. Filters for active projects (active, in_progress, planning statuses)
   * 3. Falls back to all projects if filtering results in empty array
   * 4. Has error handling with console logging for debugging
   * 
   * Dependencies: [open] - only runs when modal opens/closes
   */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Create Supabase client for database operations
        const supabase = createClient()
        
        // Primary query: fetch all projects with status information
        // Ordered alphabetically by name for consistent user experience
        const { data: allProjects, error: allError } = await supabase
          .from('projects_new')
          .select('id, name, status')
          .order('name')

        // Error handling: if primary query fails, try fallback query
        if (allError) {
          console.error('Error fetching all projects:', allError)
          
          // Fallback query: simpler query without status field
          const { data: activeData, error: activeError } = await supabase
            .from('projects_new')
            .select('id, name')
            .order('name')
            
          if (activeError) throw activeError
          setProjects(activeData || [])
          return
        }
        
        // Filter projects to show only active ones for transaction assignment
        // Includes multiple status values that represent "active" projects
        const activeProjects = allProjects?.filter(p => 
          p.status === 'active' || p.status === 'in_progress' || p.status === 'planning'
        ) || []
        
        // Use filtered active projects, or fall back to all projects if filter is too restrictive
        setProjects(activeProjects.length > 0 ? activeProjects : (allProjects || []))
      } catch (err) {
        console.error('Error fetching projects:', err)
        // Silently fail - user can still edit transactions without changing project assignment
      }
    }

    // Only fetch projects when modal is opened to avoid unnecessary API calls
    if (open) {
      fetchProjects()
    }
  }, [open])

  /**
   * Predefined expense categories for consistent transaction classification
   * These categories help with financial reporting and expense tracking
   * Common construction/contracting business expense types
   */
  const expenseCategories = [
    "materials",        // Raw materials, supplies, hardware
    "subcontractor",    // Payments to subcontractors
    "equipment",        // Tool purchases, equipment rental
    "insurance",        // Business insurance premiums
    "permits",          // Building permits, licensing fees
    "transportation",   // Vehicle expenses, fuel, travel
    "other",           // Miscellaneous expenses not fitting other categories
  ]

  /**
   * Predefined income categories for revenue classification
   * Helps track different types of income streams and payment stages
   * Typical payment types in construction/contracting business
   */
  const incomeCategories = [
    "projectpayment",  // Regular project milestone payments
    "deposit",         // Initial project deposits/down payments
    "finalpayment",   // Final project completion payments
    "changeorder",    // Additional work/change order payments
    "other"           // Other income sources
  ]

  /**
   * Form submission handler for updating existing transactions
   * 
   * This async function handles the complete transaction update process:
   * 1. Prevents default form submission behavior
   * 2. Sets loading state to prevent double-submission
   * 3. Authenticates user and gets company context
   * 4. Validates and prepares transaction data
   * 5. Updates transaction in database
   * 6. Provides user feedback and closes modal
   * 7. Handles errors gracefully with user-friendly messages
   * 
   * @param e - React form event object
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default browser form submission behavior
    e.preventDefault()
    
    // Ensure we have a transaction to update
    if (!transaction) {
      toast({
        title: t('editTransactionModal.errorUpdatingTransaction'),
        description: t('editTransactionModal.noTransactionSelected'),
        variant: "destructive",
      })
      return
    }
    
    // Set loading state to disable form and show loading feedback
    setIsLoading(true)

    try {
      // Initialize Supabase client for database operations
      const supabase = createClient()
      
      // Authentication check: ensure user is logged in
      // This is critical for Row Level Security (RLS) policies
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error(t('editTransactionModal.loginRequired'))
      }

      // Prepare transaction data object for database update
      // Note: Amount handling ensures expenses are negative, income is positive
      const transactionData = {
        description: formData.description,                                      // Transaction description/memo
        category: formData.category,                                           // Category for reporting/filtering
        amount: formData.type === 'expense' 
          ? -Math.abs(Number(formData.amount))                                 // Expenses stored as negative values
          : Number(formData.amount),                                           // Income stored as positive values
        type: formData.type,                                                   // Transaction type for additional classification
        project_id: formData.project === "none" ? null : formData.project || null, // Optional project association
        transaction_date: formData.date,                                        // Transaction date from form
        updated_at: new Date().toISOString(),                                  // Update timestamp
      }

      // Update transaction in database
      const { error } = await supabase
        .from('financial_transactions')
        .update(transactionData)
        .eq('id', transaction.id) // Update specific transaction by ID

      if (error) throw error

      // Success feedback: show confirmation toast to user
      toast({
        title: t('editTransactionModal.transactionUpdated'),
        description: t('editTransactionModal.transactionUpdatedDesc', {
          type: formData.type === "income" ? t('editTransactionModal.income') : t('editTransactionModal.expense'),
          amount: formData.amount
        }),
      })
      
      // Close modal and trigger parent component refresh
      onOpenChange(false)
      onSuccess?.()                                        // Optional callback for parent component
      
    } catch (err: any) {
      // Error handling: show user-friendly error message
      // Avoid exposing technical database errors to end users
      toast({
        title: t('editTransactionModal.errorUpdatingTransaction'),
        description: err.message || t('editTransactionModal.errorUpdatingTransactionDesc'),
        variant: "destructive",
      })
    } finally {
      // Always reset loading state regardless of success/failure
      setIsLoading(false)
    }
  }

  // Don't render if no transaction is selected
  if (!transaction) return null

  /**
   * Component render method
   * 
   * Renders a modal dialog with a comprehensive transaction editing form including:
   * - Transaction type selection (income/expense) with dynamic category updates
   * - Description field for transaction details
   * - Amount and date inputs with proper validation
   * - Dynamic category selection based on transaction type
   * - Project association with real-time project data
   * - Form submission with loading states and error handling
   */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {/* Modal header with title and description */}
        <DialogHeader>
          <DialogTitle>{t('editTransactionModal.title')}</DialogTitle>
          <DialogDescription>{t('editTransactionModal.description')}</DialogDescription>
        </DialogHeader>
        
        {/* Main form with onSubmit handler */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            
            {/* Transaction Type Selection */}
            {/* Note: Changing type resets category to prevent invalid category/type combinations */}
            <div className="grid gap-2">
              <Label htmlFor="type">{t('addTransactionModal.transactionType')}</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value, category: "" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">{t('addTransactionModal.income')}</SelectItem>
                  <SelectItem value="expense">{t('addTransactionModal.expense')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Transaction Description Input */}
            {/* Required field for transaction identification and record-keeping */}
            <div className="grid gap-2">
              <Label htmlFor="description">{t('addTransactionModal.description')}</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('addTransactionModal.descriptionPlaceholder')}
                required
              />
            </div>
            
            {/* Amount and Date Row */}
            {/* Two-column layout for efficient space usage */}
            <div className="grid grid-cols-2 gap-4">
              {/* Amount Input */}
              {/* Number input with decimal precision for currency values */}
              <div className="grid gap-2">
                <Label htmlFor="amount">{t('addTransactionModal.amount')}</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"                    // Allow cents precision
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder={t('addTransactionModal.amountPlaceholder')}
                  required
                />
              </div>
              
              {/* Date Input */}
              {/* HTML5 date picker for consistent date format */}
              <div className="grid gap-2">
                <Label htmlFor="date">{t('addTransactionModal.date')}</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>
            
            {/* Category Selection */}
            {/* Dynamic category list based on transaction type (income vs expense) */}
            <div className="grid gap-2">
              <Label htmlFor="category">{t('addTransactionModal.category')}</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('addTransactionModal.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {/* Conditional rendering of categories based on transaction type */}
                  {(formData.type === "income" ? incomeCategories : expenseCategories).map((category) => {
                    // Create translation key by converting category to lowercase and removing spaces
                    const categoryKey = category.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
                    const translationKey = `addTransactionModal.categories.${formData.type}.${categoryKey}`
                    
                    return (
                      <SelectItem key={category} value={category}>
                        {t(translationKey)}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            
            {/* Project Association */}
            {/* Optional project selection for transaction categorization and reporting */}
            <div className="grid gap-2">
              <Label htmlFor="project">{t('addTransactionModal.project')}</Label>
              <Select value={formData.project} onValueChange={(value) => setFormData({ ...formData, project: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('addTransactionModal.selectProject')} />
                </SelectTrigger>
                <SelectContent>
                  {/* Option for general transactions not associated with specific projects */}
                  <SelectItem value="none">{t('addTransactionModal.generalNoProject')}</SelectItem>
                  {/* Dynamic project list from database */}
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Form Action Buttons */}
          {/* Cancel and submit buttons with loading state handling */}
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isLoading}
            >
              {t('editTransactionModal.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('editTransactionModal.updating') : t('editTransactionModal.updateTransaction')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
