const Alternatif = require('../models/index').Alternatif
const Rel_Alternatif = require("../models/index").Rel_Alternatif

exports.createAlternatif = async (req, res) => {
    const { 
        // kode_alternatif, 
        nama_alternatif, 
        keterangan 
    } = req.body
    console.log( nama_alternatif, keterangan); 
    let newAlternatifCode, firstIndexCode, latestIndexCode, latesData, arr, splitArray

    await Alternatif.findAll({
        order: [
            ['createdAt', 'ASC']
        ],
        attributes: ['kode_alternatif']
    })
    .then(data => {
        console.log("10");
        if (data.length > 0) {
            latesData = data[data.length -1]
            arr = latesData.kode_alternatif
            splitArray = arr.split("")
            console.log(splitArray);
            console.log(splitArray.length);
            if (splitArray.length < 3) {
                latestIndexCode = parseInt(splitArray[1])
                newAlternatifCode = "A" + (latestIndexCode + 1)
            }
            else {
                firstIndexCode = splitArray[1]
                latestIndexCode = splitArray[2]
                console.log(firstIndexCode,latestIndexCode);
                const joinIndex = firstIndexCode + latestIndexCode
                console.log(joinIndex);
                console.log("bb");
                latesData = parseInt(joinIndex)
                newAlternatifCode = "A" + (latesData + 1)
                console.log(newAlternatifCode);
            }
        }
        else{
            newAlternatifCode = "A1"
        }

    })
    await Alternatif.findOne({
        where: {
            kode_alternatif: newAlternatifCode,
        }
    })
    .then(alternatif => {
        console.log("a")
        if (alternatif) {
            return res.status(400).send({
                message: `Alternatif with code ${newAlternatifCode} already exist`
            }) 
        }
        return Alternatif.create({
            kode_alternatif: newAlternatifCode,
            nama_alternatif,
            keterangan,
        })
        .then(alternatif => {
            Rel_Alternatif.bulkCreate([
                { kode_alternatif: newAlternatifCode, kode_kriteria :"C1", id_subkriteria: 0},
                { kode_alternatif: newAlternatifCode, kode_kriteria :"C2", id_subkriteria: 0},
                { kode_alternatif: newAlternatifCode, kode_kriteria :"C3", id_subkriteria: 0},
                { kode_alternatif: newAlternatifCode, kode_kriteria :"C4", id_subkriteria: 0},
                { kode_alternatif: newAlternatifCode, kode_kriteria :"C5", id_subkriteria: 0},
                { kode_alternatif: newAlternatifCode, kode_kriteria :"C6", id_subkriteria: 0}
                // {
                // kode_alternatif: newAlternatifCode,
                // kode_kriteria: "C1",
                // id_subkriteria: 0
                // }
            ])
            res.status(201).send({
                alternatif
            })
        })
        .catch(e => {
            res.status(404).send({
                message: "FAILED TO CREATE CRITERIA",
                error: e.message
            })
            console.log(e);
        })
    })
    .catch(e => {
        res.status(503).send({
            message: "INTERNAL SERVER ERROR",
            error: e.message
        })
    })
}

// FUNC UNTUK NAMPILIN TOTAL DATA ALTERNATIF DI DASHBOARD
exports.getAlternatifCount = async (req, res) => {
    await Alternatif.count()
    .then(count => {
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

// FUNC UNTUK TAMPILIN SEMUA DATA ALTERNATIF DI HALAMAN MENU ALTERNATIF
exports.getAllAlternatif = async (req, res) => {
    await Alternatif.findAll({
        order: [
            ['id', 'ASC']
        ],
        // include: {
        //     model: Rel_Alternatif,
        //     as: "rel_alternatif",
        //     // required: true,
        //     attributes: ['id', 'kode_kriteria', 'kode_alternatif', 'id_subkriteria'],
        //     order: [
        //         ['kode_kriteria', 'ASC']
        //     ],
        // },
    })
    .then(data => {
        return res.status(200).send({
            alternatif: data
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

// FUNC UNTUK DAPATIN DATA KODE ALTERNATIF AGAR PAS UPDATE FIELD KODE_ALTERNATIF AUTO FILL
exports.getAlternatifById = async(req, res) => {
    const alternatifId = req.params.alternatifId

    await Alternatif.findOne({ where: {id: alternatifId } })
    .then(alternatif => {
        return res.status(200).json({ 
            alternatif
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

// FUNC UNTUK UPDATE DATA KRITERIA
exports.updateAlternatif = async (req, res) => {
    const alternatifId = req.params.alternatifId
    const { kode_alternatif, nama_alternatif, keterangan } = req.body
    console.log(alternatifId);
    console.log(kode_alternatif, nama_alternatif, keterangan);

    await Alternatif.update({ kode_alternatif, nama_alternatif, keterangan }, {
        where: { 
            id: alternatifId 
        },
        returning: true
    })
    .then(alternatif => {
        res.status(200).send({
            alternatif: alternatif
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

// FUNC UNTUK HAPUS DATA KRITERIA BERDASARKAN ID KRITERIA
exports.deleteAlternatif = async (req, res) => {
    const alternatifId = req.params.alternatifId
    await Alternatif.destroy({ 
        where: { 
            id: alternatifId 
        } 
    })
    .then(() => {
        res.status(200).json({
            data: alternatifId,
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