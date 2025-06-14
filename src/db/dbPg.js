
const pkg = require('pg');

const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: 'logistics',
    password: '99445753'
})

async function query(text, params) {
    const res = await pool.query(text, params);
    return res;
}

module.exports = { query };
