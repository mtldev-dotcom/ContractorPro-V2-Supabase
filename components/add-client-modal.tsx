"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
  const t = useTranslations('clients')
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
        title: t('addClientModal.validationError'),
        description: t('addClientModal.firstLastNameRequired'),
        variant: "destructive",
      })
      return
    }

    if (formData.type === "business" && !formData.companyName) {
      toast({
        title: t('addClientModal.validationError'),
        description: t('addClientModal.companyNameRequired'),
        variant: "destructive",
      })
      return
    }

    try {
      const supabase = createClient()

      if (!companyId) {
        throw new Error(t('addClientModal.companyRequired'))
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

      const clientName = isBusiness && companyName ? `${companyName} (${formData.firstName} ${formData.lastName})` : `${formData.firstName} ${formData.lastName}`
      toast({
        title: t('addClientModal.clientAdded'),
        description: t('addClientModal.clientAddedDesc', { clientName }),
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
        title: t('addClientModal.errorAdding'),
        description: error.message || t('addClientModal.errorAddingDesc'),
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('addClientModal.title')}</DialogTitle>
          <DialogDescription>{t('addClientModal.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Client Type */}
            <div className="grid gap-3">
              <Label>{t('addClientModal.clientType')}</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual">{t('addClientModal.individual')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business">{t('addClientModal.business')}</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Name Fields - always required */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">{t('addClientModal.firstName')} *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder={t('addClientModal.firstNamePlaceholder')}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">{t('addClientModal.lastName')} *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder={t('addClientModal.lastNamePlaceholder')}
                  required
                />
              </div>
            </div>

            {/* Company Name - required only for business */}
            {formData.type === 'business' && (
              <div className="grid gap-2">
                <Label htmlFor="companyName">{t('addClientModal.companyName')} *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder={t('addClientModal.companyNamePlaceholder')}
                  required
                />
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('addClientModal.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('addClientModal.emailPlaceholder')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">{t('addClientModal.phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('addClientModal.phonePlaceholder')}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="secondaryPhone">{t('addClientModal.secondaryPhone')}</Label>
              <Input
                id="secondaryPhone"
                type="tel"
                value={formData.secondaryPhone}
                onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                placeholder={t('addClientModal.secondaryPhonePlaceholder')}
              />
            </div>

            {/* Address */}
            <div className="grid gap-2">
              <Label htmlFor="addressLine1">{t('addClientModal.addressLine1')}</Label>
              <Input
                id="addressLine1"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                placeholder={t('addClientModal.addressLine1Placeholder')}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="addressLine2">{t('addClientModal.addressLine2')}</Label>
              <Input
                id="addressLine2"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                placeholder={t('addClientModal.addressLine2Placeholder')}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">{t('addClientModal.city')}</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder={t('addClientModal.cityPlaceholder')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">{t('addClientModal.state')}</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder={t('addClientModal.statePlaceholder')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zipCode">{t('addClientModal.zipCode')}</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder={t('addClientModal.zipCodePlaceholder')}
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="preferredContactMethod">{t('addClientModal.preferredContactMethod')}</Label>
                <Select
                  value={formData.preferredContactMethod}
                  onValueChange={(value) => setFormData({ ...formData, preferredContactMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">{t('addClientModal.contactMethods.email')}</SelectItem>
                    <SelectItem value="phone">{t('addClientModal.contactMethods.phone')}</SelectItem>
                    <SelectItem value="text">{t('addClientModal.contactMethods.text')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rating">{t('addClientModal.rating')}</Label>
                <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t('addClientModal.ratings.1')}</SelectItem>
                    <SelectItem value="2">{t('addClientModal.ratings.2')}</SelectItem>
                    <SelectItem value="3">{t('addClientModal.ratings.3')}</SelectItem>
                    <SelectItem value="4">{t('addClientModal.ratings.4')}</SelectItem>
                    <SelectItem value="5">{t('addClientModal.ratings.5')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">{t('addClientModal.notes')}</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t('addClientModal.notesPlaceholder')}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('addClientModal.cancel')}
            </Button>
            <Button type="submit">{t('addClientModal.addClient')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
