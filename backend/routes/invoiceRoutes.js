const express = require("express")
const { getInvoices, getInvoice, markInvoicePaid, updateInvoicePayment, deleteInvoice } = require("../controllers/invoiceController")
const { protect } = require("../middleware/authMiddleware")
const validate = require("../middleware/validate")
const { paymentUpdateSchema } = require("../validators/schemas")

const router = express.Router()
router.use(protect)

router.get("/", getInvoices)
router.get("/:id", getInvoice)
router.patch("/:id/paid", markInvoicePaid)
router.patch("/:id/payment", validate(paymentUpdateSchema), updateInvoicePayment)
router.delete("/:id", deleteInvoice)

module.exports = router
