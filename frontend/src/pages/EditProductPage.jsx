import { useNavigate, useParams } from "react-router-dom"
import { Card, toast } from "../components"
import { seedProducts } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { ProductForm } from "./ProductForm"

export function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useLocalStorageState("stockwise_products", seedProducts)
  const product = products.find((item) => item.id === id)

  if (!product) return <Card className="p-6">Product not found.</Card>

  function handleSubmit(data) {
    setProducts(products.map((item) => item.id === product.id ? { ...item, ...data } : item))
    toast.success("Product updated")
    navigate(`/products/${product.id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Edit product</h1>
        <p className="mt-1 text-sm text-slate-500">Update details, pricing, supplier, and stock settings.</p>
      </div>
      <ProductForm defaultValues={product} submitLabel="Update product" onSubmit={handleSubmit} />
    </div>
  )
}
