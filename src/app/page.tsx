import { createClient } from "@/lib/supabase/server";
import { hasPublicSupabaseEnv } from "@/lib/server/env";
import { StatusDot } from "@/components/ui/status-dot";

const checkpoints = [
  "App Router pret pour Vercel",
  "Supabase SSR prepare",
  "RLS et audit en fondation",
  "Tests metier amorces",
];

export default async function Home() {
  const hasSupabaseEnv = hasPublicSupabaseEnv();

  let supabaseStatus = "Variables Supabase a renseigner";

  if (hasSupabaseEnv) {
    const supabase = await createClient();
    const { error } = await supabase.auth.getUser();
    supabaseStatus = error ? "Connexion Supabase presente, session absente" : "Connexion Supabase active";
  }

  return (
    <main className="min-h-screen bg-bg text-text">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-6 md:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase text-teal">RESQR V2</p>
            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
              Console operationnelle
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-text-muted md:text-base">
              Socle Next.js pour piloter les moyens critiques, les controles,
              les statuts et la tracabilite multi-structure.
            </p>
          </div>
          <div className="rounded-md border border-border-strong bg-surface-2 px-4 py-3 text-sm text-text-muted">
            {supabaseStatus}
          </div>
        </header>

        <div className="grid gap-3 md:grid-cols-4">
          {checkpoints.map((label) => (
            <div key={label} className="rounded-md border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-led-green" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-md border border-border bg-surface p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Vue moyens</h2>
              <p className="text-sm text-text-muted">Exemple d&apos;interface metier dense et lisible.</p>
              </div>
              <StatusDot status="red" label="2 critiques" />
            </div>

            <div className="grid gap-2">
              {[
                ["Ambulance A12", "Controle oxygenotherapie expire", "red"],
                ["Sac urgence 03", "Peremption proche: compresses steriles", "amber"],
                ["DSA reserve", "Checklist conforme", "green"],
                ["Lot hygiene B", "Jamais verifie", "black"],
              ].map(([name, detail, status]) => (
                <div
                  key={name}
                  className="grid gap-3 rounded-sm border border-border bg-bg-deep p-4 md:grid-cols-[180px_1fr_140px] md:items-center"
                >
                  <span className="font-medium">{name}</span>
                  <span className="text-sm text-text-muted">{detail}</span>
                  <StatusDot status={status as "black" | "green" | "amber" | "red"} label={status} />
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-md border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold">Priorites socle</h2>
            <div className="mt-5 grid gap-4 text-sm text-text-muted">
              <p>Isolation stricte par structure et politiques RLS des le modele de donnees.</p>
              <p>Evenements d&apos;audit immuables pour les actions critiques.</p>
              <p>Statuts recalculables depuis les faits, avec causes explicables.</p>
              <p>Interfaces terrain rapides, sobres et utilisables en situation contrainte.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
