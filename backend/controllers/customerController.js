const Customer = require("../models/Customer")
const asyncHandler = require("../utils/asyncHandler")
const logActivity = require("../utils/activity")

const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create({ ...req.body, userId: req.user._id })
  await logActivity(req.user._id, "created", `Created customer ${customer.name}`, "Customer", customer._id)
  res.status(201).json(customer)
})

const getCustomers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "", sort = "newest" } = req.query
  const filter = { userId: req.user._id }
  if (search) filter.$or = [
    { name: new RegExp(search, "i") },
    { email: new RegExp(search, "i") },
    { phone: new RegExp(search, "i") },
  ]
  const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, name: { name: 1 } }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Customer.find(filter).sort(sortMap[sort] || sortMap.newest).skip(skip).limit(Number(limit)),
    Customer.countDocuments(filter),
  ])
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
})

const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, userId: req.user._id })
  if (!customer) {
    res.status(404)
    throw new Error("Customer not found")
  }
  res.json(customer)
})

const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true, runValidators: true })
  if (!customer) {
    res.status(404)
    throw new Error("Customer not found")
  }
  await logActivity(req.user._id, "updated", `Updated customer ${customer.name}`, "Customer", customer._id)
  res.json(customer)
})

const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
  if (!customer) {
    res.status(404)
    throw new Error("Customer not found")
  }
  await logActivity(req.user._id, "deleted", `Deleted customer ${customer.name}`, "Customer", customer._id)
  res.json({ message: "Customer deleted" })
})

module.exports = { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer }
