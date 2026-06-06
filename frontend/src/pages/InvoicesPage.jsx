import { Link } from "react-router-dom"
import { Badge, Card, CardHeader, Table } from "../components"
import { seedInvoices } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { getInvoiceStatus, invoiceStatusVariant } from "../utils/business"
import { formatCurrency } from "../utils/formatters"

export function InvoicesPage() {
  const [invoices] = useLocalStorageState("stockwise_invoices", seedInvoices)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Invoices</h1>
        <p className="mt-1 text-sm text-slate-500">Monitor invoice status, due dates, payments, and customer balances.</p>
      </div>
      <Card>
        <CardHeader title="Invoice list" />
        <Table
          columns={[
            { key: "invoiceNumber", label: "Invoice number" },
            { key: "customerName", label: "Customer" },
            { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
            { key: "status", label: "Status", render: (row) => {
              const status = getInvoiceStatus(row)
              return <Badge variant={invoiceStatusVariant(status)}>{status}</Badge>
            }},
            { key: "dueDate", label: "Due date" },
          ]}
          data={invoices}
          renderActions={(row) => <Link className="font-semibold text-emerald-700" to={`/invoices/${row.invoiceNumber}`}>View</Link>}
          emptyMessage="No invoices yet. Create a sale to generate invoices."
        />
      </Card>
    </div>
  )
}
