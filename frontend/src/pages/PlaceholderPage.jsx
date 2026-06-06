import { Card, CardHeader, EmptyState } from "../components"

const copy = {
  sales: ["Sales", "Record and review sales transactions.", "Sale tools will connect products, customers, invoice status, and payment records."],
  createSale: ["Create sale", "Build a new sale transaction.", "This screen is ready for product selection, customer selection, quantities, discounts, and payments."],
  saleDetails: ["Sale details", "Review sale items and payment information.", "Detailed sale records will appear here once sales data is connected."],
  invoices: ["Invoices", "Track invoices and customer balances.", "Invoice creation, payment tracking, and PDF download will live here."],
  invoiceDetails: ["Invoice details", "Review invoice items, payments, and balance.", "This page is prepared for jsPDF invoice generation."],
  expenses: ["Expenses", "Record business spending.", "Expense tracking will help StockWise calculate profit more accurately."],
  reports: ["Reports", "Understand business performance.", "Sales, inventory value, expense, and profit reports will appear here."],
  settings: ["Settings", "Manage business and account settings.", "Profile, tax, invoice, and notification settings will appear here."],
}

export function PlaceholderPage({ type }) {
  const [title, description, empty] = copy[type] || ["Page", "Coming soon.", "This area is ready for the next build step."]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <Card>
        <CardHeader title={title} />
        <div className="p-5">
          <EmptyState title={`${title} module`} description={empty} />
        </div>
      </Card>
    </div>
  )
}
