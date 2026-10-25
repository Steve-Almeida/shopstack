"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

function nextUrl() {
  const n = new URLSearchParams(window.location.search).get("next");
  return n && n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard";
}

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    const res =
      mode === "signup"
        ? await authClient.signUp.email({ name: String(f.get("name")), email, password })
        : await authClient.signIn.email({ email, password });
    setLoading(false);
    if (res.error) return setError(res.error.message ?? "Something went wrong");
    router.push(nextUrl());
    router.refresh();
  }

  const social = (provider: "google" | "github") =>
    authClient.signIn.social({ provider, callbackURL: nextUrl() });

  const input = "w-full rounded-lg border bg-transparent px-3 py-2";

  return (
    <div className="w-full max-w-sm rounded-2xl border p-6">
      <h1 className="mb-4 text-xl font-semibold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => social("google")} className="rounded-lg border py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">Google</button>
        <button onClick={() => social("github")} className="rounded-lg border py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">GitHub</button>
      </div>
      <p className="my-4 text-center text-xs text-neutral-500">or with email</p>
      <form onSubmit={onSubmit} className="space-y-3">
        {mode === "signup" && <input name="name" required placeholder="Name" className={input} />}
        <input name="email" type="email" required placeholder="Email" className={input} />
        <input name="password" type="password" required minLength={8} placeholder="Password (min 8)" className={input} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-black py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black">
          {loading ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-500">
        {mode === "login" ? (
          <>No account? <Link href="/signup" className="underline">Sign up</Link></>
        ) : (
          <>Have an account? <Link href="/login" className="underline">Log in</Link></>
        )}
      </p>
    </div>
  );
}
