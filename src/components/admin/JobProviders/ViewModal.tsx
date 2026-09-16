"use client";

import {
  BriefcaseBusiness,
  Building2,
  FileText,
  Mail,
  MapPin,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import type { AdminProvider } from "./types";

type Props = {
  provider: AdminProvider;

  onClose: () => void;
};

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>

      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {value ?? "-"}
      </p>
    </div>
  );
}

export default function ViewModal({ provider, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button className="absolute inset-0 cursor-default" onClick={onClose} />

      <div className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">Company Details</h2>

            <p className="text-sm text-slate-500">{provider.registerId}</p>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div>
              <p className="font-bold">{provider.name}</p>

              <p className="text-sm text-slate-500">{provider.companyName}</p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
              {provider.status}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4 flex items-center gap-2 font-bold">
                <UserRound className="h-4 w-4" />
                Basic Information
              </div>

              <div className="space-y-4">
                <Field label="Provider Name" value={provider.name} />

                <Field label="Company" value={provider.companyName} />

                <Field label="Email" value={provider.email} />

                <Field label="Phone" value={provider.phone} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4 flex items-center gap-2 font-bold">
                <Building2 className="h-4 w-4" />
                Company Information
              </div>

              <div className="space-y-4">
                <Field label="Industry" value={provider.industry} />

                <Field label="Address" value={provider.address} />

                <Field label="Website" value={provider.website} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4 flex items-center gap-2 font-bold">
                <Phone className="h-4 w-4" />
                Contact Person
              </div>

              <div className="space-y-4">
                <Field label="Name" value={provider.contactPerson} />

                <Field label="Phone" value={provider.contactPersonPhone} />

                <Field label="Email" value={provider.contactPersonEmail} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4 flex items-center gap-2 font-bold">
                <BriefcaseBusiness className="h-4 w-4" />
                Hiring Information
              </div>

              <div className="space-y-4">
                <Field label="Hiring Needs" value={provider.hiringNeeds} />

                <Field label="Notes" value={provider.notes} />
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold">Statistics</h3>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <FileText className="mx-auto h-5 w-5 text-indigo-500" />

                <p className="mt-2 text-2xl font-bold">
                  {provider.vacancyCount}
                </p>

                <p className="text-xs text-slate-500">Vacancies</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <Mail className="mx-auto h-5 w-5 text-indigo-500" />

                <p className="mt-2 text-2xl font-bold">
                  {provider.applicationCount}
                </p>

                <p className="text-xs text-slate-500">Applications</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
