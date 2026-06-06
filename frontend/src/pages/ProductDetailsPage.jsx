import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Badge, Button, Card, CardHeader, ConfirmDialog, Input, Modal, Select, Table, Textarea, toast } from "../components"
import { seedProducts } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { formatCurrency, formatDate, getStockStatus, makeId } from "../utils/formatters"

export function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useLocalStorageState("stockwise_products", seedProducts)
  const product = products.find((item) => item.id === id)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [adjustOpen, setAdjustOpen] = useState(false)
  const [adjustment, setAdjustment] = useState({ type: "increase stock", quantity: 1, note: "" })

  if (!product) {
    return <Card className="p-6"><p className="text-slate-600">Product not found.</p></Card>
  }

  const status = getStockStatus(product)

  function deleteProduct() {
    setProducts(products.filter((item) => item.id !== product.id))
    toast.success("Product deleted")
    navigate("/products")
  }

  function adjustStock() {
    const quantity = Number(adjustment.quantity || 0)
    const reduceTypes = ["reduce stock", "damaged stock", "sold"]
    const nextQuantity = reduceTypes.includes(adjustment.type)
      ? Math.max(0, Number(product.quantity) - quantity)
      : adjustment.type === "correction"
        ? quantity
        : Number(product.quantity) + quantity

    setProducts(products.map((item) => item.id === product.id ? {
      ...item,
      quantity: nextQuantity,
      activity: [
        { id: makeId("act"), type: adjustment.type, quantity, note: adjustment.note || "Stock adjusted", date: new Date().toISOString() },
        ...(item.activity || []),
      ],
    } : item))
    setAdjustOpen(false)
    toast.success("Stock updated")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">{product.name}</h1>
          <p className="mt-1 text-sm text-slate-500">{product.sku} · {product.category}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setAdjustOpen(true)}>Adjust stock</Button>
          <Link to={`/products/${product.id}/edit`}><Button>Edit product</Button></Link>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>Delete</Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          <div className="flex aspect-video items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
            <span className="text-4xl font-bold">{product.name.slice(0, 2).toUpperCase()}</span>
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex justify-between"><span className="text-slate-500">Stock quantity</span><strong>{product.quantity}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">Stock status</span><Badge variant={status.variant}>{status.label}</Badge></div>
            <div className="flex justify-between"><span className="text-slate-500">Cost price</span><strong>{formatCurrency(product.costPrice)}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">Selling price</span><strong>{formatCurrency(product.sellingPrice)}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">Supplier</span><strong>{product.supplierName}</strong></div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Product info" description={product.description || "No description provided."} />
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Info label="Category" value={product.category} />
            <Info label="SKU" value={product.sku} />
            <Info label="Low-stock threshold" value={product.lowStockThreshold} />
            <Info label="Created" value={formatDate(product.createdAt)} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Sales history" />
          <Table
            columns={[
              { key: "customer", label: "Customer" },
              { key: "quantity", label: "Quantity" },
              { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
              { key: "date", label: "Date" },
            ]}
            data={[
              { id: "sale-a", customer: "Amina Stores", quantity: 2, amount: Number(product.sellingPrice) * 2, date: "Today" },
              { id: "sale-b", customer: "Musa Ventures", quantity: 1, amount: Number(product.sellingPrice), date: "Yesterday" },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title="Stock activity timeline" />
          <div className="space-y-4 p-5">
            {(product.activity || []).map((activity) => (
              <div key={activity.id} className="border-l-2 border-emerald-200 pl-4">
                <p className="font-semibold capitalize text-slate-950">{activity.type}</p>
                <p className="text-sm text-slate-500">{activity.quantity} units · {activity.note}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDate(activity.date)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        open={adjustOpen}
        title="Adjust stock"
        onClose={() => setAdjustOpen(false)}
        footer={<><Button variant="secondary" onClick={() => setAdjustOpen(false)}>Cancel</Button><Button onClick={adjustStock}>Save adjustment</Button></>}
      >
        <div className="space-y-4">
          <Select label="Adjustment type" value={adjustment.type} onChange={(event) => setAdjustment({ ...adjustment, type: event.target.value })}>
            <option>increase stock</option>
            <option>reduce stock</option>
            <option>damaged stock</option>
            <option>returned stock</option>
            <option>correction</option>
          </Select>
          <Input label={adjustment.type === "correction" ? "Correct stock quantity to" : "Quantity"} type="number" value={adjustment.quantity} onChange={(event) => setAdjustment({ ...adjustment, quantity: event.target.value })} />
          <Textarea label="Note" value={adjustment.note} onChange={(event) => setAdjustment({ ...adjustment, note: event.target.value })} />
        </div>
      </Modal>

      <ConfirmDialog open={deleteOpen} title="Delete product" message="This product will be removed from local storage." confirmLabel="Delete product" onCancel={() => setDeleteOpen(false)} onConfirm={deleteProduct} />
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  )
}
