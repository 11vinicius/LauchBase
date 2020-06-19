const express = require('express')
const routes = express.Router()
const searchController = require('../app/controllers/searchController')
const ProductController = require('../app/controllers/productController')
const multer = require('../app/middleware/multer')
const { onlyUsers } = require('../app/middleware/session')
const validator = require('../app/validators/product')


routes.get('/search', onlyUsers, searchController.index)
routes.get('/create', onlyUsers, ProductController.create)
routes.get('/:id/edit', onlyUsers, ProductController.edit)
routes.get('/:id', onlyUsers, ProductController.show)

routes.post('/', onlyUsers, multer.array("photos", 6), validator.post, ProductController.post)
routes.put('/edit', onlyUsers, multer.array("photos", 6), validator.put, ProductController.put)
routes.delete('/delete', ProductController.delete)

module.exports = routes