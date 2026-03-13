import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { navigationQuery } from "@/sanity/lib/queries";
import Header from "./components/Header/Header";
import PageTransition from "./components/PageTransition";
import "./globals.css";

type NavData = {
  leftLinks?: { label?: string | null; slug?: string | null; title?: string | null }[] | null;
  rightLinks?: { label: string; url: string }[] | null;
  mobileText?: import('@portabletext/types').PortableTextBlock[] | null;
};

export const metadata: Metadata = {
  title: "Next.js + Sanity",
  description: "Next.js application with Sanity CMS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let nav: NavData | null = null;
  try {
    nav = await sanityFetch<NavData | null>({ query: navigationQuery });
  } catch {
    // Sanity error – continue without nav
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="stylesheet" href="https://use.typekit.net/ngi1yzp.css" />
      </head>
      <body>
        <Header nav={nav} />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
