const User = require('../models/user')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render("users/register", {
        user: req.body,
        error: "usuário não encontrado"
    })

    const passed = await compare(password, user.password)

    if (!passed) return res.render('users/index', {
        user: req.body,
        error: "senha incorreta"
    })
    req.user = user
    next()
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await User.findOne({ where: { email } })
        if (!user) return res.render("session/login", {
            user: req.body,
            error: "Usuário não cadastrado"
        })
        req.user = user
        next()
    } catch (err) {
        console.erro(err)
    }


}

async function reset(req, res, next) {
    const { email, password, passwordRepeat, token } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: "Usuário não encontrado"
    })

    if (password != passwordRepeat) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'A senha e a repetição de senha estão incorretas.'
    })

    if (token != user.reset_token) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'token inválido!Solicite uma nova recupreção de senha.'
    })
    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expire) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Token expirou!Por favor, solicite uma nova recuperação de senha.'
    })

    req.user = user
    next()
}

module.exports = {
    login,
    forgot,
    reset
}