const express = require("express")
const router = express.Router()
const { verify } = require("../middleware/authentication")
const { adminAuthorization } = require("../middleware/authorization")
const { 
    createAlternatif,
    getAlternatifCount,
    getAllAlternatif,
    getAlternatifById,
    updateAlternatif,
    deleteAlternatif
} = require("../controllers/alternatif.controller")


router.post('/createAlternatif', createAlternatif)
router.get('/count', getAlternatifCount)
router.get('/getAllAlternatif', getAllAlternatif)
router.get('/getAlternatifById/:alternatifId', getAlternatifById)
router.put('/updateAlternatif/:alternatifId', updateAlternatif)
router.delete('/deleteAlternatif/:alternatifId', deleteAlternatif)


module.exports = router