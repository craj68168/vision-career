export type ProviderPlacementBillingStatus =
  | "issued"
  | "paid"
  | "partially_refunded"
  | "refunded"
  | "cancelled";

export type ProviderBillingRefund = {
  refundId: string;

  amount: number;

  reason: string;

  refundedAt?: string | null;
};

export type ProviderPlacementBilling = {
  billingId: string;

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
