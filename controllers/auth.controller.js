const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const nodemailer = require('../config/nodemailer.config');
const jwt = require("jsonwebtoken");
const User = require('../model/User')

const signup = async (req, res) => {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(200).json({
            statusCode: 400,
            status: 'error',
            message: errors.array()[0].msg,
            data: {}
        })
    }

    const { name, phone, email, password, role } = req.body
    try {
        let userWithEmail = await User.findOne({
            email
        })
        let userWithPhoneNumber = await User.findOne({
            phone
        })
        if (userWithEmail || userWithPhoneNumber) {
            return res.status(200).json({
                statusCode: 409,
                status: 'error',
                message: 'User Already Exists',
                data: {}
            })
        }
        const confirmationCode = jwt.sign({ email: req.body.email }, 'bezkoder-secret-key')
        user = new User({
            name,
            phone,
            email,
            password,
            role,
            confirmationCode
        })

        await user.save()
        const token = await user.generateAuthToken()
        nodemailer.sendConfirmationEmail(
            user.name,
            user.email,
            user.confirmationCode
        );
        res.status(200).json({
            statusCode: 200,
            status: 'success',
            token,
            data: {
                user
            },
            message: 'Account Successfully Created.'
        })
    } catch (err) {
        console.log('catch', err.message)
        res.status(500).json({
            statusCode: 500,
            status: 'error',
            message: err.message,
            data: {}
        })
    }
}

const login = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(200).json({
            statusCode: 400,
            status: 'error',
            message: 'Invalid Password or email',
            data: {}
        })
    }

    const { email, password } = req.body
    try {
        let user = await User.findOne({
            email,
            status: 1
        })
        if (!user)
            return res.status(200).json({
                statusCode: 404,
                status: 'error',
                message: 'User not exists or not verified.',
                data: {}
            })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(200).json({
                statusCode: 404,
                status: 'error',
                message: 'Incorrect Password !',
                data: {}
            })

        const token = await user.generateAuthToken()
        res.status(200).json({
            status: 'success',
            token,
            data: user.getPublicProfile()
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            statusCode: 400,
            status: 'error',
            message: e.message,
            data: {}
        })
    }
}

const verifyUser = async (req, res) => {
    User.findOne({
        confirmationCode: req.params.confirmationCode,
    })
        .then((user) => {

            if (!user) {
                return res.status(200).json({
                    statusCode: 404,
                    status: 'error',
                    message: 'User not exists',
                    data: {}
                })
            }
            user.status = 1;
            user.save((err) => {
                if (err) {
                    res.status(500).json({
                        statusCode: 400,
                        status: 'error',
                        message: err,
                        data: {}
                    })
                }
            });
            res.status(200).json({
                status: 'success',
                data: user.getPublicProfile()
            })
        })
        .catch((e) => {
            console.error(e)
            res.status(500).json({
                statusCode: 400,
                status: 'error',
                message: e.message,
                data: {}
            })
        });
}

const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: 'Logout successfully!',
            data: {}
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            status: 'error',
            message: error.message,
            data: {}
        })
    }
}
module.exports = {
    signup: signup,
    login: login,
    logout: logout,
    verifyUser: verifyUser
}