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
    deleteAlternatif,
    getAlternatifByKode
} = require("../controllers/alternatif.controller")


router.post('/createAlternatif', createAlternatif)
router.get('/count', getAlternatifCount)
router.get('/getAllAlternatif', getAllAlternatif)
router.get('/getAlternatifByKode/:kodeAlternatif', getAlternatifByKode)
router.put('/updateAlternatif/:kodeAlternatif', updateAlternatif)
router.delete('/deleteAlternatif/:kodeAlternatif', deleteAlternatif)


module.exports = router