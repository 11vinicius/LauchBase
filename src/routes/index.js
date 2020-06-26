const express = require('express')
const routes = express.Router()

const homeController = require('../app/controllers/homecontroller.js')
const cart = require('./cart')
const orders = require('./orders')


const users = require('./users')
const products = require('./products')

routes.get('/', homeController.index)

routes.use('/products', products)
routes.use('/users', users)
routes.use('/cart', cart)
routes.use('/orders',orders)



routes.get('/ads/create', function(req, res) {
    res.redirect('/products/create')
})

routes.get('/accounts', function(req, res) {
    res.redirect('/users/login')
})

module.exports = routes