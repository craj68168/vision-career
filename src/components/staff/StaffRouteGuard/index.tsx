"use client";

import type { ReactNode } from "react";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { getCurrentStaff } from "@/components/auth/Staff/api";

// ======================================================
// PROPS
// ======================================================

type StaffRouteGuardProps = {
  children: ReactNode;
};

// ======================================================
// STAFF ROUTE GUARD
// ======================================================

export default function StaffRouteGuard({ children }: StaffRouteGuardProps) {
  const router = useRouter();

  const pathname = usePathname();

  const isEnglish = pathname.startsWith("/en/");

  const loginPath = isEnglish ? "/en/staff-login" : "/staff-login";

  // ====================================================
  // CURRENT STAFF QUERY
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: async () => {
      // ================================================
      // CHECK LOCAL AUTH FIRST
      // ================================================

      const token = localStorage.getItem("access_token");

      const role = localStorage.getItem("user_role");

      if (!token || role !== "staff") {
        throw new Error("STAFF_AUTH_REQUIRED");
      }

      // ================================================
      // VERIFY TOKEN WITH BACKEND
      // ================================================

      return getCurrentStaff();
    },

    retry: false,

    staleTime: 60 * 1000,
  });

  // ====================================================
  // REDIRECT INVALID SESSION
  // ====================================================

  useEffect(() => {
    if (!staffQuery.isError) {
      return;
    }

    // ==================================================
    // CLEAR INVALID STAFF AUTH
    // ==================================================

    localStorage.removeItem("access_token");

    localStorage.removeItem("user_role");

    // ==================================================
    // REDIRECT
    // ==================================================

    router.replace(loginPath);
  }, [staffQuery.isError, router, loginPath]);

  // ====================================================
  // LOADING
  // ====================================================

  if (staffQuery.isPending || staffQuery.isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-slate-500">
            Checking Staff session...
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  //
  // Redirect effect is running.
  // Do not render protected content.
  // ====================================================

  if (staffQuery.isError) {
    return null;
  }

  // ====================================================
  // EXTRA SAFETY
  // ====================================================

  if (!staffQuery.data?.data || staffQuery.data.data.role !== "staff") {
    return null;
  }

  // ====================================================
  // AUTHENTICATED
  // ====================================================

  return <>{children}</>;
}
