import { useNavigate } from "react-router-dom"
import { toast } from "../components"
import { seedProducts } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { makeId } from "../utils/formatters"
import { ProductForm } from "./ProductForm"

export function AddProductPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useLocalStorageState("stockwise_products", seedProducts)

  function handleSubmit(data) {
    const product = {
      ...data,
      id: makeId("prod"),
      createdAt: new Date().toISOString(),
      activity: [{ id: makeId("act"), type: "added", quantity: Number(data.quantity), note: "Product created", date: new Date().toISOString() }],
    }
    setProducts([product, ...products])
    toast.success("Product saved")
    navigate("/products")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Add product</h1>
        <p className="mt-1 text-sm text-slate-500">Create a local product record before backend connection.</p>
      </div>
      <ProductForm submitLabel="Save product" onSubmit={handleSubmit} />
    </div>
  )
}
