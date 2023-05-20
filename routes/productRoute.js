const express = require('express')
const { createProduct, getAProduct, getAllproducts } = require('../controller/productCtrl')
const router = express.Router()

router.post('/', createProduct)
router.get('/:id', getAProduct)
router.get('/', getAllproducts)

module.exports = router