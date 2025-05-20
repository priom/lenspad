import Header from "@/components/header";
import { Providers } from "@/components/providers";
import type React from "react";
import "../../public/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lens Pad",
  description: "Future of decentralized social",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased m-0 p-0 min-h-screen min-w-[340px]`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-6 py-12">
              {children}
            </main>
          </div>
        </Providers>
        <footer className="border-t border-border py-6 px-6">
          <div className="container mx-auto">
            <p className="text-center text-muted-foreground uppercase">
              © 2025 Not weird at all
            </p>
            <Toaster></Toaster>
          </div>
        </footer>
      </body>
    </html>
  );
}
