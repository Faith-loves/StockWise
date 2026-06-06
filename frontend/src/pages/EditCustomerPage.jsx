import { useNavigate, useParams } from "react-router-dom"
import { Card, toast } from "../components"
import { seedCustomers } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { CustomerForm } from "./CustomerForm"

export function EditCustomerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customers, setCustomers] = useLocalStorageState("stockwise_customers", seedCustomers)
  const customer = customers.find((item) => item.id === id)

  if (!customer) return <Card className="p-6">Customer not found.</Card>

  function handleSubmit(data) {
    setCustomers(customers.map((item) => item.id === customer.id ? { ...item, ...data } : item))
    toast.success("Customer updated")
    navigate(`/customers/${customer.id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Edit customer</h1>
        <p className="mt-1 text-sm text-slate-500">Update customer details, address, type, and notes.</p>
      </div>
      <CustomerForm defaultValues={customer} submitLabel="Update customer" onSubmit={handleSubmit} />
    </div>
  )
}
