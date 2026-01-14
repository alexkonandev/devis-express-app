// app/(info)/aide/page.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AidePage() {
  return (
    <>
      {/* Plus besoin de <nav> ni de <main>, le layout s'en occupe */}
      <header className="mb-12">
        <h1 className="text-[36px] font-extrabold tracking-tighter leading-none mb-4">
          Centre d&apos;aide
        </h1>
        <p className="text-muted-foreground text-[16px]">
          Tout ce que vous devez savoir pour piloter votre entreprise avec
          DevisExpress.
        </p>
      </header>

      <section className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {/* Question 1: Tarif */}
          <AccordionItem
            value="item-1"
            className="border-[oklch(0.92_0.01_250)]"
          >
            <AccordionTrigger className="text-[18px] font-semibold font-sans py-6">
              Combien coûte l&apos;abonnement DevisExpress ?
            </AccordionTrigger>
            <AccordionContent className="text-[16px] leading-relaxed pb-6 text-muted-foreground">
              Le tarif est unique et sans frais cachés :{" "}
              <span className="font-mono font-bold text-[oklch(0.55_0.20_250)]">
                5 000 FCFA / mois
              </span>
              . Cela vous donne un accès illimité à la création de devis,
              factures et à la gestion de vos clients ivoiriens.
            </AccordionContent>
          </AccordionItem>

          {/* Question 2: Sécurité */}
          <AccordionItem
            value="item-2"
            className="border-[oklch(0.92_0.01_250)]"
          >
            <AccordionTrigger className="text-[18px] font-semibold font-sans py-6">
              Mes données commerciales sont-elles sécurisées ?
            </AccordionTrigger>
            <AccordionContent className="text-[16px] leading-relaxed pb-6 text-muted-foreground">
              Absolument. Vos montants et listes de clients sont cryptés. Nous
              n&apos;avons aucun accès visuel à vos données privées et nous ne
              les revendons jamais à des tiers.
            </AccordionContent>
          </AccordionItem>

          {/* Question 3: Fiscalité */}
          <AccordionItem
            value="item-3"
            className="border-[oklch(0.92_0.01_250)]"
          >
            <AccordionTrigger className="text-[18px] font-semibold font-sans py-6">
              Le service est-il adapté à la fiscalité de Côte d&apos;Ivoire ?
            </AccordionTrigger>
            <AccordionContent className="text-[16px] leading-relaxed pb-6 text-muted-foreground">
              Oui, DevisExpress permet de configurer les taxes locales comme la{" "}
              <span className="font-mono text-sm bg-muted px-1 rounded">
                TVA (18%)
              </span>{" "}
              ou l&apos;
              <span className="font-mono text-sm bg-muted px-1 rounded">
                AIRSI
              </span>
              .
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA Support */}
      <div className="mt-16 p-8 bg-[oklch(0.96_0.01_250)] rounded-[10px] border border-[oklch(0.92_0.01_250)] flex flex-col items-center text-center gap-6">
        <div className="space-y-2">
          <h3 className="text-[24px] font-bold tracking-tight">
            Encore une question ?
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Notre équipe est disponible pour vous accompagner dans la croissance
            de votre business.
          </p>
        </div>
        <Button
          asChild
          className="bg-[oklch(0.55_0.20_250)] hover:bg-[oklch(0.45_0.18_250)] text-white gap-2 px-8 py-6 rounded-[10px] text-[16px] font-bold transition-all"
        >
          <Link href="/contact">
            <MessageCircle className="w-5 h-5" />
            Contacter le support
          </Link>
        </Button>
      </div>
    </>
  );
}
