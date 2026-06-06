const express = require("express")
const { signup, login, getCurrentUser, updateProfile } = require("../controllers/authController")
const { protect } = require("../middleware/authMiddleware")
const validate = require("../middleware/validate")
const { signupSchema, loginSchema, profileSchema } = require("../validators/schemas")

const router = express.Router()

router.post("/signup", validate(signupSchema), signup)
router.post("/login", validate(loginSchema), login)
router.get("/me", protect, getCurrentUser)
router.put("/profile", protect, validate(profileSchema), updateProfile)

module.exports = router
