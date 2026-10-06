"use client";
import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ProviderStatus, CreateProviderPayload } from "./types";
type Props = {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateProviderPayload) => void;
};
export default function CreateModal({ isSubmitting, onClose, onSubmit }: Props) {
  const t = useTranslations("adminProviders");
  const locale = useLocale();

  // Temporary diagnostic: logs language and a label, never form values.
  useEffect(() => {
    console.log("CreateModal language:", {
      locale,
      companyLabel: t("companyName"),
    });
  }, [locale, t]);
  const [form, setForm] = useState<CreateProviderPayload>({
    name: "",
    companyName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    website: "",
    industry: "",
    contactPerson: "",
    contactPersonPhone: "",
    contactPersonEmail: "",
    hiringNeeds: "",
    notes: "",
    status: "active",
  });
  const setField = (field: keyof CreateProviderPayload, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button type="button" aria-label={t("close")} disabled={isSubmitting} className="absolute inset-0 cursor-default" onClick={() => !isSubmitting && onClose()} />
      <div role="dialog" aria-modal="true" aria-labelledby="provider-create-title" className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 id="provider-create-title" className="text-xl font-bold">{t("createTitle")}</h2>
          </div>
          <button type="button" onClick={onClose} disabled={isSubmitting} aria-label={t("close")} className="cursor-pointer rounded-full p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <form className="space-y-5 p-6" onSubmit={(event) => {
          event.preventDefault();
          if (!isSubmitting) onSubmit(form);
        }}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label={t("providerName")} type="text" disabled={isSubmitting} value={form.name || ""} onChange={(value) => setField("name", value)} />
            <Input label={t("companyName")} type="text" disabled={isSubmitting} value={form.companyName || ""} onChange={(value) => setField("companyName", value)} />
            <Input label={t("email")} type="email" disabled={isSubmitting} value={form.email || ""} onChange={(value) => setField("email", value)} />
            <Input label={t("password")} type="password" disabled={isSubmitting} value={form.password || ""} onChange={(value) => setField("password", value)} />
            <Input label={t("phone")} type="text" disabled={isSubmitting} value={form.phone || ""} onChange={(value) => setField("phone", value)} />
            <Input label={t("industry")} type="text" disabled={isSubmitting} value={form.industry || ""} onChange={(value) => setField("industry", value)} />
            <Input label={t("website")} type="text" disabled={isSubmitting} value={form.website || ""} onChange={(value) => setField("website", value)} />
            <Input label={t("address")} type="text" disabled={isSubmitting} value={form.address || ""} onChange={(value) => setField("address", value)} />
            <Input label={t("contactPerson")} type="text" disabled={isSubmitting} value={form.contactPerson || ""} onChange={(value) => setField("contactPerson", value)} />
            <Input label={t("contactPhone")} type="text" disabled={isSubmitting} value={form.contactPersonPhone || ""} onChange={(value) => setField("contactPersonPhone", value)} />
            <Input label={t("contactEmail")} type="text" disabled={isSubmitting} value={form.contactPersonEmail || ""} onChange={(value) => setField("contactPersonEmail", value)} />
          </div>
          <Textarea label={t("hiringNeeds")} disabled={isSubmitting} value={form.hiringNeeds || ""} onChange={(value) => setField("hiringNeeds", value)} />
          <Textarea label={t("notes")} disabled={isSubmitting} value={form.notes || ""} onChange={(value) => setField("notes", value)} />
          <div>
            <label htmlFor="provider-create-status" className="mb-2 block text-sm font-semibold">{t("status")}</label>
            <select id="provider-create-status" value={form.status} disabled={isSubmitting} onChange={(event) => setField("status", event.target.value as ProviderStatus)} className="w-full rounded-xl border border-slate-200 p-3">
              <option value="active">{t("active")}</option>
              <option value="inactive">{t("inactive")}</option>
              <option value="suspended">{t("suspended")}</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 border-t pt-5">
            <button type="button" disabled={isSubmitting} onClick={onClose} className="cursor-pointer rounded-xl border px-4 py-2">{t("cancel")}</button>
            <button type="submit" disabled={isSubmitting} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-5 py-2 text-white disabled:opacity-50">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t(isSubmitting ? "creating" : "create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function Input({ label, value, type = "text", onChange, disabled }: { label: string; value: string; type?: string; onChange: (value: string) => void; disabled?: boolean }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input type={type} disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-400" />
    </label>
  );
}
function Textarea({ label, value, onChange, disabled }: { label: string; value: string; onChange: (value: string) => void; disabled?: boolean }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <textarea rows={3} disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-400" />
    </label>
  );
}
