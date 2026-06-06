const Product = require("../models/Product")
const StockMovement = require("../models/StockMovement")
const asyncHandler = require("../utils/asyncHandler")
const logActivity = require("../utils/activity")

const createProduct = asyncHandler(async (req, res) => {
  const duplicate = await Product.findOne({ userId: req.user._id, sku: req.body.sku })
  if (duplicate) {
    res.status(409)
    throw new Error("Product SKU already exists")
  }

  const product = await Product.create({ ...req.body, userId: req.user._id })
  await StockMovement.create({
    userId: req.user._id,
    productId: product._id,
    type: "added",
    quantity: product.quantity,
    previousQuantity: 0,
    newQuantity: product.quantity,
    reason: "Product created",
    referenceId: product._id,
  })
  await logActivity(req.user._id, "created", `Created product ${product.name}`, "Product", product._id)
  res.status(201).json(product)
})

const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "", category, stockStatus, sort = "newest" } = req.query
  const filter = { userId: req.user._id, isActive: true }
  if (category) filter.category = category
  if (search) filter.$or = [
    { name: new RegExp(search, "i") },
    { sku: new RegExp(search, "i") },
    { category: new RegExp(search, "i") },
  ]
  if (stockStatus === "low") filter.$expr = { $lte: ["$quantity", "$lowStockThreshold"] }
  if (stockStatus === "out") filter.quantity = 0

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    name: { name: 1 },
    amount: { sellingPrice: -1 },
    stockQuantity: { quantity: -1 },
    quantity: { quantity: -1 },
  }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortMap[sort] || sortMap.newest).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ])
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
})

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, userId: req.user._id })
  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }
  const movements = await StockMovement.find({ productId: product._id, userId: req.user._id }).sort({ createdAt: -1 })
  res.json({ product, movements })
})

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true, runValidators: true })
  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }
  await logActivity(req.user._id, "updated", `Updated product ${product.name}`, "Product", product._id)
  res.json(product)
})

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { isActive: false }, { new: true })
  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }
  await logActivity(req.user._id, "deleted", `Deleted product ${product.name}`, "Product", product._id)
  res.json({ message: "Product deleted" })
})

const adjustStock = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, userId: req.user._id })
  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  const previousQuantity = product.quantity
  const qty = Number(req.body.quantity)
  let newQuantity = previousQuantity
  if (req.body.type === "increase" || req.body.type === "returned") newQuantity += qty
  if (req.body.type === "reduce" || req.body.type === "damaged") newQuantity -= qty
  if (req.body.type === "correction") newQuantity = qty
  if (newQuantity < 0) {
    res.status(400)
    throw new Error("Stock cannot go below zero")
  }

  product.quantity = newQuantity
  await product.save()
  await StockMovement.create({
    userId: req.user._id,
    productId: product._id,
    type: req.body.type,
    quantity: qty,
    previousQuantity,
    newQuantity,
    reason: req.body.reason,
    referenceId: product._id,
  })
  await logActivity(req.user._id, "stock_adjusted", `Adjusted stock for ${product.name}`, "Product", product._id)
  res.json(product)
})

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct, adjustStock }
