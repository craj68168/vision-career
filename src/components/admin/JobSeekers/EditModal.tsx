"use client";

import { Loader2, Save, X } from "lucide-react";
import { type FormEvent, type ReactNode, useState } from "react";

import type {
  AccountStatus,
  AdminSeeker,
  EditSeekerPayload,
  PlacementStatus,
} from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const fieldClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white";

type Props = {
  lang: string;

  seeker: AdminSeeker;

  isSaving: boolean;

  error: string | null;

  onClose: () => void;

  onSubmit: (data: {
    profile: EditSeekerPayload;

    accountStatus: AccountStatus;

    placementStatus: PlacementStatus;
  }) => Promise<void>;
};

const dateValue = (value?: string | null) => {
  if (!value) return "";

  return value.slice(0, 10);
};

// ======================================================
// COMPONENT
// ======================================================

export default function EditModal({
  lang,
  seeker,
  isSaving,
  error,
  onClose,
  onSubmit,
}: Props) {
  const ja = lang === "ja";

  const [form, setForm] = useState({
    name: seeker.name || "",

    email: seeker.email || "",

    phone: seeker.phone || "",

    address: seeker.address || "",

    current_location: seeker.current_location || "",

    date_of_birth: dateValue(seeker.date_of_birth),

    gender: seeker.gender || "",

    nationality: seeker.nationality || "",

    visa_type: seeker.visa_type || "",

    visa_expiry_date: dateValue(seeker.visa_expiry_date),

    japanese_level: seeker.japanese_level || "",

    desired_job: seeker.desired_job || "",

    desired_location: seeker.desired_location || "",

    available_from: dateValue(seeker.available_from),

    skills: seeker.skills.join(", "),

    notes: seeker.notes || "",

    account_status: seeker.account_status,

    placement_status: seeker.placement_status,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const profile: EditSeekerPayload = {
      name: form.name,

      email: form.email,

      phone: form.phone || null,

      address: form.address || null,

      current_location: form.current_location || null,

      date_of_birth: form.date_of_birth || null,

      gender: form.gender || null,

      nationality: form.nationality || null,

      visa_type: form.visa_type || null,

      visa_expiry_date: form.visa_expiry_date || null,

      japanese_level: form.japanese_level || null,

      desired_job: form.desired_job || null,

      desired_location: form.desired_location || null,

      available_from: form.available_from || null,

      skills: form.skills
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),

      notes: form.notes || null,
    };

    await onSubmit({
      profile,

      accountStatus: form.account_status,

      placementStatus: form.placement_status,
    });
  };

  const update = (name: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const accountOptions: [string, string][] = [
    ["active", ja ? "有効" : "Active"],
    ["inactive", ja ? "無効" : "Inactive"],
    ["suspended", ja ? "停止中" : "Suspended"],
  ];

  const placementOptions: [string, string][] = [
    ["unplaced", ja ? "未配置" : "Unplaced"],
    ["matching", ja ? "マッチング中" : "Matching"],
    ["interview", ja ? "面接" : "Interview"],
    ["selected", ja ? "選考済み" : "Selected"],
    ["placed", ja ? "配置済み" : "Placed"],
  ];

  // ==================================================
  // UI
  // ==================================================

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-seeker-title"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={ja ? "閉じる" : "Close"}
        className="absolute inset-0 cursor-default"
        onClick={() => !isSaving && onClose()}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="min-w-0">
            <h2
              id="edit-seeker-title"
              className="text-lg font-semibold text-zinc-950 dark:text-white"
            >
              {ja ? "求職者を編集" : "Edit Job Seeker"}
            </h2>

            <p className="mt-0.5 truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {seeker.name} · {seeker.seeker_id}
            </p>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            aria-label={ja ? "閉じる" : "Close"}
            className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
              >
                {error}
              </div>
            )}

            <Section title={ja ? "基本情報" : "Basic Information"}>
              <Input
                label={ja ? "氏名" : "Name"}
                value={form.name}
                onChange={(value) => update("name", value)}
              />

              <Input
                label={ja ? "メール" : "Email"}
                type="email"
                value={form.email}
                onChange={(value) => update("email", value)}
              />

              <Input
                label={ja ? "電話番号" : "Phone"}
                value={form.phone}
                onChange={(value) => update("phone", value)}
              />

              <Input
                label={ja ? "現在地" : "Current Location"}
                value={form.current_location}
                onChange={(value) => update("current_location", value)}
              />

              <Input
                label={ja ? "住所" : "Address"}
                value={form.address}
                onChange={(value) => update("address", value)}
              />

              <Input
                label={ja ? "生年月日" : "Date of Birth"}
                type="date"
                value={form.date_of_birth}
                onChange={(value) => update("date_of_birth", value)}
              />

              <Input
                label={ja ? "性別" : "Gender"}
                value={form.gender}
                onChange={(value) => update("gender", value)}
              />

              <Input
                label={ja ? "国籍" : "Nationality"}
                value={form.nationality}
                onChange={(value) => update("nationality", value)}
              />
            </Section>

            <Section title={ja ? "在留資格・語学" : "Visa & Language"}>
              <Input
                label={ja ? "在留資格" : "Visa Type"}
                value={form.visa_type}
                onChange={(value) => update("visa_type", value)}
              />

              <Input
                label={ja ? "在留期限" : "Visa Expiry Date"}
                type="date"
                value={form.visa_expiry_date}
                onChange={(value) => update("visa_expiry_date", value)}
              />

              <Input
                label={ja ? "日本語レベル" : "Japanese Level"}
                value={form.japanese_level}
                onChange={(value) => update("japanese_level", value)}
              />

              <Input
                label={ja ? "スキル" : "Skills"}
                value={form.skills}
                placeholder="React, JavaScript, Japanese"
                onChange={(value) => update("skills", value)}
              />
            </Section>

            <Section title={ja ? "希望条件" : "Job Preferences"}>
              <Input
                label={ja ? "希望職種" : "Desired Job"}
                value={form.desired_job}
                onChange={(value) => update("desired_job", value)}
              />

              <Input
                label={ja ? "希望勤務地" : "Desired Location"}
                value={form.desired_location}
                onChange={(value) => update("desired_location", value)}
              />

              <Input
                label={ja ? "勤務可能日" : "Available From"}
                type="date"
                value={form.available_from}
                onChange={(value) => update("available_from", value)}
              />
            </Section>

            <Section title={ja ? "管理者ステータス" : "Admin Status"}>
              <Select
                label={ja ? "アカウント状態" : "Account Status"}
                value={form.account_status}
                options={accountOptions}
                onChange={(value) => update("account_status", value)}
              />

              <Select
                label={ja ? "配置状態" : "Placement Status"}
                value={form.placement_status}
                options={placementOptions}
                onChange={(value) => update("placement_status", value)}
              />
            </Section>

            <section className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
              <label className="block">
                <span className="mb-2.5 block text-sm font-semibold text-zinc-950 dark:text-white">
                  {ja ? "メモ" : "Notes"}
                </span>

                <textarea
                  value={form.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  rows={3}
                  className={`${fieldClass} py-2`}
                />
              </label>
            </section>
          </div>

          {/* FOOTER */}

          <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 px-4 py-3 dark:border-white/10 sm:px-5">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
            >
              {ja ? "キャンセル" : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing}`}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {ja ? "変更を保存" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ======================================================
// SECTION
// ======================================================

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
      <h3 className="mb-2.5 text-sm font-semibold text-zinc-950 dark:text-white">
        {title}
      </h3>

      <div className="grid gap-3 md:grid-cols-2">{children}</div>
    </section>
  );
}

// ======================================================
// INPUT
// ======================================================

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass} h-10`}
      />
    </label>
  );
}

// ======================================================
// SELECT
// ======================================================

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass} h-10 cursor-pointer dark:bg-zinc-900`}
      >
        {options.map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}