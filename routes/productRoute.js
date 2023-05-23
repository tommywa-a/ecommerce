const express = require('express')
const { createProduct, getAProduct, getAllproducts, updateProduct } = require('../controller/productCtrl')
const router = express.Router()

router.post('/', createProduct)
router.get('/:id', getAProduct)
router.put('/:id', updateProduct)
router.get('/', getAllproducts)

module.exports = router