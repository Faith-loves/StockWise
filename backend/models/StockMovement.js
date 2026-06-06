const mongoose = require("mongoose")

const stockMovementSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    type: { type: String, enum: ["added", "increase", "reduce", "damaged", "returned", "correction", "sold", "deleted"], required: true },
    quantity: { type: Number, required: true },
    previousQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    reason: { type: String, default: "" },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true },
)

stockMovementSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model("StockMovement", stockMovementSchema)
