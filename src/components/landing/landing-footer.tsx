import { Github, Linkedin, Sparkles } from "lucide-react";
import Link from "next/link";

const GITHUB_URL = "https://github.com/harshalgupta7/syncspace";
const LINKEDIN_URL = "https://www.linkedin.com/in/harshalgupta7/";

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="text-primary" size={16} />
            SyncSpace
          </div>
          <p className="text-sm text-muted-foreground">Built by Harshal Gupta</p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <a className="transition hover:text-foreground" href="#features">
            Features
          </a>
          <a className="transition hover:text-foreground" href="#workflow">
            Workflow
          </a>
          <Link className="transition hover:text-foreground" href="/login">
            Sign in
          </Link>
          <Link className="transition hover:text-foreground" href="/register">
            Get started
          </Link>
        </nav>

        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <a
            className="flex items-center gap-2 transition hover:text-foreground"
            href={GITHUB_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Github size={16} />
            GitHub
          </a>
          <a
            className="flex items-center gap-2 transition hover:text-foreground"
            href={LINKEDIN_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} SyncSpace. Built by Harshal Gupta.
      </p>
    </footer>
  );
}
