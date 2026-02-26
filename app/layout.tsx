import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { navigationQuery } from "@/sanity/lib/queries";
import Header from "./components/Header/Header";
import PageTransition from "./components/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js + Sanity",
  description: "Next.js application with Sanity CMS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nav = await sanityFetch({ query: navigationQuery });

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ngi1yzp.css" />
      </head>
      <body>
        <Header nav={nav} />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
