import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/landing/reveal";

export function CtaSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-3xl rounded-2xl border border-border bg-card px-6 py-14 text-center sm:px-12">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Start writing, online or off
        </h2>
        <p className="mt-4 text-muted-foreground">
          Create your first document in under a minute. No credit card, no setup.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
      </Reveal>
    </section>
  );
}
