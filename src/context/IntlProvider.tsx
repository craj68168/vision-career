"use client";

import { NextIntlClientProvider } from "next-intl";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import enMessages from "../../messages/en.json";
import jaMessages from "../../messages/ja.json";

type AppIntlProviderProps = {
  children: ReactNode;
};

const messages = {
  en: enMessages,
  ja: jaMessages,
} as const;

const isEnglishPath = (pathname: string | null) =>
  pathname === "/en" || pathname?.startsWith("/en/");

export default function AppIntlProvider({ children }: AppIntlProviderProps) {
  const pathname = usePathname();
  const locale = isEnglishPath(pathname) ? "en" : "ja";

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages[locale]}
      timeZone="Asia/Tokyo"
    >
      {children}
    </NextIntlClientProvider>
  );
}
