import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const serifFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "F1rsteholdet",
  description: "F1rsteholdets fælles digitale rum."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="da">
      <body className={`${displayFont.variable} ${serifFont.variable}`}>{children}</body>
    </html>
  );
}
