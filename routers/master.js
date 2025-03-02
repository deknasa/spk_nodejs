const express = require("express")
const router = express.Router()
const { verify } = require("../middleware/authentication")
const { adminAuthorization } = require("../middleware/authorization")
const { getAll } = require("../controllers/kendaraan_master.controller")

router.get('/getAll', getAll)

module.exports = router 