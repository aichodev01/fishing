import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { getAvailability, getProduct } from "@/api/products";
import { createReservation } from "@/api/reservations";
import type { FishingProduct } from "@/api/types";
import { Button } from "@/components/ui/button";

function todayIsoDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function ProductDetailPage() {
  const { id } = useParams();
  const productId = id ?? "";

  const [product, setProduct] = useState<FishingProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string>(todayIsoDate());
  const [people, setPeople] = useState<number>(2);
  const [memo, setMemo] = useState<string>("");

  const [available, setAvailable] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    return product.basePrice * people;
  }, [product, people]);

  useEffect(() => {
    if (!productId) return;
    let mounted = true;
    getProduct(productId)
      .then((p) => {
        if (!mounted) return;
        setProduct(p);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "failed");
      });
    return () => {
      mounted = false;
    };
  }, [productId]);

  useEffect(() => {
    if (!productId || !date) return;
    let mounted = true;
    setAvailable(null);
    getAvailability(productId, date)
      .then((r) => {
        if (!mounted) return;
        setAvailable(r.available);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "failed");
      });
    return () => {
      mounted = false;
    };
  }, [productId, date]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!product) return;

    setSubmitting(true);
    setError(null);
    setReservationId(null);
    try {
      const res = await createReservation({
        productId: product.id,
        date,
        people,
        memo: memo.trim() ? memo.trim() : undefined,
      });
      setReservationId(res.id);
      setAvailable(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Link to="/products" className="text-sm text-muted-foreground underline">
          ← 상품 목록
        </Link>
        <p className="text-destructive">에러: {error}</p>
      </div>
    );
  }

  if (product === null) {
    return <p className="text-muted-foreground">불러오는 중…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Link to="/products" className="text-sm text-muted-foreground underline">
          ← 상품 목록
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">{product.name}</h1>
        <p className="text-muted-foreground">{product.description ?? "설명 없음"}</p>
      </div>

      <div className="rounded-lg border p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <div className="text-sm text-muted-foreground">기본 가격</div>
            <div className="font-medium">{product.basePrice.toLocaleString()}원</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">최대 인원</div>
            <div className="font-medium">{product.maxPeople}명</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">예상 결제</div>
            <div className="font-medium">{totalPrice.toLocaleString()}원</div>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border p-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <div className="text-sm font-medium">날짜</div>
            <input
              type="date"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <label className="space-y-1">
            <div className="text-sm font-medium">인원</div>
            <input
              type="number"
              min={1}
              max={product.maxPeople}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              required
            />
          </label>

          <div className="space-y-1">
            <div className="text-sm font-medium">예약 가능</div>
            <div className="text-sm">
              {available === null
                ? "확인 중…"
                : available
                  ? "가능"
                  : "불가(이미 예약됨)"}
            </div>
          </div>
        </div>

        <label className="block space-y-1">
          <div className="text-sm font-medium">메모(선택)</div>
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="요청사항이 있으면 적어주세요"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={submitting || available === false}>
            {submitting ? "예약 생성 중…" : "예약 생성"}
          </Button>
          <Button asChild variant="outline">
            <a href={`http://localhost:8081/api/products/${product.id}`} target="_blank" rel="noreferrer">
              API 확인
            </a>
          </Button>
          {reservationId != null ? (
            <span className="text-sm text-muted-foreground">
              예약 생성됨 (id: {reservationId})
            </span>
          ) : null}
        </div>
      </form>
    </div>
  );
}

