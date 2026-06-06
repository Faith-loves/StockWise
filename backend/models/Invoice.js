const mongoose = require("mongoose")

const invoiceItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
)

const invoiceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    saleId: { type: mongoose.Schema.Types.ObjectId, ref: "Sale", required: true },
    invoiceNumber: { type: String, required: true },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, default: 0, min: 0 },
    balance: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["Paid", "Partial", "Unpaid", "Overdue"], default: "Unpaid", index: true },
    dueDate: { type: Date, required: true },
    issuedDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

invoiceSchema.index({ userId: 1, invoiceNumber: 1 }, { unique: true })
invoiceSchema.index({ userId: 1, status: 1 })
invoiceSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model("Invoice", invoiceSchema)
