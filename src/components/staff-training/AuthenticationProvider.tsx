"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Loader2 } from "lucide-react";

export default function AuthenticationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const router = useRouter();
  const { lang } = useLanguage();

  useEffect(() => {
    const token = localStorage.getItem("staff_token");

    if (!token) {
      router.replace(lang === "ja" ? "/staff-login" : "/en/staff-login");
      return;
    }
    const checkAuth = async () => {
      try {
        const res = await fetch("https://vision-career.co.jp/profile.php", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok && res.status === 401) {
          localStorage.removeItem("staff_token");
          router.replace(lang === "ja" ? "/staff-login" : "/en/staff-login");
          return;
        }

        setIsAllowed(true);
      } catch (error) {
        localStorage.removeItem("staff_token");
        router.replace(lang === "ja" ? "/staff-login" : "/en/staff-login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 bg-white z-100 min-h-screen flex items-center justify-center gap-1">
        <Loader2 className="animate-spin" />
        <p>Checking Authentication...</p>
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
