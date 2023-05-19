const { generateToken } = require('../config/jwtToken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongoDBID = require('../utils/validateMongodbID')
const { generateRefreshToken } = require('../config/refreshToken')
const jwt = require('jsonwebtoken')
const createUser = asyncHandler(async (req, res) => {
	const email = req.body.email
	const findUser = await User.findOne({ email })

	if (!findUser) {
		// Create a new user
		const newUser = await User.create(req.body)
		res.json(newUser)
	} else {
		// User already exists
		throw new Error('User Already Exists')
	}
})

const loginUserCtrl = asyncHandler(async (req, res) => {
	const { email, password } = req.body
	// check if user exists
	const findUser = await User.findOne({ email })
	if (findUser && (await findUser.isPasswordMatched(password))) {
		const refreshToken = await generateRefreshToken(findUser?._id)
		const updateuser = await User.findByIdAndUpdate(
			findUser.id,
			{
				refreshToken: refreshToken,
			},
			{ new: true }
		)
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
		})
		res.json({
			_id: findUser?._id,
			firstName: findUser?.firstName,
			email: findUser?.email,
			mobile: findUser?.mobile,
			token: generateToken(findUser?._id),
		})
	} else {
		throw new Error('Invalid Credentials')
	}
})

// Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
	const cookie = req.cookies
	if (!cookie?.refreshToken) {
		throw new Error('No Refresh Token in Cookies')
	}
	const refreshToken = cookie.refreshToken
	const user = await User.findOne({ refreshToken })
	if (!user) {
		throw new Error('No refresh token matched with user in database')
	}
	jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
		if (err || user.id !== decoded.id) {
			throw new Error('There is something wrong with the refresh token')
		}
		const accessToken = generateToken(user?._id)
		res.json({ accessToken })
	})
})

// logout functionality
const logout = asyncHandler(async (req, res) => {
	const cookie = req.cookies
	if (!cookie?.refreshToken) {
		throw new Error('No Refresh Token in Cookies')
	}
	const refreshToken = cookie.refreshToken
	const user = await User.findOne({ refreshToken })
	if (!user) {
		res.clearCookie('refreshToken', {
			httpOnly: true,
			secure: true,
		})
		return res.sendStatus(204) // forbidden
	}
	await User.findOneAndUpdate(refreshToken, {
		refreshToken: '',
	})
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: true,
	})
	res.sendStatus(204) // forbidden
})

// Update a user
const updateAUser = asyncHandler(async (req, res) => {
	const { _id } = req.user
	validateMongoDBID(_id)
	try {
		const updatedUser = await User.findByIdAndUpdate(
			_id,
			{
				firstName: req?.body?.firstName,
				lastName: req?.body?.lastName,
				email: req?.body?.email,
				mobile: req?.body?.mobile,
			},
			{
				new: true,
			}
		)
		res.json(updatedUser)
	} catch (error) {
		throw new Error(error)
	}
})

// Get all users

const getAllUsers = asyncHandler(async (req, res) => {
	try {
		const getUsers = await User.find()
		res.json(getUsers)
	} catch (error) {
		throw new Error(error)
	}
})

// Get a single user

const getAUser = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongoDBID(id)
	try {
		const getaUser = await User.findById(id)
		res.json({
			getaUser,
		})
	} catch (error) {
		throw new Error(error)
	}
})

// Delete a user

const deleteAUser = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongoDBID(_id)
	try {
		const deletedUser = await User.findByIdAndDelete(id)
		res.json({
			deletedUser,
		})
	} catch (error) {
		throw new Error(error)
	}
})

const blockUser = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongoDBID(id)
	try {
		const block = await User.findByIdAndUpdate(
			id,
			{
				isBlocked: true,
			},
			{
				new: true,
			}
		)
		res.json({
			message: 'User blocked',
		})
	} catch (error) {
		throw new Error(error)
	}
})

const unblockUser = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongoDBID(id)
	try {
		const unblock = await User.findByIdAndUpdate(
			id,
			{
				isBlocked: false,
			},
			{
				new: true,
			}
		)
		res.json({
			message: 'User unblocked',
		})
	} catch (error) {
		throw new Error(error)
	}
})

module.exports = {
	createUser,
	loginUserCtrl,
	getAllUsers,
	getAUser,
	deleteAUser,
	updateAUser,
	blockUser,
	unblockUser,
	handleRefreshToken,
	logout,
}
