"use client";

import { useState } from "react";

import { Loader2, X } from "lucide-react";

import type {
  AdminProvider,
  ProviderStatus,
  UpdateProviderPayload,
} from "./types";

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
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        className="absolute inset-0 cursor-default"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">Edit Provider</h2>

            <p className="text-sm text-slate-500">{provider.registerId}</p>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-full p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="space-y-5 p-6"
          onSubmit={(event) => {
            event.preventDefault();

            onSubmit(provider.registerId, form);
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Provider Name"
              value={form.name || ""}
              onChange={(value) => setField("name", value)}
            />

            <Input
              label="Company Name"
              value={form.companyName || ""}
              onChange={(value) => setField("companyName", value)}
            />

            <Input
              label="Email"
              type="email"
              value={form.email || ""}
              onChange={(value) => setField("email", value)}
            />

            <Input
              label="New Password"
              type="password"
              value={form.password || ""}
              onChange={(value) => setField("password", value)}
            />

            <Input
              label="Phone"
              value={form.phone || ""}
              onChange={(value) => setField("phone", value)}
            />

            <Input
              label="Industry"
              value={form.industry || ""}
              onChange={(value) => setField("industry", value)}
            />

            <Input
              label="Website"
              value={form.website || ""}
              onChange={(value) => setField("website", value)}
            />

            <Input
              label="Address"
              value={form.address || ""}
              onChange={(value) => setField("address", value)}
            />

            <Input
              label="Contact Person"
              value={form.contactPerson || ""}
              onChange={(value) => setField("contactPerson", value)}
            />

            <Input
              label="Contact Phone"
              value={form.contactPersonPhone || ""}
              onChange={(value) => setField("contactPersonPhone", value)}
            />

            <Input
              label="Contact Email"
              value={form.contactPersonEmail || ""}
              onChange={(value) => setField("contactPersonEmail", value)}
            />
          </div>

          <Textarea
            label="Hiring Needs"
            value={form.hiringNeeds || ""}
            onChange={(value) => setField("hiringNeeds", value)}
          />

          <Textarea
            label="Notes"
            value={form.notes || ""}
            onChange={(value) => setField("notes", value)}
          />

          <div>
            <label className="mb-2 block text-sm font-semibold">Status</label>

            <select
              value={form.status}
              onChange={(event) =>
                setField("status", event.target.value as ProviderStatus)
              }
              className="w-full rounded-xl border border-slate-200 p-3"
            >
              <option value="active">Active</option>

              <option value="inactive">Inactive</option>

              <option value="suspended">Suspended</option>
            </select>
          </div>

          <p className="text-xs text-slate-400">
            Leave New Password blank to keep the current password.
          </p>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-5 py-2 text-white disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
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
    <label>
      <span className="mb-2 block text-sm font-medium">{label}</span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-400"
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
    <label>
      <span className="mb-2 block text-sm font-medium">{label}</span>

      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-400"
      />
    </label>
  );
}
