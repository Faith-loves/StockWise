import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardHeader, ConfirmDialog, Table, toast } from "../components"
import { seedCustomers } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { formatCurrency, formatDate } from "../utils/formatters"

export function CustomerDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customers, setCustomers] = useLocalStorageState("stockwise_customers", seedCustomers)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const customer = customers.find((item) => item.id === id)

  if (!customer) return <Card className="p-6">Customer not found.</Card>

  function deleteCustomer() {
    setCustomers(customers.filter((item) => item.id !== customer.id))
    toast.success("Customer deleted")
    navigate("/customers")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">{customer.name}</h1>
          <p className="mt-1 text-sm text-slate-500">{customer.customerType} · {customer.phone}</p>
        </div>
        <div className="flex gap-3">
          <Link to={`/customers/${customer.id}/edit`}><Button>Edit customer</Button></Link>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>Delete</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-5"><p className="text-sm text-slate-500">Total purchases</p><p className="mt-2 text-2xl font-bold">{formatCurrency(customer.totalPurchases)}</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500">Amount owed</p><p className="mt-2 text-2xl font-bold">{formatCurrency(customer.totalOwed)}</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500">Customer since</p><p className="mt-2 text-lg font-bold">{formatDate(customer.createdAt)}</p></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader title="Customer info" />
          <div className="space-y-3 p-5 text-sm">
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Address:</strong> {customer.address}</p>
            <p><strong>Notes:</strong> {customer.notes || "No notes yet."}</p>
          </div>
        </Card>
        <Card>
          <CardHeader title="Purchase history" />
          <Table
            columns={[
              { key: "invoice", label: "Invoice" },
              { key: "item", label: "Item" },
              { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
              { key: "date", label: "Date" },
            ]}
            data={[
              { id: "p1", invoice: "INV-0019", item: "Rice 25kg", amount: 78000, date: "Today" },
              { id: "p2", invoice: "INV-0014", item: "Noodles Carton", amount: 66000, date: "Jun 4" },
            ]}
          />
        </Card>
      </div>

      <Card>
        <CardHeader title="Invoices" />
        <Table
          columns={[
            { key: "id", label: "Invoice" },
            { key: "status", label: "Status" },
            { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
            { key: "due", label: "Due date" },
          ]}
          data={[
            { id: "INV-0019", status: "Unpaid", amount: customer.totalOwed, due: "Jun 9" },
          ]}
        />
      </Card>

      <ConfirmDialog open={deleteOpen} title="Delete customer" message="This customer will be removed from local storage." confirmLabel="Delete customer" onCancel={() => setDeleteOpen(false)} onConfirm={deleteCustomer} />
    </div>
  )
}
