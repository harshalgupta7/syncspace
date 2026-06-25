import { CloudOff, History, Lock, Users, Zap, Gauge } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";

const features = [
  {
    icon: Zap,
    title: "Local-first editing",
    description: "Every keystroke saves instantly to your device. No spinners, no waiting for a network round trip."
  },
  {
    icon: CloudOff,
    title: "Offline autosync",
    description: "Keep working without a connection. Changes queue up and sync automatically the moment you're back online."
  },
  {
    icon: Users,
    title: "Granular permissions",
    description: "Share documents as Owner, Editor, or Viewer and control exactly who can read or change your work."
  },
  {
    icon: History,
    title: "Version history",
    description: "Every save is a checkpoint. Browse past versions and restore any of them in a single click."
  },
  {
    icon: Lock,
    title: "Secure by default",
    description: "Authentication and session handling are built in, so your documents stay private from the start."
  },
  {
    icon: Gauge,
    title: "Built for speed",
    description: "A minimal, distraction-free editor that stays fast whether you have one document or a hundred."
  }
];

export function FeaturesSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8" id="features">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Features</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mt-4 text-muted-foreground">
            A focused set of tools for writing and sharing knowledge without losing a word, online or off.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal delay={index * 0.05} key={feature.title}>
              <div className="h-full rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-black/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
