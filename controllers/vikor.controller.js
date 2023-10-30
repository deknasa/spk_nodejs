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
                attributes: ['id', 'kode_alternatif']
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

        data.forEach((item) => {
            const existingObject = transformedData.find((obj) => obj.kode_alternatif === item.kode_alternatif);

            if (existingObject) {
                existingObject.kriteria.push({
                    kode_kriteria: item.kode_kriteria,
                    bobot_subkriteria: item.sub_kriteria.bobot_subkriteria,
                    id_subkriteria: item.sub_kriteria.id,
                });
            } else {
                const newObj = {
                    id_: item.id,
                    kode_alternatif: item.kode_alternatif,
                    kriteria: [
                        {
                            kode_kriteria: item.kode_kriteria,
                            bobot_subkriteria: item.sub_kriteria.bobot_subkriteria,
                            id_subkriteria: item.sub_kriteria.id,
                        },
                    ],
                };
                transformedData.push(newObj);
            }

            var alt = transformedData.map(function(val, index){
                // val.kriteria.map(i => {
                //     // console.log(i);
                    
                // })
                return [val.kode_alternatif, val.kriteria]
                // console.log(val);
                
            })
            console.log(alt);

            const criteriaWeights = [0.18, 0.15, 0.15, 0.17, 0.13, 0.19];
            // console.log(criterion);
            // const criteriaWeights = [item.kriteria.bobot_kriteria];
            // console.log(criteriaWeights);
            const alternatives = [
                [5, 5, 2, 5, 3, 2],
                [5, 2, 5, 3, 1, 5],
                [2, 2, 2, 1, 1, 2],
                [2, 2, 2, 1, 1, 2]
            ];
            // const alternatives = [item.kode_alternatif]
            // console.log(alternatives);
        
            // Step 1: Normalize the criteria values
            const normalizedCriteria = [];
            for (let i = 0; i < criteriaWeights.length; i++) {
                const criterion = alternatives.map(a => a[i]);
                // console.log(criterion);
                const min = Math.min(...criterion);
                const max = Math.max(...criterion);
                // console.log(max, min);
                const normalizedCriterion = criterion.map(value => (value - min) / (max - min));
                normalizedCriteria.push(normalizedCriterion);
                // console.log(normalizedCriterion);
            }
          
            // Step 2: Calculate the S and R values
            const S = normalizedCriteria.map((criterion, index) => {
                const weight = criteriaWeights[index];
                return criterion.map(value => weight * value);
            });
            // console.log(S);
        });
        return res.status(200).send({
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