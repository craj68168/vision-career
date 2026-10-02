export type ProviderPlacementBillingStatus =
  | "issued"
  | "paid"
  | "partially_refunded"
  | "refunded"
  | "cancelled";

// ======================================================
// REFUND
// ======================================================

export type ProviderBillingRefund = {
  refundId: string;

  amount: number;

  reason: string;

  refundedAt?: string | null;
};

// ======================================================
// INVOICE SNAPSHOT
//
// This data is frozen by the backend when the billing
// is issued.
//
// Later company/profile/bank changes therefore do not
// change an already-issued invoice.
// ======================================================

export type ProviderInvoiceIssuer = {
  name: string;

  postalCode: string;

  address: string;

  phone: string;

  email: string;

  registrationNumber: string;
};

export type ProviderInvoiceRecipient = {
  companyName: string;

  address: string;

  contactPerson: string;
};

export type ProviderInvoiceBank = {
  bankName: string;

  branchName: string;

  accountType: string;

  accountNumber: string;

  accountHolder: string;
};

export type ProviderInvoiceSnapshot = {
  issuer: ProviderInvoiceIssuer;

  recipient: ProviderInvoiceRecipient;

  bank: ProviderInvoiceBank;

  serviceDescription: string;

  quantity: number;
};

// ======================================================
// BILLING
// ======================================================

export type ProviderPlacementBilling = {
  billingId: string;

  invoiceNumber?: string | null;

  invoiceSnapshot?: ProviderInvoiceSnapshot | null;

  placementCandidateId: string;

  recruitId: string;

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

  amountDue: number;

  status: ProviderPlacementBillingStatus;

  issuedAt?: string | null;

  paidAt?: string | null;

  cancelledAt?: string | null;

  fullyRefundedAt?: string | null;

  cancellationReason?: string | null;

  notes?: string | null;

  refundHistory: ProviderBillingRefund[];

  createdAt?: string | null;

  updatedAt?: string | null;
};

// ======================================================
// SUMMARY
// ======================================================

export type ProviderPlacementBillingSummary = {
  total: number;

  issued: number;

  paid: number;

  partiallyRefunded: number;

  refunded: number;

  cancelled: number;

  overdue: number;

  billedTotal: number;

  paidTotal: number;

  refundedTotal: number;

  outstandingTotal: number;

  overdueTotal: number;
};

// ======================================================
// API RESPONSES
// ======================================================

export type ProviderPlacementBillingListResponse = {
  success: boolean;

  count: number;

  summary: ProviderPlacementBillingSummary;

  data: ProviderPlacementBilling[];

  message?: string;
};

export type ProviderPlacementBillingResponse = {
  success: boolean;

  data: ProviderPlacementBilling;

  message?: string;
};
