import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import { ReactNode } from "react";
import { cn } from "@udecode/cn";
import Navbar from "@/components/navbar/navbar";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"] });

const grotesk = localFont({
  src: [
    { path: "fonts/CabinetGrotesk-Medium.otf", weight: "500", style: "medium" },
    { path: "fonts/CabinetGrotesk-Bold.otf", weight: "600", style: "bold" },
    { path: "fonts/CabinetGrotesk-Black.otf", weight: "800", style: "black" },
  ],
});

export const metadata: Metadata = {
  title: "Korektorr",
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
          <Navbar />
          <main className="container mx-auto gap-2 xl:px-48 lg:px-20 flex flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
