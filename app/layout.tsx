import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { navigationQuery, footerQuery } from "@/sanity/lib/queries";
import Header from "./components/Header/Header";
import PageTransition from "./components/PageTransition";
import Footer from "./components/Footer/Footer";
import "./globals.css";

type NavData = {
  leftLinks?: { label?: string | null; slug?: string | null; title?: string | null }[] | null;
  rightLinks?: { label: string; url: string }[] | null;
  mobileText?: import('@portabletext/types').PortableTextBlock[] | null;
};

type FooterData = {
  links?: { label?: string | null; url?: string | null }[] | null;
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
  let footer: FooterData | null = null;
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

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="stylesheet" href="https://use.typekit.net/ngi1yzp.css" />
      </head>
      <body>
        <Header nav={nav} />
        <PageTransition>{children}</PageTransition>
        <Footer links={footer?.links ?? []} />
      </body>
    </html>
  );
}
