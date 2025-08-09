"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/utils/supabase/client"

interface AddClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddClientModal({ open, onOpenChange, onSuccess }: AddClientModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    type: "individual",
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    secondaryPhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    preferredContactMethod: "email",
    notes: "",
    rating: "5",
  })
  const [companyId, setCompanyId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCompanyId() {
      try {
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()
        const userId = userData.user?.id
        if (!userId) return
        const { data, error } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', userId)
          .single()
        if (!error) {
          setCompanyId(data?.company_id ?? null)
        }
      } catch (_) {
        // ignore
      }
    }
    fetchCompanyId()
  }, [])

  // Removed fixed US states list to support international addresses (e.g., Canadian provinces)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: first and last name are always required
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: "Validation Error",
        description: "First name and last name are required.",
        variant: "destructive",
      })
      return
    }

    if (formData.type === "business" && !formData.companyName) {
      toast({
        title: "Validation Error",
        description: "Company name is required for business clients.",
        variant: "destructive",
      })
      return
    }

    try {
      const supabase = createClient()

      if (!companyId) {
        throw new Error('Company is required to add a client. Please ensure your account is linked to a company.')
      }

      // Determine optional company name based on type
      const isBusiness = formData.type === 'business'
      const companyName = isBusiness ? (formData.companyName || null) : null

      const { error } = await supabase.from('clients').insert([
        {
          company_id: companyId,
          type: formData.type,
          first_name: formData.firstName,
          last_name: formData.lastName,
          company_name: companyName,
          email: formData.email || null,
          phone: formData.phone || null,
          secondary_phone: formData.secondaryPhone || null,
          address_line1: formData.addressLine1 || null,
          address_line2: formData.addressLine2 || null,
          city: formData.city || null,
          state: formData.state || null,
          zip_code: formData.zipCode || null,
          preferred_contact_method: formData.preferredContactMethod,
          notes: formData.notes || null,
          rating: parseInt(formData.rating, 10) || 5,
        },
      ])

      if (error) throw error

      toast({
        title: "Client Added",
        description: `${isBusiness && companyName ? `${companyName} (` : ''}${formData.firstName} ${formData.lastName}${isBusiness && companyName ? ')' : ''} has been added successfully.`,
      })

      onSuccess?.()

      // Reset form
      setFormData({
        type: "individual",
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        phone: "",
        secondaryPhone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        preferredContactMethod: "email",
        notes: "",
        rating: "5",
      })
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add client.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>Add a new client to your contact database.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Client Type */}
            <div className="grid gap-3">
              <Label>Client Type</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business">Business</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Name Fields - always required */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Smith"
                  required
                />
              </div>
            </div>

            {/* Company Name - required only for business */}
            {formData.type === 'business' && (
              <div className="grid gap-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="ABC Construction LLC"
                  required
                />
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@email.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="secondaryPhone">Secondary Phone</Label>
              <Input
                id="secondaryPhone"
                type="tel"
                value={formData.secondaryPhone}
                onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                placeholder="(555) 987-6543"
              />
            </div>

            {/* Address */}
            <div className="grid gap-2">
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input
                id="addressLine1"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                placeholder="Apt 2B, Suite 100"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Springfield"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State/Province/Region</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="CA, QC, ON, or region name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="62701"
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                <Select
                  value={formData.preferredContactMethod}
                  onValueChange={(value) => setFormData({ ...formData, preferredContactMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating</Label>
                <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about the client..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
