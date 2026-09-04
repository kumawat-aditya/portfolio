import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { Instrument } from "@/components/chrome/Instrument";
import { Grain } from "@/components/chrome/Grain";
import { person } from "@/content/site";
import { activeTheme, activeThemeName, themeCssVars } from "@/lib/theme";
import "./globals.css";

/* three typefaces, three jobs:
   Fraunces  — the author speaking (WONK on: it has a slight lean to it)
   Plex Mono — the machine reporting
   Caveat    — the margin, thinking out loud                                 */

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: `${person.name} — something is still running`,
  description:
    "Aditya Kumawat builds systems that keep running when nobody is watching them: real-time trading engines, state machines, and data pipelines that had to survive being wrong.",
  authors: [{ name: person.name, url: person.github }],
  openGraph: {
    title: `${person.name} — something is still running`,
    description:
      "Backend and real-time systems, mostly. A small corner of the internet with a one-second heartbeat.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: activeTheme.surface.paper,
  colorScheme: activeTheme.scheme,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-color-theme={activeThemeName}
      data-scheme={activeTheme.scheme}
      className={`${fraunces.variable} ${plexMono.variable} ${caveat.variable}`}
      style={themeCssVars}
    >
      <body className="antialiased">
        <a
          href="#work"
          className="voice-machine sr-only focus:not-sr-only focus:fixed focus:top-6 focus:left-6 focus:z-[120] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper-raised"
        >
          Skip to the work
        </a>
        {children}
        <Instrument />
        <Grain />
      </body>
    </html>
  );
}
