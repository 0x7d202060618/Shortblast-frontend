import React, { Suspense } from "react";

import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/utils/functions";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import WalletConnectProvider from "@/contexts/WalletConnectProvider";

import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ShortBlast",
  description: "MEME COIN MARKETPLACE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Suspense>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <WalletConnectProvider>
              <Navbar />
              {children}
            </WalletConnectProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
