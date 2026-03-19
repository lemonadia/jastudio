import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { navigationQuery, footerQuery, cookieBannerQuery } from "@/sanity/lib/queries";
import Header from "./components/Header/Header";
import PageTransition from "./components/PageTransition";
import Footer from "./components/Footer/Footer";
import CookieBanner from "./components/CookieBanner/CookieBanner";
import "./globals.css";

type NavData = {
  leftLinks?: { label?: string | null; slug?: string | null; title?: string | null }[] | null;
  rightLinks?: { label: string; url: string }[] | null;
  mobileText?: import('@portabletext/types').PortableTextBlock[] | null;
};

type FooterData = {
  links?: { label?: string | null; url?: string | null }[] | null;
};

type CookieBannerData = import('./components/CookieBanner/CookieBanner').CookieBannerData

/** Ikony: opcjonalnie `public/apple-touch-icon.png` 180×180 (ostry na iOS) zamiast `/icon.png`. */
export const metadata: Metadata = {
  title: "Next.js + Sanity",
  description: "Next.js application with Sanity CMS",
  manifest: "/site.webmanifest",
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    title: "King's Crow",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/web-app-manifest-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/web-app-manifest-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon-96x96.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let nav: NavData | null = null;
  let footer: FooterData | null = null;
  let cookieBanner: CookieBannerData = null;
  try {
    nav = await sanityFetch<NavData | null>({ query: navigationQuery });
  } catch {
    // Sanity error – continue without nav
  }
  try {
    footer = await sanityFetch<FooterData | null>({ query: footerQuery });
  } catch {
    // ignore footer errors
  }
  try {
    cookieBanner = await sanityFetch<CookieBannerData>({ query: cookieBannerQuery });
  } catch {
    // ignore cookie banner errors
  }

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ngi1yzp.css" />
      </head>
      <body>
        <Header nav={nav} />
        <PageTransition>{children}</PageTransition>
        <Footer links={footer?.links ?? []} />
        <CookieBanner data={cookieBanner} />
      </body>
    </html>
  );
}
