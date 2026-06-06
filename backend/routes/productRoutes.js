const express = require("express")
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, adjustStock } = require("../controllers/productController")
const { protect } = require("../middleware/authMiddleware")
const validate = require("../middleware/validate")
const { productSchema, stockAdjustmentSchema } = require("../validators/schemas")

const router = express.Router()
router.use(protect)

router.route("/").post(validate(productSchema), createProduct).get(getProducts)
router.route("/:id").get(getProduct).put(validate(productSchema.partial()), updateProduct).delete(deleteProduct)
router.patch("/:id/adjust-stock", validate(stockAdjustmentSchema), adjustStock)

module.exports = router
