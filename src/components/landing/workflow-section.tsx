import { ArrowRight, FileText, PencilLine, RefreshCw } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";

const steps = [
  {
    icon: FileText,
    title: "Create",
    description: "Start a new document in seconds. No setup, no loading screens."
  },
  {
    icon: PencilLine,
    title: "Edit offline",
    description: "Keep writing on a plane, in a tunnel, or anywhere else the network drops."
  },
  {
    icon: RefreshCw,
    title: "Sync",
    description: "Reconnect and your changes merge automatically, with a full version history."
  }
];

export function WorkflowSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8" id="workflow">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Workflow</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Three steps. Zero friction.
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
          {steps.map((step, index) => (
            <div className="flex flex-1 items-center gap-4" key={step.title}>
              <Reveal className="flex-1" delay={index * 0.1}>
                <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon size={20} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </Reveal>

              {index < steps.length - 1 ? (
                <ArrowRight className="hidden shrink-0 text-muted-foreground lg:block" size={20} />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
