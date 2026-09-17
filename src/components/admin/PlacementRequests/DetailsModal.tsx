"use client";

import { X } from "lucide-react";

import type { PlacementRequest } from "./types";

type Props = {
  request: PlacementRequest;
  onClose: () => void;
};

export default function DetailsModal({ request, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white">
        <div className="flex justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">Placement Request</h2>

            <p className="text-sm text-slate-500">{request.recruitId}</p>
          </div>

          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <Field label="Company" value={request.companyName} />

          <Field label="Provider" value={request.providerName} />

          <Field label="Job Title" value={request.jobTitle} />

          <Field label="Category" value={request.jobCategory} />

          <Field label="Employment Type" value={request.employmentType} />

          <Field label="Positions" value={request.numberOfPositions} />

          <Field label="Work Location" value={request.workLocation} />

          <Field label="Japanese Level" value={request.japaneseLevelRequired} />

          <Field label="Visa Requirement" value={request.visaTypeRequired} />

          <Field
            label="Salary"
            value={`${request.salaryAmount || "-"} ${request.salaryType || ""}`}
          />

          <Field label="Working Hours" value={request.workingHours} />

          <Field label="Days Off" value={request.daysOff} />

          <Field label="Start Date" value={request.startDate} />

          <div className="md:col-span-2">
            <Field label="Job Description" value={request.jobDescription} />
          </div>

          <div className="md:col-span-2">
            <Field label="Requirements" value={request.requirements} />
          </div>

          {request.rejectionReason && (
            <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-xs font-semibold uppercase text-red-500">
                Rejection Reason
              </p>

              <p className="mt-2 text-sm text-red-700">
                {request.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>

      <p className="mt-1 whitespace-pre-wrap text-sm font-medium">
        {value || "-"}
      </p>
    </div>
  );
}
