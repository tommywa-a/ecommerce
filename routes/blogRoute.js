const express = require('express')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const { createBlog, updateBlog, getBlog, getAllBlogs } = require('../controller/blogCtrl')
const router = express.Router()

router.get('/:id', getBlog)
router.get('/', getAllBlogs)
router.post('/', authMiddleware, isAdmin, createBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)

module.exports = router