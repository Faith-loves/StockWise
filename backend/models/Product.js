const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    costPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    lowStockThreshold: { type: Number, default: 5, min: 0 },
    supplierName: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

productSchema.index({ userId: 1, sku: 1 }, { unique: true })
productSchema.index({ userId: 1, category: 1 })
productSchema.index({ userId: 1, quantity: 1 })
productSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model("Product", productSchema)
