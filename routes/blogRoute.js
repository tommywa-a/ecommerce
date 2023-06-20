const express = require('express')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const {
	createBlog,
	updateBlog,
	getBlog,
	getAllBlogs,
	deleteBlog,
	likeTheBlog,
	dislikeTheBlog,
  uploadImages,
} = require('../controller/blogCtrl')
const { blogImgResize, uploadPhoto } = require('../middlewares/uploadImages')
const router = express.Router()

router.get('/:id', getBlog)
router.get('/', getAllBlogs)
router.put('/likes', authMiddleware, likeTheBlog)
router.put('/dislikes', authMiddleware, dislikeTheBlog)
router.post('/', authMiddleware, isAdmin, createBlog)
router.put(
	'/upload/:id',
	authMiddleware,
	isAdmin,
  uploadPhoto.array('images', 2),
	blogImgResize,
	uploadImages
)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)

module.exports = router
