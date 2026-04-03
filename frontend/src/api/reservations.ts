import { api } from "./client";
import type { Reservation } from "./types";

export type CreateReservationBody = {
  productId: number;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm[:ss]
  people: number;
  memo?: string;
};

export function createReservation(body: CreateReservationBody) {
  return api<Reservation>("/api/reservations", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function cancelReservation(id: number) {
  return api<void>(`/api/reservations/${id}/cancel`, { method: "POST" });
}

