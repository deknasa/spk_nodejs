const Kriteria = require("../models/index").Kriteria
const Sub_Kriteria = require("../models/index").Sub_Kriteria
const Alternatif = require("../models/index").Alternatif
const Rel_Alternatif = require("../models/index").Rel_Alternatif

exports.createRelAlternatif = async (req, res) => {
    const kode_alternatif = req.params.kode_alternatif
    const { id_subkriteria, id_subkriteriaSTNK, kode_kriteria } = req.body
    console.log( kode_alternatif, kode_kriteria, id_subkriteria); 

    const values = [
        { kode_kriteria: 'C1', id_subkriteria: id_subkriteria },
        { kode_kriteria: 'C2', id_subkriteria: id_subkriteria },
        // { kode_kriteria: 'C3', id_subkriteria: id_subkriteria },
        // { kode_kriteria: 'C4', id_subkriteria: id_subkriteria },
        // { kode_kriteria: 'C5', id_subkriteria: id_subkriteria },
        // { kode_kriteria: 'C6', id_subkriteria: id_subkriteria }
    ]

    await Rel_Alternatif.findAll({
        where: {
            kode_alternatif: kode_alternatif,
        }
    }) 
    .then(data => { 
        let id = []
        data.map(i => {
            id.push(i.id)
        })
        console.log(id);
        Rel_Alternatif.update(
            {id_subkriteria},
            // values,
            { 
                where: {
                    kode_alternatif: kode_alternatif,
                    kode_kriteria: "C1"
                },
                returning: true
            },
            // {
            //     // fields:["id_subkriteria"],
            //     updateOnDuplicate: [`${id_subkriteria}`,]
            // }
        )
        Rel_Alternatif.update( {id_subkriteria: id_subkriteriaSTNK }, { 
            where: {
                kode_alternatif: kode_alternatif,
                kode_kriteria: "C2"
            },
            returning: true
        })
        .then(result => {
            res.status(200).send({
                updated: result
            })
        })
        .catch(er => {
            res.status(400).send({
                msg: "fail update",
                error: er.message
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

const getCriteria = (data) => {
    const category = [
        { kode_kriteria: 'C1', nama_subkriteria: '0', id_subkriteria: 0 },
        { kode_kriteria: 'C2', nama_subkriteria: '0', id_subkriteria: 0 },
        { kode_kriteria: 'C3', nama_subkriteria: '0', id_subkriteria: 0 },
        { kode_kriteria: 'C4', nama_subkriteria: '0', id_subkriteria: 0 },
        { kode_kriteria: 'C5', nama_subkriteria: '0', id_subkriteria: 0 },
        { kode_kriteria: 'C6', nama_subkriteria: '0', id_subkriteria: 0 }
    ]
        
    for(let i = 0; i < category.length; i++){
        const match = data.find(item => item.kode_kriteria === category[i].kode_kriteria);
        if (match) {
            category[i].nama_subkriteria = match.nama_subkriteria;
            category[i].id_subkriteria = match.id_subkriteria;
        }
    }

    return category
}

exports.getRelAlternatifIncludeAll = async (req, res) => {
    await Rel_Alternatif.findAll({
        attributes: ['kode_alternatif','kode_kriteria', 'id_subkriteria'],
        include: [
            {
                model: Alternatif,
                as: "alternatif",
                attributes: ['kode_alternatif', 'nama_alternatif']
            },
            {
                model: Kriteria,
                as: "kriteria",
                attributes: ['kode_kriteria', "nama_kriteria"]
            },
            {
                model: Sub_Kriteria,
                as: "sub_kriteria",
                attributes: ['id', 'nama_subkriteria', 'kode_kriteria', 'bobot_subkriteria']
            }
        ]
    })
    .then(data => {
        const transformedData = new Array();
        console.log(transformedData);

        data.forEach((item) => {
            // console.log(item.kode_kriteria);
            const existingObject = transformedData.find((obj) => obj.kode_alternatif === item.kode_alternatif);

            let nama_subkriteria, id_subkriteria
            if (item.sub_kriteria == null) {
                nama_subkriteria = "0"
                id_subkriteria = 0
            }
            else{
                nama_subkriteria = item.sub_kriteria.nama_subkriteria
                id_subkriteria = item.sub_kriteria.id
            }
            if (existingObject) {
                existingObject.kriteria.push({
                    kode_kriteria: item.kode_kriteria,
                    nama_subkriteria: nama_subkriteria,
                    id_subkriteria: id_subkriteria,
                });
            } else {
                const newObj = {
                    id: item.id,
                    kode_alternatif: item.kode_alternatif,
                    nama_alternatif: item.alternatif.nama_alternatif,
                    kriteria: [
                        {
                        kode_kriteria: item.kode_kriteria,
                        nama_subkriteria: nama_subkriteria,
                        id_subkriteria: id_subkriteria,
                        },
                    ],
                };
                transformedData.push(newObj);
            }
        });
        const arr = new Array();
                
        for (let m = 0; m < transformedData.length; m++) {
            const dataRes = {
                kode_alternatif: transformedData[m].kode_alternatif,
                nama_alternatif: transformedData[m].nama_alternatif,
                kriteria: getCriteria(transformedData[m].kriteria)
            }
            arr.push(dataRes)
        }
        // console.log(transformedData);
        return res.status(200).send({
            arr
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

// exports.penilaian = async (req, res) => {
//     await Alternatif.findAll({
//         order: [
//             ['kode_alternatif', 'ASC']
//         ],
//         attributes: ['id', 'kode_alternatif', 'nama_alternatif'],
//         include: {
//             model: Rel_Alternatif,
//             as: "rel_alternatif",
//             attributes: ['id', 'kode_kriteria', 'kode_alternatif', 'id_subkriteria'],
//             order: [
//                 ['kode_kriteria', 'ASC']
//             ],
//         },
//     })
//     .then(data => {
//         console.log(data.rel_alternatif);
//         return Sub_Kriteria.findAll({
//             order: [
//                 ['id', 'ASC']
//             ],
//             attributes: ['id', 'nama_subkriteria', 'bobot_subkriteria']
//         })
//         .then(resp => {
//             const newData = [];
//             for (let i = 0; i < data.length; i++) {
//                 console.log(i);
//                 const criterion = resp.map(a => console.log(a));
//                 console.log(criterion);
//                 // const min = Math.min(...criterion);
//                 // const max = Math.max(...criterion);
//                 // const normalizedCriterion = criterion.map(value => (value - min) / (max - min));
//                 // newData.push(normalizedCriterion);
//                 // console.log(normalizedCriterion);
//             }
//             return res.status(200).send({
//                 data: data,
//                 // da: resp
//             })
//         })
//         // return res.status(200).send({
//         //     alternatif: data
//         // })
//     })
//     .catch(e => {
//         console.log(e);
//         res.status(503).send({
//             message: "INTERNAL SERVER ERROR",
//             error: e.message
//         })
//     })
// }