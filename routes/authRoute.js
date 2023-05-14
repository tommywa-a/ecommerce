const express = require('express')
const { createUser } = require('../controller/userCtrl')
const router = express.Router()



router.post('/register', createUser)

router.get('/', (req, res) => {
  res.json({
    "msg" : "working"
  })
})
module.exports = router