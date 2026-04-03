import { api } from "./client";
import type { AvailabilityResponse, FishingProduct } from "./types";

export function listProducts() {
  return api<FishingProduct[]>("/api/products");
}

export function getProduct(id: string) {
  return api<FishingProduct>(`/api/products/${encodeURIComponent(id)}`);
}

export function getAvailability(productId: string, date: string) {
  const qs = new URLSearchParams({ date });
  return api<AvailabilityResponse>(
    `/api/products/${encodeURIComponent(productId)}/availability?${qs.toString()}`,
  );
}

