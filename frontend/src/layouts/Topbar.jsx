import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Icon, SearchBar } from "../components"
import { logout } from "../services/authService"

export function Topbar({ onMenu }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)

  function goToSettings() {
    setProfileOpen(false)
    navigate("/settings")
  }

  function handleLogout() {
    logout()
    setProfileOpen(false)
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-6">
      <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Icon name="menu" />
      </button>
      <div className="hidden flex-1 sm:block">
        <SearchBar value={query} onChange={setQuery} placeholder="Search products, sales, invoices..." />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button className="relative rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50" aria-label="Notifications">
          <Icon name="bell" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 hover:bg-slate-50"
            onClick={() => setProfileOpen((value) => !value)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-800">AD</div>
            <span className="hidden text-sm font-semibold text-slate-700 md:block">Admin</span>
            <Icon name="chevronDown" className="h-4 w-4 text-slate-500" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              <button className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50" onClick={goToSettings}>
                Profile
              </button>
              <button className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50" onClick={goToSettings}>
                Account settings
              </button>
              <button className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
