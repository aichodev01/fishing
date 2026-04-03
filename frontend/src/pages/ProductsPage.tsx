import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listProducts } from "@/api/products";
import type { FishingProduct } from "@/api/types";
import { Button } from "@/components/ui/button";

export function ProductsPage() {
  const [items, setItems] = useState<FishingProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    listProducts()
      .then((data) => {
        if (!mounted) return;
        setItems(data);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "failed");
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">상품</h1>
        <p className="text-destructive">에러: {error}</p>
        <p className="text-sm text-muted-foreground">
          백엔드(`http://localhost:8081`)가 실행 중인지 확인해줘.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-semibold tracking-tight">상품</h1>
        <Button asChild variant="outline" size="sm">
          <a href="http://localhost:8081/actuator/health" target="_blank" rel="noreferrer">
            health
          </a>
        </Button>
      </div>

      {items === null ? (
        <p className="text-muted-foreground">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">등록된 상품이 없습니다.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((p) => (
            <li key={p.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {p.description ?? "설명 없음"}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium">{p.basePrice.toLocaleString()}원</div>
                  <div className="text-muted-foreground">최대 {p.maxPeople}명</div>
                </div>
              </div>
              <div className="mt-3">
                <Button asChild>
                  <Link to={`/products/${p.id}`}>상세/예약</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

