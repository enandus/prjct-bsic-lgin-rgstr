let Users = require('../models/users.Model')
let Token = require('../models/token.Model')
let bcrypt = require('bcrypt-nodejs')
let crypto = require('crypto')
let jwt = require('jsonwebtoken')
let mailer = require('../mailer')

const salt = bcrypt.genSaltSync(12)

let message = ''
let port = '8080'
let host = 'localhost'
const secret = 'its a secret... keep it'

const userController = {}

userController.createUser = (req, res, next) => {
    let passowrdHash = bcrypt.hashSync(req.body.password, salt)
    Users.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            res.send(err)
        }
        if (user) {
            res.send('Username already exists!')
        }
        else {
            Users.create({
                fullName: req.body.fullname,
                username: req.body.username,
                email: req.body.email,
                password: passowrdHash,
                phoneNo: req.body.phoneNo,
                age: req.body.age,
                gender: req.body.gender,
                privilage: req.body.privilage
            }, (err, user) => {
                if (err) {
                    res
                        .status(401)
                        .json(err)
                }
                else {
                    Token.verifyAccountTokenModel.create({
                        _userId: user._id,
                        token: crypto.randomBytes(16).toString('hex')
                    }, (err, token) => {
                        if (err) {
                            res.send(err)
                        }
                        else {
                            token.save()
                            console.log(token.token)
                            link = "http://" + host + ':' + port + "/verifyAccount?id=" + token.token
                            message = 'Welcome to My Demo App, Thanks for registering! <br><br> Please verify your account by visiting this link: <br>' + link
                            mailer.mailingAgent(req.body.email, message, req.body.username)
                        }
                    })
                    res
                        .status(201)
                        .json({ msg: 'User Account Created!', user: user })
                }
            })
        }
    })
}

userController.verifyAccount = (req, res, next) => {
    if ((req.protocol + "://" + req.hostname + ':' + port) == ("http://" + host + ':' + port)) {
        console.log('Domain is matched!', req.query.id)
        Token.verifyAccountTokenModel.findOne({token: req.query.id}, (err, tokenData) => {
            console.log(tokenData)
            if(err) throw err
            if (!tokenData) {
                res.send('Token Expired!')
            }
            else {
                Users.findOne({_id: tokenData._userId}, (err, user) => {
                    if (err) throw err
                    user.isVerified = true
                    user.save((err) => {
                        if (err) throw err
                        else{ 
                            res.send('User account successfully verified!')
                        }
                    })
                })
            }
        })
    }    
}

userController.loginUser = (req, res, next) => {
    Users.findOne({username: req.body.username}, (err, user) => {
        if (!user) {
            res.send('Username doesn\'t Match!')
        }
        else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                let loginToken = jwt.sign({_id: user._id}, secret)
                Token.userLoginTokenModel.findOne({token: loginToken}, (err, token) =>{
                    // console.log(loginToken, token)
                    // do checck for duplicate tokenss
                    if (err) throw err
                    if (token) {
                        res.send('User already Logged In!')
                    }
                    else {
                        Token.userLoginTokenModel.create({
                            _userId: user._id,
                            token: loginToken
                        }, (err, token) => {
                            if (err) throw err
                            token.save()
                        })
                    }
                })
                console.log(user.loginCount)
                user.loginCount = user.loginCount + 1
                user.save()
                res.send('User Successfully Logged In!')
            }
            else {
                res.send('Password doesn\'t Match!')
            }
        }
    })
}

userController.authenticateAdmin = (req, res, next) => {
    
    let header = req.headers.authorization
    if(header) {
        let token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                res.send('You are not authenticated user and you do not have permission of this operation')
            }
            else {
                console.log(jwt.decode(token, secret)._id)
                // query not working..??
                Users.findOne({privilage: 'admin'}).where({_id: jwt.decode(token, secret)._id}).exec((err, user) => {
                    if (err) throw err
                    console.log(user)
                    next()
                })
            }
        })
    }
    else {
        res.send('Authorization Failed!')
    }
}

userController.deleteUser = (req, res) => {
    console.log(req.params)
    Users.findOne({username: req.params.username}, (err, user) => {
        if (err) {
            res.send('User doesn\'t Exists!')
        }
        else {
            console.log(user)
            Users.deleteOne({username: user.username}, (err, data) => {
                if (err) throw err
                res.send('User Account delete Successfully!')
            })
        }
    })
}

userController.updateFullName = (req, res, next) => {
    Users.findOne({username: req.params.username}, (err, user) => {
        if (err) {
            res.send('No such username exists!')
        }
        else {
            user.fullName = req.body.fullName
            user.save((err, data) => {
                if (err) throw err
                res.send('FullName of user successfully updated!')
            })
        }
    })
}

userController.logoutUser = (req, res, next) => {
    Users.findOne(req.params.username, (err, user) => {
        if (err) {
            res.send('User already logged out!')
        }
        else {
            Token.verifyAccountTokenModel.updateOne({_userId: user._id}, {token: null}, (err, data) => {
                if (err) throw err
                res.send('User Logged Out!')
            })
        }
    })
}

userController.forgotPassword = (req, res, next) => {
    Users.findOne({email: req.body.email}, (err, user) => {
        if (err) throw err
        Token.verifyPasswordTokenModel.create({
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
        }, (err, token) => {
            if (err) throw err
            token.save()
            link = `http://${host}:${port}/updatePassword?id=${token.token}`    
            message = 'Forgot your Password<br> Click on the following link to set a new password.<br> Forgot Password Link: <br>' + link
            mailer.mailingAgent(req.body.email, message, req.body.username)

            if ((req.protocol + "://" + req.hostname + ':' + port) == ("http://" + host + ':' + port)) {
                res.redirect('/updatePassword')
            }
            else {
                res.redirect('/login')
            }
        })
    })
}

userController.updatePassword = (req, res, next) => {
    if ((req.protocol + "://" + req.hostname + ':' + port) == ("http://" + host + ':' + port)) {
    Token.verifyPasswordTokenModel.findOne({token: req.query.id}, (err, token) => {
        console.log(token, req.query)
        if (err) {
            res.send('Token Expired!')
        }
        else {
            console.log(token)
            // res.redirect('/changePassword')
            res.send('Token Verified! Hit change password API now')
        }
    })
}
}

userController.changePassword = (req, res, next) => {
    console.log(req.body)
    Users.updateOne({password: req.body.newPassword}, {$set:{password: req.body.newPassword}}, (err, user) => {
        if (err) throw err
        else {
            res.send('New Password Updated succefully!')
        }
    })
}

userController.userLoginCounts = (req, res, next) => {
    Users.findOne({username: req.params.username}, (err, user) => {
        if (err) {
            res.send('Username doesn\'t Exists!')
        }
        else {
            res.send(`${user.fullName} has logged in ${user.loginCount} times.`)
        }
    })
}

userController.noOfRegisteredUsers = (req, res, next) => {
    Users.count({isVerified: true}, (err, userCount) => {
        if (err) throw err
        res.send('No. of registered users on your applications: ' + userCount)
    })
}

userController.noOfVisits = (req, res, next) => {
    // count no. of visits to main page
}

module.exports = userController
