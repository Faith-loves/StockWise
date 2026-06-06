const jwt = require("jsonwebtoken")
const User = require("../models/User")

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null

    if (!token) {
      res.status(401)
      throw new Error("Not authorized, token missing")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select("-password")

    if (!req.user) {
      res.status(401)
      throw new Error("Not authorized, user not found")
    }

    next()
  } catch (error) {
    res.status(res.statusCode === 200 ? 401 : res.statusCode)
    next(error)
  }
}

module.exports = { protect }
