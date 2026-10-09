"use client";

import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import StaffHeader from "./StaffHeader";
import StaffSidebar from "./StaffSidebar";

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

  // Stable reference so StaffSidebar's effect does not re-run on every render.
  // (The sidebar already handles Escape + page scroll lock while the drawer is open.)
  const closeMobile = useCallback(() => setMobileOpen(false), []);

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

  // Only block on the first load. Background refetches (window focus,
  // stale data) must not replace the whole panel with a loading screen.
  if (staffQuery.isPending) {
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
    <div className="flex min-h-screen bg-[#F7F8FA] text-slate-950">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <StaffSidebar
        staff={staff}
        prefix={prefix}
        pathname={pathname}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
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
