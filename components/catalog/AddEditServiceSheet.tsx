"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Edit } from "lucide-react";
import { ServiceItem, ItemInput } from "@/lib/types"; // Updated imports
import { serviceItemSchema, ServiceItemSchema } from "@/lib/schemas";

// Shadcn Imports (Directs)
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddEditServiceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ItemInput) => Promise<void>;
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
    defaultValues: {
      ...initialData,
      // SÉCURITÉ CRITIQUE : On injecte explicitement les champs riches dans le form
      // pour que react-hook-form les conserve en mémoire (state)
      pricing: (initialData as any).pricing ?? undefined,
      technicalScope: (initialData as any).technicalScope ?? undefined,
      salesCopy: (initialData as any).salesCopy ?? undefined,
      marketContext: (initialData as any).marketContext ?? undefined,
    },
  });

  // Reset intelligent quand le modal s'ouvre ou que la data change
  useEffect(() => {
    if (isOpen) {
      form.reset({
        ...initialData,
        pricing: (initialData as any).pricing,
        technicalScope: (initialData as any).technicalScope,
        salesCopy: (initialData as any).salesCopy,
        marketContext: (initialData as any).marketContext,
      });
    }
  }, [isOpen, initialData, form]);

  const onSubmit = async (values: ServiceItemSchema) => {
    setIsSaving(true);
    // On passe values qui contient maintenant title, price... ET les champs JSON cachés
    await onSave(values as ItemInput);
    setIsSaving(false);
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
              ? "Création manuelle d'un service simple."
              : "Les données avancées (Scope, Tiers) sont préservées."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* --- UI DU FORMULAIRE (Identique, car on cache la complexité) --- */}

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Titre
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        defaultValue={field.value || "Divers"}
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
                          <SelectItem value="Divers">Divers</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Description
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

              <FormField
                control={form.control}
                name="isTaxable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-200 p-4 bg-white">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-zinc-900">
                        Soumis à la TVA
                      </FormLabel>
                      <FormDescription>
                        Calcul automatique dans les devis.
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

              <div className="pt-4 sticky bottom-0 -mx-6 px-6 py-4 border-t border-zinc-200 bg-white/80 backdrop-blur-sm">
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Sauvegarder"
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
