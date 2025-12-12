// components/catalog/AddEditServiceSheet.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Edit } from "lucide-react";
import { ServiceItem, ItemInput } from "@/lib/types";
import { serviceItemSchema, ServiceItemSchema } from "@/lib/schemas";
// --- FIX ARCHITECTURAL : Imports de Shadcn direct (Remplacement de shadcn-stubs) ---
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
// ----------------------------------------------------------------------------------
interface AddEditServiceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ItemInput, itemId?: string) => Promise<void>;
  initialData: ItemInput | ServiceItem;
  isNew: boolean;
}

export const AddEditServiceSheet = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isNew,
}: AddEditServiceSheetProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ServiceItemSchema>({
    resolver: zodResolver(serviceItemSchema),
    defaultValues: initialData,
  });

  // Synchroniser les données d'édition lorsque la feuille s'ouvre ou que les données initiales changent
  useEffect(() => {
    if (isOpen) {
      form.reset(initialData);
    }
  }, [isOpen, initialData, form]);

  const onSubmit = async (values: ServiceItemSchema) => {
    setIsSaving(true);
    const itemId = isNew ? undefined : (initialData as ServiceItem).id;
    await onSave(values, itemId);
    setIsSaving(false);
    // onClose sera appelé par le callback onSave si succès.
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl flex flex-col p-0 gap-0 border-l border-zinc-200"
      >
        <SheetHeader className="px-6 py-5 border-b border-zinc-100 bg-white sticky top-0 z-10">
          <SheetTitle className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            {isNew ? (
              <Plus className="h-5 w-5 text-indigo-600" />
            ) : (
              <Edit className="h-5 w-5 text-zinc-600" />
            )}
            {isNew ? "Nouveau Service" : `Modifier : ${initialData.title}`}
          </SheetTitle>
          <SheetDescription className="text-zinc-500 text-sm">
            {isNew
              ? "Ajoutez une nouvelle prestation à votre catalogue."
              : "Modifiez les détails de ce service existant."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Titre */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Titre (Nom Commercial)
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Prix et Catégorie */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unitPriceEuros"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Prix (€ HT)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value ?? 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Catégorie
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tech">Tech & Dev</SelectItem>
                          <SelectItem value="Design">Design & Créa</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Consulting">Consulting</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Description (Scope)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[100px] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Taxable Switch */}
              <FormField
                control={form.control}
                name="isTaxable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-200 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-zinc-900">
                        Soumis à la TVA
                      </FormLabel>
                      <FormDescription>
                        Applique la taxe en vigueur sur ce service.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Footer de soumission (Collé au bas du formulaire) */}
              <div className="pt-4 sticky bottom-0 bg-zinc-50/50 -mx-6 px-6 py-4 border-t border-zinc-200">
                <Button
                  type="submit"
                  className="w-full h-10 transition-all bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Enregistrement...
                    </>
                  ) : (
                    `Sauvegarder le Service`
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
