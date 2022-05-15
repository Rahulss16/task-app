const express = require('express')
const { check } = require('express-validator')
const router = express.Router()

const AuthController = require('../controllers/auth.controller')

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
    AuthController.signup
)

router.post(
    '/login',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a valid password').isLength({
            min: 8
        })
    ],
    AuthController.login
)

router.get(
    '/confirm/:confirmationCode',
    AuthController.verifyUser
)

module.exports = router