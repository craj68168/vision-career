import { STATUS_CONFIG } from "./placement-requests";
import { PlacementRequestStatus } from "@/hooks/useAdminPlacementRequests";

interface StatusModalProps {
  lang: "ja" | "en";
  setShowStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRequest: any;
  handleStatusUpdateClick: any;
  updating: boolean;
  newStatus: string;
  updateStatus: any;
  setNewStatus: React.Dispatch<React.SetStateAction<string>>;
  adminNote: string;
  setAdminNote: React.Dispatch<React.SetStateAction<string>>;
  rejectionReason: string;
  setRejectionReason: React.Dispatch<React.SetStateAction<string>>;
}

export default function StatusModal({
  lang,
  setShowStatusModal,
  selectedRequest,
  handleStatusUpdateClick,
  updating,
  newStatus,
  updateStatus,
  setNewStatus,
  adminNote,
  setAdminNote,
  rejectionReason,
  setRejectionReason,
}: StatusModalProps) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowStatusModal(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {lang === "ja" ? "ステータスを更新" : "Update Status"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {selectedRequest.job_title}
            </p>
          </div>
          <button
            onClick={() => setShowStatusModal(false)}
            disabled={updating}
            className="rounded-full p-2 px-3 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {lang === "ja" ? "ステータス" : "Status"}
            </label>
            <select
              value={newStatus}
              onChange={(e) =>
                setNewStatus(e.target.value as PlacementRequestStatus)
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
            >
              {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                <option key={status} value={status}>
                  {config.label[lang]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {lang === "ja" ? "管理者ノート" : "Admin Note"}
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              placeholder={lang === "ja" ? "ノートを入力..." : "Enter note..."}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
          </div>

          {newStatus === "rejected" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {lang === "ja" ? "却下理由" : "Rejection Reason"}
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={2}
                placeholder={
                  lang === "ja"
                    ? "却下理由を入力..."
                    : "Enter rejection reason..."
                }
                className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:bg-white"
                required
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={() => setShowStatusModal(false)}
            disabled={updating}
            className="rounded-xl border cursor-pointer border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {lang === "ja" ? "キャンセル" : "Cancel"}
          </button>

          <button
            onClick={updateStatus}
            disabled={
              updating || (newStatus === "rejected" && !rejectionReason.trim())
            }
            className="rounded-xl bg-slate-900 cursor-pointer px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updating
              ? lang === "ja"
                ? "更新中..."
                : "Updating..."
              : lang === "ja"
                ? "更新"
                : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
