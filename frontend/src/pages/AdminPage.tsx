import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  adminCreateProduct,
  adminListProducts,
  adminListReservations,
  adminSetProductActive,
  adminUpdateProduct,
  adminUpdateReservationStatus,
} from "@/api/admin";
import type { FishingProduct, Reservation } from "@/api/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";

export function AdminPage() {
  const { state } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<FishingProduct[] | null>(null);
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [name, setName] = useState("");
  const [spotId, setSpotId] = useState(1);
  const [basePrice, setBasePrice] = useState(50000);
  const [maxPeople, setMaxPeople] = useState(6);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editSpotId, setEditSpotId] = useState(1);
  const [editBasePrice, setEditBasePrice] = useState(0);
  const [editMaxPeople, setEditMaxPeople] = useState(1);
  const [editActive, setEditActive] = useState(true);

  async function load() {
    setError(null);
    setItems(null);
    setReservations(null);
    try {
      const [products, rs] = await Promise.all([
        adminListProducts(),
        adminListReservations(),
      ]);
      setItems(products);
      setReservations(rs);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "failed";
      setError(msg);
      if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
        nav("/login", { replace: true, state: { next: "/admin" } });
      }
    }
  }

  async function onCreateProduct() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await adminCreateProduct({
        spotId,
        name: name.trim(),
        basePrice,
        maxPeople,
        active: true,
      });
      setName("");
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "failed");
    } finally {
      setSaving(false);
    }
  }

  async function onToggleActive(p: FishingProduct) {
    try {
      await adminSetProductActive(p.id, !p.active);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "failed");
    }
  }

  function startEdit(p: FishingProduct) {
    setEditingId(p.id);
    setEditName(p.name);
    setEditSpotId(p.spotId);
    setEditBasePrice(p.basePrice);
    setEditMaxPeople(p.maxPeople);
    setEditActive(p.active);
  }

  async function saveEdit() {
    if (editingId == null || !editName.trim()) return;
    try {
      await adminUpdateProduct(editingId, {
        spotId: editSpotId,
        name: editName.trim(),
        basePrice: editBasePrice,
        maxPeople: editMaxPeople,
        active: editActive,
      });
      setEditingId(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "failed");
    }
  }

  async function onChangeReservationStatus(
    id: number,
    status: Reservation["status"],
  ) {
    try {
      await adminUpdateReservationStatus(id, status);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "failed");
    }
  }

  useEffect(() => {
    if (state.status === "guest") {
      nav("/login", { replace: true, state: { next: "/admin" } });
      return;
    }
    if (state.status === "authed" && state.me.role !== "ADMIN") {
      setError("관리자 권한이 없습니다.");
      return;
    }
    if (state.status === "authed") void load();
  }, [state.status, nav]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-semibold tracking-tight">관리자</h1>
        <Button variant="outline" onClick={load}>
          새로고침
        </Button>
      </div>

      <section className="space-y-2 rounded-lg border p-4">
        <div className="font-medium">상품 생성</div>
        <div className="grid gap-2 sm:grid-cols-4">
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="상품명"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={spotId}
            onChange={(e) => setSpotId(Number(e.target.value))}
          />
          <input
            type="number"
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
          />
          <input
            type="number"
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={maxPeople}
            onChange={(e) => setMaxPeople(Number(e.target.value))}
          />
        </div>
        <Button onClick={onCreateProduct} disabled={saving}>
          {saving ? "생성 중…" : "상품 생성"}
        </Button>
      </section>

      {error ? (
        <div className="rounded-lg border p-4">
          <div className="text-destructive">에러: {error}</div>
          <div className="mt-2 text-sm text-muted-foreground">
            로그인/권한이 없으면 401/403이 납니다. (admin@example.com)
          </div>
        </div>
      ) : items === null ? (
        <p className="text-muted-foreground">불러오는 중…</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-2">
            <div className="font-medium">상품 관리</div>
            <ul className="space-y-2">
              {items.map((p) => (
                <li key={p.id} className="rounded-lg border p-4">
                  {editingId === p.id ? (
                    <div className="space-y-2">
                      <input
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          className="rounded-md border bg-background px-3 py-2 text-sm"
                          value={editSpotId}
                          onChange={(e) => setEditSpotId(Number(e.target.value))}
                        />
                        <input
                          type="number"
                          className="rounded-md border bg-background px-3 py-2 text-sm"
                          value={editBasePrice}
                          onChange={(e) => setEditBasePrice(Number(e.target.value))}
                        />
                        <input
                          type="number"
                          className="rounded-md border bg-background px-3 py-2 text-sm"
                          value={editMaxPeople}
                          onChange={(e) => setEditMaxPeople(Number(e.target.value))}
                        />
                        <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                          <input
                            type="checkbox"
                            checked={editActive}
                            onChange={(e) => setEditActive(e.target.checked)}
                          />
                          활성
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}>
                          저장
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {p.basePrice.toLocaleString()}원 / 최대 {p.maxPeople}명 /{" "}
                        {p.active ? "활성" : "비활성"}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                          수정
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onToggleActive(p)}
                        >
                          {p.active ? "비활성화" : "활성화"}
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <div className="font-medium">예약 관리</div>
            {reservations == null ? (
              <p className="text-sm text-muted-foreground">불러오는 중…</p>
            ) : reservations.length === 0 ? (
              <p className="text-sm text-muted-foreground">예약이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {reservations.map((r) => (
                  <li key={r.id} className="rounded-lg border p-4">
                    <div className="text-sm">
                      예약 #{r.id} / 상품 {r.productId} / 유저 {r.userId}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {r.reservedDate} / {r.people}명 / {r.totalPrice.toLocaleString()}원 /{" "}
                      {r.status}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onChangeReservationStatus(r.id, "CONFIRMED")}
                      >
                        승인
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onChangeReservationStatus(r.id, "CANCELLED")}
                      >
                        취소
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

