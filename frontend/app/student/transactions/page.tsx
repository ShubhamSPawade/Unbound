"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, Search, Filter, Calendar, CreditCard, CheckCircle2, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable, type Column } from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"

type Transaction = {
  id: string
  eventTitle: string
  eventId: number
  amount: number
  status: "success" | "failed" | "pending" | "refunded"
  date: string
  paymentMethod: string
  transactionId: string
}

const transactions: Transaction[] = [
  {
    id: "1",
    eventTitle: "Cultural Night",
    eventId: 2,
    amount: 102,
    status: "success",
    date: "Mar 28, 2026",
    paymentMethod: "UPI",
    transactionId: "TXN2026032801",
  },
  {
    id: "2",
    eventTitle: "Music Workshop",
    eventId: 5,
    amount: 204,
    status: "success",
    date: "Mar 25, 2026",
    paymentMethod: "Credit Card",
    transactionId: "TXN2026032502",
  },
  {
    id: "3",
    eventTitle: "Inter-College Cricket",
    eventId: 4,
    amount: 51,
    status: "failed",
    date: "Mar 22, 2026",
    paymentMethod: "Debit Card",
    transactionId: "TXN2026032203",
  },
  {
    id: "4",
    eventTitle: "Art Exhibition",
    eventId: 3,
    amount: 0,
    status: "success",
    date: "Mar 20, 2026",
    paymentMethod: "Free",
    transactionId: "TXN2026032004",
  },
  {
    id: "5",
    eventTitle: "Hackathon 2026",
    eventId: 1,
    amount: 0,
    status: "success",
    date: "Mar 15, 2026",
    paymentMethod: "Free",
    transactionId: "TXN2026031505",
  },
]

const statusConfig = {
  success: {
    label: "Success",
    icon: CheckCircle2,
    className: "bg-primary",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-destructive text-destructive-foreground",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-secondary",
  },
  refunded: {
    label: "Refunded",
    icon: CreditCard,
    className: "bg-accent",
  },
}

export default function TransactionsPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredTransactions =
    filterStatus === "all"
      ? transactions
      : transactions.filter((t) => t.status === filterStatus)

  const columns: Column<Transaction>[] = [
    {
      key: "eventTitle",
      header: "Event",
      render: (item) => (
        <Link
          href={`/student/events/${item.eventId}`}
          className="font-bold hover:underline"
        >
          {item.eventTitle}
        </Link>
      ),
    },
    {
      key: "transactionId",
      header: "Transaction ID",
      render: (item) => (
        <span className="font-mono text-sm">{item.transactionId}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (item) => (
        <span className="font-bold">
          {item.amount === 0 ? "Free" : `Rs. ${item.amount}`}
        </span>
      ),
    },
    {
      key: "paymentMethod",
      header: "Method",
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const config = statusConfig[item.status]
        const Icon = config.icon
        return (
          <span
            className={`inline-flex items-center gap-1 border-2 border-foreground px-2 py-0.5 text-xs font-bold ${config.className}`}
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </span>
        )
      },
    },
  ]

  // Calculate totals
  const totalSpent = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0)
  const successfulCount = transactions.filter((t) => t.status === "success").length
  const failedCount = transactions.filter((t) => t.status === "failed").length

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-black md:text-4xl">Transaction History</h1>
          <p className="text-muted-foreground">
            View all your payment transactions and receipts
          </p>
        </div>
        <Button className="border-4 border-foreground bg-primary font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border-4 border-foreground bg-primary p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-bold uppercase">Total Spent</p>
          <p className="text-3xl font-black">Rs. {totalSpent}</p>
        </div>
        <div className="border-4 border-foreground bg-secondary p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-bold uppercase">Successful</p>
          <p className="text-3xl font-black">{successfulCount}</p>
        </div>
        <div className="border-4 border-foreground bg-accent p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-bold uppercase">Failed</p>
          <p className="text-3xl font-black">{failedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "success", "failed", "pending", "refunded"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`border-4 border-foreground px-4 py-2 font-bold capitalize transition-all ${
              filterStatus === status
                ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "bg-card hover:bg-muted"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      {filteredTransactions.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <DataTable
              data={filteredTransactions}
              columns={columns}
              searchable={true}
              searchPlaceholder="Search transactions..."
              searchKeys={["eventTitle", "transactionId"]}
              pageSize={10}
            />
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {filteredTransactions.map((transaction) => {
              const config = statusConfig[transaction.status]
              const Icon = config.icon
              return (
                <div
                  key={transaction.id}
                  className="border-4 border-foreground bg-card p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <Link
                      href={`/student/events/${transaction.eventId}`}
                      className="font-bold hover:underline"
                    >
                      {transaction.eventTitle}
                    </Link>
                    <span
                      className={`inline-flex items-center gap-1 border-2 border-foreground px-2 py-0.5 text-xs font-bold ${config.className}`}
                    >
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </div>
                  <p className="mb-2 font-mono text-xs text-muted-foreground">
                    {transaction.transactionId}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{transaction.date}</span>
                    <span className="font-bold">
                      {transaction.amount === 0 ? "Free" : `Rs. ${transaction.amount}`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <EmptyState
          icon={CreditCard}
          title="No transactions found"
          description="Your transaction history will appear here once you register for paid events."
        />
      )}
    </div>
  )
}
