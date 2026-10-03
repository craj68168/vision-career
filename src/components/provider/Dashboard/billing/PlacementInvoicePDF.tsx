import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { ProviderPlacementBilling } from "./types";

// ======================================================
// JAPANESE FONT
// ======================================================

Font.register({
  family: "NotoSansJP",

  fonts: [
    {
      src: "/fonts/NotoSansJP-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "/fonts/NotoSansJP-Bold.ttf",
      fontWeight: 700,
    },
  ],
});

// ======================================================
// TYPES
// ======================================================

type Props = {
  billing: ProviderPlacementBilling;
};

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",

    fontSize: 9,

    color: "#1f2937",

    backgroundColor: "#ffffff",

    paddingTop: 36,

    paddingBottom: 40,

    paddingLeft: 42,

    paddingRight: 42,
  },

  header: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "flex-start",
  },

  title: {
    fontSize: 28,

    fontWeight: 700,

    color: "#111827",
  },

  titleEnglish: {
    marginTop: 2,

    fontSize: 7,

    color: "#94a3b8",

    letterSpacing: 1.5,
  },

  invoiceMeta: {
    width: 190,

    alignItems: "flex-end",
  },

  metaRow: {
    flexDirection: "row",

    justifyContent: "flex-end",

    marginBottom: 5,
  },

  metaLabel: {
    width: 60,

    fontSize: 8,

    color: "#64748b",

    textAlign: "right",

    marginRight: 8,
  },

  metaValue: {
    minWidth: 110,

    fontSize: 8.5,

    textAlign: "right",
  },

  divider: {
    marginTop: 14,

    borderBottomWidth: 1,

    borderBottomColor: "#1f2937",
  },

  parties: {
    flexDirection: "row",

    justifyContent: "space-between",

    marginTop: 20,

    minHeight: 120,
  },

  recipient: {
    width: "48%",

    paddingRight: 14,
  },

  issuer: {
    position: "relative",

    width: "48%",

    paddingLeft: 14,
  },

  sectionLabel: {
    fontSize: 7,

    color: "#94a3b8",

    marginBottom: 7,
  },

  recipientName: {
    fontSize: 14,

    fontWeight: 700,

    marginBottom: 7,
  },

  contactPerson: {
    marginTop: 7,

    fontSize: 9,
  },

  partyText: {
    marginBottom: 3,

    lineHeight: 1.5,
  },

  issuerName: {
    fontSize: 11,

    fontWeight: 700,

    marginBottom: 5,

    paddingRight: 58,
  },

  demoStamp: {
    position: "absolute",

    right: 0,

    top: 18,

    width: 50,

    height: 50,

    borderWidth: 1.5,

    borderColor: "#dc2626",

    borderRadius: 25,

    justifyContent: "center",

    alignItems: "center",
  },

  demoStampInner: {
    width: 40,

    height: 40,

    borderWidth: 1,

    borderColor: "#dc2626",

    borderRadius: 20,

    justifyContent: "center",

    alignItems: "center",
  },

  demoStampText: {
    color: "#dc2626",

    fontSize: 12,

    fontWeight: 700,
  },

  table: {
    marginTop: 18,

    borderTopWidth: 1,

    borderTopColor: "#334155",

    borderBottomWidth: 1,

    borderBottomColor: "#334155",
  },

  tableHeader: {
    flexDirection: "row",

    backgroundColor: "#f8fafc",

    borderBottomWidth: 1,

    borderBottomColor: "#cbd5e1",

    paddingVertical: 7,
  },

  tableRow: {
    flexDirection: "row",

    paddingVertical: 10,

    minHeight: 34,
  },

  productColumn: {
    width: "52%",

    paddingHorizontal: 6,
  },

  quantityColumn: {
    width: "12%",

    paddingHorizontal: 6,

    textAlign: "center",
  },

  unitColumn: {
    width: "18%",

    paddingHorizontal: 6,

    textAlign: "right",
  },

  amountColumn: {
    width: "18%",

    paddingHorizontal: 6,

    textAlign: "right",
  },

  tableHeading: {
    fontSize: 8,

    color: "#475569",
  },

  totalsContainer: {
    marginTop: 10,

    alignItems: "flex-end",
  },

  totals: {
    width: 235,
  },

  totalRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    paddingVertical: 4,
  },

  totalLabel: {
    fontSize: 8.5,

    color: "#475569",
  },

  totalValue: {
    fontSize: 9,

    textAlign: "right",
  },

  grandTotalRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    marginTop: 4,

    paddingTop: 8,

    borderTopWidth: 1,

    borderTopColor: "#334155",
  },

  grandTotalLabel: {
    fontSize: 12,

    fontWeight: 700,
  },

  grandTotalValue: {
    fontSize: 14,

    fontWeight: 700,

    color: "#075985",
  },

  paymentBox: {
    marginTop: 24,

    padding: 12,

    borderWidth: 1,

    borderColor: "#eab308",

    borderRadius: 4,

    backgroundColor: "#fffdf3",
  },

  paymentTitle: {
    fontSize: 10,

    fontWeight: 700,

    color: "#b91c1c",

    marginBottom: 8,
  },

  paymentDue: {
    flexDirection: "row",

    marginBottom: 10,
  },

  paymentDueLabel: {
    fontWeight: 700,

    color: "#b91c1c",

    marginRight: 8,
  },

  bankTitle: {
    fontSize: 9,

    fontWeight: 700,

    marginBottom: 7,
  },

  bankGrid: {
    flexDirection: "row",

    flexWrap: "wrap",
  },

  bankItem: {
    width: "50%",

    marginBottom: 6,

    paddingRight: 10,
  },

  bankLabel: {
    fontSize: 7,

    color: "#64748b",

    marginBottom: 2,
  },

  bankValue: {
    fontSize: 8.5,
  },

  notesBox: {
    marginTop: 18,

    paddingTop: 10,

    borderTopWidth: 1,

    borderTopColor: "#e2e8f0",
  },

  notesTitle: {
    fontSize: 8,

    fontWeight: 700,

    marginBottom: 6,
  },

  notesText: {
    fontSize: 8,

    lineHeight: 1.7,

    color: "#475569",

    marginBottom: 3,
  },

  customNotesLabel: {
    marginTop: 5,

    marginBottom: 3,

    fontSize: 7.5,

    fontWeight: 700,

    color: "#64748b",
  },

  customNotesText: {
    fontSize: 8,

    lineHeight: 1.7,

    color: "#475569",
  },

  footer: {
    marginTop: 25,

    textAlign: "center",

    fontSize: 7,

    color: "#94a3b8",
  },

  cancelled: {
    marginTop: 12,

    padding: 8,

    borderWidth: 1,

    borderColor: "#fecaca",

    backgroundColor: "#fef2f2",

    color: "#b91c1c",

    textAlign: "center",

    fontWeight: 700,
  },
});

// ======================================================
// COMPONENT
// ======================================================

export default function PlacementInvoicePDF({ billing }: Props) {
  const invoice = billing.invoiceSnapshot;

  if (!invoice) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>請求書情報がありません。</Text>
        </Page>
      </Document>
    );
  }

  const quantity = Number(invoice.quantity || 1) || 1;

  const unitPrice =
    quantity > 0
      ? Number(billing.placementFee || 0) / quantity
      : Number(billing.placementFee || 0);

  return (
    <Document
      title={`請求書 ${billing.invoiceNumber || billing.billingId}`}
      author={invoice.issuer.name}
      subject="人材紹介手数料請求書"
      creator="Vision Career"
    >
      <Page size="A4" style={styles.page}>
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>請求書</Text>

            <Text style={styles.titleEnglish}>INVOICE</Text>
          </View>

          <View style={styles.invoiceMeta}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>請求書番号</Text>

              <Text style={styles.metaValue}>
                {billing.invoiceNumber || billing.billingId}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>発行日</Text>

              <Text style={styles.metaValue}>
                {formatJapanDate(billing.issuedAt)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ================================================= */}
        {/* CUSTOMER / ISSUER */}
        {/* ================================================= */}

        <View style={styles.parties}>
          <View style={styles.recipient}>
            <Text style={styles.sectionLabel}>ご請求先</Text>

            <Text style={styles.recipientName}>
              {invoice.recipient.companyName}
              {"  "}御中
            </Text>

            {invoice.recipient.address ? (
              <Text style={styles.partyText}>{invoice.recipient.address}</Text>
            ) : null}

            {invoice.recipient.contactPerson ? (
              <Text style={styles.contactPerson}>
                担当者：
                {invoice.recipient.contactPerson}
                {"  "}様
              </Text>
            ) : null}
          </View>

          <View style={styles.issuer}>
            <Text style={styles.sectionLabel}>発行者</Text>

            <Text style={styles.issuerName}>{invoice.issuer.name}</Text>

            {invoice.issuer.postalCode ? (
              <Text style={styles.partyText}>
                〒{invoice.issuer.postalCode}
              </Text>
            ) : null}

            <Text style={styles.partyText}>{invoice.issuer.address}</Text>

            {invoice.issuer.phone ? (
              <Text style={styles.partyText}>
                TEL：
                {invoice.issuer.phone}
              </Text>
            ) : null}

            {invoice.issuer.email ? (
              <Text style={styles.partyText}>
                Email：
                {invoice.issuer.email}
              </Text>
            ) : null}

            {invoice.issuer.registrationNumber ? (
              <Text style={styles.partyText}>
                登録番号：
                {invoice.issuer.registrationNumber}
              </Text>
            ) : null}

            {/* ============================================= */}
            {/* TEMPORARY DEMO STAMP */}
            {/* ============================================= */}

            <View style={styles.demoStamp}>
              <View style={styles.demoStampInner}>
                <Text style={styles.demoStampText}>印</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ================================================= */}
        {/* INVOICE ITEMS */}
        {/* ================================================= */}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.productColumn, styles.tableHeading]}>
              品名
            </Text>

            <Text style={[styles.quantityColumn, styles.tableHeading]}>
              数量
            </Text>

            <Text style={[styles.unitColumn, styles.tableHeading]}>単価</Text>

            <Text style={[styles.amountColumn, styles.tableHeading]}>金額</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.productColumn}>
              {invoice.serviceDescription}
            </Text>

            <Text style={styles.quantityColumn}>{quantity}</Text>

            <Text style={styles.unitColumn}>{formatYen(unitPrice)}</Text>

            <Text style={styles.amountColumn}>
              {formatYen(billing.placementFee)}
            </Text>
          </View>
        </View>

        {/* ================================================= */}
        {/* TOTALS */}
        {/* ================================================= */}

        <View style={styles.totalsContainer}>
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>小計</Text>

              <Text style={styles.totalValue}>
                {formatYen(billing.placementFee)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                消費税（
                {formatTaxRate(billing.taxRate)}）
              </Text>

              <Text style={styles.totalValue}>
                {formatYen(billing.taxAmount)}
              </Text>
            </View>

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>合計（税込）</Text>

              <Text style={styles.grandTotalValue}>
                {formatYen(billing.totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* ================================================= */}
        {/* PAYMENT INFORMATION */}
        {/* ================================================= */}

        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>お支払い情報</Text>

          <View style={styles.paymentDue}>
            <Text style={styles.paymentDueLabel}>支払期限：</Text>

            <Text>{formatJapanDate(billing.dueDate)}</Text>
          </View>

          <Text style={styles.bankTitle}>振込先情報</Text>

          <View style={styles.bankGrid}>
            <BankItem label="銀行名" value={invoice.bank.bankName} />

            <BankItem label="支店名" value={invoice.bank.branchName} />

            <BankItem label="口座種別" value={invoice.bank.accountType} />

            <BankItem label="口座番号" value={invoice.bank.accountNumber} />

            <BankItem label="口座名義" value={invoice.bank.accountHolder} />
          </View>
        </View>

        {/* ================================================= */}
        {/* CANCELLED */}
        {/* ================================================= */}

        {billing.status === "cancelled" ? (
          <View style={styles.cancelled}>
            <Text>この請求書はキャンセルされています</Text>

            {billing.cancellationReason ? (
              <Text>
                理由：
                {billing.cancellationReason}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* ================================================= */}
        {/* NOTES */}
        {/* ================================================= */}

        <View style={styles.notesBox}>
          <Text style={styles.notesTitle}>備考</Text>

          <Text style={styles.notesText}>
            ・振込手数料は貴社にてご負担くださいますようお願いいたします。
          </Text>

          <Text style={styles.notesText}>
            ・お振込の際は請求書番号をご確認ください。
          </Text>

          {billing.notes ? (
            <>
              <Text style={styles.customNotesLabel}>追加備考</Text>

              <Text style={styles.customNotesText}>{billing.notes}</Text>
            </>
          ) : null}
        </View>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <Text style={styles.footer}>
          この請求書はVision Careerシステムにより発行されています。
        </Text>
      </Page>
    </Document>
  );
}

// ======================================================
// BANK ITEM
// ======================================================

function BankItem({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <View style={styles.bankItem}>
      <Text style={styles.bankLabel}>{label}</Text>

      <Text style={styles.bankValue}>{value || "-"}</Text>
    </View>
  );
}

// ======================================================
// YEN
// ======================================================

function formatYen(value: number) {
  return `¥${Math.round(Number(value || 0)).toLocaleString("ja-JP")}`;
}

// ======================================================
// TAX
// ======================================================

function formatTaxRate(value: number) {
  const rate = Number(value || 0);

  return Number.isInteger(rate) ? `${rate}%` : `${rate.toFixed(2)}%`;
}

// ======================================================
// JAPAN DATE
// ======================================================

function formatJapanDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",

    year: "numeric",

    month: "2-digit",

    day: "2-digit",
  }).format(date);
}
