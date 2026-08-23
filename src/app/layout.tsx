import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const fixed = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "aiwatch — Never wake to model_not_found",
  description:
    "Breaking-change monitor for 11 frontier labs. Deprecations, alias retirements, price thresholds & sunset alerts in <1h with fix-it notes. $5/mo, $39/yr.",
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fixed.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-40 border-b border-[var(--line-strong)] bg-[var(--paper)]/90 backdrop-blur">
          <div className="h-[3px] hazard" style={{ animation: "hazardShift 1.2s linear infinite" }} />
          <div className="mx-auto max-w-[1160px] px-4 sm:px-6 h-[64px] flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <span className="relative inline-flex h-8 w-8 items-center justify-center bg-[var(--ink)] text-[var(--paper)] overflow-hidden">
                <span className="absolute inset-0 hazard opacity-[0.08]" />
                <span className="relative text-[10px] font-bold tracking-widest">AW</span>
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[18px] font-bold tracking-tight">aiwatch</span>
                <span className="text-[9px] tracking-[0.18em] text-[var(--slate)] uppercase -mt-0.5">breaking-change monitor • 11 labs</span>
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-1 text-sm">
              <a href="/timeline" className="px-3 py-1.5 text-xs tracking-widest uppercase hover:bg-[var(--ink)] hover:text-[var(--paper)] transition">Timeline</a>
              <a href="/analytics" className="px-3 py-1.5 text-xs tracking-widest uppercase hover:bg-[var(--ink)] hover:text-[var(--paper)] transition">Analytics</a>
              <a href="/c/openai" className="px-3 py-1.5 text-xs tracking-widest uppercase text-[var(--slate)] hover:text-[var(--ink)]">Providers →</a>
              <a href="/follow" className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] bg-white px-3 py-1.5 text-xs uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--hazard)] animate-pulse" /> Follow
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-2 text-[10px] tracking-widest uppercase text-[var(--slate)]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live • checks every 4h
              </span>
              <a href="#pricing" className="inline-flex items-center gap-2 bg-[var(--ink)] text-[var(--paper)] px-4 py-2 text-xs tracking-widest uppercase hover:bg-black transition">
                Get alerts — $5<span className="opacity-60">/mo</span> <span className="hidden sm:inline">→</span>
              </a>
            </div>
          </div>
          <div className="hidden sm:flex mx-auto max-w-[1160px] px-6 py-1.5 border-t border-dashed border-[var(--line)] justify-between text-[10px] tracking-widest uppercase text-[var(--slate)]">
            <span>Direct from providers • 16 pages • checked every 4h</span>
            <span className="flex gap-4">
              <span>Effective dates tracked</span>
              <span className="hidden lg:inline">Fix-it notes included</span>
              <span>01 / 11 labs</span>
            </span>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-12 border-t border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]">
          <div className="h-[3px] hazard opacity-80" />
          <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-6 justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 inline-flex items-center justify-center bg-[var(--paper)] text-[var(--ink)] text-[10px] font-bold">AW</span>
                <span className="text-lg font-bold">aiwatch</span>
                <span className="text-xs opacity-60">© {new Date().getFullYear()}</span>
              </div>
              <p className="text-xs leading-relaxed opacity-60 max-w-md">Direct from providers, no hype. We watch the official docs and only alert when something actually changed.</p>
            </div>
            <div className="flex gap-10 text-xs tracking-widest uppercase">
              <div className="space-y-2">
                <div className="opacity-40">Navigate</div>
                <a href="/timeline" className="block hover:underline">Timeline</a>
                <a href="/analytics" className="block hover:underline">Analytics</a>
                <a href="/validate" className="block hover:underline">Smoke test</a>
              </div>
              <div className="space-y-2">
                <div className="opacity-40">Follow</div>
                <a href="/follow" className="block hover:underline">Follow options</a>
                <a href="/api/x-bot?preview=1" className="block hover:underline">X bot preview</a>
                <a href="https://github.com" className="block hover:underline">Source</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
