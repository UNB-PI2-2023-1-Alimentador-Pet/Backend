const { Pool } = require("pg");

const pool = new Pool({
    user: "miauadmin",
    database: "miaudb",
    password: "531miau",
    port: 5432,
    host: "localhost",
});

module.exports = { pool };