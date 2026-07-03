import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { META, SITE_URL } from "../content";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: META.title,
  description: META.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: META.title,
    description: META.description,
    url: SITE_URL,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: META.title }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${interTight.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
