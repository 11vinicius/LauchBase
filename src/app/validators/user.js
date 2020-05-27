const User = require('../models/user')
const { compare } = require('bcryptjs')

function checAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: "Por favor preencha todos os campos."
            }
        }

    }
}

async function post(req, res, next) {

    const filAllfield = checAllFields(req.body)
    if (filAllfield) {
        return res.render("users/register", filAllfield)
    }

    let { email, cpf_cnpj, password, passwordRepeat } = req.body
    cpf_cnpj = cpf_cnpj.replace(/D/g, "")

    const user = await User.findOne({
        where: { email },
        or: { cpf_cnpj }
    })

    if (user) return res.render('users/register', {
        user: req.body,
        error: 'Usuário já cadastrado!'
    })

    if (password != passwordRepeat)
        return res.render('users/register', {
            error: "A senha não confere!",
            user: req.body
        })
    next()
}

async function show(req, res, next) {
    const { userId: id } = req.session
    const user = await User.findOne({ where: { id } })

    if (!user) return res.render("users/register", {
        error: "Usuário não encontrado"
    })
    req.user = user
    next()
}

async function update(req, res, next) {
    const filAllfields = checAllFields(req.body)
    if (filAllfields) {
        return res.render('users/index', filAllfields)
    }

    const { id, password } = req.body
    if (!password) return res.render('users/index', {
        user: req.body,
        error: "Coloque sua senha para atualizar seu cadastro."
    })

    const user = await User.findOne({ where: { id } })

    const passed = await compare(password, user.password)

    if (!passed) return res.render('users/index', {
        user: req.body,
        error: "Senha incorreta"
    })
    req.user = user
    next()
}

module.exports = {
    post,
    show,
    update
}