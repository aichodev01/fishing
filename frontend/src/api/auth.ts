import { api } from "./client";

export type Me = {
  id?: number;
  email: string;
  name?: string;
  role?: string;
};

export async function me() {
  return api<Me>("/api/auth/me");
}

export async function login(email: string, password: string) {
  return api<void>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return api<void>("/api/auth/logout", { method: "POST" });
}

