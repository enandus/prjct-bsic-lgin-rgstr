let mongoose = require('mongoose')
let userSchema = require('./users.Model')


const verifyAccountTokenSchema = mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: userSchema
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now(),
        expiresIn: '43200s'
    }
})

const verifyPasswordTokenSchema = mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: userSchema
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now(),
        expiresIn: '180s'
    }
})

const userLoginTokenSchema = mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: userSchema
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now(),
        expiresIn: '43200s'
    }
})

const verifyAccountTokenModel = mongoose.model('verifyAccountTokenStore', verifyAccountTokenSchema)

const verifyPasswordTokenModel = mongoose.model('verifyPasswordTokenStore', verifyPasswordTokenSchema)

const userLoginTokenModel = mongoose.model('userLoginTokenStore', userLoginTokenSchema)

module.exports = {
    verifyAccountTokenModel,
    verifyPasswordTokenModel,
    userLoginTokenModel
}