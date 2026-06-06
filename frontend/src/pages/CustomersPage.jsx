import { Link } from "react-router-dom"
import { Button, Card, CardHeader, Icon, Table } from "../components"
import { seedCustomers } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { formatCurrency } from "../utils/formatters"

export function CustomersPage() {
  const [customers] = useLocalStorageState("stockwise_customers", seedCustomers)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">Manage contact details, purchases, balances, and notes.</p>
        </div>
        <Link to="/customers/add"><Button><Icon name="plus" /> Add customer</Button></Link>
      </div>
      <Card>
        <CardHeader title="Customer list" />
        <Table
          columns={[
            { key: "name", label: "Customer name" },
            { key: "phone", label: "Phone" },
            { key: "email", label: "Email" },
            { key: "address", label: "Address" },
            { key: "totalPurchases", label: "Total purchases", render: (row) => formatCurrency(row.totalPurchases) },
            { key: "totalOwed", label: "Total owed", render: (row) => formatCurrency(row.totalOwed) },
          ]}
          data={customers}
          renderActions={(row) => (
            <div className="flex gap-2">
              <Link className="font-semibold text-emerald-700" to={`/customers/${row.id}`}>View</Link>
              <Link className="font-semibold text-blue-700" to={`/customers/${row.id}/edit`}>Edit</Link>
            </div>
          )}
        />
      </Card>
    </div>
  )
}
