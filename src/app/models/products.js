const Base = require('./Base')
const db = require('../../config/db')
Base.init({ table: 'products' })

module.exports = {
    ...Base,
    async files(id) {
        const results = await db.query('SELECT * FROM files WHERE product_id = $1', [id])
        return results.rows
    },
    async search(params) {
        const { filter, caterory } = params

        let query = "",
            filterQuery = `WHERE`

        if (caterory) {
            filterQuery = `${filterQuery}]
                products.category_id = ${category} AND`
        }

        filterQuery = `${filterQuery}
            products.name ilike '%${filter}%'
            OR products.description ilike '%${filter}%'`



        query = `SELECT products.*,
            categories.name AS category_name
            FROM products LEFT JOIN categories ON (categories.id = products.category_id)
            ${filterQuery}`

        const results = await db.query(query)
        return results.rows[0]
    }
}