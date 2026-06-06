import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Badge, Card, CardHeader, StatCard } from "../components"
import { seedExpenses, seedInvoices, seedProducts, seedSales } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { getInvoiceStatus, groupByAmount, sumBy } from "../utils/business"
import { formatCurrency, getStockStatus } from "../utils/formatters"

const colors = ["#047857", "#2563eb", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2", "#475569"]

export function ReportsPage() {
  const [sales] = useLocalStorageState("stockwise_sales", seedSales)
  const [expenses] = useLocalStorageState("stockwise_expenses", seedExpenses)
  const [products] = useLocalStorageState("stockwise_products", seedProducts)
  const [invoices] = useLocalStorageState("stockwise_invoices", seedInvoices)

  const totalSales = sumBy(sales, (sale) => sale.total)
  const totalExpenses = sumBy(expenses, (expense) => expense.amount)
  const inventoryValue = sumBy(products, (product) => Number(product.costPrice) * Number(product.quantity))
  const profit = totalSales - totalExpenses
  const revenueByMonth = monthData(sales, "total")
  const profitByMonth = revenueByMonth.map((item) => ({ ...item, profit: item.revenue * 0.28 }))
  const expensesByCategory = groupByAmount(expenses, "category")
  const salesByCategory = Object.values(sales.flatMap((sale) => sale.items).reduce((groups, item) => {
    const product = products.find((candidate) => candidate.id === item.productId)
    const name = product?.category || "Other"
    groups[name] ||= { name, amount: 0 }
    groups[name].amount += item.subtotal
    return groups
  }, {}))
  const topSelling = Object.values(sales.flatMap((sale) => sale.items).reduce((groups, item) => {
    groups[item.name] ||= { name: item.name, sold: 0, revenue: 0 }
    groups[item.name].sold += Number(item.quantity)
    groups[item.name].revenue += Number(item.subtotal)
    return groups
  }, {})).sort((a, b) => b.sold - a.sold).slice(0, 5)
  const lowStock = products.filter((product) => getStockStatus(product).label !== "In stock")
  const unpaid = invoices.filter((invoice) => getInvoiceStatus(invoice) !== "Paid")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Sales, profit, expenses, inventory value, stock risks, and unpaid invoices.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sales summary" value={formatCurrency(totalSales)} icon="wallet" />
        <StatCard label="Profit summary" value={formatCurrency(profit)} icon="chart" tone="blue" />
        <StatCard label="Expense summary" value={formatCurrency(totalExpenses)} icon="wallet" tone="amber" />
        <StatCard label="Inventory value" value={formatCurrency(inventoryValue)} icon="box" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Revenue by month">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₦${value / 1000}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="revenue" fill="#047857" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Profit by month">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={profitByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₦${value / 1000}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="profit" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Sales by category">
          <PieBlock data={salesByCategory} />
        </ChartCard>
        <ChartCard title="Expenses by category">
          <PieBlock data={expensesByCategory} />
        </ChartCard>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="Top-selling products" />
          <List items={topSelling.map((item) => [item.name, `${item.sold} sold · ${formatCurrency(item.revenue)}`])} />
        </Card>
        <Card>
          <CardHeader title="Low-stock products" />
          <List items={lowStock.map((item) => [item.name, `${item.quantity} left`])} />
        </Card>
        <Card>
          <CardHeader title="Unpaid invoices" />
          <div className="divide-y divide-slate-100">
            {unpaid.map((invoice) => {
              const status = getInvoiceStatus(invoice)
              return (
                <div key={invoice.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-semibold text-slate-950">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-slate-500">{invoice.customerName} · {formatCurrency(invoice.amount)}</p>
                  </div>
                  <Badge variant={status === "Overdue" ? "danger" : "warning"}>{status}</Badge>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

function monthData(records, amountKey) {
  return Object.values(records.reduce((groups, record) => {
    const month = new Date(record.date).toLocaleString("en", { month: "short" })
    groups[month] ||= { month, revenue: 0 }
    groups[month].revenue += Number(record[amountKey] || 0)
    return groups
  }, {}))
}

function ChartCard({ title, children }) {
  return <Card><CardHeader title={title} /><div className="p-5">{children}</div></Card>
}

function PieBlock({ data }) {
  const safeData = data.length ? data : [{ name: "No data", amount: 1 }]
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={safeData} dataKey="amount" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
          {safeData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value)} />
      </PieChart>
    </ResponsiveContainer>
  )
}

function List({ items }) {
  return (
    <div className="divide-y divide-slate-100">
      {items.length ? items.map(([title, meta]) => (
        <div key={title} className="px-5 py-4">
          <p className="font-semibold text-slate-950">{title}</p>
          <p className="text-sm text-slate-500">{meta}</p>
        </div>
      )) : <p className="p-5 text-sm text-slate-500">No data yet.</p>}
    </div>
  )
}
