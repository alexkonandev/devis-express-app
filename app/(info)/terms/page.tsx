// app/(info)/terms/page.tsx

export default function TermsPage() {
  const clauses = [
    {
      ref: "SYS-01",
      tag: "Usage",
      title: "Périmètre_Technique",
      desc: "Infrastructure SaaS dédiée à l'élite entrepreneuriale. L'usage est strictement réservé à la gestion commerciale légale.",
    },
    {
      ref: "SYS-02",
      tag: "Data",
      title: "Propriété_Intellectuelle",
      desc: "Vos données vous appartiennent à 100%. Nous ne sommes que les gardiens de votre patrimoine numérique.",
    },
    {
      ref: "SYS-03",
      tag: "Billing",
      title: "Règles_de_Facturation",
      desc: "Abonnements sans engagement, facturés au cycle. Accès coupé sous 48h en cas de défaut de paiement non régularisé.",
    },
    {
      ref: "SYS-04",
      tag: "Liability",
      title: "Responsabilité_Fiscale",
      desc: "L'utilisateur est seul garant de la conformité fiscale de ses documents générés par notre moteur.",
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* HEADER RADICAL */}
      <header className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b-4 border-slate-950 pb-12">
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">
            Official_Document_2026
          </span>
          <h1 className="text-[40px] font-black uppercase tracking-tighter leading-[0.95] text-slate-950">
            Conditions
            <br />
            Générales
          </h1>
        </div>
        <div className="flex flex-col justify-end md:items-end gap-2">
          <span className="text-[12px] font-mono font-bold text-slate-500 uppercase">
            Ver_3.0.4 // ABJ_CI
          </span>
          <div className="h-1 w-24 bg-slate-950" />
        </div>
      </header>

      {/* GRILLE DE CLAUSES TYPE "INDEX" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {clauses.map((clause) => (
          <div key={clause.ref} className="group flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 group-hover:border-indigo-600 transition-colors">
              <span className="text-[11px] font-mono font-black text-slate-400 group-hover:text-indigo-600">
                {clause.ref}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 px-2 py-0.5 text-slate-600">
                {clause.tag}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-[18px] font-black uppercase tracking-tight text-slate-950">
                {clause.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-slate-600 font-medium">
                {clause.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* BANDEAU DE VALIDATION TYPE "TICKET" */}
      <div className="mt-12 bg-indigo-600 text-white p-1 flex flex-col">
        <div className="border border-white/30 border-dashed p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
              Certification
            </span>
            <p className="text-[16px] font-bold leading-tight max-w-sm">
              L&apos;utilisation de l&apos;infrastructure vaut signature
              numérique du contrat de service.
            </p>
          </div>
          <div className="bg-white text-indigo-600 px-6 py-4 flex flex-col items-center">
            <span className="text-[20px] font-black font-mono tracking-tighter">
              VALIDATED
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              System_Auth
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
