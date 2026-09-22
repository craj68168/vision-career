import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { LanguageProvider } from "@/context/LanguageContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Welcome to Vision Support",
  description: "Authentication page for Vision Support",
};

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className={`${poppins.variable} min-h-screen w-full font-poppins antialiased`}
    >
      <LanguageProvider>
        <main className="min-h-screen w-full">{children}</main>

        <Toaster />
      </LanguageProvider>
    </div>
  );
}
