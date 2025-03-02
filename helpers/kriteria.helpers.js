const Kriteria = require("../models/index").Kriteria
const Sub_Kriteria = require("../models/index").Sub_Kriteria

const checkSubkriteriaBeforeDelete = (req, res, next) => {
    const kodeKriteria = req.params.kodeKriteria

    Sub_Kriteria.findOne({ 
        where: {
            kode_kriteria: kodeKriteria 
        } 
    })
    .then(data => {
        if (data) {
            res.status(400).send({
                message: "You can't delete a criterion that has subcriteria. Please delete the subcriteria first!"
            })
        }
        else{
            next()
        }
    })
    .catch(e => {
        res.status(503).json({
            error: e.message
        })
    })
}

module.exports = {
    checkSubkriteriaBeforeDelete
}