"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getProviderPlacementBillings } from "./api";

import type {
  ProviderPlacementBilling,
  ProviderPlacementBillingListResponse,
  ProviderPlacementBillingStatus,
} from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  refreshVersion: number;
};

// ======================================================
// PROVIDER BILLING HOOK
// ======================================================

export const useProviderBilling = ({ refreshVersion }: Props) => {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | ProviderPlacementBillingStatus
  >("ALL");

  const [viewingBilling, setViewingBilling] =
    useState<ProviderPlacementBilling | null>(null);

  // ======================================================
  // BILLINGS QUERY
  // ======================================================

  const billingsQuery = useQuery<ProviderPlacementBillingListResponse>({
    queryKey: ["provider-placement-billings", refreshVersion],

    queryFn: () => getProviderPlacementBillings(),

    staleTime: 30_000,

    refetchOnWindowFocus: false,

    retry: 1,
  });

  // ======================================================
  // DATA
  // ======================================================

  const billings: ProviderPlacementBilling[] = billingsQuery.data?.data ?? [];

  const summary = billingsQuery.data?.summary;

  // ======================================================
  // FILTERING
  // ======================================================

  const filteredBillings = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return billings.filter((billing: ProviderPlacementBilling) => {
      if (statusFilter !== "ALL" && billing.status !== statusFilter) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const haystack = [
        billing.billingId,
        billing.recruitId,
        billing.placementCandidateId,
        billing.companyName,
        billing.candidateName,
        billing.jobTitle,
        billing.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [billings, search, statusFilter]);

  // ======================================================
  // RETURN
  // ======================================================

  return {
    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    viewingBilling,
    setViewingBilling,

    billingsQuery,

    summary,

    filteredBillings,
  };
};
