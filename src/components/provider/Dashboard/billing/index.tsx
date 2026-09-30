"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Eye,
  ReceiptText,
  RefreshCw,
  Search,
} from "lucide-react";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { useProviderBilling } from "./hook";

import ProviderBillingDetailsModal from "./ProviderBillingDetailsModal";

import type { ProviderPlacementBillingStatus } from "./types";

type Props = {
  lang: string;

  refreshVersion: number;
};

// Shared tokens: keep in sync with vacancies.tsx / provider-dashboard.tsx
const PANEL = "rounded-[14px] bg-white/70 ring-1 ring-black/5";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-800/50 focus-visible:ring-offset-1";

const BTN = `inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[12px] px-3.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS}`;

const BTN_SECONDARY = `${BTN} bg-white/80 text-slate-700 ring-1 ring-black/10 hover:bg-white hover:text-slate-900`;

const CONTROL =
  "w-full rounded-[12px] bg-white px-3.5 py-2.5 text-sm ring-1 ring-black/10 placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-800/50 disabled:cursor-not-allowed disabled:bg-slate-900/[0.03] disabled:text-slate-500";

const TH = "px-5 py-3 text-xs font-medium uppercase tracking-wide";

const TD = "px-5 py-4 text-sm";

export default function Billing({ lang, refreshVersion }: Props) {
  const t = useTranslations("provider.billing.list");

  const {
    search,

    setSearch,

    statusFilter,

    setStatusFilter,

    viewingBilling,

    setViewingBilling,

    billingsQuery,

    summary,

    filteredBillings,
  } = useProviderBilling({
    refreshVersion,
  });

  return (
    <>
      <section className="mt-8 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight">
              {t("title")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">{t("description")}</p>
          </div>

          <button
            type="button"
            disabled={billingsQuery.isFetching}
            onClick={() => void billingsQuery.refetch()}
            className={`${BTN_SECONDARY} self-start sm:self-auto`}
          >
            <RefreshCw
              className={`h-4 w-4 shrink-0 text-slate-500 ${
                billingsQuery.isFetching ? "animate-spin" : ""
              }`}
              aria-hidden="true"
            />

            {t("refresh")}
          </button>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <MoneyCard
            lang={lang}
            label={t("summary.totalBilled")}
            value={summary?.billedTotal || 0}
            icon={<ReceiptText className="h-4 w-4 text-slate-600" />}
            iconBg="bg-slate-100 ring-slate-200/80"
          />

          <MoneyCard
            lang={lang}
            label={t("summary.outstanding")}
            value={summary?.outstandingTotal || 0}
            icon={<CalendarDays className="h-4 w-4 text-amber-600" />}
            iconBg="bg-amber-50 ring-amber-200/70"
            rail="bg-amber-600"
          />

          <MoneyCard
            lang={lang}
            label={t("summary.netPaid")}
            value={summary?.paidTotal || 0}
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            iconBg="bg-emerald-50 ring-emerald-200/70"
            rail="bg-emerald-600"
          />

          <MoneyCard
            lang={lang}
            label={t("summary.overdue")}
            value={summary?.overdueTotal || 0}
            icon={<AlertTriangle className="h-4 w-4 text-red-700" />}
            iconBg="bg-red-50 ring-red-200/70"
            rail="bg-red-700"
          />
        </div>

        <div className={`grid gap-3 p-3 md:grid-cols-[1fr_220px] ${PANEL}`}>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              className={`${CONTROL} pl-10`}
            />
          </div>

          <select
            value={statusFilter}
            aria-label={t("allStatuses")}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "ALL" | ProviderPlacementBillingStatus,
              )
            }
            className={CONTROL}
          >
            <option value="ALL">{t("allStatuses")}</option>

            <option value="issued">{t("statuses.issued")}</option>

            <option value="paid">{t("statuses.paid")}</option>

            <option value="partially_refunded">
              {t("statuses.partiallyRefunded")}
            </option>

            <option value="refunded">{t("statuses.refunded")}</option>

            <option value="cancelled">{t("statuses.cancelled")}</option>
          </select>
        </div>

        <div className={`overflow-hidden ${PANEL}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-900/[0.03] text-left text-slate-500">
                <tr>
                  <th scope="col" className={TH}>
                    {t("table.invoice")}
                  </th>

                  <th scope="col" className={TH}>
                    {t("table.candidate")}
                  </th>

                  <th scope="col" className={TH}>
                    {t("table.position")}
                  </th>

                  <th scope="col" className={`${TH} text-right`}>
                    {t("table.total")}
                  </th>

                  <th scope="col" className={`${TH} text-right`}>
                    {t("table.amountDue")}
                  </th>

                  <th scope="col" className={TH}>
                    {t("table.dueDate")}
                  </th>

                  <th scope="col" className={TH}>
                    {t("table.status")}
                  </th>

                  <th scope="col" className={`${TH} text-right`}>
                    {t("table.action")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {billingsQuery.isLoading && (
                  <tr>
                    <td colSpan={8} className="py-16">
                      <div
                        role="status"
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 ring-1 ring-black/5">
                          <RefreshCw
                            className="h-5 w-5 animate-spin text-teal-800"
                            aria-hidden="true"
                          />
                        </div>

                        <p className="text-sm text-slate-500">{t("loading")}</p>
                      </div>
                    </td>
                  </tr>
                )}

                {!billingsQuery.isLoading && filteredBillings.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-sm text-slate-500"
                    >
                      {t("empty")}
                    </td>
                  </tr>
                )}

                {!billingsQuery.isLoading &&
                  filteredBillings.map((billing) => (
                    <tr
                      key={billing.billingId}
                      className="border-t border-black/5 transition-colors hover:bg-white/60"
                    >
                      <td className={TD}>
                        <p className="font-mono font-medium tabular-nums">
                          {billing.billingId}
                        </p>

                        <p className="mt-0.5 font-mono text-xs tabular-nums text-slate-500">
                          {billing.recruitId}
                        </p>
                      </td>

                      <td className={`${TD} font-medium`}>
                        {billing.candidateName}
                      </td>

                      <td className={`${TD} text-slate-600`}>
                        {billing.jobTitle}
                      </td>

                      <td
                        className={`${TD} text-right font-mono font-medium tabular-nums`}
                      >
                        {formatMoney(billing.totalAmount, lang)}
                      </td>

                      <td
                        className={`${TD} text-right font-mono tabular-nums`}
                      >
                        {billing.status === "issued"
                          ? formatMoney(billing.amountDue, lang)
                          : "-"}
                      </td>

                      <td className={`${TD} text-slate-600`}>
                        {formatDate(billing.dueDate, lang)}
                      </td>

                      <td className={TD}>
                        <StatusLabel status={billing.status} />
                      </td>

                      <td className={`${TD} text-right`}>
                        <button
                          type="button"
                          onClick={() => setViewingBilling(billing)}
                          className={BTN_SECONDARY}
                        >
                          <Eye
                            className="h-4 w-4 shrink-0 text-slate-500"
                            aria-hidden="true"
                          />

                          {t("viewInvoice")}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ProviderBillingDetailsModal
        billing={viewingBilling}
        lang={lang}
        onClose={() => setViewingBilling(null)}
      />
    </>
  );
}

function MoneyCard({
  lang,
  label,
  value,
  icon,
  iconBg,
  rail,
}: {
  lang: string;

  label: string;

  value: number;

  icon: ReactNode;

  iconBg: string;

  /** Status rail, only for cards that map to a status. */
  rail?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden p-4 md:p-5 ${rail ? "pl-5 md:pl-6" : ""} ${PANEL}`}
    >
      {rail && (
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 w-1.5 ${rail}`}
        />
      )}

      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-slate-500">{label}</p>

        <div
          aria-hidden="true"
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ring-1 ${iconBg}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 break-words font-mono text-2xl font-semibold tabular-nums tracking-tight">
        {formatMoney(value, lang)}
      </p>
    </div>
  );
}

const STATUS_TONES: Record<
  ProviderPlacementBillingStatus,
  { text: string; dot: string }
> = {
  issued: { text: "text-teal-700", dot: "bg-teal-700" },

  paid: { text: "text-emerald-700", dot: "bg-emerald-600" },

  partially_refunded: { text: "text-amber-700", dot: "bg-amber-600" },

  refunded: { text: "text-slate-500", dot: "bg-slate-400" },

  cancelled: { text: "text-red-700", dot: "bg-red-700" },
};

function StatusLabel({ status }: { status: ProviderPlacementBillingStatus }) {
  const t = useTranslations("provider.billing.list.statuses");

  const tone = STATUS_TONES[status];

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap text-xs font-medium uppercase tracking-[0.15em] ${tone.text}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`}
      />

      {t(status === "partially_refunded" ? "partiallyRefunded" : status)}
    </span>
  );
}

function formatMoney(value: number, lang: string) {
  return `¥${new Intl.NumberFormat(lang === "ja" ? "ja-JP" : "en-US").format(
    Number(value || 0),
  )}`;
}

function formatDate(value: string | null | undefined, lang: string) {
  if (!value || !dayjs(value).isValid()) {
    return "-";
  }

  return dayjs(value).format(lang === "ja" ? "YYYY/MM/DD" : "MMM D, YYYY");
}