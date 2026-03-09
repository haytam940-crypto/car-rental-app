import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Eson Maroc Ouarzazate",
  description:
    "Contactez Eson Maroc à Ouarzazate. Tél : +212.524.89.05.62 — GSM : +212.666.89.08.99. Av. Mohamed VI, en face de la RAM, Ouarzazate.",
  alternates: { canonical: "https://www.eson-maroc.com/contact" },
  openGraph: {
    title: "Contact Eson Maroc — Location voiture Ouarzazate",
    description: "Contactez-nous par téléphone, WhatsApp ou formulaire. Av. Mohamed VI, Ouarzazate, Maroc.",
    url: "https://www.eson-maroc.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
