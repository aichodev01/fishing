import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";

export function Layout() {
  const { state, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="app-ocean-bg min-h-screen text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path
                  d="M4 13c3.5-5 8.5-5 12 0-3.5 5-8.5 5-12 0Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9.2" cy="13" r="1.1" fill="currentColor" />
                <path
                  d="M16 13c1.2-1.1 2.3-1.7 3.5-1.7M19.5 11.3v3.4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span>
              Fishing <span className="text-sky-700">내자리</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1.5 text-sm hover:bg-muted",
                  isActive && "bg-muted",
                )
              }
            >
              상품
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1.5 text-sm hover:bg-muted",
                  isActive && "bg-muted",
                )
              }
            >
              관리자
            </NavLink>
            <div className="hidden items-center gap-2 sm:flex">
              {state.status === "authed" ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {state.me.email}
                    {state.me.role ? ` (${state.me.role})` : ""}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void logout().then(() => nav("/", { replace: true }));
                    }}
                  >
                    로그아웃
                  </Button>
                </>
              ) : state.status === "loading" ? (
                <span className="text-sm text-muted-foreground">확인 중…</span>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link to="/login">로그인</Link>
                </Button>
              )}
            </div>
            <Button asChild variant="outline" size="sm">
              <a href="http://localhost:8081/api/health" target="_blank" rel="noreferrer">
                API
              </a>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

