import type { Metadata } from "next";
// Importer Figtree et JetBrains Mono
import { Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Configurer Figtree comme police principale (sans-serif)
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree", // Variable CSS pour la police "sans"
  display: "swap", // Assure un affichage rapide
});

// Configurer JetBrains Mono comme police "mono"
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono", // Variable CSS pour la police "mono"
  display: "swap",
});

export const metadata: Metadata = {
  title: "Devis Express",
  description: "Générez vos devis professionnels en quelques secondes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Appliquer les deux variables à la balise <html>
    <html lang="fr" className={`${figtree.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
