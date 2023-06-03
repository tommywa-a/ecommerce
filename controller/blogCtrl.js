const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongoDBID = require('../utils/validateMongodbID')


const createBlog = asyncHandler(async (req, res) => {})

module.exports = {createBlog}