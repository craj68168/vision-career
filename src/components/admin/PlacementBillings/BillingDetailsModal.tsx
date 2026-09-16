"use client";

import {
  X,
  Building2,
  User,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  CreditCard,
  Receipt,
  Clock,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Printer,
  Send,
  FileEdit,
  Download,
  Users,
} from "lucide-react";
import {
  PlacementBilling,
  BillingStatus,
  PaymentStatus,
} from "@/hooks/usePlacementBillings";
import {
  BILLING_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
  formatCurrency,
  formatDate,
} from ".";

interface BillingDetailsModalProps {
  lang: string;
  billing: PlacementBilling | null;
  onClose: () => void;
  onEdit?: (billing: PlacementBilling) => void;
  onSend?: (billing: PlacementBilling) => void;
  onDownload?: (billing: PlacementBilling) => void;
  sendingInvoice: number | null;
}

export function BillingDetailsModal({
  lang,
  billing,
  onClose,
  onEdit,
  onSend,
  onDownload,
  sendingInvoice,
}: BillingDetailsModalProps) {
  if (!billing) return null;

  // Helper function to safely get status label
  const getStatusLabel = (status: BillingStatus | null, config: any) => {
    if (!status || !config[status]) return "-";
    return (
      config[status].label[
        lang as keyof (typeof config)[typeof status]["label"]
      ] || status
    );
  };

  const getBillingStatusBadge = (status: BillingStatus | null) => {
    if (!status) return null;
    const config = BILLING_STATUS_CONFIG[status];
    if (!config) return null;
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.color} ${config.darkColor || ""}`}
      >
        {config.icon}
        {config.label[lang as keyof typeof config.label] || status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: PaymentStatus | null) => {
    if (!status) return null;
    const config = PAYMENT_STATUS_CONFIG[status];
    if (!config) return null;
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.color} ${config.darkColor || ""}`}
      >
        {config.icon}
        {config.label[lang as keyof typeof config.label] || status}
      </span>
    );
  };

  const DetailItem = ({
    label,
    value,
    icon,
    link,
  }: {
    label: string;
    value: string | React.ReactNode;
    icon: React.ReactNode;
    link?: string;
  }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-slate-400 dark:text-slate-500">{icon}</div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              {value}
            </a>
          ) : (
            <div className="text-sm text-slate-900 dark:text-white">
              {value}
            </div>
          )}
        </div>
      </div>
    );
  };

  const SectionHeader = ({
    title,
    icon,
  }: {
    title: string;
    icon: React.ReactNode;
  }) => (
    <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-700">
      <span className="text-slate-400 dark:text-slate-500">{icon}</span>
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {title}
      </h4>
    </div>
  );

  const isOverdue =
    billing.due_date &&
    new Date(billing.due_date) < new Date() &&
    billing.payment_status !== "paid";

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900 truncate dark:text-white">
                {billing.invoice_number || "Invoice"}
              </h3>
              <div className="flex items-center gap-2">
                {getBillingStatusBadge(billing.billing_status)}
                {getPaymentStatusBadge(billing.payment_status)}
                {isOverdue && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {lang === "ja" ? "支払期限切れ" : "Overdue"}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-1 text-sm text-slate-500 truncate dark:text-slate-400">
              {billing.company_name} • {billing.job_title}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {onDownload && (
              <button
                onClick={() => onDownload(billing)}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                title={lang === "ja" ? "ダウンロード" : "Download"}
              >
                <Download className="h-4 w-4" />
              </button>
            )}
            {onSend && (
              <button
                onClick={() => onSend(billing)}
                disabled={
                  ["sent", "paid", "overdue"].some(
                    (s) => s === billing.billing_status,
                  ) || sendingInvoice === billing.billing_id
                }
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:hover:bg-slate-50 disabled:hover:text-slate-400 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                title={lang === "ja" ? "送信" : "Send"}
              >
                <Send className="h-4 w-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(billing)}
                className="rounded-xl border border-blue-200 bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                title={lang === "ja" ? "編集" : "Edit"}
              >
                <FileEdit className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-full p-2 px-3 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)] dark:bg-slate-800">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Billing Information */}
              <div>
                <SectionHeader
                  title={lang === "ja" ? "請求情報" : "Billing Information"}
                  icon={<Receipt className="h-4 w-4" />}
                />
                <div className="mt-3 space-y-3">
                  <DetailItem
                    label={lang === "ja" ? "請求書番号" : "Invoice Number"}
                    value={billing.invoice_number || "-"}
                    icon={<FileText className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "発行日" : "Issue Date"}
                    value={formatDate(lang, billing.issue_date)}
                    icon={<Calendar className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "支払期限" : "Due Date"}
                    value={
                      <div className="flex items-center gap-2">
                        <span className="dark:text-white">
                          {formatDate(lang, billing.due_date)}
                        </span>
                        {isOverdue && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                            <AlertCircle className="h-3 w-3" />
                            {lang === "ja" ? "期限切れ" : "Overdue"}
                          </span>
                        )}
                      </div>
                    }
                    icon={<Clock className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "支払日" : "Paid Date"}
                    value={formatDate(lang, billing.paid_date)}
                    icon={<CheckCircle2 className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "通貨" : "Currency"}
                    value={billing.currency || "-"}
                    icon={<CreditCard className="h-4 w-4" />}
                  />
                </div>
              </div>

              {/* Amount Details */}
              <div>
                <SectionHeader
                  title={lang === "ja" ? "金額詳細" : "Amount Details"}
                  icon={<DollarSign className="h-4 w-4" />}
                />
                <div className="mt-3 space-y-3">
                  <DetailItem
                    label={lang === "ja" ? "小計" : "Subtotal"}
                    value={formatCurrency(
                      billing.subtotal_amount,
                      billing.currency,
                    )}
                    icon={<DollarSign className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "税率" : "Tax Rate"}
                    value={`${billing.tax_rate}%`}
                    icon={<FileText className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "税額" : "Tax Amount"}
                    value={formatCurrency(billing.tax_amount, billing.currency)}
                    icon={<FileText className="h-4 w-4" />}
                  />
                  <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                    <DetailItem
                      label={lang === "ja" ? "合計金額" : "Total Amount"}
                      value={
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          {formatCurrency(
                            billing.total_amount,
                            billing.currency,
                          )}
                        </span>
                      }
                      icon={
                        <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Company Information */}
              <div>
                <SectionHeader
                  title={lang === "ja" ? "企業情報" : "Company Information"}
                  icon={<Building2 className="h-4 w-4" />}
                />
                <div className="mt-3 space-y-3">
                  <DetailItem
                    label={lang === "ja" ? "企業名" : "Company Name"}
                    value={billing.company_name || "-"}
                    icon={<Building2 className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "担当者" : "Contact Person"}
                    value={billing.company_contact_name || "-"}
                    icon={<User className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "メール" : "Email"}
                    value={billing.company_email || "-"}
                    icon={<Mail className="h-4 w-4" />}
                    link={
                      billing.company_email
                        ? `mailto:${billing.company_email}`
                        : undefined
                    }
                  />
                  <DetailItem
                    label={lang === "ja" ? "電話" : "Phone"}
                    value={billing.company_phone || "-"}
                    icon={<Phone className="h-4 w-4" />}
                    link={
                      billing.company_phone
                        ? `tel:${billing.company_phone}`
                        : undefined
                    }
                  />
                  {billing.company_note && (
                    <DetailItem
                      label={lang === "ja" ? "企業ノート" : "Company Note"}
                      value={billing.company_note}
                      icon={<FileText className="h-4 w-4" />}
                    />
                  )}
                </div>
              </div>

              {/* Candidate Information */}
              <div>
                <SectionHeader
                  title={lang === "ja" ? "候補者情報" : "Candidate Information"}
                  icon={<User className="h-4 w-4" />}
                />
                <div className="mt-3 space-y-3">
                  <DetailItem
                    label={lang === "ja" ? "名前" : "Name"}
                    value={billing.candidate_name || "-"}
                    icon={<User className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "メール" : "Email"}
                    value={billing.candidate_email || "-"}
                    icon={<Mail className="h-4 w-4" />}
                    link={
                      billing.candidate_email
                        ? `mailto:${billing.candidate_email}`
                        : undefined
                    }
                  />
                  <DetailItem
                    label={lang === "ja" ? "電話" : "Phone"}
                    value={billing.candidate_phone || "-"}
                    icon={<Phone className="h-4 w-4" />}
                    link={
                      billing.candidate_phone
                        ? `tel:${billing.candidate_phone}`
                        : undefined
                    }
                  />
                  <DetailItem
                    label={lang === "ja" ? "国籍" : "Nationality"}
                    value={billing.nationality || "-"}
                    icon={<Users className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "ビザ種類" : "Visa Type"}
                    value={billing.visa_type || "-"}
                    icon={<FileText className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
                    value={billing.japanese_level || "-"}
                    icon={<FileText className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Placement Details */}
          <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
            <SectionHeader
              title={lang === "ja" ? "配置詳細" : "Placement Details"}
              icon={<Briefcase className="h-4 w-4" />}
            />
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <DetailItem
                label={lang === "ja" ? "求人タイトル" : "Job Title"}
                value={billing.job_title || "-"}
                icon={<Briefcase className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "カテゴリー" : "Category"}
                value={billing.job_category?.replace(/_/g, " ") || "-"}
                icon={<Briefcase className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "雇用形態" : "Employment Type"}
                value={billing.employment_type || "-"}
                icon={<Briefcase className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "勤務地" : "Work Location"}
                value={billing.work_location || "-"}
                icon={<MapPin className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "配置日" : "Placement Date"}
                value={formatDate(lang, billing.placement_date)}
                icon={<Calendar className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "入社日" : "Joining Date"}
                value={formatDate(lang, billing.joining_date)}
                icon={<Calendar className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "手数料" : "Fee Amount"}
                value={
                  billing.fee_amount
                    ? formatCurrency(billing.fee_amount, billing.currency)
                    : "-"
                }
                icon={<DollarSign className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "支払ステータス" : "Payment Status"}
                value={
                  billing.payment_status &&
                  PAYMENT_STATUS_CONFIG[billing.payment_status]
                    ? PAYMENT_STATUS_CONFIG[billing.payment_status].label[
                        lang as keyof (typeof PAYMENT_STATUS_CONFIG)[typeof billing.payment_status]["label"]
                      ]
                    : "-"
                }
                icon={<CreditCard className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Admin Notes */}
          {billing.billing_admin_note && (
            <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
              <SectionHeader
                title={lang === "ja" ? "管理者ノート" : "Admin Notes"}
                icon={<FileText className="h-4 w-4" />}
              />
              <div className="mt-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
                <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                  {billing.billing_admin_note}
                </p>
              </div>
            </div>
          )}

          {/* Meta Information */}
          <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 dark:text-slate-500">
              <div>
                <span className="font-medium">
                  {lang === "ja" ? "作成日" : "Created"}:
                </span>{" "}
                {formatDate(lang, billing.billing_created_at)}
              </div>
              <div>
                <span className="font-medium">
                  {lang === "ja" ? "更新日" : "Updated"}:
                </span>{" "}
                {formatDate(lang, billing.billing_updated_at)}
              </div>
              {billing.created_by_admin_id && (
                <div>
                  <span className="font-medium">
                    {lang === "ja" ? "作成者ID" : "Created By Admin ID"}:
                  </span>{" "}
                  {billing.created_by_admin_id}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {lang === "ja" ? "閉じる" : "Close"}
            </button>

            <div className="flex flex-wrap gap-2">
              {onSend && (
                <button
                  onClick={() => onSend(billing)}
                  disabled={
                    ["sent", "paid", "overdue"].some(
                      (s) => s === billing.billing_status,
                    ) || sendingInvoice === billing.billing_id
                  }
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  <Send className="h-4 w-4" />
                  {lang === "ja" ? "送信" : "Send"}
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(billing)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <FileEdit className="h-4 w-4" />
                  {lang === "ja" ? "編集" : "Edit"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
