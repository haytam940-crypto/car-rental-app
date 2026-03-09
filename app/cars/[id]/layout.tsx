import type { Metadata } from "next";
import { CARS } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const car = CARS.find(c => c.id === id);

  if (!car) {
    return {
      title: "Véhicule — Eson Maroc",
      description: "Location de voiture à Ouarzazate avec Eson Maroc.",
    };
  }

  const title = `${car.brand} ${car.name} — Location à Ouarzazate`;
  const description = `Louez une ${car.brand} ${car.name} à Ouarzazate à partir de ${car.pricePerDay} DH/jour. Livraison disponible. Réservez en ligne sur Eson Maroc.`;
  const url = `https://www.eson-maroc.com/cars/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: car.image ? [{ url: car.image, alt: `${car.brand} ${car.name}` }] : [],
    },
  };
}

export async function generateStaticParams() {
  return CARS.map(car => ({ id: car.id }));
}

export default function CarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
