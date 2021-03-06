const Product = require("../models/products")
const { formatPrice, date } = require('../../lib/util')



async function getImages(productId) {
    let files = await Product.files(productId)
    files = files.map(file => ({
        ...file,
        src: `/image/${file.path.replace("public","")}`
    }))
    return files
}

async function format(product) {
    const files = await getImages(product.id)

    product.img = files[0].src
    product.formattedOldprice = formatPrice(product.old_price)
    product.formattedPrice = formatPrice(product.price)

    const { day, hour, minutes, month } = date(product.updated_at)

    product.published = {
        day: `${day}/${month}`,
        hour: `${hour}h${minutes}`,
    }

    return product
}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()

    },
    async product() {
        try {
            const product = await Product.findOne(this.filter)
            return format(product)
        } catch (error) {
            console.error(error)
        }
    },
    async products() {
        try {
            const products = await Product.findAll(this.filter)
            const productPromise = products.map(format)
            return Promise.all(productPromise)
        } catch (error) {
            console.error(error)
        }
    },
    async productWithDelete(){
        try {
            let product = await Product.findOnewithDeleted(this.filter)
            return format(product)
        } catch (error) {
            console.log(error)
        }
    },
    format,
}

module.exports = LoadService