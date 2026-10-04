"use client";

import { useState } from "react";

import { Loader2, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import type {
  AdminProvider,
  ProviderStatus,
  UpdateProviderPayload,
} from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const fieldClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white";

type Props = {
  provider: AdminProvider;

  isSubmitting: boolean;

  onClose: () => void;

  onSubmit: (registerId: string, payload: UpdateProviderPayload) => void;
};

export default function EditModal({
  provider,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const { lang } = useLanguage();
  const ja = lang === "ja";

  const [form, setForm] = useState<UpdateProviderPayload>({
    name: provider.name,

    companyName: provider.companyName,

    email: provider.email,

    password: "",

    phone: provider.phone || "",

    address: provider.address || "",

    website: provider.website || "",

    industry: provider.industry || "",

    contactPerson: provider.contactPerson || "",

    contactPersonPhone: provider.contactPersonPhone || "",

    contactPersonEmail: provider.contactPersonEmail || "",

    hiringNeeds: provider.hiringNeeds || "",

    notes: provider.notes || "",

    status: provider.status,
  });

  const setField = (field: keyof UpdateProviderPayload, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-provider-title"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={ja ? "閉じる" : "Close"}
        className="absolute inset-0 cursor-default"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="min-w-0">
            <h2
              id="edit-provider-title"
              className="text-lg font-semibold text-zinc-950 dark:text-white"
            >
              {ja ? "企業を編集" : "Edit Provider"}
            </h2>

            <p className="mt-0.5 truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {provider.registerId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={ja ? "閉じる" : "Close"}
            className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();

            onSubmit(provider.registerId, form);
          }}
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label={ja ? "担当者名" : "Provider Name"}
                value={form.name || ""}
                onChange={(value) => setField("name", value)}
              />

              <Input
                label={ja ? "企業名" : "Company Name"}
                value={form.companyName || ""}
                onChange={(value) => setField("companyName", value)}
              />

              <Input
                label={ja ? "メール" : "Email"}
                type="email"
                value={form.email || ""}
                onChange={(value) => setField("email", value)}
              />

              <Input
                label={ja ? "新しいパスワード" : "New Password"}
                type="password"
                value={form.password || ""}
                onChange={(value) => setField("password", value)}
              />

              <Input
                label={ja ? "電話番号" : "Phone"}
                value={form.phone || ""}
                onChange={(value) => setField("phone", value)}
              />

              <Input
                label={ja ? "業種" : "Industry"}
                value={form.industry || ""}
                onChange={(value) => setField("industry", value)}
              />

              <Input
                label={ja ? "ウェブサイト" : "Website"}
                value={form.website || ""}
                onChange={(value) => setField("website", value)}
              />

              <Input
                label={ja ? "住所" : "Address"}
                value={form.address || ""}
                onChange={(value) => setField("address", value)}
              />

              <Input
                label={ja ? "担当者" : "Contact Person"}
                value={form.contactPerson || ""}
                onChange={(value) => setField("contactPerson", value)}
              />

              <Input
                label={ja ? "担当者の電話番号" : "Contact Phone"}
                value={form.contactPersonPhone || ""}
                onChange={(value) => setField("contactPersonPhone", value)}
              />

              <Input
                label={ja ? "担当者のメール" : "Contact Email"}
                value={form.contactPersonEmail || ""}
                onChange={(value) => setField("contactPersonEmail", value)}
              />

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {ja ? "アカウント状態" : "Status"}
                </span>

                <select
                  value={form.status}
                  onChange={(event) =>
                    setField("status", event.target.value as ProviderStatus)
                  }
                  className={`${fieldClass} h-10 cursor-pointer dark:bg-zinc-900`}
                >
                  <option value="active">{ja ? "有効" : "Active"}</option>

                  <option value="inactive">{ja ? "無効" : "Inactive"}</option>

                  <option value="suspended">
                    {ja ? "停止中" : "Suspended"}
                  </option>
                </select>
              </label>
            </div>

            <Textarea
              label={ja ? "採用ニーズ" : "Hiring Needs"}
              value={form.hiringNeeds || ""}
              onChange={(value) => setField("hiringNeeds", value)}
            />

            <Textarea
              label={ja ? "メモ" : "Notes"}
              value={form.notes || ""}
              onChange={(value) => setField("notes", value)}
            />

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {ja
                ? "パスワードを変更しない場合は、新しいパスワードを空欄のままにしてください。"
                : "Leave New Password blank to keep the current password."}
            </p>
          </div>

          {/* FOOTER */}

          <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
            >
              {ja ? "キャンセル" : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing}`}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}

              {ja ? "保存" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass} h-10`}
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </span>

      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass} py-2`}
      />
    </label>
  );
}