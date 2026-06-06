import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Card, CardHeader, Input, Select, Textarea, toast } from "../components"
import { defaultSettings } from "../constants/sampleData"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { logout as logoutSession, updateProfile } from "../services/authService"

export function SettingsPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useLocalStorageState("stockwise_settings", defaultSettings)
  const [form, setForm] = useState(settings)

  function update(field, value) {
    setForm({ ...form, [field]: value })
  }

  function saveSettings(event) {
    event.preventDefault()
    setSettings({ ...form, taxRate: Number(form.taxRate || 0) })
    updateProfile({ ...form, taxRate: Number(form.taxRate || 0) }).catch(() => {})
    toast.success("Settings saved")
  }

  function logout() {
    logoutSession()
    toast.success("Logged out")
    navigate("/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Manage profile, business identity, tax, currency, and invoice defaults.</p>
        </div>
        <Button variant="danger" onClick={logout}>Logout</Button>
      </div>
      <form className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]" onSubmit={saveSettings}>
        <Card>
          <CardHeader title="Profile settings" />
          <div className="space-y-4 p-5">
            <Input label="Full name" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} />
            <Input label="Email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
            <Input label="Phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Business settings" />
          <div className="grid gap-4 p-5 md:grid-cols-2">
            <Input label="Business name" value={form.businessName} onChange={(event) => update("businessName", event.target.value)} />
            <Input label="Business logo" value={form.businessLogo} onChange={(event) => update("businessLogo", event.target.value)} placeholder="Logo URL for now" />
            <Input label="Business phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
            <Input label="Business email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
            <Select label="Currency" value={form.currency} onChange={(event) => update("currency", event.target.value)}>
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="USD">USD - US Dollar</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="EUR">EUR - Euro</option>
            </Select>
            <Input label="Tax rate (%)" type="number" value={form.taxRate} onChange={(event) => update("taxRate", event.target.value)} />
            <Input label="Invoice prefix" value={form.invoicePrefix} onChange={(event) => update("invoicePrefix", event.target.value)} />
            <div className="md:col-span-2">
              <Textarea label="Business address" value={form.address} onChange={(event) => update("address", event.target.value)} />
            </div>
            <div className="flex justify-end md:col-span-2">
              <Button type="submit">Save settings</Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  )
}
