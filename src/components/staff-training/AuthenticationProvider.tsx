"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/context/LanguageContext";
import { Loader2 } from "lucide-react";

export default function AuthenticationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  const router = useRouter();
  const { lang } = useLanguage();
  const t = useTranslations("staff.authentication");

  const loginPath = lang === "ja" ? "/staff-login" : "/en/staff-login";

  useEffect(() => {
    const controller = new AbortController();

    const checkAuth = async () => {
      setIsCheckingAuth(true);
      setIsAllowed(false);

      try {
        const token = localStorage.getItem("staff_token");

        if (!token) {
          router.replace(loginPath);
          return;
        }

        const res = await fetch("https://vision-career.co.jp/profile.php", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("staff_token");
          }

          router.replace(loginPath);
          return;
        }

        setIsAllowed(true);
      } catch {
        if (controller.signal.aborted) return;

        router.replace(loginPath);
      } finally {
        if (!controller.signal.aborted) {
          setIsCheckingAuth(false);
        }
      }
    };

    void checkAuth();

    return () => controller.abort();
  }, [router, loginPath]);

  if (isCheckingAuth) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center gap-2 bg-white"
      >
        <Loader2 className="animate-spin" aria-hidden="true" />
        <p>{t("checking")}</p>
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}