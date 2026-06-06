const Activity = require("../models/Activity")

async function logActivity(userId, action, description, entityType, entityId) {
  return Activity.create({ userId, action, description, entityType, entityId })
}

module.exports = logActivity
