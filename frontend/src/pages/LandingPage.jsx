import { Link } from "react-router-dom"
import { Button, Icon } from "../components"

const features = [
  ["Inventory", "Track quantities, stock value, low-stock products, and supplier details."],
  ["Sales", "Record sales, monitor revenue, and see top-selling products."],
  ["Invoices", "Create invoices and follow unpaid customer balances."],
  ["Customers", "Keep purchase history, contact details, notes, and amount owed together."],
  ["Expenses", "Log business costs so profit is clear, not guessed."],
  ["Reports", "Understand sales, inventory value, expenses, and profit trends."],
]

export function LandingPage() {
  function openDemo() {
    localStorage.setItem("stockwise_session", "active")
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-700 font-bold text-white">S</div>
          <span className="text-xl font-bold text-slate-950">StockWise</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link className="text-sm font-semibold text-slate-600 hover:text-slate-950" to="/login">Login</Link>
          <Link to="/signup"><Button size="sm">Get started</Button></Link>
        </nav>
      </header>

      <main>
        <section className="hero-grid border-y border-slate-100">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-24">
            <div>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                Manage inventory, sales, invoices, customers, expenses, and profit in one calm workspace.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                StockWise helps small businesses keep stock accurate, sell with confidence, track what customers owe, and understand profit without messy spreadsheets.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/signup"><Button size="lg">Create free account <Icon name="arrowRight" /></Button></Link>
                <Link to="/dashboard" onClick={openDemo}><Button variant="secondary" size="lg">View demo dashboard</Button></Link>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xl shadow-emerald-900/10">
              <div className="grid gap-4 sm:grid-cols-2">
                {["Total Revenue", "Inventory Value", "Low Stock", "Unpaid Invoices"].map((item, index) => (
                  <div key={item} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">{item}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-950">{["₦894K", "₦1.26M", "12", "₦81K"][index]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-slate-100 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-semibold text-slate-950">Recent sales</p>
                  <span className="text-sm font-semibold text-emerald-700">Today</span>
                </div>
                {["Rice 25kg", "Vegetable Oil", "Noodles Carton"].map((sale, index) => (
                  <div key={sale} className="flex items-center justify-between border-t border-slate-100 py-3 first:border-t-0">
                    <span className="text-sm font-medium text-slate-700">{sale}</span>
                    <span className="text-sm font-bold text-slate-950">{["₦78,000", "₦42,500", "₦66,000"][index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-950">Everything a growing shop needs to stay organized.</h2>
            <p className="mt-3 text-slate-600">Start with simple records now, then connect the backend when the full system is ready.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, description]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon name="box" />
                </div>
                <h3 className="font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
