const mailer = require("nodemailer")

const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAUTH2",
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
});

const SendMail = (to, subject, html) => {
    let mailOptions = {
        to: to,
        subject: subject,
        html: html,
        from: {
            name: process.env.NAME,
            address: process.env.EMAIL
        },
        text: process.env.TEXT
    }

    transporter.sendMail(mailOptions, function(err, result) {
        if (err) console.log(err);
        console.log(result);
    });
}

module.exports = {
    SendMail
}