const Product = require("../models/Product")
const Customer = require("../models/Customer")
const Sale = require("../models/Sale")
const Invoice = require("../models/Invoice")
const StockMovement = require("../models/StockMovement")
const asyncHandler = require("../utils/asyncHandler")
const logActivity = require("../utils/activity")
const { generateInvoiceNumber, getPaymentStatus } = require("../utils/invoice")

const createSale = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.body.customerId, userId: req.user._id })
  if (!customer) {
    res.status(404)
    throw new Error("Customer not found")
  }

  const productIds = req.body.items.map((item) => item.productId)
  const products = await Product.find({ _id: { $in: productIds }, userId: req.user._id, isActive: true })
  const productMap = new Map(products.map((product) => [product._id.toString(), product]))

  const items = req.body.items.map((item) => {
    const product = productMap.get(item.productId)
    if (!product) {
      res.status(404)
      throw new Error("Product not found")
    }
    if (product.quantity < item.quantity) {
      res.status(400)
      throw new Error(`${product.name} does not have enough stock`)
    }
    return {
      productId: product._id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.sellingPrice,
      costPrice: product.costPrice,
      subtotal: item.quantity * product.sellingPrice,
    }
  })

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const discount = Number(req.body.discount || 0)
  const tax = Number(req.body.tax || 0)
  const total = Math.max(0, subtotal - discount + tax)
  const amountPaid = Math.min(Number(req.body.amountPaid || 0), total)
  const balance = Math.max(0, total - amountPaid)
  const paymentStatus = getPaymentStatus(total, amountPaid)
  const invoiceNumber = await generateInvoiceNumber(req.user, req.user._id)
  const saleDate = req.body.saleDate || new Date()
  const dueDate = req.body.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const sale = await Sale.create({
    userId: req.user._id,
    customerId: customer._id,
    invoiceNumber,
    items,
    subtotal,
    discount,
    tax,
    total,
    amountPaid,
    balance,
    paymentStatus,
    paymentMethod: req.body.paymentMethod,
    saleDate,
  })

  for (const item of items) {
    const product = productMap.get(item.productId.toString())
    const previousQuantity = product.quantity
    product.quantity -= item.quantity
    await product.save()
    await StockMovement.create({
      userId: req.user._id,
      productId: product._id,
      type: "sold",
      quantity: item.quantity,
      previousQuantity,
      newQuantity: product.quantity,
      reason: `Sale ${invoiceNumber}`,
      referenceId: sale._id,
    })
  }

  const invoice = await Invoice.create({
    userId: req.user._id,
    customerId: customer._id,
    saleId: sale._id,
    invoiceNumber,
    items,
    subtotal,
    discount,
    tax,
    total,
    amountPaid,
    balance,
    status: paymentStatus,
    dueDate,
    issuedDate: saleDate,
  })

  await logActivity(req.user._id, "created", `Created sale ${invoiceNumber}`, "Sale", sale._id)
  res.status(201).json({ sale, invoice })
})

const getSales = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sort = "newest", paymentStatus } = req.query
  const filter = { userId: req.user._id }
  if (paymentStatus) filter.paymentStatus = paymentStatus
  const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, amount: { total: -1 } }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Sale.find(filter).populate("customerId", "name email phone address").sort(sortMap[sort] || sortMap.newest).skip(skip).limit(Number(limit)),
    Sale.countDocuments(filter),
  ])
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
})

const getSale = asyncHandler(async (req, res) => {
  const sale = await Sale.findOne({ _id: req.params.id, userId: req.user._id }).populate("customerId", "name email phone address")
  if (!sale) {
    res.status(404)
    throw new Error("Sale not found")
  }
  res.json(sale)
})

const updateSalePayment = asyncHandler(async (req, res) => {
  const sale = await Sale.findOne({ _id: req.params.id, userId: req.user._id })
  if (!sale) {
    res.status(404)
    throw new Error("Sale not found")
  }
  sale.amountPaid = Math.min(req.body.amountPaid, sale.total)
  sale.balance = Math.max(0, sale.total - sale.amountPaid)
  sale.paymentStatus = getPaymentStatus(sale.total, sale.amountPaid)
  if (req.body.paymentMethod) sale.paymentMethod = req.body.paymentMethod
  await sale.save()
  await Invoice.findOneAndUpdate({ saleId: sale._id, userId: req.user._id }, {
    amountPaid: sale.amountPaid,
    balance: sale.balance,
    status: sale.paymentStatus,
  })
  res.json(sale)
})

const deleteSale = asyncHandler(async (req, res) => {
  const sale = await Sale.findOne({ _id: req.params.id, userId: req.user._id })
  if (!sale) {
    res.status(404)
    throw new Error("Sale not found")
  }

  for (const item of sale.items) {
    const product = await Product.findOne({ _id: item.productId, userId: req.user._id })
    if (product) {
      const previousQuantity = product.quantity
      product.quantity += item.quantity
      await product.save()
      await StockMovement.create({
        userId: req.user._id,
        productId: product._id,
        type: "returned",
        quantity: item.quantity,
        previousQuantity,
        newQuantity: product.quantity,
        reason: `Deleted sale ${sale.invoiceNumber}`,
        referenceId: sale._id,
      })
    }
  }

  await Invoice.deleteOne({ saleId: sale._id, userId: req.user._id })
  await sale.deleteOne()
  await logActivity(req.user._id, "deleted", `Deleted sale ${sale.invoiceNumber}`, "Sale", sale._id)
  res.json({ message: "Sale deleted and stock restored" })
})

module.exports = { createSale, getSales, getSale, updateSalePayment, deleteSale }
