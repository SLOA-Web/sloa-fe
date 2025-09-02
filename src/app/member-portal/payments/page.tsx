"use client";
import React, { useEffect, useMemo, useState } from "react";
import { 
  Download, 
  Search, 
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Plus,
  TrendingUp
} from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await api.get<any>("/api/v1/payments/history");
        const list = Array.isArray(data)
          ? data
          : (data?.payments || data?.history || data?.items || []);
        setPayments(list);
      } catch (e) {
        toast.error("Failed to fetch payment history.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Derive status filter options from data
  const statuses = useMemo(() => {
    const counts: Record<string, number> = {};
    payments.forEach((p) => {
      const s = String(p.status || "unknown").toLowerCase();
      counts[s] = (counts[s] || 0) + 1;
    });
    const items = Object.entries(counts).map(([id, count]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      count,
    }));
    const total = payments.length;
    return [{ id: "all", name: "All Status", count: total }, ...items];
  }, [payments]);

  // Derive period (year) options from data
  const periods = useMemo(() => {
    const yearCounts: Record<string, number> = {};
    payments.forEach((p) => {
      const d = p.date || p.createdAt || p.paidAt || p.updatedAt;
      const year = d ? String(new Date(d).getFullYear()) : "Unknown";
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    const items = Object.entries(yearCounts)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([id, count]) => ({ id, name: id, count }));
    const total = payments.length;
    return [{ id: "all", name: "All Time", count: total }, ...items];
  }, [payments]);

  // Helpers
  const parseAmount = (p: any): number => {
    const raw = p.amount ?? p.total ?? p.totalAmount ?? 0;
    const n = typeof raw === "string" ? parseFloat(raw) : Number(raw || 0);
    return Number.isFinite(n) ? n : 0;
  };

  const currencyOf = (p: any): string => p.currency || p.currencyCode || "";
  const descriptionOf = (p: any): string => p.description || p.note || p.title || "Payment";
  const referenceOf = (p: any): string => p.reference || p.ref || p.code || p.id || "";
  const methodOf = (p: any): string => p.method || p.channel || p.source || "";
  const dateOf = (p: any): string => p.date || p.paidAt || p.createdAt || p.updatedAt || new Date().toISOString();
  const receiptUrlOf = (p: any): string | null => p.receipt || p.receiptUrl || p.invoiceUrl || null;

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const status = String(p.status || "").toLowerCase();
      const dateStr = dateOf(p);
      const year = String(new Date(dateStr).getFullYear());
      const matchesStatus = selectedStatus === "all" || status === selectedStatus;
      const matchesPeriod = selectedPeriod === "all" || year === selectedPeriod;
      const q = searchQuery.toLowerCase();
      const searchable = [descriptionOf(p), referenceOf(p), methodOf(p)].join(" ").toLowerCase();
      const matchesQuery = !q || searchable.includes(q);
      return matchesStatus && matchesPeriod && matchesQuery;
    });
  }, [payments, selectedStatus, selectedPeriod, searchQuery]);

  // Summary values
  const summary = useMemo(() => {
    let totalPaid = 0;
    let totalPending = 0;
    let totalOverdue = 0;
    payments.forEach((p) => {
      const s = String(p.status || "").toLowerCase();
      const amt = parseAmount(p);
      if (s === "paid" || s === "success" || s === "succeeded") totalPaid += amt;
      else if (s === "pending") totalPending += amt;
      else if (s === "overdue") totalOverdue += amt;
    });
    return { totalPaid, totalPending, totalOverdue, count: payments.length };
  }, [payments]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Payments</h2>
          <p className="text-muted-foreground mt-1">
            View payment history and manage your billing
          </p>
        </div>
        {/* Optional: Hook up to /payments/create later */}
        <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2" disabled>
          <Plus className="h-4 w-4" />
          Make Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{summary.totalPaid.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Paid</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{summary.totalPending.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{summary.totalOverdue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{summary.count}</p>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name} ({status.count})
                    </option>
                  ))}
                </select>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name} ({period.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Payment History</h3>
            {loading ? (
              <p>Loading your payments...</p>
            ) : (
              <div className="space-y-4">
                {filtered.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No payments found.</p>
                ) : (
                  filtered.map((payment: any) => {
                    const status = String(payment.status || "").toLowerCase();
                    const badgeClass =
                      status === "paid" || status === "success" || status === "succeeded"
                        ? "bg-green-100 text-green-800"
                        : status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : status === "overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800";
                    const amount = parseAmount(payment);
                    const currency = currencyOf(payment);
                    const dateStr = dateOf(payment);
                    const receiptUrl = receiptUrlOf(payment);
                    return (
                      <div key={referenceOf(payment)} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClass}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                            {payment.category && (
                              <span className="text-xs text-muted-foreground">{payment.category}</span>
                            )}
                          </div>
                          <h4 className="font-medium text-foreground mb-1">{descriptionOf(payment)}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {referenceOf(payment) && <span>Ref: {referenceOf(payment)}</span>}
                            <span>{new Date(dateStr).toLocaleDateString()}</span>
                            {methodOf(payment) && <span>{methodOf(payment)}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-foreground">
                            {currency ? `${currency} ` : ""}{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            {receiptUrl && (
                              <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-accent rounded-lg transition-colors">
                                <Download className="h-4 w-4 text-primary" />
                              </a>
                            )}
                            
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
