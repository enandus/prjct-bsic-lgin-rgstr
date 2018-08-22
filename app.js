let app = require('express')()
let bodyParser = require('body-parser')
let dbconnection = require('./db/config')
let users = require('./routes/user.Route')

// conneting to th mongodb server
dbconnection.dbConnection()

// for parsing the data send by the routes
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// accessing all routres from here
app.use('/', users)

// local server to start the application
app.listen(8080, () => console.log('Express Application Server Started....'))
