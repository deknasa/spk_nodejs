const express = require("express")
const router = express.Router()
const { verify } = require("../middleware/authentication")
const { adminAuthorization } = require("../middleware/authorization")
const kriteriaController = require("../controllers/kriteria.controller")

// router.post('/createKriteria', verify, adminAuthorization, kriteriaController.createCriteria)
router.get('/count', kriteriaController.getKriteriaCount)
// router.get('/getAllKriteria', verify, adminAuthorization, kriteriaController.getAllKriteria)
// router.get('/getKriteriaByCode', verify, adminAuthorization, kriteriaController.getKriteriaByCode)
// router.put('/updateKriteria/:kriteriaId', verify, adminAuthorization, kriteriaController.updateKriteria)

router.post('/createKriteria', kriteriaController.createCriteria)
router.get('/getAllKriteria', kriteriaController.getAllKriteria)
// router.get('/getKriteriaById/:kriteriaId', kriteriaController.getKriteriaById)
router.get('/getKriteriaByCode/:kodeKriteria', kriteriaController.getKriteriaByCode)
router.put('/updateKriteria/:kodeKriteria', kriteriaController.updateKriteria)
router.delete('/deleteKriteria/:kriteriaId', kriteriaController.deleteKriteria)

module.exports = router