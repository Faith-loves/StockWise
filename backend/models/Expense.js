const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    paymentMethod: { type: String, enum: ["Cash", "Transfer", "POS", "Card", "Other"], default: "Cash" },
    receiptUrl: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
)

expenseSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model("Expense", expenseSchema)
