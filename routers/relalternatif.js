const express = require("express")
const router = express.Router()
const { verify } = require("../middleware/authentication")
const { adminAuthorization } = require("../middleware/authorization")
const {
    getRelAlternatifIncludeAll,
    createRelAlternatif,
    penilaian
} = require("../controllers/rel_alternatif.controller")


router.get('/includeAll', getRelAlternatifIncludeAll) 
// router.get('/penilaian', penilaian) 
router.put('/create/:kode_alternatif', createRelAlternatif) 


module.exports = router