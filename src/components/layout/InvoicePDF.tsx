"use client";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";

// Register Japanese font
Font.register({
  family: "NotoSansJP",
  src: "https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEi75s.ttf",
});

// Fallback font registration
Font.register({
  family: "Helvetica",
  fonts: [{ src: "https://fonts.gstatic.com/s/helvetica/v15/helvetica.ttf" }],
});

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "NotoSansJP",
    fontSize: 10,
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    borderBottom: "2px solid #1a1a1a",
    paddingBottom: 15,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  companySub: {
    fontSize: 10,
    color: "#666666",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#666666",
  },
  statusBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    color: "#2e7d32",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: "1px solid #e0e0e0",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 120,
    fontSize: 10,
    color: "#666666",
  },
  infoValue: {
    flex: 1,
    fontSize: 10,
    color: "#1a1a1a",
  },
  infoGrid: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoGridItem: {
    flex: 1,
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottom: "1px solid #e0e0e0",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottom: "1px solid #f0f0f0",
  },
  tableCol1: {
    flex: 3,
  },
  tableCol2: {
    flex: 1,
    textAlign: "right",
  },
  tableCol3: {
    flex: 1,
    textAlign: "right",
  },
  tableCol4: {
    flex: 1.5,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginTop: 8,
    borderTop: "2px solid #1a1a1a",
    backgroundColor: "#fafafa",
  },
  totalLabel: {
    flex: 3,
    fontSize: 12,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  totalAmount: {
    flex: 1.5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "right",
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: "1px solid #e0e0e0",
  },
  footerText: {
    fontSize: 9,
    color: "#999999",
    textAlign: "center",
    marginBottom: 2,
  },
  noteBox: {
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 4,
    marginTop: 12,
  },
  noteText: {
    fontSize: 9,
    color: "#666666",
  },
  amountBreakdown: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 2,
  },
  breakdownLabel: {
    fontSize: 10,
    color: "#666666",
    marginRight: 20,
    width: 100,
    textAlign: "right",
  },
  breakdownValue: {
    fontSize: 10,
    color: "#1a1a1a",
    width: 100,
    textAlign: "right",
  },
  divider: {
    borderBottom: "1px solid #e0e0e0",
    marginVertical: 4,
  },
  stampBox: {
    marginTop: 20,
    padding: 12,
    border: "1px solid #e0e0e0",
    borderRadius: 4,
    backgroundColor: "#fafafa",
    alignItems: "center",
  },
  stampText: {
    fontSize: 9,
    color: "#999999",
  },
});

// Types
export interface InvoiceData {
  // Invoice Info
  invoice_number: string;
  billing_status: string;
  subtotal_amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  issue_date: string;
  due_date: string;
  paid_date: string | null;
  billing_company_note: string | null;
  billing_placement_id: number;
  billing_created_at: string;

  // Candidate Info
  job_seeker_name: string;
  job_title: string;

  // Company Info
  company_name: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;

  // Additional Info
  placement_date?: string;
  service_fee_description?: string;
}

interface InvoicePDFProps {
  data: InvoiceData;
}

// Main Invoice Component
export const InvoicePDF: React.FC<InvoicePDFProps> = ({ data }) => {
  const {
    invoice_number,
    billing_status,
    subtotal_amount,
    tax_rate,
    tax_amount,
    total_amount,
    currency,
    issue_date,
    due_date,
    paid_date,
    billing_company_note,
    billing_placement_id,
    billing_created_at,
    job_seeker_name,
    job_title,
    company_name,
    company_address = "〒100-0001 東京都千代田区千代田1-1",
    company_phone = "03-1234-5678",
    company_email = "info@vision-career.co.jp",
    placement_date = issue_date,
    service_fee_description = "人材紹介サービス",
  } = data;

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "支払済み";
      case "sent":
        return "送信済み";
      default:
        return "未送信";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "#2e7d32";
      case "sent":
        return "#1565c0";
      default:
        return "#f57c00";
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "-";
    const d = new Date(date);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const formatCurrency = (amount: number) => {
    return `${currency} ${amount?.toLocaleString() || 0}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>{company_name}</Text>
            <Text style={styles.companySub}>株式会社</Text>
            <Text style={styles.companySub}>{company_address}</Text>
            <Text style={styles.companySub}>TEL: {company_phone}</Text>
            <Text style={styles.companySub}>Email: {company_email}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>請求書</Text>
            <Text style={styles.invoiceNumber}>No. {invoice_number}</Text>
            <View style={styles.statusBadge}>
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(billing_status) },
                ]}
              >
                {getStatusText(billing_status)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          {/* Invoice Info */}
          <View style={styles.section}>
            <View style={styles.infoGrid}>
              <View style={styles.infoGridItem}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>発行日</Text>
                  <Text style={styles.infoValue}>{formatDate(issue_date)}</Text>
                </View>
              </View>
              <View style={styles.infoGridItem}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>支払期限</Text>
                  <Text style={styles.infoValue}>{formatDate(due_date)}</Text>
                </View>
              </View>
            </View>
            {paid_date && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>支払日</Text>
                <Text style={styles.infoValue}>{formatDate(paid_date)}</Text>
              </View>
            )}
          </View>

          {/* Client Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>取引先情報</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>会社名</Text>
              <Text style={styles.infoValue}>{company_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>候補者名</Text>
              <Text style={styles.infoValue}>{job_seeker_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>職種</Text>
              <Text style={styles.infoValue}>{job_title}</Text>
            </View>
          </View>

          {/* Invoice Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>明細</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCol1}>項目</Text>
                <Text style={styles.tableCol2}>数量</Text>
                <Text style={styles.tableCol3}>単価</Text>
                <Text style={styles.tableCol4}>金額</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCol1}>{service_fee_description}</Text>
                <Text style={styles.tableCol2}>1</Text>
                <Text style={styles.tableCol3}>
                  {formatCurrency(subtotal_amount)}
                </Text>
                <Text style={styles.tableCol4}>
                  {formatCurrency(subtotal_amount)}
                </Text>
              </View>
            </View>

            {/* Amount Breakdown */}
            <View style={styles.amountBreakdown}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>小計</Text>
                <Text style={styles.breakdownValue}>
                  {formatCurrency(subtotal_amount)}
                </Text>
              </View>
              {tax_rate > 0 && (
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>
                    消費税 ({tax_rate}%)
                  </Text>
                  <Text style={styles.breakdownValue}>
                    {formatCurrency(tax_amount)}
                  </Text>
                </View>
              )}
              <View style={styles.divider} />
              <View style={styles.breakdownRow}>
                <Text
                  style={[
                    styles.breakdownLabel,
                    { fontWeight: "bold", fontSize: 12 },
                  ]}
                >
                  合計
                </Text>
                <Text
                  style={[
                    styles.breakdownValue,
                    { fontWeight: "bold", fontSize: 12 },
                  ]}
                >
                  {formatCurrency(total_amount)}
                </Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {billing_company_note && (
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>備考: {billing_company_note}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            この請求書は {formatDate(issue_date)} に発行されました
          </Text>
          <Text style={styles.footerText}>
            請求書番号: {invoice_number} | 取引ID: {billing_placement_id}
          </Text>
          <Text style={styles.footerText}>
            作成日: {formatDate(billing_created_at)}
          </Text>

          {/* Stamp/Seal Placeholder */}
          <View style={styles.stampBox}>
            <Text style={styles.stampText}>⏺ 領収印</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// PDF Viewer Component (for preview)
interface InvoicePDFViewerProps {
  data: InvoiceData;
  showDownload?: boolean;
}

export const InvoicePDFViewer: React.FC<InvoicePDFViewerProps> = ({
  data,
  showDownload = true,
}) => {
  return (
    <div className="h-full w-full">
      {showDownload && (
        <div className="mb-4 flex justify-end">
          <PDFDownloadLink
            document={<InvoicePDF data={data} />}
            fileName={`invoice-${data.invoice_number}.pdf`}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            {({ loading }) => (
              <>{loading ? "生成中..." : "PDFをダウンロード"}</>
            )}
          </PDFDownloadLink>
        </div>
      )}
      <PDFViewer width="100%" height="100%" style={{ minHeight: "600px" }}>
        <InvoicePDF data={data} />
      </PDFViewer>
    </div>
  );
};

// Direct download button component
interface InvoiceDownloadButtonProps {
  data: InvoiceData;
  buttonText?: string;
  className?: string;
}

export const InvoiceDownloadButton: React.FC<InvoiceDownloadButtonProps> = ({
  data,
  buttonText = "PDFをダウンロード",
  className = "",
}) => {
  return (
    <PDFDownloadLink
      document={<InvoicePDF data={data} />}
      fileName={`invoice-${data.invoice_number}.pdf`}
      className={`inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 ${className}`}
    >
      {({ loading }) => (
        <>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {loading ? "生成中..." : buttonText}
        </>
      )}
    </PDFDownloadLink>
  );
};

export default InvoicePDF;
