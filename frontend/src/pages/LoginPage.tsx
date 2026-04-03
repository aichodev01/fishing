import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("dev");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      const next = (loc.state as { next?: string } | null)?.next;
      nav(next ?? "/", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-4">
      <div className="space-y-1">
        <Link to="/" className="text-sm text-muted-foreground underline">
          ← 홈
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">로그인</h1>
        <p className="text-sm text-muted-foreground">
          시드 계정: <span className="font-mono">admin@example.com</span> /{" "}
          <span className="font-mono">dev</span>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-lg border p-4">
        <label className="block space-y-1">
          <div className="text-sm font-medium">이메일</div>
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="block space-y-1">
          <div className="text-sm font-medium">비밀번호</div>
          <input
            type="password"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error ? <div className="text-sm text-destructive">{error}</div> : null}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "로그인 중…" : "로그인"}
        </Button>
      </form>
    </div>
  );
}

