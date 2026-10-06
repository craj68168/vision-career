import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Inter, Noto_Sans_JP } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { LanguageProvider } from "@/context/LanguageContext";
import { QueryProvider } from "@/context/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Welcome to Vision Support",
  description: "Authentication page for Vision Support",
};

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div
      className={`${inter.variable} ${notoSansJP.variable} min-h-screen w-full antialiased`}
    >
      <QueryProvider>
        <LanguageProvider>
          <main className="min-h-screen w-full">{children}</main>

          <Toaster />
        </LanguageProvider>
      </QueryProvider>
    </div>
  );
}