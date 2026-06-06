import { NavLink } from "react-router-dom"
import { sidebarLinks } from "../constants/navigation"
import { Icon } from "../components"

export function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/30 lg:hidden ${open ? "block" : "hidden"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col border-r border-slate-200 bg-white transition lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : ""
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-700 font-bold text-white">S</div>
          <div>
            <p className="text-lg font-bold text-slate-950">StockWise</p>
            <p className="text-xs font-medium text-slate-500">Inventory control</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
            >
              <Icon name={link.icon} className="h-5 w-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">Local demo mode</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Products and customers are saved in this browser.</p>
          </div>
        </div>
      </aside>
    </>
  )
}
