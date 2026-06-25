"use client";

import { Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "Workflow" }
];

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2 font-semibold text-foreground" href="/">
          <Sparkles className="text-primary" size={20} />
          SyncSpace
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link className="text-sm font-medium text-muted-foreground transition hover:text-foreground" href="/login">
            Sign in
          </Link>
          <Link
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            href="/register"
          >
            Get started
          </Link>
        </div>

        <button
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="animate-fade-in-up border-t border-border px-4 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                href={link.href}
                key={link.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              className="rounded-md border border-border px-4 py-2 text-center text-sm font-medium text-foreground transition hover:bg-muted"
              href="/login"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition hover:opacity-90"
              href="/register"
              onClick={() => setIsMenuOpen(false)}
            >
              Get started
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
