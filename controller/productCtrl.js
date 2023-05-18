const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')

const createProduct = asyncHandler(async(req, res) => {
  res.json({
    message: "Product post route"
  })
})

module.exports = {createProduct}