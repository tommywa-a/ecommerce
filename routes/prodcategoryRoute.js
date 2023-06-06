const express = require('express')
const { createCategory } = require('../controller/prodcategoryCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/', authMiddleware, isAdmin, createCategory)

module.exports = router