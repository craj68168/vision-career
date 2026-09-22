export type PlacementBillingStatus =
  | "draft"
  | "issued"
  | "paid"
  | "partially_refunded"
  | "refunded"
  | "cancelled";

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
// RESPONSES
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
// UPDATE
// ======================================================

export type UpdatePlacementBillingPayload = {
  placementFee: number;

  taxRate: number;

  dueDate: string;

  notes: string;
};

// ======================================================
// STAFF
// ======================================================

export type BillingStaffUserResponse = {
  success: boolean;

  data: {
    staffId: string;

    name: string;

    permissions: string[];
  };
};

// ======================================================
// ERROR
// ======================================================

export type BillingApiError = {
  success?: boolean;

  message?: string;
};
