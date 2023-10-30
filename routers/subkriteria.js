const express = require("express")
const router = express.Router()
const { verify } = require("../middleware/authentication")
const { adminAuthorization } = require("../middleware/authorization")
const subkriteriaController = require("../controllers/subkriteria.controller")

// router.post('/createSubkriteria', verify, adminAuthorization, subkriteriaController.createSubkriteria)
// router.get('/count', subkriteriaController.getSubkriteriaCount)
// router.get('/getAllSubkriteria', verify, adminAuthorization, subkriteriaController.getAllSubkriteria)

router.post('/createSubkriteria', subkriteriaController.createSubkriteria)
router.get('/count', subkriteriaController.getSubkriteriaCount)
router.get('/getAllSubkriteria', subkriteriaController.getAllSubkriteria)
router.get('/getSubkriteriaById/:subkriteriaId', subkriteriaController.getSubkriteriaById)
router.get('/getSubkriteriaByKriteria', subkriteriaController.getSubkriteriaByKriteria) 
router.put('/updateSubKriteria/:subkriteriaId', subkriteriaController.updateSubkriteria)
router.delete('/deleteSubkriteria/:subkriteriaId', subkriteriaController.deleteSubkriteria)


module.exports = router