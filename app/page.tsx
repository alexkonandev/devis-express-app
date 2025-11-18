import React from "react";
// 1. IMPORTER LE COMPOSANT IMAGE
import Image from "next/image";
import {
  ShieldCheckIcon,
  CalculatorIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="font-semibold text-lg tracking-tight">
              DEVIS EXPRESS
            </div>
            <div className="flex items-center gap-x-4">
              <a
                href="/mes-devis"
                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Mes devis
              </a>
              <a
                href="/creer"
                className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Créer un devis
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-y-24 py-24 md:py-32">
          <section className="flex flex-col items-center text-center gap-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter max-w-3xl">
              Passez de 0 au PDF. En 60 secondes.
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl">
              Devis Express est un outil gratuit qui génère des devis
              professionnels. Sans compte. Sans friction.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="/creer"
                className="px-6 py-3 text-center font-medium bg-neutral-900 text-white rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
              >
                Créer un devis gratuit
              </a>
              <a
                href="#fonctionnalites"
                className="px-6 py-3 text-center font-medium bg-white text-neutral-800 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors w-full sm:w-auto"
              >
                Comment ça marche ?
              </a>
            </div>

            <div className="mt-12 w-full max-w-4xl">
              <div className="relative rounded-xl border border-neutral-200 pb-4 bg-white shadow-lg [box-shadow:0_0_0_1px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.03),0_30px_60px_-10px_rgba(0,0,0,0.07)]">
                <div className="h-10 rounded-t-xl bg-neutral-50 border-b border-neutral-200 flex items-center p-4 ">
                  <div className="flex gap-x-2">
                    <span className="w-3 h-3 rounded-full bg-neutral-300"></span>
                    <span className="w-3 h-3 rounded-full bg-neutral-300"></span>
                    <span className="w-3 h-3 rounded-full bg-neutral-300"></span>
                  </div>
                </div>

                {/* --- 2. PREMIER ENDROIT MODIFIÉ --- */}
                <div className="relative w-full h-96 rounded-b-xl overflow-hidden bg-neutral-100/50 ">
                  <Image
                    src="/interface-previews.png"
                    alt="Aperçu de l'interface de Devis Express"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </section>

          <section
            className="flex flex-col items-center gap-y-12"
            id="fonctionnalites"
          >
            {/* ... (Section fonctionnalités inchangée) ... */}
            <div className="text-center max-w-2xl">
              <h2 className="text-4xl font-bold tracking-tighter">
                Conçu pour la vitesse.
                <br />
                Pas pour la paperasse.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-6 md:p-8">
                <ShieldCheckIcon className="w-8 h-8 text-neutral-900" />
                <h3 className="mt-4 font-semibold text-lg">
                  100% Privé. Zéro Compte.
                </h3>
                <p className="mt-2 text-neutral-600">
                  Aucune inscription. Vos données clients et vos devis restent
                  chez vous, sauvegardés localement dans votre navigateur.
                </p>
              </div>
              <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-6 md:p-8">
                <CalculatorIcon className="w-8 h-8 text-neutral-900" />
                <h3 className="mt-4 font-semibold text-lg">
                  Calculs Automatiques
                </h3>
                <p className="mt-2 text-neutral-600">
                  La TVA, les totaux HT/TTC et les remises sont calculés
                  instantanément. Fini les erreurs de calcul.
                </p>
              </div>
              <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-6 md:p-8">
                <DocumentArrowDownIcon className="w-8 h-8 text-neutral-900" />
                <h3 className="mt-4 font-semibold text-lg">
                  Export PDF Impeccable
                </h3>
                <p className="mt-2 text-neutral-600">
                  Générez un PDF au design professionnel en un clic, prêt à être
                  envoyé directement à votre client.
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-y-4">
              <span className="text-sm font-medium uppercase tracking-wider text-neutral-500">
                Le Résultat Final
              </span>
              <h2 className="text-4xl font-bold tracking-tighter">
                Un design qui inspire confiance.
              </h2>
              <p className="text-lg text-neutral-600">
                Le PDF final est le premier contact avec votre client. Notre
                template unique est épuré, professionnel et met en valeur votre
                marque sans effort.
              </p>
            </div>
            <div className="w-full">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xl [box-shadow:0_0_0_1px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.03),0_30px_60px_-10px_rgba(0,0,0,0.07)]">
                {/* --- 3. DEUXIÈME ENDROIT MODIFIÉ --- */}
                <div className="relative w-full h-96 rounded-lg overflow-hidden border border-neutral-200 ">
                  <Image
                    src="/pdf-preview.png"
                    alt="Aperçu d'un devis PDF généré par Devis Express"
                    fill
                    className="object-contain object-center p-4"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-neutral-950 text-white rounded-2xl">
            {/* ... (Section CTA inchangée) ... */}
            <div className="flex flex-col items-center gap-y-6 text-center p-12 md:p-16">
              <h2 className="text-4xl  tracking-tighter">
                Prêt à créer votre premier devis ?
              </h2>
              <p className="text-lg text-neutral-300 max-w-xl">
                Commencez en quelques secondes. Aucune carte de crédit, aucune
                inscription. Juste un outil qui fonctionne.
              </p>
              <a
                href="/creer"
                className="mt-4 px-6 py-3 text-center font-medium bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Commencer gratuitement
              </a>
            </div>
          </section>
        </div>

        <footer className="border-t border-neutral-200 py-10">
          {/* ... (Footer inchangé) ... */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} Devis Express.
            </p>
            <div className="flex gap-x-6">
              <a
                href="#"
                className="text-sm text-neutral-500 hover:text-neutral-800"
              >
                Confidentialité
              </a>
              <a
                href="#"
                className="text-sm text-neutral-500 hover:text-neutral-800"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
