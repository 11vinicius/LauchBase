const LoadProductsServise = require('../services/LoadProductsService')
const LoadOrdersServise = require('../services/LoadOrdersService')
const User = require('../models/user')
const Order = require('../models/Order')
const Cart = require('../../lib/cart')
const { update } = require('../models/Order')


const email = (seller, product, buyer)=>`
    <h2>Olá ${seller.name}</h2>
    <p>Você tem um novo pedido de compra do seu produto</p>
    <p>Produto:${product.name}</p>
    <p>Produto:${product.formattedPrice}</p>
    <p><br/><br/></p>
    <h3>Dados de comprador</h3>
    <p>${buyer.name}</p>
    <p>${buyer.email}</p>
    <p>${buyer.address}</p>
    <p>${buyer.cep}</p>
    <p><br/><br/></p>
    <p><strong>Entre em contato com comprador para finalizar a compra!</strong></p>
    <p><br/><br/></p>
    <p>Atenciosamente, Equipe Lauchstore.</p>
`

module.exports = {
    async index(req,res){
        const orders = await LoadOrdersServise.load('orders',{
            where:{buyer_id:req.session.userId}
        }) 
       
        return res.render("orders/index",{orders})
    },
    async sales(req,res){
        const sales = await LoadOrdersServise.load('orders',{
            where:{seller_id: req.session.userId}
        })
             
        return res.render("orders/sales",{sales})
    },
    async show(req,res){
        const order = await LoadOrdersServise.load('order',{
            where:{id: req.params.id}
        })
       
        return res.render('orders/details',{order})
    },
    async post(req, res) {
        try {
            const  cart = Cart.init(req.session.cart)
            
            const buyer_id = req.session.userId
            const filteredItems = cart.items.filter(item =>
                item.product.user_id != buyer_id
            )

            const createOdersPromise = filteredItems.map(async item =>{
               let { product, price:total, quantity } = item 
               const { price, id:product_id, user_id: seller_id } = product
               const status = "open"
               
               const order = await Order.create({
                   seller_id,
                   buyer_id,
                   product_id,
                   price,
                   total,
                   quantity,
                   status
               })

                product = await LoadProductsServise.load('product',{where:{
                    id:product_id
                }})
    
                const seller = await User.findOne({where:{id:seller_id}})
            
            
                const buyer = await User.findOne({where:{id:buyer_id}})
    
            
                await mailer.sendMail({
                    to: seller.email,
                    from:'novo pedido de compra',
                    html:email(seller, product, buyer)
                })
                return order
            })
            await Promise.all(createOdersPromise)
            delete req.session.cart
            Cart.init()

          return res.render('orders/success')

        } catch (error) {
            console.error(error)
            return res.render('orders/error')
        }
    },
    async update(req,res){
        try {

            const {id,action} = req.params

            const aceptedActions = ['close','cancel']

            if(!aceptedActions.includes(action))return res.send("can't do this action")
    
                const order = await Order.findOne({
                    where: {id}
                })

                if(order.status !='open')return res.send("can't do this action")
                
                const statuses = {
                    close:'sold',
                    cancel:'canceled'
                }

                order.status = statuses[action]

                await Order.update(id,{
                    status: order.status
                })

                return res.send('/orders/sales')
        } catch (error) {
            console.log(error)
        }
    }
}    