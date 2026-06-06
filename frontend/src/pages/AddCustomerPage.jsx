import { useNavigate } from "react-router-dom"
import { toast } from "../components"
import { seedCustomers } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { makeId } from "../utils/formatters"
import { CustomerForm } from "./CustomerForm"

export function AddCustomerPage() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useLocalStorageState("stockwise_customers", seedCustomers)

  function handleSubmit(data) {
    const customer = {
      ...data,
      id: makeId("cust"),
      totalPurchases: 0,
      totalOwed: 0,
      createdAt: new Date().toISOString(),
    }
    setCustomers([customer, ...customers])
    toast.success("Customer saved")
    navigate("/customers")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Add customer</h1>
        <p className="mt-1 text-sm text-slate-500">Save customer contacts, type, address, and notes.</p>
      </div>
      <CustomerForm submitLabel="Save customer" onSubmit={handleSubmit} />
    </div>
  )
}
