const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    businessLogo: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    currency: { type: String, default: "NGN" },
    taxRate: { type: Number, default: 0 },
    invoicePrefix: { type: String, default: "INV" },
  },
  { timestamps: true },
)

userSchema.index({ createdAt: -1 })

module.exports = mongoose.model("User", userSchema)
