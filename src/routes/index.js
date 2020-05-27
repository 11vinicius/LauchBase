const express = require('express')
const routes = express.Router()
const multer = require('../app/middleware/multer')

const ProductController = require('../app/controllers/productController')
const homeController = require('../app/controllers/homecontroller.js')


const users = require('./users')
const products = require('./products')

routes.get('/', homeController.index)

routes.use('/users', users)
routes.use('/products', products)


routes.get('/ads/create', function(req, res) {
    res.redirect('/products/create')
})

routes.get('/accounts', function(req, res) {
    res.redirect('/users/login')
})

module.exports = routes