import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { getRole } from "@/actions/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CivicSolve — AI-Powered Civic Issue Management",
  description: "A national-scale platform for reporting, deduplicating, and prioritizing civic infrastructure issues using AI. Track potholes, drainage, streetlights, and more.",
  keywords: ["civic issues", "urban infrastructure", "pothole reporting", "AI deduplication", "SDG tracking"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const role = await getRole();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar initialRole={role} />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
