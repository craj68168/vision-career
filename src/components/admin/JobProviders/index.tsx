"use client";

import type { ComponentType } from "react";
import {
  AlertTriangle,
  Ban,
  Building2,
  CheckCircle2,
  CircleDashed,
  Edit3,
  Eye,
  PauseCircle,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import { useAdminProviders } from "./hook";

import type { ProviderReviewStatus, ProviderStatus } from "./types";

import CreateModal from "./CreateModal";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import ViewModal from "./ViewModal";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const selectClass =
  "h-9 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white";

type Lang = "ja" | "en";

// Raw IDs are noisy, so show a short reference instead (full ID on hover).
const shortId = (id: string) => (id.length > 8 ? `#${id.slice(-6)}` : id);

// ======================================================
// STAFF REVIEW
// ======================================================

const reviewLabel = (status: ProviderReviewStatus, lang: Lang) => {
  switch (status) {
    case "REVIEWED":
      return lang === "ja" ? "確認済み" : "Reviewed";

    case "NEEDS_ATTENTION":
      return lang === "ja" ? "要確認" : "Needs Attention";

    default:
      return lang === "ja" ? "未確認" : "Not Reviewed";
  }
};

const reviewClass = (status: ProviderReviewStatus) => {
  switch (status) {
    case "REVIEWED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";

    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";

    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";
  }
};

// ======================================================
// ACCOUNT STATUS
// ======================================================

const statusLabel = (status: ProviderStatus, lang: Lang) => {
  switch (status) {
    case "active":
      return lang === "ja" ? "有効" : "Active";

    case "suspended":
      return lang === "ja" ? "停止中" : "Suspended";

    default:
      return lang === "ja" ? "無効" : "Inactive";
  }
};

const statusClass = (status: ProviderStatus) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";

    case "suspended":
      return "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300";

    default:
      return "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300";
  }
};

// ======================================================
// MAIN
// ======================================================

export default function AdminJobProviders() {
  const { lang } = useLanguage();
  const ja = lang === "ja";

  const {
    providers,
    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    reviewFilter,
    setReviewFilter,

    creating,
    setCreating,

    viewingProvider,

    editingProvider,

    deletingProvider,

    isLoading,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,

    openView,
    closeView,

    openEdit,
    closeEdit,

    openDelete,
    closeDelete,

    createProvider,
    updateProvider,
    deleteProvider,

    refetch,
  } = useAdminProviders();

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center sm:min-h-[500px]">
        <RefreshCw
          role="status"
          aria-label={ja ? "読み込み中" : "Loading"}
          className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400"
        />
      </div>
    );
  }

  const hasActiveFilters =
    statusFilter !== "ALL" || reviewFilter !== "ALL" || Boolean(search);

  const clearFilters = () => {
    setStatusFilter("ALL");
    setReviewFilter("ALL");
    setSearch("");
  };

  return (
    <div className="min-w-0 space-y-4">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
            {ja ? "クライアント企業" : "Client Companies"}
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {ja
              ? "スタッフの確認状況を確認し、登録済みの企業を管理します。"
              : "View Staff operational reviews and manage registered Job Providers."}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refetch()}
            className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            {ja ? "更新" : "Refresh"}
          </button>

          <button
            type="button"
            onClick={() => setCreating(true)}
            className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-700 sm:flex-none ${focusRing}`}
          >
            <Plus className="h-4 w-4" />
            {ja ? "企業を追加" : "New Company"}
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY (clickable: cards apply the matching filter) */}
      {/* ================================================= */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 2xl:grid-cols-7">
        <Summary
          label={ja ? "総数" : "Total"}
          value={summary?.total || 0}
          icon={Building2}
          isActive={statusFilter === "ALL" && reviewFilter === "ALL"}
          onClick={() => {
            setStatusFilter("ALL");
            setReviewFilter("ALL");
          }}
        />

        <Summary
          label={ja ? "有効" : "Active"}
          value={summary?.active || 0}
          icon={CheckCircle2}
          isActive={statusFilter === "active"}
          onClick={() => setStatusFilter("active")}
        />

        <Summary
          label={ja ? "無効" : "Inactive"}
          value={summary?.inactive || 0}
          icon={PauseCircle}
          isActive={statusFilter === "inactive"}
          onClick={() => setStatusFilter("inactive")}
        />

        <Summary
          label={ja ? "停止中" : "Suspended"}
          value={summary?.suspended || 0}
          icon={Ban}
          isActive={statusFilter === "suspended"}
          onClick={() => setStatusFilter("suspended")}
        />

        <Summary
          label={ja ? "未確認" : "Not Reviewed"}
          value={summary?.notReviewed || 0}
          icon={CircleDashed}
          isActive={reviewFilter === "NOT_REVIEWED"}
          onClick={() => setReviewFilter("NOT_REVIEWED")}
        />

        <Summary
          label={ja ? "確認済み" : "Reviewed"}
          value={summary?.reviewed || 0}
          icon={ShieldCheck}
          isActive={reviewFilter === "REVIEWED"}
          onClick={() => setReviewFilter("REVIEWED")}
        />

        <Summary
          label={ja ? "要確認" : "Needs Attention"}
          value={summary?.needsAttention || 0}
          icon={AlertTriangle}
          isActive={reviewFilter === "NEEDS_ATTENTION"}
          onClick={() => setReviewFilter("NEEDS_ATTENTION")}
        />
      </div>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label={ja ? "企業を検索" : "Search providers"}
              placeholder={
                ja
                  ? "担当者、メール、企業、業種を検索..."
                  : "Search provider, email, company or industry..."
              }
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          {/* ACCOUNT STATUS */}

          <select
            value={statusFilter}
            aria-label={ja ? "アカウント状態" : "Account status"}
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | ProviderStatus)
            }
            className={selectClass}
          >
            <option value="ALL">
              {ja ? "すべてのアカウント状態" : "All Account Statuses"}
            </option>

            <option value="active">{ja ? "有効" : "Active"}</option>

            <option value="inactive">{ja ? "無効" : "Inactive"}</option>

            <option value="suspended">{ja ? "停止中" : "Suspended"}</option>
          </select>

          {/* STAFF REVIEW */}

          <select
            value={reviewFilter}
            aria-label={ja ? "スタッフ確認" : "Staff review"}
            onChange={(event) =>
              setReviewFilter(
                event.target.value as "ALL" | ProviderReviewStatus,
              )
            }
            className={selectClass}
          >
            <option value="ALL">
              {ja ? "すべてのスタッフ確認" : "All Staff Reviews"}
            </option>

            <option value="NOT_REVIEWED">{ja ? "未確認" : "Not Reviewed"}</option>

            <option value="REVIEWED">{ja ? "確認済み" : "Reviewed"}</option>

            <option value="NEEDS_ATTENTION">
              {ja ? "要確認" : "Needs Attention"}
            </option>
          </select>
        </div>
      </div>

      {/* ================================================= */}
      {/* LIST */}
      {/* ================================================= */}

      {providers.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-12 text-center dark:border-white/10 dark:bg-zinc-900 sm:py-16">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {ja ? "企業が見つかりません。" : "No Providers found."}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className={`mt-4 inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
            >
              {ja ? "フィルターをクリア" : "Clear filters"}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* CARDS (below xl) */}

          <div className="grid gap-3 md:grid-cols-2 xl:hidden">
            {providers.map((provider) => (
              <article
                key={provider.registerId}
                className="flex min-w-0 flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-semibold text-zinc-950 dark:text-white">
                      {provider.companyName}
                    </h3>

                    <p className="mt-0.5 break-words text-sm text-zinc-600 dark:text-zinc-300">
                      {provider.name}
                      {provider.phone ? ` · ${provider.phone}` : ""}
                    </p>

                    <p
                      title={provider.registerId}
                      className="mt-0.5 truncate text-xs text-zinc-400 dark:text-zinc-500"
                    >
                      {shortId(provider.registerId)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(
                      provider.status,
                    )}`}
                  >
                    {statusLabel(provider.status, lang)}
                  </span>
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-md bg-zinc-50 p-3 dark:bg-white/5">
                  <CardField
                    label={ja ? "業種" : "Industry"}
                    value={provider.industry}
                  />

                  <CardField
                    label={ja ? "求人 / 応募" : "Vacancies / Applications"}
                    value={`${provider.vacancyCount} / ${provider.applicationCount}`}
                  />

                  <div className="col-span-2">
                    <CardField
                      label={ja ? "メール" : "Email"}
                      value={provider.email}
                    />
                  </div>
                </dl>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {ja ? "スタッフ確認" : "Staff Review"}
                  </span>

                  <span
                    className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${reviewClass(
                      provider.staffReview.status,
                    )}`}
                  >
                    {reviewLabel(provider.staffReview.status, lang)}
                  </span>
                </div>

                {provider.staffReview.status === "NEEDS_ATTENTION" &&
                  provider.staffReview.note && (
                    <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 dark:border-red-400/20 dark:bg-red-400/10">
                      <p className="line-clamp-2 break-words text-sm text-red-600 dark:text-red-300/90">
                        {provider.staffReview.note}
                      </p>
                    </div>
                  )}

                <div className="mt-auto flex flex-wrap justify-end gap-2 pt-3">
                  <ProviderActions
                    lang={lang}
                    onView={() => openView(provider.registerId)}
                    onEdit={() => openEdit(provider)}
                    onDelete={() => openDelete(provider)}
                  />
                </div>
              </article>
            ))}
          </div>

          {/* TABLE (xl and up) */}

          <div className="hidden overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900 xl:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">
                      {ja ? "企業" : "Company"}
                    </th>

                    <th className="px-4 py-2.5 font-medium">
                      {ja ? "担当者" : "Contact"}
                    </th>

                    <th className="px-4 py-2.5 font-medium">
                      {ja ? "メール" : "Email"}
                    </th>

                    <th className="px-4 py-2.5 font-medium">
                      {ja ? "アカウント" : "Account"}
                    </th>

                    <th className="px-4 py-2.5 font-medium">
                      {ja ? "スタッフ確認" : "Staff Review"}
                    </th>

                    <th className="px-4 py-2.5 text-center font-medium">
                      {ja ? "求人" : "Vacancies"}
                    </th>

                    <th className="px-4 py-2.5 text-center font-medium">
                      {ja ? "応募" : "Applications"}
                    </th>

                    <th className="px-4 py-2.5 text-right font-medium">
                      {ja ? "操作" : "Actions"}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                  {providers.map((provider) => (
                    <tr
                      key={provider.registerId}
                      className="transition hover:bg-zinc-50 dark:hover:bg-white/5"
                    >
                      {/* COMPANY */}

                      <td className="px-4 py-2.5">
                        <p className="font-medium text-zinc-950 dark:text-white">
                          {provider.companyName}
                        </p>

                        <p
                          title={provider.registerId}
                          className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400"
                        >
                          {provider.industry
                            ? `${provider.industry} · ${shortId(provider.registerId)}`
                            : shortId(provider.registerId)}
                        </p>
                      </td>

                      {/* CONTACT */}

                      <td className="px-4 py-2.5">
                        <p className="text-sm text-zinc-900 dark:text-zinc-100">
                          {provider.name}
                        </p>

                        {provider.phone && (
                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            {provider.phone}
                          </p>
                        )}
                      </td>

                      {/* EMAIL */}

                      <td className="break-all px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                        {provider.email}
                      </td>

                      {/* ACCOUNT */}

                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(
                            provider.status,
                          )}`}
                        >
                          {statusLabel(provider.status, lang)}
                        </span>
                      </td>

                      {/* STAFF REVIEW */}

                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${reviewClass(
                            provider.staffReview.status,
                          )}`}
                        >
                          {reviewLabel(provider.staffReview.status, lang)}
                        </span>

                        {provider.staffReview.status === "NEEDS_ATTENTION" &&
                          provider.staffReview.note && (
                            <p
                              title={provider.staffReview.note}
                              className="mt-1 max-w-[190px] truncate text-xs text-red-500 dark:text-red-300"
                            >
                              {provider.staffReview.note}
                            </p>
                          )}
                      </td>

                      {/* VACANCIES */}

                      <td className="px-4 py-2.5 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {provider.vacancyCount}
                      </td>

                      {/* APPLICATIONS */}

                      <td className="px-4 py-2.5 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {provider.applicationCount}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-4 py-2.5">
                        <div className="flex justify-end gap-1.5">
                          <ProviderActions
                            compact
                            lang={lang}
                            onView={() => openView(provider.registerId)}
                            onEdit={() => openEdit(provider)}
                            onDelete={() => openDelete(provider)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ================================================= */}
      {/* MODALS */}
      {/* ================================================= */}

      {creating && (
        <CreateModal
          isSubmitting={isCreating}
          onClose={() => setCreating(false)}
          onSubmit={createProvider}
        />
      )}

      {viewingProvider && (
        <ViewModal provider={viewingProvider} onClose={closeView} />
      )}

      {editingProvider && (
        <EditModal
          provider={editingProvider}
          isSubmitting={isUpdating}
          onClose={closeEdit}
          onSubmit={updateProvider}
        />
      )}

      {deletingProvider && (
        <DeleteModal
          provider={deletingProvider}
          isDeleting={isDeleting}
          onClose={closeDelete}
          onDelete={deleteProvider}
        />
      )}
    </div>
  );
}

// ======================================================
// ACTIONS
// ======================================================

function ProviderActions({
  compact = false,
  lang,
  onView,
  onEdit,
  onDelete,
}: {
  compact?: boolean;
  lang: Lang;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const ja = lang === "ja";

  const viewLabel = ja ? "詳細" : "View";
  const editLabel = ja ? "編集" : "Edit";
  const deleteLabel = ja ? "削除" : "Delete";

  const base = compact
    ? "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition"
    : "inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition sm:flex-none";

  const neutral =
    "border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10";

  const danger =
    "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10";

  return (
    <>
      <button
        type="button"
        onClick={onView}
        aria-label={viewLabel}
        title={viewLabel}
        className={`${base} ${neutral} ${focusRing}`}
      >
        <Eye className="h-4 w-4" />
        {!compact && viewLabel}
      </button>

      <button
        type="button"
        onClick={onEdit}
        aria-label={editLabel}
        title={editLabel}
        className={`${base} ${neutral} ${focusRing}`}
      >
        <Edit3 className="h-4 w-4" />
        {!compact && editLabel}
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label={deleteLabel}
        title={deleteLabel}
        className={`${base} ${danger} ${focusRing}`}
      >
        <Trash2 className="h-4 w-4" />
        {!compact && deleteLabel}
      </button>
    </>
  );
}

// ======================================================
// CARD FIELD
// ======================================================

function CardField({
  label,
  value,
}: {
  label: string;

  value?: string | null;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>

      <dd className="mt-0.5 break-words text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value || "-"}
      </dd>
    </div>
  );
}

// ======================================================
// SUMMARY
// ======================================================

function Summary({
  label,
  value,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  value: number;
  icon: ComponentType<{
    className?: string;
  }>;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`min-w-0 cursor-pointer rounded-lg border bg-white p-3 text-left shadow-sm transition hover:border-emerald-500/50 hover:shadow-md dark:bg-zinc-900 ${focusRing} ${
        isActive
          ? "border-emerald-500 ring-2 ring-emerald-500/20"
          : "border-zinc-200 dark:border-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>

          <p className="mt-0.5 text-xl font-semibold leading-tight text-zinc-950 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </button>
  );
}