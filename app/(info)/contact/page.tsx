// app/(info)/contact/page.tsx
"use client";

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactInput } from "@/lib/validations/contact";
import { sendContactAction } from "@/actions/contact-action"; // Import ajusté
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema) as Resolver<ContactInput>,
  });

  const onSubmit = async (data: ContactInput) => {
    const response = await sendContactAction(data);

    if (response.success) {
      toast.success("Message envoyé. Nous revenons vers vous rapidement !");
      reset();
    } else {
      toast.error("Échec de l'envoi. Veuillez réessayer.");
    }
  };

  return (
    <>
      <header className="mb-12">
        <h1 className="text-[36px] font-extrabold tracking-tighter leading-none mb-4 font-sans">
          Contactez-nous
        </h1>
        <p className="text-muted-foreground text-[16px] font-sans">
          Besoin d&apos;assistance technique ou d&apos;une offre sur mesure ?
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold font-sans">Nom complet</label>
          <Input
            {...register("name")}
            className="rounded-[10px] border-[oklch(0.92_0.01_250)]"
            placeholder="Ex: Kouassi Konan"
          />
          {errors.name && (
            <p className="text-destructive text-xs font-mono">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold font-sans">Sujet</label>
          <select
            {...register("subject")}
            className="w-full h-10 px-3 rounded-[10px] border border-[oklch(0.92_0.01_250)] bg-background text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.20_250)]"
          >
            <option value="support">Support Technique</option>
            <option value="facturation">Facturation / Tarifs</option>
            <option value="partenariat">Partenariat Business</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold font-sans">Message</label>
          <Textarea
            {...register("message")}
            className="min-h-37.5 rounded-[10px] border-[oklch(0.92_0.01_250)] font-sans"
            placeholder="Détaillez votre demande..."
          />
          {errors.message && (
            <p className="text-destructive text-xs font-mono">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-6 bg-[oklch(0.55_0.20_250)] text-white font-bold rounded-[10px] hover:bg-[oklch(0.45_0.18_250)] transition-all"
        >
          {isSubmitting ? "Traitement..." : "Envoyer la demande"}
        </Button>
      </form>
    </>
  );
}
