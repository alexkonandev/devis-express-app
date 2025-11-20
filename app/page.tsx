"use client"; // Important car nous ajoutons de l'interactivité (useState)

import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheckIcon,
  CalculatorIcon,
  DocumentArrowDownIcon,
  PencilSquareIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  // État pour gérer l'onglet affiché dans le Hero (Éditeur vs Dashboard)
  const [heroTab, setHeroTab] = useState("editor"); // 'editor' ou 'dashboard'

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="font-bold text-lg tracking-tight flex items-center gap-2">
              
              <span>DEVIS EXPRESS</span>
            </div>
            <div className="flex items-center gap-x-4">
              <a
                href="/mes-devis"
                className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Mes devis
              </a>
              <a
                href="/creer"
                className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-all shadow-sm hover:shadow-md"
              >
                Créer un devis
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-y-24 py-20 md:py-28">
          {/* HERO SECTION */}
          <section className="flex flex-col items-center text-center gap-y-8">
            

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl text-neutral-900">
              Vos devis, <br className="hidden md:block" />
              <span className="text-neutral-400">sans la prise de tête.</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-700 max-w-2xl leading-relaxed">
              L'outil gratuit pour les freelances qui veulent passer moins de
              temps sur l'administratif et plus de temps à facturer.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a
                href="/creer"
                className="w-full sm:w-auto px-8 py-4 text-center font-semibold bg-neutral-900 text-white rounded-xl hover:bg-black hover:scale-105 transition-all shadow-lg shadow-neutral-500/20"
              >
                Créer mon premier devis
              </a>
              <a
                href="#fonctionnalites"
                className="w-full sm:w-auto px-8 py-4 text-center font-medium text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Voir la démo
              </a>
            </div>

            {/* --- INTERFACE PREVIEW (INTERACTIVE) --- */}
            <div className="mt-16 w-full max-w-5xl group">
              <div className="relative rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-200/50 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]">
                {/* Browser Bar with Tabs */}
                <div className="h-14 bg-white border-b border-neutral-100 flex items-center justify-between px-4 sticky top-0 z-20">
                  {/* Traffic Lights */}
                  <div className="flex gap-x-2 w-20">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>

                  {/* Tabs Switcher */}
                  <div className="flex p-1 bg-neutral-100 rounded-lg border border-neutral-200/50">
                    <button
                      onClick={() => setHeroTab("editor")}
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        heroTab === "editor"
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-700"
                      }`}
                    >
                      <PencilSquareIcon className="w-3.5 h-3.5" />
                      Éditeur
                    </button>
                    <button
                      onClick={() => setHeroTab("dashboard")}
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        heroTab === "dashboard"
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-700"
                      }`}
                    >
                      <ListBulletIcon className="w-3.5 h-3.5" />
                      Mes Devis
                    </button>
                  </div>

                  {/* Spacer for balance */}
                  <div className="w-20 text-right">
                    <div className="hidden sm:block text-[10px] text-neutral-300 font-mono">
                      localhost:3000
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="relative w-full aspect-[16/10] bg-neutral-50 overflow-hidden">
                  {/* Image Editor */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                      heroTab === "editor"
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0"
                    }`}
                  >
                    {/* Remplace par ton image d'éditeur */}
                    <Image
                      src="/preview-editor.png"
                      alt="Interface de création de devis"
                      fill
                      className="object-cover object-top"
                      priority
                    />
                  </div>

                  {/* Image Dashboard */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                      heroTab === "dashboard"
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0"
                    }`}
                  >
                    {/* Remplace par ton image de dashboard (Mes devis) */}
                    <Image
                      src="/preview-dashboard.png"
                      alt="Interface de gestion des devis"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-neutral-400 italic">
                *Cliquez sur les onglets ci-dessus pour explorer l'interface
              </p>
            </div>
          </section>

          {/* FEATURES SECTION */}
          <section
            className="flex flex-col items-center gap-y-16"
            id="fonctionnalites"
          >
            <div className="text-center max-w-2xl space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                Tout ce qu'il faut. <br />
                Rien de superflu.
              </h2>
              <p className="text-neutral-500">
                Nous avons supprimé la complexité des logiciels comptables pour
                ne garder que l'essentiel : la vitesse et l'efficacité.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div className="group rounded-2xl bg-white border border-neutral-100 p-8 shadow-sm hover:shadow-md hover:border-neutral-200 transition-all">
                <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheckIcon className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="font-bold text-lg mb-2">100% Local & Privé</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Pas de base de données dans le cloud. Vos clients et vos
                  montants restent stockés dans votre navigateur. Zéro fuite
                  possible.
                </p>
              </div>
              <div className="group rounded-2xl bg-white border border-neutral-100 p-8 shadow-sm hover:shadow-md hover:border-neutral-200 transition-all">
                <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CalculatorIcon className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="font-bold text-lg mb-2">Calculs Temps Réel</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Modifiez une quantité, la TVA s'ajuste instantanément.
                  Appliquez une remise en euros, le total se met à jour.
                  Magique.
                </p>
              </div>
              <div className="group rounded-2xl bg-white border border-neutral-100 p-8 shadow-sm hover:shadow-md hover:border-neutral-200 transition-all">
                <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DocumentArrowDownIcon className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="font-bold text-lg mb-2">PDF Ultra Clean</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Un design minimaliste et professionnel généré en haute
                  définition. Prêt à être envoyé et signé par votre client.
                </p>
              </div>
            </div>
          </section>

          {/* PREVIEW PDF SECTION */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-12">
            <div className="flex flex-col gap-y-6 order-2 lg:order-1">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Le Rendu Final
              </span>
              <h2 className="text-4xl font-bold tracking-tighter text-neutral-900">
                Vos clients jugent la qualité de votre devis.
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Un document mal aligné ou pixelisé renvoie une image amateur.
                Notre moteur de rendu PDF génère des documents vectoriels, nets
                et parfaitement structurés.
              </p>
              <ul className="space-y-3 mt-2">
                {[
                  "Mise en page automatique",
                  "Mentions légales incluses",
                  "Total HT/TTC clair",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-neutral-700 font-medium"
                  >
                    <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center text-white">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full order-1 lg:order-2">
              <div className="relative rounded-2xl border border-neutral-200 bg-neutral-100/50 p-8 md:p-12">
                <div className="absolute inset-0 bg-grid-neutral-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                <div className="relative shadow-2xl shadow-neutral-900/10 rounded-sm overflow-hidden border border-neutral-200 bg-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  {/* Image PDF Preview */}
                  <div className="relative w-full aspect-[1/1.4]">
                    <Image
                      src="/pdf-preview.png"
                      alt="Exemple de PDF généré"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA SECTION */}
          <section className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white py-20 px-6 text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
                Prêt à facturer ?
              </h2>
              <p className="text-lg text-neutral-300">
                Rejoignez les freelances qui ont arrêté de se battre avec Word
                et Excel pour faire leurs devis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <a
                  href="/creer"
                  className="px-8 py-4 text-center font-bold bg-white text-neutral-900 rounded-xl hover:bg-neutral-100 transition-colors"
                >
                  Créer un devis maintenant
                </a>
              </div>
              <p className="text-xs text-neutral-500 mt-4">
                Pas de carte bancaire requise • Pas d'inscription
              </p>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="border-t border-neutral-200 py-12 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-neutral-900">
                DEVIS EXPRESS
              </span>
              <span className="text-neutral-400 text-sm">
                © {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex gap-x-8">
              <a
                href="#"
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Mentions Légales
              </a>
              <a
                href="#"
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Contact
              </a>
              <a
                href="#"
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
