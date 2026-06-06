const Product = require("../models/Product")
const Sale = require("../models/Sale")
const Invoice = require("../models/Invoice")
const Expense = require("../models/Expense")
const asyncHandler = require("../utils/asyncHandler")
const { getInvoiceStatus } = require("../utils/invoice")

const getReports = asyncHandler(async (req, res) => {
  const [products, sales, invoices, expenses] = await Promise.all([
    Product.find({ userId: req.user._id, isActive: true }),
    Sale.find({ userId: req.user._id }),
    Invoice.find({ userId: req.user._id }),
    Expense.find({ userId: req.user._id }),
  ])

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
  const costOfGoods = sales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.costPrice * item.quantity, 0), 0)
  const totalProfit = totalRevenue - costOfGoods
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const netProfit = totalProfit - totalExpenses
  const inventoryValue = products.reduce((sum, product) => sum + product.costPrice * product.quantity, 0)
  const lowStockProducts = products.filter((product) => product.quantity <= product.lowStockThreshold)
  const unpaidInvoices = invoices.filter((invoice) => getInvoiceStatus(invoice) !== "Paid")

  const topSellingMap = {}
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      topSellingMap[item.productName] ||= { name: item.productName, quantity: 0, revenue: 0 }
      topSellingMap[item.productName].quantity += item.quantity
      topSellingMap[item.productName].revenue += item.subtotal
    })
  })

  const salesByMonth = groupByMonth(sales, "total", "revenue")
  const expensesByCategory = Object.values(expenses.reduce((groups, expense) => {
    groups[expense.category] ||= { name: expense.category, amount: 0 }
    groups[expense.category].amount += expense.amount
    return groups
  }, {}))

  res.json({
    totalRevenue,
    totalProfit,
    totalExpenses,
    netProfit,
    inventoryValue,
    lowStockProducts,
    unpaidInvoices,
    topSellingProducts: Object.values(topSellingMap).sort((a, b) => b.quantity - a.quantity).slice(0, 10),
    salesByMonth,
    expensesByCategory,
  })
})

function groupByMonth(records, amountKey, outputKey) {
  return Object.values(records.reduce((groups, record) => {
    const month = new Date(record.createdAt).toLocaleString("en", { month: "short", year: "numeric" })
    groups[month] ||= { month, [outputKey]: 0 }
    groups[month][outputKey] += record[amountKey]
    return groups
  }, {}))
}

module.exports = { getReports }
