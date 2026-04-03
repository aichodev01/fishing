export type FishingProduct = {
  id: number;
  spotId: number;
  name: string;
  description: string | null;
  basePrice: number;
  maxPeople: number;
  active: boolean;
};

export type AvailabilityResponse = {
  productId: number;
  date: string; // YYYY-MM-DD
  startTime: string | null; // HH:mm:ss
  available: boolean;
};

export type Reservation = {
  id: number;
  userId: number;
  productId: number;
  reservedDate: string; // YYYY-MM-DD
  startTime: string | null;
  people: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  totalPrice: number;
  memo: string | null;
};

