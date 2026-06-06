import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, toast } from "../components"
import { seedExpenses } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { ExpenseForm } from "./ExpenseForm"

export function EditExpensePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expenses, setExpenses] = useLocalStorageState("stockwise_expenses", seedExpenses)
  const expense = expenses.find((item) => item.id === id)
  const [form, setForm] = useState(expense || {})

  if (!expense) return <Card className="p-6">Expense not found.</Card>

  function handleSubmit(event) {
    event.preventDefault()
    setExpenses(expenses.map((item) => item.id === expense.id ? { ...item, ...form, amount: Number(form.amount) } : item))
    toast.success("Expense updated")
    navigate("/expenses")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Edit expense</h1>
        <p className="mt-1 text-sm text-slate-500">Update expense details, method, receipt, and notes.</p>
      </div>
      <ExpenseForm form={form} setForm={setForm} onSubmit={handleSubmit} submitLabel="Update expense" />
    </div>
  )
}
