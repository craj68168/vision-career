"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";

import { Download } from "lucide-react";

import PlacementInvoicePDF from "./PlacementInvoicePDF";

import type { ProviderPlacementBilling } from "./types";

type Props = {
  billing: ProviderPlacementBilling;
};

// ======================================================
// BUTTON
// ======================================================

export default function InvoiceDownloadButton({ billing }: Props) {
  const canDownload =
    Boolean(billing.invoiceNumber) && Boolean(billing.invoiceSnapshot);

  if (!canDownload) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-[12px] bg-slate-200 px-4 text-sm font-medium text-slate-500"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        請求書PDF未生成
      </button>
    );
  }

  const fileName = sanitizeFileName(`請求書_${billing.invoiceNumber}.pdf`);

  return (
    <PDFDownloadLink
      document={<PlacementInvoicePDF billing={billing} />}
      fileName={fileName}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-[12px] bg-teal-800 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-900"
    >
      {({ loading }) => (
        <>
          <Download className="h-4 w-4" aria-hidden="true" />

          {loading ? "PDF生成中..." : "請求書PDFダウンロード"}
        </>
      )}
    </PDFDownloadLink>
  );
}

// ======================================================
// SAFE FILE NAME
// ======================================================

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[\\/:*?"<>|]/g, "_");
}
