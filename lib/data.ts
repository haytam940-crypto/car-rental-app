export type Car = {
  id: string;
  name: string;
  brand: string;
  pricePerDay: number;
  discount?: number; // pourcentage de réduction (ex: 20 = -20%)
  fuelType: "Essence" | "Diesel" | "Hybride" | "Electrique";
  transmission: "Automatique" | "Manuelle";
  description: string;
  images: string[];
  status: "available" | "rented" | "maintenance";
  year: number;
  seats: number;
  doors: number;
  category: string;
};

export type ChargeCategory =
  | "gazoil" | "lavage" | "vidange" | "vignette"
  | "assurance" | "credit_bail" | "accident" | "autre";

export const CHARGE_LABELS: Record<ChargeCategory, string> = {
  gazoil: "Gazoil",
  lavage: "Lavage",
  vidange: "Vidange",
  vignette: "Vignette",
  assurance: "Assurance",
  credit_bail: "Crédit bail (mensuel)",
  accident: "Accident",
  autre: "Autre",
};

export type CarCharge = {
  id: string;
  carId: string;
  category: ChargeCategory;
  amount: number;
  date: string;
  note?: string;
};

export type Reservation = {
  id: string;
  carId: string;
  clientFirstName: string;
  clientLastName: string;
  clientPhone: string;
  clientEmail: string;
  clientLicense: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  durationDays: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  message?: string;
  createdAt: string;
};

export const LOCATIONS = [
  "Casablanca | Aéroport Mohammed V",
  "Casablanca | Centre Ville",
  "Rabat | Centre Ville",
  "Marrakech | Aéroport Menara",
  "Marrakech | Gueliz",
  "Agadir | Aéroport Al Massira",
  "Agadir | Centre Ville",
  "Tanger | Aéroport Ibn Batouta",
  "Tanger | Centre Ville",
  "Fes | Centre Ville",
];

export const CARS: Car[] = [
  {
    id: "1",
    name: "Sandero",
    brand: "Dacia",
    pricePerDay: 250,
    fuelType: "Essence",
    transmission: "Manuelle",
    description: "La Dacia Sandero est la voiture économique idéale pour vos déplacements au Maroc. Fiable, spacieuse et économique en carburant, elle s'adapte parfaitement aux routes urbaines et interurbaines.",
    images: [
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800",
    ],
    status: "available",
    year: 2023,
    seats: 5,
    doors: 5,
    category: "Économique",
  },
  {
    id: "2",
    name: "Clio",
    brand: "Renault",
    pricePerDay: 300,
    fuelType: "Essence",
    transmission: "Manuelle",
    description: "La Renault Clio allie style, confort et performance. Idéale pour la ville comme pour les longs trajets, cette citadine polyvalente offre une conduite agreable et une consommation maitrisee.",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
    ],
    status: "available",
    year: 2023,
    seats: 5,
    doors: 5,
    category: "Citadine",
  },
  {
    id: "3",
    name: "Polo",
    brand: "Volkswagen",
    pricePerDay: 350,
    fuelType: "Essence",
    transmission: "Automatique",
    description: "La Volkswagen Polo est une reference dans sa categorie. Avec sa finition impeccable, sa tenue de route exemplaire et ses technologies avancees, elle offre une expérience de conduite premium.",
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
    ],
    status: "available",
    year: 2024,
    seats: 5,
    doors: 5,
    category: "Compacte",
  },
  {
    id: "4",
    name: "Tucson",
    brand: "Hyundai",
    pricePerDay: 500,
    fuelType: "Diesel",
    transmission: "Automatique",
    description: "Le Hyundai Tucson est un SUV moderne et spacieux, parfait pour les familles et les voyages longue distance. Sa motorisation diesel offre une excellente autonomie et ses équipements garantissent le confort optimal.",
    images: [
      "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=800",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
    ],
    status: "available",
    year: 2024,
    seats: 5,
    doors: 5,
    category: "SUV",
  },
  {
    id: "5",
    name: "Classe C",
    brand: "Mercedes-Benz",
    pricePerDay: 800,
    fuelType: "Diesel",
    transmission: "Automatique",
    description: "La Mercedes-Benz Classe C incarne l'excellence allemande. Luxe absolu, technologie de pointe et performances remarquables s'associent pour offrir une expérience de conduite inoubliable.",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    ],
    status: "available",
    year: 2024,
    seats: 5,
    doors: 4,
    category: "Luxe",
  },
  {
    id: "6",
    name: "Serie 3",
    brand: "BMW",
    pricePerDay: 900,
    fuelType: "Essence",
    transmission: "Automatique",
    description: "La BMW Serie 3 est la reference des berlines sportives. Avec sa dynamique de conduite legendaire, son interieur raffine et ses performances exceptionnelles, elle redefinit le plaisir de conduire.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800",
    ],
    status: "rented",
    year: 2024,
    seats: 5,
    doors: 4,
    category: "Luxe",
  },
  {
    id: "7",
    name: "Yaris",
    brand: "Toyota",
    pricePerDay: 280,
    fuelType: "Hybride",
    transmission: "Automatique",
    description: "La Toyota Yaris Hybride est le choix écologique par excellence. Sa technologie hybride vous permet de réduire votre empreinte carbone tout en profitant d'un confort et d'une fiabilité remarquables.",
    images: [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
    ],
    status: "available",
    year: 2024,
    seats: 5,
    doors: 5,
    category: "Citadine",
  },
  {
    id: "8",
    name: "Duster",
    brand: "Dacia",
    pricePerDay: 400,
    fuelType: "Diesel",
    transmission: "Manuelle",
    description: "Le Dacia Duster est le SUV aventurier idéal pour explorer le Maroc. Robuste, spacieux et économique, il est parfait pour les routes de montagne, les pistes et les longues distances.",
    images: [
      "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
    ],
    status: "available",
    year: 2023,
    seats: 5,
    doors: 5,
    category: "SUV",
  },
];

export const RESERVATIONS: Reservation[] = [
  {
    id: "r1",
    carId: "1",
    clientFirstName: "Youssef",
    clientLastName: "El Amrani",
    clientPhone: "+212 6 12 34 56 78",
    clientEmail: "youssef@email.com",
    clientLicense: "B-2021-123456",
    pickupLocation: "Casablanca | Centre Ville",
    dropoffLocation: "Rabat | Centre Ville",
    pickupDate: "2026-03-10",
    dropoffDate: "2026-03-14",
    durationDays: 4,
    totalPrice: 1000,
    status: "confirmed",
    createdAt: "2026-03-06",
  },
  {
    id: "r2",
    carId: "4",
    clientFirstName: "Fatima",
    clientLastName: "Benali",
    clientPhone: "+212 6 98 76 54 32",
    clientEmail: "fatima@email.com",
    clientLicense: "B-2019-654321",
    pickupLocation: "Marrakech | Aéroport Menara",
    dropoffLocation: "Marrakech | Aéroport Menara",
    pickupDate: "2026-03-08",
    dropoffDate: "2026-03-12",
    durationDays: 4,
    totalPrice: 2000,
    status: "pending",
    createdAt: "2026-03-06",
  },
  {
    id: "r3",
    carId: "5",
    clientFirstName: "Karim",
    clientLastName: "Tazi",
    clientPhone: "+212 6 55 44 33 22",
    clientEmail: "karim@email.com",
    clientLicense: "B-2020-789012",
    pickupLocation: "Casablanca | Aéroport Mohammed V",
    dropoffLocation: "Casablanca | Aéroport Mohammed V",
    pickupDate: "2026-03-15",
    dropoffDate: "2026-03-18",
    durationDays: 3,
    totalPrice: 2400,
    status: "pending",
    createdAt: "2026-03-06",
  },
];

export function checkAvailability(
  carId: string,
  pickupDate: string,
  dropoffDate: string,
  excludeId?: string
): boolean {
  const conflicts = RESERVATIONS.filter((r) => {
    if (r.carId !== carId) return false;
    if (r.id === excludeId) return false;
    if (r.status === "cancelled") return false;
    return pickupDate <= r.dropoffDate && dropoffDate >= r.pickupDate;
  });
  return conflicts.length === 0;
}

export function calculatePrice(
  pickupDate: string,
  dropoffDate: string,
  pricePerDay: number
): { durationDays: number; totalPrice: number } {
  const start = new Date(pickupDate);
  const end = new Date(dropoffDate);
  const diffMs = end.getTime() - start.getTime();
  const durationDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return { durationDays, totalPrice: durationDays * pricePerDay };
}

export function getCarById(id: string): Car | undefined {
  return CARS.find((c) => c.id === id);
}

export function getReservationById(id: string): Reservation | undefined {
  return RESERVATIONS.find((r) => r.id === id);
}
