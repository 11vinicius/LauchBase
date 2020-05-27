const User = require('../models/user')
const { formatCep, formatCpfCnpj } = require('../../lib/util')

module.exports = {
    registerForm(req, res) {
        res.render('users/register')
    },
    async show(req, res) {
        const { user } = req

        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)

        res.render('users/index', { user })
    },
    async post(req, res) {

        const userId = await User.create(req.body)
        req.session.userId = userId

        return res.redirect('/users')
    },
    async update(req, res) {
        try {
            const { user } = req
            let { name, email, cpf_cnpj, cep, address } = req.body
            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")

            await User.update(user.id, {
                name,
                email,
                cpf_cnpj,
                cep,
                address
            })

            return res.render('users/index', {
                success: "Usuário atualizado com sucesso."
            })

        } catch (err) {
            console.log(err)
            return res.render('users/index', {
                erro: "algum erro aconteceu!"
            })
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.body.id)
            req.session.destroy()
            return res.render('session/login', {
                success: "Conta deletada com sucesso!"
            })

        } catch (err) {
            console.error(err)

        }
    }
}