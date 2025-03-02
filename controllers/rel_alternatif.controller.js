const Kriteria = require("../models/index").Kriteria
const Sub_Kriteria = require("../models/index").Sub_Kriteria
const Alternatif = require("../models/index").Alternatif
const Rel_Alternatif = require("../models/index").Rel_Alternatif

exports.createRelAlternatif = async (req, res) => {
    const kode_alternatif = req.params.kode_alternatif
    const reqData = req.body
    const subkriteria = [req.body.subkriteria]

    // Kriteria.findAll({
    //     order: [ ['kode_kriteria', 'ASC'] ],
    //     attributes: ['id', 'kode_kriteria'],
    // }).then(data => {
    //     for (let i = 0; i < data.length; i++) {
    //         const element = data[i].kode_kriteria;
    //         console.log(element);
    //         try {
    //             Rel_Alternatif.findOne({
    //                 where: { kode_alternatif: kode_alternatif, kode_kriteria: data[i].kode_kriteria }
    //             }).then( data => {
    //                 data.id_subkriteria = reqData.subkriteria
    //                 data.save()
    //             }).catch(er => console.log(er))
    //         } catch (error) { console.log(error); }
    //     }
    // }).catch(e => console.log(e))

    try {
        // await Rel_Alternatif.findOne({  where: { kode_alternatif: kode_alternatif, kode_kriteria: reqData.kodeBPKB }
        // }).then( data => {
        //     data.id_subkriteria = subkriteria
        //     data.save()
        // }).catch(er => console.log(er))

        await Rel_Alternatif.findOne({
            where: { kode_alternatif: kode_alternatif, kode_kriteria: reqData.kodeBPKB }
        }).then( data => {
            data.id_subkriteria = reqData.subkriteria_bpkb
            data.save()
        }).catch(er => console.log(er))
    
        await Rel_Alternatif.findOne({
            where: { kode_alternatif: kode_alternatif, kode_kriteria: reqData.kodeSTNK }
        }).then( data => {
            data.id_subkriteria = reqData.subkriteriaStnk
            data.save()
        }).catch(er => console.log(er))
    
        await Rel_Alternatif.findOne({
            where: { kode_alternatif: kode_alternatif, kode_kriteria: reqData.kodePajak }
        }).then( data => {
            data.id_subkriteria = reqData.subkriteriaPajak
            data.save()
        }).catch(er => console.log(er))
    
        await Rel_Alternatif.findOne({
            where: { kode_alternatif: kode_alternatif, kode_kriteria: reqData.kodeKondisiBody }
        }).then( data => {
            data.id_subkriteria = reqData.subkriteriaKondisiBody
            data.save()
        }).catch(er => console.log(er))
    
        await Rel_Alternatif.findOne({
            where: { kode_alternatif: kode_alternatif, kode_kriteria: reqData.kodeKondisiMesin }
        }).then( data => {
            data.id_subkriteria = reqData.subkriteriaKondisiMesin
            data.save()
        }).catch(er => console.log(er))
    
        await Rel_Alternatif.findOne({
            where: { kode_alternatif: kode_alternatif, kode_kriteria: reqData.kodeTahunKeluaran }
        }).then( data => {
            data.id_subkriteria = reqData.subkriteriaTahunKeluaran
            data.save()
        }).catch(er => console.log(er))

        // UNCOMMENT WHEN EDIT PENILAIAN AFTER ADD NEW CRITERIA DATA
        // await Rel_Alternatif.findOne({
        //     where: { kode_alternatif: kode_alternatif, kode_kriteria: reqData.kodeKriteriaBaru }
        // }).then( data => {
        //     data.id_subkriteria = reqData.subkriteriaKriteriaBaru
        //     data.save()
        // }).catch(er => console.log(er))
    } catch (error) {
        console.log(error);
    }
    res.status(200).send({
        msg: "succesfully updated"
    })
}

const criteria_code = []
const displayedCriteria = []

// const dipslay = criteria_code.map((item, index) => {
//     displayedCriteria.push(
//         {kode_kriteria: `${item}`, nama_subkriteria: '0', id_subkriteria: 0}
//     )
//     return displayedCriteria
// })

const getCriteria = (data) => {  
    const criteria = [
        { kode_kriteria: 'C1', nama_subkriteria: '0', id_subkriteria: 0 },
        { kode_kriteria: 'C2', nama_subkriteria: '0', id_subkriteria: 0 },
        { kode_kriteria: 'C3', nama_subkriteria: '0', id_subkriteria: 0 },
        { kode_kriteria: 'C4', nama_subkriteria: '0', id_subkriteria: 0 },
        { kode_kriteria: 'C5', nama_subkriteria: '0', id_subkriteria: 0 },
        { kode_kriteria: 'C6', nama_subkriteria: '0', id_subkriteria: 0 },
        // UNCOMMENT when add NEW CRITERIA
        // { kode_kriteria: 'C7', nama_subkriteria: '0', id_subkriteria: 0 } 
        // { kode_kriteria: 'C8', nama_subkriteria: '0', id_subkriteria: 0 } 
    ]

    for(let i = 0; i < criteria.length; i++){
        const match = data.find(item => item.kode_kriteria === criteria[i].kode_kriteria);
        if (match) {
            criteria[i].nama_subkriteria = match.nama_subkriteria;
            criteria[i].id_subkriteria = match.id_subkriteria;
        }
    }    
    return criteria 
}

exports.getRelAlternatifIncludeAll = async (req, res) => {
    // Kriteria.findAll({
    //     attributes: ['id', 'kode_kriteria'],
    //     order: [
    //         ['id', 'ASC']
    //     ]
    // })
    // .then(result => { 
    //     result.map((item, index) => {
    //         criteria_code.push({
    //             kode_kriteria: `C${index+1}`,
                
    //         })
    //     })
    //     return criteria_code
    // }).catch(e => console.log(e))

    await Rel_Alternatif.findAll({
        attributes: ['kode_alternatif','kode_kriteria', 'id_subkriteria'],
        include: [
            {
                model: Alternatif,
                as: "alternatif",
                attributes: ['id', 'kode_alternatif', 'nama_alternatif']
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
        data.forEach((item) => {
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
                    id: item.alternatif.id,
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
        const indexed = transformedData.map((item, index) => ({ item }));  
        indexed.sort((a, b) => a.item.id - b.item.id); 

        const arr = new Array();
        
        for (let m = 0; m < indexed.length; m++) {
            const dataRes = {
                id: indexed[m].item.id,
                kode_alternatif: indexed[m].item.kode_alternatif,
                nama_alternatif: indexed[m].item.nama_alternatif,
                kriteria: getCriteria(indexed[m].item.kriteria)
            }
            arr.push(dataRes)
        }

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
