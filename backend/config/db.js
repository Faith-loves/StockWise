const mongoose = require("mongoose")

async function connectDB() {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes("your_mongodb")) {
      console.warn("MONGO_URI is not configured. Set it in .env to connect MongoDB Atlas.")
      return
    }

    const connection = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${connection.connection.host}`)
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
