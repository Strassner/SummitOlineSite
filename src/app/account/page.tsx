"use client";

import { useState } from "react";
import { AthleteAdder, Field } from "@/components/AuthForms";
import { Panel } from "@/components/AccountShell";
import { Button } from "@/components/ui";
import { removeAthlete, updateProfile, useApp } from "@/lib/store";

export default function ProfilePage() {
  const app = useApp();
  const [saved, setSaved] = useState(false);
  const u = app.user;
  if (!u) return null;
  return (
    <>
      <Panel title="My profile">
        <form
          key={u.id}
          className="grid gap-5 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            updateProfile({ name: String(f.get("name")), email: String(f.get("email")), phone: String(f.get("phone") ?? "") });
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
          }}
        >
          <Field label="Parent / guardian"><input name="name" defaultValue={u.name} className="field" required /></Field>
          <Field label="Email"><input name="email" type="email" defaultValue={u.email} className="field" required /></Field>
          <Field label="Phone"><input name="phone" defaultValue={u.phone ?? ""} className="field" /></Field>
          <div className="flex items-end gap-4">
            <Button type="submit">Save</Button>
            {saved && <span role="status" className="text-sm text-gold">Saved</span>}
          </div>
        </form>
      </Panel>

      <Panel title="Athletes">
        {app.athletes.length === 0 ? (
          <p className="mb-5 text-ash">Add the athletes you register for training. One parent account can manage several.</p>
        ) : (
          <ul className="mb-6 divide-y divide-iron border-y border-iron">
            {app.athletes.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-display text-2xl font-bold uppercase">{a.name}</p>
                  <p className="text-sm text-ash">{a.age} years old · {a.position}{a.school ? ` · ${a.school}` : ""}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeAthlete(a.id)} aria-label={`Remove ${a.name}`}>Remove</Button>
              </li>
            ))}
          </ul>
        )}
        <AthleteAdder compact={app.athletes.length > 0} />
      </Panel>
    </>
  );
}
