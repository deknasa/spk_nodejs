const Kriteria = require("../models/index").Kriteria
const Sub_Kriteria = require("../models/index").Sub_Kriteria
const Alternatif = require("../models/index").Alternatif
const Rel_Alternatif = require("../models/index").Rel_Alternatif

exports.mooraMethod = async (req, res) => {
    await Rel_Alternatif.findAll({
        attributes: ['kode_alternatif','kode_kriteria', 'id_subkriteria'],
        include: [
            { model: Alternatif, as: "alternatif", attributes: ['id', 'kode_alternatif', 'nama_alternatif'] },
            { model: Kriteria, as: "kriteria", attributes: ['id', 'kode_kriteria', "bobot_kriteria", "jenis_kriteria"] },
            { model: Sub_Kriteria, as: "sub_kriteria", attributes: ['id', 'kode_kriteria', 'bobot_subkriteria'] }
        ]
    }).then(data => {
        const transformedData = [];
        const kodeAlternatif = [];
        const namaAlternatif = [];
        const bobotKriteria = [];
        const jenisKriteria = [];
        const alternatifs = [];
        const normalized = [];

        data.forEach((item) => {
            const existingObject = transformedData.find((obj) => obj.kode_alternatif === item.kode_alternatif);

            if (existingObject) {
                existingObject.kriteria.push({
                    id: item.kriteria.id,
                    kode_kriteria: item.kode_kriteria,
                    bobot_kriteria: item.kriteria.bobot_kriteria,
                    jenis_kriteria: item.kriteria.jenis_kriteria,
                    id_subkriteria: item.sub_kriteria.id,
                    bobot_subkriteria: item.sub_kriteria.bobot_subkriteria,
                });
            } else {
                const newObj = {
                    id: item.alternatif.id,
                    kode_alternatif: item.kode_alternatif,
                    nama_alternatif: item.alternatif.nama_alternatif,
                    kriteria: [{
                        id: item.kriteria.id,
                        kode_kriteria: item.kode_kriteria,
                        bobot_kriteria: item.kriteria.bobot_kriteria,
                        jenis_kriteria: item.kriteria.jenis_kriteria,
                        id_subkriteria: item.sub_kriteria.id,
                        bobot_subkriteria: item.sub_kriteria.bobot_subkriteria,
                    }],
                };
                transformedData.push(newObj);
            }
        });
        
        const indexedAlt = transformedData.map((item, index) => ({ item }));  
        indexedAlt.sort((a, b) => a.item.id - b.item.id);

        const lates = indexedAlt[indexedAlt.length - 1]
        const indexed = lates.item.kriteria.map((item, index) => ({ index, value: item }));  
        indexed.sort((a, b) => a.value.id - b.value.id); 
        indexed.map(item => {
            bobotKriteria.push(item.value.bobot_kriteria)
            jenisKriteria.push(item.value.jenis_kriteria)
        })  
          
        // looping transformedData dan diurutkan dari C1 utk membuat array 2D yg berisi data bobot subkriteria
        for (let i = 0; i < transformedData.length; i++) {
            kodeAlternatif.push(indexedAlt[i].item.kode_alternatif)
            namaAlternatif.push(indexedAlt[i].item.nama_alternatif)
            const element = indexedAlt[i].item.kriteria;
            const idx = element.map((item, index) => ({ index, value: item }));
            idx.sort((a, b) => a.value.id - b.value.id);
            alternatifs[i] = []
            for (let j = 0; j < idx.length; j++) {
                const aa = idx[j].value.bobot_subkriteria;
                alternatifs[i][j] = aa
            }
        }

        // Step 1: Normalize the criteria values
        for (let i = 0; i < bobotKriteria.length; i++) {
            const criterions = alternatifs.map(a => a[i]);
            const divider = Math.sqrt(alternatifs.reduce((acc, criterions) => ((acc) + (criterions[i])**2), 0));
            const normalizedCriterion = criterions.map(value => value / divider);
            normalized.push(normalizedCriterion)
        }

        const resultNormalized = []
        for (let i = 0; i < alternatifs.length; i++) {
            const n = normalized.map((a, index) => Math.floor(a[i]*Math.pow(10, 4))/Math.pow(10, 4));
            resultNormalized.push(n)
        }

        // Step 2: Nilai Optimasi
        const Yi = normalized.map((criterions, index) => {
            const bobot = bobotKriteria[index];
            return criterions.map(value => bobot * value);
        });

        // penjumlahan dari nilai Optimasi untuk kriteria benefit
        const YiMax = alternatifs.map((alt, index) => {
            for (let i = 0; i < jenisKriteria.length; i++) {
                if (jenisKriteria[i] == "benefit") {
                    const max = Yi.reduce((acc, criterions) => acc + criterions[index], 0);
                    return max
                } else { return 0 }
            }
        });
        // console.log(YiMax);

        const YiMin = alternatifs.map((alt, index) => {
            for (let i = 0; i < jenisKriteria.length; i++) {
                if (jenisKriteria[i] == "cost") {
                    const min = Yi.reduce((acc, criterions) => acc + criterions[index], 0);
                    return min
                } else { return 0 }
            }
        });

        const YiFix = alternatifs.map((alt, index) => {
            const max = Math.floor(YiMax[index]*Math.pow(10, 4))/Math.pow(10, 4)
            const min = Math.floor(YiMin[index]*Math.pow(10, 4))/Math.pow(10, 4)
            return max - min
        });

        const hasil = []
        YiFix.forEach((i => {   // convert from Yi value to layak or tidak layak
            if (i >= 0.088) {hasil.push("layak")} else {hasil.push("tidak layak")}
        }))

        // Step 3: Rank alternatives based on Yi values
        const rankedAlternatives = YiFix.map((Yi, index) => ({ 
            alternative: `A${[index + 1]}`, 
            Yi_value: Yi, 
            hasil: hasil[index],
            nama_alternatif: namaAlternatif[index]
        }));
        rankedAlternatives.sort((a, b) => b.Yi_value - a.Yi_value);

        for (let i = 0; i < kodeAlternatif.length; i++) {
            const altSortByMoora = []
            const hasilSortByMoora = []
            for (let i = 0; i < rankedAlternatives.length; i++) {
                altSortByMoora.push(rankedAlternatives[i].alternative)
                hasilSortByMoora.push(rankedAlternatives[i].hasil)
            }
            Alternatif.findOne({
                order: [['kode_alternatif', 'ASC']],
                where: { kode_alternatif: kodeAlternatif[i] },
                attributes: ['kode_alternatif', 'nama_alternatif', 'moora_total', 'moora_rank', 'moora_hasil', 'moora_harga'],
            })
            .then(dataa => {
                const saveHarga = []
                const hargaMoora = dataa.moora_harga
                let hargaUpdated = dataa.hitung_harga
                const element = indexedAlt[i].item.kriteria;
                const idx = element.map((item, index) => ({ index, value: item }));
                idx.sort((a, b) => a.value.id - b.value.id);
                idx.map((item, number) => {
                    item.value.bobot_subkriteria
                    if (number == 0 && item.value.bobot_subkriteria < 2) { 
                        hargaUpdated = Math.round(hargaMoora - ((5/100)*hargaMoora))
                        return hargaUpdated
                    }
                    if (number == 1 && item.value.bobot_subkriteria < 2) { 
                        hargaUpdated = Math.round(hargaMoora - ((5/100)*hargaMoora))       
                        return hargaUpdated
                    }
                    if (number == 2 && item.value.bobot_subkriteria < 2) { 
                        hargaUpdated = Math.round(hargaMoora - ((5/100)*hargaMoora))
                        return hargaUpdated
                    }
                    if (number == 3 && item.value.bobot_subkriteria < 2) { 
                        hargaUpdated = Math.round(hargaMoora - ((10/100)*hargaMoora))       
                        return hargaUpdated
                    }
                    if (number == 4 && item.value.bobot_subkriteria < 2) { 
                        hargaUpdated = Math.round(hargaMoora - ((10/100)*hargaMoora))       
                        return hargaUpdated
                    } 
                    if (number == 5 && item.value.bobot_subkriteria < 2) { 
                        hargaUpdated = Math.round(hargaMoora - ((10/100)*hargaMoora))       
                        return hargaUpdated
                    }
                })
                saveHarga.push(hargaUpdated)

                Alternatif.update({ moora_total: YiFix[i], hitung_harga: saveHarga }, {
                    where: { kode_alternatif: kodeAlternatif[i] },
                    returning: true
                }).then(() => {}).catch(er => console.log(er))
                Alternatif.update({ moora_rank: i+1, moora_hasil: hasilSortByMoora[i] }, {
                    where: { kode_alternatif: altSortByMoora[i] },
                    returning: true
                }).then(() => {}).catch(er => console.log(er))
            }).catch(er => {
                res.status(403).send({ message: "FAILED TO FIND ALTERNATIF DATA", error: er.message })
                console.log(er);
            })
        }

        return res.status(200).send({
            alternatifs,
            resultNormalized,
            YiFix,
            rankedAlternatives,
            indexedAlt,
            transformedData
        })
    }).catch(e => {
        console.log(e);
        res.status(503).send({
            message: "INTERNAL SERVER ERROR",
            error: e.message
        })
    })
}
