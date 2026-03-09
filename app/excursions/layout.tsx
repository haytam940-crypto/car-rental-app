import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Excursions Désert & Montagne — Ouarzazate",
  description:
    "Excursions depuis Ouarzazate : Sahara, dunes de l'Erg Chebbi, gorges du Dadès, vallée du Drâa, Aït Ben Haddou. Guides locaux, prix compétitifs.",
  alternates: { canonical: "https://www.eson-maroc.com/excursions" },
  openGraph: {
    title: "Excursions Ouarzazate — Sahara, Montagne, Désert",
    description: "Découvrez le Sahara, les gorges du Dadès et Aït Ben Haddou depuis Ouarzazate avec Eson Maroc.",
    url: "https://www.eson-maroc.com/excursions",
  },
};

export default function ExcursionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
