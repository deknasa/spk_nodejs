const express = require("express")
const router = express.Router()
const { verify } = require("../middleware/authentication")
const { adminAuthorization } = require("../middleware/authorization")
const {
    mooraMethod
} = require("../controllers/moora.controller")


router.get('/getresult', mooraMethod) 

module.exports = router