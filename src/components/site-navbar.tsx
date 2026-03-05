"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" }
];

export function SiteNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        isScrolled ? "bg-white/92 shadow-lg backdrop-blur border-b border-slate-100" : "bg-transparent"
      }`}
    >
      <nav className="container-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="font-heading text-lg font-semibold tracking-tight">
          [Your Logo Here]
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="pill bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            Get Started
          </Link>
        </div>
        <Link
          href="/dashboard"
          className="pill bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white md:hidden"
        >
          Start
        </Link>
      </nav>
    </header>
  );
}
