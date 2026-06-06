const express = require("express")
const { createExpense, getExpenses, getExpense, updateExpense, deleteExpense } = require("../controllers/expenseController")
const { protect } = require("../middleware/authMiddleware")
const validate = require("../middleware/validate")
const { expenseSchema } = require("../validators/schemas")

const router = express.Router()
router.use(protect)

router.route("/").post(validate(expenseSchema), createExpense).get(getExpenses)
router.route("/:id").get(getExpense).put(validate(expenseSchema.partial()), updateExpense).delete(deleteExpense)

module.exports = router
