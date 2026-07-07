"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import { PlacementBilling, BillingStatus } from "@/hooks/usePlacementBillings";
import {
  BILLING_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
  formatCurrency,
  formatDate,
} from "./placement-billings";
import toast from "react-hot-toast";

interface BillingEditModalProps {
  lang: string;
  billing: PlacementBilling | null;
  token: string | null;
  onClose: () => void;
  onSuccess?: (updatedBilling: PlacementBilling) => void;
  onRefresh?: () => void;
}

interface FormData {
  billing_status: BillingStatus | "";
  issue_date: string;
  due_date: string;
  paid_date: string;
  subtotal_amount: string;
  tax_rate: string;
  currency: string;
  admin_note: string;
  company_note: string;
  deposit_amount: string;
  paid_amount: string;
}

export function BillingEditModal({
  lang,
  billing,
  token,
  onClose,
  onSuccess,
  onRefresh,
}: BillingEditModalProps) {
  const [formData, setFormData] = useState<FormData>({
    billing_status: "",
    issue_date: "",
    due_date: "",
    paid_date: "",
    subtotal_amount: "",
    tax_rate: "",
    currency: "JPY",
    admin_note: "",
    company_note: "",
    deposit_amount: "",
    paid_amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form with billing data
  useEffect(() => {
    if (billing) {
      setFormData({
        billing_status: billing.billing_status || "",
        issue_date: billing.issue_date || "",
        due_date: billing.due_date || "",
        paid_date: billing.paid_date || "",
        subtotal_amount: billing.subtotal_amount?.toString() || "",
        tax_rate: billing.tax_rate?.toString() || "",
        currency: billing.currency || "JPY",
        admin_note: billing.billing_admin_note || "",
        company_note: billing.billing_company_note || "",
        deposit_amount: billing.deposit_amount?.toString() || "0",
        paid_amount: billing.paid_amount?.toString() || "0",
      });
    }
  }, [billing]);

  if (!billing) return null;

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate subtotal amount
    const subtotal = parseFloat(formData.subtotal_amount);
    if (isNaN(subtotal) || subtotal < 0) {
      newErrors.subtotal_amount =
        lang === "ja"
          ? "有効な金額を入力してください（0以上）"
          : "Please enter a valid amount (0 or greater)";
    }

    // Validate tax rate
    const taxRate = parseFloat(formData.tax_rate);
    if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
      newErrors.tax_rate =
        lang === "ja"
          ? "有効な税率を入力してください（0-100%）"
          : "Please enter a valid tax rate (0-100%)";
    }

    // Validate deposit amount
    const deposit = parseFloat(formData.deposit_amount);
    if (isNaN(deposit) || deposit < 0) {
      newErrors.deposit_amount =
        lang === "ja"
          ? "有効な手付金を入力してください（0以上）"
          : "Please enter a valid deposit amount (0 or greater)";
    }

    // Validate paid amount
    const paid = parseFloat(formData.paid_amount);
    if (isNaN(paid) || paid < 0) {
      newErrors.paid_amount =
        lang === "ja"
          ? "有効な支払額を入力してください（0以上）"
          : "Please enter a valid paid amount (0 or greater)";
    }

    // Validate dates
    if (formData.issue_date) {
      const issueDate = new Date(formData.issue_date);
      if (isNaN(issueDate.getTime())) {
        newErrors.issue_date =
          lang === "ja"
            ? "有効な発行日を入力してください"
            : "Please enter a valid issue date";
      }
    }

    if (formData.due_date) {
      const dueDate = new Date(formData.due_date);
      if (isNaN(dueDate.getTime())) {
        newErrors.due_date =
          lang === "ja"
            ? "有効な支払期限を入力してください"
            : "Please enter a valid due date";
      }
    }

    if (formData.paid_date) {
      const paidDate = new Date(formData.paid_date);
      if (isNaN(paidDate.getTime())) {
        newErrors.paid_date =
          lang === "ja"
            ? "有効な支払日を入力してください"
            : "Please enter a valid paid date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(
        lang === "ja"
          ? "入力内容を確認してください"
          : "Please check your input",
      );
      return;
    }

    if (!token) {
      toast.error(
        lang === "ja" ? "認証エラーが発生しました" : "Authentication error",
      );
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        billing_id: billing.billing_id,
        billing_status: formData.billing_status || undefined,
        issue_date: formData.issue_date || undefined,
        due_date: formData.due_date || undefined,
        paid_date: formData.paid_date || undefined,
        subtotal_amount: parseFloat(formData.subtotal_amount) || 0,
        tax_rate: parseFloat(formData.tax_rate) || 0,
        currency: formData.currency || "JPY",
        admin_note: formData.admin_note || undefined,
        company_note: formData.company_note || undefined,
        deposit_amount: parseFloat(formData.deposit_amount) || 0,
        paid_amount: parseFloat(formData.paid_amount) || 0,
      };

      const response = await fetch(
        "https://vision-career.co.jp/admin-update-placement-billing.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data?.message || "Failed to update billing");
      }

      toast.success(
        lang === "ja" ? "請求書を更新しました" : "Billing updated successfully",
      );

      // Call success callback with updated billing data
      if (onSuccess && data.placement_billing) {
        onSuccess(data.placement_billing);
      }

      // Refresh the list
      if (onRefresh) {
        onRefresh();
      }

      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error("Error updating billing:", err);
      toast.error(
        err?.message ||
          (lang === "ja" ? "更新に失敗しました" : "Failed to update billing"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      if (
        !confirm(
          lang === "ja"
            ? "変更が保存されていません。閉じてもよろしいですか？"
            : "You have unsaved changes. Are you sure you want to close?",
        )
      ) {
        return;
      }
    }
    onClose();
  };

  const calculateTotals = () => {
    const subtotal = parseFloat(formData.subtotal_amount) || 0;
    const taxRate = parseFloat(formData.tax_rate) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxRate, taxAmount, total };
  };

  const totals = calculateTotals();

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900 truncate dark:text-white">
                {lang === "ja" ? "請求書編集" : "Edit Invoice"}
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {billing.invoice_number || `#${billing.billing_id}`}
              </span>
              {getBillingStatusBadge(billing.billing_status)}
            </div>
            <p className="mt-1 text-sm text-slate-500 truncate dark:text-slate-400">
              {billing.company_name} • {billing.job_title}
            </p>
          </div>

          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-full p-2 px-3 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-6 max-h-[calc(90vh-80px)] dark:bg-slate-800"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Billing Status */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "請求ステータス" : "Billing Status"}
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <select
                  name="billing_status"
                  value={formData.billing_status}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  required
                >
                  <option value="">
                    {lang === "ja" ? "ステータスを選択" : "Select status"}
                  </option>
                  {Object.entries(BILLING_STATUS_CONFIG).map(
                    ([status, config]) => (
                      <option key={status} value={status}>
                        {config.label[lang as keyof typeof config.label]}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Dates */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "発行日" : "Issue Date"}
                </label>
                <input
                  type="date"
                  name="issue_date"
                  value={formData.issue_date}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                />
                {errors.issue_date && (
                  <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    {errors.issue_date}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "支払期限" : "Due Date"}
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                />
                {errors.due_date && (
                  <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    {errors.due_date}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "支払日" : "Paid Date"}
                </label>
                <input
                  type="date"
                  name="paid_date"
                  value={formData.paid_date}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                />
                {errors.paid_date && (
                  <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    {errors.paid_date}
                  </p>
                )}
              </div>

              {/* Currency */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "通貨" : "Currency"}
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                >
                  <option value="JPY">JPY (¥)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Amounts */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "小計金額" : "Subtotal Amount"}
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    {formData.currency === "USD"
                      ? "$"
                      : formData.currency === "EUR"
                        ? "€"
                        : "¥"}
                  </span>
                  <input
                    type="number"
                    name="subtotal_amount"
                    value={String(formData.subtotal_amount)}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                    required
                  />
                </div>
                {errors.subtotal_amount && (
                  <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    {errors.subtotal_amount}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "税率 (%)" : "Tax Rate (%)"}
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  name="tax_rate"
                  value={String(formData.tax_rate)}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0.00"
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  required
                />
                {errors.tax_rate && (
                  <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    {errors.tax_rate}
                  </p>
                )}
              </div>

              {/* Calculated Totals */}
              <div className="rounded-2xl bg-slate-50 p-4 space-y-2 dark:bg-slate-700/50">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    {lang === "ja" ? "税額" : "Tax Amount"}:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatCurrency(totals.taxAmount, formData.currency)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-600">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "ja" ? "合計金額" : "Total Amount"}:
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totals.total, formData.currency)}
                  </span>
                </div>
              </div>

              {/* Deposit and Paid Amounts */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "手付金" : "Deposit Amount"}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    {formData.currency === "USD"
                      ? "$"
                      : formData.currency === "EUR"
                        ? "€"
                        : "¥"}
                  </span>
                  <input
                    type="number"
                    name="deposit_amount"
                    value={String(formData.deposit_amount)}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  />
                </div>
                {errors.deposit_amount && (
                  <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    {errors.deposit_amount}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "支払済み金額" : "Paid Amount"}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    {formData.currency === "USD"
                      ? "$"
                      : formData.currency === "EUR"
                        ? "€"
                        : "¥"}
                  </span>
                  <input
                    type="number"
                    name="paid_amount"
                    value={String(formData.paid_amount)}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  />
                </div>
                {errors.paid_amount && (
                  <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    {errors.paid_amount}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "管理者ノート" : "Admin Note"}
                </label>
                <textarea
                  name="admin_note"
                  value={formData.admin_note}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder={
                    lang === "ja"
                      ? "管理者ノートを入力..."
                      : "Enter admin note..."
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "企業ノート" : "Company Note"}
                </label>
                <textarea
                  name="company_note"
                  value={formData.company_note}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder={
                    lang === "ja"
                      ? "企業ノートを入力..."
                      : "Enter company note..."
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={handleClose}
              disabled={loading}
              className="rounded-xl border cursor-pointer border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {lang === "ja" ? "キャンセル" : "Cancel"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center cursor-pointer gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {lang === "ja" ? "更新中..." : "Updating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {lang === "ja" ? "保存" : "Save"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
