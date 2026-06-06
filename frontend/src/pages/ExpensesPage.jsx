import { useState } from "react"
import { Link } from "react-router-dom"
import { Button, Card, CardHeader, ConfirmDialog, Icon, Table, toast } from "../components"
import { seedExpenses } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { formatCurrency } from "../utils/formatters"

export function ExpensesPage() {
  const [expenses, setExpenses] = useLocalStorageState("stockwise_expenses", seedExpenses)
  const [deleting, setDeleting] = useState(null)

  function deleteExpense() {
    setExpenses(expenses.filter((expense) => expense.id !== deleting.id))
    setDeleting(null)
    toast.success("Expense deleted")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Expenses</h1>
          <p className="mt-1 text-sm text-slate-500">Track spending by category, amount, date, method, and notes.</p>
        </div>
        <Link to="/expenses/add"><Button><Icon name="plus" /> Add expense</Button></Link>
      </div>
      <Card>
        <CardHeader title="Expense list" />
        <Table
          columns={[
            { key: "title", label: "Expense title" },
            { key: "category", label: "Category" },
            { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
            { key: "date", label: "Date" },
            { key: "paymentMethod", label: "Payment method" },
            { key: "notes", label: "Notes" },
          ]}
          data={expenses}
          renderActions={(row) => (
            <div className="flex gap-3">
              <Link className="font-semibold text-blue-700" to={`/expenses/${row.id}/edit`}>Edit</Link>
              <button className="font-semibold text-red-600" onClick={() => setDeleting(row)}>Delete</button>
            </div>
          )}
          emptyMessage="No expenses yet. Add one to improve profit reporting."
        />
      </Card>
      <ConfirmDialog open={Boolean(deleting)} title="Delete expense" message="This expense will be removed from local storage." confirmLabel="Delete expense" onCancel={() => setDeleting(null)} onConfirm={deleteExpense} />
    </div>
  )
}
