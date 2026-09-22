import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";

import Navbar from "@/components/layout/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vision Support",
  description: "Vision Support",
};

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div
      className={`${poppins.variable} min-h-screen w-full font-poppins antialiased`}
    >
      <LanguageProvider>
        <Navbar />

        <main className="w-full">{children}</main>

        <Toaster />
      </LanguageProvider>
    </div>
  );
}
