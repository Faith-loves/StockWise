import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "../components"
import { seedExpenses } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { makeId } from "../utils/formatters"
import { ExpenseForm } from "./ExpenseForm"

const today = new Date().toISOString().slice(0, 10)

export function AddExpensePage() {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useLocalStorageState("stockwise_expenses", seedExpenses)
  const [form, setForm] = useState({ title: "", category: "Rent", amount: "", date: today, paymentMethod: "Cash", receiptImage: "", notes: "" })

  function handleSubmit(event) {
    event.preventDefault()
    setExpenses([{ ...form, id: makeId("exp"), amount: Number(form.amount), createdAt: new Date().toISOString() }, ...expenses])
    toast.success("Expense saved")
    navigate("/expenses")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Add expense</h1>
        <p className="mt-1 text-sm text-slate-500">Record rent, transport, supplies, salary, utilities, marketing, repairs, or other costs.</p>
      </div>
      <ExpenseForm form={form} setForm={setForm} onSubmit={handleSubmit} submitLabel="Save expense" />
    </div>
  )
}
