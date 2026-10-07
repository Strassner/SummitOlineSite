import type { Metadata } from "next";
import { AccountShell } from "@/components/AccountShell";

export const metadata: Metadata = { title: "My Account", robots: { index: false, follow: false } };

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return <AccountShell>{children}</AccountShell>;
}
