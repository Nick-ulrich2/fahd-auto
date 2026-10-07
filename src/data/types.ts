export type Fuel = "petrol" | "diesel" | "hybrid" | "phev" | "electric";
export type Transmission = "automatic" | "manual";
export type Kind = "car" | "moto";
export type CarBody = "suv" | "sedan" | "pickup" | "hatchback" | "van" | "estate";
export type MotoBody = "commuter" | "roadster" | "sport" | "adventure" | "touring" | "custom" | "scooter" | "tricycle";
export type Body = CarBody | MotoBody;
export type Drivetrain = "4x4" | "awd" | "fwd" | "rwd" | "chain" | "belt" | "shaft";
export type Color =
  | "white"
  | "black"
  | "silver"
  | "grey"
  | "blue"
  | "red"
  | "green"
  | "beige"
  | "brown";
export type Upholstery = "leather" | "partLeather" | "fabric" | "alcantara";

export type Location = "brussels" | "antwerp" | "liege" | "dubai";

export type FeatureGroup = "comfort" | "safety" | "multimedia" | "exterior";

export interface Photo {
  src: string;
  /** Miniature 640 px pour les listes. */
  thumb: string;
  /** Vue : avant, arrière, intérieur, profil. */
  view: "front" | "rear" | "interior" | "side";
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

/** Caractéristiques propres aux motos et scooters. */
export interface MotoSpecs {
  /** Hauteur de selle en mm. */
  seatHeight: number;
  cooling: "liquid" | "air" | "airOil" | "airLiquid";
  /** Permis requis (A1 = 125 cm³, A2 = bridable 35 kW, B = tricycle). */
  licence: "A" | "A2" | "A1" | "B";
  frontSuspension: "usd" | "telescopic" | "telelever";
  frontTravel: number;
  rearSuspension: "mono" | "twin" | "paralever";
  rearTravel: number;
  /** discs = 0 : frein à tambour. */
  frontBrake: { discs: number; diameter: number };
  rearBrake: { discs: number; diameter: number };
  frontTyre: string;
  rearTyre: string;
}

export interface Car {
  /** Voiture (par défaut) ou moto. */
  kind: Kind;
  slug: string;
  ref: string;
  make: string;
  model: string;
  /** Finition / version, ex. « VX 3.3 V6 D-4D ». */
  trim: string;
  generation: string;
  year: number;
  /** Mois/année de première immatriculation, ex. « 2022-03 ». */
  firstRegistration: string;
  /** Prix indicatif « à partir de », en euros. */
  priceFrom: number;
  /** Prix indicatif en FCFA (XAF) : s'il est renseigné, il est affiché en premier, l'euro en second. */
  priceXaf?: number;
  /** Neuf ou occasion (occasion par défaut). */
  condition?: "new" | "used";
  /** Disponibilité : disponible (par défaut), réservé ou vendu. */
  status?: "available" | "reserved" | "sold";
  mileage: number;
  fuel: Fuel;
  transmission: Transmission;
  gears: number;
  body: Body;
  drivetrain: Drivetrain;
  engine: {
    /** Cylindrée en cm³ (0 pour l'électrique). */
    displacement: number;
    cylinders: number;
    /** Architecture : I4 = 4 cylindres en ligne, V6, V8… */
    layout: "1" | "2" | "V2" | "B2" | "I3" | "I4" | "I6" | "V4" | "V6" | "V8" | "EV";
    powerHp: number;
    torqueNm: number;
    /** Batterie en kWh (électrique / hybride rechargeable). */
    batteryKwh?: number;
    /** Autonomie électrique WLTP en km. */
    electricRangeKm?: number;
  };
  performance: { zeroTo100: number; topSpeed: number };
  /** Consommation mixte WLTP : l/100 km (ou kWh/100 km pour l'électrique). */
  consumption: number;
  co2: number;
  euroNorm: string;
  dimensions: { length: number; width: number; height: number; wheelbase: number };
  weight: number;
  tank: number;
  /** Volume de coffre en litres (volume utile pour un utilitaire). */
  boot?: number;
  /** Charge utile en kg (pick-up, utilitaire). */
  payload?: number;
  /** Capacité de remorquage freinée en kg (0 = non homologué). */
  towing: number;
  seats: number;
  doors: number;
  colorExt: Color;
  colorExtName: string;
  colorInt: Color;
  upholstery: Upholstery;
  wheelsInch: number;
  airbags: number;
  owners: number;
  keys: number;
  serviceHistory: boolean;
  carPass: boolean;
  coc: boolean;
  accidentFree: boolean;
  warrantyMonths: number;
  location: Location;
  features: string[];
  photos: Photo[];
  featured?: boolean;
  moto?: MotoSpecs;
}
