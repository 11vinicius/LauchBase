const { Pool } = require('pg')

module.exports = new Pool({
    user: "postgres",
    password: "vini",
    host: "localhost",
    port: 5432,
    database: "lauchstoredb"
})