const express = require("express")
const { createSale, getSales, getSale, updateSalePayment, deleteSale } = require("../controllers/saleController")
const { protect } = require("../middleware/authMiddleware")
const validate = require("../middleware/validate")
const { saleSchema, paymentUpdateSchema } = require("../validators/schemas")

const router = express.Router()
router.use(protect)

router.route("/").post(validate(saleSchema), createSale).get(getSales)
router.route("/:id").get(getSale).delete(deleteSale)
router.patch("/:id/payment", validate(paymentUpdateSchema), updateSalePayment)

module.exports = router
