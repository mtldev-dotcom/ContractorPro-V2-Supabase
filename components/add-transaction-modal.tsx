"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

interface AddTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

interface Project {
  id: string
  name: string
}

export function AddTransactionModal({ open, onOpenChange, onSuccess }: AddTransactionModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    project: "",
    date: new Date().toISOString().split("T")[0],
  })

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const supabase = createClient()
        
        // First try to get all projects to see what's available
        const { data: allProjects, error: allError } = await supabase
          .from('projects_new')
          .select('id, name, status')
          .order('name')

        console.log('All projects query result:', { data: allProjects, error: allError })

        if (allError) {
          console.error('Error fetching all projects:', allError)
          // Try with just active projects if there's an error
          const { data: activeData, error: activeError } = await supabase
            .from('projects_new')
            .select('id, name')
            .order('name')
            
          if (activeError) throw activeError
          console.log('Active projects fallback:', activeData)
          setProjects(activeData || [])
          return
        }
        
        // Filter for active projects or use all if no active status filter works
        const activeProjects = allProjects?.filter(p => 
          p.status === 'active' || p.status === 'in_progress' || p.status === 'planning'
        ) || []
        
        console.log('Filtered active projects:', activeProjects)
        setProjects(activeProjects.length > 0 ? activeProjects : (allProjects || []))
      } catch (err) {
        console.error('Error fetching projects:', err)
      }
    }

    if (open) {
      fetchProjects()
    }
  }, [open])

  const expenseCategories = [
    "Materials",
    "Subcontractor",
    "Equipment",
    "Insurance",
    "Permits",
    "Transportation",
    "Other",
  ]

  const incomeCategories = ["Project Payment", "Deposit", "Final Payment", "Change Order", "Other"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('You must be logged in to add transactions')
      }

      // Get user's company_id from user_companies table
      const { data: userCompanies, error: companyError } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (companyError || !userCompanies?.company_id) {
        throw new Error('Unable to determine company information. Please contact support.')
      }

      // Prepare transaction data
      const transactionData = {
        company_id: userCompanies.company_id,
        user_id: user.id,
        project_id: formData.project === "none" ? null : formData.project || null,
        transaction_date: formData.date,
        description: formData.description,
        category: formData.category,
        amount: formData.type === 'expense' ? -Math.abs(Number(formData.amount)) : Number(formData.amount),
        type: formData.type,
      }

      const { error } = await supabase
        .from('financial_transactions')
        .insert([transactionData])

      if (error) throw error

      toast({
        title: "Transaction Added",
        description: `${formData.type === "income" ? "Income" : "Expense"} of $${formData.amount} has been recorded.`,
      })

      // Reset form
      setFormData({
        description: "",
        amount: "",
        type: "expense",
        category: "",
        project: "",
        date: new Date().toISOString().split("T")[0],
      })
      
      onOpenChange(false)
      onSuccess?.()
    } catch (err: any) {
      toast({
        title: "Error Adding Transaction",
        description: err.message || "Failed to add transaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>Record a new income or expense transaction.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value, category: "" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Payment from client / Material purchase"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.type === "income" ? incomeCategories : expenseCategories).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Select value={formData.project} onValueChange={(value) => setFormData({ ...formData, project: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">General (No Project)</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
