const express = require('express')
const routes = express.Router()
const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UsersController')
const userValidators = require('../app/validators/user')
const sessionValidator = require('../app/validators/session')
const OrderController = require('../app/controllers/orderController')
const { isLoggedRedirectToUsers, onlyUsers } = require('../app/middleware/session')

routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', sessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', sessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', sessionValidator.reset, SessionController.reset)

routes.get('/register', UserController.registerForm)
routes.post('/register', userValidators.post, UserController.post)

routes.get('/', onlyUsers, userValidators.show, UserController.show)
routes.put('/', userValidators.update, UserController.update)
routes.delete('/delete', UserController.delete)
routes.get('/ads', UserController.ads)

routes.post('/ordens', onlyUsers,OrderController.post)
routes.get('/ordens', (req,res)=>{
    res.render('orders/error')
})


module.exports = routes