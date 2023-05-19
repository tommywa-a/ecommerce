const express = require('express')
const { createProduct, getAProduct } = require('../controller/productCtrl')
const router = express.Router()

router.post('/', createProduct)
router.get('/:id', getAProduct)

module.exports = router