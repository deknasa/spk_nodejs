const Kriteria = require("../models/index").Kriteria
const Sub_Kriteria = require("../models/index").Sub_Kriteria
const Alternatif = require("../models/index").Alternatif
const Rel_Alternatif = require("../models/index").Rel_Alternatif

exports.getRelAlternatif = async (req, res) => {
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
                attributes: ['id', 'kode_kriteria', "bobot_kriteria"]
            },
            {
                model: Sub_Kriteria,
                as: "sub_kriteria",
                attributes: ['id', 'kode_kriteria', 'bobot_subkriteria']
            }
        ]
    })
    .then(data => {
        const transformedData = [];
        const kodeAlternatif = [];
        const namaAlternatif = [];
        const bobotKriteria = [];
        const alternatifs = [];
        const normalized = [];

        data.forEach((item) => {
            const existingObject = transformedData.find((obj) => obj.kode_alternatif === item.kode_alternatif);
            if (existingObject) {
                existingObject.kriteria.push({
                    id: item.kriteria.id,
                    kode_kriteria: item.kode_kriteria,
                    bobot_kriteria: item.kriteria.bobot_kriteria,
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
                        id_subkriteria: item.sub_kriteria.id,
                        bobot_subkriteria: item.sub_kriteria.bobot_subkriteria,
                    }],
                };
                transformedData.push(newObj);
            }
        });

        const indexedAlt = transformedData.map((item, index) => ({ item }));  
        indexedAlt.sort((a, b) => a.item.id - b.item.id);

        // ngambil data object terakhir dari transformedData dan diurutkan dari C1 utk simpan bobot kriterianya.
        const lates = indexedAlt[indexedAlt.length - 1]
        const indexed2 = lates.item.kriteria.map((item, index) => ({ index, value: item }));  
        indexed2.sort((a, b) => a.value.id - b.value.id);  
        indexed2.map(item => {
            bobotKriteria.push(item.value.bobot_kriteria)
        })  

        // looping transformedData dan diurutkan dari C1 utk membuat array 2D yg berisi data bobot subkriteria
        for (let i = 0; i < indexedAlt.length; i++) {
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

        // STEP 1: calculate the normalization matrix for each alternative and criteria
        for (let i = 0; i < bobotKriteria.length; i++) {
            const criterions = alternatifs.map(a => a[i]);
            const maximal = Math.max(...criterions)
            const minimal = Math.min(...criterions);
            const normalizedCriterion = criterions.map(value => (maximal - value ) / (maximal - minimal))
            normalized.push(normalizedCriterion)
        } 
 
        const resultNormalized = []
        for (let i = 0; i < alternatifs.length; i++) {
            const n = normalized.map((a, index) => Math.floor(a[i]*Math.pow(10, 4))/Math.pow(10, 4));
            resultNormalized.push(n)
        }

        // STEP 2 : Normalisasi Bobot
        const normalisasiBobot = normalized.map((criterions, index) => {
            const bobot = bobotKriteria[index];
            return criterions.map(value => bobot * value); 
        });

        // Ubah bentuk indeks normalisasi bobot untuk dapatin nilai R
        const resultNormalisasiBobot = []
        for (let i = 0; i < alternatifs.length; i++) {
            const n = normalisasiBobot.map((a, index) => a[i]);
            resultNormalisasiBobot.push(n)
        }

        // STEP 3 : Hitung nilai S (utility measure)
        const nilaiS = alternatifs.map((alt, index) => {
            const s_total = normalisasiBobot.reduce((acc, criterions) => acc + criterions[index], 0);
            return s_total
        });

        // STEP 4 : Hitung Nilai R (Regret Measure)
        const nilaiR = resultNormalisasiBobot.map(criterions => Math.max(...criterions));

        // Step 5: Calculate the Q values (Menghitung Nilai Index VIKOR)
        const Qvalue = alternatifs.map((alternatif, index) => {
            const v = 0.5
            const S_max = Math.max(...nilaiS)
            const S_min = Math.min(...nilaiS)
            const R_max = Math.max(...nilaiR);
            const R_min = Math.min(...nilaiR);
            const Q_value = Math.floor((( v*(nilaiS[index] - S_min) / (S_max - S_min)) + ( v*(nilaiR[index] - R_min) / (R_max - R_min)))*Math.pow(10, 4))/Math.pow(10, 4);
            return Q_value;
        });

        const hasil = []
        Qvalue.forEach((i => {  // convert from Q value to layak or tidak layak
            if (i <= 0.85) {hasil.push("layak")} else {hasil.push("tidak layak")}
        }))

        // Step 6: Rank alternatives based on Q values
        const rankedAlternatives = Qvalue.map((q, index) => ({ 
            alternative: `A${[index + 1]}`, 
            Q: q, 
            hasil: `${hasil[index]}`,
            nama_alternatif: namaAlternatif[index]
        }));
        rankedAlternatives.sort((a, b) => a.Q - b.Q);

        for (let i = 0; i < indexedAlt.length; i++) {
            const altSortByVikor = []
            const hasilSortByVikor = []
            for (let i = 0; i < rankedAlternatives.length; i++) {
                altSortByVikor.push(rankedAlternatives[i].alternative)
                hasilSortByVikor.push(rankedAlternatives[i].hasil)
            }
            Alternatif.findOne({
                order: [['kode_alternatif', 'ASC']],
                where: { kode_alternatif: kodeAlternatif[i] },
                attributes: ['kode_alternatif', 'nama_alternatif', 'vikor_total', 'vikor_rank', 'vikor_hasil', 'vikor_harga', 'hitung_harga'],
            })
            .then(dataa => {
                const saveHarga = []
                const hargaVikor = dataa.vikor_harga
                let hargaUpdated = dataa.hitung_harga
                const element = indexedAlt[i].item.kriteria;
                const idx = element.map((item, index) => ({ index, value: item }));
                idx.sort((a, b) => a.value.id - b.value.id);
                idx.map((item, number) => {
                    // if (number == 0 && item.value.bobot_subkriteria < 2) { 
                    //     hargaUpdated = Math.round(hargaUpdated - ((10/100)*hargaUpdated))
                    //     return hargaUpdated
                    // }
                    if (number == 0 && item.value.bobot_subkriteria < 2) { 
                        hargaUpdated = Math.round(hargaVikor - ((5/100)*hargaVikor))
                        return hargaUpdated
                    } else { hargaUpdated = hargaVikor - 0 }
                    if (number == 1 && item.value.bobot_subkriteria < 2) { 
                        hargaUpdated = Math.round(hargaVikor - ((5/100)*hargaVikor))       
                        return hargaUpdated
                    } else { hargaUpdated = hargaVikor - 0 }
                    if (number == 2 && item.value.bobot_subkriteria < 2) { 
                        hargaUpdated = Math.round(hargaVikor - ((5/100)*hargaVikor))
                        return hargaUpdated
                    } else { hargaUpdated = hargaVikor - 0 }
                    if (number == 3 && item.value.bobot_subkriteria < 2) { 
                        hargaUpdated = Math.round(hargaVikor - ((10/100)*hargaVikor))       
                        return hargaUpdated
                    } else { hargaUpdated = hargaVikor - 0 }
                    if (number == 4 && item.value.bobot_subkriteria < 2) { 
                        hargaUpdated = Math.round(hargaVikor - ((10/100)*hargaVikor))       
                        return hargaUpdated
                    } else { hargaUpdated = hargaVikor - 0 }
                    if (number == 5 && item.value.bobot_subkriteria <= 3) { 
                        hargaUpdated = Math.round(hargaVikor - ((15/100)*hargaVikor))       
                        return hargaUpdated
                    } else { return hargaUpdated = hargaVikor - 0 }
                })   
                saveHarga.push(hargaUpdated)

                Alternatif.update({ vikor_total: Qvalue[i], hitung_harga: saveHarga }, { 
                    where: { kode_alternatif: kodeAlternatif[i] },
                    returning: true
                }).then(() => {}).catch(er => console.log(er))
                Alternatif.update({ vikor_rank: i+1, vikor_hasil: hasilSortByVikor[i], }, {
                    where: { kode_alternatif: altSortByVikor[i] },
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
            resultNormalisasiBobot,
            nilaiS,
            nilaiR,
            Qvalue,
            rankedAlternatives,
            indexedAlt,
            transformedData
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
