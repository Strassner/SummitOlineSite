import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutFlow } from "@/components/CheckoutFlow";

export const metadata: Metadata = { title: "Join Summit", robots: { index: false }, alternates: { canonical: "/checkout" } };

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutFlow />
    </Suspense>
  );
}
