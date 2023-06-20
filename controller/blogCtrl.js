const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongoDBID = require('../utils/validateMongodbID')
const cloudinaryUploadImg = require('../utils/cloudinary')
const fs = require('fs')

const createBlog = asyncHandler(async (req, res) => {
	try {
		const newBlog = await Blog.create(req.body)
		res.json(newBlog)
	} catch (error) {
		throw new Error(error)
	}
})

const updateBlog = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongoDBID(id)
	try {
		const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
			new: true,
		})
		res.json(updatedBlog)
	} catch (error) {
		throw new Error(error)
	}
})

const getBlog = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongoDBID(id)
	try {
		const getBlog = await Blog.findById(id)
		const updateViews = await Blog.findByIdAndUpdate(
			id,
			{
				$inc: { numViews: 1 },
			},
			{ new: true }
		)
			.populate('likes')
			.populate('dislikes')
		res.json(updateViews)
	} catch (error) {
		throw new Error(error)
	}
})

const getAllBlogs = asyncHandler(async (req, res) => {
	try {
		const getBlogs = await Blog.find()
		res.json(getBlogs)
	} catch (error) {
		throw new Error(error)
	}
})

const deleteBlog = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongoDBID(id)
	try {
		const deleteBlog = await Blog.findByIdAndDelete(id)
		res.json(deleteBlog)
	} catch (error) {
		throw new Error(error)
	}
})

const likeTheBlog = asyncHandler(async (req, res) => {
	const { blogId } = req.body
	validateMongoDBID(blogId)

	// Find the blog which you want to be liked
	const blog = await Blog.findById(blogId)
	// Find the logged in user
	const loginUserId = req?.user?._id
	// Find if the user has liked the blog
	const isLiked = blog?.isLiked
	// Find if the user has disliked the blog
	const alreadyDisliked = blog?.dislikes?.find(
		(userId) => userId?.toString() === loginUserId?.toString()
	)
	if (alreadyDisliked) {
		const blog = await Blog.findByIdAndUpdate(
			blogId,
			{
				$pull: { dislikes: loginUserId },
				isDisliked: false,
			},
			{ new: true }
		)
		res.json(blog)
	}
	if (isLiked) {
		const blog = await Blog.findByIdAndUpdate(
			blogId,
			{
				$pull: { likes: loginUserId },
				isLiked: false,
			},
			{ new: true }
		)
		res.json(blog)
	} else {
		const blog = await Blog.findByIdAndUpdate(
			blogId,
			{
				$push: { likes: loginUserId },
				isLiked: true,
			},
			{ new: true }
		)
		res.json(blog)
	}
})

const dislikeTheBlog = asyncHandler(async (req, res) => {
	const { blogId } = req.body
	validateMongoDBID(blogId)

	// Find the blog which you want to be liked
	const blog = await Blog.findById(blogId)
	// Find the logged in user
	const loginUserId = req?.user?._id
	// Find if the user has liked the blog
	const isDisLiked = blog?.isDisliked
	// Find if the user has disliked the blog
	const alreadyLiked = blog?.likes?.find(
		(userId) => userId?.toString() === loginUserId?.toString()
	)
	if (alreadyLiked) {
		const blog = await Blog.findByIdAndUpdate(
			blogId,
			{
				$pull: { likes: loginUserId },
				isLiked: false,
			},
			{ new: true }
		)
		res.json(blog)
	}
	if (isDisLiked) {
		const blog = await Blog.findByIdAndUpdate(
			blogId,
			{
				$pull: { dislikes: loginUserId },
				isDisliked: false,
			},
			{ new: true }
		)
		res.json(blog)
	} else {
		const blog = await Blog.findByIdAndUpdate(
			blogId,
			{
				$push: { dislikes: loginUserId },
				isDisliked: true,
			},
			{ new: true }
		)
		res.json(blog)
	}
})

const uploadImages = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongoDBID(id)
	try {
		const uploader = (path) => cloudinaryUploadImg(path, 'images')
		const urls = []
		const files = req.files
		for (const file of files) {
			const { path } = file
			const newpath = await uploader(path)
			urls.push(newpath)
			fs.unlinkSync(path)
		}
		const findBlog = await Blog.findByIdAndUpdate(
			id,
			{
				images: urls.map((file) => {
					return file
				}),
			},
			{
				new: true,
			}
		)
		res.json(findBlog)
	} catch (error) {
		throw new Error(error)
	}
})

module.exports = {
	createBlog,
	updateBlog,
	getBlog,
	getAllBlogs,
	deleteBlog,
	likeTheBlog,
	dislikeTheBlog,
	uploadImages,
}
