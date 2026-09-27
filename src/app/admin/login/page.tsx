"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "تعذر تسجيل الدخول");
      router.push("/admin/projects");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "تعذر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10" dir="rtl">
      <form onSubmit={submit} className="w-full max-w-md rounded-md border border-line bg-surface p-7 shadow-soft md:p-9">
        <p className="t-label text-accent" dir="ltr">RG STACK</p>
        <h1 className="t-display-l mt-4">لوحة إدارة الأعمال</h1>
        <p className="t-body-s mt-3 text-muted">سجّل الدخول لإضافة أعمالك وتعديلها وإدارتها.</p>
        <label className="mt-8 block">
          <span className="t-label text-muted">البريد الإلكتروني</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" required className="mt-2.5 w-full rounded-sm border border-line bg-bg px-3.5 py-3 text-ink" dir="ltr" />
        </label>
        <label className="mt-5 block">
          <span className="t-label text-muted">كلمة المرور</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required className="mt-2.5 w-full rounded-sm border border-line bg-bg px-3.5 py-3 text-ink" dir="ltr" />
        </label>
        {error && <p role="alert" className="mt-4 rounded-sm border border-accent/30 bg-accent/5 p-3 text-sm text-accent">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-sm bg-ink px-4 py-3 text-sm font-semibold text-bg disabled:opacity-50">
          {loading ? "جارٍ الدخول…" : "دخول"}
        </button>
      </form>
    </main>
  );
}
