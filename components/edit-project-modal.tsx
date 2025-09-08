"use client";

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

interface EditProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSuccess?: () => void;
}

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string | null;
}

export function EditProjectModal({ open, onOpenChange, projectId, onSuccess }: EditProjectModalProps) {
  const { toast } = useToast();
  const t = useTranslations('projects');
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    address: "",
    budget: "",
    startDate: "",
    dueDate: "",
    description: "",
    status: "planning",
  });

  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    async function fetchClients() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("clients")
        .select("id, first_name, last_name, company_name");

      if (error) {
        console.error("Error fetching clients:", error);
        return;
      }

      setClients(data || []);
    }

    async function fetchProjectDetails() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects_new")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) {
        console.error("Error fetching project details:", error);
        toast({
          title: t('editProjectModal.errorUpdating'),
          description: t('editProjectModal.errorLoadingProject'),
          variant: 'destructive',
        });
        return;
      }

      setFormData({
        name: data.name,
        client: data.client_id,
        address: data.site_address_line1,
        budget: data.budget.toString(),
        startDate: data.start_date,
        dueDate: data.estimated_end_date,
        description: data.description,
        status: data.status,
      });
    }

    if (open) {
      fetchClients();
      fetchProjectDetails();
    }
  }, [open, projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("projects_new")
        .update({
          name: formData.name,
          client_id: formData.client,
          site_address_line1: formData.address,
          budget: parseFloat(formData.budget),
          start_date: formData.startDate,
          estimated_end_date: formData.dueDate,
          description: formData.description,
          status: formData.status,
        })
        .eq("id", projectId);

      if (error) {
        throw error;
      }

      toast({
        title: t('editProjectModal.projectUpdated'),
        description: t('editProjectModal.projectUpdatedDesc', { projectName: formData.name }),
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      //console.error("Error updating project:", error);
      toast({
        title: t('editProjectModal.errorUpdating'),
        description: error.message || t('editProjectModal.errorUpdatingDesc'),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('editProjectModal.title')}</DialogTitle>
          <DialogDescription>{t('editProjectModal.description')}</DialogDescription>
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
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
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
            <Button type="submit">{t('editProjectModal.updateProject')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
