export type PlacementBillingStatus =
  | "draft"
  | "issued"
  | "paid"
  | "partially_refunded"
  | "refunded"
  | "cancelled";

// ======================================================
// INVOICE
// ======================================================

export type PlacementInvoiceIssuer = {
  name: string;

  postalCode: string;

  address: string;

  phone: string;

  email: string;

  registrationNumber: string;
};

export type PlacementInvoiceRecipient = {
  companyName: string;

  address: string;

  contactPerson: string;
};

export type PlacementInvoiceBank = {
  bankName: string;

  branchName: string;

  accountType: string;

  accountNumber: string;

  accountHolder: string;
};

export type PlacementInvoiceSnapshot = {
  issuer: PlacementInvoiceIssuer;

  recipient: PlacementInvoiceRecipient;

  bank: PlacementInvoiceBank;

  serviceDescription: string;

  quantity: number;
};

// ======================================================
// AUDIT
// ======================================================

export type BillingAuditEntry = {
  _id?: string;

  action:
    | "CREATED"
    | "UPDATED"
    | "ISSUED"
    | "MARKED_PAID"
    | "CANCELLED"
    | "REFUND_PROCESSED";

  actor_type: "system" | "admin" | "staff";

  actor_id?: string | null;

  reason?: string | null;

  details?: Record<string, unknown> | null;

  created_at: string;
};

// ======================================================
// REFUND
// ======================================================

export type BillingRefund = {
  _id?: string;

  refundId: string;

  amount: number;

  reason: string;

  actor_type: "admin" | "staff";

  actor_id: string;

  refunded_at: string;
};

// ======================================================
// BILLING
// ======================================================

export type PlacementBilling = {
  billingId: string;

  invoiceNumber?: string | null;

  invoiceSnapshot?: PlacementInvoiceSnapshot | null;

  placementCandidateId: string;

  recruitId: string;

  providerId: string;

  companyName: string;

  candidateName: string;

  jobTitle: string;

  placementDate: string;

  currency: string;

  placementFee: number;

  taxRate: number;

  taxAmount: number;

  totalAmount: number;

  dueDate?: string | null;

  paidAmount: number;

  refundedAmount: number;

  netPaidAmount: number;

  status: PlacementBillingStatus;

  issuedAt?: string | null;

  paidAt?: string | null;

  cancelledAt?: string | null;

  fullyRefundedAt?: string | null;

  cancellationReason?: string | null;

  notes?: string | null;

  refundHistory: BillingRefund[];

  auditHistory: BillingAuditEntry[];

  createdAt: string;

  updatedAt: string;
};

// ======================================================
// SUMMARY
// ======================================================

export type PlacementBillingSummary = {
  total: number;

  draft: number;

  issued: number;

  paid: number;

  partiallyRefunded: number;

  refunded: number;

  cancelled: number;

  billedTotal: number;

  paidTotal: number;

  refundedTotal: number;

  outstandingTotal: number;
};

// ======================================================
// API RESPONSES
// ======================================================

export type PlacementBillingListResponse = {
  success: boolean;

  count: number;

  summary: PlacementBillingSummary;

  data: PlacementBilling[];

  message?: string;
};

export type PlacementBillingResponse = {
  success: boolean;

  message?: string;

  data: PlacementBilling;
};

// ======================================================
// PAYLOADS
// ======================================================

export type UpdatePlacementBillingPayload = {
  placementFee: number;

  taxRate: number;

  dueDate: string;

  notes: string;
};

export type RefundPlacementBillingPayload = {
  amount: number;

  reason: string;
};

export type ApiErrorResponse = {
  success?: boolean;

  message?: string;
};
