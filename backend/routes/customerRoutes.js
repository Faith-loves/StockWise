const express = require("express")
const { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer } = require("../controllers/customerController")
const { protect } = require("../middleware/authMiddleware")
const validate = require("../middleware/validate")
const { customerSchema } = require("../validators/schemas")

const router = express.Router()
router.use(protect)

router.route("/").post(validate(customerSchema), createCustomer).get(getCustomers)
router.route("/:id").get(getCustomer).put(validate(customerSchema.partial()), updateCustomer).delete(deleteCustomer)

module.exports = router
