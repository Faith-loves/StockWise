const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const connectDB = require("./config/db")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")

dotenv.config()
connectDB()

const app = express()

app.set("trust proxy", 1)

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }))
app.use(express.json({ limit: "2mb" }))
app.use(express.urlencoded({ extended: true }))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth requests. Please try again later." },
})

app.get("/", (req, res) => {
  res.json({ message: "StockWise API is running" })
})

app.use("/api/auth", authLimiter, require("./routes/authRoutes"))
app.use("/api/products", require("./routes/productRoutes"))
app.use("/api/customers", require("./routes/customerRoutes"))
app.use("/api/sales", require("./routes/saleRoutes"))
app.use("/api/invoices", require("./routes/invoiceRoutes"))
app.use("/api/expenses", require("./routes/expenseRoutes"))
app.use("/api/uploads", require("./routes/uploadRoutes"))
app.use("/api/reports", require("./routes/reportRoutes"))

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`StockWise API running on port ${PORT}`)
})
