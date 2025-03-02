const Kriteria = require("../models/index").Kriteria

exports.createCriteria = async (req, res) => {
    const { nama_kriteria, bobot_kriteria, jenis_kriteria } = req.body
    console.log( nama_kriteria, bobot_kriteria, jenis_kriteria); 
    let newCriteriaCode, latestCriteriaCode, dataKode

    await Kriteria.findAll({
        order: [
            ['createdAt', 'ASC']
        ],
        attributes: ['kode_kriteria']
    })
    .then(data => {
        // console.log(data);
        // console.log(data.length);
        if (data.length > 0) {
            const latesCodeData = data[data.length -1]
            let arr = latesCodeData.kode_kriteria
            let splitCode = arr.split("")
            console.log(splitCode);
            latestCriteriaCode = parseInt(splitCode[1])
            newCriteriaCode = "C" + (latestCriteriaCode + 1)
        }
        else{
            newCriteriaCode = "C1"
        }
        console.log(newCriteriaCode);
    })
    .catch(e => {
        res.status(400).send({
            message: "FAILED TO CREATE CRITERIA CODE",
            error: e.message
        })
        console.log(e);
    })

    console.log("aa")
    await Kriteria.findOne({
        where: {
            kode_kriteria: newCriteriaCode,
        }
    })
    .then(kriteria => {
        console.log("a")
        if (kriteria) {
            return res.status(400).send({
                message: `Kriteria with code ${newCriteriaCode} already exist`
            }) 
        }
        return Kriteria.create({
            kode_kriteria: newCriteriaCode,
            nama_kriteria,
            bobot_kriteria,
            jenis_kriteria
        })
        .then(kriteria => {
            res.status(201).send({
                kriteria
            })
        })
        .catch(e => {
            console.log(e);
            res.status(404).send({
                message: "FAILED TO CREATE CRITERIA",
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

// FUNC UNTUK NAMPILIN TOTAL KRITERIA DI DASHBOARD
exports.getKriteriaCount = async (req, res) => {
    await Kriteria.count()
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

// FUNC UNTUK TAMPILIN SEMUA DATA KRITERIA DI HALAMAN MENU KRITERIA
exports.getAllKriteria = async (req, res) => {
    await Kriteria.findAll({
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

// FUNC UNTUK DAPATIN DATA KODE KRITERIA AGAR PAS UPDATE FIELD KODE_KRITERIA AUTO FILL
exports.getKriteriaByCode = async(req, res) => {
    const kodeKriteria = req.params.kodeKriteria

    await Kriteria.findOne({ where: {kode_kriteria: kodeKriteria } })
    .then(kriteria => {
        return res.status(200).json({ 
            kriteria
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

// // FUNC UNTUK DAPATIN ID KRITERIA DIPAKE BUAT PARAMS ID UNTUK UPDATE DATA KRITERIA 
// // DAN UNTUK DAPATIN DATA KODE KRITERIA AGAR PAS UPDATE FIELD KODE_KRITERIA AUTO FILL
// exports.getKriteriaById = async(req, res) => {
//     const kriteriaId = req.params.kriteriaId

//     await Kriteria.findOne({ where: {id: kriteriaId } })
//     .then(kriteria => {
//         return res.status(200).json({ 
//             kriteria
//         })
//     })
//     .catch(e => {
//         console.log(e);
//         res.status(503).send({
//             message: "INTERNAL SERVER ERROR",
//             error: e
//         })
//     })
// }

// FUNC UNTUK REQ UPDATE DATA KRITERIA
exports.updateKriteria = async (req, res) => {
    const kodeKriteria = req.params.kodeKriteria
    const { kode_kriteria, nama_kriteria, bobot_kriteria, jenis_kriteria } = req.body
    console.log(kode_kriteria, nama_kriteria, bobot_kriteria, jenis_kriteria);

    await Kriteria.update({ kode_kriteria, nama_kriteria, bobot_kriteria, jenis_kriteria }, {
        where: { 
            kode_kriteria: kodeKriteria 
        },
        returning: true
    })
    .then(kriteria => {
        res.status(200).send({
            kriteria: kriteria
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
exports.deleteKriteria = async (req, res) => {
    const kodeKriteria = req.params.kodeKriteria
    await Kriteria.destroy({ 
        where: { 
            kode_kriteria: kodeKriteria 
        } 
    })
    .then(() => {
        res.status(200).json({
            data: kodeKriteria,
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