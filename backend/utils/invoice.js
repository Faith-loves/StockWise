const Sale = require("../models/Sale")

function getPaymentStatus(total, amountPaid) {
  if (amountPaid >= total) return "Paid"
  if (amountPaid > 0) return "Partial"
  return "Unpaid"
}

async function generateInvoiceNumber(user, userId) {
  const count = await Sale.countDocuments({ userId })
  return `${user.invoicePrefix || "INV"}-${String(count + 1).padStart(4, "0")}`
}

function getInvoiceStatus(invoice) {
  if (invoice.balance <= 0) return "Paid"
  if (invoice.dueDate && new Date(invoice.dueDate) < new Date(new Date().toDateString())) return "Overdue"
  return invoice.amountPaid > 0 ? "Partial" : "Unpaid"
}

module.exports = { getPaymentStatus, generateInvoiceNumber, getInvoiceStatus }
