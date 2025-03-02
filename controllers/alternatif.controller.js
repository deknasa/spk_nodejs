const Alternatif = require('../models/index').Alternatif
const Rel_Alternatif = require("../models/index").Rel_Alternatif
const Kriteria = require("../models/index").Kriteria
const Kendaraan_Master = require("../models/index").Kendaraan_Master

exports.createAlternatif = async (req, res) => {
    const { namaAlternatif, keterangan } = req.body
    const vikor_hasil = "0";
    const moora_hasil = "0"
    let newAlternatifCode, firstIndexCode, latestIndexCode, middleIndexCode, latesData, arr, splitArray

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
            } else if (splitArray.length > 2 && splitArray.length < 4 ) {
                firstIndexCode = splitArray[1]
                latestIndexCode = splitArray[2]
                console.log(firstIndexCode,latestIndexCode);
                const joinIndex = firstIndexCode + latestIndexCode
                console.log(joinIndex);
                console.log("bb");
                latesData = parseInt(joinIndex)
                newAlternatifCode = "A" + (latesData + 1)
                console.log(newAlternatifCode);
            } else {
                firstIndexCode = splitArray[1]
                middleIndexCode = splitArray[2]
                latestIndexCode = splitArray[3]

                const joinIndex = firstIndexCode + middleIndexCode + latestIndexCode
                
                latesData = parseInt(joinIndex)
                newAlternatifCode = "A" + (latesData + 1)
            }
        } else{
            newAlternatifCode = "A1"
        }
    }).catch(e => console.log(e))

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

        Kendaraan_Master.findOne({ where: { nama_alternatif: namaAlternatif } })
        .then(data => {
            const harga = data.harga

            Alternatif.findOne({ where: {keterangan: keterangan} })
            .then(result => {
                if (result) {
                    return res.status(409).send({
                        message: `Alternatif dengan keterangan ${keterangan} sudah tersedia`
                    })
                }
                return Alternatif.create({
                    kode_alternatif: newAlternatifCode,
                    nama_alternatif: namaAlternatif,
                    keterangan,
                    vikor_hasil,
                    moora_hasil,
                    vikor_harga: harga,
                    moora_harga: harga
                })
                .then(alternatif => {
                    Kriteria.findAll({
                        attributes: ['id','kode_kriteria'],
                        order: [
                            ['kode_kriteria', 'ASC']
                        ],
                    }).then(data => {
                        for (let i = 0; i < data.length; i++) {
                            Rel_Alternatif.bulkCreate([
                                { kode_alternatif: newAlternatifCode, kode_kriteria :`${data[i].kode_kriteria}`, id_subkriteria: 0},
                            ])
                        }
                    }).catch(er => console.log(er))
                    res.status(201).send({
                        alternatif
                    })
                })
                .catch(e => {
                    res.status(404).send({
                        // message: "FAILED TO CREATE ALTERNATIF",
                        message: "KETERANGAN ALTERNATIF WAJIB DIISI, HARAP MASUKKAN DENGAN BENAR!",
                        error: e.message
                    })
                })
            }).catch(e => {
                res.status(406).send({
                    msg: "FAILED, the information entered already exists",
                    err: e.message
                })
            })

        }).catch(e => {
            res.status(403).send({
                // message: "FAILED TO FIND KENDARAAN MASTER DATA",
                message: "HARAP PILIH SALAH SATU DARI NAMA ALTERNATIF YANG TERSEDIA!",
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
exports.getAlternatifByKode = async(req, res) => {
    const kodeAlternatif = req.params.kodeAlternatif

    await Alternatif.findOne({ where: { kode_alternatif: kodeAlternatif }})
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
    const kodeAlternatif = req.params.kodeAlternatif
    const { kode_alternatif, nama_alternatif, keterangan } = req.body
    console.log(kodeAlternatif);
    console.log(kode_alternatif, nama_alternatif, keterangan);

    await Alternatif.update({ kode_alternatif, nama_alternatif, keterangan }, {
        where: { 
            kode_alternatif: kodeAlternatif
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
    const kodeAlternatif = req.params.kodeAlternatif
    await Alternatif.destroy({ 
        where: { 
            kode_alternatif: kodeAlternatif 
        } 
    })
    .then(() => {
        Rel_Alternatif.findAll({
            where: {
                kode_alternatif: kodeAlternatif
            }
        })
        .then(() => {
            Rel_Alternatif.destroy({
                where: {
                    kode_alternatif: kodeAlternatif
                }
            })
        })
        res.status(200).json({
            data: kodeAlternatif,
            message: "Successfully deleted the alternative data",
        });
    })
    .catch(e => {
        res.status(503).json({
            message: "INTERNAL SERVER ERROR",
            error: e.message,
        });
    });
}