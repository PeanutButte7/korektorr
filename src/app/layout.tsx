import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import { ReactNode } from "react";
import { cn } from "@udecode/cn";

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
      <body className={cn(inter.className, "flex min-h-screen flex-col  relative")}>
    <Providers>{children}</Providers>
  </body>
</html>
  );
}
