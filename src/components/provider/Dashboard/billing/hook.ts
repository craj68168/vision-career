"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { getProviderPlacementBillings } from "./api";

import type {
  ProviderPlacementBilling,
  ProviderPlacementBillingListResponse,
  ProviderPlacementBillingStatus,
} from "./types";

type Props = {
  refreshVersion: number;
};

const STATUS_TRANSLATION_KEYS = {
  issued: "issued",
  paid: "paid",
  partially_refunded: "partiallyRefunded",
  refunded: "refunded",
  cancelled: "cancelled",
} as const satisfies Record<ProviderPlacementBillingStatus, string>;

export const useProviderBilling = ({ refreshVersion }: Props) => {
  const tStatus = useTranslations("provider.billing.list.statuses");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | ProviderPlacementBillingStatus
  >("ALL");

  const [viewingBilling, setViewingBilling] =
    useState<ProviderPlacementBilling | null>(null);

  // BILLINGS QUERY
  const billingsQuery = useQuery<ProviderPlacementBillingListResponse>({
    queryKey: ["provider-placement-billings", refreshVersion],
    queryFn: () => getProviderPlacementBillings(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const summary = billingsQuery.data?.summary;

  // FILTERING
  const filteredBillings = useMemo(() => {
    const billings = billingsQuery.data?.data ?? [];
    const keyword = search.trim().toLowerCase();

    return billings.filter((billing) => {
      if (statusFilter !== "ALL" && billing.status !== statusFilter) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const translatedStatus = tStatus(
        STATUS_TRANSLATION_KEYS[billing.status],
      );

      const haystack = [
        billing.billingId,
        billing.recruitId,
        billing.placementCandidateId,
        billing.companyName,
        billing.candidateName,
        billing.jobTitle,
        billing.status,
        translatedStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [billingsQuery.data?.data, search, statusFilter, tStatus]);

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