let express = require('express')
let userController = require('../controllers/users.Controller')

const router = express.Router()

// POST /signup - to register a new user
router
    .route('/signup')
    .post(userController.createUser)

router
    .route('/verifyAccount')
    .get(userController.verifyAccount)

router
    .route('/login')
    .post(userController.loginUser)

router
    .route('/deleteUser/:username')
    .delete(userController.authenticateAdmin, userController.deleteUser)

router
    .route('/update/fullname/:username')
    .put(userController.updateFullName)

router
    .route('/logout/:username')
    .get(userController.logoutUser)

router 
    .route('/forgotPassword')
    .post(userController.forgotPassword)

router
    .route('/updatePassword')
    .get(userController.updatePassword)

router
    .route('/changePassword')
    .post(userController.changePassword)

router
    .route('/userLoginCounts/:username')
    .get(userController.userLoginCounts)

router
    .route('/noOfRegisteredUsers')
    .get(userController.noOfRegisteredUsers)
    
module.exports = router
