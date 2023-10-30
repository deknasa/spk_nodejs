const Pool = require('pg').Pool

const pool = new Pool({
    user : 'postgres',
    host : 'localhost',
    database : 'db_nodejs_spk',
    password : 'bolaliloq'
})

module.exports = pool