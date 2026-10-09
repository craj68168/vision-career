"use client";

import type { ComponentType, ReactNode } from "react";

import { useLocale, useTranslations } from "next-intl";

import {
  Ban,
  BriefcaseBusiness,
  History,
  Loader2,
  MessageSquareText,
  Receipt,
  RotateCcw,
  Wallet,
  X,
} from "lucide-react";

import {
  formatBillingDate,
  formatBillingDateTime,
  formatMoney,
  getBillingStatusClass,
} from "./helper";

import type { BillingAuditEntry, PlacementBilling } from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  billing: PlacementBilling | undefined;

  loading: boolean;

  onClose: () => void;
};

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const badgeClass = "rounded-full px-3 py-1 text-xs font-semibold";

const secondaryButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

// ======================================================
// COMPONENT
// ======================================================

export default function BillingDetails({ billing, loading, onClose }: Props) {
  const t = useTranslations("staffPlacementBillings");

  const locale = useLocale();

  if (loading) {
    return (
      <div
        role="status"
        className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-5 text-sm text-slate-600 shadow-2xl ring-1 ring-slate-200">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />

          {t("details.loading")}
        </div>
      </div>
    );
  }

  if (!billing) {
    return null;
  }

  const auditLabel = (action: BillingAuditEntry["action"]) => {
    switch (action) {
      case "CREATED":
        return t("auditActions.CREATED");

      case "UPDATED":
        return t("auditActions.UPDATED");

      case "ISSUED":
        return t("auditActions.ISSUED");

      case "MARKED_PAID":
        return t("auditActions.MARKED_PAID");

      case "CANCELLED":
        return t("auditActions.CANCELLED");

      case "REFUND_PROCESSED":
        return t("auditActions.REFUND_PROCESSED");

      default:
        return action;
    }
  };

  const actorLabel = (actor: "system" | "admin" | "staff") => {
    switch (actor) {
      case "admin":
        return t("actorTypes.admin");

      case "staff":
        return t("actorTypes.staff");

      default:
        return t("actorTypes.system");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={billing.billingId}
      className="fixed inset-0 z-[150] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      {/* BACKDROP */}

      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label={t("details.close")}
      />

      {/* MODAL */}

      <div className="relative z-10 flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:max-h-[92dvh] sm:rounded-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative shrink-0 overflow-hidden bg-[linear-gradient(120deg,#eef2ff_0%,#f5f3ff_45%,#ffffff_100%)] px-4 py-4 shadow-[inset_0_-1px_0_0_#e0e7ff] sm:px-6 sm:py-5">
          {/* decorative grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.07)_1px,transparent_1px)] bg-[length:44px_44px] [mask-image:linear-gradient(90deg,#000,transparent)]"
          />

          <div className="relative flex items-start gap-3 sm:gap-4">
            <span
              aria-hidden="true"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-white shadow-md shadow-indigo-600/30"
            >
              <Receipt className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                {t("details.eyebrow")}
              </p>

              <h2 className="mt-0.5 break-all text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                {billing.billingId}
              </h2>

              {billing.invoiceNumber && (
                <p className="mt-1 break-all text-xs font-medium text-indigo-600">
                  {t("details.invoiceNumber")}: {billing.invoiceNumber}
                </p>
              )}

              <p className="mt-1 break-words text-xs text-slate-500">
                {billing.companyName}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`${badgeClass} ${getBillingStatusClass(
                    billing.status,
                  )}`}
                >
                  {t(`statuses.${billing.status}`)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("details.close")}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-slate-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* SCROLLABLE CONTENT */}
        {/* ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/60">
          <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
            {/* PLACEMENT */}

            <Section
              icon={BriefcaseBusiness}
              title={t("details.placement")}
              accent="indigo"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info
                  label={t("details.candidate")}
                  value={billing.candidateName}
                />

                <Info label={t("details.position")} value={billing.jobTitle} />

                <Info
                  label={t("details.recruitId")}
                  value={billing.recruitId}
                />

                <Info
                  label={t("details.candidateId")}
                  value={billing.placementCandidateId}
                />

                <Info
                  label={t("details.providerId")}
                  value={billing.providerId}
                />

                <Info
                  label={t("details.placementDate")}
                  value={formatBillingDate(billing.placementDate, locale)}
                />
              </div>
            </Section>

            {/* BILLING */}

            <Section
              icon={Receipt}
              title={t("details.billing")}
              accent="sky"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Money
                  label={t("details.placementFee")}
                  value={billing.placementFee}
                  currency={billing.currency}
                  locale={locale}
                />

                <Money
                  label={t("details.tax", {
                    rate: billing.taxRate,
                  })}
                  value={billing.taxAmount}
                  currency={billing.currency}
                  locale={locale}
                />

                <Money
                  label={t("details.totalAmount")}
                  value={billing.totalAmount}
                  currency={billing.currency}
                  locale={locale}
                />

                <Info
                  label={t("details.dueDate")}
                  value={formatBillingDate(billing.dueDate, locale)}
                />
              </div>
            </Section>

            {/* PAYMENT */}

            <Section
              icon={Wallet}
              title={t("details.payment")}
              accent="emerald"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <Money
                  label={t("details.paid")}
                  value={billing.paidAmount}
                  currency={billing.currency}
                  locale={locale}
                />

                <Money
                  label={t("details.refunded")}
                  value={billing.refundedAmount}
                  currency={billing.currency}
                  locale={locale}
                />

                <Money
                  label={t("details.netPaid")}
                  value={billing.netPaidAmount}
                  currency={billing.currency}
                  locale={locale}
                />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Info
                  label={t("details.issuedAt")}
                  value={formatBillingDateTime(billing.issuedAt, locale)}
                />

                <Info
                  label={t("details.paidAt")}
                  value={formatBillingDateTime(billing.paidAt, locale)}
                />
              </div>
            </Section>

            {/* NOTES */}

            {billing.notes && (
              <Section
                icon={MessageSquareText}
                title={t("details.notes")}
                accent="amber"
              >
                <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 ring-1 ring-inset ring-slate-200">
                  {billing.notes}
                </p>
              </Section>
            )}

            {/* CANCELLATION */}

            {billing.cancellationReason && (
              <Section
                icon={Ban}
                title={t("details.cancellationReason")}
                accent="rose"
              >
                <p className="whitespace-pre-wrap rounded-xl bg-rose-50 p-4 text-sm leading-6 text-rose-700 ring-1 ring-inset ring-rose-200">
                  {billing.cancellationReason}
                </p>
              </Section>
            )}

            {/* REFUNDS + AUDIT */}

            <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
              <Section
                icon={RotateCcw}
                title={t("details.refundHistory")}
                accent="violet"
              >
                {billing.refundHistory.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    {t("details.noRefunds")}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {billing.refundHistory.map((refund, index) => (
                      <div
                        key={refund._id || `${refund.refundId}-${index}`}
                        className="rounded-xl bg-rose-50/60 p-4 ring-1 ring-inset ring-rose-100"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="break-all font-semibold text-slate-950">
                              {refund.refundId}
                            </p>

                            <p className="mt-0.5 break-all text-xs text-slate-500">
                              {actorLabel(refund.actor_type)}
                              {" • "}
                              {refund.actor_id}
                            </p>
                          </div>

                          <p className="font-semibold tabular-nums text-rose-700">
                            {formatMoney(
                              refund.amount,
                              billing.currency,
                              locale,
                            )}
                          </p>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                          {refund.reason}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {formatBillingDateTime(refund.refunded_at, locale)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              <Section
                icon={History}
                title={t("details.auditHistory")}
                accent="teal"
              >
                {billing.auditHistory.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    {t("details.noAudit")}
                  </p>
                ) : (
                  <Timeline>
                    {billing.auditHistory.map((entry, index) => (
                      <TimelineItem
                        key={entry._id || `${entry.action}-${index}`}
                        title={auditLabel(entry.action)}
                        subtitle={`${actorLabel(entry.actor_type)}${
                          entry.actor_id ? ` • ${entry.actor_id}` : ""
                        }`}
                        note={entry.reason}
                        period={formatBillingDateTime(
                          entry.created_at,
                          locale,
                        )}
                      />
                    ))}
                  </Timeline>
                )}
              </Section>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-col-reverse gap-2 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[inset_0_1px_0_0_#e2e8f0] sm:flex-row sm:justify-end sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className={secondaryButton}
          >
            {t("details.close")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// SECTION
//
// Full class names are written out so Tailwind can
// detect them.
// ======================================================

const sectionAccents = {
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  teal: "bg-teal-50 text-teal-600 ring-teal-100",
} as const;

function Section({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: ComponentType<{ className?: string }>;

  title: string;

  accent: keyof typeof sectionAccents;

  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset ${sectionAccents[accent]}`}
        >
          <Icon className="h-4 w-4" />
        </span>

        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

// ======================================================
// TIMELINE
// ======================================================

function Timeline({ children }: { children: ReactNode }) {
  return (
    <ol className="relative ml-1.5 space-y-4 pl-5 before:absolute before:bottom-1 before:left-0 before:top-1 before:w-px before:bg-slate-200 before:content-['']">
      {children}
    </ol>
  );
}

function TimelineItem({
  title,
  subtitle,
  note,
  period,
}: {
  title: string;

  subtitle: string;

  note?: string | null;

  period: string;
}) {
  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className="absolute -left-[24px] top-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-white"
      />

      <p className="break-words font-semibold text-slate-950">{title}</p>

      <p className="mt-0.5 break-all text-sm text-slate-600">{subtitle}</p>

      {note && (
        <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
          {note}
        </p>
      )}

      <p className="mt-1 text-xs text-slate-400">{period}</p>
    </li>
  );
}

// ======================================================
// INFO
// ======================================================

function Info({
  label,
  value,
}: {
  label: string;

  value: string | null | undefined;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-950">
        {value || "-"}
      </p>
    </div>
  );
}

// ======================================================
// MONEY
// ======================================================

function Money({
  label,
  value,
  currency,
  locale,
}: {
  label: string;

  value: number;

  currency: string;

  locale: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold tabular-nums text-slate-950">
        {formatMoney(value, currency, locale)}
      </p>
    </div>
  );
}