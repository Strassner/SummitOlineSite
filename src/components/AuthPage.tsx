"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "./ui";
import { SignInForm, SignUpForm } from "./AuthForms";
import { LogoMark } from "./Logo";

export function safeNext(next: string | null, fallback = "/account") {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const qs = params.get("next") ? `?next=${encodeURIComponent(next)}` : "";
  const done = () => router.push(next);

  return (
    <div className="photo-slot relative flex min-h-[70svh] items-center py-16 sm:py-24">
      <LogoMark className="pointer-events-none absolute -left-20 top-0 h-[34rem] w-[34rem] text-white opacity-[0.04]" />
      <Container className="relative">
        <div className="mx-auto max-w-md border border-iron bg-coal/95 p-8 sm:p-10">
          <h1 className="font-display text-5xl font-extrabold uppercase leading-none">{mode === "login" ? "Welcome back" : "Join Summit"}</h1>
          <p className="mb-8 mt-3 text-ash">
            {mode === "login" ? "Sign in to manage bookings, memberships and member content." : "Create a parent account, then add one or more athletes."}
          </p>
          {mode === "login" ? <SignInForm onDone={done} /> : <SignUpForm onDone={done} />}
          <p className="mt-8 text-center text-sm text-ash">
            {mode === "login" ? (
              <>
                New to Summit?{" "}
                <Link href={`/signup${qs}`} className="text-gold underline-offset-4 hover:underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href={`/login${qs}`} className="text-gold underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </Container>
    </div>
  );
}
