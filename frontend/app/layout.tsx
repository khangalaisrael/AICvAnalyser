import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "TalentScan — Know where your CV stands",
  description: "Score your CV against live job postings, catch ATS problems, and close skill gaps before you apply. Free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${sourceSerif.variable} h-full`}>
      <body className="min-h-full antialiased" style={{ fontFamily: "var(--font-sans), sans-serif", background: "#faf9f5", color: "#22272f" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
