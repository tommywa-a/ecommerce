const express = require('express')
const {
	createProduct,
	getAProduct,
	getAllproducts,
	updateProduct,
	deleteProduct,
} = require('../controller/productCtrl')
const router = express.Router()

router.post('/', createProduct)
router.get('/:id', getAProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)
router.get('/', getAllproducts)

module.exports = router
