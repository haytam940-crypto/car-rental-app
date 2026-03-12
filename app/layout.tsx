import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SiteThemeProvider } from "@/contexts/SiteThemeContext";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

const BASE = "https://www.eson-maroc.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Eson Maroc — Location de Voitures à Ouarzazate",
    template: "%s | Eson Maroc",
  },
  description:
    "Location de voitures à Ouarzazate, Maroc. Large choix de véhicules, prix transparents, livraison à domicile, excursions désert & montagne. Réservation en ligne 24h/24.",
  keywords: [
    "location voiture Ouarzazate",
    "location voiture Maroc",
    "car rental Ouarzazate",
    "location voiture désert",
    "excursion Sahara Ouarzazate",
    "Eson Maroc",
    "location véhicule Maroc",
    "voiture de location Ouarzazate",
  ],
  authors: [{ name: "Eson Maroc", url: BASE }],
  creator: "Eson Maroc",
  publisher: "Eson Maroc",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: BASE,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: BASE,
    siteName: "Eson Maroc",
    title: "Eson Maroc — Location de Voitures à Ouarzazate",
    description:
      "Location de voitures à Ouarzazate. Large choix, livraison à domicile, excursions désert & montagne. Réservez en ligne.",
    images: [
      {
        url: `${BASE}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Eson Maroc — Location de Voitures à Ouarzazate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eson Maroc — Location de Voitures à Ouarzazate",
    description:
      "Location de voitures à Ouarzazate. Large choix, livraison à domicile, excursions désert & montagne.",
    images: [`${BASE}/og-image.jpg`],
  },
  verification: {
    google: "", // Ajoutez votre code Google Search Console ici
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CarRental",
  name: "Eson Maroc",
  description:
    "Location de voitures à Ouarzazate, Maroc. Excursions désert et montagne.",
  url: BASE,
  telephone: "+212524890562",
  email: "contact@eson-maroc.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Mohamed VI, en face de la RAM",
    addressLocality: "Ouarzazate",
    addressCountry: "MA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 30.9189,
    longitude: -6.8936,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "20:00",
    },
  ],
  priceRange: "$$",
  currenciesAccepted: "MAD",
  paymentAccepted: "Cash, Credit Card",
  areaServed: [
    { "@type": "City", name: "Ouarzazate" },
    { "@type": "City", name: "Marrakech" },
    { "@type": "City", name: "Agadir" },
    { "@type": "Country", name: "Maroc" },
  ],
  sameAs: [],
  hasMap: "https://www.openstreetmap.org/?mlat=30.9189&mlon=-6.8936",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <SiteThemeProvider>
            {children}
            <WhatsAppButton />
          </SiteThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
