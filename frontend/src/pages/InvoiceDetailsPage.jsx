import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useParams } from "react-router-dom"
import { Badge, Button, Card, Table, toast } from "../components"
import { defaultSettings, seedInvoices } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { getInvoiceStatus, invoiceStatusVariant } from "../utils/business"
import { formatCurrency } from "../utils/formatters"

export function InvoiceDetailsPage() {
  const { id } = useParams()
  const [invoices, setInvoices] = useLocalStorageState("stockwise_invoices", seedInvoices)
  const [settings] = useLocalStorageState("stockwise_settings", defaultSettings)
  const invoice = invoices.find((item) => item.invoiceNumber === id || item.id === id)

  if (!invoice) return <Card className="p-6">Invoice not found.</Card>

  const status = getInvoiceStatus(invoice)

  function downloadPdf() {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text(settings.businessName || "StockWise", 14, 18)
    doc.setFontSize(11)
    doc.text(settings.address || "", 14, 26)
    doc.text(settings.email || "", 14, 32)
    doc.setFontSize(16)
    doc.text(`Invoice ${invoice.invoiceNumber}`, 140, 18)
    doc.setFontSize(10)
    doc.text(`Date: ${invoice.date}`, 140, 26)
    doc.text(`Due: ${invoice.dueDate}`, 140, 32)
    doc.text(`Bill to: ${invoice.customerName}`, 14, 48)
    doc.text(invoice.customerEmail || "", 14, 54)
    autoTable(doc, {
      startY: 66,
      head: [["Product", "Qty", "Price", "Subtotal"]],
      body: invoice.items.map((item) => [item.name, item.quantity, formatCurrency(item.price), formatCurrency(item.subtotal)]),
    })
    const y = doc.lastAutoTable.finalY + 12
    doc.text(`Subtotal: ${formatCurrency(invoice.subtotal)}`, 140, y)
    doc.text(`Discount: ${formatCurrency(invoice.discount)}`, 140, y + 6)
    doc.text(`Tax/VAT: ${formatCurrency(invoice.tax)}`, 140, y + 12)
    doc.setFontSize(13)
    doc.text(`Total: ${formatCurrency(invoice.amount)}`, 140, y + 22)
    doc.save(`${invoice.invoiceNumber}.pdf`)
    toast.success("PDF invoice downloaded")
  }

  function markPaid() {
    setInvoices(invoices.map((item) => item.invoiceNumber === invoice.invoiceNumber ? { ...item, status: "Paid" } : item))
    toast.success("Invoice marked as paid")
  }

  function sendInvoice() {
    toast.success("Send invoice placeholder ready")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Invoice {invoice.invoiceNumber}</h1>
          <p className="mt-1 text-sm text-slate-500">Professional printable invoice details.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={downloadPdf}>Download PDF invoice</Button>
          <Button variant="secondary" onClick={sendInvoice}>Send invoice</Button>
          <Button onClick={markPaid}>Mark invoice as paid</Button>
        </div>
      </div>

      <Card className="p-6 print:border-0 print:shadow-none">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-700 text-lg font-bold text-white">S</div>
              <div>
                <h2 className="text-xl font-bold text-slate-950">{settings.businessName}</h2>
                <p className="text-sm text-slate-500">{settings.address}</p>
              </div>
            </div>
            <div className="mt-8 text-sm text-slate-600">
              <p className="font-semibold text-slate-950">Bill to</p>
              <p>{invoice.customerName}</p>
              <p>{invoice.customerEmail}</p>
              <p>{invoice.customerPhone}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl font-bold text-slate-950">Invoice</p>
            <p className="mt-2 font-semibold text-slate-700">{invoice.invoiceNumber}</p>
            <p className="mt-4 text-sm text-slate-500">Date: {invoice.date}</p>
            <p className="text-sm text-slate-500">Due: {invoice.dueDate}</p>
            <div className="mt-4"><Badge variant={invoiceStatusVariant(status)}>{status}</Badge></div>
          </div>
        </div>

        <div className="mt-8">
          <Table
            columns={[
              { key: "name", label: "Product" },
              { key: "quantity", label: "Qty" },
              { key: "price", label: "Price", render: (row) => formatCurrency(row.price) },
              { key: "subtotal", label: "Subtotal", render: (row) => formatCurrency(row.subtotal) },
            ]}
            data={invoice.items.map((item) => ({ ...item, id: item.productId }))}
          />
        </div>

        <div className="ml-auto mt-8 max-w-sm space-y-3 text-sm">
          <Line label="Subtotal" value={formatCurrency(invoice.subtotal)} />
          <Line label="Discount" value={`-${formatCurrency(invoice.discount)}`} />
          <Line label="Tax/VAT" value={formatCurrency(invoice.tax)} />
          <Line label="Total" value={formatCurrency(invoice.amount)} strong />
        </div>
      </Card>
    </div>
  )
}

function Line({ label, value, strong }) {
  return <div className={`flex justify-between ${strong ? "border-t border-slate-200 pt-3 text-lg font-bold text-slate-950" : "text-slate-600"}`}><span>{label}</span><span>{value}</span></div>
}
