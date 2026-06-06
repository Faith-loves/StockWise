const bcrypt = require("bcryptjs")
const User = require("../models/User")
const asyncHandler = require("../utils/asyncHandler")
const generateToken = require("../utils/generateToken")

function publicUser(user) {
  const obj = user.toObject()
  delete obj.password
  return obj
}

const signup = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email })
  if (existing) {
    res.status(409)
    throw new Error("User already exists")
  }

  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(req.body.password, salt)
  const user = await User.create({ ...req.body, password })

  res.status(201).json({ user: publicUser(user), token: generateToken(user._id) })
})

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    res.status(401)
    throw new Error("Invalid email or password")
  }

  res.json({ user: publicUser(user), token: generateToken(user._id) })
})

const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({ user: req.user })
})

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true }).select("-password")
  res.json({ user })
})

module.exports = { signup, login, getCurrentUser, updateProfile }
