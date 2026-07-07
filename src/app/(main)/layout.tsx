import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";
import { QueryProvider } from "@/context/QueryProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vision Support",
  description: "Vision Support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-poppins">
        <LanguageProvider>
          <QueryProvider>
            <Navbar />
            <main className="font-poppins">{children}</main>
          </QueryProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
