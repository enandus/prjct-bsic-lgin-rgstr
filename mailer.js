let nodemailer = require('nodemailer')
let secret = require('./config.json')

module.exports.mailingAgent = (email, message, username) => {
    // console.log(email)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: secret.email, // user Email
            pass: secret.password // user password
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"My Demo App" <config.email>', // sender address
        to: email, // list of receivers
        subject: `Hello ${username}`, // Subject line
        text: message, // plain text body
        html: `<b>${message}</b>`
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log(req.host)
        res.send('Message Sent...!')
    });
}
