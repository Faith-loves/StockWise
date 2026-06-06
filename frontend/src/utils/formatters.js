export function formatCurrency(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

export function formatDate(value) {
  if (!value) return "Not recorded"
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

export function getStockStatus(product) {
  const quantity = Number(product.quantity || 0)
  const threshold = Number(product.lowStockThreshold || 0)
  if (quantity <= 0) return { label: "Out of stock", variant: "danger" }
  if (quantity <= threshold) return { label: "Low stock", variant: "warning" }
  return { label: "In stock", variant: "success" }
}

export function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
