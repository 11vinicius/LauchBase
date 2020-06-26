const { formatPrice, date } = require('../../lib/util')
const Order = require("../models/Order")
const User = require("../models/user")
const LoadProductsService = require('./LoadProductsService')


async function format(order) {
    
        order.product = await LoadProductsService.load('product',{
            where:{id:order.product_id}
        })

        order.buyer = await User.findOne({
            where:{id:order.buyer_id}
        })

        order.seller = await User.findOne({
            where:{id:order.seller_id}
        })

        order.formattedPrice = formatPrice(order.price)
        order.formatTotal = formatPrice(order.total)

        const statuses = {
            open:'Aberto',
            sold:'Vendido',
            canceled:'Cancelado'
        }

        order.formateedStatus = statuses[order.status]
        const updatedAt = date(order.updated_at)
        order.formattedUpdatedAt = `${order.formateedStatus} em ${updatedAt.day}/${updatedAt.month}/${updatedAt.year} as ${updatedAt.hour}h${updatedAt.minutes}`
        return order    
}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()

    },
    async order() {
        try {
            let order = await Order.findOne(this.filter)
            return format(order)
        } catch (error) {
            console.error(error)
        }
    },
    async orders() {
        try {
            let orders = await Order.findAll(this.filter)
            const orderPromise = orders.map(format)
            return Promise.all(orderPromise)
        } catch (error) {
            console.error(error)
        }
    },
    format,
   }

module.exports = LoadService