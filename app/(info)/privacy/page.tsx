// app/(info)/privacy/page.tsx

export default function PrivacyPage() {
  const dataPoints = [
    {
      label: "Identité",
      type: "Professionnel",
      storage: "Encrypted",
      duration: "Active",
    },
    {
      label: "Flux Financiers",
      type: "Transactionnel",
      storage: "Isolated",
      duration: "7 Ans",
    },
    {
      label: "Base Clients",
      type: "Propriété Client",
      storage: "Private",
      duration: "Indéterminé",
    },
  ];

  return (
    <div className="flex flex-col gap-16">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="h-[2px] w-12 bg-indigo-600" />
          <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-widest">
            Security_Protocol_V1
          </span>
        </div>
        <h1 className="text-[40px] font-black uppercase tracking-[0.05em] text-slate-950 leading-none">
          Data_Privacy
        </h1>
        <p className="text-[15px] text-slate-500 font-medium max-w-xl">
          Transparence totale sur l&apos;ingénierie de vos données. Nous bâtissons
          une forteresse pour votre patrimoine entrepreneurial.
        </p>
      </header>

      {/* TABLEAU DE FLUX : Vision technique immédiate */}
      <section className="border-2 border-slate-950">
        <div className="bg-slate-950 p-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
            Architecture_des_Données
          </h2>
        </div>
        <div className="divide-y divide-slate-200">
          {dataPoints.map((point) => (
            <div
              key={point.label}
              className="grid grid-cols-2 md:grid-cols-4 p-4 gap-4"
            >
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase">
                  Point_Entrée
                </span>
                <span className="text-[13px] font-bold text-slate-950">
                  {point.label}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase">
                  Type_Data
                </span>
                <span className="text-[13px] font-mono text-slate-600 font-bold">
                  {point.type}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase">
                  Stockage
                </span>
                <span className="text-[13px] font-mono text-indigo-600 font-bold">
                  {point.storage}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase">
                  Rétention
                </span>
                <span className="text-[13px] font-bold text-slate-950">
                  {point.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTENU ANALYTIQUE */}
      <div className="grid gap-12">
        <div className="space-y-4">
          <h3 className="text-[18px] font-black uppercase text-slate-950 border-b-2 border-slate-100 pb-2">
            01. Zéro_Exploitation_Commerciale
          </h3>
          <p className="text-[15px] leading-relaxed text-slate-700">
            Contrairement aux solutions &quot;gratuites&quot;, Devis Express n&apos;analyse pas
            vos factures pour revendre des tendances de marché. Votre activité
            reste votre secret industriel.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-[18px] font-black uppercase text-slate-950 border-b-2 border-slate-100 pb-2">
            02. Chiffrement_End_to_End
          </h3>
          <p className="text-[15px] leading-relaxed text-slate-700">
            Chaque tunnel de données est sécurisé par un chiffrement AES-256.
            L&apos;accès à vos bases clients est restreint par des jetons
            d&apos;authentification uniques et rotatifs.
          </p>
        </div>
      </div>

      <footer className="p-8 border-2 border-dashed border-slate-200 flex flex-col items-center text-center gap-4">
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
          Data_Sovereignty_Confirmed
        </span>
        <p className="text-[13px] text-slate-500 max-w-sm italic">
          &quot;Votre base client est votre plus grand actif. Notre mission est de la
          rendre imprenable.&quot;
        </p>
      </footer>
    </div>
  );
}
