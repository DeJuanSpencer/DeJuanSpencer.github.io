import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeJuan Spencer",
  description: "Software Engineer. Systems Thinker. Builder. Built in Cleveland. Refined in Irvine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
