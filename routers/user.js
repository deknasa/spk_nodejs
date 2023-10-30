const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.put('/updateUser/:userId', userController.updateUser)
router.get('/getUserById/:userId', userController.getUserById)
router.put('/changePassword/:userId', userController.changePassword)
router.get('/logout/:userId', userController.logout)


module.exports = router 