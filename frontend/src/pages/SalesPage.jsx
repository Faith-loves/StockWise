import { Link } from "react-router-dom"
import { Badge, Button, Card, CardHeader, Icon, Table } from "../components"
import { seedSales } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { formatCurrency } from "../utils/formatters"
import { invoiceStatusVariant } from "../utils/business"

export function SalesPage() {
  const [sales] = useLocalStorageState("stockwise_sales", seedSales)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Sales</h1>
          <p className="mt-1 text-sm text-slate-500">Track invoices, customers, products sold, payments, and sale dates.</p>
        </div>
        <Link to="/sales/create"><Button><Icon name="plus" /> Create sale</Button></Link>
      </div>
      <Card>
        <CardHeader title="Sales records" />
        <Table
          columns={[
            { key: "invoiceNumber", label: "Invoice number" },
            { key: "customerName", label: "Customer" },
            { key: "items", label: "Items sold", render: (row) => row.items.map((item) => `${item.name} x${item.quantity}`).join(", ") },
            { key: "total", label: "Total amount", render: (row) => formatCurrency(row.total) },
            { key: "paymentStatus", label: "Payment status", render: (row) => <Badge variant={invoiceStatusVariant(row.paymentStatus)}>{row.paymentStatus}</Badge> },
            { key: "paymentMethod", label: "Payment method" },
            { key: "date", label: "Date" },
          ]}
          data={sales}
          renderActions={(row) => <Link className="font-semibold text-emerald-700" to={`/sales/${row.id}`}>View</Link>}
          emptyMessage="No sales yet. Create a sale to reduce stock and create an invoice."
        />
      </Card>
    </div>
  )
}
