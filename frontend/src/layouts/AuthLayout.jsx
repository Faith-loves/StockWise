import { Link, Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_0.85fr]">
      <div className="hidden bg-emerald-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white font-bold text-emerald-800">S</div>
          <span className="text-xl font-bold">StockWise</span>
        </Link>
        <div>
          <h1 className="max-w-lg text-4xl font-bold leading-tight">Know your stock, sales, expenses, and profit without guesswork.</h1>
          <p className="mt-4 max-w-md text-emerald-50">Built for small businesses that need clear inventory records, customer balances, and invoice control.</p>
        </div>
        <p className="text-sm text-emerald-100">StockWise business workspace</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="text-2xl font-bold text-emerald-800">StockWise</Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
