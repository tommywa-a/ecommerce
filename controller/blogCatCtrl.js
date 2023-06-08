const Category = require('../models/blogCatModel')
const asyncHandler = require('express-async-handler')
const validateMongoDBID = require('../utils/validateMongodbID')

const createCategory = asyncHandler(async (req, res) => {
	try {
		const newCategory = await Category.create(req.body)
		res.json(newCategory)
	} catch (error) {
		throw new Error(error)
	}
})

const updateCategory = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongoDBID(id)
	try {
		const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
			new: true,
		})
		res.json(updatedCategory)
	} catch (error) {
		throw new Error(error)
	}
})

const deleteCategory = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongoDBID(id)
	try {
		const deletedCategory = await Category.findByIdAndDelete(id)
		res.json(deletedCategory)
	} catch (error) {
		throw new Error(error)
	}
})

const getCategory = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongoDBID(id)
	try {
		const getaCategory = await Category.findById(id)
		res.json(getaCategory)
	} catch (error) {
		throw new Error(error)
	}
})

const getAllCategories = asyncHandler(async (req, res) => {
	try {
		const getAllCategory = await Category.find()
		res.json(getAllCategory)
	} catch (error) {
		throw new Error(error)
	}
})

module.exports = {
	createCategory,
	updateCategory,
	deleteCategory,
	getCategory,
	getAllCategories,
}
