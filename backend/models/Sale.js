const mongoose = require("mongoose")

const saleItemSchema = new mongoose.Schema(
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

const saleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    invoiceNumber: { type: String, required: true },
    items: [saleItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, default: 0, min: 0 },
    balance: { type: Number, default: 0, min: 0 },
    paymentStatus: { type: String, enum: ["Paid", "Partial", "Unpaid"], default: "Unpaid", index: true },
    paymentMethod: { type: String, enum: ["Cash", "Transfer", "POS", "Card", "Other"], default: "Cash" },
    saleDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

saleSchema.index({ userId: 1, invoiceNumber: 1 }, { unique: true })
saleSchema.index({ userId: 1, paymentStatus: 1 })
saleSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model("Sale", saleSchema)
