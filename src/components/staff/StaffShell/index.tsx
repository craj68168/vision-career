"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import StaffHeader from "./StaffHeader";
import StaffSidebar from "./StaffSidebar";
import { staffShellStyles } from "./styles";

type StaffShellProps = {
  children: ReactNode;
};

export default function StaffShell({ children }: StaffShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const staffQuery = useQuery({
    queryKey: ["current-staff"],
    queryFn: getCurrentStaff,
    retry: false,
    staleTime: 60 * 1000,
  });

  const isEnglish = pathname.startsWith("/en/");
  const prefix = isEnglish ? "/en" : "";
  const pathWithoutLocale = isEnglish ? pathname.replace(/^\/en/, "") : pathname;
  const japaneseHref = pathWithoutLocale || "/staff";
  const englishHref = `/en${pathWithoutLocale || "/staff"}`;

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");

    queryClient.removeQueries({ queryKey: ["current-staff"] });
    queryClient.removeQueries({ queryKey: ["staff-dashboard"] });
    queryClient.removeQueries({ queryKey: ["staff-applications"] });
    queryClient.removeQueries({ queryKey: ["staff-vacancies"] });
    queryClient.removeQueries({ queryKey: ["staff-seekers"] });
    queryClient.removeQueries({ queryKey: ["staff-providers"] });
    queryClient.removeQueries({ queryKey: ["staff-placement-requests"] });
    queryClient.removeQueries({ queryKey: ["staff-placement-candidates"] });
    queryClient.removeQueries({ queryKey: ["staff-placement-candidate"] });
    queryClient.removeQueries({ queryKey: ["staff-placement-billings"] });
    queryClient.removeQueries({ queryKey: ["staff-training-categories"] });

    router.replace(isEnglish ? "/en/staff-login" : "/staff-login");
  };

  if (staffQuery.isPending || staffQuery.isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
        <p className="text-sm text-slate-500">Loading Staff panel...</p>
      </div>
    );
  }

  const staff = staffQuery.data?.data;

  if (!staff) {
    return null;
  }

  return (
    <div className="staff-shell">
      <style dangerouslySetInnerHTML={{ __html: staffShellStyles }} />

      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <StaffSidebar
        staff={staff}
        prefix={prefix}
        pathname={pathname}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={logout}
      />

      <main className="min-w-0 flex-1">
        <StaffHeader
          collapsed={collapsed}
          isEnglish={isEnglish}
          japaneseHref={japaneseHref}
          englishHref={englishHref}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
          onOpenMobile={() => {
            setCollapsed(false);
            setMobileOpen(true);
          }}
        />

        {children}
      </main>
    </div>
  );
}
