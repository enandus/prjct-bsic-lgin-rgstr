let mongoose = require('mongoose')

module.exports.dbConnection = () => {
    let dbHost = 'localhost'
    let dbPort = '27017'
    let dbName = 'projectDB'

    mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, { useNewUrlParser: true }, (err, db) => {
        if (err) {
            console.log(err)
        }
        console.log('Database Server Connected')
    })
}


require('../models/users.Model')
require('../models/token.Model')