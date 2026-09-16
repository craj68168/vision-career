"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminDashboard } from "./api";

// ======================================================
// ADMIN DASHBOARD QUERY
// ======================================================

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],

    queryFn: getAdminDashboard,

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};
