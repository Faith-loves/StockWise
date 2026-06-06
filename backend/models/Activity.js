const mongoose = require("mongoose")

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: { type: String, required: true },
    description: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true },
)

activitySchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model("Activity", activitySchema)
