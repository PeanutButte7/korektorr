import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import { ReactNode } from "react";
import { cn } from "@udecode/cn";
import Navbar from "@/components/navbar/navbar";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={cn(inter.className, "relative flex min-h-screen flex-col bg-slate-100 ")}>
        <Providers>
          <Navbar />
          <main className="container mx-auto gap-2 xl:px-48 lg:px-20 flex flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
