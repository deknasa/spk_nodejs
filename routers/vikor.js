const express = require("express")
const router = express.Router()
const { verify } = require("../middleware/authentication")
const { adminAuthorization } = require("../middleware/authorization")
const {
    getRelAlternatif
} = require("../controllers/vikor.controller")


router.get('/getresult', getRelAlternatif) 

module.exports = router