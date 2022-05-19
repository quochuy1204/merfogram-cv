const nodemailer = require('nodemailer')

const { MERFOGRAM_GMAIL, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, ACCESS_TOKEN } = process.env

// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     type: "SMTP",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//         user: MERFOGRAM_GMAIL,
//         pass: MERFOGRAM_GMAIL_PASSWORD
//     },
//     tls: {
//         // do not fail on invalid certs
//         rejectUnauthorized: false,
//     },
// })

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: MERFOGRAM_GMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN,
        expires: 3599,
    },
});

const sendMail = (to, url, text, title) => {
    const text2 = text.toLowerCase()

    const mailOptions = {
        from: MERFOGRAM_GMAIL,
        to: to,
        subject: `Merfogram - ${text2}`,
        html: `<div
        style="width: 600px; height: 500px;margin: auto;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">

        <div
            style="line-height: 2; letter-spacing: 0.5px; position: relative; padding: 10px 20px; width: 540px;min-height: 360px; margin: auto; border: 1px solid #DDD; border-radius: 14px;">
            <h3>Welcome to Merfogram - an awesome social network!</h3>
            <p>${title}
                <br>
                If you are not doing that action, please feel free to ignore this email. <br>
                Otherwise, click on the button below in order to ${text2}.
            </p>

            <a style="cursor: pointer;text-align: center; display: block; width: 160px; margin: 30px auto; padding: 10px 10px; border: 1px solid #DDD; border-radius: 14px; color: #262626; text-decoration: none; font-size: 1rem; font-weight: 500;"
                href="${url}">${text}</a>

            <span style="display: block;">If you have any problem, please contact via: <span
                    style="color: #4D96FF;">merfogram@gmail.com</span></span>
            <span style="display: block;">Thank you for your time!</span>
        </div>
    </div>`

    }

    transporter.verify((error, success) => {
        if (error) {
            console.log(error)
        } else {
            console.log("Server is ready to take our message.")
        }
    })

    transporter.sendMail(mailOptions, (error, infor) => {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent successfully. ')
        }
    })
}

module.exports = sendMail