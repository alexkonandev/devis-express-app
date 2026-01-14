// app/(legal)/mentions-legales/page.tsx

export default function MentionsLegalesPage() {
  return (
    <>
      {/* En-tête - Figtree ExtraBold pour l'ancrage visuel */}
      <header className="mb-12">
        <h1 className="text-[36px] font-extrabold tracking-tighter text-[oklch(0.12_0.02_252)] font-sans mb-4">
          Mentions Légales
        </h1>
        <p className="font-mono text-[14px] font-medium text-[oklch(0.55_0.20_250)] uppercase tracking-widest">
          Transparence et Responsabilité
        </p>
      </header>

      {/* Corps - Rythme mathématique de 32px (2rem) entre sections */}
      <section className="space-y-12 text-[16px] leading-relaxed font-sans text-[oklch(0.12_0.02_252)]">
        {/* Éditeur du site */}
        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold tracking-tight border-b border-[oklch(0.92_0.01_250)] pb-2">
            1. Édition du Site
          </h2>
          <div className="bg-[oklch(0.96_0.01_250)] p-6 rounded-[10px] space-y-2 border border-[oklch(0.92_0.01_250)]">
            <p>
              <strong>Nom Commercial :</strong> DevisExpress
            </p>
            <p>
              <strong>Structure :</strong> [Ton Nom ou Nom de ta Société]
            </p>
            <p>
              <strong>Siège Social :</strong> Abidjan, Côte d&apos;Ivoire
            </p>
            <p className="flex gap-2 items-center">
              <strong>RCCM :</strong>
              <code className="font-mono text-sm bg-white px-2 py-0.5 rounded border">
                CI-ABJ-00-0000-X-000
              </code>
            </p>
          </div>
        </div>

        {/* Responsable de la publication */}
        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold tracking-tight">
            2. Responsable de la Publication
          </h2>
          <p>
            Le responsable du contenu et de l&apos;administration de la
            plateforme est joignable directement pour toute question relative au
            fonctionnement du service :
          </p>
          <p className="font-mono text-[14px] font-medium text-[oklch(0.55_0.20_250)]">
            contact@devisexpress.ci
          </p>
        </div>

        {/* Hébergement - Crucial pour la localisation des données */}
        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold tracking-tight">
            3. Hébergement
          </h2>
          <p>
            Afin de garantir une disponibilité de 99.9% et une sécurité
            maximale, le site DevisExpress est hébergé par :
          </p>
          <div className="p-4 border border-[oklch(0.92_0.01_250)] rounded-[10px]">
            <p className="font-bold">Vercel Inc.</p>
            <p className="text-sm text-muted-foreground">
              440 N Barranca Ave #4133, Covina, CA 91723, USA
            </p>
            <p className="text-sm text-muted-foreground underline">
              https://vercel.com
            </p>
          </div>
        </div>

        {/* Propriété Intellectuelle */}
        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold tracking-tight">
            4. Propriété Intellectuelle
          </h2>
          <p>
            L&apos;ensemble de la plateforme (structure, design, logo,
            algorithmes de calcul) est la propriété exclusive de DevisExpress.
            Toute reproduction, même partielle, sans autorisation préalable est
            strictement interdite.
          </p>
        </div>
      </section>
    </>
  );
}
