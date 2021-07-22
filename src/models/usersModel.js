const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
}, {
    timestamps: true
})
//hide pass and tokens
usersSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

//token
usersSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisthesecretkey', { expiresIn: '7d' })
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//login
usersSchema.statics.findByCredentials = async (email, pass) => {
    const user = await User.findOne({ email })
    if (!user)
        throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(pass, user.password)

    if (!isMatch)
        throw new Error('Unable to login')

    return user
}

//cookie-login
usersSchema.statics.findByCookie = async (token) => {
    const user = await User.findOne({ "tokens": { $elemMatch: { token: token.token } } })
    return user
}

//hash password
usersSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)

    next()
})

const User = mongoose.model('User', usersSchema)

module.exports = User

