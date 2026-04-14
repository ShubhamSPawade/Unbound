"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Download, CreditCard, CheckCircle2, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
import { paymentApi } from "@/lib/api"

type Transaction = {
  id: string
  eventTitle: string
  eventId: number
  amount: number
  status: "SUCCESS" | "FAILED" | "PENDING" | "REFUNDED"
  razorpayOrderId: string
  razorpayPaymentId: string
  createdAt: string
}

const statusConfig = {
  SUCCESS:  { label: "Success",  icon: CheckCircle2, className: "bg-primary" },
  FAILED:   { label: "Failed",   icon: XCircle,      className: "bg-destructive text-destructive-foreground" },
  PENDING:  { label: "Pending",  icon: Clock,        className: "bg-secondary" },
  REFUNDED: { label: "Refunded", icon: CreditCard,   className: "bg-accent" },
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true)
      try {
        const res = await paymentApi.getMyPayments()
        setTransactions(res.data.data || [])
      } catch {
        setTransactions([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchPayments()
  }, [])

  const filtered = filterStatus === "all" ? transactions : transactions.filter((t) => t.status === filterStatus.toUpperCase())

  const totalSpent = transactions.filter((t) => t.status === "SUCCESS").reduce((sum, t) => sum + (t.amount || 0), 0)
  const successCount = transactions.filter((t) => t.status === "SUCCESS").length
  const failedCount = transactions.filter((t) => t.status === "FAILED").length

  const columns: Column<Transaction>[] = [
    {
      key: "eventTitle", header: "Event",
      render: (item) => <Link href={`/student/events/${item.eventId}`} className="font-bold hover:underline">{item.eventTitle}</Link>,
    },
    {
      key: "razorpayOrderId", header: "Order ID",
      render: (item) => <span className="font-mono text-sm">{item.razorpayOrderId || "—"}</span>,
    },
    {
      key: "createdAt", header: "Date", sortable: true,
      render: (item) => <span>{new Date(item.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "amount", header: "Amount", sortable: true,
      render: (item) => <span className="font-bold">{!item.amount ? "Free" : `Rs. ${item.amount}`}</span>,
    },
    {
      key: "status", header: "Status",
      render: (item) => {
        const config = statusConfig[item.status] || statusConfig.PENDING
        const Icon = config.icon
        return (
          <span className={`inline-flex items-center gap-1 border-2 border-foreground px-2 py-0.5 text-xs font-bold ${config.className}`}>
            <Icon className="h-3 w-3" />{config.label}
          </span>
        )
      },
    },
  ]

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-black md:text-4xl">Transaction History</h1>
          <p className="text-muted-foreground">View all your payment transactions</p>
        </div>
        <Button className="border-4 border-foreground bg-primary font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border-4 border-foreground bg-primary p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-bold uppercase">Total Spent</p>
          <p className="text-3xl font-black">Rs. {totalSpent}</p>
        </div>
        <div className="border-4 border-foreground bg-secondary p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-bold uppercase">Successful</p>
          <p className="text-3xl font-black">{successCount}</p>
        </div>
        <div className="border-4 border-foreground bg-accent p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-bold uppercase">Failed</p>
          <p className="text-3xl font-black">{failedCount}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "success", "failed", "pending", "refunded"].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`border-4 border-foreground px-4 py-2 font-bold capitalize transition-all ${filterStatus === s ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"}`}>
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 animate-pulse border-4 border-foreground bg-muted" />)}</div>
      ) : filtered.length > 0 ? (
        <div className="hidden md:block">
          <DataTable data={filtered} columns={columns} searchable searchPlaceholder="Search transactions..." searchKeys={["eventTitle", "razorpayOrderId"]} pageSize={10} />
        </div>
      ) : (
        <EmptyState icon={CreditCard} title="No transactions found" description="Your transaction history will appear here once you register for paid events." />
      )}
    </div>
  )
}
