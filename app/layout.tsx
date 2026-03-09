import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SiteThemeProvider } from "@/contexts/SiteThemeContext";

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
            <a
              href="https://wa.me/212666890899"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contacter Eson Maroc sur WhatsApp"
              className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#1ebe5d] hover:scale-110 transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" fill="white" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </SiteThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
