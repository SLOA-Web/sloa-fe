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

export const normalizePaymentData = (data: unknown): Payment[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return (data as any).payments || (data as any).history || (data as any).items || [];
  }
  return [];
};
