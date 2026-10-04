"use client";

import { Loader2, Plus, X } from "lucide-react";
import { type FormEvent, useState } from "react";

import type {
  AccountStatus,
  ApprovalStatus,
  CreateSeekerPayload,
  PlacementStatus,
} from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const fieldClass =
  "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white";

type Props = {
  lang: string;
  isSaving: boolean;
  error: string | null;

  onClose: () => void;

  onSubmit: (payload: CreateSeekerPayload) => Promise<void>;
};

export default function CreateModal({
  lang,
  isSaving,
  error,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CreateSeekerPayload>({
    name: "",
    email: "",
    password: "",

    phone: "",
    current_location: "",
    nationality: "",

    approval_status: "approved",

    account_status: "active",

    placement_status: "unplaced",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit(form);
  };

  return (
    <ModalShell
      title={lang === "ja" ? "求職者を作成" : "Create Job Seeker"}
      subtitle={
        lang === "ja"
          ? "管理者から新しい求職者を登録します。"
          : "Register a new job seeker account."
      }
      onClose={onClose}
      disabled={isSaving}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBox message={error} />}

        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Name"
            value={form.name}
            required
            onChange={(value) =>
              setForm({
                ...form,
                name: value,
              })
            }
          />

          <Field
            label="Email"
            type="email"
            value={form.email}
            required
            onChange={(value) =>
              setForm({
                ...form,
                email: value,
              })
            }
          />

          <Field
            label="Password"
            type="password"
            value={form.password}
            required
            onChange={(value) =>
              setForm({
                ...form,
                password: value,
              })
            }
          />

          <Field
            label="Phone"
            value={form.phone || ""}
            onChange={(value) =>
              setForm({
                ...form,
                phone: value,
              })
            }
          />

          <Field
            label="Current Location"
            value={form.current_location || ""}
            onChange={(value) =>
              setForm({
                ...form,
                current_location: value,
              })
            }
          />

          <Field
            label="Nationality"
            value={form.nationality || ""}
            onChange={(value) =>
              setForm({
                ...form,
                nationality: value,
              })
            }
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <SelectField
            label="Approval"
            value={form.approval_status}
            options={[
              ["pending", "Pending"],
              ["approved", "Approved"],
              ["rejected", "Rejected"],
            ]}
            onChange={(value) =>
              setForm({
                ...form,
                approval_status: value as ApprovalStatus,
              })
            }
          />

          <SelectField
            label="Account Status"
            value={form.account_status}
            options={[
              ["active", "Active"],
              ["inactive", "Inactive"],
              ["suspended", "Suspended"],
            ]}
            onChange={(value) =>
              setForm({
                ...form,
                account_status: value as AccountStatus,
              })
            }
          />

          <SelectField
            label="Placement"
            value={form.placement_status}
            options={[
              ["unplaced", "Unplaced"],
              ["matching", "Matching"],
              ["interview", "Interview"],
              ["selected", "Selected"],
              ["placed", "Placed"],
            ]}
            onChange={(value) =>
              setForm({
                ...form,
                placement_status: value as PlacementStatus,
              })
            }
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-white/10">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing}`}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Create Job Seeker
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ModalShell({
  title,
  subtitle,
  children,
  onClose,
  disabled,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onClose: () => void;
  disabled: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
              {title}
            </h2>

            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={onClose}
            className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
        {required && " *"}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </label>
  );
}

function SelectField({
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
    <label>
      <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass} cursor-pointer`}
      >
        {options.map(([optionValue, text]) => (
          <option key={optionValue} value={optionValue}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
      {message}
    </div>
  );
}
