export function getInvoiceStatus(invoice) {
  if (invoice.status === "Paid") return "Paid"
  if (invoice.dueDate && new Date(invoice.dueDate) < new Date(new Date().toDateString())) return "Overdue"
  return invoice.status || "Unpaid"
}

export function invoiceStatusVariant(status) {
  if (status === "Paid") return "success"
  if (status === "Partial") return "warning"
  if (status === "Overdue") return "danger"
  return "neutral"
}

export function createInvoiceNumber(prefix = "INV", count = 1) {
  return `${prefix}-${String(count).padStart(4, "0")}`
}

export function sumBy(items, selector) {
  return items.reduce((total, item) => total + Number(selector(item) || 0), 0)
}

export function groupByAmount(items, key, amountKey = "amount") {
  return Object.values(
    items.reduce((groups, item) => {
      const name = item[key] || "Other"
      groups[name] ||= { name, amount: 0 }
      groups[name].amount += Number(item[amountKey] || 0)
      return groups
    }, {}),
  )
}
