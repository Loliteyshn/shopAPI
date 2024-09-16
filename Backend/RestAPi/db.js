const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'clothing_store',
    password: 'lolita19',
    port: 5432,
});

module.exports = pool;