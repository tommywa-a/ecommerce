const express = require('express')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeTheBlog, dislikeTheBlog } = require('../controller/blogCtrl')
const router = express.Router()

router.get('/:id', getBlog)
router.get('/', getAllBlogs)
router.put('/likes', authMiddleware, likeTheBlog)
router.put('/dislikes', authMiddleware, dislikeTheBlog)
router.post('/', authMiddleware, isAdmin, createBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)

module.exports = router