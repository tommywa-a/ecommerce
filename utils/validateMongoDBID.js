const mongoose = require('mongoose')
const validateMongoDBID = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id)
  if (!isValid) {
    throw new Error("This ID is not valid, or the ID is not found")
  }
}

module.exports = validateMongoDBID