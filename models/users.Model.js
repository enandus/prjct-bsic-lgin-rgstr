let mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,   
        lowercase: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    privilage: {
        type: String,
        required: true,
        default: 'user',
        enum: ['admin', 'user']
    },
    profilePicture: {
        type: String
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    loginCount: {
        type: Number,
        required: true,
        default: 0
    }
},
{
    versionKey: false
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel