"use client"

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'
import { CLIENT_TYPES, CONTACT_METHODS } from '@/lib/clients'

interface EditClientModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    clientId: string
    onSuccess?: () => void
}

export function EditClientModal({ open, onOpenChange, clientId, onSuccess }: EditClientModalProps) {
    const { toast } = useToast()
    const t = useTranslations('clients')
    const [loading, setLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [formData, setFormData] = useState({
        type: 'individual',
        firstName: '',
        lastName: '',
        companyName: '',
        email: '',
        phone: '',
        secondaryPhone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        preferredContactMethod: 'email',
        notes: '',
        rating: '5',
        isActive: true,
    })

    useEffect(() => {
        async function load() {
            if (!open) return
            setLoading(true)
            const supabase = createClient()
            const { data, error } = await supabase.from('clients').select('*').eq('id', clientId).single()
            setLoading(false)
            if (error) {
                toast({ title: t('editClientModal.errorUpdating'), description: error.message, variant: 'destructive' })
                return
            }
            setFormData({
                type: data.type ?? 'individual',
                firstName: data.first_name ?? '',
                lastName: data.last_name ?? '',
                companyName: data.company_name ?? '',
                email: data.email ?? '',
                phone: data.phone ?? '',
                secondaryPhone: data.secondary_phone ?? '',
                addressLine1: data.address_line1 ?? '',
                addressLine2: data.address_line2 ?? '',
                city: data.city ?? '',
                state: data.state ?? '',
                zipCode: data.zip_code ?? '',
                preferredContactMethod: data.preferred_contact_method ?? 'email',
                notes: data.notes ?? '',
                rating: String(data.rating ?? '5'),
                isActive: Boolean(data.is_active ?? true),
            })
        }
        load()
    }, [open, clientId, toast])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Basic validation mirrors Add modal
        if (formData.type === 'individual' && (!formData.firstName || !formData.lastName)) {
            toast({ title: t('addClientModal.validationError'), description: t('addClientModal.firstLastNameRequired'), variant: 'destructive' })
            return
        }
        if (formData.type === 'business' && !formData.companyName) {
            toast({ title: t('addClientModal.validationError'), description: t('addClientModal.companyNameRequired'), variant: 'destructive' })
            return
        }

        try {
            const supabase = createClient()
            const isBusiness = formData.type === 'business'
            const firstName = isBusiness ? null : formData.firstName || null
            const lastName = isBusiness ? null : formData.lastName || null
            const companyName = isBusiness ? (formData.companyName || null) : null

            const { error } = await supabase.from('clients').update({
                type: formData.type,
                first_name: firstName,
                last_name: lastName,
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
                is_active: formData.isActive,
            }).eq('id', clientId)

            if (error) throw error

            toast({ title: t('editClientModal.clientUpdated'), description: t('editClientModal.clientUpdatedDesc') })
            onSuccess?.()
            onOpenChange(false)
        } catch (error: any) {
            toast({ title: t('editClientModal.errorUpdating'), description: error.message || t('editClientModal.errorUpdatingDesc'), variant: 'destructive' })
        }
    }

    // Permanently delete client after confirming
    const handleDeleteClient = async () => {
        try {
            setIsDeleting(true)
            const supabase = createClient()
            // Clean up references to satisfy FKs/RLS expectations
            await supabase.from('projects_new').update({ client_id: null }).eq('client_id', clientId)
            await supabase.from('documents').update({ client_id: null }).eq('client_id', clientId)
            await supabase.from('communications').delete().eq('client_id', clientId)

            const { error } = await supabase.from('clients').delete().eq('id', clientId)
            if (error) throw error

            toast({ title: t('clientDeleted'), description: t('clientDeletedDesc', { clientName: 'The client' }) })
            onSuccess?.()
            onOpenChange(false)
        } catch (error: any) {
            toast({ title: t('deleteFailed'), description: error.message || t('deleteFailedDesc'), variant: 'destructive' })
        } finally {
            setIsDeleting(false)
            setConfirmDelete(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('editClientModal.title')}</DialogTitle>
                    <DialogDescription>{t('editClientModal.description')}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                            <Label>{t('addClientModal.clientType')}</Label>
                            <RadioGroup value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })} className="flex gap-6">
                                {CLIENT_TYPES.map((type) => (
                                    <div className="flex items-center space-x-2" key={type}>
                                        <RadioGroupItem value={type} id={`type-${type}`} />
                                        <Label htmlFor={`type-${type}`}>{t(`addClientModal.${type}`)}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        {formData.type === 'individual' ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">{t('addClientModal.firstName')} *</Label>
                                    <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder={t('addClientModal.firstNamePlaceholder')} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">{t('addClientModal.lastName')} *</Label>
                                    <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder={t('addClientModal.lastNamePlaceholder')} />
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                <Label htmlFor="companyName">{t('addClientModal.companyName')} *</Label>
                                <Input id="companyName" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} placeholder={t('addClientModal.companyNamePlaceholder')} />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('addClientModal.email')}</Label>
                                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder={t('addClientModal.emailPlaceholder')} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">{t('addClientModal.phone')}</Label>
                                <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder={t('addClientModal.phonePlaceholder')} />
            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="secondaryPhone">{t('addClientModal.secondaryPhone')}</Label>
                            <Input id="secondaryPhone" type="tel" value={formData.secondaryPhone} onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })} placeholder={t('addClientModal.secondaryPhonePlaceholder')} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="addressLine1">{t('addClientModal.addressLine1')}</Label>
                            <Input id="addressLine1" value={formData.addressLine1} onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} placeholder={t('addClientModal.addressLine1Placeholder')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="addressLine2">{t('addClientModal.addressLine2')}</Label>
                            <Input id="addressLine2" value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} placeholder={t('addClientModal.addressLine2Placeholder')} />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="city">{t('addClientModal.city')}</Label>
                                <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder={t('addClientModal.cityPlaceholder')} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="state">{t('addClientModal.state')}</Label>
                                <Input id="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder={t('addClientModal.statePlaceholder')} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="zipCode">{t('addClientModal.zipCode')}</Label>
                                <Input id="zipCode" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} placeholder={t('addClientModal.zipCodePlaceholder')} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="preferredContactMethod">{t('addClientModal.preferredContactMethod')}</Label>
                                <Select value={formData.preferredContactMethod} onValueChange={(value) => setFormData({ ...formData, preferredContactMethod: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CONTACT_METHODS.map((m) => (
                                            <SelectItem key={m} value={m}>{t(`addClientModal.contactMethods.${m}`)}</SelectItem>
                                        ))}
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
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <SelectItem key={n} value={String(n)}>{t(`addClientModal.ratings.${n}`)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">{t('addClientModal.notes')}</Label>
                            <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder={t('addClientModal.notesPlaceholder')} rows={3} />
                        </div>
                    </div>
                    <DialogFooter className="flex items-center justify-between gap-2">
                        {/* Left side: Delete with inline confirmation */}
                        <div className="mr-auto flex items-center gap-2">
                            {!confirmDelete ? (
                                <Button type="button" variant="destructive" onClick={() => setConfirmDelete(true)} disabled={loading || isDeleting}>
                                    {t('editClientModal.deleteClient')}
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{t('editClientModal.confirmDelete')}</span>
                                    <Button type="button" variant="outline" onClick={() => setConfirmDelete(false)} disabled={isDeleting}>{t('cancel')}</Button>
                                    <Button type="button" variant="destructive" onClick={handleDeleteClient} disabled={isDeleting}>
                                        {isDeleting ? t('deleting') : t('editClientModal.delete')}
                                    </Button>
                                </div>
                            )}
                        </div>
                        {/* Right side: Save/Cancel */}
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading || isDeleting}>{t('cancel')}</Button>
                            <Button type="submit" disabled={loading || isDeleting}>{loading ? t('editClientModal.saving') : t('editClientModal.saveChanges')}</Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}


