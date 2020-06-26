const express = require('express')
const routes = express.Router()
const OrderController = require('../app/controllers/orderController')
const { onlyUsers } = require('../app/middleware/session')
const orderController = require('../app/controllers/orderController')


routes.post('/',onlyUsers, OrderController.post)
        .get('/',onlyUsers, OrderController.index)
        .get('/sales',onlyUsers,OrderController.sales)
        .get('/:id',onlyUsers,orderController.show)
        
      

module.exports = routes