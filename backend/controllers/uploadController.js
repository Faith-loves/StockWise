const fs = require("fs")
const cloudinary = require("../config/cloudinary")
const asyncHandler = require("../utils/asyncHandler")

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error("Image file is required")
  }
  const folderMap = {
    product: "stockwise/products",
    logo: "stockwise/logos",
    receipt: "stockwise/receipts",
  }
  const folder = folderMap[req.params.type] || "stockwise/uploads"
  const result = await cloudinary.uploader.upload(req.file.path, { folder })
  fs.unlink(req.file.path, () => {})
  res.status(201).json({ url: result.secure_url, publicId: result.public_id })
})

module.exports = { uploadImage }
