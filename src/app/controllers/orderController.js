const LoadProductsServise = require('../services/LoadProductsService')
const User = require('../models/user')
const mailer =require('../../lib/mailer')
const { product } = require('../services/LoadProductsService')


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
    async post(req, res) {
        try {
          const product = await LoadProductsServise.load('product',{where:{
              id:req.body.id
          }})

          const seller = await User.findOne({where:{id:product.user_id}})
        
         
          const buyer = await User.findOne({where:{id:req.session.userId}})

         
          await mailer.sendMail({
              to: seller.email,
              from:'novo pedido de compra',
              html:email(seller, product, buyer)
          })
          return res.send('orders/success')

        } catch (error) {
            console.error(error)
            return res.send('orders/erro')
        }
    }

}