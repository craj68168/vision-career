"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { getCurrentStaff, getStaffDashboard } from "./api";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useStaffDashboard = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const logout = async () => {
    localStorage.removeItem("access_token");

    localStorage.removeItem("user_role");

    queryClient.removeQueries({
      queryKey: ["current-staff"],
    });

    queryClient.removeQueries({
      queryKey: ["staff-dashboard"],
    });

    queryClient.removeQueries({
      queryKey: ["staff-applications"],
    });

    queryClient.removeQueries({
      queryKey: ["staff-vacancies"],
    });

    queryClient.removeQueries({
      queryKey: ["staff-seekers"],
    });

    queryClient.removeQueries({
      queryKey: ["staff-providers"],
    });

    queryClient.removeQueries({
      queryKey: ["staff-placement-requests"],
    });

    queryClient.removeQueries({
      queryKey: ["staff-placement-candidates"],
    });

    queryClient.removeQueries({
      queryKey: ["staff-placement-candidate"],
    });

    queryClient.removeQueries({
      queryKey: ["staff-placement-billings"],
    });

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
