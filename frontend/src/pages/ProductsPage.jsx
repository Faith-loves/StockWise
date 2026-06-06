import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Badge, Button, Card, CardHeader, EmptyState, Icon, SearchBar, Select, Table } from "../components"
import { seedProducts } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { formatCurrency, getStockStatus } from "../utils/formatters"

export function ProductsPage() {
  const [products] = useLocalStorageState("stockwise_products", seedProducts)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")
  const [sort, setSort] = useState("newest")

  const categories = useMemo(() => [...new Set(products.map((product) => product.category).filter(Boolean))], [products])

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const query = search.toLowerCase()
        const matchesSearch = [product.name, product.sku, product.category].some((value) => value?.toLowerCase().includes(query))
        const productStatus = getStockStatus(product).label
        const matchesCategory = category === "all" || product.category === category
        const matchesStatus = status === "all" || productStatus === status
        return matchesSearch && matchesCategory && matchesStatus
      })
      .sort((a, b) => {
        if (sort === "quantity") return Number(b.quantity) - Number(a.quantity)
        if (sort === "price") return Number(b.sellingPrice) - Number(a.sellingPrice)
        if (sort === "name") return a.name.localeCompare(b.name)
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
  }, [products, search, category, status, sort])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Products</h1>
          <p className="mt-1 text-sm text-slate-500">Manage stock levels, prices, categories, and supplier details.</p>
        </div>
        <Link to="/products/add"><Button><Icon name="plus" /> Add product</Button></Link>
      </div>

      <Card>
        <CardHeader title="Product list" description="Search by product name, SKU, or category." />
        <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-[1fr_180px_180px_180px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All stock status</option>
            <option value="In stock">In stock</option>
            <option value="Low stock">Low stock</option>
            <option value="Out of stock">Out of stock</option>
          </Select>
          <Select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Newest</option>
            <option value="quantity">Quantity</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </Select>
        </div>
        {products.length ? (
          <Table
            columns={[
              { key: "name", label: "Product name" },
              { key: "sku", label: "SKU" },
              { key: "category", label: "Category" },
              { key: "quantity", label: "Quantity" },
              { key: "costPrice", label: "Cost price", render: (row) => formatCurrency(row.costPrice) },
              { key: "sellingPrice", label: "Selling price", render: (row) => formatCurrency(row.sellingPrice) },
              { key: "status", label: "Stock status", render: (row) => {
                const current = getStockStatus(row)
                return <Badge variant={current.variant}>{current.label}</Badge>
              }},
            ]}
            data={filteredProducts}
            renderActions={(row) => (
              <div className="flex gap-2">
                <Link className="font-semibold text-emerald-700" to={`/products/${row.id}`}>View</Link>
                <Link className="font-semibold text-blue-700" to={`/products/${row.id}/edit`}>Edit</Link>
              </div>
            )}
          />
        ) : (
          <div className="p-5">
            <EmptyState title="No products yet" description="Add your first product to start tracking inventory." action={<Link to="/products/add"><Button>Add product</Button></Link>} />
          </div>
        )}
      </Card>
    </div>
  )
}
