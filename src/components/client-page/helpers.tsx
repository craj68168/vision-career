import { Loader2 } from "lucide-react";

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className="text-slate-400">{icon}</div>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "inline-flex items-center gap-2 rounded-xl cursor-pointer bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
          : "inline-flex items-center gap-2 rounded-xl cursor-pointer px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
      }
    >
      {icon}
      {label}
    </button>
  );
}

export function LoadingPanel({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />
      <p className="mt-4 text-sm text-slate-600">{text}</p>
    </div>
  );
}

export function ErrorPanel({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
}

export function EmptyPanel({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex w-fit items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
