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
    name: "Kardian",
    brand: "Renault",
    pricePerDay: 320,
    fuelType: "Essence",
    transmission: "Manuelle",
    description: "La Renault Kardian est un SUV urbain moderne et polyvalent, idéal pour vos déplacements à Ouarzazate et dans la région. Élégante, économique et bien équipée, elle combine confort et praticité au quotidien.",
    images: ["/images/cars/kardian.jpg"],
    status: "available",
    year: 2024,
    seats: 5,
    doors: 5,
    category: "SUV",
  },
  {
    id: "2",
    name: "Express Minivan",
    brand: "Renault",
    pricePerDay: 380,
    fuelType: "Diesel",
    transmission: "Manuelle",
    description: "Le Renault Express Minivan est le véhicule idéal pour les familles et les groupes. Spacieux, économique et fiable, il offre un excellent confort pour vos voyages autour de Ouarzazate.",
    images: ["/images/cars/express.jpg"],
    status: "available",
    year: 2023,
    seats: 5,
    doors: 5,
    category: "Minivan",
  },
  {
    id: "3",
    name: "Dokker Minivan",
    brand: "Dacia",
    pricePerDay: 350,
    fuelType: "Diesel",
    transmission: "Manuelle",
    description: "Le Dacia Dokker Minivan est un véhicule pratique et spacieux, parfait pour les trajets familiaux ou professionnels. Son moteur diesel économique en fait un choix idéal pour les longues distances.",
    images: ["/images/cars/dokker.jpg"],
    status: "available",
    year: 2023,
    seats: 5,
    doors: 5,
    category: "Minivan",
  },
  {
    id: "4",
    name: "208",
    brand: "Peugeot",
    pricePerDay: 270,
    fuelType: "Essence",
    transmission: "Manuelle",
    description: "La Peugeot 208 est une citadine élégante et dynamique. Son design moderne, ses équipements technologiques et sa maniabilité en font une voiture agréable aussi bien en ville que sur les routes du Maroc.",
    images: ["/images/cars/peugeot208.jpg"],
    status: "available",
    year: 2023,
    seats: 5,
    doors: 5,
    category: "Compacte",
  },
  {
    id: "5",
    name: "C-Élysée",
    brand: "Citroën",
    pricePerDay: 240,
    fuelType: "Diesel",
    transmission: "Manuelle",
    description: "La Citroën C-Élysée est une berline confortable et économique, idéale pour les longs trajets. Son habitacle spacieux et sa consommation maîtrisée en font le choix parfait pour explorer la région de Ouarzazate.",
    images: ["/images/cars/c-elysee.png"],
    status: "available",
    year: 2023,
    seats: 5,
    doors: 4,
    category: "Berline",
  },
  {
    id: "6",
    name: "Land Cruiser",
    brand: "Toyota",
    pricePerDay: 950,
    fuelType: "Diesel",
    transmission: "Automatique",
    description: "Le Toyota Land Cruiser est le roi du tout-terrain. Puissant, robuste et luxueux, il est parfait pour les excursions dans le désert, les pistes de montagne et les aventures au cœur du Maroc.",
    images: ["/images/cars/landcruiser.png"],
    status: "available",
    year: 2024,
    seats: 5,
    doors: 5,
    category: "SUV",
  },
  {
    id: "7",
    name: "Clio 5",
    brand: "Renault",
    pricePerDay: 280,
    fuelType: "Diesel",
    transmission: "Manuelle",
    description: "La Renault Clio 5 allie style contemporain et technologie avancée. Agréable à conduire, économique en carburant et bien équipée, elle est parfaite pour tous vos déplacements au Maroc.",
    images: ["/images/cars/clio5.jpg"],
    status: "available",
    year: 2023,
    seats: 5,
    doors: 5,
    category: "Citadine",
  },
  {
    id: "8",
    name: "Logan Basic",
    brand: "Dacia",
    pricePerDay: 200,
    fuelType: "Diesel",
    transmission: "Manuelle",
    description: "La Dacia Logan Basic est la solution économique par excellence. Fiable, spacieuse et facile à conduire, elle est idéale pour les budgets serrés sans compromis sur la qualité.",
    images: ["/images/cars/logan-basic.png"],
    status: "available",
    year: 2022,
    seats: 5,
    doors: 4,
    category: "Économique",
  },
  {
    id: "9",
    name: "Logan Diesel",
    brand: "Dacia",
    pricePerDay: 230,
    fuelType: "Diesel",
    transmission: "Manuelle",
    description: "La Dacia Logan Diesel avec climatisation offre un excellent rapport qualité-prix. Son moteur diesel économique et son habitacle confortable en font un choix idéal pour les longs trajets.",
    images: ["/images/cars/logan-diesel.jpg"],
    status: "available",
    year: 2023,
    seats: 5,
    doors: 4,
    category: "Économique",
  },
  {
    id: "10",
    name: "Duster",
    brand: "Dacia",
    pricePerDay: 420,
    fuelType: "Diesel",
    transmission: "Manuelle",
    description: "Le Dacia Duster est le SUV aventurier idéal pour explorer le Maroc. Robuste et économique, il est parfait pour les routes de montagne, les pistes sahariennes et les longues distances avec GPS intégré.",
    images: ["/images/cars/duster.jpg"],
    status: "available",
    year: 2023,
    seats: 5,
    doors: 5,
    category: "SUV",
  },
  {
    id: "11",
    name: "Lodgy 7 places",
    brand: "Dacia",
    pricePerDay: 480,
    fuelType: "Diesel",
    transmission: "Manuelle",
    description: "Le Dacia Lodgy 7 places est le véhicule familial par excellence. Grand, confortable et économique, il est parfait pour les familles nombreuses ou les groupes souhaitant voyager ensemble au Maroc.",
    images: ["/images/cars/lodgy.jpg"],
    status: "available",
    year: 2023,
    seats: 7,
    doors: 5,
    category: "Familiale",
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
