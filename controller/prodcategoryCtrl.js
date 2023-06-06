const Category = require('../models/prodcategoryModel')
const asyncHandler = require('express-async-handler')
const validateMongoDBID = require('../utils/validateMongodbID')

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body)
    res.json(newCategory)
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = { createCategory }