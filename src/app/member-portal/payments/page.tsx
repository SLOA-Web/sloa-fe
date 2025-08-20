"use client";
import React, { useState } from "react";
import { 
  CreditCard, 
  Download, 
  Search, 
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Receipt,
  Plus,
  TrendingUp
} from "lucide-react";

const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const statuses = [
    { id: 'all', name: 'All Status', count: 24 },
    { id: 'paid', name: 'Paid', count: 18 },
    { id: 'pending', name: 'Pending', count: 3 },
    { id: 'overdue', name: 'Overdue', count: 2 },
    { id: 'failed', name: 'Failed', count: 1 },
  ];

  const periods = [
    { id: 'all', name: 'All Time', count: 24 },
    { id: '2024', name: '2024', count: 18 },
    { id: '2023', name: '2023', count: 6 },
  ];

  const payments = [
    {
      id: 1,
      description: "Annual Membership Fee 2024",
      amount: 250.00,
      currency: "USD",
      status: "paid",
      date: "2024-01-15",
      dueDate: "2024-01-15",
      method: "Credit Card",
      reference: "MEM-2024-001",
      category: "Membership",
      isRecurring: true,
      nextDue: "2025-01-15",
      receipt: "receipt-001.pdf",
    },
    {
      id: 2,
      description: "Conference Registration - Annual Meeting",
      amount: 150.00,
      currency: "USD",
      status: "paid",
      date: "2024-02-20",
      dueDate: "2024-02-20",
      method: "Bank Transfer",
      reference: "CONF-2024-001",
      category: "Events",
      isRecurring: false,
      nextDue: null,
      receipt: "receipt-002.pdf",
    },
    {
      id: 3,
      description: "Workshop Fee - Advanced Techniques",
      amount: 75.00,
      currency: "USD",
      status: "pending",
      date: "2024-03-10",
      dueDate: "2024-03-25",
      method: "Credit Card",
      reference: "WORK-2024-001",
      category: "Education",
      isRecurring: false,
      nextDue: null,
      receipt: null,
    },
    {
      id: 4,
      description: "Annual Membership Fee 2025",
      amount: 250.00,
      currency: "USD",
      status: "overdue",
      date: "2025-01-15",
      dueDate: "2025-01-15",
      method: "Credit Card",
      reference: "MEM-2025-001",
      category: "Membership",
      isRecurring: true,
      nextDue: "2026-01-15",
      receipt: null,
    },
    {
      id: 5,
      description: "Journal Subscription - Orthopaedic Review",
      amount: 45.00,
      currency: "USD",
      status: "paid",
      date: "2024-04-01",
      dueDate: "2024-04-01",
      method: "Credit Card",
      reference: "JOUR-2024-001",
      category: "Publications",
      isRecurring: true,
      nextDue: "2025-04-01",
      receipt: "receipt-003.pdf",
    },
    {
      id: 6,
      description: "Certification Renewal Fee",
      amount: 100.00,
      currency: "USD",
      status: "failed",
      date: "2024-05-01",
      dueDate: "2024-05-01",
      method: "Credit Card",
      reference: "CERT-2024-001",
      category: "Certification",
      isRecurring: false,
      nextDue: null,
      receipt: null,
    },
  ];

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
        <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
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
              <p className="text-2xl font-bold text-foreground">$4,250</p>
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
              <p className="text-2xl font-bold text-foreground">$375</p>
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
              <p className="text-2xl font-bold text-foreground">$250</p>
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
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
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
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">{payment.category}</span>
                    </div>
                    
                    <h4 className="font-medium text-foreground mb-1">{payment.description}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Ref: {payment.reference}</span>
                      <span>{new Date(payment.date).toLocaleDateString()}</span>
                      <span>{payment.method}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">
                      {payment.currency} {payment.amount.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {payment.receipt && (
                        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                          <Download className="h-4 w-4 text-primary" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Payment Methods */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Payment Methods</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">Visa ending in 4242</span>
                </div>
                <span className="text-xs text-muted-foreground">Default</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">Mastercard ending in 8888</span>
                </div>
                <button className="text-xs text-primary hover:underline">Set Default</button>
              </div>
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <Plus className="h-4 w-4" />
                Add Payment Method
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <Plus className="h-4 w-4" />
                Make Payment
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                Download Statement
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <Receipt className="h-4 w-4" />
                View Receipts
              </button>
            </div>
          </div>

          {/* Payment Stats */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Payment Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-sm font-medium text-foreground">$750</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Month</span>
                <span className="text-sm font-medium text-foreground">$1,200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-sm font-medium text-foreground">94%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;

