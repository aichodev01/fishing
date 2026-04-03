import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomePage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_0%,rgba(14,116,144,0.16),rgba(14,116,144,0))]" />

        <div className="relative space-y-6">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              Trusted Fishing Trips
            </span>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              최고의 낚시 상품을
              <br />
              쉽고 빠르게 예약하세요
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              지역, 날짜, 인원에 맞는 상품을 찾아보고 바로 예약할 수 있어요.
            </p>
          </div>

          <div className="grid gap-2 rounded-xl border bg-background p-3 shadow-sm sm:grid-cols-[1.2fr_1fr_1fr_auto]">
            <input
              readOnly
              value="원하는 지역 또는 상품명을 찾아보세요"
              className="rounded-md border bg-white px-3 py-2 text-sm text-muted-foreground"
            />
            <input
              readOnly
              value="날짜 선택"
              className="rounded-md border bg-white px-3 py-2 text-sm text-muted-foreground"
            />
            <input
              readOnly
              value="인원"
              className="rounded-md border bg-white px-3 py-2 text-sm text-muted-foreground"
            />
            <Button asChild className="h-10">
              <Link to="/products">상품 검색</Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/products">전체 상품 보기</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin">관리자 콘솔</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-medium">검증된 상품</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            운영자가 검수한 상품 중심으로 노출됩니다.
          </p>
        </article>
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-medium">간편 예약</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            날짜/인원 입력 후 바로 예약 생성이 가능합니다.
          </p>
        </article>
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-medium">상태 추적</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            승인/취소 상태를 관리자 콘솔에서 실시간 관리합니다.
          </p>
        </article>
      </section>
    </div>
  );
}

