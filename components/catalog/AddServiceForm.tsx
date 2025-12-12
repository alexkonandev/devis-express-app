// components/catalog/AddServiceForm.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { serviceItemSchema, ServiceItemSchema } from "@/lib/schemas";
import { upsertItemAction } from "@/app/actions/item.actions";

// UI Components (Shadcn imports)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";

interface AddServiceFormProps {
  onSuccess: () => void;
}

export const AddServiceForm = ({ onSuccess }: AddServiceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Initialisation du Formulaire avec Zod Resolver
  const form = useForm<ServiceItemSchema>({
    resolver: zodResolver(serviceItemSchema),
    defaultValues: {
      title: "",
      description: "",
      unitPriceEuros: 0,
      defaultQuantity: 1,
      category: "Tech", // Valeur par défaut
      isTaxable: true,
    },
  });

  // 2. Gestionnaire de Soumission
  const onSubmit = async (values: ServiceItemSchema) => {
    setIsSubmitting(true);
    try {
      const result = await upsertItemAction(values);

      if (result.success) {
        toast.success("Service créé avec succès", {
          description: `${values.title} a été ajouté au catalogue.`,
        });
        form.reset();
        onSuccess(); // Ferme le Sheet
      } else {
        toast.error("Erreur lors de la création", {
          description: result.message || "Une erreur inconnue est survenue.",
        });
      }
    } catch (error) {
      toast.error("Erreur critique", {
        description: "Impossible de contacter le serveur.",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
        {/* TITRE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du Service</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Audit SEO Technique" {...field} />
              </FormControl>
              <FormDescription>
                Le nom affiché sur vos devis et factures.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CATÉGORIE & PRIX (Grid Layout) */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tech">Tech & Dev</SelectItem>
                    <SelectItem value="Design">Design & Créa</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Admin">Administratif</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitPriceEuros"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix Unitaire (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* DESCRIPTION */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description / Scope (Optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Détaillez les prestations incluses..."
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* OPTIONS AVANCÉES */}
        <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel className="text-base">TVA Applicable</FormLabel>
            <FormDescription>
              Ce service est-il soumis à la taxe ?
            </FormDescription>
          </div>
          <FormField
            control={form.control}
            name="isTaxable"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* BOUTON DE SOUMISSION */}
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-md font-bold transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer le Service
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
