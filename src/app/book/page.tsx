import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow } from "@/components/BookingFlow";

export const metadata: Metadata = {
  title: "Book a Session",
  description: "Book offensive line training online: choose your training type and time, create an account, pay and get instant confirmation.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <Suspense>
      <BookingFlow />
    </Suspense>
  );
}
