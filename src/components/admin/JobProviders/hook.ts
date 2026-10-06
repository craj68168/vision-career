"use client";
import { useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAdminProvider, deleteAdminProvider, getAdminProviderById, getAdminProviders, updateAdminProvider, updateAdminProviderStatus } from "./api";
import type { AdminProvider, CreateProviderPayload, ProviderApiError, ProviderReviewStatus, ProviderStatus, UpdateProviderPayload } from "./types";
export function useAdminProviders() {
  const t = useTranslations("adminProviders");
  const queryClient = useQueryClient();
  // FILTERS
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ProviderStatus>("ALL");
  const [reviewFilter, setReviewFilter] = useState<"ALL" | ProviderReviewStatus>("ALL");
  // MODALS
  const [creating, setCreating] = useState(false);
  const [viewingProviderId, setViewingProviderId] = useState<string | null>(null);
  const [editingProvider, setEditingProvider] = useState<AdminProvider | null>(null);
  const [deletingProvider, setDeletingProvider] = useState<AdminProvider | null>(null);
  // QUERIES
  const providersQuery = useQuery({ queryKey: ["admin-providers"], queryFn: getAdminProviders, staleTime: 1000 * 30, refetchOnWindowFocus: false, retry: 1 });
  const detailsQuery = useQuery({ queryKey: ["admin-provider-details", viewingProviderId], queryFn: () => getAdminProviderById(viewingProviderId!), enabled: Boolean(viewingProviderId), retry: 1 });
  // FILTER
  const filteredProviders = useMemo(() => {
    const providers = providersQuery.data?.data || [];
    const normalized = search.trim().toLowerCase();
    return providers.filter((provider) => {
      if (statusFilter !== "ALL" && provider.status !== statusFilter) return false;
      if (reviewFilter !== "ALL" && provider.staffReview.status !== reviewFilter) return false;
      if (!normalized) return true;
      const reviewKey = provider.staffReview.status === "REVIEWED" ? "reviewed" : provider.staffReview.status === "NEEDS_ATTENTION" ? "needsAttention" : "notReviewed";
      return [provider.registerId, provider.name, provider.companyName, provider.email, provider.phone, provider.industry, provider.address, provider.staffReview.status, provider.staffReview.note, t(reviewKey), t(provider.status)].filter(Boolean).join(" ").toLowerCase().includes(normalized);
    });
  }, [providersQuery.data, search, statusFilter, reviewFilter, t]);
  // ERROR: avoid displaying untranslated backend messages.
  const handleError = (error: unknown, fallback: string) => {
    if (axios.isAxiosError<ProviderApiError>(error)) {
      if (!error.response) { toast.error(t("networkError")); return; }
      const code = error.response.status;
      if (code === 401) { toast.error(t("unauthorized")); return; }
      if (code === 403) { toast.error(t("forbidden")); return; }
      if (code === 400 || code === 422) { toast.error(t("invalidInput")); return; }
      if (code === 409) { toast.error(t("conflict")); return; }
    }
    toast.error(fallback);
  };
  // INVALIDATE
  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-provider-details"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-vacancies"] }),
    ]);
  };
  // CREATE
  const createMutation = useMutation({
    mutationFn: createAdminProvider,
    onSuccess: async () => { toast.success(t("created")); setCreating(false); await invalidate(); },
    onError: (error: unknown) => handleError(error, t("createFailed")),
  });
  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ registerId, payload }: { registerId: string; payload: UpdateProviderPayload }) => updateAdminProvider(registerId, payload),
    onSuccess: async () => { toast.success(t("updated")); setEditingProvider(null); await invalidate(); },
    onError: (error: unknown) => handleError(error, t("updateFailed")),
  });
  // STATUS
  const statusMutation = useMutation({
    mutationFn: ({ registerId, status }: { registerId: string; status: ProviderStatus }) => updateAdminProviderStatus(registerId, status),
    onSuccess: async () => { toast.success(t("statusChanged")); await invalidate(); },
    onError: (error: unknown) => handleError(error, t("statusFailed")),
  });
  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteAdminProvider,
    onSuccess: async () => { toast.success(t("deleted")); setDeletingProvider(null); await invalidate(); },
    onError: (error: unknown) => handleError(error, t("deleteFailed")),
  });
  return {
    providers: filteredProviders,
    summary: providersQuery.data?.summary,
    search, setSearch, statusFilter, setStatusFilter, reviewFilter, setReviewFilter,
    creating, setCreating,
    viewingProvider: detailsQuery.data?.data,
    viewingProviderId, editingProvider, deletingProvider,
    isLoading: providersQuery.isLoading,
    isFetching: providersQuery.isFetching,
    isDetailsLoading: detailsQuery.isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isChangingStatus: statusMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isError: providersQuery.isError,
    isDetailsError: detailsQuery.isError,
    openView: (registerId: string) => setViewingProviderId(registerId),
    closeView: () => setViewingProviderId(null),
    openEdit: (provider: AdminProvider) => setEditingProvider(provider),
    closeEdit: () => setEditingProvider(null),
    openDelete: (provider: AdminProvider) => setDeletingProvider(provider),
    closeDelete: () => setDeletingProvider(null),
    createProvider: (payload: CreateProviderPayload) => createMutation.mutate(payload),
    updateProvider: (registerId: string, payload: UpdateProviderPayload) => updateMutation.mutate({ registerId, payload }),
    changeStatus: (registerId: string, status: ProviderStatus) => statusMutation.mutate({ registerId, status }),
    deleteProvider: (registerId: string) => deleteMutation.mutate(registerId),
    refetch: () => providersQuery.refetch(),
  };
}
