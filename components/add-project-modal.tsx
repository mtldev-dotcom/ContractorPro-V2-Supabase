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
import { useToast } from "@/hooks/use-toast"
import { createClient } from '@/utils/supabase/client';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string | null;
}

interface AddProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddProjectModal({ open, onOpenChange, onSuccess }: AddProjectModalProps) {
  const { toast } = useToast()
  const t = useTranslations('projects')
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    address: "",
    budget: "",
    startDate: "",
    dueDate: "",
    description: "",
    status: "planning",
  })
  const [clients, setClients] = useState<Client[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      const supabase = createClient();
      const { data, error } = await supabase.from('clients').select('id, first_name, last_name, company_name');

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      setClients(data || []);
    }

    async function fetchCompanyId() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (error) {
        console.error('Error fetching company ID:', error);
        return;
      }

      setCompanyId(data?.company_id || null);
    }

    fetchClients();
    fetchCompanyId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const supabase = createClient()

    try {
      if (!companyId) {
        throw new Error(t('addProjectModal.companyInfoRequired') || 'Company ID is required to create a project.')
      }

      const { error } = await supabase.from('projects_new').insert([
        {
          name: formData.name,
          client_id: formData.client, // Assuming client_id is the correct column
          site_address_line1: formData.address,
          budget: parseFloat(formData.budget),
          start_date: formData.startDate,
          estimated_end_date: formData.dueDate,
          description: formData.description,
          status: formData.status,
          company_id: companyId, // Include company_id
        },
      ])

      if (error) {
        throw error
      }

      toast({
        title: t('addProjectModal.projectCreated'),
        description: t('addProjectModal.projectCreatedDesc', { projectName: formData.name }),
      })

      onSuccess?.()

      // Reset form and close modal
      setFormData({
        name: '',
        client: '',
        address: '',
        budget: '',
        startDate: '',
        dueDate: '',
        description: '',
        status: 'planning',
      })
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: t('addProjectModal.errorCreating'),
        description: error.message || t('addProjectModal.errorCreatingDesc'),
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('addProjectModal.title')}</DialogTitle>
          <DialogDescription>{t('addProjectModal.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('addProjectModal.projectName')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('addProjectModal.projectNamePlaceholder')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client">{t('addProjectModal.clientName')}</Label>
              <Select
                value={formData.client}
                onValueChange={(value) => setFormData({ ...formData, client: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('addProjectModal.selectClient')} />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.first_name} {client.last_name} ({client.company_name || t('addProjectModal.noClient')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">{t('addProjectModal.siteAddress')}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t('addProjectModal.addressLine1Placeholder')}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="budget">{t('addProjectModal.budget')}</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder={t('addProjectModal.budgetPlaceholder')}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">{t('addProjectModal.projectStatus')}</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('addProjectModal.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">{t('addProjectModal.estimatedStartDate')}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">{t('addProjectModal.estimatedEndDate')}</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t('addProjectModal.projectDescription')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('addProjectModal.projectDescriptionPlaceholder')}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('addProjectModal.cancel')}
            </Button>
            <Button type="submit">{t('addProjectModal.createProject')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
