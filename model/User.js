const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const configValues = require('../config/auth.config')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: 1
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    avatar: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Number,
        trim: true,
        default: 0
    },
    confirmationCode: {
        type: String,
        unique: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

UserSchema.methods.getPublicProfile = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

UserSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, configValues.secret, {
        expiresIn: 8640000
    })
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//Hash the text password

UserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
    }

    next()
})

// export model user with UserSchema
module.exports = mongoose.model('User', UserSchema)
