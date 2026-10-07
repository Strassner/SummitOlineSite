import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPage } from "@/components/AuthPage";

export const metadata: Metadata = { title: "Create Account", robots: { index: false }, alternates: { canonical: "/signup" } };

export default function SignupPage() {
  return (
    <Suspense>
      <AuthPage mode="signup" />
    </Suspense>
  );
}
