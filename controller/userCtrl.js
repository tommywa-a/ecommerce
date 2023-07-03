const { generateToken } = require('../config/jwtToken')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Cart = require('../models/cartModel')
const asyncHandler = require('express-async-handler')
const validateMongoDBID = require('../utils/validateMongodbID')
const { generateRefreshToken } = require('../config/refreshToken')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const sendEmail = require('./emailCtrl')
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

// Login a user
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
			lastName: findUser?.lastName,
			email: findUser?.email,
			mobile: findUser?.mobile,
			token: generateToken(findUser?._id),
		})
	} else {
		throw new Error('Invalid Credentials')
	}
})

// Admin login
const loginAdmin = asyncHandler(async (req, res) => {
	const { email, password } = req.body
	// check if user exists
	const findAdmin = await User.findOne({ email })
	if (findAdmin.role !== 'admin') {
		throw new Error('Not Authorised')
	}
	if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
		const refreshToken = await generateRefreshToken(findAdmin?._id)
		const updateuser = await User.findByIdAndUpdate(
			findAdmin.id,
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
			_id: findAdmin?._id,
			firstName: findAdmin?.firstName,
			lastName: findAdmin?.lastName,
			email: findAdmin?.email,
			mobile: findAdmin?.mobile,
			token: generateToken(findAdmin?._id),
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

// Save user address

const saveAddress = asyncHandler(async(req, res, next) => {
	const { _id } = req.user
	validateMongoDBID(_id)
	try {
		const updatedUser = await User.findByIdAndUpdate(
			_id,
			{
				address: req?.body?.address,
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

const updatePassword = asyncHandler(async (req, res) => {
	const { _id } = req.user
	const { password } = req.body
	validateMongoDBID(_id)
	const user = await User.findById(_id)
	if (password) {
		user.password = password
		const updatedPassword = await user.save()
		res.json(updatedPassword)
	} else {
		res.json(user)
	}
})

const forgotPasswordToken = asyncHandler(async (req, res) => {
	const { email } = req.body
	const user = await User.findOne({ email })
	if (!user) {
		throw new Error('There is no user with this email')
	}
	try {
		const token = await user.createPasswordResetToken()
		await user.save()
		const resetURL = `Please follow this link to reset your password. This link is valid for 10 minutes. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click here<a/>`
		const data = {
			to: email,
			text: 'Hello, user',
			subject: 'Forgot Password Link',
			htm: resetURL,
		}
		console.log(email)
		sendEmail(data)
		res.json(token)
	} catch (error) {
		throw new Error(error)
	}
})

const resetPassword = asyncHandler(async (req, res) => {
	const { password } = req.body
	const { token } = req.params
	const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	})
	if (!user) {
		throw new Error('Sorry, this token has expired.')
	}
	user.password = password
	user.passwordResetToken = undefined
	user.passwordResetExpires = undefined
	await user.save()
	res.json(user)
}) 

const getWishlist = asyncHandler(async(req,res) => {
	const {_id} = req.user
	try {
		const findUser = await User.findById(_id).populate('wishlist')
		res.json(findUser)
	} catch (error) {
		throw new Error(error)
	}
})

const userCart = asyncHandler(async(req, res) => {
	const {cart} = req.body
	const {_id} = req.user
	validateMongoDBID(_id)
	try {
		let products = []
		const user = await User.findById(_id)
		// check if user already has product in cart
		const alreadyExistCart = await Cart.findOne({orderby:user._id})
		if (alreadyExistCart) {
			alreadyExistCart.remove()
		}
		for (let i = 0; i<cart.length; i++){
			let object = {}
			object.product = cart[i]._id
			object.count = cart[i].count
			object.color = cart[i].color
			let getPrice = await Product.findById(cart[i]._id).select('price').exec()
			object.price = getPrice.price
			products.push(object)
		}
		let cartTotal = 0
		for (let i = 0; i < products.length; i++){
			cartTotal = cartTotal + products[i].price * products[i].count
		}
		let newCart = await new Cart({
			products,
			cartTotal,
			orderby: user?._id,
		}).save()
		res.json(newCart)
		console.log(newCart)
	} catch (error) {
		throw new Error(error)
	}
})

const getUserCart = asyncHandler(async(req, res) => {
	const {_id} = req.user
	validateMongoDBID(_id)
	try {
		const cart = await Cart.findOne({orderby: _id}).populate('products.product')
		res.json(cart)
	} catch (error) {
		throw new Error(error)
	}
})

const emptyCart = asyncHandler(async(req, res) => {
	const {_id} = req.user
	validateMongoDBID(_id)
	try {
		const user = await User.findOne({ _id})
		const cart = await Cart.findOneAndRemove({orderby: user._id}) 
		res.json(cart)
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
	updatePassword,
	forgotPasswordToken,
	resetPassword,
	loginAdmin,
	getWishlist,
	saveAddress,
	userCart,
	getUserCart,
	emptyCart,
}
