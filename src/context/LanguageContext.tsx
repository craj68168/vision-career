"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";

const LanguageContext = createContext<{ lang: "ja" | "en" }>({ lang: "ja" });

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lang = pathname?.startsWith("/en") ? "en" : "ja";

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang }}>
      {children}
    </LanguageContext.Provider>
  );
}
