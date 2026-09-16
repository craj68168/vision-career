"use client";

import { useState } from "react";

import { Loader2, X } from "lucide-react";

import type { CreateProviderPayload, ProviderStatus } from "./types";

type Props = {
  isSubmitting: boolean;

  onClose: () => void;

  onSubmit: (payload: CreateProviderPayload) => void;
};

const EMPTY_FORM: CreateProviderPayload = {
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
};

export default function CreateModal({
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CreateProviderPayload>(EMPTY_FORM);

  const setField = (field: keyof CreateProviderPayload, value: string) => {
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
            <h2 className="text-xl font-bold">Create Provider</h2>

            <p className="text-sm text-slate-500">
              Create a new company/provider account.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-full p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="space-y-6 p-6"
          onSubmit={(event) => {
            event.preventDefault();

            onSubmit(form);
          }}
        >
          <Section title="Basic Information">
            <Input
              label="Provider Name *"
              value={form.name}
              onChange={(value) => setField("name", value)}
            />

            <Input
              label="Company Name *"
              value={form.companyName}
              onChange={(value) => setField("companyName", value)}
            />

            <Input
              label="Email *"
              type="email"
              value={form.email}
              onChange={(value) => setField("email", value)}
            />

            <Input
              label="Password *"
              type="password"
              value={form.password}
              onChange={(value) => setField("password", value)}
            />
          </Section>

          <Section title="Company Details">
            <Input
              label="Phone"
              value={form.phone}
              onChange={(value) => setField("phone", value)}
            />

            <Input
              label="Industry"
              value={form.industry}
              onChange={(value) => setField("industry", value)}
            />

            <Input
              label="Website"
              value={form.website}
              onChange={(value) => setField("website", value)}
            />

            <Input
              label="Address"
              value={form.address}
              onChange={(value) => setField("address", value)}
            />
          </Section>

          <Section title="Contact Person">
            <Input
              label="Contact Person"
              value={form.contactPerson}
              onChange={(value) => setField("contactPerson", value)}
            />

            <Input
              label="Contact Phone"
              value={form.contactPersonPhone}
              onChange={(value) => setField("contactPersonPhone", value)}
            />

            <Input
              label="Contact Email"
              type="email"
              value={form.contactPersonEmail}
              onChange={(value) => setField("contactPersonEmail", value)}
            />
          </Section>

          <div>
            <label className="text-sm font-semibold">Hiring Needs</label>

            <textarea
              rows={3}
              value={form.hiringNeeds}
              onChange={(event) => setField("hiringNeeds", event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Notes</label>

            <textarea
              rows={3}
              value={form.notes}
              onChange={(event) => setField("notes", event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Status</label>

            <select
              value={form.status}
              onChange={(event) =>
                setField("status", event.target.value as ProviderStatus)
              }
              className="mt-2 w-full rounded-xl border border-slate-200 p-3"
            >
              <option value="active">Active</option>

              <option value="inactive">Inactive</option>

              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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
              Create Provider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;

  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 font-bold">{title}</h3>

      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
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
