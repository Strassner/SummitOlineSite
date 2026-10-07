"use client";

import { Panel } from "@/components/AccountShell";
import { Pill } from "@/components/ui";
import { formatDate, money } from "@/lib/dates";
import { useApp } from "@/lib/store";

export default function PaymentsPage() {
  const app = useApp();
  return (
    <Panel title="Payment history">
      {app.payments.length === 0 ? (
        <p className="text-ash">No payments yet. Receipts will appear here after your first purchase.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left">
            <thead>
              <tr className="border-b border-iron text-xs uppercase tracking-[0.2em] text-ash">
                <th className="py-3 pr-4">Date</th><th className="py-3 pr-4">Description</th><th className="py-3 pr-4">Status</th><th className="py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {app.payments.map((p) => (
                <tr key={p.id} className="border-b border-iron/60">
                  <td className="py-4 pr-4 text-sm">{formatDate(p.date, { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="py-4 pr-4">{p.description}</td>
                  <td className="py-4 pr-4"><Pill tone={p.status === "paid" ? "gold" : "dark"}>{p.status}</Pill></td>
                  <td className="py-4 text-right font-display text-xl font-bold">{p.status === "refunded" ? "-" : ""}{money(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-6 text-xs text-ash">Receipts are emailed automatically by the payment processor at launch.</p>
    </Panel>
  );
}
