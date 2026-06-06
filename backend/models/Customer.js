const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "", lowercase: true, trim: true },
    address: { type: String, default: "" },
    customerType: { type: String, default: "Retailer" },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
)

customerSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model("Customer", customerSchema)
