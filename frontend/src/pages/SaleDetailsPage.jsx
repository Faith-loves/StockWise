import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Link, useParams } from "react-router-dom"
import { Badge, Button, Card, CardHeader, Table, toast } from "../components"
import { seedInvoices, seedSales } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { invoiceStatusVariant } from "../utils/business"
import { formatCurrency } from "../utils/formatters"

export function SaleDetailsPage() {
  const { id } = useParams()
  const [sales] = useLocalStorageState("stockwise_sales", seedSales)
  const [invoices, setInvoices] = useLocalStorageState("stockwise_invoices", seedInvoices)
  const sale = sales.find((item) => item.id === id)

  if (!sale) return <Card className="p-6">Sale not found.</Card>

  function printReceipt() {
    window.print()
  }

  function generateInvoice() {
    if (!invoices.some((invoice) => invoice.saleId === sale.id)) {
      setInvoices([{ ...sale, id: sale.invoiceNumber, saleId: sale.id, amount: sale.total, status: sale.paymentStatus }, ...invoices])
    }
    toast.success("Invoice generated")
  }

  function downloadReceipt() {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("StockWise Receipt", 14, 18)
    doc.setFontSize(10)
    doc.text(`Invoice: ${sale.invoiceNumber}`, 14, 28)
    doc.text(`Customer: ${sale.customerName}`, 14, 34)
    autoTable(doc, {
      startY: 42,
      head: [["Product", "Qty", "Price", "Subtotal"]],
      body: sale.items.map((item) => [item.name, item.quantity, formatCurrency(item.price), formatCurrency(item.subtotal)]),
    })
    doc.text(`Total: ${formatCurrency(sale.total)}`, 14, doc.lastAutoTable.finalY + 12)
    doc.save(`${sale.invoiceNumber}-receipt.pdf`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Sale {sale.invoiceNumber}</h1>
          <p className="mt-1 text-sm text-slate-500">{sale.customerName} · {sale.date}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={printReceipt}>Print receipt</Button>
          <Button variant="secondary" onClick={downloadReceipt}>Download receipt</Button>
          <Button onClick={generateInvoice}>Generate invoice</Button>
          <Link to={`/invoices/${sale.invoiceNumber}`}><Button variant="secondary">View invoice</Button></Link>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5"><p className="text-sm text-slate-500">Customer</p><p className="mt-2 font-bold text-slate-950">{sale.customerName}</p><p className="text-sm text-slate-500">{sale.customerPhone}</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500">Payment</p><p className="mt-2"><Badge variant={invoiceStatusVariant(sale.paymentStatus)}>{sale.paymentStatus}</Badge></p><p className="mt-2 text-sm text-slate-500">{sale.paymentMethod}</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500">Final total</p><p className="mt-2 text-2xl font-bold text-slate-950">{formatCurrency(sale.total)}</p></Card>
      </div>
      <Card>
        <CardHeader title="Products sold" />
        <Table
          columns={[
            { key: "name", label: "Product" },
            { key: "sku", label: "SKU" },
            { key: "quantity", label: "Quantity" },
            { key: "price", label: "Price", render: (row) => formatCurrency(row.price) },
            { key: "subtotal", label: "Subtotal", render: (row) => formatCurrency(row.subtotal) },
          ]}
          data={sale.items.map((item) => ({ ...item, id: item.productId }))}
        />
      </Card>
      <Card className="p-5">
        <h2 className="font-semibold text-slate-950">Totals</h2>
        <div className="mt-4 max-w-md space-y-2 text-sm">
          <Line label="Subtotal" value={formatCurrency(sale.subtotal)} />
          <Line label="Discount" value={`-${formatCurrency(sale.discount)}`} />
          <Line label="Tax/VAT" value={formatCurrency(sale.tax)} />
          <Line label="Total" value={formatCurrency(sale.total)} strong />
        </div>
      </Card>
    </div>
  )
}

function Line({ label, value, strong }) {
  return <div className={`flex justify-between ${strong ? "border-t border-slate-200 pt-3 font-bold text-slate-950" : "text-slate-600"}`}><span>{label}</span><span>{value}</span></div>
}
