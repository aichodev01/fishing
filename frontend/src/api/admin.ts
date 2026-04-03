import { api } from "./client";
import type { FishingProduct, Reservation } from "./types";

export type UpsertProductBody = {
  spotId: number;
  name: string;
  description?: string;
  basePrice: number;
  maxPeople: number;
  active: boolean;
};

export function adminListProducts() {
  return api<FishingProduct[]>("/api/admin/products");
}

export function adminCreateProduct(body: UpsertProductBody) {
  return api<FishingProduct>("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function adminUpdateProduct(id: number, body: UpsertProductBody) {
  return api<FishingProduct>(`/api/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function adminSetProductActive(id: number, active: boolean) {
  return api<FishingProduct>(`/api/admin/products/${id}/active`, {
    method: "POST",
    body: JSON.stringify({ active }),
  });
}

export function adminListReservations() {
  return api<Reservation[]>("/api/admin/reservations");
}

export function adminUpdateReservationStatus(
  id: number,
  status: Reservation["status"],
) {
  return api<Reservation>(`/api/admin/reservations/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

