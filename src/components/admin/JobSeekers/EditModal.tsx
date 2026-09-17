"use client";

import { Loader2, Save, X } from "lucide-react";
import { type FormEvent, useState } from "react";

import type {
  AccountStatus,
  AdminSeeker,
  EditSeekerPayload,
  PlacementStatus,
} from "./types";

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

export default function EditModal({
  seeker,
  isSaving,
  error,
  onClose,
  onSubmit,
}: Props) {
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

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Edit Job Seeker
            </p>

            <h2 className="mt-1 text-xl font-bold">{seeker.name}</h2>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[82vh] overflow-y-auto p-6"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Section title="Basic Information">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Name"
                value={form.name}
                onChange={(value) => update("name", value)}
              />

              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => update("email", value)}
              />

              <Input
                label="Phone"
                value={form.phone}
                onChange={(value) => update("phone", value)}
              />

              <Input
                label="Current Location"
                value={form.current_location}
                onChange={(value) => update("current_location", value)}
              />

              <Input
                label="Address"
                value={form.address}
                onChange={(value) => update("address", value)}
              />

              <Input
                label="Date of Birth"
                type="date"
                value={form.date_of_birth}
                onChange={(value) => update("date_of_birth", value)}
              />

              <Input
                label="Gender"
                value={form.gender}
                onChange={(value) => update("gender", value)}
              />

              <Input
                label="Nationality"
                value={form.nationality}
                onChange={(value) => update("nationality", value)}
              />
            </div>
          </Section>

          <Section title="Visa & Language">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Visa Type"
                value={form.visa_type}
                onChange={(value) => update("visa_type", value)}
              />

              <Input
                label="Visa Expiry Date"
                type="date"
                value={form.visa_expiry_date}
                onChange={(value) => update("visa_expiry_date", value)}
              />

              <Input
                label="Japanese Level"
                value={form.japanese_level}
                onChange={(value) => update("japanese_level", value)}
              />

              <Input
                label="Skills"
                value={form.skills}
                placeholder="React, JavaScript, Japanese"
                onChange={(value) => update("skills", value)}
              />
            </div>
          </Section>

          <Section title="Job Preferences">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Desired Job"
                value={form.desired_job}
                onChange={(value) => update("desired_job", value)}
              />

              <Input
                label="Desired Location"
                value={form.desired_location}
                onChange={(value) => update("desired_location", value)}
              />

              <Input
                label="Available From"
                type="date"
                value={form.available_from}
                onChange={(value) => update("available_from", value)}
              />
            </div>
          </Section>

          <Section title="Admin Status">
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Account Status"
                value={form.account_status}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,

                    account_status: value as AccountStatus,
                  }))
                }
                options={[
                  ["active", "Active"],
                  ["inactive", "Inactive"],
                  ["suspended", "Suspended"],
                ]}
              />

              <Select
                label="Placement Status"
                value={form.placement_status}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,

                    placement_status: value as PlacementStatus,
                  }))
                }
                options={[
                  ["unplaced", "Unplaced"],
                  ["matching", "Matching"],
                  ["interview", "Interview"],
                  ["selected", "Selected"],
                  ["placed", "Placed"],
                ]}
              />
            </div>
          </Section>

          <Section title="Notes">
            <textarea
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-400"
            />
          </Section>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
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
                <Save className="h-4 w-4" />
              )}
              Save Changes
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
    <div className="mb-6 rounded-2xl border border-slate-200 p-5">
      <h3 className="mb-4 font-semibold text-slate-900">{title}</h3>

      {children}
    </div>
  );
}

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
    <label>
      <span className="mb-2 block text-sm font-medium">{label}</span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
      />
    </label>
  );
}

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
    <label>
      <span className="mb-2 block text-sm font-medium">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
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
