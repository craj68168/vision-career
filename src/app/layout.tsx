import type { Metadata } from "next";

import "./globals.css";

import AppIntlProvider from "@/context/IntlProvider";
import { SITE_URL, SEO_INDEXING_ENABLED } from "@/lib/siteConfig";

import QueryProvider from "./QueryProvider";

// ======================================================
// GLOBAL METADATA
// ======================================================

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Vision Career | Career and Recruitment Support in Japan",
    template: "%s | Vision Career",
  },

  description:
    "Vision Career connects job seekers and employers in Japan with recruitment, career, and job-placement support.",

  keywords: [
    "Vision Career",
    "jobs in Japan",
    "job seekers",
    "recruitment",
    "career support",
    "job placement",
  ],

  applicationName: "Vision Career",

  robots: SEO_INDEXING_ENABLED
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
        noarchive: true,
      },

  openGraph: {
    type: "website",

    siteName: "Vision Career",

    title: "Vision Career | Career and Recruitment Support in Japan",

    description:
      "Connect with employers and find career and job-placement support in Japan.",

    url: SITE_URL,

    locale: "ja_JP",

    alternateLocale: ["en_US"],
  },

  twitter: {
    card: "summary",

    title: "Vision Career | Career and Recruitment Support in Japan",

    description:
      "Connect with employers and find career and job-placement support in Japan.",
  },

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

// ======================================================
// ROOT LAYOUT
// ======================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",

    "@type": "Organization",

    name: "Vision Career",

    url: SITE_URL,

    logo: `${SITE_URL}/icon-512.png`,
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <AppIntlProvider>
          <QueryProvider>{children}</QueryProvider>
        </AppIntlProvider>
      </body>
    </html>
  );
}
