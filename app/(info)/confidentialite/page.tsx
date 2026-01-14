// app/(legal)/confidentialite/page.tsx

export default function ConfidentialitePage() {
  return (
    <>
      {/* En-tête - Typographie Figtree ExtraBold pour l'autorité */}
      <header className="mb-12">
        <h1 className="text-[36px] font-extrabold tracking-tighter text-[oklch(0.12_0.02_252)] font-sans mb-4">
          Politique de Confidentialité
        </h1>
        <p className="font-mono text-[14px] font-medium text-[oklch(0.55_0.20_250)]">
          DERNIÈRE MISE À JOUR : 14 JANVIER 2026
        </p>
      </header>

      {/* Corps - Espacement de 32px entre sections */}
      <section className="space-y-8 text-[16px] leading-relaxed font-sans text-[oklch(0.12_0.02_252)]">
        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold tracking-tight">
            1. Notre Engagement de Confiance
          </h2>
          <p>
            Chez DevisExpress, nous considérons que vos données financières sont
            le cœur de votre entreprise. Nous appliquons une politique de
            tolérance zéro concernant l&apos;accès non autorisé à vos
            informations.
          </p>
        </div>

        {/* Bloc d'argument de vente majeur */}
        <div className="bg-[oklch(0.96_0.01_250)] p-6 rounded-[10px] border-l-4 border-[oklch(0.55_0.20_250)] space-y-3">
          <h3 className="font-bold text-[oklch(0.55_0.20_250)] uppercase text-xs tracking-widest">
            Sécurité Critique
          </h3>
          <p className="font-semibold italic">
            &quot;Vos montants de devis, listes de clients et marges
            bénéficiaires sont cryptés de bout en bout. DevisExpress ne revend,
            ne partage et n&apos;exploite jamais vos données à des fins
            commerciales.&quot;
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold tracking-tight">
            2. Données Collectées
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              <strong>Identité :</strong> Nom, email et téléphone pour la
              gestion du compte.
            </li>
            <li>
              <strong>Entreprise :</strong> RCCM, logo et adresse pour la
              personnalisation des documents.
            </li>
            <li>
              <strong>Activité :</strong> Détails des devis et factures pour
              assurer le service de génération PDF.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold tracking-tight">
            3. Conservation et Localisation
          </h2>
          <p>
            Vos données sont conservées pendant toute la durée de votre
            abonnement. En cas de résiliation, vous disposez d&apos;un délai de
            <span className="font-mono text-sm bg-muted px-1 rounded">
              30 jours
            </span>{" "}
            pour exporter vos archives avant leur suppression définitive de nos
            serveurs sécurisés.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold tracking-tight">
            4. Vos Droits
          </h2>
          <p>
            Conformément à la protection des données à caractère personnel, vous
            disposez d&apos;un droit d&apos;accès, de rectification et de
            suppression de vos données. Pour toute demande, contactez notre
            support technique via la page contact.
          </p>
        </div>
      </section>
    </>
  );
}
