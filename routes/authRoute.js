const express = require('express')
const { createUser, loginUserCtrl, getAllUsers, getAUser, deleteAUser, updateAUser } = require('../controller/userCtrl')
const router = express.Router()

router.post('/register', createUser)
router.post('/login', loginUserCtrl)
router.get('/all-users', getAllUsers)
router.get('/:id', getAUser)
router.delete('/:id', deleteAUser)
router.put('/:id', updateAUser)

router.get('/', (req, res) => {
  res.json({
    "msg" : "working"
  })
})
module.exports = router