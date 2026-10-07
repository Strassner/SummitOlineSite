import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPage } from "@/components/AuthPage";

export const metadata: Metadata = { title: "Login", robots: { index: false }, alternates: { canonical: "/login" } };

export default function LoginPage() {
  return (
    <Suspense>
      <AuthPage mode="login" />
    </Suspense>
  );
}
