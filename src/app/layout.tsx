import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import { ReactNode } from "react";
import { cn } from "@udecode/cn";
import Navbar from "@/components/navbar/navbar";
import localFont from "next/font/local";
import Footer from "@/components/footer/footer";

const inter = Inter({ subsets: ["latin"] });

const grotesk = localFont({
  src: [
    { path: "fonts/CabinetGrotesk-Medium.otf", weight: "500", style: "medium" },
    { path: "fonts/CabinetGrotesk-Bold.otf", weight: "700", style: "bold" },
    { path: "fonts/CabinetGrotesk-Extrabold.otf", weight: "800", style: "extrabold" },
    { path: "fonts/CabinetGrotesk-Black.otf", weight: "900", style: "black" },
  ],
});

export const metadata: Metadata = {
  title: "Korektorr - snadná oprava textu",
  description: "Opravte chyby v textu bez reklam a nutnosti přihlášení.",
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "https://korektorr.cz",
    siteName: "Korektorr",
    title: "Korektorr - snadná oprava textu",
    description: "Opravte chyby v textu bez reklam a nutnosti přihlášení.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@adambartas",
    title: "Korektorr - snadná oprava textu",
    description: "Opravte chyby v textu bez reklam a nutnosti přihlášení.",
    creator: "@adambartas",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, grotesk.className, "relative flex min-h-screen flex-col bg-main")}>
        <Providers>
          <div className="flex flex-col min-h-svh">
            <Navbar />
            <main className="container mx-auto gap-2 flex-grow xl:px-44 lg:px-16 flex flex-col mt-4">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
