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
  pickupTime?: string;
  dropoffTime?: string;
  durationDays: number;
  totalPrice: number; // prix location HT
  deliveryFee?: number;
  recoveryFee?: number;
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

export type DeliveryFeeEntry = {
  location: string;
  deliveryFee: number;   // frais pour livrer le véhicule à ce lieu
  recoveryFee: number;   // frais pour récupérer le véhicule depuis ce lieu
};

export const DEFAULT_DELIVERY_FEES: DeliveryFeeEntry[] = [
  { location: "Casablanca | Aéroport Mohammed V", deliveryFee: 200, recoveryFee: 200 },
  { location: "Casablanca | Centre Ville",        deliveryFee: 180, recoveryFee: 180 },
  { location: "Rabat | Centre Ville",             deliveryFee: 220, recoveryFee: 220 },
  { location: "Marrakech | Aéroport Menara",      deliveryFee: 100, recoveryFee: 100 },
  { location: "Marrakech | Gueliz",               deliveryFee: 90,  recoveryFee: 90  },
  { location: "Agadir | Aéroport Al Massira",     deliveryFee: 150, recoveryFee: 150 },
  { location: "Agadir | Centre Ville",            deliveryFee: 140, recoveryFee: 140 },
  { location: "Tanger | Aéroport Ibn Batouta",    deliveryFee: 350, recoveryFee: 350 },
  { location: "Tanger | Centre Ville",            deliveryFee: 330, recoveryFee: 330 },
  { location: "Fes | Centre Ville",               deliveryFee: 280, recoveryFee: 280 },
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

// ─── Excursions ───────────────────────────────────────────────────────────────

export type Excursion = {
  id: string;
  title: string;
  description: string;
  duration: string;
  pricePerPerson: number;
  maxParticipants: number;
  includes: string[];
  image: string;
  destination: string;
  difficulty: "Facile" | "Modéré" | "Difficile";
  category: "Désert" | "Montagne" | "Côte" | "Ville" | "Circuit";
};

export type ExcursionBooking = {
  id: string;
  excursionId: string;
  clientFirstName: string;
  clientLastName: string;
  clientPhone: string;
  clientEmail: string;
  participants: number;
  date: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  message?: string;
  createdAt: string;
};

export const EXCURSIONS: Excursion[] = [
  {
    id: "e1",
    title: "Nuit dans le Désert de Merzouga",
    description: "Vivez une expérience inoubliable dans les dunes dorées de l'Erg Chebbi. Chevauchée en dromadaires au coucher du soleil, nuit en bivouac sous les étoiles et lever de soleil magique.",
    duration: "2 jours / 1 nuit",
    pricePerPerson: 850,
    maxParticipants: 12,
    includes: ["Transport A/R depuis Ouarzazate", "Nuit en bivouac", "Dîner & petit-déjeuner", "Balade à dromadaire", "Guide touristique"],
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
    destination: "Merzouga",
    difficulty: "Facile",
    category: "Désert",
  },
  {
    id: "e2",
    title: "Vallée de l'Ourika & Cascades",
    description: "Découvrez la magnifique vallée de l'Ourika au pied du Haut Atlas. Randonnée jusqu'aux cascades, visite d'un village berbère et déjeuner traditionnel en montagne.",
    duration: "1 jour",
    pricePerPerson: 350,
    maxParticipants: 15,
    includes: ["Transport depuis Marrakech", "Guide certifié", "Déjeuner traditionnel", "Visite village berbère"],
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",
    destination: "Vallée de l'Ourika",
    difficulty: "Modéré",
    category: "Montagne",
  },
  {
    id: "e3",
    title: "Aït Benhaddou & Gorges du Dadès",
    description: "Circuit entre Aït Benhaddou, ksar classé à l'UNESCO, et les majestueuses gorges du Dadès. Un voyage au cœur du Maroc ancestral avec des panoramas à couper le souffle.",
    duration: "1 jour",
    pricePerPerson: 450,
    maxParticipants: 10,
    includes: ["Transport inclus", "Guide spécialisé", "Entrée sites UNESCO", "Déjeuner panoramique"],
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
    destination: "Aït Benhaddou",
    difficulty: "Facile",
    category: "Circuit",
  },
  {
    id: "e4",
    title: "Cap Spartel & Grottes d'Hercule",
    description: "Excursion au Cap Spartel, point de rencontre de l'Atlantique et de la Méditerranée, puis visite des mystérieuses Grottes d'Hercule avec leur ouverture en forme d'Afrique.",
    duration: "1 jour",
    pricePerPerson: 280,
    maxParticipants: 20,
    includes: ["Transport depuis Tanger", "Guide local", "Entrée grottes", "Thé à la menthe offert"],
    image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800",
    destination: "Tanger",
    difficulty: "Facile",
    category: "Côte",
  },
  {
    id: "e5",
    title: "Marrakech : Médina & Souks",
    description: "Plongez dans l'effervescence de la médina de Marrakech. Visite guidée des souks, de la Medersa Ben Youssef, du Musée de Marrakech et de la mythique place Jemaa el-Fna.",
    duration: "1 jour",
    pricePerPerson: 300,
    maxParticipants: 15,
    includes: ["Guide professionnel", "Entrées musées", "Dégustation produits locaux", "Thé à la menthe"],
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800",
    destination: "Marrakech",
    difficulty: "Facile",
    category: "Ville",
  },
  {
    id: "e6",
    title: "Circuit des Kasbahs & Vallée du Drâa",
    description: "Deux jours à travers les paysages époustouflants de la vallée du Drâa. Kasbahs millénaires, palmeraies luxuriantes, villages de pisé et panoramas grandioses vous attendent.",
    duration: "2 jours / 1 nuit",
    pricePerPerson: 780,
    maxParticipants: 8,
    includes: ["Transport 4x4", "Hébergement riad", "Tous repas inclus", "Guide local", "Visite des kasbahs"],
    image: "https://images.unsplash.com/photo-1569948956094-fe18e4b98b0d?w=800",
    destination: "Vallée du Drâa",
    difficulty: "Modéré",
    category: "Circuit",
  },
];

// ─── Promotions ───────────────────────────────────────────────────────────────

export type Promotion = {
  id: string;
  name: string;
  description: string;
  discountPercent: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  applyTo: "cars" | "excursions" | "all";
  active: boolean;
};

export const EXCURSION_BOOKINGS: ExcursionBooking[] = [
  {
    id: "eb1",
    excursionId: "e1",
    clientFirstName: "Sophie",
    clientLastName: "Martin",
    clientPhone: "+33 6 12 34 56 78",
    clientEmail: "sophie.martin@email.com",
    participants: 2,
    date: "2026-03-20",
    totalPrice: 1700,
    status: "confirmed",
    createdAt: "2026-03-06",
  },
  {
    id: "eb2",
    excursionId: "e2",
    clientFirstName: "Ahmed",
    clientLastName: "Khalil",
    clientPhone: "+212 6 55 44 33 22",
    clientEmail: "ahmed@email.com",
    participants: 4,
    date: "2026-03-15",
    totalPrice: 1400,
    status: "pending",
    createdAt: "2026-03-06",
  },
  {
    id: "eb3",
    excursionId: "e5",
    clientFirstName: "Emma",
    clientLastName: "Dupont",
    clientPhone: "+33 7 98 76 54 32",
    clientEmail: "emma.dupont@email.com",
    participants: 3,
    date: "2026-03-12",
    totalPrice: 900,
    status: "pending",
    createdAt: "2026-03-07",
  },
];
