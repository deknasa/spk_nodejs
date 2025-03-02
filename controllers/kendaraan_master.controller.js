const Kendaraan_Master = require("../models/index").Kendaraan_Master
const Alternatif = require("../models/index").Alternatif

exports.getAll = async (req, res) => {
    await Kendaraan_Master.findAll({
        order: [
            ['id', 'ASC'] 
        ], 
        // include: [
        //     {
        //         model: Alternatif,
        //         as: "data-alternatif",
        //         attributes: ['kode_alternatif', 'nama_alternatif']
        //     },
        // ]
    })
    .then(data => {
        return res.status(200).send({
            data: data
        })
    })
    .catch(e => {
        console.log(e);
        res.status(503).send({ 
            message: "INTERNAL SERVER ERROR",
            error: e.message
        })
    })
}