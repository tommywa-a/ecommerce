const express = require('express')
const {
	createProduct,
	getAProduct,
	getAllproducts,
	updateProduct,
	deleteProduct,
	addToWishList,
	rating,
	uploadImages,
} = require('../controller/productCtrl')
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages')
const router = express.Router()

router.post('/', authMiddleware, isAdmin, createProduct)
router.put(
	'/upload/:id',
	authMiddleware,
	isAdmin,
	uploadPhoto.array('images', 10),
	productImgResize,
	uploadImages
)
router.get('/:id', getAProduct)
router.put('/wishlist', authMiddleware, addToWishList)
router.put('/rating', authMiddleware, rating)
router.put('/:id', authMiddleware, isAdmin, updateProduct)
router.delete('/:id', authMiddleware, isAdmin, deleteProduct)
router.get('/', getAllproducts)

module.exports = router
