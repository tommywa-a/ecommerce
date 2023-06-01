const express = require('express')
const {
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
} = require('../controller/userCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/register', createUser)
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/password',authMiddleware, updatePassword)
router.post('/login', loginUserCtrl)
router.get('/all-users', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.delete('/:id', deleteAUser)
router.get('/:id', authMiddleware, isAdmin, getAUser)
router.put('/edit-user', authMiddleware, updateAUser)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)

router.get('/', (req, res) => {
	res.json({
		msg: 'working',
	})
})
module.exports = router
