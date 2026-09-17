"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { getCurrentStaff, getStaffDashboard } from "./api";

export const useStaffDashboard = () => {
  const router = useRouter();

  const pathname = usePathname();

  const isEnglish = pathname.startsWith("/en/");

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: getCurrentStaff,

    retry: false,
  });

  const hasDashboardPermission =
    staffQuery.data?.data.permissions.includes("dashboard:view") ?? false;

  const dashboardQuery = useQuery({
    queryKey: ["staff-dashboard"],

    queryFn: getStaffDashboard,

    enabled: staffQuery.isSuccess && hasDashboardPermission,

    retry: false,
  });

  // ====================================================
  // AUTH FAILURE
  // ====================================================

  useEffect(() => {
    if (!staffQuery.isError) {
      return;
    }

    localStorage.removeItem("access_token");

    localStorage.removeItem("user_role");

    router.replace(isEnglish ? "/en/staff-login" : "/staff-login");
  }, [staffQuery.isError, router, isEnglish]);

  // ====================================================
  // LOGOUT
  // ====================================================

  const logout = () => {
    localStorage.removeItem("access_token");

    localStorage.removeItem("user_role");

    router.replace(isEnglish ? "/en/staff-login" : "/staff-login");
  };

  return {
    staff: staffQuery.data?.data,

    summary: dashboardQuery.data?.data.summary,

    isLoading:
      staffQuery.isLoading ||
      (hasDashboardPermission && dashboardQuery.isLoading),

    hasDashboardPermission,

    logout,
  };
};
