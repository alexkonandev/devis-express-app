// app/(legal)/conditions-generales/page.tsx

export default function CGUPage() {
  return (
    <>
      {/* En-tête de la page - Utilise Figtree ExtraBold pour le H1 */}
      <header className="mb-12">
        <h1 className="text-[36px] font-extrabold tracking-tighter text-[oklch(0.12_0.02_252)] font-sans mb-4">
          Conditions Générales d&apos;Utilisation
        </h1>
        <p className="font-mono text-[14px] font-medium text-[oklch(0.55_0.20_250)]">
          VERSION 1.0 — EN VIGUEUR AU 14 JANVIER 2026
        </p>
      </header>

      {/* Corps du texte - Respecte le rythme de 32px (2rem) entre les blocs majeurs */}
      <section className="space-y-8 text-[16px] leading-relaxed font-sans text-[oklch(0.12_0.02_252)]">
        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold tracking-tight">
            1. Objet du Service
          </h2>
          <p>
            DevisExpress fournit une plateforme SaaS de facturation et de
            gestion commerciale destinée aux entrepreneurs et PME en Côte
            d&apos;Ivoire. Le service inclut la génération de devis, factures,
            et le suivi des paiements en conformité avec les usages locaux.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold tracking-tight">
            2. Tarification et Paiement
          </h2>
          <p>
            L&apos;accès complet aux services est soumis à un abonnement mensuel
            de :
          </p>
          <div className="bg-[oklch(0.96_0.01_250)] p-6 rounded-[10px] border border-[oklch(0.92_0.01_250)]">
            <span className="font-mono text-[20px] font-bold text-[oklch(0.55_0.20_250)]">
              5 000 FCFA / MOIS
            </span>
          </div>
          <p className="text-sm italic text-muted-foreground">
            Tout mois entamé est dû. Le non-paiement entraîne la suspension
            immédiate des accès après un préavis de 7 jours.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold tracking-tight">
            3. Responsabilité Fiscale
          </h2>
          <p>
            DevisExpress est un outil d&apos;aide à la gestion.
            L&apos;utilisateur est seul responsable de la véracité des taux de
            taxes appliqués (TVA, AIRSI, etc.) et de ses déclarations auprès de
            la Direction Générale des Impôts (DGI) de Côte d&apos;Ivoire.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold tracking-tight">
            4. Protection des Données
          </h2>
          <p>
            Conformément aux standards de sécurité, toutes vos données de
            facturation sont cryptées. Nous nous engageons à ne jamais vendre ou
            partager vos données commerciales à des tiers sans votre accord
            explicite.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold tracking-tight">
            5. Droit Applicable et Juridiction
          </h2>
          <p>
            Les présentes conditions sont régies par le droit ivoirien. En cas
            de litige et à défaut d&apos;accord amiable, compétence exclusive
            est attribuée au{" "}
            <strong>Tribunal de Commerce d&apos;Abidjan</strong>.
          </p>
        </div>
      </section>
    </>
  );
}
