const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "0ab5fd1f9c9730",
        pass: "07dfa1cbf638f2"
    }
})