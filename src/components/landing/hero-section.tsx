import { ArrowRight, Check, Clock, FileText, Sparkles, Wifi } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsl(var(--primary)/0.16),transparent)]"
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="text-primary" size={14} />
          Local-first. Always in sync.
        </div>

        <h1
          className="animate-fade-in-up mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          style={{ animationDelay: "0.05s" }}
        >
          Write offline. Stay in sync everywhere.
        </h1>

        <p
          className="animate-fade-in-up mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          style={{ animationDelay: "0.1s" }}
        >
          SyncSpace is a local-first knowledge workspace. Every keystroke saves instantly to your
          device, then syncs the moment you&apos;re back online &mdash; with version history and
          shared access built in.
        </p>

        <div
          className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "0.15s" }}
        >
          <Link
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            href="/register"
          >
            Get started free
            <ArrowRight size={16} />
          </Link>
          <Link
            className="inline-flex items-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
            href="/login"
          >
            Sign in
          </Link>
        </div>

        <div className="animate-fade-in-up mt-20 w-full max-w-3xl" style={{ animationDelay: "0.25s" }}>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              <div className="ml-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <FileText size={12} />
                Product roadmap.md
              </div>
              <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                <Check size={12} />
                Saved
              </div>
            </div>
            <div className="space-y-3 px-6 py-8 text-left">
              <div className="h-3 w-2/3 rounded-full bg-muted" />
              <div className="h-3 w-full rounded-full bg-muted" />
              <div className="h-3 w-5/6 rounded-full bg-muted" />
              <div className="h-3 w-1/2 rounded-full bg-muted" />
            </div>
            <div className="flex items-center justify-between border-t border-border px-6 py-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                Updated just now
              </span>
              <span className="flex items-center gap-1.5">
                <Wifi className="text-emerald-400" size={12} />
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
