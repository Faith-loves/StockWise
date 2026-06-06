const express = require("express")
const { uploadImage } = require("../controllers/uploadController")
const { protect } = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware")

const router = express.Router()
router.use(protect)

router.post("/:type", upload.single("image"), uploadImage)

module.exports = router
