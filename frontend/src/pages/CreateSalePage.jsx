import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Card, CardHeader, Input, Select, toast } from "../components"
import { defaultSettings, seedCustomers, seedInvoices, seedProducts, seedSales } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { createInvoiceNumber } from "../utils/business"
import { formatCurrency, makeId } from "../utils/formatters"

const emptyLine = { productId: "", quantity: 1 }

export function CreateSalePage() {
  const navigate = useNavigate()
  const [products, setProducts] = useLocalStorageState("stockwise_products", seedProducts)
  const [customers, setCustomers] = useLocalStorageState("stockwise_customers", seedCustomers)
  const [sales, setSales] = useLocalStorageState("stockwise_sales", seedSales)
  const [invoices, setInvoices] = useLocalStorageState("stockwise_invoices", seedInvoices)
  const [settings] = useLocalStorageState("stockwise_settings", defaultSettings)
  const [customerId, setCustomerId] = useState(customers[0]?.id || "")
  const [lines, setLines] = useState([{ ...emptyLine }])
  const [discount, setDiscount] = useState(0)
  const [taxRate, setTaxRate] = useState(0)
  const [paymentStatus, setPaymentStatus] = useState("Paid")
  const [paymentMethod, setPaymentMethod] = useState("Cash")
  const [error, setError] = useState("")

  const selectedCustomer = customers.find((customer) => customer.id === customerId)
  const calculatedItems = useMemo(() => lines.map((line) => {
    const product = products.find((item) => item.id === line.productId)
    const quantity = Number(line.quantity || 0)
    return {
      ...line,
      product,
      name: product?.name || "Select product",
      sku: product?.sku || "",
      available: Number(product?.quantity || 0),
      price: Number(product?.sellingPrice || 0),
      subtotal: quantity * Number(product?.sellingPrice || 0),
    }
  }), [lines, products])
  const subtotal = calculatedItems.reduce((total, item) => total + item.subtotal, 0)
  const tax = Math.max(0, (subtotal - Number(discount || 0)) * (Number(taxRate || 0) / 100))
  const finalTotal = Math.max(0, subtotal - Number(discount || 0) + tax)

  function updateLine(index, field, value) {
    setLines(lines.map((line, lineIndex) => lineIndex === index ? { ...line, [field]: value } : line))
  }

  function saveSale() {
    setError("")
    if (!selectedCustomer) {
      setError("Select a customer before saving.")
      return
    }
    if (!calculatedItems.length || calculatedItems.some((item) => !item.product || Number(item.quantity) <= 0)) {
      setError("Add at least one valid product and quantity.")
      return
    }
    const invalidStock = calculatedItems.find((item) => Number(item.quantity) > item.available)
    if (invalidStock) {
      setError(`${invalidStock.name} only has ${invalidStock.available} available.`)
      return
    }

    const invoiceNumber = createInvoiceNumber(settings.invoicePrefix, invoices.length + 1)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 7)
    const date = new Date().toISOString().slice(0, 10)
    const saleItems = calculatedItems.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      sku: item.product.sku,
      quantity: Number(item.quantity),
      price: item.price,
      subtotal: item.subtotal,
    }))
    const sale = {
      id: makeId("sale"),
      invoiceNumber,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      customerEmail: selectedCustomer.email,
      items: saleItems,
      subtotal,
      discount: Number(discount || 0),
      tax,
      total: finalTotal,
      paymentStatus,
      paymentMethod,
      date,
      dueDate: dueDate.toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    }
    const invoice = {
      id: invoiceNumber,
      saleId: sale.id,
      invoiceNumber,
      customerId: sale.customerId,
      customerName: sale.customerName,
      customerPhone: sale.customerPhone,
      customerEmail: sale.customerEmail,
      items: sale.items,
      subtotal,
      discount: sale.discount,
      tax,
      amount: finalTotal,
      status: paymentStatus,
      paymentMethod,
      date,
      dueDate: sale.dueDate,
      createdAt: sale.createdAt,
    }

    setProducts(products.map((product) => {
      const sold = saleItems.find((item) => item.productId === product.id)
      if (!sold) return product
      return {
        ...product,
        quantity: Number(product.quantity) - sold.quantity,
        activity: [
          { id: makeId("act"), type: "sold", quantity: sold.quantity, note: `Sold on ${invoiceNumber}`, date: new Date().toISOString() },
          ...(product.activity || []),
        ],
      }
    }))
    setCustomers(customers.map((customer) => customer.id === selectedCustomer.id ? {
      ...customer,
      totalPurchases: Number(customer.totalPurchases || 0) + finalTotal,
      totalOwed: paymentStatus === "Paid" ? Number(customer.totalOwed || 0) : Number(customer.totalOwed || 0) + finalTotal,
    } : customer))
    setSales([sale, ...sales])
    setInvoices([invoice, ...invoices])
    toast.success("Sale saved and stock updated")
    navigate(`/sales/${sale.id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Create sale</h1>
        <p className="mt-1 text-sm text-slate-500">Select a customer, add products, calculate totals, and reduce stock automatically.</p>
      </div>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader title="Sale items" />
          <div className="space-y-4 p-5">
            <Select label="Customer" value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
              {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
            </Select>
            {calculatedItems.map((line, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-[1fr_140px_120px]">
                <Select label="Product" value={line.productId} onChange={(event) => updateLine(index, "productId", event.target.value)}>
                  <option value="">Select product</option>
                  {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                </Select>
                <Input label="Quantity sold" type="number" min="1" value={line.quantity} onChange={(event) => updateLine(index, "quantity", event.target.value)} />
                <div>
                  <p className="text-sm font-medium text-slate-500">Available</p>
                  <p className="mt-3 font-bold text-slate-950">{line.available}</p>
                </div>
                <div className="md:col-span-3 text-sm text-slate-600">Item subtotal: <strong>{formatCurrency(line.subtotal)}</strong></div>
              </div>
            ))}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setLines([...lines, { ...emptyLine }])}>Add another product</Button>
              {lines.length > 1 && <Button variant="ghost" onClick={() => setLines(lines.slice(0, -1))}>Remove last</Button>}
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Payment summary" />
          <div className="space-y-4 p-5">
            <Input label="Discount" type="number" value={discount} onChange={(event) => setDiscount(event.target.value)} />
            <Input label="Tax/VAT %" type="number" value={taxRate} onChange={(event) => setTaxRate(event.target.value)} />
            <Select label="Payment status" value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
              <option>Paid</option>
              <option>Partial</option>
              <option>Unpaid</option>
            </Select>
            <Select label="Payment method" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option>Cash</option>
              <option>Transfer</option>
              <option>POS</option>
              <option>Card</option>
              <option>Other</option>
            </Select>
            <div className="rounded-lg bg-slate-50 p-4 text-sm">
              <Line label="Subtotal" value={formatCurrency(subtotal)} />
              <Line label="Discount" value={`-${formatCurrency(discount)}`} />
              <Line label="Tax/VAT" value={formatCurrency(tax)} />
              <Line label="Final total" value={formatCurrency(finalTotal)} strong />
            </div>
            <Button className="w-full" onClick={saveSale}>Save sale</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function Line({ label, value, strong }) {
  return (
    <div className={`flex justify-between py-2 ${strong ? "border-t border-slate-200 text-base font-bold text-slate-950" : "text-slate-600"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
