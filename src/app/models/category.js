const Base = require('./Base')

Base.init({ table: 'categories' })

module.exports = {
    ...Base,
}


// const db = require('../../config/db')

// module.exports = {
//     all(){
//        return  db.query(`SELECT * FROM categories`)
//     }
// }