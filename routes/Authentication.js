const express = require('express')
const mongoose = require('mongoose')
const moment = require('moment')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const router = express.Router()

const User = require('../model/User')
const { update } = require('../model/User')

/**
 * @param - Object
 * @method - POST
 */

router.post(
    '/signup',
    [
        check('name', 'Please Enter a Valid First Name')
            .not()
            .isEmpty(),
        check('phone', 'Please Enter a Valid Phone Number')
            .not()
            .isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a valid password').isLength({
            min: 8
        })
    ],
    async (req, res) => {
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

            user = new User({
                name,
                phone,
                email,
                password,
                role
            })

            await user.save()
            const token = await user.generateAuthToken()
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
)

router.post(
    '/login',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a valid password').isLength({
            min: 8
        })
    ],
    async (req, res) => {
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
                status: 0
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
)

module.exports = router