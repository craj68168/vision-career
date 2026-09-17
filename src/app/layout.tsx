import type { Metadata } from "next";

import "./globals.css";

import QueryProvider from "./QueryProvider";

export const metadata: Metadata = {
  title: "Vacancify",
  description: "Recruitment Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
