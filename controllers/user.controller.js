const User = require('../models/index').User
const bcrypt = require('bcrypt')
const {hashedPassword} = require('../helpers/bcrypt')
const { destroyToken } = require('../middleware/authentication')
const generateToken = require('../middleware/authentication').generateToken

// FUNC UNTUK BIKIN AKUN BARU ROLE AUTO USER KARNA ADMIN HANYA SATU AUTO SEND DARI SISTEM
exports.register = async (req, res) => {
    const { full_name, email, password } = req.body
    console.log(full_name, email);
    await User.findOne({
        where: {
            email: email,
        }
    })
    .then(user => {
        if (user) {
            return res.status(400).send({
                message: "Email Already Exist",
                error: "Use another email!"
            })
        }
        return User.create({
            full_name,
            email,  
            password,
            role: "admin",
        })
        .then(user => {
            res.status(201).send({
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt
                }
            })
        })
        .catch(e => {
            res.status(404).send({
                message: "FAILED TO REGISTER",
                error: e.message
            })
        })
    })
    .catch(e => {
        res.status(503).send({
            message: "INTERNAL SERVER ERROR",
            error: e.message
        })
    })
}

// FUNC UNTUK LOGIN AKUN
exports.login = async (req, res) => {
    const { email, password } = req.body
    await User.findOne({
        where: {
            email: email
        }
    })
    .then(user => {
        if (!user) {
            return res.status(400).send({
                message: "email is not registered, please register"
            })
        }
        const passwordValid = bcrypt.compareSync(password, user.password)
        if (!passwordValid) {
            return res.status(401).send({
                message: "password not match"
            })
        }
        const data = {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
        }
        const token = generateToken(data)
        res.status(200).send({
            email: email,
            token: token
        })
    })
    .catch(e => {
        res.status(503).send({
            message: "INTERNAL SERVER ERROR",
            error: e.message
        })
    })
}

exports.getUserById = async(req, res) => {
    const userId = req.params.userId

    await User.findOne({ where: {id: userId } })
    .then(user => {
        return res.status(200).json({ 
            user
        })
    })
    .catch(e => {
        console.log(e);
        res.status(503).send({
            message: "INTERNAL SERVER ERROR",
            error: e
        })
    })
}

exports.updateUser = async (req, res) => {
    const userId = req.params.userId
    const { full_name, email } = req.body
    
    await User.update({ full_name, email }, {
        where: {
            id: userId
        },
        returning: true
    })
    .then(user => {
        res.status(200).send({
            user: user,
        })
    })
    .catch(e => {
        res.status(503).send({
            message: "INTERNAL SERVER ERROR",
            error: e.message
        })
    })
}

exports.changePassword = async (req, res) => {
    const userId = req.params.userId
    const { oldPassword, newPassword, confirmPassword } = req.body

    await User.findOne({
        where: {
            id: userId
        }
    })
    .then(user => {
        if (!user) {
            return res.status(400).send({
                message: "email is not registered, please register"
            })
        }
        const hash = bcrypt.hashSync(oldPassword, bcrypt.genSaltSync(10))
        console.log(user.password);
        console.log(hash);
        const passwordValid = bcrypt.compareSync(oldPassword, user.password)
        console.log(passwordValid);
        if (!passwordValid) {
            return res.status(401).send({
                message: "Your old password is wrong"
            }) 
        }
        if (confirmPassword != newPassword) {
            return res.status(403).send({
                message: "Your confirm password is wrong"
            })
        }
        return User.update( {password: confirmPassword}, {
            where: { 
                id: userId 
            },
            individualHooks: true,
            returning: true
        })
        .then(result => {
            return res.status(200).send({
                new_password: result,
                message: `Your password has been successfully changed`
            })
        })
        .catch(e => {
            res.status(404).send({
                message: "fail to change password",
                err: e.message
            })
        })
    })
    .catch(e => {
        res.status(503).send({
            message: "INTERNAL SERVER ERROR",
            error: e.message
        })
    })
}

exports.logout = async(req, res) => {
    res.clearCookie("authentication");
    // res.redirect("/");
    res.status(200).json({
       msg: 'You have successfully logged out!'
    });
}

// exports.logout = async(req, res) => {
//     const userId = req.params.userId
//     // req.logout();
//     const data = {
//         id: userId
//     }
//     const token = destroyToken()
//     console.log(token);
//     res.clearCookie("authentication");
//     res.redirect("/");
//     res.status(200).json({
//        status: 'Bye!'
//     });
// }