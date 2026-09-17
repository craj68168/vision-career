"use client";

import { Loader2, Plus, X } from "lucide-react";
import { type FormEvent, useState } from "react";

import type {
  AccountStatus,
  ApprovalStatus,
  CreateSeekerPayload,
  PlacementStatus,
} from "./types";

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
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <ErrorBox message={error} />}

        <div className="grid gap-4 md:grid-cols-2">
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

        <div className="grid gap-4 md:grid-cols-3">
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

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>

            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>
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
      <span className="mb-2 block text-sm font-medium">
        {label}
        {required && " *"}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
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
      <span className="mb-2 block text-sm font-medium">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
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
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}
