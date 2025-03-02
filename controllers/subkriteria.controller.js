const Kriteria = require("../models/index").Kriteria
const Sub_Kriteria = require("../models/index").Sub_Kriteria

exports.createSubkriteria = async (req, res) => {
    const { nama_subkriteria, kode_kriteria, bobot_subkriteria } = req.body
    console.log( nama_subkriteria, kode_kriteria, bobot_subkriteria); 

    await Kriteria.findOne({
        where: {
            kode_kriteria: kode_kriteria,
        }
    })
    .then(kriteria => { 
        console.log("a")
        if (!kriteria) {
            return res.status(400).send({
                message: `There is no criteria data with code ${kode_kriteria}`
            }) 
        }
        return Sub_Kriteria.create({
            nama_subkriteria,
            kode_kriteria,
            bobot_subkriteria
        })
        .then(subkriteria => {
            res.status(201).send({
                subkriteria: {
                    id: subkriteria.id,
                    nama_subkriteria: subkriteria.nama_subkriteria,
                    kode_kriteria: subkriteria.kode_kriteria,
                    bobot_subkriteria: subkriteria.bobot_subkriteria,
                    createdAt: subkriteria.createdAt
                }
            })
        })
        .catch(e => {
            console.log(e);
            res.status(404).send({
                message: "FAILED TO CREATE SUBCRITERIA DATA",
                error: e.message
            })
        })
    })
    .catch(e => {
        res.status(503).send({
            message: "INTERNAL SERVER ERROR",
            error: e.message
        })
    })
}

exports.getSubkriteriaCount = async (req, res) => {
    await Sub_Kriteria.count()
    .then(count => {
        console.log(count);
        return res.status(200).send({
            count: count
        })
    })
    .catch(e => {
        res.status(503).send({
            message: "INTERNAL SERVER ERROR",
            error: e.message
        })
    })
}

exports.getAllSubkriteria = async (req, res) => {
    await Sub_Kriteria.findAll({
        order: [
            ['id', 'ASC']
        ],
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

exports.getSubkriteriaByKriteria = async (req, res) => {
    await Kriteria.findAll({
        attributes: [
            'kode_kriteria', 
            'nama_kriteria',
        ],
        include: {
            model: Sub_Kriteria,
            as: "sub_kriteria",
            // required: true,
            // attributes: ['id']
        },
        order: [
            ['kode_kriteria', 'ASC'] 
        ],
    })
    .then(data => {
        // data.forEach(element => {
        //     console.log(element);
        // });
        return res.status(200).send({
            data
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

exports.getSubkriteriaById = async(req, res) => {
    const subkriteriaId = req.params.subkriteriaId

    await Sub_Kriteria.findOne({ where: {id: subkriteriaId } })
    .then(subkriteria => {
        return res.status(200).json({ 
            subkriteria
        })
    })
    .catch(e => {
        console.log(e);
        res.status(503).send({
            message: "INTERNAL SERVER ERROR",
            error: e
        })
    })
}

exports.updateSubkriteria = async (req, res) => {
    const subkriteriaId = req.params.subkriteriaId
    const { kode_kriteria, nama_subkriteria, bobot_subkriteria } = req.body
    // console.log(kriteriaId);
    console.log(kode_kriteria, nama_subkriteria, bobot_subkriteria);

    await Sub_Kriteria.update({ kode_kriteria, nama_subkriteria, bobot_subkriteria }, {
        where: { 
            id: subkriteriaId 
        },
        returning: true
    })
    .then(subkriteria => {
        res.status(200).send({
            subkriteria: subkriteria
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

exports.deleteSubkriteria = async (req, res) => {
    const subkriteriaId = req.params.subkriteriaId
    await Sub_Kriteria.destroy({ 
        where: { 
            id: subkriteriaId 
        }   
    })
    .then(() => {
        res.status(200).json({
            data: subkriteriaId,
            message: "Successfully deleted the criteria data",
        });
    })
    .catch(e => {
        res.status(503).json({
            message: "INTERNAL SERVER ERROR",
            error: e.message,
        });
    });
}
