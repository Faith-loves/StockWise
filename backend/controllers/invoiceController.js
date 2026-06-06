const Invoice = require("../models/Invoice")
const Sale = require("../models/Sale")
const asyncHandler = require("../utils/asyncHandler")
const { getInvoiceStatus, getPaymentStatus } = require("../utils/invoice")

async function refreshInvoice(invoice) {
  invoice.status = getInvoiceStatus(invoice)
  await invoice.save()
  return invoice
}

const getInvoices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, sort = "newest" } = req.query
  const filter = { userId: req.user._id }
  if (status) filter.status = status
  const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, amount: { total: -1 } }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Invoice.find(filter).populate("customerId", "name email phone address").sort(sortMap[sort] || sortMap.newest).skip(skip).limit(Number(limit)),
    Invoice.countDocuments(filter),
  ])
  const refreshed = await Promise.all(items.map(refreshInvoice))
  res.json({ items: refreshed, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
})

const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({
    userId: req.user._id,
    $or: [{ _id: req.params.id }, { invoiceNumber: req.params.id }],
  }).populate("customerId", "name email phone address")
  if (!invoice) {
    res.status(404)
    throw new Error("Invoice not found")
  }
  res.json(await refreshInvoice(invoice))
})

const markInvoicePaid = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({ userId: req.user._id, $or: [{ _id: req.params.id }, { invoiceNumber: req.params.id }] })
  if (!invoice) {
    res.status(404)
    throw new Error("Invoice not found")
  }
  invoice.amountPaid = invoice.total
  invoice.balance = 0
  invoice.status = "Paid"
  await invoice.save()
  await Sale.findOneAndUpdate({ _id: invoice.saleId, userId: req.user._id }, { amountPaid: invoice.total, balance: 0, paymentStatus: "Paid" })
  res.json(invoice)
})

const updateInvoicePayment = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({ userId: req.user._id, $or: [{ _id: req.params.id }, { invoiceNumber: req.params.id }] })
  if (!invoice) {
    res.status(404)
    throw new Error("Invoice not found")
  }
  invoice.amountPaid = Math.min(req.body.amountPaid, invoice.total)
  invoice.balance = Math.max(0, invoice.total - invoice.amountPaid)
  invoice.status = getPaymentStatus(invoice.total, invoice.amountPaid)
  await invoice.save()
  await Sale.findOneAndUpdate({ _id: invoice.saleId, userId: req.user._id }, {
    amountPaid: invoice.amountPaid,
    balance: invoice.balance,
    paymentStatus: invoice.status,
  })
  res.json(invoice)
})

const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOneAndDelete({ userId: req.user._id, $or: [{ _id: req.params.id }, { invoiceNumber: req.params.id }] })
  if (!invoice) {
    res.status(404)
    throw new Error("Invoice not found")
  }
  res.json({ message: "Invoice deleted" })
})

module.exports = { getInvoices, getInvoice, markInvoicePaid, updateInvoicePayment, deleteInvoice }
