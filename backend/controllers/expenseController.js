const Expense = require("../models/Expense")
const asyncHandler = require("../utils/asyncHandler")
const logActivity = require("../utils/activity")

const createExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.create({ ...req.body, userId: req.user._id })
  await logActivity(req.user._id, "created", `Created expense ${expense.title}`, "Expense", expense._id)
  res.status(201).json(expense)
})

const getExpenses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, sort = "newest" } = req.query
  const filter = { userId: req.user._id }
  if (category) filter.category = category
  const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, amount: { amount: -1 }, name: { title: 1 } }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Expense.find(filter).sort(sortMap[sort] || sortMap.newest).skip(skip).limit(Number(limit)),
    Expense.countDocuments(filter),
  ])
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
})

const getExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id })
  if (!expense) {
    res.status(404)
    throw new Error("Expense not found")
  }
  res.json(expense)
})

const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true, runValidators: true })
  if (!expense) {
    res.status(404)
    throw new Error("Expense not found")
  }
  await logActivity(req.user._id, "updated", `Updated expense ${expense.title}`, "Expense", expense._id)
  res.json(expense)
})

const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
  if (!expense) {
    res.status(404)
    throw new Error("Expense not found")
  }
  await logActivity(req.user._id, "deleted", `Deleted expense ${expense.title}`, "Expense", expense._id)
  res.json({ message: "Expense deleted" })
})

module.exports = { createExpense, getExpenses, getExpense, updateExpense, deleteExpense }
