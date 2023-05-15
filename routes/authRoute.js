const express = require('express')
const { createUser, loginUserCtrl } = require('../controller/userCtrl')
const router = express.Router()

router.post('/register', createUser)
router.post('/login', loginUserCtrl)

router.get('/', (req, res) => {
  res.json({
    "msg" : "working"
  })
})
module.exports = router