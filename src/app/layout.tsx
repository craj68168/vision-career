import type { Metadata } from "next";

import "./globals.css";

import AppIntlProvider from "@/context/IntlProvider";
import QueryProvider from "./QueryProvider";

export const metadata: Metadata = {
  title: "Vision Career",
  description: "Recruitment Platform",
  applicationName: "Vision Career",
  icons: {
    icon: [
      {
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Vision Career",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppIntlProvider>
          <QueryProvider>{children}</QueryProvider>
        </AppIntlProvider>
      </body>
    </html>
  );
}