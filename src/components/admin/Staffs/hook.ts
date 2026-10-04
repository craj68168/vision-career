"use client";
import { useMemo, useState } from "react";
import axios from "axios";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createStaff, getStaffList, getStaffPermissionOptions, resetStaffPassword, updateStaff } from "./api";
import type { ApiErrorResponse, CreateStaffPayload, ResetStaffPasswordPayload, Staff, StaffStatus, UpdateStaffPayload } from "./types";
// QUERY KEYS
const STAFF_QUERY_KEY = ["admin-staff"] as const;
const STAFF_PERMISSION_QUERY_KEY = ["admin-staff-permissions"] as const;
// HOOK
export const useStaffHook = () => {
  const t = useTranslations("adminStaff");
  const queryClient = useQueryClient();
  // FILTERS
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | StaffStatus>("ALL");
  // MODALS
  const [viewingStaff, setViewingStaff] = useState<Staff | null>(null);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [resetPasswordStaff, setResetPasswordStaff] = useState<Staff | null>(null);
  // QUERIES
  const staffQuery = useQuery({ queryKey: STAFF_QUERY_KEY, queryFn: getStaffList });
  const permissionQuery = useQuery({ queryKey: STAFF_PERMISSION_QUERY_KEY, queryFn: getStaffPermissionOptions });
  // ERROR HELPER: localize UI notifications instead of displaying English API messages.
  const getErrorMessage = (error: unknown) => {
    if (!axios.isAxiosError<ApiErrorResponse>(error)) return t("messages.generic");
    if (!error.response) return t("messages.network");
    switch (error.response.status) {
      case 400:
      case 422: return t("messages.invalid");
      case 401: return t("messages.unauthorized");
      case 403: return t("messages.forbidden");
      case 404: return t("messages.notFound");
      case 409: return t("messages.conflict");
      case 429: return t("messages.rateLimit");
      default: return t(error.response.status >= 500 ? "messages.server" : "messages.generic");
    }
  };
  // INVALIDATE
  const invalidateStaff = async () => {
    await queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
    await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
  };
  // CREATE STAFF
  const createMutation = useMutation({
    mutationFn: createStaff,
    onSuccess: async () => {
      toast.success(t("messages.created"));
      setCreateModalOpen(false);
      await invalidateStaff();
    },
    onError: (error: unknown) => { toast.error(getErrorMessage(error)); },
  });
  // UPDATE STAFF
  const updateMutation = useMutation({
    mutationFn: ({ staffId, payload }: { staffId: string; payload: UpdateStaffPayload }) => updateStaff(staffId, payload),
    onSuccess: async (response) => {
      toast.success(t("messages.updated"));
      setEditingStaff(null);
      setViewingStaff((current) => {
        if (!current || current.staffId !== response.data.staffId) return current;
        return response.data;
      });
      await invalidateStaff();
    },
    onError: (error: unknown) => { toast.error(getErrorMessage(error)); },
  });
  // RESET PASSWORD
  const resetPasswordMutation = useMutation({
    mutationFn: ({ staffId, payload }: { staffId: string; payload: ResetStaffPasswordPayload }) => resetStaffPassword(staffId, payload),
    onSuccess: async () => {
      toast.success(t("messages.passwordReset"));
      setResetPasswordStaff(null);
      await invalidateStaff();
    },
    onError: (error: unknown) => { toast.error(getErrorMessage(error)); },
  });
  // DATA
  const staff = staffQuery.data?.data ?? [];
  const summary = staffQuery.data?.summary;
  const permissionOptions = permissionQuery.data?.data ?? [];
  // FILTER
  const filteredStaff = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return staff.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!keyword) return true;
      const searchable = [item.staffId, item.name, item.email, item.phone, item.status, t(`statuses.${item.status}`)]
        .filter(Boolean).join(" ").toLowerCase();
      return searchable.includes(keyword);
    });
  }, [staff, search, statusFilter, t]);
  // STATES
  const isSaving = createMutation.isPending || updateMutation.isPending || resetPasswordMutation.isPending;
  // ACTIONS
  const refresh = async () => { await staffQuery.refetch(); };
  const submitCreateStaff = (payload: CreateStaffPayload) => { createMutation.mutate(payload); };
  const submitUpdateStaff = (staffId: string, payload: UpdateStaffPayload) => { updateMutation.mutate({ staffId, payload }); };
  const submitResetPassword = (staffId: string, password: string) => { resetPasswordMutation.mutate({ staffId, payload: { password } }); };
  // RETURN
  return {
    staff: filteredStaff, summary, permissionOptions,
    search, setSearch, statusFilter, setStatusFilter,
    viewingStaff, setViewingStaff, editingStaff, setEditingStaff,
    createModalOpen, setCreateModalOpen, resetPasswordStaff, setResetPasswordStaff,
    isLoading: staffQuery.isLoading, isFetching: staffQuery.isFetching, isSaving,
    refresh, submitCreateStaff, submitUpdateStaff, submitResetPassword,
  };
};
