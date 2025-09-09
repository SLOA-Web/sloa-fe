export interface Payment {
  status?: string;
  date?: string;
  createdAt?: string;
  paidAt?: string;
  updatedAt?: string;
  amount?: number | string;
  total?: number | string;
  totalAmount?: number | string;
  currency?: string;
  currencyCode?: string;
  description?: string;
  note?: string;
  title?: string;
  reference?: string;
  ref?: string;
  code?: string;
  id?: string;
  method?: string;
  channel?: string;
  source?: string;
  receipt?: string;
  receiptUrl?: string;
  invoiceUrl?: string;
  category?: string;
}

export type PaymentResponse = Payment[] | {
  payments?: Payment[];
  history?: Payment[];
  items?: Payment[];
};

export const normalizePaymentData = (data: PaymentResponse): Payment[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return data.payments || data.history || data.items || [];
  }
  return [];
};
