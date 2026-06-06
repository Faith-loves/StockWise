import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Badge, Card, CardHeader, StatCard, Table } from "../components"
import { dashboardStats, lowStockProducts, recentSales, revenueData, topSellingProducts, unpaidInvoices } from "../constants/sampleData"
import { formatCurrency } from "../utils/formatters"

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Today’s view of your inventory, sales, invoices, expenses, and profit.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total products" value={dashboardStats.totalProducts} change="+8 this month" icon="box" />
        <StatCard label="Total sales" value={dashboardStats.totalSales} change="+24 this week" icon="wallet" tone="blue" />
        <StatCard label="Total revenue" value={formatCurrency(dashboardStats.totalRevenue)} change="+18% this month" icon="chart" />
        <StatCard label="Total profit" value={formatCurrency(dashboardStats.totalProfit)} change="+12% this month" icon="chart" tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <CardHeader title="Revenue chart" description="Revenue and profit performance for the last six months." />
          <div className="h-80 p-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#047857" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(value) => `₦${value / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="revenue" stroke="#047857" fill="url(#revenue)" strokeWidth={3} />
                <Area type="monotone" dataKey="profit" stroke="#2563eb" fill="transparent" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Inventory value</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{formatCurrency(dashboardStats.inventoryValue)}</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-800">Healthy stock coverage</p>
              <p className="mt-1 text-sm text-emerald-700">82% of products are above threshold.</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">Low-stock products</p>
              <p className="mt-1 text-sm text-amber-700">{lowStockProducts.length} products need attention.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Low-stock products" />
          <div className="divide-y divide-slate-100">
            {lowStockProducts.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-semibold text-slate-950">{item.name}</p>
                  <p className="text-sm text-slate-500">Threshold: {item.threshold}</p>
                </div>
                <Badge variant="warning">{item.quantity} left</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Unpaid invoices" />
          <div className="divide-y divide-slate-100">
            {unpaidInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-semibold text-slate-950">{invoice.id}</p>
                  <p className="text-sm text-slate-500">{invoice.customer} · Due {invoice.due}</p>
                </div>
                <span className="font-bold text-slate-950">{formatCurrency(invoice.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader title="Recent sales" />
          <Table
            columns={[
              { key: "customer", label: "Customer" },
              { key: "item", label: "Item" },
              { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
              { key: "status", label: "Status", render: (row) => <Badge variant={row.status === "Paid" ? "success" : "warning"}>{row.status}</Badge> },
              { key: "date", label: "Date" },
            ]}
            data={recentSales}
          />
        </Card>
        <Card>
          <CardHeader title="Top-selling products" />
          <div className="divide-y divide-slate-100">
            {topSellingProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-semibold text-slate-950">{product.name}</p>
                  <p className="text-sm text-slate-500">{product.sold} units sold</p>
                </div>
                <span className="font-bold text-slate-950">{formatCurrency(product.revenue)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
